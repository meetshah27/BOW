const StoriesMedia = require('./models-dynamodb/StoriesMedia');

async function seedStoriesMedia() {
  console.log('🌱 Starting stories media seeding...');

  try {
    // Default stories media data
    const defaultStoriesMedia = {
      mediaType: 'image',
      mediaUrl: '',
      thumbnailUrl: '',
      title: '',
      description: '',
      altText: '',
      isActive: true,
      overlayOpacity: 0.2,
      storiesTitle: 'Community Stories',
      storiesDescription: 'Discover the inspiring journeys of individuals whose lives have been touched by Beats of Washington. Each story reflects the impact of our community and the power of coming together.',
      storiesSubtitle: ''
    };

    console.log('📝 Creating default stories media...');
    const storiesMedia = new StoriesMedia(defaultStoriesMedia);
    await storiesMedia.save();
    
    console.log('✅ Stories media seeded successfully!');
    console.log('📋 Created stories media:', storiesMedia);
    
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      console.log('ℹ️  Stories media already exists, skipping seeding');
    } else {
      console.error('❌ Error seeding stories media:', error);
      throw error;
    }
  }
}

// Run the script
if (require.main === module) {
  seedStoriesMedia()
    .then(() => {
      console.log('🎉 Stories media seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Failed to seed stories media:', error);
      process.exit(1);
    });
}

module.exports = { seedStoriesMedia };
