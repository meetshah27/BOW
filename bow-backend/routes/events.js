const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const verifyCognito = require('../middleware/verifyCognito');
const syncUserToDynamoDB = require('../middleware/syncUserToDynamoDB');
const { getSquareClient } = require('../config/square-client');

// Debug middleware to log all requests to events router
router.use((req, res, next) => {
  console.log(`[Events Router] ${req.method} ${req.path} - Original URL: ${req.originalUrl}`);
  next();
});

// Try to use DynamoDB models, fallback to sample data if not available
let Event, Registration, EventAddon;
try {
  Event = require('../models-dynamodb/Event');
  Registration = require('../models-dynamodb/Registration');
  console.log('✅ Using DynamoDB Event and Registration models');
  
  try {
    EventAddon = require('../models-dynamodb/EventAddon');
    console.log('✅ Using DynamoDB Event, Registration, and EventAddon models');
  } catch (addonError) {
    console.error('❌ Failed to load EventAddon model:', addonError.message);
    console.error('❌ EventAddon error stack:', addonError.stack);
    EventAddon = null;
    console.log('⚠️  EventAddon model not available, addon features disabled');
  }
} catch (error) {
  console.log('⚠️  DynamoDB models not available, using fallback mode');
  console.error('❌ Model loading error:', error.message);
  Event = null;
  Registration = null;
  EventAddon = null;
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
    checkInTime: null,
    // Payment information for paid event
    paymentAmount: 25,
    paymentIntentId: 'pi_sample_paid_12345678',
    paymentDate: new Date().toISOString(),
    paymentStatus: 'completed',
    paymentMethod: 'Card',
    isPaidEvent: true
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
    checkInTime: null,
    // Payment information for paid event
    paymentAmount: 15,
    paymentIntentId: 'pi_sample_paid_87654321',
    paymentDate: new Date().toISOString(),
    paymentStatus: 'completed',
    paymentMethod: 'Card',
    isPaidEvent: true
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
    checkInTime: new Date().toISOString(),
    // Free event - no payment required
    paymentAmount: 0,
    paymentIntentId: null,
    paymentDate: null,
    paymentStatus: 'none',
    paymentMethod: null,
    isPaidEvent: false
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

// ========== EVENT ADDONS ROUTES (must be before ALL /:id routes) ==========

// GET all addons for an event
// IMPORTANT: This route MUST be defined before any /:id routes to ensure proper matching
router.get('/:eventId/addons', async (req, res) => {
  try {
    console.log('[Backend] ✅ Addons route matched!');
    console.log('[Backend] Fetching addons for event:', req.params.eventId);
    console.log('[Backend] Full URL path:', req.path);
    console.log('[Backend] EventAddon model available:', !!EventAddon);
    
    if (EventAddon) {
      const addons = await EventAddon.findByEventId(req.params.eventId);
      console.log('[Backend] Found addons:', addons?.length || 0);
      res.json(addons || []);
    } else {
      console.log('[Backend] EventAddon model not available, returning empty array');
      res.json([]);
    }
  } catch (error) {
    console.error('[Backend] Error fetching event addons:', error);
    console.error('[Backend] Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to fetch event addons', details: error.message });
  }
});

// POST create a new addon for an event
router.post('/:eventId/addons', async (req, res) => {
  try {
    console.log('[Backend] Creating addon for event:', req.params.eventId);
    console.log('[Backend] Request body:', req.body);
    console.log('[Backend] EventAddon model available:', !!EventAddon);
    
    if (!EventAddon) {
      return res.status(500).json({ error: 'Event addon model not available' });
    }

    const addonData = {
      eventId: req.params.eventId,
      name: req.body.name,
      price: parseFloat(req.body.price) || 0,
      description: req.body.description || '',
      stock: req.body.stock !== undefined && req.body.stock !== null ? parseInt(req.body.stock) : null,
      availableStock: req.body.stock !== undefined && req.body.stock !== null ? parseInt(req.body.stock) : null,
      isFreeWithTicket: req.body.isFreeWithTicket || false,
      freeQuantityPerTicket: req.body.freeQuantityPerTicket || 0,
      displayOrder: req.body.displayOrder || 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    const addon = await EventAddon.create(addonData);
    console.log('[Backend] Addon created successfully:', addon.id);
    res.status(201).json(addon);
  } catch (error) {
    console.error('[Backend] Error creating addon:', error);
    console.error('[Backend] Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to create addon', details: error.message });
  }
});

