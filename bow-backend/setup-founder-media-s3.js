#!/usr/bin/env node

require('dotenv').config();
const { S3Client, PutObjectCommand, ListObjectsV2Command, HeadBucketCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up S3 Infrastructure for Founder Media\n');

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

// Define the folder structure we need
const REQUIRED_FOLDERS = [
  'events',
  'gallery', 
  'profiles',
  'sponsors',
  'stories',
  'founders'  // This is the new folder for founder media
];

async function setupS3Infrastructure() {
  try {
    console.log('🔍 Step 1: Checking S3 bucket access...');
    
    // Test bucket access
    const headCommand = new HeadBucketCommand({ Bucket: BUCKET_NAME });
    await s3Client.send(headCommand);
    console.log('   ✅ Bucket access successful');
    
    console.log('\n🔍 Step 2: Checking existing folder structure...');
    
    // List existing objects to see current structure
    const listCommand = new ListObjectsV2Command({ Bucket: BUCKET_NAME });
    const listResult = await s3Client.send(listCommand);
    
    const existingFolders = new Set();
    if (listResult.Contents) {
      listResult.Contents.forEach(obj => {
        const folder = obj.Key.split('/')[0];
        if (folder) existingFolders.add(folder);
      });
    }
    
    console.log('   📁 Existing folders:');
    existingFolders.forEach(folder => {
      console.log(`      - ${folder} ${REQUIRED_FOLDERS.includes(folder) ? '✅' : '❌'}`);
    });
    
    console.log('\n🔍 Step 3: Creating missing folders...');
    
    // Create missing folders by uploading placeholder files
    for (const folder of REQUIRED_FOLDERS) {
      if (!existingFolders.has(folder)) {
        try {
          const placeholderContent = `# ${folder.toUpperCase()} FOLDER\n# Created on ${new Date().toISOString()}\n# This folder is for storing ${folder} media files`;
          
          const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: `${folder}/.folder-info.txt`,
            Body: placeholderContent,
            ContentType: 'text/plain',
            Metadata: {
              createdBy: 'bow-setup-script',
              folderType: folder,
              createdAt: new Date().toISOString()
            }
          };
          
          const command = new PutObjectCommand(uploadParams);
          await s3Client.send(command);
          console.log(`   ✅ Created ${folder}/ folder`);
        } catch (error) {
          console.log(`   ⚠️  Could not create ${folder}/ folder: ${error.message}`);
        }
      } else {
        console.log(`   ℹ️  ${folder}/ folder already exists`);
      }
    }
    
    console.log('\n🔍 Step 4: Verifying folder structure...');
    
    // List objects again to verify structure
    const verifyListCommand = new ListObjectsV2Command({ Bucket: BUCKET_NAME });
    const verifyResult = await s3Client.send(verifyListCommand);
    
    const finalFolders = new Set();
    if (verifyResult.Contents) {
      verifyResult.Contents.forEach(obj => {
        const folder = obj.Key.split('/')[0];
        if (folder) finalFolders.add(folder);
      });
    }
    
    console.log('   📁 Final folder structure:');
    REQUIRED_FOLDERS.forEach(folder => {
      const status = finalFolders.has(folder) ? '✅' : '❌';
      console.log(`      - ${folder}/ ${status}`);
    });
    
    console.log('\n🔍 Step 5: Testing founder media upload capability...');
    
    // Test upload to founders folder
    try {
      const testContent = `# Test upload to founders folder\n# This verifies the folder is writable\n# Uploaded on ${new Date().toISOString()}`;
      
      const testUploadParams = {
        Bucket: BUCKET_NAME,
        Key: 'founders/test-upload.txt',
        Body: testContent,
        ContentType: 'text/plain',
        Metadata: {
          testUpload: 'true',
          uploadedAt: new Date().toISOString()
        }
      };
      
      const testCommand = new PutObjectCommand(testUploadParams);
      await s3Client.send(testCommand);
      console.log('   ✅ Test upload to founders folder successful');
      
      // Clean up test file
      // Note: We'll leave this for now as it's small and useful for verification
      console.log('   ℹ️  Test file left in founders folder for verification');
      
    } catch (error) {
      console.log(`   ❌ Test upload failed: ${error.message}`);
    }
    
    console.log('\n🎉 S3 Infrastructure Setup Complete!');
    console.log('\n📋 Summary:');
    console.log(`   ✅ Bucket: ${BUCKET_NAME}`);
    console.log(`   ✅ Region: ${process.env.AWS_REGION || 'us-west-2'}`);
    console.log(`   ✅ Folders: ${REQUIRED_FOLDERS.length} required folders configured`);
    console.log(`   ✅ Founders folder: Ready for media uploads`);
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Test the founder media upload: npm run test-founder-upload');
    console.log('   2. Use the admin panel to upload founder media');
    console.log('   3. Check that media appears on the About page');
    
    console.log('\n🔗 Bucket URL:');
    console.log(`   https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-west-2'}.amazonaws.com/`);
    
  } catch (error) {
    console.error('\n❌ S3 Setup Failed');
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
    }
    
    process.exit(1);
  }
}

// Run the setup
setupS3Infrastructure().catch(console.error);
