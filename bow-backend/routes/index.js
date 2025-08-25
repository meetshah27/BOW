var express = require('express');
var router = express.Router();

// Try to load DynamoDB models, fallback to sample data if not available
let Story, Founder, Event, MissionMedia;

try {
  Story = require('../models-dynamodb/Story');
  Founder = require('../models-dynamodb/User');
  Event = require('../models-dynamodb/Event');
  MissionMedia = require('../models-dynamodb/MissionMedia');
} catch (error) {
  console.log('⚠️  DynamoDB models not available, using sample data');
}

// API: Get all stories
router.get('/api/stories', async (req, res) => {
  try {
    if (Story) {
      try {
        const stories = await Story.findAll();
        // Sort by date (newest first)
        stories.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(stories);
      } catch (dynamoError) {
        console.log('⚠️  DynamoDB error, using fallback data:', dynamoError.message);
        // Fallback to sample data when DynamoDB fails
        const sampleStories = [
          {
            id: '1',
            title: 'How Music Brought Our Community Together',
            author: 'Sarah Johnson',
            authorImage: '/assets/authors/sarah-johnson.jpg',
            category: 'Community',
            image: '/assets/stories/community-music.jpg',
            excerpt: 'When I first moved to Washington, I felt isolated and alone. But everything changed when I discovered Beats of Washington\'s community music program.',
            date: '2024-01-15',
            readTime: '8 min read',
            tags: ['community', 'music', 'newcomer', 'friendship'],
            likes: 45,
            comments: 12,
            featured: true
          },
          {
            id: '2',
            title: 'The Power of Cultural Exchange Through Music',
            author: 'Raj Patel',
            authorImage: '/assets/authors/raj-patel.jpg',
            category: 'Culture',
            image: '/assets/stories/cultural-exchange.jpg',
            excerpt: 'Growing up in a traditional Indian household, I never imagined I\'d be teaching Western music to American students while learning their cultural traditions.',
            date: '2024-02-20',
            readTime: '6 min read',
            tags: ['culture', 'fusion', 'teaching', 'exchange'],
            likes: 38,
            comments: 8,
            featured: false
          },
          {
            id: '3',
            title: 'From Shy Student to Confident Performer',
            author: 'Emily Chen',
            authorImage: '/assets/authors/emily-chen.jpg',
            category: 'Personal Growth',
            image: '/assets/stories/personal-growth.jpg',
            excerpt: 'I was always the quiet one in class, afraid to speak up or perform. BOW\'s supportive environment helped me find my voice and confidence.',
            date: '2024-03-10',
            readTime: '7 min read',
            tags: ['confidence', 'performance', 'vocal', 'growth'],
            likes: 52,
            comments: 15,
            featured: true
          },
          {
            id: '4',
            title: 'Building Bridges Through Music Education',
            author: 'Dr. Maria Rodriguez',
            authorImage: '/assets/authors/maria-rodriguez.jpg',
            category: 'Education',
            image: '/assets/stories/music-education.jpg',
            excerpt: 'As an educator, I\'ve seen firsthand how music can transform learning environments and help students develop essential life skills.',
            date: '2024-01-28',
            readTime: '9 min read',
            tags: ['education', 'children', 'learning', 'development'],
            likes: 41,
            comments: 11,
            featured: false
          },
          {
            id: '5',
            title: 'Finding Purpose Through Volunteer Work',
            author: 'Michael Thompson',
            authorImage: '/assets/authors/michael-thompson.jpg',
            category: 'Volunteering',
            image: '/assets/stories/volunteer-work.jpg',
            excerpt: 'After retiring from my corporate job, I felt lost and purposeless. Volunteering with BOW gave me a new sense of meaning and community.',
            date: '2024-02-15',
            readTime: '8 min read',
            tags: ['volunteering', 'retirement', 'purpose', 'community'],
            likes: 35,
            comments: 9,
            featured: false
          }
        ];
        res.json(sampleStories);
      }
    } else {
      // Fallback to sample data when DynamoDB models aren't available
      const sampleStories = [
        {
          id: '1',
          title: 'How Music Brought Our Community Together',
          author: 'Sarah Johnson',
          authorImage: '/assets/authors/sarah-johnson.jpg',
          category: 'Community',
          image: '/assets/stories/community-music.jpg',
          excerpt: 'When I first moved to Washington, I felt isolated and alone. But everything changed when I discovered Beats of Washington\'s community music program.',
          date: '2024-01-15',
          readTime: '8 min read',
          tags: ['community', 'music', 'newcomer', 'friendship'],
          likes: 45,
          comments: 12,
          featured: true
        },
        {
          id: '2',
          title: 'The Power of Cultural Exchange Through Music',
          author: 'Raj Patel',
          authorImage: '/assets/authors/raj-patel.jpg',
          category: 'Culture',
          image: '/assets/stories/cultural-exchange.jpg',
          excerpt: 'Growing up in a traditional Indian household, I never imagined I\'d be teaching Western music to American students while learning their cultural traditions.',
          date: '2024-02-20',
          readTime: '6 min read',
          tags: ['culture', 'fusion', 'teaching', 'exchange'],
          likes: 38,
          comments: 8,
          featured: false
        },
        {
          id: '3',
          title: 'From Shy Student to Confident Performer',
          author: 'Emily Chen',
          authorImage: '/assets/authors/emily-chen.jpg',
          category: 'Personal Growth',
          image: '/assets/stories/personal-growth.jpg',
          excerpt: 'I was always the quiet one in class, afraid to speak up or perform. BOW\'s supportive environment helped me find my voice and confidence.',
          date: '2024-03-10',
          readTime: '7 min read',
          tags: ['confidence', 'performance', 'vocal', 'growth'],
          likes: 52,
          comments: 15,
          featured: true
        }
      ];
      res.json(sampleStories);
    }
  } catch (err) {
    console.error('Error fetching stories:', err);
    res.status(500).json({ error: err.message });
  }
});

