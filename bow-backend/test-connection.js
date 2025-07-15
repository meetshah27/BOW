const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
require('dotenv').config();

console.log('🔍 Testing DynamoDB connection...');
console.log('   AWS_REGION:', process.env.AWS_REGION || 'us-east-1');
console.log('   AWS_ACCESS_KEY_ID set:', !!process.env.AWS_ACCESS_KEY_ID);
console.log('   AWS_SECRET_ACCESS_KEY set:', !!process.env.AWS_SECRET_ACCESS_KEY);

// Create DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

// Test connection by listing tables
async function testDynamoDBConnection() {
  try {
    const { ListTablesCommand } = require('@aws-sdk/client-dynamodb');
    
    console.log('🔄 Testing DynamoDB connection...');
    
    const command = new ListTablesCommand({});
    const response = await client.send(command);
    
    console.log('✅ DynamoDB connected successfully!');
    console.log('📊 AWS Region:', process.env.AWS_REGION || 'us-east-1');
    console.log('📋 Available tables:', response.TableNames || []);
    
    // Check for BOW tables
    const bowTables = ['bow-users', 'bow-events', 'bow-stories', 'bow-donations', 'bow-volunteers', 'bow-registrations', 'bow-founders'];
    const existingTables = response.TableNames || [];
    const missingTables = bowTables.filter(table => !existingTables.includes(table));
    
    if (missingTables.length > 0) {
      console.log('⚠️  Missing BOW tables:', missingTables);
      console.log('💡 Run "node create-dynamodb-tables.js" to create missing tables');
    } else {
      console.log('✅ All BOW tables exist!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ DynamoDB connection error:', error.message);
    console.log('\n💡 Troubleshooting steps:');
    console.log('   1. Check if .env file exists in bow-backend directory');
    console.log('   2. Verify AWS credentials in .env file:');
    console.log('      AWS_REGION=us-east-1');
    console.log('      AWS_ACCESS_KEY_ID=your_access_key_here');
    console.log('      AWS_SECRET_ACCESS_KEY=your_secret_key_here');
    console.log('   3. Check AWS IAM permissions for DynamoDB');
    console.log('   4. Verify AWS region is correct');
    process.exit(1);
  }
}

// Timeout after 15 seconds
setTimeout(() => {
  console.error('⏰ Connection timeout after 15 seconds');
  process.exit(1);
}, 15000);

testDynamoDBConnection(); 