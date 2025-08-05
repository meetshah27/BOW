require('dotenv').config();
const Gallery = require('./models-dynamodb/Gallery');
const fs = require('fs');
const path = require('path');

async function migrateGalleryToS3() {
  try {
    console.log('🔄 Migrating Gallery from Localhost to S3...\n');
    
    const galleryItems = await Gallery.findAll();
    
    if (galleryItems.length === 0) {
      console.log('ℹ️  No gallery items found to migrate');
      return;
    }
    
    console.log(`📋 Found ${galleryItems.length} gallery items to check\n`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const item of galleryItems) {
      console.log(`Processing: ${item.title || 'Untitled'}`);
      
      if (!item.imageUrl) {
        console.log('   ⚠️  No image URL, skipping...\n');
        skippedCount++;
        continue;
      }
      
      if (item.imageUrl.includes('s3.amazonaws.com')) {
        console.log('   ✅ Already S3 URL, skipping...\n');
        skippedCount++;
        continue;
      }
      
      if (item.imageUrl.includes('localhost')) {
        console.log('   🔴 Localhost URL detected');
        
        try {
          // Extract filename from localhost URL
          const urlParts = item.imageUrl.split('/');
          const filename = urlParts[urlParts.length - 1];
          
          // Check if file exists in public directory
          const publicPath = path.join(__dirname, 'public', filename);
          const imagesPath = path.join(__dirname, 'public', 'images', filename);
          
          let filePath = null;
          if (fs.existsSync(publicPath)) {
            filePath = publicPath;
          } else if (fs.existsSync(imagesPath)) {
            filePath = imagesPath;
          }
          
          if (filePath) {
            console.log(`   📁 Found file: ${filePath}`);
            
            // For now, just update the URL to indicate it needs manual migration
            // In a real migration, you would upload the file to S3 here
            const newUrl = `MIGRATION_NEEDED_${filename}`;
            
            await Gallery.update(item.id, {
              imageUrl: newUrl,
              migrationNote: 'Needs manual S3 upload'
            });
            
            console.log(`   ✅ Marked for migration: ${newUrl}`);
            migratedCount++;
          } else {
            console.log(`   ❌ File not found: ${filename}`);
            errorCount++;
          }
        } catch (error) {
          console.log(`   ❌ Error processing: ${error.message}`);
          errorCount++;
        }
      } else {
        console.log('   🟡 Other URL type, skipping...');
        skippedCount++;
      }
      
      console.log('');
    }
    
    console.log('📊 Migration Summary:');
    console.log(`   ✅ Migrated: ${migratedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    
    if (migratedCount > 0) {
      console.log('\n💡 Next Steps:');
      console.log('   1. Upload the local files to S3 manually');
      console.log('   2. Update the URLs in the database');
      console.log('   3. Delete the local files from public directory');
    }
    
  } catch (error) {
    console.error('❌ Migration error:', error.message);
  }
}

migrateGalleryToS3(); 