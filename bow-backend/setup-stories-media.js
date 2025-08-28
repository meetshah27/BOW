const { createStoriesMediaTable } = require('./create-stories-media-table');
const { seedStoriesMedia } = require('./seed-stories-media');

async function setupStoriesMedia() {
  console.log('🚀 Setting up Stories Media system...');
  console.log('=====================================');
  
  try {
    // Step 1: Create the DynamoDB table
    console.log('\n📋 Step 1: Creating STORIES_MEDIA table...');
    await createStoriesMediaTable();
    
    // Step 2: Seed with default data
    console.log('\n🌱 Step 2: Seeding default stories media...');
    await seedStoriesMedia();
    
    console.log('\n🎉 Stories Media setup complete!');
    console.log('=====================================');
    console.log('✅ STORIES_MEDIA table created and active');
    console.log('✅ Default data seeded');
    console.log('✅ Stories media will now persist across server restarts');
    console.log('\n💡 You can now upload images/videos from the admin panel');
    console.log('💡 The media will remain visible even after restarting the server');
    
  } catch (error) {
    console.error('\n💥 Setup failed:', error);
    throw error;
  }
}

// Run the setup
if (require.main === module) {
  setupStoriesMedia()
    .then(() => {
      console.log('\n🎯 Setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupStoriesMedia };
