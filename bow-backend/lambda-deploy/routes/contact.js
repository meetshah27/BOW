const express = require('express');
const router = express.Router();
const { EmailService } = require('../config/ses');

// GET /api/contact - Test endpoint
router.get('/', (req, res) => {
  res.json({ 
    message: 'Contact API is working!',
    endpoint: 'POST /api/contact to submit contact form',
    requiredFields: ['name', 'email', 'subject', 'message']
  });
});

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    console.log('[POST /api/contact] Contact form submission received');
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('[POST /api/contact] Missing required fields');
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Name, email, subject, and message are required'
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('[POST /api/contact] Invalid email format');
      return res.status(400).json({ 
        error: 'Invalid email format'
      });
    }
    
    console.log('[POST /api/contact] Sending contact form email');
    
    // Send email notification
    try {
      await EmailService.sendContactFormNotification({
        name,
        email,
        subject,
        message
      });
      console.log('[POST /api/contact] Contact form email sent successfully');
    } catch (emailError) {
      console.error('[POST /api/contact] Error sending email:', emailError);
      // Don't fail the request if email fails, but log it
      // In production, you might want to store this in a database
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.'
    });
  } catch (error) {
    console.error('[POST /api/contact] Error processing contact form:', error);
    console.error('[POST /api/contact] Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    res.status(500).json({ 
      error: 'Failed to process contact form',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;

