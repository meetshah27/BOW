const { S3Client, PutBucketCorsCommand, PutBucketPolicyCommand, GetBucketCorsCommand } = require('@aws-sdk/client-s3');
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

const fixS3Cors = async () => {
  console.log('🔧 Fixing S3 CORS and Permissions...');
  console.log('====================================');
  
  try {
    const bucketName = process.env.S3_BUCKET_NAME || 'bow-media-bucket';
    
    // Check AWS credentials
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error('AWS credentials not found. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env file.');
    }
    
    console.log(`📋 Bucket: ${bucketName}`);
    console.log(`🌍 Region: us-west-2`);
    
    // Step 1: Set CORS configuration
    console.log('\n🔧 Step 1: Setting CORS configuration...');
    
    const corsParams = {
      Bucket: bucketName,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
            AllowedOrigins: [
              'http://localhost:3000',
              'http://localhost:3001',
              'http://localhost:3002',
              'https://yourdomain.com', // Replace with your actual domain
              '*'
            ],
            ExposeHeaders: ['ETag', 'Content-Length', 'Content-Type'],
            MaxAgeSeconds: 3000
          }
        ]
      }
    };
    
    try {
      await s3Client.send(new PutBucketCorsCommand(corsParams));
      console.log('✅ CORS configuration updated successfully');
    } catch (corsError) {
      console.log('⚠️ CORS update failed:', corsError.message);
    }
    
    // Step 2: Set bucket policy for public read access
    console.log('\n🔧 Step 2: Setting bucket policy for public read access...');
    
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${bucketName}/*`
        }
      ]
    };
    
    const policyParams = {
      Bucket: bucketName,
      Policy: JSON.stringify(bucketPolicy)
    };
    
    try {
      await s3Client.send(new PutBucketPolicyCommand(policyParams));
      console.log('✅ Bucket policy updated successfully');
    } catch (policyError) {
      console.log('⚠️ Bucket policy update failed:', policyError.message);
    }
    
    // Step 3: Verify CORS configuration
    console.log('\n🔧 Step 3: Verifying CORS configuration...');
    
    try {
      const getCorsCommand = new GetBucketCorsCommand({ Bucket: bucketName });
      const corsResponse = await s3Client.send(getCorsCommand);
      
      console.log('✅ Current CORS configuration:');
      corsResponse.CORSConfiguration.CORSRules.forEach((rule, index) => {
        console.log(`   Rule ${index + 1}:`);
        console.log(`     Allowed Origins: ${rule.AllowedOrigins.join(', ')}`);
        console.log(`     Allowed Methods: ${rule.AllowedMethods.join(', ')}`);
        console.log(`     Allowed Headers: ${rule.AllowedHeaders.join(', ')}`);
      });
    } catch (verifyError) {
      console.log('⚠️ Could not verify CORS configuration:', verifyError.message);
    }
    
    console.log('\n🎉 S3 configuration completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Restart your backend server');
    console.log('2. Clear your browser cache');
    console.log('3. Try uploading and viewing images again');
    console.log('\n💡 If images still don\'t load:');
    console.log('- Check browser console for CORS errors');
    console.log('- Verify the image URL is correct');
    console.log('- Make sure the bucket is in us-west-2 region');
    
  } catch (error) {
    console.error('❌ Error fixing S3 configuration:', error.message);
    
    if (error.name === 'NoSuchBucket') {
      console.log('\n💡 Solution: Create the bucket first in us-west-2 region');
    } else if (error.name === 'AccessDenied') {
      console.log('\n💡 Solution: Check your AWS credentials have S3 permissions');
    }
    
    process.exit(1);
  }
};

if (require.main === module) {
  fixS3Cors();
}

module.exports = { fixS3Cors }; 