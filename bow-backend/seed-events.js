const Event = require('./models-dynamodb/Event');

console.log('🌱 Starting DynamoDB event seeding...');

const sampleEvents = [
  {
    title: "Summer Music Festival 2024",
    description: "Join us for the biggest music festival of the summer! Experience incredible performances from local and international artists, food trucks, craft vendors, and family-friendly activities.",
    longDescription: "The Summer Music Festival 2024 is our flagship event that brings together over 5,000 community members for a day of celebration, music, and cultural exchange. This year's theme is 'Unity Through Music' and features performances from over 20 artists representing diverse musical traditions from around the world.\n\nHighlights include:\n• Main stage performances from 2 PM to 10 PM\n• Cultural dance performances throughout the day\n• Food trucks offering international cuisine\n• Craft vendors and art installations\n• Family activity zone with music workshops\n• Silent disco for late-night fun\n\nAll proceeds support our community music education programs.",
    date: new Date('2024-07-15'),
    time: "2:00 PM - 10:00 PM",
    location: "Seattle Center",
    address: "305 Harrison St, Seattle, WA 98109",
    category: "Festival",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    capacity: 5000,
    registeredCount: 3200,
    price: "Free",
    organizer: "Beats of Washington",
    contact: {
      phone: "(206) 555-0123",
      email: "events@beatsofwashington.org",
      website: "https://beatsofwashington.org"
    },
    tags: ["Music", "Festival", "Family-Friendly", "Cultural", "Free"],
    featured: true,
    isActive: true
  },
  {
    title: "Community Drum Circle",
    description: "Join our monthly community drum circle! All skill levels welcome. Bring your own drum or use one of ours.",
    longDescription: "Our community drum circle is a monthly gathering that celebrates rhythm and connection. Whether you're a seasoned percussionist or have never touched a drum before, you're welcome to join us!\n\nWhat to expect:\n• Guided drumming sessions for beginners\n• Free-form jamming for experienced players\n• Drum rental available (first come, first served)\n• Snacks and refreshments provided\n• Beautiful sunset views over Lake Union\n\nNo experience necessary - just bring your enthusiasm and willingness to connect through rhythm!",
    date: new Date('2024-06-22'),
    time: "6:00 PM - 8:00 PM",
    location: "Gas Works Park",
    address: "2101 N Northlake Way, Seattle, WA 98103",
    category: "Workshop",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    capacity: 100,
    registeredCount: 45,
    price: "Free",
    organizer: "Beats of Washington",
    contact: {
      phone: "(206) 555-0123",
      email: "events@beatsofwashington.org",
      website: "https://beatsofwashington.org"
    },
    tags: ["Drumming", "Community", "Free", "Outdoor", "All Ages"],
    featured: false,
    isActive: true
  },
  {
    title: "Youth Music Workshop",
    description: "A hands-on music workshop for youth ages 12-18. Learn to play various instruments and create music together.",
    longDescription: "This youth-focused workshop is designed to inspire the next generation of musicians and music lovers. Participants will have the opportunity to try different instruments, learn basic music theory, and collaborate on group performances.\n\nWorkshop includes:\n• Introduction to various instruments (guitar, keyboard, drums, ukulele)\n• Basic music theory and notation\n• Songwriting workshop\n• Group performance opportunity\n• Take-home materials and resources\n\nInstruments provided - no experience necessary!",
    date: new Date('2024-06-29'),
    time: "10:00 AM - 2:00 PM",
    location: "Community Center",
    address: "123 Main St, Seattle, WA 98101",
    category: "Workshop",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    capacity: 50,
    registeredCount: 32,
    price: "$15",
    organizer: "Beats of Washington",
    contact: {
      phone: "(206) 555-0123",
      email: "events@beatsofwashington.org",
      website: "https://beatsofwashington.org"
    },
    tags: ["Youth", "Workshop", "Educational", "Instruments", "Creative"],
    featured: false,
    isActive: true
  }
];

async function seedEvents() {
  try {
    console.log('📝 Seeding events...');
    
    // Create each event individually
    for (const eventData of sampleEvents) {
      const event = await Event.create(eventData);
      console.log(`✅ Created event: ${event.title} - ID: ${event.id}`);
    }
    
    console.log('✅ Event seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
}

seedEvents(); 