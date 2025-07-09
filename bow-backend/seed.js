const mongoose = require('mongoose');
const Story = require('./models/Story');
const Founder = require('./models/Founder');
const Event = require('./models/Event');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bowdb';

const seed = async () => {
  await mongoose.connect(mongoURI);

  // Clear existing data
  await Story.deleteMany({});
  await Founder.deleteMany({});
  await Event.deleteMany({});

  // Seed Founders
  await Founder.insertMany([
    {
      name: 'Aand Sane',
      role: 'Board Chair & Co-Founder',
      bio: 'Aand Sane is the visionary founder of Beats of Washington, whose passion for community building through music has inspired thousands across Washington State. As Board Chair, Aand continues to lead our organization with dedication and innovative thinking.',
      image: '/assets/founders.png',
      social: {
        instagram: 'https://www.instagram.com/beatsofwa/',
        facebook: 'https://www.facebook.com/BeatsOfRedmond/',
        youtube: 'https://www.youtube.com/c/BeatsOfRedmond'
      }
    },
    {
      name: 'Deepali Sane',
      role: 'Vice Chair & Co-Founder',
      bio: 'Deepali Sane co-founded Beats of Washington with a deep commitment to fostering cultural connections through music. As Vice Chair, Deepali brings strategic vision and community expertise to ensure our programs continue to serve and inspire diverse communities.',
      image: '/assets/founders.png',
      social: {
        instagram: 'https://www.instagram.com/beatsofwa/',
        facebook: 'https://www.facebook.com/BeatsOfRedmond/',
        youtube: 'https://www.youtube.com/c/BeatsOfRedmond'
      }
    }
  ]);

  // Seed Stories
  await Story.insertMany([
    {
      title: "Our Story: More Than Just an Organization—It's Our Passion, Our Dream, Our Baby",
      author: "Deepali Sane & Anand Sane",
      authorImage: "/assets/founders.png",
      category: "founders",
      image: "/assets/founders.png",
      excerpt: "At Beats of Washington, founded in 2019, we believe it's more than just an organization—it's our passion, our dream, our baby. We're committed to nurturing Indian cultural ties, music, and traditions across Washington State.",
      content: "At Beats of Washington, founded in 2019, we believe it's more than just an organization—it's our passion, our dream, our baby. We're committed to nurturing Indian cultural ties, music, and traditions across Washington State. Through community celebrations, charity drives, and free dhol-tasha-dance trainings, we promote peace, prosperity, and cultural awareness for current and future generations. Together, let's create harmony and make every beat count!\n\nWhen we first started this journey, we had a simple vision: to create a space where Indian culture could thrive and be shared with our broader Washington community. We wanted to bridge the gap between cultures, using music and dance as universal languages that everyone could understand and enjoy.\n\nWhat began as a small gathering of friends has grown into something much larger than we ever imagined. Our community celebrations now bring together hundreds of people from diverse backgrounds, all united by the joy of music and dance. Our charity drives have helped countless families in need, and our free training programs have introduced thousands to the rich traditions of Indian music and dance.\n\nThe dhol-tasha-dance trainings are particularly close to our hearts. These traditional Indian percussion instruments and dance forms are not just entertainment—they're a way of preserving our cultural heritage and sharing it with future generations. When we see children and adults alike learning these traditions, we know we're fulfilling our mission.\n\nBut perhaps the most rewarding part of this journey has been watching our community grow and evolve. We've seen friendships form across cultural boundaries, we've witnessed the healing power of music in times of difficulty, and we've celebrated countless moments of pure joy and connection.\n\nAs founders, we often say that BOW is our baby because, like raising a child, it requires constant love, attention, and nurturing. There are challenges and setbacks, but the rewards are immeasurable. Every time we see someone's face light up during a performance, every time we receive a thank you from a family we've helped, every time we watch our community come together in celebration—we know it's all worth it.\n\nWe're committed to continuing this work for many years to come. Our dream is to see BOW grow even stronger, reaching more communities across Washington State and beyond. We want to create a legacy of cultural understanding, community connection, and musical joy that will last for generations.\n\nTo everyone who has been part of this journey—our volunteers, our participants, our supporters, and our community—we say thank you. You've made our dream a reality, and together, we're making every beat count.\n\nWith love and gratitude,\nDeepali Sane & Anand Sane",
      date: new Date("2024-01-20"),
      readTime: "8 min read",
      tags: ["founders", "indian culture", "community", "music", "dance", "tradition"],
      likes: 567,
      comments: 89,
      featured: true
    }
  ]);

  // Seed Events
  await Event.insertMany([
    {
      title: "Summer Music Festival 2024",
      date: "July 15-17, 2024",
      location: "Seattle Center",
      image: "/assets/founders.png",
      category: "Festival",
      description: "A three-day celebration of music, culture, and community at the Seattle Center.",
      featured: true
    }
  ]);

  console.log('Database seeded!');
  mongoose.disconnect();
};

seed(); 