// PUT update an addon
router.put('/:eventId/addons/:addonId', async (req, res) => {
  try {
    if (!EventAddon) {
      return res.status(500).json({ error: 'Event addon model not available' });
    }

    const addon = await EventAddon.findById(req.params.addonId);
    if (!addon) {
      return res.status(404).json({ error: 'Addon not found' });
    }

    if (addon.eventId !== req.params.eventId) {
      return res.status(400).json({ error: 'Addon does not belong to this event' });
    }

    const updateData = {
      name: req.body.name,
      price: parseFloat(req.body.price) || 0,
      description: req.body.description || '',
      stock: req.body.stock !== undefined && req.body.stock !== null ? parseInt(req.body.stock) : null,
      availableStock: req.body.availableStock !== undefined && req.body.availableStock !== null ? parseInt(req.body.availableStock) : null,
      isFreeWithTicket: req.body.isFreeWithTicket || false,
      freeQuantityPerTicket: req.body.freeQuantityPerTicket || 0,
      displayOrder: req.body.displayOrder || 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    const updatedAddon = await addon.update(updateData);
    res.json(updatedAddon);
  } catch (error) {
    console.error('[Backend] Error updating addon:', error);
    res.status(500).json({ error: 'Failed to update addon', details: error.message });
  }
});

// DELETE an addon
router.delete('/:eventId/addons/:addonId', async (req, res) => {
  try {
    if (!EventAddon) {
      return res.status(500).json({ error: 'Event addon model not available' });
    }

    const addon = await EventAddon.findById(req.params.addonId);
    if (!addon) {
      return res.status(404).json({ error: 'Addon not found' });
    }

    if (addon.eventId !== req.params.eventId) {
      return res.status(400).json({ error: 'Addon does not belong to this event' });
    }

    await addon.delete();
    res.json({ message: 'Addon deleted successfully' });
  } catch (error) {
    console.error('[Backend] Error deleting addon:', error);
    res.status(500).json({ error: 'Failed to delete addon', details: error.message });
  }
});

// ========== END EVENT ADDONS ROUTES ==========

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
    console.log('[GET /api/events] Event model loaded:', !!Event);
    console.log('[GET /api/events] Registration model loaded:', !!Registration);
    
    if (Event && Registration) {
      console.log('[GET /api/events] Fetching events from DynamoDB...');
      const events = await Event.findAll();
      console.log('[GET /api/events] Found', events.length, 'events in DynamoDB');
      
      if (events.length === 0) {
        console.log('[GET /api/events] No events found in DynamoDB - returning empty array');
        return res.json([]);
      }
      
      // Sync registration counts for all events
      for (const event of events) {
        try {
          const actualCount = await Registration.getEventRegistrationCount(event.id);
          if (event.registeredCount !== actualCount) {
            console.log(`[Backend] Syncing registration count for event ${event.id}: ${event.registeredCount} -> ${actualCount}`);
            await event.update({ registeredCount: actualCount });
          }
        } catch (syncError) {
          console.error(`[Backend] Error syncing registration count for event ${event.id}:`, syncError.message);
          // Continue with other events even if one fails
        }
      }
      
      // Fetch events again after sync
      const updatedEvents = await Event.findAll();
      console.log('[GET /api/events] Returning', updatedEvents.length, 'events from DynamoDB');
      
      // Log all events before sorting
      console.log('[GET /api/events] Events before sorting:');
      updatedEvents.forEach((event, index) => {
        const eventDate = new Date(event.date);
        console.log(`  ${index + 1}. ${event.title} - Date: ${event.date} -> Parsed: ${eventDate.toISOString()} (Valid: ${!isNaN(eventDate.getTime())})`);
      });
      
      // Sort events by date (most recent/future dates first)
      updatedEvents.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        // Handle invalid dates - put them at the end
        if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;
        // Descending order (most recent/future dates first)
        return dateB - dateA;
      });
      
      // Log all events after sorting
      console.log('[GET /api/events] Events after sorting (most recent first):');
      updatedEvents.forEach((event, index) => {
        const eventDate = new Date(event.date);
        console.log(`  ${index + 1}. ${event.title} - Date: ${event.date} -> Parsed: ${eventDate.toISOString()}`);
      });
      
      res.json(updatedEvents);
    } else if (Event) {
      console.log('[GET /api/events] Fetching events from DynamoDB (no Registration model)...');
      const events = await Event.findAll();
      console.log('[GET /api/events] Found', events.length, 'events in DynamoDB');
      
      if (events.length === 0) {
        console.log('[GET /api/events] No events found in DynamoDB - returning empty array');
        return res.json([]);
      }
      
      // Sort events by date (most recent/future dates first)
      events.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        // Handle invalid dates - put them at the end
        if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;
        // Descending order (most recent/future dates first)
        return dateB - dateA;
      });
      
      res.json(events);
    } else {
      console.log('[GET /api/events] Event model not available - using fallback sample data');
      // Fallback to sample data - sort by date (most recent/future dates first)
      const sortedSampleEvents = [...sampleEvents].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        // Handle invalid dates - put them at the end
        if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;
        // Descending order (most recent/future dates first)
        return dateB - dateA;
      });
      res.json(sortedSampleEvents);
    }
  } catch (error) {
    console.error('[GET /api/events] Error fetching events:', error);
    console.error('[GET /api/events] Error stack:', error.stack);
    console.error('[GET /api/events] Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.$metadata?.httpStatusCode
    });
    
    // Return error response instead of silently falling back
    // This helps identify the issue
    res.status(500).json({ 
      error: 'Failed to fetch events from database',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      fallback: 'Using sample data due to error'
    });
    
    // Also log fallback
    console.log('[GET /api/events] Returning sample data due to error');
    // Don't return sample data - let the error be visible
    // res.json(sampleEvents);
  }
});

