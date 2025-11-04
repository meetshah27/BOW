const CulturalQuote = require('./models-dynamodb/CulturalQuote');

const defaultQuotes = [
  {
    text: "Music is the universal language that transcends all boundaries and unites hearts.",
    author: "Ancient Wisdom",
    order: 1,
    isActive: true
  },
  {
    text: "Unity in diversity creates the strongest communities where everyone belongs.",
    author: "Community Philosophy",
    order: 2,
    isActive: true
  },
  {
    text: "When we celebrate our culture together, we build bridges that connect generations.",
    author: "Cultural Heritage",
    order: 3,
    isActive: true
  },
  {
    text: "The rhythm of community beats stronger when every voice is heard.",
    author: "BOW Mission",
    order: 4,
    isActive: true
  },
  {
    text: "Through music and culture, we preserve traditions and create new memories.",
    author: "Legacy & Innovation",
    order: 5,
    isActive: true
  }
];

async function seedCulturalQuotes() {
  console.log('🌱 Seeding cultural quotes...\n');

  try {
    // Check if quotes already exist
    const existingQuotes = await CulturalQuote.getAllQuotes();
    
    if (existingQuotes.length > 0) {
      console.log(`ℹ️  ${existingQuotes.length} quote(s) already exist in the database.`);
      console.log('   To add new quotes, use the admin panel or delete existing ones first.\n');
      return;
    }

    // Create default quotes
    for (const quoteData of defaultQuotes) {
      const quote = new CulturalQuote(quoteData);
      await quote.save();
      console.log(`✅ Created quote: "${quoteData.text.substring(0, 50)}..."`);
    }

    console.log(`\n🎉 Successfully seeded ${defaultQuotes.length} cultural quotes!`);
    console.log('\n📝 Next steps:');
    console.log('   1. Visit the admin panel to manage quotes');
    console.log('   2. Edit, add, or remove quotes as needed');
    console.log('   3. Quotes will appear on the homepage automatically\n');

  } catch (error) {
    console.error('❌ Error seeding cultural quotes:', error);
    process.exit(1);
  }
}

// Run the seed function
seedCulturalQuotes();

