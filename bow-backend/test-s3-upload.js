require('dotenv').config();
const { uploadToS3 } = require('./config/s3');

async function testS3Upload() {
  console.log('🧪 Testing S3 Upload...\n');
  
  // Check environment variables
  console.log('📋 Environment Check:');
  console.log(`   AWS_REGION: ${process.env.AWS_REGION || 'us-west-2'}`);
  console.log(`   S3_BUCKET_NAME: ${process.env.S3_BUCKET_NAME || 'bow-media-bucket'}`);
  console.log(`   AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`   AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing'}\n`);
  
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.log('❌ AWS credentials are missing!');
    console.log('💡 Please create a .env file in bow-backend with:');
    console.log('   AWS_ACCESS_KEY_ID=your_access_key');
    console.log('   AWS_SECRET_ACCESS_KEY=your_secret_key');
    console.log('   AWS_REGION=us-west-2');
    console.log('   S3_BUCKET_NAME=your_bucket_name');
    return;
  }
  
  try {
    // Create a mock file for testing
    const mockFile = {
      originalname: 'test-image.jpg',
      buffer: Buffer.from('fake image data for testing'),
      mimetype: 'image/jpeg',
      size: 1024
    };
    
    console.log('📤 Attempting to upload test file to S3...');
    const result = await uploadToS3(mockFile, 'test');
    
    console.log('✅ S3 Upload Test: SUCCESS!');
    console.log(`   File URL: ${result.fileUrl}`);
    console.log(`   File Name: ${result.fileName}`);
    console.log(`   Size: ${result.size} bytes`);
    
    console.log('\n🎉 Your S3 is properly connected!');
    console.log('   All future uploads will go to S3 bucket.');
    
  } catch (error) {
    console.error('❌ S3 Upload Test: FAILED');
    console.error('Error:', error.message);
    
    if (error.name === 'NoSuchBucket') {
      console.log('\n💡 The bucket does not exist!');
      console.log('   Please create the bucket in AWS S3 console');
    } else if (error.name === 'AccessDenied') {
      console.log('\n💡 Access denied!');
      console.log('   Please check your AWS credentials and permissions');
    }
  }
}

testS3Upload(); 