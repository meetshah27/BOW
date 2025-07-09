const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String },
  category: { type: String },
  description: { type: String },
  featured: { type: Boolean, default: false }
});

module.exports = mongoose.model('Event', EventSchema); 