const { docClient, TABLES } = require('./config/dynamodb');
const { v4: uuidv4 } = require('uuid');
const { PutCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

async function seedSponsors() {
  console.log('🌱 Seeding sponsors data...');

  const sponsors = [
    {
      id: uuidv4(),
      name: 'Apna Bazar',
      logoUrl: 'https://bow-platform.s3.us-west-2.amazonaws.com/sponsors/apana-bazar.png',
      website: 'https://apnabazar.com',
      description: 'Local grocery store supporting the community',
      isActive: 'true',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Bel Red Best Smiles',
      logoUrl: 'https://bow-platform.s3.us-west-2.amazonaws.com/sponsors/bel-red-best-smiles.png',
      website: 'https://belredbestsmiles.com',
      description: 'Dental care services',
      isActive: 'true',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Chutneys',
      logoUrl: 'https://bow-platform.s3.us-west-2.amazonaws.com/sponsors/chutneys.jpg',
      website: 'https://chutneys.com',
      description: 'Indian restaurant and catering',
      isActive: 'true',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Dulay Homes',
      logoUrl: 'https://bow-platform.s3.us-west-2.amazonaws.com/sponsors/dulay-homes.png',
      website: 'https://dulayhomes.com',
      description: 'Real estate services',
      isActive: 'true',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Emerald Pacific Capital',
      logoUrl: 'https://bow-platform.s3.us-west-2.amazonaws.com/sponsors/emerald-pacific-capital.png',
      website: 'https://emeraldpacificcapital.com',
      description: 'Investment and financial services',
      isActive: 'true',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Fusion India',
      logoUrl: 'https://bow-platform.s3.us-west-2.amazonaws.com/sponsors/fusion-india.avif',
      website: 'https://fusionindia.com',
      description: 'Cultural and entertainment services',
      isActive: 'true',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'goEzz',
      logoUrl: 'https://bow-platform.s3.us-west-2.amazonaws.com/sponsors/goezz.png',
      website: 'https://goezz.com',
      description: 'Technology solutions',
      isActive: 'true',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Mayuri',
      logoUrl: 'https://bow-platform.s3.us-west-2.amazonaws.com/sponsors/mayuri-foods.png',
      website: 'https://mayurifoods.com',
      description: 'Food and catering services',
      isActive: 'true',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Soul Kitchen',
      logoUrl: 'https://bow-platform.s3.us-west-2.amazonaws.com/sponsors/soul-kitchen.png',
      website: 'https://soulkitchen.com',
      description: 'Restaurant and dining',
      isActive: 'true',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Sukarya USA',
      logoUrl: 'https://bow-platform.s3.us-west-2.amazonaws.com/sponsors/sukarya-usa.jpg',
      website: 'https://sukaryausa.org',
      description: 'Non-profit organization',
      isActive: 'true',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Swapna Kadam',
      logoUrl: 'https://bow-platform.s3.us-west-2.amazonaws.com/sponsors/swapna-kadam.webp',
      website: '#',
      description: 'Community supporter',
      isActive: 'true',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'The Shade Home',
      logoUrl: 'https://bow-platform.s3.us-west-2.amazonaws.com/sponsors/the-shade-home.jpg',
      website: 'https://theshadehome.com',
      description: 'Home decor and furnishings',
      isActive: 'true',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'VG Force',
      logoUrl: 'https://bow-platform.s3.us-west-2.amazonaws.com/sponsors/vg-force.png',
      website: 'https://vgforce.com',
      description: 'Technology and consulting',
      isActive: 'true',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Washington State India Trade Relations Action Committee',
      logoUrl: 'https://bow-platform.s3.us-west-2.amazonaws.com/sponsors/washington-state-india-trade-relations-action-committee.jpg',
      website: 'https://wsitrac.org',
      description: 'Trade relations organization',
      isActive: 'true',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  try {
    // Clear existing sponsors
    console.log('🗑️  Clearing existing sponsors...');
    const existingSponsors = await docClient.send(new ScanCommand({
      TableName: TABLES.SPONSORS
    }));
    
    for (const sponsor of existingSponsors.Items) {
      await docClient.send(new DeleteCommand({
        TableName: TABLES.SPONSORS,
        Key: { id: sponsor.id }
      }));
    }

    // Add new sponsors
    console.log('📝 Adding new sponsors...');
    for (const sponsor of sponsors) {
      await docClient.send(new PutCommand({
        TableName: TABLES.SPONSORS,
        Item: sponsor
      }));
      console.log(`✅ Added sponsor: ${sponsor.name}`);
    }

    console.log('🎉 Sponsors seeding completed successfully!');
    console.log(`📊 Added ${sponsors.length} sponsors`);

  } catch (error) {
    console.error('❌ Error seeding sponsors:', error);
  }
}

// Run seeding
seedSponsors();
