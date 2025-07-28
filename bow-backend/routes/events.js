const express = require('express');
const router = express.Router();
const verifyCognito = require('../middleware/verifyCognito');
const syncUserToDynamoDB = require('../middleware/syncUserToDynamoDB');

// Try to use DynamoDB models, fallback to sample data if not available
let Event, Registration;
try {
  Event = require('../models-dynamodb/Event');
  Registration = require('../models-dynamodb/Registration');
  console.log('✅ Using DynamoDB Event and Registration models');
} catch (error) {
  console.log('⚠️  DynamoDB models not available, using fallback mode');
  Event = null;
  Registration = null;
}

// Sample event data for fallback
const sampleEvents = [
  {
    id: 'event_1',
    title: 'Annual Cultural Festival',
    description: 'Join us for our biggest celebration of the year',
    longDescription: 'Experience the rich cultural diversity of our community through music, dance, food, and art. This annual festival brings together people from all backgrounds to celebrate our shared humanity.',
    date: '2024-08-15',
    time: '2:00 PM - 8:00 PM',
    location: 'Seattle Center',
    address: '305 Harrison St, Seattle, WA 98109',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    capacity: 500,
    price: 25,
    organizer: 'Beats of Washington',
    contact: {
      phone: '(206) 555-0123',
      email: 'events@bow.org'
    },
    tags: ['cultural', 'festival', 'music', 'dance'],
    featured: true,
    isActive: true,
    isLive: false,
    registeredCount: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: 'event_2',
    title: 'Community Workshop Series',
    description: 'Learn new skills and connect with neighbors',
    longDescription: 'Our monthly workshop series offers hands-on learning opportunities in various topics including cooking, crafts, technology, and wellness. All skill levels welcome.',
    date: '2024-07-20',
    time: '10:00 AM - 12:00 PM',
    location: 'Community Center',
    address: '123 Main St, Seattle, WA 98101',
    category: 'Educational',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    capacity: 30,
    price: 0,
    organizer: 'Beats of Washington',
    contact: {
      phone: '(206) 555-0123',
      email: 'workshops@bow.org'
    },
    tags: ['workshop', 'learning', 'community'],
    featured: false,
    isActive: true,
    isLive: false,
    registeredCount: 1,
    createdAt: new Date().toISOString()
  }
];

// Sample registration data for fallback
const sampleRegistrations = [
  {
    id: 'reg_1',
    eventId: 'event_1',
    userId: 'sample_user_1',
    userEmail: 'admin@bow.org',
    userName: 'Admin User',
    phone: '(206) 555-0001',
    dietaryRestrictions: '',
    specialRequests: '',
    ticketNumber: 'TKT-20240712-ABC123',
    registrationDate: new Date().toISOString(),
    status: 'confirmed',
    checkedIn: false,
    checkInTime: null
  },
  {
    id: 'reg_2',
    eventId: 'event_2',
    userId: 'sample_user_2',
    userEmail: 'jane@example.com',
    userName: 'Jane Smith',
    phone: '(206) 555-0002',
    dietaryRestrictions: 'Vegetarian',
    specialRequests: '',
    ticketNumber: 'TKT-20240712-DEF456',
    registrationDate: new Date().toISOString(),
    status: 'pending',
    checkedIn: false,
    checkInTime: null
  },
  {
    id: 'reg_3',
    eventId: 'event_1',
    userId: 'sample_user_3',
    userEmail: 'bob@example.com',
    userName: 'Bob Wilson',
    phone: '(206) 555-0003',
    dietaryRestrictions: '',
    specialRequests: 'Wheelchair accessible seating',
    ticketNumber: 'TKT-20240712-GHI789',
    registrationDate: new Date().toISOString(),
    status: 'confirmed',
    checkedIn: true,
    checkInTime: new Date().toISOString()
  }
];

