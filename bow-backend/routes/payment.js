const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const Donation = require('../models-dynamodb/Donation');

// Initialize Stripe with error handling
let stripe;
try {
  stripe = Stripe(process.env.STRIPE_SECRET_KEY);
} catch (error) {
  console.error('Stripe initialization error:', error);
}

// POST /api/payment/create-payment-intent
router.post('/create-payment-intent', async (req, res) => {
  const { amount, currency = 'usd', metadata = {}, donorEmail, donorName, donorId, isRecurring = false, frequency = 'one-time' } = req.body;
  
  try {
    // Validate amount
    if (!amount || amount < 50) { // Minimum $0.50
      return res.status(400).json({ error: 'Invalid amount. Minimum donation is $0.50.' });
    }

    // Validate donor information
    if (!donorEmail || !donorName) {
      return res.status(400).json({ error: 'Donor email and name are required.' });
    }

    // Check if Stripe is configured
    if (!stripe) {
      return res.status(500).json({ error: 'Payment processing is not configured.' });
    }

    console.log('[Payment] Creating payment intent for amount:', amount, 'currency:', currency);

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in cents
      currency,
      metadata: {
        ...metadata,
        source: 'bow_donation',
        donorEmail,
        donorName,
        donorId: donorId || '',
        isRecurring: isRecurring.toString(),
        frequency,
        timestamp: new Date().toISOString()
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('[Payment] Payment intent created:', paymentIntent.id);

    // Don't create donation record here - wait for webhook to confirm payment success

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    console.error('[Payment] Error creating payment intent:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payment/confirm-payment
router.post('/confirm-payment', async (req, res) => {
  const { paymentIntentId } = req.body;
  
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Payment processing is not configured.' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Check if donation record exists (created by webhook)
      let donation = await Donation.findByPaymentIntentId(paymentIntentId);
      
      if (!donation) {
        // Webhook hasn't processed yet, create donation record here
        donation = await Donation.create({
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          donorEmail: paymentIntent.metadata.donorEmail,
          donorName: paymentIntent.metadata.donorName,
          donorId: paymentIntent.metadata.donorId || null,
          status: 'succeeded',
          isRecurring: paymentIntent.metadata.isRecurring === 'true',
          frequency: paymentIntent.metadata.frequency,
          metadata: paymentIntent.metadata,
          receiptUrl: paymentIntent.charges?.data[0]?.receipt_url || null
        });
        console.log('[Payment] Donation record created (webhook fallback):', paymentIntentId);
      } else {
        // Update existing donation record
        donation = await Donation.updateByPaymentIntentId(
          paymentIntentId,
          { 
            status: 'succeeded',
            receiptUrl: paymentIntent.charges?.data[0]?.receipt_url || null
          }
        );
        console.log('[Payment] Payment confirmed and donation updated:', paymentIntentId);
      }
      
      res.json({ 
        success: true, 
        amount: paymentIntent.amount,
        status: paymentIntent.status,
        donation: donation
      });
    } else {
      // Payment failed - don't create or update donation record
      // Let the webhook handle failed payments
      console.log('[Payment] Payment failed, no donation record created:', paymentIntentId);
      
      res.json({ 
        success: false, 
        status: paymentIntent.status 
      });
    }
  } catch (err) {
    console.error('[Payment] Error confirming payment:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payment/webhook - Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('[Webhook] Received event:', event.type);

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('[Webhook] Payment succeeded:', paymentIntent.id);
        
        // Create donation record only after successful payment
        const donation = await Donation.create({
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          donorEmail: paymentIntent.metadata.donorEmail,
          donorName: paymentIntent.metadata.donorName,
          donorId: paymentIntent.metadata.donorId || null,
          status: 'succeeded',
          isRecurring: paymentIntent.metadata.isRecurring === 'true',
          frequency: paymentIntent.metadata.frequency,
          metadata: paymentIntent.metadata,
          receiptUrl: paymentIntent.charges?.data[0]?.receipt_url || null
        });
        
        console.log('[Webhook] Donation record created:', donation.paymentIntentId);
        break;

      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        console.log('[Webhook] Payment failed:', failedPaymentIntent.id);
        
        // Don't create a donation record for failed payments
        // This prevents "pending" entries from appearing in admin panel
        break;

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('[Webhook] Error processing event:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/payment/status
router.get('/status', (req, res) => {
  const isConfigured = !!process.env.STRIPE_SECRET_KEY;
  res.json({ 
    configured: isConfigured,
    message: isConfigured ? 'Payment processing is ready' : 'Payment processing is not configured'
  });
});

// GET /api/payment/donations - Get all donations for admin panel
router.get('/donations', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (status) {
      query.status = status;
    }
    
    const result = await Donation.findAll({ page, limit, status });
    const { donations, pagination } = result;
    
    res.json({
      donations,
      pagination
    });
  } catch (err) {
    console.error('[Payment] Error fetching donations:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/payment/donations/stats - Get donation statistics
router.get('/donations/stats', async (req, res) => {
  try {
    const stats = await Donation.getStats();
    const { totalDonations, totalAmount, monthlyStats } = stats;
    
    res.json({
      totalDonations,
      totalAmount,
      monthlyStats
    });
  } catch (err) {
    console.error('[Payment] Error fetching donation stats:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/payment/donations/user/:userIdOrEmail - Get all donations for a user
router.get('/donations/user/:userIdOrEmail', async (req, res) => {
  try {
    const { userIdOrEmail } = req.params;
    let donations = [];
    // Try to find by donorId (userId)
    if (userIdOrEmail.includes('@')) {
      // Looks like an email
      donations = await Donation.findByDonorEmail(userIdOrEmail);
    } else {
      // Try to find by donorId
      const allDonations = await Donation.findAll({ limit: 1000 });
      donations = allDonations.donations.filter(d => d.donorId === userIdOrEmail);
    }
    res.json(donations);
  } catch (err) {
    console.error('[Payment] Error fetching user donations:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payment/donations/bulk-delete - Bulk delete multiple donations
router.post('/donations/bulk-delete', async (req, res) => {
  try {
    const { paymentIntentIds } = req.body;
    
    if (!paymentIntentIds || !Array.isArray(paymentIntentIds) || paymentIntentIds.length === 0) {
      return res.status(400).json({ error: 'Payment Intent IDs array is required and must not be empty' });
    }

    if (paymentIntentIds.length > 100) {
      return res.status(400).json({ error: 'Cannot delete more than 100 donations at once' });
    }

    const results = [];
    const errors = [];

    // Process each donation deletion
    for (const paymentIntentId of paymentIntentIds) {
      try {
        // Find the donation first
        const donation = await Donation.findByPaymentIntentId(paymentIntentId);
        if (!donation) {
          errors.push({ paymentIntentId, error: 'Donation not found' });
          continue;
        }

        // Delete the donation
        await Donation.deleteByPaymentIntentId(paymentIntentId);
        results.push({ paymentIntentId, success: true, deletedDonation: donation });
        
        console.log('[Payment] Donation deleted successfully:', paymentIntentId);
      } catch (error) {
        console.error('[Payment] Error deleting donation:', paymentIntentId, error);
        errors.push({ paymentIntentId, error: error.message });
      }
    }

    const successCount = results.length;
    const errorCount = errors.length;
    
    console.log(`[Payment] Bulk delete completed: ${successCount} successful, ${errorCount} failed`);
    
    res.json({ 
      success: true, 
      message: `Bulk delete completed: ${successCount} successful, ${errorCount} failed`,
      results,
      errors,
      summary: {
        total: paymentIntentIds.length,
        successful: successCount,
        failed: errorCount
      }
    });
  } catch (err) {
    console.error('[Payment] Error in bulk delete:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/payment/donations/:paymentIntentId - Delete a donation
router.delete('/donations/:paymentIntentId', async (req, res) => {
  const { paymentIntentId } = req.params;
  
  try {
    const donation = await Donation.findByPaymentIntentId(paymentIntentId);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    await Donation.deleteByPaymentIntentId(paymentIntentId);
    console.log('[Payment] Donation deleted:', paymentIntentId);
    res.json({ success: true, message: 'Donation deleted successfully', deletedDonation: donation });
  } catch (err) {
    console.error('[Payment] Error deleting donation:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 