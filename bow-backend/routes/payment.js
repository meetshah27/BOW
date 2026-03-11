const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Donation = require('../models-dynamodb/Donation');
const { EmailService } = require('../config/ses');
const { getSquareClient } = require('../config/square-client');

function toBigIntAmount(amount) {
  if (typeof amount === 'bigint') return amount;
  if (typeof amount === 'number') return BigInt(Math.trunc(amount));
  if (typeof amount === 'string' && amount.trim() !== '') return BigInt(amount);
  throw new Error('Invalid amount');
}

// POST /api/payment/create-payment - Square payment (replaces Stripe PaymentIntent flow)
router.post('/create-payment', async (req, res) => {
  const { sourceId, amount, currency = 'USD', donorEmail, donorName, donorId } = req.body;

  try {
    if (!sourceId) {
      return res.status(400).json({ error: 'Missing sourceId (Square token).' });
    }

    // Validate amount (cents)
    if (!amount || Number(amount) < 50) {
      return res.status(400).json({ error: 'Invalid amount. Minimum donation is $0.50.' });
    }

    if (!donorEmail || !donorName) {
      return res.status(400).json({ error: 'Donor email and name are required.' });
    }

    const client = getSquareClient();
    const idempotencyKey = crypto.randomUUID();

    const createRes = await client.payments.create({
      sourceId,
      idempotencyKey,
      amountMoney: {
        amount: toBigIntAmount(amount),
        currency: String(currency || 'USD').toUpperCase(),
      },
      autocomplete: true,
      buyerEmailAddress: donorEmail,
      note: `BOW donation from ${donorName}`,
      referenceId: `bow_donation_${Date.now()}`,
    });

    const payment = createRes.payment;
    if (!payment) {
      return res.status(500).json({ error: 'Payment was not created.' });
    }

    // Create donation record immediately (Square createPayment is synchronous)
    try {
      await Donation.create({
        paymentIntentId: payment.id, // keep field name for backward compatibility
        amount: Number(amount),
        currency: String(currency || 'USD').toLowerCase(),
        donorEmail,
        donorName,
        donorId: donorId || null,
        status: (payment.status || 'UNKNOWN').toLowerCase(),
        isRecurring: false,
        frequency: 'one-time',
        metadata: {
          source: 'bow_donation',
          provider: 'square',
          squarePaymentId: payment.id,
        },
        receiptUrl: payment.receiptUrl || null,
      });
    } catch (dbErr) {
      // Don't fail the payment response if DB write fails
      console.error('[Payment] Failed to persist donation record:', dbErr.message);
    }

    // Send receipt email (best-effort)
    try {
      const receiptData = {
        donorName,
        donorEmail,
        amount: Number(amount),
        frequency: 'one-time',
        paymentIntentId: payment.id,
        donationDate: new Date().toISOString(),
      };
      await EmailService.sendDonationReceipt(receiptData);
    } catch (emailErr) {
      console.error('[Payment] Failed to send donation receipt email:', emailErr.message);
    }

    return res.json({
      success: payment.status === 'COMPLETED',
      paymentId: payment.id,
      status: payment.status,
      receiptUrl: payment.receiptUrl || null,
    });
  } catch (err) {
    console.error('[Payment] Error creating Square payment:', err);
    return res.status(500).json({ error: err.message || 'Payment failed' });
  }
});

// POST /api/payment/confirm-payment (Square) - verify by paymentId
router.post('/confirm-payment', async (req, res) => {
  const { paymentIntentId, paymentId } = req.body;
  const id = paymentId || paymentIntentId;
  
  try {
    if (!id) {
      return res.status(400).json({ error: 'paymentId is required.' });
    }

    const client = getSquareClient();
    const getRes = await client.payments.get({ paymentId: id });
    const payment = getRes.payment;

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const succeeded = payment.status === 'COMPLETED';

    // Ensure a donation record exists for completed payments
    let donation = await Donation.findByPaymentIntentId(id);
    if (succeeded && !donation) {
      donation = await Donation.create({
        paymentIntentId: id,
        amount: Number(payment.amountMoney?.amount || 0n),
        currency: String(payment.amountMoney?.currency || 'USD').toLowerCase(),
        donorEmail: payment.buyerEmailAddress || '',
        donorName: '',
        donorId: null,
        status: 'completed',
        isRecurring: false,
        frequency: 'one-time',
        metadata: { provider: 'square', squarePaymentId: id },
        receiptUrl: payment.receiptUrl || null,
      });
    }

    return res.json({
      success: succeeded,
      status: payment.status,
      donation,
    });
  } catch (err) {
    console.error('[Payment] Error confirming payment:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payment/webhook - (Square webhook not implemented here)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  res.status(501).json({
    success: false,
    message:
      'Webhook endpoint is not configured for Square in this deployment. Payments are processed synchronously via /api/payment/create-payment.',
  });
});

