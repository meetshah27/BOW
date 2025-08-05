require('dotenv').config();
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

console.log('🔍 Checking S3 Bucket Storage...\n');

// Check environment variables
console.log('📋 Current Configuration:');
console.log(`   Region: ${process.env.AWS_REGION || 'us-west-2'}`);
console.log(`   Bucket: ${process.env.S3_BUCKET_NAME || 'bow-media-bucket'}`);
console.log(`   Access Key: ${process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing'}`);
console.log(`   Secret Key: ${process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing'}\n`);

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.log('❌ AWS credentials are missing!');
  console.log('💡 Please check your .env file');
  process.exit(1);
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'bow-media-bucket';

async function checkS3Storage() {
  try {
    console.log('🔍 Listing all files in S3 bucket...\n');
    
    const listCommand = new ListObjectsV2Command({ Bucket: BUCKET_NAME });
    const result = await s3Client.send(listCommand);
    
    if (result.Contents && result.Contents.length > 0) {
      console.log(`✅ Found ${result.Contents.length} files in bucket:\n`);
      
      // Group files by folder
      const folders = {};
      result.Contents.forEach(obj => {
        const parts = obj.Key.split('/');
        const folder = parts[0] || 'root';
        if (!folders[folder]) folders[folder] = [];
        folders[folder].push(obj);
      });
      
      // Display files by folder
      Object.keys(folders).forEach(folder => {
        console.log(`📁 ${folder.toUpperCase()} (${folders[folder].length} files):`);
        folders[folder].forEach(obj => {
          const size = (obj.Size / 1024).toFixed(1);
          console.log(`   📄 ${obj.Key} (${size} KB)`);
        });
        console.log('');
      });
      
      // Show total storage
      const totalSize = result.Contents.reduce((sum, obj) => sum + obj.Size, 0);
      const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
      console.log(`📊 Total Storage: ${totalSizeMB} MB`);
      
    } else {
      console.log('ℹ️  Bucket is empty - no files found');
      console.log('\n💡 This means:');
      console.log('   • No images have been uploaded yet, OR');
      console.log('   • Images are being stored elsewhere, OR');
      console.log('   • There\'s an issue with the upload process');
    }
    
    console.log('\n🔗 Bucket URL:');
    console.log(`   https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-west-2'}.amazonaws.com/`);
    
  } catch (error) {
    console.error('❌ Error checking S3 storage:', error.message);
    
    if (error.name === 'NoSuchBucket') {
      console.log('\n💡 The bucket does not exist!');
      console.log('   Please create the bucket in AWS S3 console');
    } else if (error.name === 'AccessDenied') {
      console.log('\n💡 Access denied!');
      console.log('   Please check your AWS credentials and permissions');
    }
  }
}

checkS3Storage(); 