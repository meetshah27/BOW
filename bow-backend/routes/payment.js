const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const Donation = require('../models/Donation');

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

    // Create donation record in database
    const donation = new Donation({
      paymentIntentId: paymentIntent.id,
      amount: amount,
      currency: currency,
      donorEmail: donorEmail,
      donorName: donorName,
      donorId: donorId || null,
      status: 'pending',
      isRecurring: isRecurring,
      frequency: frequency,
      metadata: metadata
    });

    await donation.save();
    console.log('[Payment] Donation record created:', donation._id);

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
      // Update donation record in database
      const donation = await Donation.findOneAndUpdate(
        { paymentIntentId: paymentIntentId },
        { 
          status: 'succeeded',
          receiptUrl: paymentIntent.charges?.data[0]?.receipt_url || null,
          updatedAt: new Date()
        },
        { new: true }
      );

      console.log('[Payment] Payment confirmed and donation updated:', paymentIntentId);
      
      res.json({ 
        success: true, 
        amount: paymentIntent.amount,
        status: paymentIntent.status,
        donation: donation
      });
    } else {
      // Update donation status to failed
      await Donation.findOneAndUpdate(
        { paymentIntentId: paymentIntentId },
        { 
          status: paymentIntent.status,
          updatedAt: new Date()
        }
      );

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
    
    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Donation.countDocuments(query);
    
    res.json({
      donations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('[Payment] Error fetching donations:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/payment/donations/stats - Get donation statistics
router.get('/donations/stats', async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments({ status: 'succeeded' });
    const totalAmount = await Donation.aggregate([
      { $match: { status: 'succeeded' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const monthlyStats = await Donation.aggregate([
      { $match: { status: 'succeeded' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          amount: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);
    
    res.json({
      totalDonations,
      totalAmount: totalAmount[0]?.total || 0,
      monthlyStats
    });
  } catch (err) {
    console.error('[Payment] Error fetching donation stats:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 