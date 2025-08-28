const express = require('express');
const router = express.Router();

// Try to use DynamoDB StoriesMedia model, fallback to in-memory if not available
let StoriesMedia;
try {
  StoriesMedia = require('../models-dynamodb/StoriesMedia');
  console.log('✅ Using DynamoDB StoriesMedia model');
} catch (error) {
  console.log('⚠️  DynamoDB StoriesMedia model not available, using in-memory storage');
  StoriesMedia = null;
}

// In-memory storage fallback for stories media
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
    
    if (StoriesMedia) {
      try {
        const data = await StoriesMedia.getCurrent();
        console.log('✅ Stories media loaded from DynamoDB:', data);
        res.json(data);
      } catch (dynamoError) {
        console.log('⚠️  DynamoDB error, using fallback data:', dynamoError.message);
        res.json(storiesMedia);
      }
    } else {
      // Fallback to in-memory storage
      res.json(storiesMedia);
    }
  } catch (error) {
    console.error('❌ Error getting stories media:', error);
    res.status(500).json({ error: 'Failed to get stories media' });
  }
});

// PUT /stories-media - Update stories media
router.put('/', async (req, res) => {
  try {
    console.log('💾 Updating stories media with data:', req.body);
    
    if (StoriesMedia) {
      try {
        const updated = await StoriesMedia.update(req.body);
        console.log('✅ Stories media updated successfully in DynamoDB:', updated);
        res.json(updated);
      } catch (dynamoError) {
        console.log('⚠️  DynamoDB error, using fallback update:', dynamoError.message);
        // Fallback to in-memory update
        storiesMedia = {
          ...storiesMedia,
          ...req.body
        };
        res.json(storiesMedia);
      }
    } else {
      // Fallback to in-memory update
      storiesMedia = {
        ...storiesMedia,
        ...req.body
      };
      console.log('✅ Stories media updated successfully in memory:', storiesMedia);
      res.json(storiesMedia);
    }
  } catch (error) {
    console.error('❌ Error updating stories media:', error);
    res.status(500).json({ error: 'Failed to update stories media' });
  }
});

// POST /stories-media - Create new stories media (alias for PUT)
router.post('/', async (req, res) => {
  try {
    console.log('📝 Creating new stories media with data:', req.body);
    
    if (StoriesMedia) {
      try {
        const updated = await StoriesMedia.update(req.body);
        console.log('✅ Stories media created successfully in DynamoDB:', updated);
        res.json(updated);
      } catch (dynamoError) {
        console.log('⚠️  DynamoDB error, using fallback create:', dynamoError.message);
        // Fallback to in-memory create
        storiesMedia = {
          ...storiesMedia,
          ...req.body
        };
        res.json(storiesMedia);
      }
    } else {
      // Fallback to in-memory create
      storiesMedia = {
        ...storiesMedia,
        ...req.body
      };
      console.log('✅ Stories media created successfully in memory:', storiesMedia);
      res.json(storiesMedia);
    }
  } catch (error) {
    console.error('❌ Error creating stories media:', error);
    res.status(500).json({ error: 'Failed to create stories media' });
  }
});

// DELETE /stories-media - Reset stories media to defaults
router.delete('/', async (req, res) => {
  try {
    console.log('🗑️ Resetting stories media to defaults...');
    
    if (StoriesMedia) {
      try {
        const reset = await StoriesMedia.reset();
        console.log('✅ Stories media reset successfully in DynamoDB:', reset);
        res.json({ message: 'Stories media reset to defaults' });
      } catch (dynamoError) {
        console.log('⚠️  DynamoDB error, using fallback reset:', dynamoError.message);
        // Fallback to in-memory reset
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
        res.json({ message: 'Stories media reset to defaults (fallback)' });
      }
    } else {
      // Fallback to in-memory reset
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
      console.log('✅ Stories media reset successfully in memory');
      res.json({ message: 'Stories media reset to defaults (fallback)' });
    }
  } catch (error) {
    console.error('❌ Error resetting stories media:', error);
    res.status(500).json({ error: 'Failed to reset stories media' });
  }
});

module.exports = router;
