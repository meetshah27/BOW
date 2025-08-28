const express = require('express');
const router = express.Router();

// In-memory storage for stories media (replace with database in production)
let storiesMedia = {
  mediaType: 'image',
  mediaUrl: '',
  thumbnailUrl: '',
  title: '',
  description: '',
  altText: '',
  isActive: true,
  overlayOpacity: 0.2,
  storiesTitle: 'Community Stories',
  storiesDescription: 'Discover the inspiring journeys of individuals whose lives have been touched by Beats of Washington. Each story reflects the impact of our community and the power of coming together.',
  storiesSubtitle: ''
};

// GET /stories-media - Get current stories media
router.get('/', async (req, res) => {
  try {
    console.log('📖 Getting stories media...');
    res.json(storiesMedia);
  } catch (error) {
    console.error('❌ Error getting stories media:', error);
    res.status(500).json({ error: 'Failed to get stories media' });
  }
});

// PUT /stories-media - Update stories media
router.put('/', async (req, res) => {
  try {
    console.log('💾 Updating stories media with data:', req.body);
    
    // Update the stories media object
    storiesMedia = {
      ...storiesMedia,
      ...req.body
    };
    
    console.log('✅ Stories media updated successfully:', storiesMedia);
    res.json(storiesMedia);
  } catch (error) {
    console.error('❌ Error updating stories media:', error);
    res.status(500).json({ error: 'Failed to update stories media' });
  }
});

// POST /stories-media - Create new stories media (alias for PUT)
router.post('/', async (req, res) => {
  try {
    console.log('📝 Creating new stories media with data:', req.body);
    
    // Update the stories media object
    storiesMedia = {
      ...storiesMedia,
      ...req.body
    };
    
    console.log('✅ Stories media created successfully:', storiesMedia);
    res.json(storiesMedia);
  } catch (error) {
    console.error('❌ Error creating stories media:', error);
    res.status(500).json({ error: 'Failed to create stories media' });
  }
});

// DELETE /stories-media - Reset stories media to defaults
router.delete('/', async (req, res) => {
  try {
    console.log('🗑️ Resetting stories media to defaults...');
    
    // Reset to default values
    storiesMedia = {
      mediaType: 'image',
      mediaUrl: '',
      thumbnailUrl: '',
      title: '',
      description: '',
      altText: '',
      isActive: true,
      overlayOpacity: 0.2,
      storiesTitle: 'Community Stories',
      storiesDescription: 'Discover the inspiring journeys of individuals whose lives have been touched by Beats of Washington. Each story reflects the impact of our community and the power of coming together.',
      storiesSubtitle: ''
    };
    
    console.log('✅ Stories media reset successfully');
    res.json({ message: 'Stories media reset to defaults' });
  } catch (error) {
    console.error('❌ Error resetting stories media:', error);
    res.status(500).json({ error: 'Failed to reset stories media' });
  }
});

module.exports = router;
