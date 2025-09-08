#!/usr/bin/env node

/**
 * Newsletter S3 Setup Script
 * 
 * This script sets up the S3 configuration for newsletter media uploads
 */

require('dotenv').config();
const { S3Client, HeadBucketCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { S3_CONFIG } = require('./config/s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

async function setupNewsletterS3() {
  console.log('🚀 Setting up S3 for Newsletter Media...\n');

  // Check environment variables
  console.log('📋 Checking S3 Configuration:');
  console.log('   AWS_REGION:', process.env.AWS_REGION || 'us-west-2');
  console.log('   AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing');
  console.log('   AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing');
  console.log('   S3_BUCKET_NAME:', process.env.S3_BUCKET_NAME || 'bow-media-bucket');
  console.log('   Newsletter Folder:', S3_CONFIG.FOLDERS.NEWSLETTER);
  console.log('');

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('❌ Missing AWS credentials!');
    console.error('   Please add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to your .env file');
    process.exit(1);
  }

  try {
    // Test S3 bucket access
    console.log('🪣 Testing S3 bucket access...');
    const bucketName = S3_CONFIG.BUCKET_NAME;
    
    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
      console.log(`✅ S3 bucket '${bucketName}' is accessible`);
    } catch (error) {
      if (error.name === 'NotFound') {
        console.error(`❌ S3 bucket '${bucketName}' does not exist`);
        console.error('   Please create the bucket in AWS S3 console or update S3_BUCKET_NAME in .env');
      } else if (error.name === 'Forbidden') {
        console.error(`❌ Access denied to S3 bucket '${bucketName}'`);
        console.error('   Please check your AWS credentials have S3 permissions');
      } else {
        throw error;
      }
      process.exit(1);
    }

    // Create newsletter folder structure marker
    console.log('📁 Setting up newsletter folder structure...');
    
    const folderMarker = `${S3_CONFIG.FOLDERS.NEWSLETTER}/.keep`;
    
    try {
      await s3Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: folderMarker,
        Body: 'This file ensures the newsletter folder exists in S3',
        ContentType: 'text/plain'
      }));
      console.log(`✅ Newsletter folder '${S3_CONFIG.FOLDERS.NEWSLETTER}' created in S3`);
    } catch (error) {
      console.warn(`⚠️  Could not create folder marker: ${error.message}`);
      console.log('   This is usually fine - the folder will be created when first file is uploaded');
    }

    console.log('');
    console.log('📊 S3 Configuration Summary:');
    console.log(`   Bucket: ${bucketName}`);
    console.log(`   Region: ${process.env.AWS_REGION || 'us-west-2'}`);
    console.log(`   Newsletter Folder: ${S3_CONFIG.FOLDERS.NEWSLETTER}`);
    console.log('');
    
    console.log('✅ Newsletter S3 setup completed successfully!');
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('1. Start your backend server: npm start');
    console.log('2. Go to Admin Panel → Newsletter → Campaigns');
    console.log('3. Create a campaign and try uploading an image');
    console.log('4. Images will be stored in S3 under the "newsletter" folder');
    console.log('');

  } catch (error) {
    console.error('❌ Error setting up newsletter S3:', error.message);
    
    if (error.name === 'InvalidAccessKeyId') {
      console.error('   Check your AWS_ACCESS_KEY_ID');
    } else if (error.name === 'SignatureDoesNotMatch') {
      console.error('   Check your AWS_SECRET_ACCESS_KEY');
    } else if (error.name === 'AccessDenied') {
      console.error('   Make sure your AWS credentials have S3 permissions');
    }
    
    process.exit(1);
  }
}

async function testUpload() {
  console.log('🧪 Testing newsletter media upload...');
  
  try {
    // Create a test file buffer
    const testContent = 'This is a test file for newsletter media upload';
    const testKey = `${S3_CONFIG.FOLDERS.NEWSLETTER}/test-upload-${Date.now()}.txt`;
    
    await s3Client.send(new PutObjectCommand({
      Bucket: S3_CONFIG.BUCKET_NAME,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain'
    }));
    
    const testUrl = `https://${S3_CONFIG.BUCKET_NAME}.s3.${S3_CONFIG.REGION}.amazonaws.com/${testKey}`;
    console.log('✅ Test upload successful!');
    console.log('   Test file URL:', testUrl);
    console.log('   You can delete this test file from S3 console if needed');
    
  } catch (error) {
    console.error('❌ Test upload failed:', error.message);
    throw error;
  }
}

// Command line argument handling
const args = process.argv.slice(2);

if (args.includes('--test-upload')) {
  testUpload().catch(console.error);
} else {
  setupNewsletterS3();
}

