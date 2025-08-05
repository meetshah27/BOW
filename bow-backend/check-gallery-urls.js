require('dotenv').config();
const Gallery = require('./models-dynamodb/Gallery');

async function checkGalleryUrls() {
  try {
    console.log('🔍 Checking Gallery URLs in Database...\n');
    
    const galleryItems = await Gallery.findAll();
    
    if (galleryItems.length === 0) {
      console.log('ℹ️  No gallery items found in database');
      return;
    }
    
    console.log(`📋 Found ${galleryItems.length} gallery items:\n`);
    
    let localhostCount = 0;
    let s3Count = 0;
    let otherCount = 0;
    
    galleryItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title || 'Untitled'}`);
      console.log(`   ID: ${item.id}`);
      console.log(`   Album: ${item.album || 'No album'}`);
      console.log(`   URL: ${item.imageUrl || 'No URL'}`);
      
      if (item.imageUrl) {
        if (item.imageUrl.includes('localhost')) {
          console.log(`   🔴 LOCALHOST URL (needs migration)`);
          localhostCount++;
        } else if (item.imageUrl.includes('s3.amazonaws.com')) {
          console.log(`   ✅ S3 URL (correct)`);
          s3Count++;
        } else {
          console.log(`   🟡 OTHER URL (${item.imageUrl.split('/')[0]})`);
          otherCount++;
        }
      } else {
        console.log(`   ⚠️  NO URL`);
      }
      console.log('');
    });
    
    console.log('📊 Summary:');
    console.log(`   🔴 Localhost URLs: ${localhostCount}`);
    console.log(`   ✅ S3 URLs: ${s3Count}`);
    console.log(`   🟡 Other URLs: ${otherCount}`);
    console.log(`   ⚠️  No URLs: ${galleryItems.length - localhostCount - s3Count - otherCount}`);
    
    if (localhostCount > 0) {
      console.log('\n💡 You have localhost URLs that need to be migrated to S3!');
      console.log('   This explains why you see "localhost:3001" in your frontend.');
    }
    
  } catch (error) {
    console.error('❌ Error checking gallery URLs:', error.message);
  }
}

checkGalleryUrls(); 