// API: Get all founders (users with admin role)
router.get('/api/founders', async (req, res) => {
  try {
    if (Founder) {
      try {
        const founders = await Founder.findByRole('admin');
        res.json(founders);
      } catch (dynamoError) {
        console.log('⚠️  DynamoDB error for founders, using fallback data:', dynamoError.message);
        // Fallback to sample data when DynamoDB fails
        const sampleFounders = [
          {
            uid: 'founder-aand-sane',
            displayName: 'Aand Sane',
            firstName: 'Aand',
            lastName: 'Sane',
            role: 'admin',
            photoURL: '/assets/founders.png'
          },
          {
            uid: 'founder-deepali-sane',
            displayName: 'Deepali Sane',
            firstName: 'Deepali',
            lastName: 'Sane',
            role: 'admin',
            photoURL: '/assets/founders.png'
          }
        ];
        res.json(sampleFounders);
      }
    } else {
      // Fallback to sample data when DynamoDB models aren't available
      const sampleFounders = [
        {
          uid: 'founder-aand-sane',
          displayName: 'Aand Sane',
          firstName: 'Aand',
          lastName: 'Sane',
          role: 'admin',
          photoURL: '/assets/founders.png'
        },
        {
          uid: 'founder-deepali-sane',
          displayName: 'Deepali Sane',
          firstName: 'Deepali',
          lastName: 'Sane',
          role: 'admin',
          photoURL: '/assets/founders.png'
        }
      ];
      res.json(sampleFounders);
    }
  } catch (err) {
    console.error('Error fetching founders:', err);
    res.status(500).json({ error: err.message });
  }
});

