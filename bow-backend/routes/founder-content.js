const express = require('express');
const router = express.Router();
const FounderContent = require('../models-dynamodb/FounderContent');
const verifyCognitoToken = require('../middleware/verifyCognito');

// Get founder content (public route)
router.get('/', async (req, res) => {
  try {
    const founderContent = await FounderContent.getSettings();
    res.json(founderContent);
  } catch (error) {
    console.error('Error fetching founder content:', error);
    res.status(500).json({ error: 'Failed to fetch founder content' });
  }
});

// Get founder content for admin panel (protected route)
router.get('/admin', async (req, res) => {
  try {
    const founderContent = await FounderContent.getSettings();
    res.json(founderContent);
  } catch (error) {
    console.error('Error fetching founder content for admin:', error);
    res.status(500).json({ error: 'Failed to fetch founder content' });
  }
});

// Create/Update founder content (protected route)
router.post('/', async (req, res) => {
  try {
    const {
      sectionTitle,
      sectionSubtitle,
      aandSane,
      deepaliSane,
      isActive
    } = req.body;

    // Validate required fields
    if (!sectionTitle || !sectionSubtitle || !aandSane || !deepaliSane) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate founder data
    if (!aandSane.name || !aandSane.role || !aandSane.description) {
      return res.status(400).json({ error: 'Missing required Aand Sane fields' });
    }

    if (!deepaliSane.name || !deepaliSane.role || !deepaliSane.description) {
      return res.status(400).json({ error: 'Missing required Deepali Sane fields' });
    }

    // Check if content already exists
    let founderContent = await FounderContent.getSettings();
    
    if (founderContent.id === 'founder-content-settings') {
      // Update existing content
      await founderContent.update({
        sectionTitle,
        sectionSubtitle,
        aandSane,
        deepaliSane,
        isActive
      });
    } else {
      // Create new content
      founderContent = new FounderContent({
        sectionTitle,
        sectionSubtitle,
        aandSane,
        deepaliSane,
        isActive
      });
      await founderContent.save();
    }

    res.json({ 
      message: 'Founder content updated successfully',
      founderContent 
    });
    
  } catch (error) {
    console.error('Error updating founder content:', error);
    res.status(500).json({ error: 'Failed to update founder content' });
  }
});

// Update specific founder content (protected route)
router.put('/:id', verifyCognitoToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (id !== 'founder-content-settings') {
      return res.status(400).json({ error: 'Invalid founder content ID' });
    }

    const founderContent = await FounderContent.getSettings();
    await founderContent.update(updates);

    res.json({ 
      message: 'Founder content updated successfully',
      founderContent 
    });
    
  } catch (error) {
    console.error('Error updating founder content:', error);
    res.status(500).json({ error: 'Failed to update founder content' });
  }
});

// Update specific founder details (protected route)
router.put('/founder/:founderType', verifyCognitoToken, async (req, res) => {
  try {
    const { founderType } = req.params;
    const updates = req.body;

    if (!['aand', 'deepali'].includes(founderType)) {
      return res.status(400).json({ error: 'Invalid founder type. Must be "aand" or "deepali"' });
    }

    const founderContent = await FounderContent.getSettings();
    await founderContent.updateFounder(founderType, updates);

    res.json({ 
      message: `${founderType === 'aand' ? 'Aand' : 'Deepali'} Sane details updated successfully`,
      founderContent 
    });
    
  } catch (error) {
    console.error('Error updating founder details:', error);
    res.status(500).json({ error: 'Failed to update founder details' });
  }
});

// Delete founder content (protected route)
router.delete('/:id', verifyCognitoToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (id !== 'founder-content-settings') {
      return res.status(400).json({ error: 'Invalid founder content ID' });
    }

    const founderContent = await FounderContent.getSettings();
    await founderContent.delete();

    res.json({ message: 'Founder content deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting founder content:', error);
    res.status(500).json({ error: 'Failed to delete founder content' });
  }
});

// Get all founder content (for admin panel - protected route)
router.get('/admin/all', verifyCognitoToken, async (req, res) => {
  try {
    const allContent = await FounderContent.getAll();
    res.json(allContent);
  } catch (error) {
    console.error('Error fetching all founder content:', error);
    res.status(500).json({ error: 'Failed to fetch all founder content' });
  }
});

module.exports = router;