// GET single event by ID
router.get('/:id', async (req, res) => {
  // IMPORTANT: Skip if this is an addons request - it should be handled by the addons route above
  if (req.path && req.path.endsWith('/addons')) {
    console.log('[Backend] ⚠️  /:id route received addons request, this should not happen - route order issue!');
    return res.status(404).json({ 
      error: 'Not Found', 
      status: 404, 
      timestamp: new Date().toISOString(), 
      path: req.path,
      message: 'Addons route should have matched first. Check route order.'
    });
  }
  
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
    console.log('[Backend] Request body type:', typeof req.body);
    console.log('[Backend] Request body:', req.body);
    console.log('[Backend] Request headers:', req.headers);
    
    // Handle case where body might be a string or nested object
    let bodyData = req.body;
    
    // If body is an object with a 'body' property that's a string, parse it
    if (req.body && typeof req.body === 'object' && req.body.body && typeof req.body.body === 'string') {
      try {
        bodyData = JSON.parse(req.body.body);
        console.log('[Backend] Parsed nested body:', bodyData);
      } catch (parseError) {
        console.error('[Backend] Failed to parse nested request body:', parseError);
        return res.status(400).json({ message: 'Invalid JSON in request body' });
      }
    } else if (typeof req.body === 'string') {
      try {
        bodyData = JSON.parse(req.body);
      } catch (parseError) {
        console.error('[Backend] Failed to parse request body:', parseError);
        return res.status(400).json({ message: 'Invalid JSON in request body' });
      }
    }
    
    console.log('[Backend] Final parsed body data:', bodyData);
    const { userId, userEmail, userName, phone, dietaryRestrictions, specialRequests, quantity, paymentAmount, paymentIntentId, isPaidEvent, addons } = bodyData;
    
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
    
    // Check if event exists first to validate price
    let event;
    if (Event) {
      event = await Event.findById(req.params.id);
      if (!event) {
        console.error('[Backend] Event not found:', req.params.id);
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Validate payment requirements based on event price OR paid addons
      const eventPrice = parseFloat(event.price) || 0;
      const hasPaidAddons = addons && Array.isArray(addons) && addons.length > 0;
      
      // Check if any addons are paid (not free)
      let hasPaidAddonItems = false;
      if (hasPaidAddons && EventAddon) {
        for (const addonItem of addons) {
          try {
            const addon = await EventAddon.findById(addonItem.addonId);
            if (addon && !addon.isFreeWithTicket && addon.price > 0) {
              hasPaidAddonItems = true;
              break;
            }
          } catch (err) {
            // Continue checking other addons
          }
        }
      }
      
      if (eventPrice > 0 || hasPaidAddonItems) {
        if (!paymentIntentId) {
          console.error('[Backend] Payment intent ID required for paid event or paid addons');
          return res.status(400).json({ message: 'Payment is required for paid events or when purchasing items' });
        }
        // For paid events without addons, verify base amount matches
        if (eventPrice > 0 && !hasPaidAddonItems) {
          if (!paymentAmount || paymentAmount !== (eventPrice * 100 * quantity)) {
            console.error('[Backend] Payment amount mismatch');
            return res.status(400).json({ message: 'Payment amount does not match event price' });
          }
        }
        // Verify payment with Square before confirming registration
        try {
          const client = getSquareClient();
          const paymentRes = await client.payments.get({ paymentId: paymentIntentId });
          const payment = paymentRes.payment;

          if (!payment) {
            return res.status(400).json({ message: 'Payment not found' });
          }

          const expectedAmount = Number(paymentAmount || 0);
          const paidAmount = Number(payment.amountMoney?.amount || 0n);
          const paidCurrency = String(payment.amountMoney?.currency || 'USD').toUpperCase();

          if (payment.status !== 'COMPLETED') {
            return res.status(400).json({ message: `Payment not completed (status: ${payment.status})` });
          }
          if (paidAmount !== expectedAmount) {
            return res.status(400).json({ message: 'Payment amount does not match expected total' });
          }
          if (paidCurrency !== 'USD') {
            return res.status(400).json({ message: 'Payment currency mismatch' });
          }

          console.log('[Backend] Paid registration - Square payment verified:', paymentIntentId);
        } catch (verifyError) {
          console.error('[Backend] Square payment verification failed:', verifyError.message);
          return res.status(400).json({ message: 'Payment verification failed' });
        }
      } else {
        console.log('[Backend] Free event registration - no payment required');
      }
    }
    
    // Phone number is now optional

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
        phone: phone || '', // Ensure phone is always a string
        dietaryRestrictions: dietaryRestrictions || '',
        specialRequests: specialRequests || '',
        quantity: quantity || 1, // Default to 1 if not provided
        ticketNumber: ticketNumber,
        registrationDate: new Date().toISOString(),
        status: isPaidEvent ? 'confirmed' : 'confirmed',
        
        // Payment information
        paymentAmount: paymentAmount || 0,
        isPaidEvent: isPaidEvent || false,
        paymentIntentId: paymentIntentId || null,
        paymentMethod: isPaidEvent ? 'Square' : undefined,
        paymentStatus: isPaidEvent ? 'completed' : 'none',
        paymentDate: isPaidEvent ? new Date().toISOString() : null,
        
        // Addon information
        addons: addons || []
      };

      const savedRegistration = await Registration.create(registrationData);

      // Process addons if provided
      if (addons && Array.isArray(addons) && addons.length > 0 && EventAddon) {
        for (const addonItem of addons) {
          try {
            const addon = await EventAddon.findById(addonItem.addonId);
            if (addon && addon.eventId === req.params.id && addon.isActive) {
              // Decrement stock if applicable
              if (addon.stock !== null) {
                await addon.decrementStock(addonItem.quantity || 1);
                console.log(`[Backend] Decremented stock for addon ${addon.name} by ${addonItem.quantity || 1}`);
              }
            }
          } catch (addonError) {
            console.error(`[Backend] Error processing addon ${addonItem.addonId}:`, addonError);
            // Don't fail registration if addon processing fails
          }
        }
      }

      // Get the actual registration count and update the event
      const actualCount = await Registration.getEventRegistrationCount(req.params.id);
      console.log('[Backend] Actual registration count:', actualCount);
      
      // Update event registration count to match actual count
      await event.update({ registeredCount: actualCount });
      console.log('[Backend] Updated event registeredCount to:', actualCount);

      // Send confirmation email (free and paid)
      if (true) {
        try {
          const { EmailService } = require('../config/ses');
          const event = await Event.findById(req.params.id);
          
          if (event) {
            const emailData = {
              userName: savedRegistration.userName,
              userEmail: savedRegistration.userEmail,
              phone: savedRegistration.phone || 'N/A',
              ticketNumber: savedRegistration.ticketNumber,
              eventTitle: event.title,
              eventDate: event.date,
              eventTime: event.time,
              eventLocation: event.location,
              quantity: savedRegistration.quantity || 1,
              paymentAmount: savedRegistration.paymentAmount || 0,
              paymentIntentId: savedRegistration.paymentIntentId || null,
              paymentStatus: savedRegistration.paymentStatus || (savedRegistration.paymentAmount > 0 ? 'completed' : 'none'),
              paymentDate: savedRegistration.paymentDate || null,
              registrationDate: savedRegistration.registrationDate || savedRegistration.createdAt,
              status: savedRegistration.status || 'confirmed',
              checkInStatus: 'Not Checked In'
            };
            
            await EmailService.sendEventRegistrationConfirmation(emailData);
            console.log('[Backend] Event registration confirmation email sent to:', savedRegistration.userEmail);
          }
        } catch (emailError) {
          console.error('[Backend] Failed to send event registration email:', emailError.message);
          // Don't fail registration if email fails
        }
      }

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
        phone: phone || '', // Ensure phone is always a string
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

// POST update payment information after successful payment
router.post('/:id/update-payment', async (req, res) => {
  try {
    const { userId, paymentIntentId, paymentMethod, paymentStatus } = req.body;
    
    if (!userId || !paymentIntentId) {
      return res.status(400).json({ error: 'User ID and payment intent ID are required.' });
    }
    
    if (Registration) {
      const registration = await Registration.findByEventAndUser(req.params.id, userId);
      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }
      
      // Update payment information
      const updatedRegistration = await registration.update({
        paymentIntentId: paymentIntentId,
        paymentMethod: paymentMethod || 'Card',
        paymentStatus: paymentStatus || 'completed',
        paymentDate: new Date().toISOString()
      });
      
      res.json(updatedRegistration);
    } else {
      // Fallback demo response
      res.json({ 
        message: 'Payment updated (demo mode)',
        userId: userId,
        paymentIntentId: paymentIntentId,
        paymentStatus: paymentStatus || 'completed'
      });
    }
  } catch (error) {
    console.error('[Backend] Error updating payment:', error);
    res.status(500).json({ error: error.message || 'Failed to update payment' });
  }
});

// POST create payment for event registration (Square)
router.post('/:id/create-payment', async (req, res) => {
  try {
    const { sourceId, amount, userEmail, userName, userId, quantity = 1, addons = [] } = req.body;
    
    // Validate required fields
    if (!sourceId) {
      return res.status(400).json({ error: 'Missing sourceId (Square token).' });
    }
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount. Amount must be greater than 0.' });
    }
    if (!userEmail || !userName || !userId) {
      return res.status(400).json({ error: 'User email, name, and ID are required.' });
    }
    
    // Check if event exists
    let event = null;
    if (Event) {
      event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
    }
    
    // Calculate total amount including addons
    let totalAmount = amount; // Base amount from frontend (already includes ticket price * quantity)
    
    // Validate and calculate addon prices
    if (addons && addons.length > 0 && EventAddon) {
      for (const addonItem of addons) {
        const addon = await EventAddon.findById(addonItem.addonId);
        if (!addon || addon.eventId !== req.params.id) {
          return res.status(400).json({ error: `Invalid addon: ${addonItem.addonId}` });
        }
        
        if (!addon.isActive) {
          return res.status(400).json({ error: `Addon ${addon.name} is not available` });
        }
        
        // Check stock availability
        if (addon.stock !== null && addon.availableStock !== null) {
          if (addon.availableStock < addonItem.quantity) {
            return res.status(400).json({ error: `Insufficient stock for ${addon.name}. Only ${addon.availableStock} available.` });
          }
        }
        
        // Add addon price (only if not free with ticket)
        if (!addon.isFreeWithTicket) {
          totalAmount += (addon.price * 100 * addonItem.quantity); // Convert to cents
        }
      }
    }
    
    // Verify the base amount matches the event price (amount is in cents, event.price is in dollars)
    // But allow if there are paid addons (totalAmount will be recalculated below)
    const baseEventPrice = (event ? parseFloat(event.price) || 0 : 0) * 100 * quantity;
    if (event && baseEventPrice !== amount && (!addons || addons.length === 0)) {
      return res.status(400).json({ error: 'Payment amount does not match event price' });
    }
    
    const client = getSquareClient();
    const idempotencyKey = crypto.randomUUID();

    const createRes = await client.payments.create({
      sourceId,
      idempotencyKey,
      amountMoney: {
        amount: BigInt(Math.trunc(totalAmount)),
        currency: 'USD',
      },
      autocomplete: true,
      buyerEmailAddress: userEmail,
      note: `BOW event registration: ${req.params.id} (${userName})`,
      referenceId: `bow_event_${req.params.id}_${Date.now()}`,
    });

    const payment = createRes.payment;
    if (!payment) {
      return res.status(500).json({ error: 'Payment was not created.' });
    }

    console.log('[Backend] Square payment created for event registration:', payment.id);

    res.json({
      success: payment.status === 'COMPLETED',
      paymentId: payment.id,
      status: payment.status,
    });
    
  } catch (error) {
    console.error('[Backend] Error creating payment for event:', error);
    res.status(500).json({ error: error.message || 'Failed to create payment' });
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

// GET download receipt for a registration
router.get('/registrations/:eventId/:userId/receipt', async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    
    // Fetch registration
    let registration = null;
    if (Registration) {
      registration = await Registration.findByEventAndUser(eventId, userId);
      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }
    } else {
      // Fallback to sample data
      registration = sampleRegistrations.find(r => r.eventId === eventId && r.userId === userId);
      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }
    }
    
    // Fetch event
    let event = null;
    if (Event) {
      event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
    } else {
      // Fallback to sample data
      event = sampleEvents.find(e => e.id === eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
    }
    
    // Get logo URL
    let logoUrl = 'https://bow-platform.s3.amazonaws.com/bow-logo.png'; // Default logo
    try {
      const AboutPage = require('../models-dynamodb/AboutPage');
      const aboutPageSettings = await AboutPage.getSettings();
      if (aboutPageSettings && aboutPageSettings.logo && aboutPageSettings.logo.trim()) {
        // Ensure the logo URL is a full URL (starts with http:// or https://)
        const logo = aboutPageSettings.logo.trim();
        if (logo.startsWith('http://') || logo.startsWith('https://')) {
          logoUrl = logo;
          console.log('[Receipt] Using logo from AboutPage:', logoUrl);
        } else {
          console.log('[Receipt] Logo URL is not a full URL, using default:', logo);
        }
      } else {
        console.log('[Receipt] No logo found in AboutPage settings, using default');
      }
    } catch (error) {
      console.error('[Receipt] Error fetching logo for receipt:', error);
      console.log('[Receipt] Using default logo due to error');
    }
    
    // Prepare email data
    const emailData = {
      userName: registration.userName,
      userEmail: registration.userEmail,
      phone: registration.phone || 'N/A',
      ticketNumber: registration.ticketNumber,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      quantity: registration.quantity || 1,
      paymentAmount: registration.paymentAmount || 0,
      paymentIntentId: registration.paymentIntentId || null,
      paymentStatus: registration.paymentStatus || (registration.paymentAmount > 0 ? 'completed' : 'none'),
      paymentDate: registration.paymentDate || null,
      registrationDate: registration.registrationDate || null,
      status: registration.status || 'confirmed',
      checkInStatus: registration.checkInStatus || 'Not Checked In',
      logoUrl: logoUrl
    };
    
    // Generate HTML receipt
    const { EmailService } = require('../config/ses');
    const htmlContent = EmailService.getEventRegistrationTemplate(emailData);
    
    // Set headers for download
    const filename = `receipt-${registration.ticketNumber}-${Date.now()}.html`;
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Send HTML content
    res.send(htmlContent);
  } catch (error) {
    console.error('Error generating receipt:', error);
    res.status(500).json({ error: 'Failed to generate receipt' });
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

// DELETE registration by composite key
router.delete('/registrations/:eventId/:userId', async (req, res) => {
  try {
    console.log('[Backend] Delete registration request received for eventId:', req.params.eventId, 'userId:', req.params.userId);
    
    if (Registration) {
      const registration = await Registration.findByEventAndUser(req.params.eventId, req.params.userId);
      
      if (!registration) {
        console.log('[Backend] Registration not found for eventId:', req.params.eventId, 'userId:', req.params.userId);
        return res.status(404).json({ message: 'Registration not found' });
      }

      await registration.delete();
      console.log('[Backend] Registration deleted successfully');

      res.json({ message: 'Registration deleted successfully' });
    } else {
      // Fallback demo response - remove from sample data
      const registrationIndex = sampleRegistrations.findIndex(r => 
        r.eventId === req.params.eventId && r.userId === req.params.userId
      );
      
      if (registrationIndex !== -1) {
        sampleRegistrations.splice(registrationIndex, 1);
        console.log('[Backend] Demo mode - registration deleted from sample data');
      }
      
      res.json({ 
        message: 'Registration deleted successfully (demo mode)',
        eventId: req.params.eventId,
        userId: req.params.userId
      });
    }
  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST create a new event
router.post('/', async (req, res) => {
  try {
    console.log('[POST /api/events] Creating event with data:', req.body);
    
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
      extraUrl1,
      extraUrl2,
      extraUrl3,
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
        price: typeof price === 'number' ? price : (typeof price === 'string' ? parseFloat(price) || 0 : 0),
        organizer: organizer || 'Beats of Washington',
        contact: contact || {
          phone: '(206) 555-0123',
          email: 'events@bow.org'
        },
        extraUrl1: extraUrl1 || '',
        extraUrl2: extraUrl2 || '',
        extraUrl3: extraUrl3 || '',
        tags: tags || [],
        featured: featured || false,
        isActive: isActive !== undefined ? isActive : true,
        isLive: isLive || false,
        registeredCount: 0
      };

      console.log('[POST /api/events] Event data to save:', eventData);
      const event = await Event.create(eventData);
      console.log('[POST /api/events] Event created:', event);
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
        price: typeof price === 'number' ? price : (typeof price === 'string' ? parseFloat(price) || 0 : 0),
        organizer: organizer || 'Beats of Washington',
        contact: contact || {
          phone: '(206) 555-0123',
          email: 'events@bow.org'
        },
        extraUrl1: extraUrl1 || '',
        extraUrl2: extraUrl2 || '',
        extraUrl3: extraUrl3 || '',
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
    console.error('[POST /api/events] Error creating event:', {
      message: error.message,
      stack: error.stack,
      data: req.body,
      details: error.details || error.cause || {}
    });
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
});

// PUT update an event
router.put('/:id', async (req, res) => {
  try {
    console.log('[PUT /api/events/:id] Update request for event:', req.params.id);
    console.log('[PUT /api/events/:id] Request body:', req.body);
    console.log('[PUT /api/events/:id] Request body type:', typeof req.body);
    
    // Handle case where body might be a string
    let updateData = req.body;
    if (typeof req.body === 'string') {
      try {
        updateData = JSON.parse(req.body);
        console.log('[PUT /api/events/:id] Parsed body:', updateData);
      } catch (parseError) {
        console.error('[PUT /api/events/:id] Failed to parse body:', parseError);
        return res.status(400).json({ message: 'Invalid JSON in request body' });
      }
    }
    
    // Validate update data
    if (!updateData || Object.keys(updateData).length === 0) {
      console.error('[PUT /api/events/:id] No update data provided');
      return res.status(400).json({ message: 'No update data provided' });
    }
    
    // Ensure price is always a number
    if (updateData.price !== undefined) {
      updateData.price = typeof updateData.price === 'number' 
        ? updateData.price 
        : (typeof updateData.price === 'string' ? parseFloat(updateData.price) || 0 : 0);
    }
    
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    console.log('[PUT /api/events/:id] Found event:', event.id);
    console.log('[PUT /api/events/:id] Update data:', updateData);
    
    const updated = await event.update(updateData);
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

// Addon routes are defined above (line 314) before /:id route
// Duplicate broken routes removed

module.exports = router; 