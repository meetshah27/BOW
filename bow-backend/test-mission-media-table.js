#!/usr/bin/env node
require('dotenv').config();
const { DynamoDBClient, DescribeTableCommand, GetCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { TABLES } = require('./config/dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const docClient = DynamoDBDocumentClient.from(client);

async function testMissionMediaTable() {
  try {
    console.log('🔍 Testing Mission Media DynamoDB table...');
    console.log('Table name:', TABLES.MISSION_MEDIA);
    
    // Check if table exists
    try {
      const describeCommand = new DescribeTableCommand({
        TableName: TABLES.MISSION_MEDIA
      });
      
      const tableInfo = await client.send(describeCommand);
      console.log('✅ Table exists!');
      console.log('Table status:', tableInfo.Table.TableStatus);
      console.log('Table ARN:', tableInfo.Table.TableArn);
      
      // Try to get an item
      try {
        const getCommand = new GetCommand({
          TableName: TABLES.MISSION_MEDIA,
          Key: { id: 'mission-media' }
        });
        
        const result = await docClient.send(getCommand);
        if (result.Item) {
          console.log('✅ Successfully retrieved item:', result.Item);
        } else {
          console.log('ℹ️  No item found with id "mission-media" (this is normal for new table)');
        }
      } catch (getError) {
        console.log('⚠️  Error getting item:', getError.message);
      }
      
    } catch (describeError) {
      if (describeError.name === 'ResourceNotFoundException') {
        console.log('❌ Table does not exist!');
        console.log('Please run: node create-mission-media-table.js');
      } else {
        console.log('❌ Error describing table:', describeError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testMissionMediaTable();
