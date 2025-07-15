const express = require('express');
const router = express.Router();
const verifyCognito = require('../middleware/verifyCognito');

// Try to use DynamoDB Story model, fallback to sample data if not available
let Story;
try {
  Story = require('../models-dynamodb/Story');
  console.log('✅ Using DynamoDB Story model');
} catch (error) {
  console.log('⚠️  DynamoDB Story model not available, using fallback mode');
  Story = null;
}

// Sample stories data for fallback
const sampleStories = [
  {
    id: 'story_1',
    title: "Our Story: More Than Just an Organization—It's Our Passion, Our Dream, Our Baby",
    author: "Deepali Sane & Anand Sane",
    authorImage: "/assets/founders.png",
    category: "founders",
    image: "/assets/founders.png",
    excerpt: "At Beats of Washington, founded in 2019, we believe it's more than just an organization—it's our passion, our dream, our baby. We're committed to nurturing Indian cultural ties, music, and traditions across Washington State.",
    content: "At Beats of Washington, founded in 2019, we believe it's more than just an organization—it's our passion, our dream, our baby. We're committed to nurturing Indian cultural ties, music, and traditions across Washington State. Through community celebrations, charity drives, and free dhol-tasha-dance trainings, we promote peace, prosperity, and cultural awareness for current and future generations. Together, let's create harmony and make every beat count!\n\nWhen we first started this journey, we had a simple vision: to create a space where Indian culture could thrive and be shared with our broader Washington community. We wanted to bridge the gap between cultures, using music and dance as universal languages that everyone could understand and enjoy.\n\nWhat began as a small gathering of friends has grown into something much larger than we ever imagined. Our community celebrations now bring together hundreds of people from diverse backgrounds, all united by the joy of music and dance. Our charity drives have helped countless families in need, and our free training programs have introduced thousands to the rich traditions of Indian music and dance.\n\nThe dhol-tasha-dance trainings are particularly close to our hearts. These traditional Indian percussion instruments and dance forms are not just entertainment—they're a way of preserving our cultural heritage and sharing it with future generations. When we see children and adults alike learning these traditions, we know we're fulfilling our mission.\n\nBut perhaps the most rewarding part of this journey has been watching our community grow and evolve. We've seen friendships form across cultural boundaries, we've witnessed the healing power of music in times of difficulty, and we've celebrated countless moments of pure joy and connection.\n\nAs founders, we often say that BOW is our baby because, like raising a child, it requires constant love, attention, and nurturing. There are challenges and setbacks, but the rewards are immeasurable. Every time we see someone's face light up during a performance, every time we receive a thank you from a family we've helped, every time we watch our community come together in celebration—we know it's all worth it.\n\nWe're committed to continuing this work for many years to come. Our dream is to see BOW grow even stronger, reaching more communities across Washington State and beyond. We want to create a legacy of cultural understanding, community connection, and musical joy that will last for generations.\n\nTo everyone who has been part of this journey—our volunteers, our participants, our supporters, and our community—we say thank you. You've made our dream a reality, and together, we're making every beat count.\n\nWith love and gratitude,\nDeepali Sane & Anand Sane",
    date: new Date("2024-01-20").toISOString(),
    readTime: "8 min read",
    tags: ["founders", "indian culture", "community", "music", "dance", "tradition"],
    likes: 567,
    comments: 89,
    featured: true
  },
  {
    id: 'story_2',
    title: "The Power of Community: How Music Brings Us Together",
    author: "Sarah Johnson",
    authorImage: "/assets/default-author.jpg",
    category: "community",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    excerpt: "Discover how our community events have created lasting friendships and connections across cultural boundaries.",
    content: "When I first attended a BOW event, I had no idea how much it would change my life. What started as a simple curiosity about Indian music and dance has become a deep appreciation for the power of community and cultural exchange.\n\nThrough our monthly gatherings, I've met people from all walks of life - students, professionals, families, and retirees. We all share one common bond: our love for music and the joy it brings to our lives.\n\nThe most beautiful part is seeing how music transcends language barriers. When we're all dancing together to the rhythm of the dhol, it doesn't matter where we come from or what language we speak. We're all connected through the universal language of music.\n\nI've learned so much about Indian culture, traditions, and values. But more importantly, I've learned about the strength of community and how we can support each other through both celebrations and challenges.\n\nBOW has taught me that true community isn't just about living in the same area - it's about sharing experiences, learning from each other, and growing together. Every event, every workshop, every celebration brings us closer as a community.\n\nI'm grateful for the friendships I've made and the cultural understanding I've gained. BOW isn't just an organization - it's a family that welcomes everyone with open arms.",
    date: new Date("2024-02-15").toISOString(),
    readTime: "5 min read",
    tags: ["community", "music", "friendship", "cultural exchange"],
    likes: 234,
    comments: 45,
    featured: false
  },
  {
    id: 'story_3',
    title: "From Student to Teacher: My Journey with BOW",
    author: "Priya Patel",
    authorImage: "/assets/default-author.jpg",
    category: "education",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    excerpt: "How I went from learning traditional Indian dance to teaching others in our community.",
    content: "My journey with BOW began three years ago when I first attended a dance workshop. I had always been interested in my cultural heritage, but I never had the opportunity to learn traditional Indian dance forms.\n\nBOW provided that opportunity, and it changed everything for me. The instructors were patient, encouraging, and passionate about sharing their knowledge. They didn't just teach us the steps - they taught us the meaning behind each movement and the cultural significance of the dances.\n\nAs I learned more, I discovered a passion for teaching. I wanted to share this beautiful art form with others, especially with children who might not otherwise have access to cultural education.\n\nBOW supported my journey by providing opportunities to assist in workshops and eventually lead my own classes. The organization's commitment to education and cultural preservation is truly inspiring.\n\nNow, I teach weekly dance classes for children and adults. Seeing the joy on their faces as they learn new movements and understand the cultural significance behind them is incredibly rewarding.\n\nWhat I love most about BOW is how it creates a safe space for learning and growth. Everyone is welcome, regardless of their background or experience level. The focus is on celebration, learning, and community building.\n\nTeaching has taught me as much as learning did. I've learned patience, creativity, and the importance of adapting teaching methods to different learning styles. Most importantly, I've learned that cultural education is not just about preserving traditions - it's about building bridges between communities.\n\nI'm proud to be part of an organization that values education, cultural exchange, and community building. BOW has given me the opportunity to grow as both a student and a teacher, and I'm excited to continue this journey.",
    date: new Date("2024-03-10").toISOString(),
    readTime: "6 min read",
    tags: ["education", "dance", "teaching", "cultural heritage"],
    likes: 189,
    comments: 32,
    featured: false
  }
];

