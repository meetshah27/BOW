const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const mongoose = require('mongoose');

// GET all registrations (for admin)
router.get('/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().populate('eventId', 'title');
    const result = registrations.map(r => ({
      ...r.toObject(),
      eventTitle: r.eventId?.title || r.eventId || '-'
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
    if (!userId) {
      console.error('[Backend] Missing userId');
      return res.status(400).json({ message: 'Missing userId' });
    }
    if (!userEmail) {
      console.error('[Backend] Missing userEmail');
      return res.status(400).json({ message: 'Missing userEmail' });
    }
    if (!userName) {
      console.error('[Backend] Missing userName');
      return res.status(400).json({ message: 'Missing userName' });
    }
    if (!phone) {
      console.error('[Backend] Missing phone');
      return res.status(400).json({ message: 'Missing phone' });
    }
    // Check if event exists and has capacity
    const event = await Event.findById(req.params.id);
    if (!event) {
      console.error('[Backend] Event not found:', req.params.id);
      return res.status(404).json({ message: 'Event not found' });
    }
    if (!event.isActive) {
      console.error('[Backend] Event is not active');
      return res.status(400).json({ message: 'Event registration is closed' });
    }
    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      eventId: new mongoose.Types.ObjectId(req.params.id),
      userId: userId
    });
    if (existingRegistration) {
      console.error('[Backend] User already registered');
      return res.status(400).json({ message: 'You are already registered for this event' });
    }
    // Check capacity
    const currentRegistrations = await Registration.countDocuments({ eventId: new mongoose.Types.ObjectId(req.params.id) });
    if (currentRegistrations >= event.capacity) {
      console.error('[Backend] Event is at full capacity');
      return res.status(400).json({ message: 'Event is at full capacity' });
    }
    // Generate ticket number
    const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    // Create registration
    const registration = new Registration({
      eventId: new mongoose.Types.ObjectId(req.params.id),
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
    // Update event registration count
    await Event.findByIdAndUpdate(req.params.id, { $inc: { registeredCount: 1 } });
    const result = {
      message: 'Registration successful!',
      ticketNumber: ticketNumber,
      registration: savedRegistration
    };
    res.status(201).json(result);
  } catch (error) {
    console.error('[Backend] Registration error:', error);
    res.status(500).json({ message: error.message || 'Registration failed. Please try again.' });
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

// GET all registrations for a specific event
router.get('/:id/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find({ eventId: new mongoose.Types.ObjectId(req.params.id) });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update registration check-in status
router.put('/registrations/:id/checkin', async (req, res) => {
  try {
    const { checkedIn, checkInTime } = req.body;
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { 
        checkedIn: checkedIn,
        checkInTime: checkInTime || new Date()
      },
      { new: true }
    );
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update registration status
router.put('/registrations/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new event
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      longDescription,
      date,
      time,
      location,
      address,
      category,
      image,
      capacity,
      price,
      organizer,
      contact,
      tags,
      featured,
      isActive,
      isLive
    } = req.body;

    // Validate required fields
    if (!title || !description || !date || !time || !location || !category || !capacity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const event = new Event({
      title,
      description,
      longDescription: longDescription || description, // Use description if longDescription not provided
      date,
      time,
      location,
      address: address || location, // Use location if address not provided
      category,
      image: image || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      capacity,
      price: typeof price === 'number' ? price : 0,
      organizer: organizer || 'Beats of Washington',
      contact: contact || {
        phone: '(206) 555-0123',
        email: 'events@beatsofwashington.org',
        website: 'https://beatsofwashington.org'
      },
      tags: tags || ['Event'],
      featured: featured || false,
      isActive: isActive !== undefined ? isActive : true,
      isLive: isLive !== undefined ? isLive : false
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('[Backend] Create event error:', error);
    res.status(500).json({ message: 'Failed to create event' });
  }
});

// PUT update an event
router.put('/:id', async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Event not found' });
    res.json(updated);
  } catch (error) {
    console.error('[Backend] Update event error:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
});

// DELETE an event
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error('[Backend] Delete event error:', error);
    res.status(500).json({ message: 'Failed to delete event' });
  }
});

module.exports = router; 