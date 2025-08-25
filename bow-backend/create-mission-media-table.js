#!/usr/bin/env node
require('dotenv').config();
const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { TABLES } = require('./config/dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

async function createMissionMediaTable() {
  try {
    console.log('🚀 Creating Mission Media table...');
    
    const command = new CreateTableCommand({
      TableName: TABLES.MISSION_MEDIA,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' } // Partition key
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    });

    const result = await client.send(command);
    console.log('✅ Mission Media table created successfully!');
    console.log('Table ARN:', result.TableDescription.TableArn);
    console.log('Table Status:', result.TableDescription.TableStatus);
    
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('⚠️  Mission Media table already exists');
    } else {
      console.error('❌ Error creating Mission Media table:', error);
    }
  }
}

createMissionMediaTable();
