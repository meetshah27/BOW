#!/usr/bin/env node

require('dotenv').config();
const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');

console.log('🔍 Testing AWS Connection Stability...');
console.log('⏰ Started at:', new Date().toISOString());

// Check environment variables
console.log('\n📋 Environment Check:');
console.log('   AWS_REGION:', process.env.AWS_REGION || 'NOT SET');
console.log('   AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'SET' : 'NOT SET');
console.log('   AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET');

// Create clients
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Test function
async function testConnection() {
  try {
    console.log('\n🔄 Testing DynamoDB connection...');
    const dynamoResult = await dynamoClient.send(new ListTablesCommand({}));
    console.log('✅ DynamoDB connection successful');
    console.log('   Tables found:', dynamoResult.TableNames.length);
    
    console.log('\n🔄 Testing S3 connection...');
    const s3Result = await s3Client.send(new ListBucketsCommand({}));
    console.log('✅ S3 connection successful');
    console.log('   Buckets found:', s3Result.Buckets.length);
    
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

// Continuous testing
let testCount = 0;
const testInterval = setInterval(async () => {
  testCount++;
  const timestamp = new Date().toISOString();
  console.log(`\n🧪 Test #${testCount} at ${timestamp}`);
  
  const success = await testConnection();
  
  if (!success) {
    console.log('❌ Connection lost! This might be the cause of your 30-second issue.');
    console.log('💡 Check your AWS credentials and network connection.');
  } else {
    console.log('✅ Connection stable');
  }
  
  // Run for 2 minutes to see if there's a 30-second pattern
  if (testCount >= 12) {
    console.log('\n🏁 Test completed. Check the logs above for any patterns.');
    clearInterval(testInterval);
    process.exit(0);
  }
}, 10000); // Test every 10 seconds

// Initial test
testConnection();

console.log('\n⏳ Running continuous tests every 10 seconds for 2 minutes...');
console.log('💡 Watch for any connection failures or patterns.');
