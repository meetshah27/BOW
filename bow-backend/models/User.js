const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    default: null
  },
  lastName: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  photoURL: {
    type: String,
    default: null
  },
  password: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['member', 'admin', 'volunteer'],
    default: 'member'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastSignIn: {
    type: Date,
    default: Date.now
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

// Update the updatedAt field on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema); 