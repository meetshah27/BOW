const express = require('express');
const router = express.Router();
const Newsletter = require('../models-dynamodb/Newsletter');

// POST - Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;
    
    // Validate required fields
    if (!email) {
      return res.status(400).json({ 
        message: 'Email is required' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Check if already subscribed
    const existingSubscriber = await Newsletter.findByEmail(email);
    if (existingSubscriber) {
      if (existingSubscriber.isActive === 'true') {
        return res.status(400).json({ message: 'Email is already subscribed to our newsletter' });
      } else {
        // Resubscribe inactive subscriber
        const resubscribed = await Newsletter.resubscribe(email);
        return res.status(200).json({
          message: 'Successfully resubscribed to newsletter',
          subscriber: resubscribed
        });
      }
    }

    // Create new subscription
    const subscriberData = {
      email,
      firstName: firstName || '',
      lastName: lastName || ''
    };

    const subscriber = await Newsletter.create(subscriberData);
    
    res.status(201).json({
      message: 'Successfully subscribed to newsletter',
      subscriber: {
        email: subscriber.email,
        firstName: subscriber.firstName,
        lastName: subscriber.lastName,
        subscriptionDate: subscriber.subscriptionDate
      }
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ 
      message: 'Failed to subscribe to newsletter',
      error: error.message 
    });
  }
});

// POST - Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const subscriber = await Newsletter.findByEmail(email);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    if (subscriber.isActive !== 'true') {
      return res.status(400).json({ message: 'Email is already unsubscribed' });
    }

    const unsubscribed = await Newsletter.unsubscribe(email);
    
    res.status(200).json({
      message: 'Successfully unsubscribed from newsletter',
      subscriber: {
        email: unsubscribed.email,
        isActive: unsubscribed.isActive
      }
    });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({ 
      message: 'Failed to unsubscribe from newsletter',
      error: error.message 
    });
  }
});

// GET - Get all subscribers (admin only)
router.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await Newsletter.getAllSubscribers();
    
    res.status(200).json({
      subscribers: subscribers.map(sub => ({
        email: sub.email,
        firstName: sub.firstName,
        lastName: sub.lastName,
        isActive: sub.isActive,
        subscriptionDate: sub.subscriptionDate,
        preferences: sub.preferences,
        updatedAt: sub.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ 
      message: 'Failed to get subscribers',
      error: error.message 
    });
  }
});

// GET - Get subscriber count (admin only)
router.get('/subscriber-count', async (req, res) => {
  try {
    const count = await Newsletter.getSubscriberCount();
    
    res.status(200).json({
      count,
      message: `Total active subscribers: ${count}`
    });
  } catch (error) {
    console.error('Get subscriber count error:', error);
    res.status(500).json({ 
      message: 'Failed to get subscriber count',
      error: error.message 
    });
  }
});

// GET - Get subscribers by preference (admin only)
router.get('/subscribers/preference/:preference', async (req, res) => {
  try {
    const { preference } = req.params;
    const validPreferences = ['events', 'stories', 'volunteerOpportunities', 'donationUpdates'];
    
    if (!validPreferences.includes(preference)) {
      return res.status(400).json({ 
        message: 'Invalid preference. Must be one of: events, stories, volunteerOpportunities, donationUpdates' 
      });
    }

    const subscribers = await Newsletter.getSubscribersByPreference(preference);
    
    res.status(200).json({
      preference,
      count: subscribers.length,
      subscribers: subscribers.map(sub => ({
        email: sub.email,
        firstName: sub.firstName,
        lastName: sub.lastName,
        subscriptionDate: sub.subscriptionDate
      }))
    });
  } catch (error) {
    console.error('Get subscribers by preference error:', error);
    res.status(500).json({ 
      message: 'Failed to get subscribers by preference',
      error: error.message 
    });
  }
});

// PUT - Update subscriber preferences (admin only)
router.put('/subscribers/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const updateData = req.body;
    
    // Remove email from update data if present
    delete updateData.email;
    
    const subscriber = await Newsletter.findByEmail(email);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    const updated = await Newsletter.updateSubscriber(email, updateData);
    
    res.status(200).json({
      message: 'Subscriber updated successfully',
      subscriber: updated
    });
  } catch (error) {
    console.error('Update subscriber error:', error);
    res.status(500).json({ 
      message: 'Failed to update subscriber',
      error: error.message 
    });
  }
});

// DELETE - Delete subscriber (admin only)
router.delete('/subscribers/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const subscriber = await Newsletter.findByEmail(email);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    await Newsletter.deleteSubscriber(email);
    
    res.status(200).json({
      message: 'Subscriber deleted successfully'
    });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({ 
      message: 'Failed to delete subscriber',
      error: error.message 
    });
  }
});

// POST - Resubscribe (admin only)
router.post('/subscribers/:email/resubscribe', async (req, res) => {
  try {
    const { email } = req.params;
    
    const subscriber = await Newsletter.findByEmail(email);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    if (subscriber.isActive === 'true') {
      return res.status(400).json({ message: 'Subscriber is already active' });
    }

    const resubscribed = await Newsletter.resubscribe(email);
    
    res.status(200).json({
      message: 'Subscriber resubscribed successfully',
      subscriber: resubscribed
    });
  } catch (error) {
    console.error('Resubscribe error:', error);
    res.status(500).json({ 
      message: 'Failed to resubscribe',
      error: error.message 
    });
  }
});

module.exports = router; 