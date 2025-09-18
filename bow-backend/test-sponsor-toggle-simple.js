const AWS = require('aws-sdk');
const { TABLES } = require('./config/dynamodb');

// Configure AWS
AWS.config.update({
  region: 'us-west-2',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();

async function testSponsorToggle() {
  console.log('🧪 Testing Sponsor Toggle with DynamoDB...\n');

  try {
    // Test 1: Create a test sponsor
    console.log('1️⃣ Creating test sponsor...');
    const testSponsor = {
      id: `test-toggle-${Date.now()}`,
      name: 'Toggle Test Sponsor',
      logoUrl: 'https://example.com/test-logo.png',
      website: 'https://testsponsor.com',
      description: 'Test sponsor for toggle functionality',
      isActive: 'true',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const createParams = {
      TableName: TABLES.SPONSORS,
      Item: testSponsor
    };

    await docClient.put(createParams).promise();
    console.log('✅ Test sponsor created:', testSponsor.name, '(ID:', testSponsor.id, ')');

    // Test 2: Toggle to inactive
    console.log('\n2️⃣ Toggling sponsor to inactive...');
    const toggleInactiveParams = {
      TableName: TABLES.SPONSORS,
      Key: {
        id: testSponsor.id
      },
      UpdateExpression: 'SET isActive = :isActive, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':isActive': 'false',
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };

    const inactiveResult = await docClient.update(toggleInactiveParams).promise();
    console.log('✅ Sponsor toggled to inactive:', inactiveResult.Attributes.isActive);

    // Test 3: Toggle back to active
    console.log('\n3️⃣ Toggling sponsor back to active...');
    const toggleActiveParams = {
      TableName: TABLES.SPONSORS,
      Key: {
        id: testSponsor.id
      },
      UpdateExpression: 'SET isActive = :isActive, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':isActive': 'true',
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };

    const activeResult = await docClient.update(toggleActiveParams).promise();
    console.log('✅ Sponsor toggled to active:', activeResult.Attributes.isActive);

    // Test 4: Clean up - delete test sponsor
    console.log('\n4️⃣ Cleaning up test sponsor...');
    const deleteParams = {
      TableName: TABLES.SPONSORS,
      Key: {
        id: testSponsor.id
      }
    };

    await docClient.delete(deleteParams).promise();
    console.log('✅ Test sponsor deleted successfully');

    console.log('\n🎉 Sponsor toggle test completed successfully!');
    console.log('💡 The toggle functionality should work in the frontend now.');

  } catch (error) {
    console.error('❌ Sponsor toggle test failed:', error.message);
    console.log('\n💡 Make sure your AWS credentials are configured properly.');
  }
}

// Run the test
testSponsorToggle();
