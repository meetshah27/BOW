const mongoose = require('mongoose');

const FounderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String },
  image: { type: String },
  social: {
    instagram: { type: String },
    facebook: { type: String },
    youtube: { type: String }
  }
});

module.exports = mongoose.model('Founder', FounderSchema); 