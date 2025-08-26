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

// Test route to check database content
router.get('/api/debug-mission-media', async (req, res) => {
  try {
    console.log('🧪 Debug route called - checking database content...');
    
    if (MissionMedia) {
      try {
        // Try to get the raw data from DynamoDB
        const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
        const { GetCommand } = require('@aws-sdk/lib-dynamodb');
        
        const client = new DynamoDBClient({
          region: process.env.AWS_REGION || 'us-west-2',
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        });
        
        const command = new GetCommand({
          TableName: 'bow-mission-media',
          Key: { id: 'mission-media' }
        });
        
        const result = await client.send(command);
        console.log('🧪 Raw DynamoDB result:', result);
        
        res.json({
          success: true,
          rawData: result.Item,
          hasData: !!result.Item,
          tableName: 'bow-mission-media'
        });
      } catch (error) {
        console.error('❌ Debug route error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    } else {
      res.status(500).json({
        success: false,
        error: 'MissionMedia model not loaded'
      });
    }
  } catch (error) {
    console.error('❌ Debug route error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test route to verify database connection
router.get('/api/test-mission-media', async (req, res) => {
  try {
    console.log('🧪 Testing mission media database connection...');
    console.log('🔍 MissionMedia model available:', !!MissionMedia);
    
    if (MissionMedia) {
      try {
        const result = await MissionMedia.getMissionMedia();
        console.log('✅ Database connection successful, got result:', result);
        res.json({
          success: true,
          message: 'Database connection successful',
          data: result
        });
      } catch (error) {
        console.error('❌ Database connection failed:', error);
        res.status(500).json({
          success: false,
          error: 'Database connection failed',
          details: error.message
        });
      }
    } else {
      res.status(500).json({
        success: false,
        error: 'MissionMedia model not loaded'
      });
    }
  } catch (error) {
    console.error('❌ Test route error:', error);
    res.status(500).json({
      success: false,
      error: 'Test route error',
      details: error.message
    });
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
          title: '',
          description: '',
          altText: '',
          isActive: true,
          overlayOpacity: 0.2,
          missionTitle: '',
          missionDescription: '',
          missionLegacy: ''
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
        title: '',
        description: '',
        altText: '',
        isActive: true,
        overlayOpacity: 0.2,
        missionTitle: '',
        missionDescription: '',
        missionLegacy: ''
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
    console.log('📋 Request headers:', req.headers);
    
    const { mediaType, mediaUrl, thumbnailUrl, title, description, altText, isActive, overlayOpacity, missionTitle, missionDescription, missionLegacy } = req.body;
    
    console.log('📝 Extracted fields:', { mediaType, mediaUrl, thumbnailUrl, title, description, altText, isActive, overlayOpacity, missionTitle, missionDescription, missionLegacy });
    
    // Validate required fields - allow saving content without media
    if (!mediaType && !mediaUrl && !missionTitle && !missionDescription && !missionLegacy) {
      console.log('❌ Validation failed: either media file or mission content is required');
      return res.status(400).json({ error: 'Either media file or mission content is required' });
    }
    
    console.log('✅ Validation passed, proceeding with save...');
    console.log('🔍 MissionMedia model available:', !!MissionMedia);
    
    if (MissionMedia) {
      console.log('📚 MissionMedia model loaded successfully');
      try {
        console.log('🔄 Getting existing mission media from DynamoDB...');
        let missionMedia;
        try {
          missionMedia = await MissionMedia.getMissionMedia();
          console.log('📋 Existing mission media:', missionMedia);
        } catch (getError) {
          console.log('⚠️  No existing mission media found, will create new record');
          console.log('⚠️  Get error details:', getError.message);
          missionMedia = null;
        }
        
        let updatedMedia;
        if (missionMedia) {
          console.log('🔄 Updating existing mission media in DynamoDB...');
          updatedMedia = await missionMedia.update({
            mediaType: mediaType || missionMedia.mediaType || 'image',
            mediaUrl: mediaUrl || missionMedia.mediaUrl || '',
            thumbnailUrl: thumbnailUrl || missionMedia.thumbnailUrl || '',
            title: title || missionMedia.title || '',
            description: description || missionMedia.description || '',
            altText: altText || missionMedia.altText || '',
            isActive: isActive !== undefined ? isActive : missionMedia.isActive !== undefined ? missionMedia.isActive : true,
            overlayOpacity: overlayOpacity !== undefined ? overlayOpacity : missionMedia.overlayOpacity || 0.2,
            missionTitle: missionTitle || missionMedia.missionTitle || '',
            missionDescription: missionDescription || missionMedia.missionDescription || '',
            missionLegacy: missionLegacy || missionMedia.missionLegacy || ''
          });
        } else {
          console.log('🔄 Creating new mission media record in DynamoDB...');
          // Create new record if none exists
          const newMissionMedia = new MissionMedia({
            mediaType: mediaType || 'image',
            mediaUrl: mediaUrl || '',
            thumbnailUrl: thumbnailUrl || '',
            title: title || '',
            description: description || '',
            altText: altText || '',
            isActive: isActive !== undefined ? isActive : true,
            overlayOpacity: overlayOpacity !== undefined ? overlayOpacity : 0.2,
            missionTitle: missionTitle || '',
            missionDescription: missionDescription || '',
            missionLegacy: missionLegacy || ''
          });
          updatedMedia = await newMissionMedia.save();
        }
        
        console.log('✅ Mission media saved successfully in DynamoDB:', updatedMedia);
        
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
          missionTitle: missionTitle || '',
          missionDescription: missionDescription || '',
          missionLegacy: missionLegacy || ''
        }
      });
    }
  } catch (err) {
    console.error('❌ Error updating mission media:', err);
    res.status(500).json({ error: err.message });
  }
});

// API: Get founder media
router.get('/api/founder-media', async (req, res) => {
  try {
    console.log('🚀 GET /api/founder-media called');
    
    // Try to use DynamoDB Founder model, fallback to default data if not available
    let Founder;
    try {
      Founder = require('../models-dynamodb/Founder');
      console.log('✅ Using DynamoDB Founder model');
    } catch (error) {
      console.log('⚠️  DynamoDB Founder model not available, using fallback data');
      Founder = null;
    }

    if (Founder) {
      try {
        // Find Deepali Sane by name
        const deepali = await Founder.findByName('Deepali Sane');
        if (deepali) {
          console.log('📋 Found Deepali Sane in DynamoDB:', deepali);
          console.log('🔍 Raw founder data:', {
            mediaType: deepali.mediaType,
            mediaUrl: deepali.mediaUrl,
            thumbnailUrl: deepali.thumbnailUrl,
            mediaTitle: deepali.mediaTitle,
            mediaDescription: deepali.mediaDescription,
            mediaAltText: deepali.mediaAltText,
            isMediaActive: deepali.isMediaActive,
            mediaOverlayOpacity: deepali.mediaOverlayOpacity,
            name: deepali.name,
            role: deepali.role
          });
          
          const responseData = {
            mediaType: deepali.mediaType || 'image',
            mediaUrl: deepali.mediaUrl || '',
            thumbnailUrl: deepali.thumbnailUrl || '',
            title: deepali.mediaTitle || '',
            description: deepali.mediaDescription || '',
            altText: deepali.mediaAltText || '',
            isActive: deepali.isMediaActive || false,
            overlayOpacity: deepali.mediaOverlayOpacity || 0.1,
            founderName: deepali.name || 'Deepali Sane',
            founderRole: deepali.role || 'Vice Chair & Co-Founder'
          };
          
          console.log('📤 Sending response data:', responseData);
          console.log('🎯 Media display conditions:');
          console.log(`   - mediaUrl exists: ${!!responseData.mediaUrl}`);
          console.log(`   - isActive: ${responseData.isActive}`);
          console.log(`   - Will display: ${!!(responseData.mediaUrl && responseData.isActive)}`);
          
          res.json(responseData);
        } else {
          console.log('📋 Deepali Sane not found in DynamoDB, returning default data');
          // Return default data if founder not found
          const defaultFounderMedia = {
            mediaType: 'image',
            mediaUrl: '',
            thumbnailUrl: '',
            title: '',
            description: '',
            altText: '',
            isActive: false,
            overlayOpacity: 0.1,
            founderName: 'Deepali Sane',
            founderRole: 'Vice Chair & Co-Founder'
          };
          res.json(defaultFounderMedia);
        }
      } catch (dynamoError) {
        console.log('⚠️  DynamoDB error, using fallback data:', dynamoError.message);
        // Fallback to default data when DynamoDB fails
        const defaultFounderMedia = {
          mediaType: 'image',
          mediaUrl: '',
          thumbnailUrl: '',
          title: '',
          description: '',
          altText: '',
          isActive: false,
          overlayOpacity: 0.1,
          founderName: 'Deepali Sane',
          founderRole: 'Vice Chair & Co-Founder'
        };
        res.json(defaultFounderMedia);
      }
    } else {
      // Fallback to default data when DynamoDB model is not available
      const defaultFounderMedia = {
        mediaType: 'image',
        mediaUrl: '',
        thumbnailUrl: '',
        title: '',
        description: '',
        altText: '',
        isActive: false,
        overlayOpacity: 0.1,
        founderName: 'Deepali Sane',
        founderRole: 'Vice Chair & Co-Founder'
      };
      res.json(defaultFounderMedia);
    }
  } catch (err) {
    console.error('❌ Error fetching founder media:', err);
    res.status(500).json({ error: err.message });
  }
});

// API: Update founder media (admin only)
router.put('/api/founder-media', async (req, res) => {
  try {
    console.log('🚀 PUT /api/founder-media called with body:', req.body);
    
    const { mediaType, mediaUrl, thumbnailUrl, title, description, altText, isActive, overlayOpacity, founderName, founderRole } = req.body;
    
    console.log('📝 Extracted fields:', { mediaType, mediaUrl, thumbnailUrl, title, description, altText, isActive, overlayOpacity, founderName, founderRole });
    
    // Try to use DynamoDB Founder model, fallback to success response if not available
    let Founder;
    try {
      Founder = require('../models-dynamodb/Founder');
      console.log('✅ Using DynamoDB Founder model for update');
    } catch (error) {
      console.log('⚠️  DynamoDB Founder model not available, using fallback mode');
      Founder = null;
    }

    if (Founder) {
      try {
        // Find Deepali Sane by name
        let deepali = await Founder.findByName('Deepali Sane');
        
        if (deepali) {
          // Update existing founder
          console.log('📝 Updating existing founder:', deepali.id);
          console.log('📝 Update data:', {
            mediaType,
            mediaUrl,
            thumbnailUrl,
            mediaTitle: title,
            mediaDescription: description,
            mediaAltText: altText,
            isMediaActive: isActive,
            mediaOverlayOpacity: overlayOpacity
          });
          
          await deepali.update({
            mediaType,
            mediaUrl,
            thumbnailUrl,
            mediaTitle: title,
            mediaDescription: description,
            mediaAltText: altText,
            isMediaActive: isActive,
            mediaOverlayOpacity: overlayOpacity
          });
          console.log('✅ Founder updated successfully in DynamoDB');
          
          // Verify the update by fetching the founder again
          const updatedFounder = await Founder.findByName('Deepali Sane');
          console.log('🔍 Verification - Updated founder data:', updatedFounder);
        } else {
          // Create new founder if not found
          console.log('📝 Creating new founder for Deepali Sane');
          console.log('📝 Create data:', {
            name: founderName || 'Deepali Sane',
            role: founderRole || 'Vice Chair & Co-Founder',
            mediaType,
            mediaUrl,
            thumbnailUrl,
            mediaTitle: title,
            mediaDescription: description,
            mediaAltText: altText,
            isMediaActive: isActive,
            mediaOverlayOpacity: overlayOpacity
          });
          
          deepali = await Founder.create({
            name: founderName || 'Deepali Sane',
            role: founderRole || 'Vice Chair & Co-Founder',
            mediaType,
            mediaUrl,
            thumbnailUrl,
            mediaTitle: title,
            mediaDescription: description,
            mediaAltText: altText,
            isMediaActive: isActive,
            mediaOverlayOpacity: overlayOpacity
          });
          console.log('✅ New founder created successfully in DynamoDB');
          console.log('🔍 Verification - Created founder data:', deepali);
        }
        
        res.json({
          success: true,
          message: 'Founder media updated successfully in DynamoDB',
          data: {
            id: deepali.id,
            mediaType,
            mediaUrl,
            thumbnailUrl,
            title,
            description,
            altText,
            isActive,
            overlayOpacity,
            founderName: deepali.name,
            founderRole: deepali.role
          }
        });
      } catch (dynamoError) {
        console.error('❌ DynamoDB error during update:', dynamoError);
        res.status(500).json({ 
          error: 'Failed to update founder media in database',
          details: dynamoError.message 
        });
      }
    } else {
      // Fallback mode - just log the data and return success
      console.log('✅ Founder media update received, logging data for future implementation');
      res.json({
        success: true,
        message: 'Founder media updated successfully (fallback mode)',
        data: {
          mediaType,
          mediaUrl,
          thumbnailUrl,
          title,
          description,
          altText,
          isActive,
          overlayOpacity,
          founderName,
          founderRole
        }
      });
    }
  } catch (err) {
    console.error('❌ Error updating founder media:', err);
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
          description: description !== undefined ? description : 'Beats of Washington connects, inspires, and celebrates cultural diversity through music and community events across Washington State since 2019.',
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
          description: description !== undefined ? description : 'Beats of Washington connects, inspires, and celebrates cultural diversity through music and community events across Washington State since 2019.',
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
        description: description !== undefined ? description : 'Beats of Washington connects, inspires, and celebrates cultural diversity through music and community events across Washington State since 2019.',
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
