const express = require('express');
const router = express.Router();
const AboutPage = require('../models-dynamodb/AboutPage');
const verifyCognitoToken = require('../middleware/verifyCognito');

// Get about page content (public route)
router.get('/', async (req, res) => {
  try {
    console.log('[GET /api/about-page] Fetching about page content');
    console.log('[GET /api/about-page] AboutPage model loaded:', !!AboutPage);
    
    if (!AboutPage) {
      console.log('[GET /api/about-page] AboutPage model not available');
      return res.status(500).json({ error: 'AboutPage model not available' });
    }
    
    const aboutPage = await AboutPage.getSettings();
    console.log('[GET /api/about-page] Successfully fetched about page content');
    res.json(aboutPage);
  } catch (error) {
    console.error('[GET /api/about-page] Error fetching about page content:', error);
    console.error('[GET /api/about-page] Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.$metadata?.httpStatusCode
    });
    res.status(500).json({ 
      error: 'Failed to fetch about page content',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get about page content for admin panel (protected route)
router.get('/admin', async (req, res) => {
  try {
    const aboutPage = await AboutPage.getSettings();
    res.json(aboutPage);
  } catch (error) {
    console.error('Error fetching about page content for admin:', error);
    res.status(500).json({ error: 'Failed to fetch about page content' });
  }
});

// Create/Update about page content (protected route)
router.post('/', async (req, res) => {
  try {
    console.log('🔍 Received request body:', req.body);
    
    const {
      storyTitle,
      storySubtitle,
      foundingYear,
      foundingTitle,
      foundingDescription,
      founderBelief,
      todayVision,
      logo,
      achievements,
      isActive
    } = req.body;
    
    console.log('🔍 Logo field received:', logo);
    console.log('🔍 Logo field type:', typeof logo);

    // Validate required fields
    if (!storyTitle || !storySubtitle || !foundingDescription) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate achievements array
    if (!Array.isArray(achievements) || achievements.length === 0) {
      return res.status(400).json({ error: 'Achievements must be a non-empty array' });
    }

    // Check if content already exists
    let aboutPage = await AboutPage.getSettings();
    console.log('🔍 Existing about page found:', aboutPage);
    console.log('🔍 Existing logo:', aboutPage.logo);
    
    if (aboutPage.id === 'about-page-settings') {
      // Update existing content
      const updateData = {
        storyTitle,
        storySubtitle,
        foundingYear,
        foundingTitle,
        foundingDescription,
        founderBelief,
        todayVision,
        logo,
        achievements,
        isActive
      };
      
      console.log('🔍 Update data being sent:', updateData);
      console.log('🔍 Logo in update data:', updateData.logo);
      
      await aboutPage.update(updateData);
    } else {
      // Create new content
      aboutPage = new AboutPage({
        storyTitle,
        storySubtitle,
        foundingYear,
        foundingTitle,
        foundingDescription,
        founderBelief,
        todayVision,
        logo,
        achievements,
        isActive
      });
      await aboutPage.save();
    }

    // Get the updated about page to ensure we return the latest data
    const updatedAboutPage = await AboutPage.getSettings();
    console.log('🔍 Final about page data being sent in response:', updatedAboutPage);
    console.log('🔍 Logo in final response:', updatedAboutPage.logo);
    console.log('🔍 Updated about page JSON:', JSON.stringify(updatedAboutPage));
    
    res.json({ 
      message: 'About page content updated successfully',
      aboutPage: updatedAboutPage
    });
    
  } catch (error) {
    console.error('Error updating about page content:', error);
    res.status(500).json({ error: 'Failed to update about page content' });
  }
});

// Update specific about page content (protected route)
router.put('/:id', verifyCognitoToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (id !== 'about-page-settings') {
      return res.status(400).json({ error: 'Invalid about page ID' });
    }

    const aboutPage = await AboutPage.getSettings();
    await aboutPage.update(updates);

    res.json({ 
      message: 'About page content updated successfully',
      aboutPage 
    });
    
  } catch (error) {
    console.error('Error updating about page content:', error);
    res.status(500).json({ error: 'Failed to update about page content' });
  }
});

// Delete about page content (protected route)
router.delete('/:id', verifyCognitoToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (id !== 'about-page-settings') {
      return res.status(400).json({ error: 'Invalid about page ID' });
    }

    const aboutPage = await AboutPage.getSettings();
    await aboutPage.delete();

    res.json({ message: 'About page content deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting about page content:', error);
    res.status(500).json({ error: 'Failed to delete about page content' });
  }
});

// Get all about page content (for admin panel - protected route)
router.get('/admin/all', verifyCognitoToken, async (req, res) => {
  try {
    const allContent = await AboutPage.getAll();
    res.json(allContent);
  } catch (error) {
    console.error('Error fetching all about page content:', error);
    res.status(500).json({ error: 'Failed to fetch all about page content' });
  }
});

module.exports = router;