// GET all stories
router.get('/', async (req, res) => {
  try {
    if (Story) {
      const stories = await Story.findAll();
      res.json(stories);
    } else {
      // Fallback to sample data
      res.json(sampleStories);
    }
  } catch (error) {
    console.error('Error fetching stories:', error);
    // Fallback to sample data on error
    res.json(sampleStories);
  }
});

// GET single story by ID
router.get('/:id', async (req, res) => {
  try {
    if (Story) {
      const story = await Story.findById(req.params.id);
      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }
      res.json(story);
    } else {
      // Fallback to sample data
      const story = sampleStories.find(s => s.id === req.params.id);
      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }
      res.json(story);
    }
  } catch (error) {
    console.error('Error fetching story:', error);
    // Fallback to sample data
    const story = sampleStories.find(s => s.id === req.params.id);
    if (story) {
      res.json(story);
    } else {
      res.status(404).json({ message: 'Story not found' });
    }
  }
});

// POST create new story (protected)
router.post('/', verifyCognito, async (req, res) => {
  try {
    if (Story) {
      const story = await Story.create(req.body);
      res.status(201).json(story);
    } else {
      // Fallback response for demo mode
      const newStory = {
        id: `story_${Date.now()}`,
        ...req.body,
        date: new Date().toISOString(),
        likes: 0,
        comments: 0
      };
      res.status(201).json(newStory);
    }
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update story (protected)
router.put('/:id', verifyCognito, async (req, res) => {
  try {
    if (Story) {
      const story = await Story.updateById(req.params.id, req.body);
      res.json(story);
    } else {
      // Fallback response for demo mode
      res.json({ message: 'Story updated (demo mode)', id: req.params.id });
    }
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE story (protected)
router.delete('/:id', verifyCognito, async (req, res) => {
  try {
    if (Story) {
      await Story.deleteById(req.params.id);
      res.json({ message: 'Story deleted successfully' });
    } else {
      // Fallback response for demo mode
      res.json({ message: 'Story deleted (demo mode)' });
    }
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 