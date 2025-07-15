const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Stories test route
app.get('/api/stories', (req, res) => {
  // Return sample data for testing
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
    }
  ];
  
  res.json(sampleStories);
});

// Founders test route
app.get('/api/founders', (req, res) => {
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
});

// Events test route
app.get('/api/events', (req, res) => {
  const sampleEvents = [
    {
      id: '1',
      title: 'Summer Music Festival 2024',
      description: 'A three-day celebration of music, culture, and community',
      date: '2024-07-15',
      category: 'Festival',
      featured: true
    }
  ];
  
  res.json(sampleEvents);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  console.log('📝 Available endpoints:');
  console.log('   - GET /api/test');
  console.log('   - GET /api/stories');
  console.log('   - GET /api/founders');
  console.log('   - GET /api/events');
}); 