// GET all registrations (for admin)
router.get('/registrations', async (req, res) => {
  try {
    if (Registration && Event) {
      const registrations = await Registration.findAll();
      const events = await Event.findAll();
      
      // Create a map of eventId to event title for quick lookup
      const eventMap = {};
      events.forEach(event => {
        eventMap[event.id || event._id] = event.title;
      });
      
      const result = registrations.map(r => ({
        ...r,
        eventTitle: eventMap[r.eventId] || 'Unknown Event'
      }));
      res.json(result);
    } else {
      // Fallback to sample data
      const result = sampleRegistrations.map(r => ({
        ...r,
        eventTitle: sampleEvents.find(e => e.id === r.eventId)?.title || 'Unknown Event'
      }));
      res.json(result);
    }
  } catch (error) {
    console.error('Error fetching registrations:', error);
    // Fallback to sample data
    const result = sampleRegistrations.map(r => ({
      ...r,
      eventTitle: sampleEvents.find(e => e.id === r.eventId)?.title || 'Unknown Event'
    }));
    res.json(result);
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Events API is working!' });
});

// Test endpoint to check registration count
router.get('/:id/registration-count', async (req, res) => {
  try {
    if (Event && Registration) {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      const actualCount = await Registration.getEventRegistrationCount(req.params.id);
      
      res.json({
        eventId: req.params.id,
        eventRegisteredCount: event.registeredCount,
        actualRegistrationCount: actualCount,
        match: event.registeredCount === actualCount
      });
    } else {
      res.json({ message: 'DynamoDB models not available' });
    }
  } catch (error) {
    console.error('Error checking registration count:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint to reset registration count
router.post('/:id/reset-registration-count', async (req, res) => {
  try {
    if (Event && Registration) {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      const actualCount = await Registration.getEventRegistrationCount(req.params.id);
      await event.update({ registeredCount: actualCount });
      
      res.json({
        message: 'Registration count reset successfully',
        eventId: req.params.id,
        newCount: actualCount
      });
    } else {
      res.json({ message: 'DynamoDB models not available' });
    }
  } catch (error) {
    console.error('Error resetting registration count:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET all events
router.get('/', async (req, res) => {
  try {
    if (Event && Registration) {
      const events = await Event.findAll();
      
      // Sync registration counts for all events
      for (const event of events) {
        const actualCount = await Registration.getEventRegistrationCount(event.id);
        if (event.registeredCount !== actualCount) {
          console.log(`[Backend] Syncing registration count for event ${event.id}: ${event.registeredCount} -> ${actualCount}`);
          await event.update({ registeredCount: actualCount });
        }
      }
      
      // Fetch events again after sync
      const updatedEvents = await Event.findAll();
      res.json(updatedEvents);
    } else if (Event) {
      const events = await Event.findAll();
      res.json(events);
    } else {
      // Fallback to sample data
      res.json(sampleEvents);
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    // Fallback to sample data
    res.json(sampleEvents);
  }
});

// GET single event by ID
router.get('/:id', async (req, res) => {
  try {
    if (Event && Registration) {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Sync registration count for this event
      const actualCount = await Registration.getEventRegistrationCount(req.params.id);
      if (event.registeredCount !== actualCount) {
        console.log(`[Backend] Syncing registration count for event ${event.id}: ${event.registeredCount} -> ${actualCount}`);
        await event.update({ registeredCount: actualCount });
      }
      
      console.log('[Backend] Returning event data:', { id: event.id, registeredCount: event.registeredCount });
      res.json(event);
    } else if (Event) {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      console.log('[Backend] Returning event data:', { id: event.id, registeredCount: event.registeredCount });
      res.json(event);
    } else {
      // Fallback to sample data
      const event = sampleEvents.find(e => e.id === req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json(event);
    }
  } catch (error) {
    console.error('Error fetching event:', error);
    // Fallback to sample data
    const event = sampleEvents.find(e => e.id === req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
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

    if (Event && Registration) {
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
      const existingRegistration = await Registration.findByEventAndUser(req.params.id, userId);
      if (existingRegistration) {
        console.error('[Backend] User already registered');
        return res.status(200).json({
          message: 'You are already registered for this event',
          registration: existingRegistration
        });
      }

      // Check capacity
      const currentRegistrations = await Registration.getEventRegistrationCount(req.params.id);
      if (currentRegistrations >= event.capacity) {
        console.error('[Backend] Event is at full capacity');
        return res.status(400).json({ message: 'Event is at full capacity' });
      }

      // Generate ticket number
      const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Create registration
      const registrationData = {
        eventId: req.params.id,
        userId: userId,
        userEmail: userEmail,
        userName: userName,
        phone: phone,
        dietaryRestrictions: dietaryRestrictions || '',
        specialRequests: specialRequests || '',
        ticketNumber: ticketNumber,
        registrationDate: new Date().toISOString(),
        status: 'confirmed'
      };

      const savedRegistration = await Registration.create(registrationData);

      // Get the actual registration count and update the event
      const actualCount = await Registration.getEventRegistrationCount(req.params.id);
      console.log('[Backend] Actual registration count:', actualCount);
      
      // Update event registration count to match actual count
      await event.update({ registeredCount: actualCount });
      console.log('[Backend] Updated event registeredCount to:', actualCount);

      const result = {
        message: 'Registration successful!',
        ticketNumber: ticketNumber,
        registration: savedRegistration
      };
      res.status(201).json(result);
    } else {
      // Fallback demo registration
      const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const demoRegistration = {
        id: `demo_reg_${Date.now()}`,
        eventId: req.params.id,
        userId: userId,
        userEmail: userEmail,
        userName: userName,
        phone: phone,
        dietaryRestrictions: dietaryRestrictions || '',
        specialRequests: specialRequests || '',
        ticketNumber: ticketNumber,
        registrationDate: new Date().toISOString(),
        status: 'confirmed'
      };

      // Add the new registration to sample registrations
      sampleRegistrations.push(demoRegistration);
      
      // Update sample event registration count
      const sampleEvent = sampleEvents.find(e => e.id === req.params.id);
      if (sampleEvent) {
        // Count actual registrations for this event
        const actualRegistrations = sampleRegistrations.filter(r => r.eventId === req.params.id);
        sampleEvent.registeredCount = actualRegistrations.length;
        console.log('[Backend] Updated sample event registeredCount to:', sampleEvent.registeredCount);
      }

      const result = {
        message: 'Registration successful! (demo mode)',
        ticketNumber: ticketNumber,
        registration: demoRegistration
      };
      res.status(201).json(result);
    }
  } catch (error) {
    console.error('[Backend] Registration error:', error);
    res.status(500).json({ message: error.message || 'Registration failed. Please try again.' });
  }
});

// GET user's registrations
router.get('/user/:userId/registrations', async (req, res) => {
  try {
    if (Registration && Event) {
      const registrations = await Registration.findByUser(req.params.userId);
      // Fetch all events in one go for efficiency
      const allEvents = await Event.findAll();
      // Map eventId to event details
      const eventMap = {};
      allEvents.forEach(e => {
        eventMap[e.id || e._id] = e;
      });
      // Attach event details to each registration
      const result = registrations.map(r => {
        const event = eventMap[r.eventId];
        return {
          ...r,
          eventTitle: event ? event.title : undefined,
          date: event ? event.date : undefined,
          location: event ? event.location : undefined
        };
      });
      res.json(result);
    } else {
      // Fallback to sample data
      const userRegistrations = sampleRegistrations.filter(r => r.userId === req.params.userId);
      const result = userRegistrations.map(r => {
        const event = sampleEvents.find(e => e.id === r.eventId);
        return {
          ...r,
          eventTitle: event ? event.title : undefined,
          date: event ? event.date : undefined,
          location: event ? event.location : undefined
        };
      });
      res.json(result);
    }
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    // Fallback to sample data
    const userRegistrations = sampleRegistrations.filter(r => r.userId === req.params.userId);
    const result = userRegistrations.map(r => {
      const event = sampleEvents.find(e => e.id === r.eventId);
      return {
        ...r,
        eventTitle: event ? event.title : undefined,
        date: event ? event.date : undefined,
        location: event ? event.location : undefined
      };
    });
    res.json(result);
  }
});

// GET registration by ticket number
router.get('/ticket/:ticketNumber', async (req, res) => {
  try {
    if (Registration) {
      const registration = await Registration.findByTicketNumber(req.params.ticketNumber);
      
      if (!registration) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      
      res.json(registration);
    } else {
      // Fallback to sample data
      const registration = sampleRegistrations.find(r => r.ticketNumber === req.params.ticketNumber);
      
      if (!registration) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      
      res.json(registration);
    }
  } catch (error) {
    console.error('Error fetching registration by ticket:', error);
    // Fallback to sample data
    const registration = sampleRegistrations.find(r => r.ticketNumber === req.params.ticketNumber);
    if (registration) {
      res.json(registration);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  }
});

// GET all registrations for a specific event
router.get('/:id/registrations', async (req, res) => {
  try {
    if (Registration) {
      const registrations = await Registration.findByEvent(req.params.id);
      res.json(registrations);
    } else {
      // Fallback to sample data
      const eventRegistrations = sampleRegistrations.filter(r => r.eventId === req.params.id);
      res.json(eventRegistrations);
    }
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    // Fallback to sample data
    const eventRegistrations = sampleRegistrations.filter(r => r.eventId === req.params.id);
    res.json(eventRegistrations);
  }
});

// PUT update registration check-in status (use eventId and userId)
router.put('/registrations/:eventId/:userId/checkin', async (req, res) => {
  try {
    const { checkedIn, checkInTime } = req.body;
    
    if (Registration) {
      const registration = await Registration.updateByKeys(
        req.params.eventId,
        req.params.userId,
        {
          checkedIn: checkedIn,
          checkInTime: checkInTime || new Date().toISOString()
        }
      );
      
      if (!registration) {
        return res.status(404).json({ message: 'Registration not found' });
      }
      
      res.json(registration);
    } else {
      // Fallback demo response
      res.json({ eventId: req.params.eventId, userId: req.params.userId, checkedIn, checkInTime });
    }
  } catch (error) {
    console.error('Error updating check-in:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update registration status
router.put('/registrations/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (Registration) {
      const registration = await Registration.update(req.params.id, { status: status });
      
      if (!registration) {
        return res.status(404).json({ message: 'Registration not found' });
      }
      
      res.json(registration);
    } else {
      // Fallback demo response
      const demoRegistration = {
        id: req.params.id,
        status: status,
        message: 'Status updated (demo mode)'
      };
      res.json(demoRegistration);
    }
  } catch (error) {
    console.error('Error updating registration status:', error);
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

    if (Event) {
      const eventData = {
        title,
        description,
        longDescription: longDescription || description,
        date,
        time,
        location,
        address: address || location,
        category,
        image: image || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        capacity,
        price: typeof price === 'number' ? price : 0,
        organizer: organizer || 'Beats of Washington',
        contact: contact || {
          phone: '(206) 555-0123',
          email: 'events@bow.org'
        },
        tags: tags || [],
        featured: featured || false,
        isActive: isActive !== undefined ? isActive : true,
        isLive: isLive || false,
        registeredCount: 0
      };

      const event = await Event.create(eventData);
      res.status(201).json(event);
    } else {
      // Fallback demo response
      const demoEvent = {
        id: `demo_event_${Date.now()}`,
        title,
        description,
        longDescription: longDescription || description,
        date,
        time,
        location,
        address: address || location,
        category,
        image: image || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        capacity,
        price: typeof price === 'number' ? price : 0,
        organizer: organizer || 'Beats of Washington',
        contact: contact || {
          phone: '(206) 555-0123',
          email: 'events@bow.org'
        },
        tags: tags || [],
        featured: featured || false,
        isActive: isActive !== undefined ? isActive : true,
        isLive: isLive || false,
        registeredCount: 0,
        createdAt: new Date().toISOString(),
        message: 'Event created (demo mode)'
      };
      res.status(201).json(demoEvent);
    }
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update an event
router.put('/:id', async (req, res) => {
  try {
    console.log('[PUT /api/events/:id] Update request for event:', req.params.id);
    console.log('[PUT /api/events/:id] Request body:', req.body);
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const updated = await event.update(req.body);
    console.log('[PUT /api/events/:id] Event updated:', updated);
    res.json(updated);
  } catch (error) {
    console.error('[Backend] Update event error:', error);
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
});

// DELETE an event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    await event.delete();
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error('[Backend] Delete event error:', error);
    res.status(500).json({ message: 'Failed to delete event' });
  }
});

module.exports = router; 