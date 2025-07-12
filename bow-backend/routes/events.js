const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Events API is working!' });
});

// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST register for an event
router.post('/:id/register', async (req, res) => {
  try {
    console.log('[Backend] Registration request received for event:', req.params.id);
    console.log('[Backend] Request body:', req.body);
    
    const { userId, userEmail, userName, phone, dietaryRestrictions, specialRequests } = req.body;
    
    // Validate required fields
    if (!userId || !userEmail || !userName || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if event exists and has capacity
    const event = await Event.findById(req.params.id);
    if (!event) {
      console.log('[Backend] Event not found:', req.params.id);
      return res.status(404).json({ message: 'Event not found' });
    }
    
    console.log('[Backend] Found event:', event.title);
    
    if (!event.isActive) {
      return res.status(400).json({ message: 'Event registration is closed' });
    }
    
    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      eventId: req.params.id,
      userId: userId
    });
    
    if (existingRegistration) {
      console.log('[Backend] User already registered');
      return res.status(400).json({ message: 'You are already registered for this event' });
    }
    
    // Check capacity
    const currentRegistrations = await Registration.countDocuments({ eventId: req.params.id });
    console.log('[Backend] Current registrations:', currentRegistrations, 'Capacity:', event.capacity);
    
    if (currentRegistrations >= event.capacity) {
      return res.status(400).json({ message: 'Event is at full capacity' });
    }
    
    // Generate ticket number
    const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    console.log('[Backend] Generated ticket number:', ticketNumber);
    
    // Create registration
    const registration = new Registration({
      eventId: req.params.id,
      userId: userId,
      userEmail: userEmail,
      userName: userName,
      phone: phone,
      dietaryRestrictions: dietaryRestrictions || '',
      specialRequests: specialRequests || '',
      ticketNumber: ticketNumber,
      registrationDate: new Date(),
      status: 'confirmed'
    });
    
    const savedRegistration = await registration.save();
    console.log('[Backend] Registration saved:', savedRegistration._id);
    
    // Update event registration count
    await Event.findByIdAndUpdate(req.params.id, {
      $inc: { registeredCount: 1 }
    });
    
    const result = {
      message: 'Registration successful!',
      ticketNumber: ticketNumber,
      registration: savedRegistration
    };
    
    console.log('[Backend] Registration successful, sending response');
    res.status(201).json(result);
    
  } catch (error) {
    console.error('[Backend] Registration error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// GET user's registrations
router.get('/user/:userId/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.params.userId })
      .populate('eventId')
      .sort({ registrationDate: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET registration by ticket number
router.get('/ticket/:ticketNumber', async (req, res) => {
  try {
    const registration = await Registration.findOne({ ticketNumber: req.params.ticketNumber })
      .populate('eventId');
    
    if (!registration) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 