// API: Get all events
router.get('/api/events', async (req, res) => {
  try {
    if (Event) {
      try {
        const events = await Event.findAll();
        res.json(events);
      } catch (dynamoError) {
        console.log('⚠️  DynamoDB error for events, using fallback data:', dynamoError.message);
        // Fallback to sample data when DynamoDB fails
        const sampleEvents = [
          {
            id: 'event-1',
            title: 'Summer Music Festival',
            description: 'Join us for a day of music, food, and community celebration.',
            date: '2024-07-15',
            location: 'Seattle Center',
            category: 'Festival',
            image: '/assets/event-1.jpg',
            featured: true,
            isLive: true,
            isActive: true,
            registeredCount: 45,
            capacity: 100
          },
          {
            id: 'event-2',
            title: 'Cultural Workshop Series',
            description: 'Learn about different musical traditions from around the world.',
            date: '2024-06-20',
            location: 'Community Center',
            category: 'Workshop',
            image: '/assets/event-2.jpg',
            featured: false,
            isLive: true,
            isActive: true,
            registeredCount: 12,
            capacity: 25
          }
        ];
        res.json(sampleEvents);
      }
    } else {
      // Fallback to sample data when DynamoDB models aren't available
      const sampleEvents = [
        {
          id: 'event-1',
          title: 'Summer Music Festival',
          description: 'Join us for a day of music, food, and community celebration.',
          date: '2024-07-15',
          location: 'Seattle Center',
          category: 'Festival',
          image: '/assets/event-1.jpg',
          featured: true,
          isLive: true,
          isActive: true,
          registeredCount: 45,
          capacity: 100
        },
        {
          id: 'event-2',
          title: 'Cultural Workshop Series',
          description: 'Learn about different musical traditions from around the world.',
          date: '2024-06-20',
          location: 'Community Center',
          category: 'Workshop',
          image: '/assets/event-2.jpg',
          featured: false,
          isLive: true,
          isActive: true,
          registeredCount: 12,
          capacity: 25
        }
      ];
      res.json(sampleEvents);
    }
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: err.message });
  }
});

// API: Get hero settings
router.get('/api/hero', async (req, res) => {
  try {
    // Try to use DynamoDB Hero model, fallback to default if not available
    let Hero;
    try {
      Hero = require('../models-dynamodb/Hero');
      console.log('✅ Using DynamoDB Hero model');
    } catch (error) {
      console.log('⚠️  DynamoDB Hero model not available, using fallback mode');
      Hero = null;
    }

    if (Hero) {
      try {
        const heroSettings = await Hero.getSettings();
        res.json(heroSettings);
      } catch (dynamoError) {
        console.log('⚠️  DynamoDB error for hero settings, using fallback data:', dynamoError.message);
        // Fallback to default hero settings when DynamoDB fails
        const defaultHeroSettings = {
          backgroundType: 'image',
          backgroundUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
          overlayOpacity: 0.2,
          title: 'Empowering Communities',
          subtitle: 'Through Music',
          description: 'Beats of Washington connects, inspires, and celebrates cultural diversity through music and community events across Washington State since 2019.',
          isActive: true
        };
        res.json(defaultHeroSettings);
      }
    } else {
      // Fallback to default hero settings when DynamoDB models aren't available
      const defaultHeroSettings = {
        backgroundType: 'image',
        backgroundUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        overlayOpacity: 0.2,
        title: 'Empowering Communities',
        subtitle: 'Through Music',
        description: 'Beats of Washington connects, inspires, and celebrates cultural diversity through music and community events across Washington State since 2019.',
        isActive: true
      };
      res.json(defaultHeroSettings);
    }
  } catch (err) {
    console.error('Error fetching hero settings:', err);
    res.status(500).json({ error: err.message });
  }
});

