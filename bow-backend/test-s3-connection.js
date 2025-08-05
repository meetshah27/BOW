require('dotenv').config();
const { S3Client, ListObjectsV2Command, HeadBucketCommand } = require('@aws-sdk/client-s3');

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

async function testS3Connection() {
  console.log('🔍 Testing S3 Connection...\n');
  
  console.log('📋 Configuration:');
  console.log(`   Region: ${process.env.AWS_REGION || 'us-west-2'}`);
  console.log(`   Bucket: ${BUCKET_NAME}`);
  console.log(`   Access Key: ${process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Secret Key: ${process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing'}\n`);

  try {
    // Test 1: Check if bucket exists
    console.log('1️⃣ Testing bucket access...');
    const headCommand = new HeadBucketCommand({ Bucket: BUCKET_NAME });
    await s3Client.send(headCommand);
    console.log('   ✅ Bucket access successful\n');

    // Test 2: List objects in bucket
    console.log('2️⃣ Listing bucket contents...');
    const listCommand = new ListObjectsV2Command({ Bucket: BUCKET_NAME });
    const listResult = await s3Client.send(listCommand);
    
    if (listResult.Contents && listResult.Contents.length > 0) {
      console.log(`   ✅ Found ${listResult.Contents.length} objects in bucket:`);
      listResult.Contents.slice(0, 5).forEach(obj => {
        console.log(`      - ${obj.Key} (${obj.Size} bytes)`);
      });
      if (listResult.Contents.length > 5) {
        console.log(`      ... and ${listResult.Contents.length - 5} more`);
      }
    } else {
      console.log('   ℹ️  Bucket is empty');
    }
    console.log('');

    // Test 3: Check bucket URL
    const bucketUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-west-2'}.amazonaws.com/`;
    console.log('3️⃣ Bucket URL:');
    console.log(`   ${bucketUrl}\n`);

    console.log('🎉 S3 Connection Test: PASSED ✅');
    console.log('\n💡 If you see "deleted from localhost" messages, check:');
    console.log('   1. Frontend is calling the correct API endpoint');
    console.log('   2. Backend is properly configured with S3');
    console.log('   3. Environment variables are set correctly');

  } catch (error) {
    console.error('❌ S3 Connection Test: FAILED');
    console.error('Error:', error.message);
    
    if (error.name === 'NoSuchBucket') {
      console.log('\n💡 The bucket does not exist. Please:');
      console.log('   1. Create the bucket in AWS S3 console');
      console.log('   2. Update S3_BUCKET_NAME in your .env file');
    } else if (error.name === 'AccessDenied') {
      console.log('\n💡 Access denied. Please check:');
      console.log('   1. AWS credentials are correct');
      console.log('   2. IAM user has S3 permissions');
    }
  }
}

testS3Connection(); 