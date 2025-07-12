const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  opportunityId: {
    type: String,
    required: true
  },
  opportunityTitle: {
    type: String,
    required: true
  },
  opportunityCategory: {
    type: String,
    required: true,
    enum: ['Events', 'Education', 'Outreach', 'Technical']
  },
  applicantName: {
    type: String,
    required: true
  },
  applicantEmail: {
    type: String,
    required: true
  },
  applicantPhone: {
    type: String,
    required: true
  },
  applicantAge: {
    type: Number,
    required: true,
    min: 16
  },
  applicantAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  availability: {
    weekdays: {
      type: Boolean,
      default: false
    },
    weekends: {
      type: Boolean,
      default: false
    },
    evenings: {
      type: Boolean,
      default: false
    },
    flexible: {
      type: Boolean,
      default: false
    }
  },
  experience: {
    type: String,
    required: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  motivation: {
    type: String,
    required: true
  },
  timeCommitment: {
    type: String,
    required: true,
    enum: ['2-4 hours/week', '4-8 hours/week', '8+ hours/week', 'Flexible']
  },
  references: [{
    name: String,
    relationship: String,
    phone: String,
    email: String
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  backgroundCheck: {
    consent: {
      type: Boolean,
      default: false
    },
    completed: {
      type: Boolean,
      default: false
    },
    dateCompleted: Date
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected', 'active', 'inactive'],
    default: 'pending'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  reviewDate: Date,
  reviewNotes: String,
  assignedEvents: [{
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    eventTitle: String,
    role: String,
    date: Date
  }],
  totalHours: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for faster queries
volunteerSchema.index({ opportunityId: 1, applicantEmail: 1 }, { unique: true });
volunteerSchema.index({ status: 1 });
volunteerSchema.index({ opportunityCategory: 1 });

module.exports = mongoose.model('Volunteer', volunteerSchema); 