// API: Get mission media
router.get('/api/mission-media', async (req, res) => {
  try {
    console.log('🚀 GET /api/mission-media called');
    
    if (MissionMedia) {
      try {
        console.log('🔄 Fetching mission media from DynamoDB...');
        const missionMedia = await MissionMedia.getMissionMedia();
        console.log('✅ Successfully fetched mission media:', missionMedia);
        res.json(missionMedia);
      } catch (dynamoError) {
        console.log('⚠️  DynamoDB error for mission media, using fallback data:', dynamoError.message);
        console.error('❌ DynamoDB error details:', dynamoError);
        
        // Check if it's a table not found error
        if (dynamoError.name === 'ResourceNotFoundException') {
          console.error('❌ DynamoDB table does not exist!');
          console.error('❌ Please run: node create-mission-media-table.js');
        }
        
        // Fallback to default mission media when DynamoDB fails
        const defaultMissionMedia = {
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          thumbnailUrl: '',
          title: 'Our Mission',
          description: 'Beats of Washington Mission',
          altText: 'Mission media',
          isActive: true,
          overlayOpacity: 0.2,
          missionTitle: 'Our Mission',
          missionDescription: 'Beats of Washington is a dynamic non-profit organization rooted in Washington, USA. Our unwavering commitment lies in preserving and promoting Indian cultural heritage. Through rhythmic expressions, vibrant performances, and community engagement, we weave a tapestry that resonates across generations.',
          missionLegacy: 'Our Beat, Our Legacy: As the sun sets over Redmond, our Dhol-Tasha drums continue to resonate—a testament to our unyielding commitment.'
        };
        console.log('📋 Using fallback data:', defaultMissionMedia);
        res.json(defaultMissionMedia);
      }
    } else {
      console.log('⚠️  Using fallback mode (no DynamoDB models)');
      // Fallback to default mission media when DynamoDB models aren't available
      const defaultMissionMedia = {
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        thumbnailUrl: '',
        title: 'Our Mission',
        description: 'Beats of Washington Mission',
        altText: 'Mission media',
        isActive: true,
        overlayOpacity: 0.2,
        missionTitle: 'Our Mission',
        missionDescription: 'Beats of Washington is a dynamic non-profit organization rooted in Washington, USA. Our unwavering commitment lies in preserving and promoting Indian cultural heritage. Through rhythmic expressions, vibrant performances, and community engagement, we weave a tapestry that resonates across generations.',
        missionLegacy: 'Our Beat, Our Legacy: As the sun sets over Redmond, our Dhol-Tasha drums continue to resonate—a testament to our unyielding commitment.'
      };
      console.log('📋 Using fallback data:', defaultMissionMedia);
      res.json(defaultMissionMedia);
    }
  } catch (err) {
    console.error('❌ Error fetching mission media:', err);
    res.status(500).json({ error: err.message });
  }
});

