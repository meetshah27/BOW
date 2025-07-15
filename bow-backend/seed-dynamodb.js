const User = require('./models-dynamodb/User');
const Event = require('./models-dynamodb/Event');

async function seedDynamoDB() {
  console.log('🌱 Starting DynamoDB seeding...');

  try {
    // Seed Founders (as Users with admin role)
    console.log('👥 Seeding founders...');
    const founders = [
      {
        uid: 'founder-aand-sane',
        email: 'aand@beatsofwashington.org',
        displayName: 'Aand Sane',
        firstName: 'Aand',
        lastName: 'Sane',
        role: 'admin',
        phone: '+1-555-0123',
        photoURL: '/assets/founders.png'
      },
      {
        uid: 'founder-deepali-sane',
        email: 'deepali@beatsofwashington.org',
        displayName: 'Deepali Sane',
        firstName: 'Deepali',
        lastName: 'Sane',
        role: 'admin',
        phone: '+1-555-0124',
        photoURL: '/assets/founders.png'
      }
    ];

    for (const founderData of founders) {
      try {
        await User.create(founderData);
        console.log(`✅ Created founder: ${founderData.displayName}`);
      } catch (error) {
        console.log(`ℹ️  Founder ${founderData.displayName} might already exist`);
      }
    }

    // Seed Events
    console.log('🎉 Seeding events...');
    const events = [
      {
        title: 'Summer Music Festival 2024',
        description: 'A three-day celebration of music, culture, and community',
        longDescription: 'Join us for an unforgettable three-day festival featuring local and international artists, workshops, and cultural performances. Experience the rich diversity of music and culture in Washington State.',
        date: '2024-07-15',
        time: '10:00 AM - 10:00 PM',
        location: 'Seattle Center',
        address: '305 Harrison St, Seattle, WA 98109',
        category: 'Festival',
        image: '/assets/events/summer-festival.jpg',
        capacity: 5000,
        price: 0,
        organizer: 'Beats of Washington',
        contact: {
          phone: '+1-555-0123',
          email: 'events@beatsofwashington.org',
          website: 'https://beatsofwashington.org'
        },
        tags: ['music', 'festival', 'community', 'summer'],
        featured: true,
        isActive: true
      },
      {
        title: 'Music Workshop Series',
        description: 'Learn traditional and contemporary music techniques',
        longDescription: 'Our comprehensive workshop series covers everything from traditional folk music to contemporary digital production. Perfect for musicians of all skill levels.',
        date: '2024-08-20',
        time: '2:00 PM - 5:00 PM',
        location: 'Community Music Center',
        address: '123 Music Ave, Seattle, WA 98101',
        category: 'Workshop',
        image: '/assets/events/workshop.jpg',
        capacity: 50,
        price: 25,
        organizer: 'Beats of Washington',
        contact: {
          phone: '+1-555-0124',
          email: 'workshops@beatsofwashington.org',
          website: 'https://beatsofwashington.org'
        },
        tags: ['workshop', 'education', 'music'],
        featured: false,
        isActive: true
      },
      {
        title: 'Community Concert Night',
        description: 'An evening of local talent and community connection',
        longDescription: 'Experience the incredible talent of our local musicians in an intimate setting. This monthly event brings together artists and audiences for an unforgettable evening of music and connection.',
        date: '2024-09-10',
        time: '7:00 PM - 10:00 PM',
        location: 'Downtown Arts Center',
        address: '456 Arts Blvd, Seattle, WA 98102',
        category: 'Concert',
        image: '/assets/events/concert.jpg',
        capacity: 200,
        price: 15,
        organizer: 'Beats of Washington',
        contact: {
          phone: '+1-555-0125',
          email: 'concerts@beatsofwashington.org',
          website: 'https://beatsofwashington.org'
        },
        tags: ['concert', 'local', 'community'],
        featured: true,
        isActive: true
      }
    ];

    for (const eventData of events) {
      try {
        await Event.create(eventData);
        console.log(`✅ Created event: ${eventData.title}`);
      } catch (error) {
        console.log(`ℹ️  Event ${eventData.title} might already exist`);
      }
    }

    console.log('🎉 DynamoDB seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Founders: ${founders.length}`);
    console.log(`   - Events: ${events.length}`);

  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
}

// Run seeding
seedDynamoDB(); 