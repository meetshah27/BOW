const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  dietaryRestrictions: {
    type: String,
    default: ''
  },
  specialRequests: {
    type: String,
    default: ''
  },
  ticketNumber: {
    type: String,
    required: true,
    unique: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed'
  },
  checkedIn: {
    type: Boolean,
    default: false
  },
  checkInTime: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
  }
});

// Create index for faster queries
registrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });
registrationSchema.index({ ticketNumber: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema); 