// API: Update mission media (admin only)
router.put('/api/mission-media', async (req, res) => {
  try {
    console.log('🚀 PUT /api/mission-media called with body:', req.body);
    
    const { mediaType, mediaUrl, thumbnailUrl, title, description, altText, isActive, overlayOpacity, missionTitle, missionDescription, missionLegacy } = req.body;
    
    console.log('📝 Extracted fields:', { mediaType, mediaUrl, thumbnailUrl, title, description, altText, isActive, overlayOpacity, missionTitle, missionDescription, missionLegacy });
    
    // Validate required fields
    if (!mediaType) {
      console.log('❌ Validation failed: mediaType is required');
      return res.status(400).json({ error: 'Media type is required (image or video)' });
    }
    
    if (!mediaUrl) {
      console.log('❌ Validation failed: mediaUrl is required');
      return res.status(400).json({ error: 'Media URL is required' });
    }
    
    // Validate media type
    if (!['image', 'video'].includes(mediaType)) {
      console.log('❌ Validation failed: invalid mediaType:', mediaType);
      return res.status(400).json({ error: 'Media type must be either "image" or "video"' });
    }
    
    // Basic URL validation
    if (!mediaUrl.startsWith('http') && !mediaUrl.startsWith('blob:') && !mediaUrl.startsWith('data:')) {
      console.log('❌ Validation failed: invalid mediaUrl:', mediaUrl);
      return res.status(400).json({ error: 'Media URL must be a valid HTTP URL, blob URL, or data URL' });
    }
    
    console.log('✅ Validation passed, proceeding with save...');
    
    if (MissionMedia) {
      try {
        console.log('🔄 Getting existing mission media from DynamoDB...');
        const missionMedia = await MissionMedia.getMissionMedia();
        console.log('📋 Existing mission media:', missionMedia);
        
        console.log('🔄 Updating mission media in DynamoDB...');
        const updatedMedia = await missionMedia.update({
          mediaType,
          mediaUrl,
          thumbnailUrl: thumbnailUrl || '',
          title: title || 'Our Mission',
          description: description || 'Beats of Washington Mission',
          altText: altText || 'Mission media',
          isActive: isActive !== undefined ? isActive : true,
          overlayOpacity: overlayOpacity !== undefined ? overlayOpacity : 0.2,
          missionTitle: missionTitle || 'Our Mission',
          missionDescription: missionDescription || 'Beats of Washington is a dynamic non-profit organization rooted in Washington, USA. Our unwavering commitment lies in preserving and promoting Indian cultural heritage. Through rhythmic expressions, vibrant performances, and community engagement, we weave a tapestry that resonates across generations.',
          missionLegacy: missionLegacy || 'Our Beat, Our Legacy: As the sun sets over Redmond, our Dhol-Tasha drums continue to resonate—a testament to our unyielding commitment.'
        });
        
        console.log('✅ Mission media updated successfully in DynamoDB:', updatedMedia);
        
        res.json({
          success: true,
          message: 'Mission media updated successfully',
          data: updatedMedia
        });
      } catch (dynamoError) {
        console.error('❌ DynamoDB error updating mission media:', dynamoError);
        console.error('❌ Error name:', dynamoError.name);
        console.error('❌ Error message:', dynamoError.message);
        console.error('❌ Error stack:', dynamoError.stack);
        
        // Check if it's a table not found error
        if (dynamoError.name === 'ResourceNotFoundException') {
          console.error('❌ DynamoDB table does not exist!');
          res.status(500).json({
            success: false,
            error: 'DynamoDB table does not exist. Please create the table first.',
            details: 'Run: node create-mission-media-table.js'
          });
        } else if (dynamoError.name === 'AccessDeniedException') {
          console.error('❌ Access denied to DynamoDB!');
          res.status(500).json({
            success: false,
            error: 'Access denied to DynamoDB. Check your AWS credentials.',
            details: dynamoError.message
          });
        } else {
          res.status(500).json({
            success: false,
            error: 'Failed to update mission media in database',
            details: dynamoError.message
          });
        }
      }
    } else {
      console.log('⚠️  Using fallback mode (no DynamoDB)');
      // Fallback response when DynamoDB is not available
      res.json({
        success: true,
        message: 'Mission media updated successfully (fallback mode)',
        data: {
          mediaType,
          mediaUrl,
          thumbnailUrl: thumbnailUrl || '',
          title: title || 'Our Mission',
          description: 'Beats of Washington Mission',
          altText: altText || 'Mission media',
          isActive: isActive !== undefined ? isActive : true,
          overlayOpacity: overlayOpacity !== undefined ? overlayOpacity : 0.2,
          missionTitle: missionTitle || 'Our Mission',
          missionDescription: missionDescription || 'Beats of Washington is a dynamic non-profit organization rooted in Washington, USA. Our unwavering commitment lies in preserving and promoting Indian cultural heritage. Through rhythmic expressions, vibrant performances, and community engagement, we weave a tapestry that resonates across generations.',
          missionLegacy: missionLegacy || 'Our Beat, Our Legacy: As the sun sets over Redmond, our Dhol-Tasha drums continue to resonate—a testament to our unyielding commitment.'
        }
      });
    }
  } catch (err) {
    console.error('❌ Error updating mission media:', err);
    res.status(500).json({ error: err.message });
  }
});

