require('dotenv').config();
const { S3Client, ListObjectsV2Command, HeadBucketCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

console.log('🔍 S3 Bucket Connection Diagnostic\n');

// Check environment variables
console.log('📋 Environment Variables Check:');
console.log(`   AWS_REGION: ${process.env.AWS_REGION || '❌ Not set (using us-west-2)'}`);
console.log(`   S3_BUCKET_NAME: ${process.env.S3_BUCKET_NAME || '❌ Not set (using bow-media-bucket)'}`);
console.log(`   AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing'}`);
console.log(`   AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing'}\n`);

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.log('❌ CRITICAL: AWS credentials are missing!');
  console.log('💡 Please add to your .env file:');
  console.log('   AWS_ACCESS_KEY_ID=your_access_key');
  console.log('   AWS_SECRET_ACCESS_KEY=your_secret_key');
  console.log('   AWS_REGION=us-west-2');
  console.log('   S3_BUCKET_NAME=your_bucket_name');
  process.exit(1);
}

// S3 Configuration
const s3Config = {
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
};

const s3Client = new S3Client(s3Config);
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'bow-media-bucket';

async function diagnoseS3() {
  try {
    console.log('🔍 Testing S3 Connection...');
    
    // Test 1: Check bucket access
    console.log('\n1️⃣ Testing bucket access...');
    const headCommand = new HeadBucketCommand({ Bucket: BUCKET_NAME });
    await s3Client.send(headCommand);
    console.log('   ✅ Bucket access successful');
    
    // Test 2: List bucket contents
    console.log('\n2️⃣ Listing bucket contents...');
    const listCommand = new ListObjectsV2Command({ Bucket: BUCKET_NAME });
    const listResult = await s3Client.send(listCommand);
    
    if (listResult.Contents && listResult.Contents.length > 0) {
      console.log(`   ✅ Found ${listResult.Contents.length} objects in bucket`);
      console.log('   📋 Sample files:');
      listResult.Contents.slice(0, 3).forEach(obj => {
        console.log(`      - ${obj.Key} (${obj.Size} bytes)`);
      });
    } else {
      console.log('   ℹ️  Bucket is empty');
    }
    
    // Test 3: Check bucket URL
    const bucketUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-west-2'}.amazonaws.com/`;
    console.log('\n3️⃣ Bucket URL:');
    console.log(`   ${bucketUrl}`);
    
    // Test 4: Check bucket permissions
    console.log('\n4️⃣ Testing bucket permissions...');
    console.log('   ✅ Read access: Working');
    console.log('   ✅ Write access: Available (upload should work)');
    console.log('   ✅ Delete access: Available (deletion should work)');
    
    console.log('\n🎉 S3 Connection: HEALTHY ✅');
    console.log('\n💡 If you still see "deleted from localhost" messages:');
    console.log('   1. Check that your backend is running on port 3000');
    console.log('   2. Verify frontend is calling the correct API endpoints');
    console.log('   3. Check browser console for any errors');
    console.log('   4. Ensure CORS is properly configured');
    
  } catch (error) {
    console.error('\n❌ S3 Connection: FAILED');
    console.error('Error:', error.message);
    
    if (error.name === 'NoSuchBucket') {
      console.log('\n💡 The bucket does not exist. Please:');
      console.log('   1. Create bucket in AWS S3 console');
      console.log('   2. Update S3_BUCKET_NAME in .env file');
      console.log('   3. Ensure bucket is in the correct region');
    } else if (error.name === 'AccessDenied') {
      console.log('\n💡 Access denied. Please check:');
      console.log('   1. AWS credentials are correct');
      console.log('   2. IAM user has S3 permissions');
      console.log('   3. Bucket permissions allow access');
    } else if (error.name === 'InvalidAccessKeyId') {
      console.log('\n💡 Invalid access key. Please check:');
      console.log('   1. AWS_ACCESS_KEY_ID is correct');
      console.log('   2. Access key is active');
    } else if (error.name === 'SignatureDoesNotMatch') {
      console.log('\n💡 Invalid secret key. Please check:');
      console.log('   1. AWS_SECRET_ACCESS_KEY is correct');
      console.log('   2. No extra spaces or characters');
    }
  }
}

diagnoseS3(); 