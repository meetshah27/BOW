const { S3Client, ListBucketsCommand, ListObjectsV2Command, HeadBucketCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

// S3 Configuration for us-west-2
const s3Config = {
  region: 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
};

const s3Client = new S3Client(s3Config);

const testS3Connection = async () => {
  console.log('🔍 Testing S3 Connection in us-west-2...');
  console.log('=====================================');
  
  try {
    // Check AWS credentials
    console.log('\n📋 Environment Variables:');
    console.log(`AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing'}`);
    console.log(`AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log(`AWS_REGION: ${process.env.AWS_REGION || 'Not set (using us-west-2)'}`);
    console.log(`S3_BUCKET_NAME: ${process.env.S3_BUCKET_NAME || 'bow-media-bucket'}`);
    
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error('AWS credentials not found. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env file.');
    }
    
    // Test 1: List all buckets
    console.log('\n🔍 Test 1: Listing all S3 buckets...');
    const listBucketsCommand = new ListBucketsCommand({});
    const bucketsResponse = await s3Client.send(listBucketsCommand);
    
    console.log(`✅ Successfully connected to S3 in us-west-2`);
    console.log(`📋 Found ${bucketsResponse.Buckets.length} buckets:`);
    
    bucketsResponse.Buckets.forEach(bucket => {
      console.log(`   - ${bucket.Name} (Created: ${bucket.CreationDate})`);
    });
    
    // Test 2: Check specific bucket
    const bucketName = process.env.S3_BUCKET_NAME || 'bow-media-bucket';
    console.log(`\n🔍 Test 2: Checking bucket '${bucketName}'...`);
    
    try {
      const headBucketCommand = new HeadBucketCommand({ Bucket: bucketName });
      await s3Client.send(headBucketCommand);
      console.log(`✅ Bucket '${bucketName}' exists and is accessible`);
      
      // Test 3: List objects in bucket
      console.log(`\n🔍 Test 3: Listing objects in '${bucketName}'...`);
      const listObjectsCommand = new ListObjectsV2Command({ 
        Bucket: bucketName,
        MaxKeys: 10 
      });
      const objectsResponse = await s3Client.send(listObjectsCommand);
      
      console.log(`✅ Bucket contains ${objectsResponse.KeyCount || 0} objects`);
      if (objectsResponse.Contents && objectsResponse.Contents.length > 0) {
        console.log('📋 Sample objects:');
        objectsResponse.Contents.slice(0, 5).forEach(obj => {
          console.log(`   - ${obj.Key} (${obj.Size} bytes, Modified: ${obj.LastModified})`);
        });
      }
      
    } catch (bucketError) {
      if (bucketError.name === 'NoSuchBucket') {
        console.log(`❌ Bucket '${bucketName}' does not exist in us-west-2`);
        console.log('\n💡 Solutions:');
        console.log('1. Create the bucket in us-west-2 region');
        console.log('2. Check if the bucket exists in a different region');
        console.log('3. Update S3_BUCKET_NAME in your .env file');
      } else if (bucketError.name === 'AccessDenied') {
        console.log(`❌ Access denied to bucket '${bucketName}'`);
        console.log('\n💡 Solutions:');
        console.log('1. Check your AWS credentials have S3 permissions');
        console.log('2. Verify bucket permissions');
        console.log('3. Check IAM roles and policies');
      } else {
        throw bucketError;
      }
    }
    
    console.log('\n🎉 S3 connection test completed!');
    
  } catch (error) {
    console.error('❌ S3 connection test failed:', error.message);
    
    if (error.name === 'InvalidAccessKeyId') {
      console.log('\n💡 Solution: Check your AWS_ACCESS_KEY_ID');
    } else if (error.name === 'SignatureDoesNotMatch') {
      console.log('\n💡 Solution: Check your AWS_SECRET_ACCESS_KEY');
    } else if (error.name === 'NetworkingError') {
      console.log('\n💡 Solution: Check your internet connection');
    }
    
    process.exit(1);
  }
};

if (require.main === module) {
  testS3Connection();
}

module.exports = { testS3Connection }; 