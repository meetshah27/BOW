var express = require('express');
var router = express.Router();

// Try to load DynamoDB models, fallback to sample data if not available
let Story, Founder, Event;

try {
  Story = require('../models-dynamodb/Story');
  Founder = require('../models-dynamodb/User');
  Event = require('../models-dynamodb/Event');
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
        // Sort by date (newest first)
        events.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(events);
      } catch (dynamoError) {
        console.log('⚠️  DynamoDB error for events, using fallback data:', dynamoError.message);
        // Fallback to sample data when DynamoDB fails
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
        res.json(sampleEvents);
      }
    } else {
      // Fallback to sample data when DynamoDB models aren't available
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
      res.json(sampleEvents);
    }
  } catch (err) {
    console.error('Error fetching events:', err);
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