// API: Update hero settings (admin only)
router.put('/api/hero', async (req, res) => {
  try {
    const { backgroundType, backgroundUrl, overlayOpacity, title, subtitle, description, isActive } = req.body;
    
    // Validate required fields
    if (!backgroundType) {
      return res.status(400).json({ error: 'Background type is required (image or video)' });
    }
    
    if (!backgroundUrl) {
      return res.status(400).json({ error: 'Background URL is required' });
    }
    
    // Validate background type
    if (!['image', 'video'].includes(backgroundType)) {
      return res.status(400).json({ error: 'Background type must be either "image" or "video"' });
    }
    
    // Basic URL validation (allow blob URLs for local development)
    if (!backgroundUrl.startsWith('http') && !backgroundUrl.startsWith('blob:') && !backgroundUrl.startsWith('data:')) {
      return res.status(400).json({ error: 'Background URL must be a valid HTTP URL, blob URL, or data URL' });
    }
    
    // Try to use DynamoDB Hero model, fallback to success response if not available
    let Hero;
    try {
      Hero = require('../models-dynamodb/Hero');
      console.log('✅ Using DynamoDB Hero model for update');
    } catch (error) {
      console.log('⚠️  DynamoDB Hero model not available, using fallback mode');
      Hero = null;
    }

    if (Hero) {
      try {
        const heroSettings = await Hero.getSettings();
        const updatedSettings = await heroSettings.update({
          backgroundType,
          backgroundUrl,
          overlayOpacity: overlayOpacity || 0.2,
          title: title || 'Empowering Communities',
          subtitle: subtitle || 'Through Music',
          description: description || 'Beats of Washington connects, inspires, and celebrates cultural diversity through music and community events across Washington State since 2019.',
          isActive: isActive !== undefined ? isActive : true
        });
        
        console.log('✅ Hero settings updated in DynamoDB:', updatedSettings);
        res.json({ 
          message: 'Hero settings updated successfully',
          settings: updatedSettings
        });
      } catch (dynamoError) {
        console.log('⚠️  DynamoDB error updating hero settings, using fallback response:', dynamoError.message);
        // Fallback response when DynamoDB fails
        const updatedSettings = {
          backgroundType,
          backgroundUrl,
          overlayOpacity: overlayOpacity || 0.2,
          title: title || 'Empowering Communities',
          subtitle: subtitle || 'Through Music',
          description: description || 'Beats of Washington connects, inspires, and celebrates cultural diversity through music and community events across Washington State since 2019.',
          isActive: isActive !== undefined ? isActive : true,
          updatedAt: new Date().toISOString()
        };
        
        console.log('Hero settings updated (fallback mode):', updatedSettings);
        res.json({ 
          message: 'Hero settings updated successfully (fallback mode)',
          settings: updatedSettings
        });
      }
    } else {
      // Fallback response when DynamoDB models aren't available
      const updatedSettings = {
        backgroundType,
        backgroundUrl,
        overlayOpacity: overlayOpacity || 0.2,
        title: title || 'Empowering Communities',
        subtitle: subtitle || 'Through Music',
        description: description || 'Beats of Washington connects, inspires, and celebrates cultural diversity through music and community events across Washington State since 2019.',
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date().toISOString()
      };
      
      console.log('Hero settings updated (fallback mode):', updatedSettings);
      res.json({ 
        message: 'Hero settings updated successfully (fallback mode)',
        settings: updatedSettings
      });
    }
  } catch (err) {
    console.error('Error updating hero settings:', err);
    res.status(500).json({ error: err.message });
  }
});

// Note: Event creation is handled in routes/events.js
// This route is mounted at /api/events in server.js

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ message: 'Welcome to the BOW API!' });
});

module.exports = router;

// Lambda handler for AWS
exports.handler = async (event, context) => {
  try {
    const path = event.path || event.rawPath || '/';
    const method = event.httpMethod || event.requestContext?.http?.method || 'GET';
    
    console.log(`Lambda request: ${method} ${path}`);
    
    // For API routes, return basic success
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'BOW API is working!',
        path: path,
        method: method,
        timestamp: new Date().toISOString()
      })
    };
    
  } catch (error) {
    console.error('Lambda error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      })
    };
  }
};
