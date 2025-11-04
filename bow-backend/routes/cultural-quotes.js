const express = require('express');
const router = express.Router();
const CulturalQuote = require('../models-dynamodb/CulturalQuote');
const verifyCognitoToken = require('../middleware/verifyCognito');

// Get all active quotes (public route)
router.get('/', async (req, res) => {
  try {
    const quotes = await CulturalQuote.getActiveQuotes();
    res.json(quotes);
  } catch (error) {
    console.error('Error fetching cultural quotes:', error);
    res.status(500).json({ error: 'Failed to fetch cultural quotes' });
  }
});

// Get all quotes (admin route)
router.get('/admin', async (req, res) => {
  try {
    const quotes = await CulturalQuote.getAllQuotes();
    res.json(quotes);
  } catch (error) {
    console.error('Error fetching cultural quotes for admin:', error);
    res.status(500).json({ error: 'Failed to fetch cultural quotes' });
  }
});

// Get single quote by ID (admin route)
router.get('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const quote = await CulturalQuote.getById(id);
    
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    res.json(quote);
  } catch (error) {
    console.error('Error fetching cultural quote:', error);
    res.status(500).json({ error: 'Failed to fetch cultural quote' });
  }
});

// Create new quote
router.post('/', async (req, res) => {
  try {
    const { text, author, order, isActive } = req.body;

    // Validate required fields
    if (!text || !author) {
      return res.status(400).json({ error: 'Text and author are required' });
    }

    const quote = new CulturalQuote({
      text,
      author,
      order: order !== undefined ? order : 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await quote.save();

    res.status(201).json({ 
      message: 'Cultural quote created successfully',
      quote 
    });
    
  } catch (error) {
    console.error('Error creating cultural quote:', error);
    res.status(500).json({ error: 'Failed to create cultural quote' });
  }
});

// Update quote
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, author, order, isActive } = req.body;

    const quote = await CulturalQuote.getById(id);
    
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    const updates = {};
    if (text !== undefined) updates.text = text;
    if (author !== undefined) updates.author = author;
    if (order !== undefined) updates.order = order;
    if (isActive !== undefined) updates.isActive = isActive;

    await quote.update(updates);

    res.json({ 
      message: 'Cultural quote updated successfully',
      quote 
    });
    
  } catch (error) {
    console.error('Error updating cultural quote:', error);
    res.status(500).json({ error: 'Failed to update cultural quote' });
  }
});

// Delete quote
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await CulturalQuote.getById(id);
    
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    await quote.delete();

    res.json({ message: 'Cultural quote deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting cultural quote:', error);
    res.status(500).json({ error: 'Failed to delete cultural quote' });
  }
});

module.exports = router;