// GET /api/payment/status
router.get('/status', (req, res) => {
  const isConfigured = !!process.env.SQUARE_ACCESS_TOKEN;
  res.json({ 
    configured: isConfigured,
    message: isConfigured ? 'Payment processing is ready' : 'Payment processing is not configured'
  });
});

// GET /api/payment/donations - Get all donations for admin panel
router.get('/donations', async (req, res) => {
  try {
    console.log('[GET /api/payment/donations] Fetching all donations');
    console.log('[GET /api/payment/donations] Donation model loaded:', !!Donation);
    
    if (!Donation) {
      console.log('[GET /api/payment/donations] Donation model not available');
      return res.status(500).json({ error: 'Donation model not available' });
    }
    
    const { page = 1, limit = 10, status } = req.query;
    
    const result = await Donation.findAll({ page, limit, status });
    const { donations, pagination } = result;
    
    console.log(`[GET /api/payment/donations] Found ${donations.length} donations`);
    
    if (donations.length === 0) {
      console.log('[GET /api/payment/donations] No donations found - returning empty array');
      return res.json({ donations: [], pagination });
    }
    
    res.json({
      donations,
      pagination
    });
  } catch (err) {
    console.error('[GET /api/payment/donations] Error fetching donations:', err);
    console.error('[GET /api/payment/donations] Error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      statusCode: err.$metadata?.httpStatusCode
    });
    res.status(500).json({ 
      error: 'Failed to fetch donations',
      message: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// GET /api/payment/donations/stats - Get donation statistics
router.get('/donations/stats', async (req, res) => {
  try {
    console.log('[GET /api/payment/donations/stats] Fetching donation statistics');
    console.log('[GET /api/payment/donations/stats] Donation model loaded:', !!Donation);
    
    if (!Donation) {
      console.log('[GET /api/payment/donations/stats] Donation model not available');
      return res.status(500).json({ error: 'Donation model not available' });
    }
    
    const stats = await Donation.getStats();
    const { totalDonations, totalAmount, monthlyStats } = stats;
    
    console.log('[GET /api/payment/donations/stats] Statistics retrieved successfully');
    
    res.json({
      totalDonations,
      totalAmount,
      monthlyStats
    });
  } catch (err) {
    console.error('[GET /api/payment/donations/stats] Error fetching donation stats:', err);
    console.error('[GET /api/payment/donations/stats] Error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      statusCode: err.$metadata?.httpStatusCode
    });
    res.status(500).json({ 
      error: 'Failed to fetch donation statistics',
      message: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// GET /api/payment/donations/user/:userIdOrEmail - Get all donations for a user
router.get('/donations/user/:userIdOrEmail', async (req, res) => {
  try {
    const { userIdOrEmail } = req.params;
    console.log('[GET /api/payment/donations/user/:userIdOrEmail] Fetching donations for:', userIdOrEmail);
    console.log('[GET /api/payment/donations/user/:userIdOrEmail] Donation model loaded:', !!Donation);
    
    if (!Donation) {
      console.log('[GET /api/payment/donations/user/:userIdOrEmail] Donation model not available');
      return res.status(500).json({ error: 'Donation model not available' });
    }
    
    let donations = [];
    // Try to find by donorId (userId)
    if (userIdOrEmail.includes('@')) {
      // Looks like an email
      console.log('[GET /api/payment/donations/user/:userIdOrEmail] Searching by email');
      donations = await Donation.findByDonorEmail(userIdOrEmail);
    } else {
      // Try to find by donorId
      console.log('[GET /api/payment/donations/user/:userIdOrEmail] Searching by userId');
      const allDonations = await Donation.findAll({ limit: 1000 });
      donations = allDonations.donations.filter(d => d.donorId === userIdOrEmail);
    }
    
    console.log(`[GET /api/payment/donations/user/:userIdOrEmail] Found ${donations.length} donations`);
    
    if (donations.length === 0) {
      console.log('[GET /api/payment/donations/user/:userIdOrEmail] No donations found - returning empty array');
      return res.json([]);
    }
    
    res.json(donations);
  } catch (err) {
    console.error('[GET /api/payment/donations/user/:userIdOrEmail] Error fetching user donations:', err);
    console.error('[GET /api/payment/donations/user/:userIdOrEmail] Error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      statusCode: err.$metadata?.httpStatusCode
    });
    res.status(500).json({ 
      error: 'Failed to fetch user donations',
      message: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
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