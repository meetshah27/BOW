const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  paymentIntentId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'usd'
  },
  donorEmail: {
    type: String,
    required: true
  },
  donorName: {
    type: String,
    required: true
  },
  donorId: {
    type: String,
    default: null // Optional: if user is logged in
  },
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'card'
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  frequency: {
    type: String,
    enum: ['one-time', 'monthly', 'yearly'],
    default: 'one-time'
  },
  metadata: {
    type: Map,
    of: String
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  receiptUrl: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
donationSchema.index({ paymentIntentId: 1 }, { unique: true });
donationSchema.index({ donorEmail: 1 });
donationSchema.index({ status: 1 });
donationSchema.index({ createdAt: -1 });

// Update the updatedAt field before saving
donationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Donation', donationSchema); 