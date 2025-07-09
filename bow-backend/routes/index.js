var express = require('express');
var router = express.Router();

const Story = require('../models/Story');
const Founder = require('../models/Founder');
const Event = require('../models/Event');

// API: Get all stories
router.get('/api/stories', async (req, res) => {
  try {
    const stories = await Story.find().sort({ date: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get all founders
router.get('/api/founders', async (req, res) => {
  try {
    const founders = await Founder.find();
    res.json(founders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get all events
router.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ message: 'Welcome to the BOW API!' });
});

module.exports = router;
