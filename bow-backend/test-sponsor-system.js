const { docClient, TABLES } = require('./config/dynamodb');
const { v4: uuidv4 } = require('uuid');
const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');

async function testSponsorSystem() {
  console.log('🧪 Testing Sponsor Management System...\n');

  try {
    // Test 1: Create a test sponsor
    console.log('1️⃣ Testing sponsor creation...');
    const testSponsor = {
      id: uuidv4(),
      name: 'Test Sponsor',
      logoUrl: 'https://example.com/test-logo.png',
      website: 'https://testsponsor.com',
      description: 'This is a test sponsor',
      isActive: 'true',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: TABLES.SPONSORS,
      Item: testSponsor
    }));
    console.log('✅ Test sponsor created successfully');

    // Test 2: Read sponsor
    console.log('\n2️⃣ Testing sponsor retrieval...');
    const getResult = await docClient.send(new GetCommand({
      TableName: TABLES.SPONSORS,
      Key: { id: testSponsor.id }
    }));
    
    if (getResult.Item) {
      console.log('✅ Test sponsor retrieved successfully');
      console.log('   Name:', getResult.Item.name);
      console.log('   Website:', getResult.Item.website);
    } else {
      throw new Error('Failed to retrieve test sponsor');
    }

    // Test 3: Update sponsor
    console.log('\n3️⃣ Testing sponsor update...');
    await docClient.send(new UpdateCommand({
      TableName: TABLES.SPONSORS,
      Key: { id: testSponsor.id },
      UpdateExpression: 'SET #name = :name, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': 'Updated Test Sponsor',
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    }));
    console.log('✅ Test sponsor updated successfully');

    // Test 4: Query active sponsors
    console.log('\n4️⃣ Testing active sponsors query...');
    const activeSponsors = await docClient.send(new QueryCommand({
      TableName: TABLES.SPONSORS,
      IndexName: 'active-index',
      KeyConditionExpression: 'isActive = :active',
      ExpressionAttributeValues: {
        ':active': 'true'
      }
    }));
    console.log(`✅ Found ${activeSponsors.Items.length} active sponsors`);

    // Test 5: Scan all sponsors
    console.log('\n5️⃣ Testing sponsors scan...');
    const allSponsors = await docClient.send(new ScanCommand({
      TableName: TABLES.SPONSORS
    }));
    console.log(`✅ Found ${allSponsors.Items.length} total sponsors`);

    // Test 6: Toggle sponsor status
    console.log('\n6️⃣ Testing sponsor status toggle...');
    await docClient.send(new UpdateCommand({
      TableName: TABLES.SPONSORS,
      Key: { id: testSponsor.id },
      UpdateExpression: 'SET isActive = :isActive, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':isActive': 'false',
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    }));
    console.log('✅ Test sponsor deactivated successfully');

    // Test 7: Query inactive sponsors
    console.log('\n7️⃣ Testing inactive sponsors query...');
    const inactiveSponsors = await docClient.send(new QueryCommand({
      TableName: TABLES.SPONSORS,
      IndexName: 'active-index',
      KeyConditionExpression: 'isActive = :active',
      ExpressionAttributeValues: {
        ':active': 'false'
      }
    }));
    console.log(`✅ Found ${inactiveSponsors.Items.length} inactive sponsors`);

    // Test 8: Delete test sponsor
    console.log('\n8️⃣ Testing sponsor deletion...');
    await docClient.send(new DeleteCommand({
      TableName: TABLES.SPONSORS,
      Key: { id: testSponsor.id }
    }));
    console.log('✅ Test sponsor deleted successfully');

    // Test 9: Verify deletion
    console.log('\n9️⃣ Verifying sponsor deletion...');
    const deletedSponsor = await docClient.send(new GetCommand({
      TableName: TABLES.SPONSORS,
      Key: { id: testSponsor.id }
    }));
    
    if (!deletedSponsor.Item) {
      console.log('✅ Test sponsor successfully deleted');
    } else {
      throw new Error('Test sponsor still exists after deletion');
    }

    console.log('\n🎉 All sponsor system tests passed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ Sponsor creation');
    console.log('   ✅ Sponsor retrieval');
    console.log('   ✅ Sponsor update');
    console.log('   ✅ Active sponsors query');
    console.log('   ✅ All sponsors scan');
    console.log('   ✅ Sponsor status toggle');
    console.log('   ✅ Inactive sponsors query');
    console.log('   ✅ Sponsor deletion');
    console.log('   ✅ Deletion verification');

  } catch (error) {
    console.error('❌ Sponsor system test failed:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run tests
testSponsorSystem();
