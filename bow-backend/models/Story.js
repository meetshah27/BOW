const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  authorImage: { type: String },
  category: { type: String },
  image: { type: String },
  excerpt: { type: String },
  content: { type: String },
  date: { type: Date, default: Date.now },
  readTime: { type: String },
  tags: [{ type: String }],
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }
});

module.exports = mongoose.model('Story', StorySchema); 