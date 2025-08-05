const { DynamoDBClient, CreateTableCommand, DeleteTableCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');
const fs = require('fs').promises;
const path = require('path');

require('dotenv').config();

// Source configuration (us-east-2)
const sourceConfig = {
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
};

// Destination configuration (us-west-2)
const destinationConfig = {
  region: 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
};

// Create clients
const sourceClient = new DynamoDBClient(sourceConfig);
const sourceDocClient = DynamoDBDocumentClient.from(sourceClient);

const destinationClient = new DynamoDBClient(destinationConfig);
const destinationDocClient = DynamoDBDocumentClient.from(destinationClient);

// Table definitions
const TABLES = {
  USERS: 'bow-users',
  EVENTS: 'bow-events',
  STORIES: 'bow-stories',
  FOUNDERS: 'bow-founders',
  DONATIONS: 'bow-donations',
  REGISTRATIONS: 'bow-registrations',
  VOLUNTEERS: 'bow-volunteers',
  GALLERY: 'bow-gallery'
};

// Table schemas for creation
const TABLE_SCHEMAS = {
  [TABLES.USERS]: {
    TableName: TABLES.USERS,
    KeySchema: [
      { AttributeName: 'uid', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'uid', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'email-index',
        KeySchema: [
          { AttributeName: 'email', KeyType: 'HASH' }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  [TABLES.EVENTS]: {
    TableName: TABLES.EVENTS,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'category', AttributeType: 'S' },
      { AttributeName: 'date', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'category-date-index',
        KeySchema: [
          { AttributeName: 'category', KeyType: 'HASH' },
          { AttributeName: 'date', KeyType: 'RANGE' }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  [TABLES.STORIES]: {
    TableName: TABLES.STORIES,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  [TABLES.FOUNDERS]: {
    TableName: TABLES.FOUNDERS,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  [TABLES.DONATIONS]: {
    TableName: TABLES.DONATIONS,
    KeySchema: [
      { AttributeName: 'paymentIntentId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'paymentIntentId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  [TABLES.REGISTRATIONS]: {
    TableName: TABLES.REGISTRATIONS,
    KeySchema: [
      { AttributeName: 'eventId', KeyType: 'HASH' },
      { AttributeName: 'userId', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'eventId', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  [TABLES.VOLUNTEERS]: {
    TableName: TABLES.VOLUNTEERS,
    KeySchema: [
      { AttributeName: 'opportunityId', KeyType: 'HASH' },
      { AttributeName: 'applicantEmail', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'opportunityId', AttributeType: 'S' },
      { AttributeName: 'applicantEmail', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  [TABLES.GALLERY]: {
    TableName: TABLES.GALLERY,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  }
};

// Utility functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const scanTable = async (tableName, docClient) => {
  const items = [];
  let lastEvaluatedKey = undefined;
  
  do {
    const params = {
      TableName: tableName,
      ...(lastEvaluatedKey && { ExclusiveStartKey: lastEvaluatedKey })
    };
    
    const result = await docClient.send(new ScanCommand(params));
    items.push(...result.Items);
    lastEvaluatedKey = result.LastEvaluatedKey;
    
    console.log(`Scanned ${items.length} items from ${tableName}...`);
    
    // Rate limiting
    await sleep(100);
  } while (lastEvaluatedKey);
  
  return items;
};

const createTable = async (tableName, client) => {
  try {
    const schema = TABLE_SCHEMAS[tableName];
    if (!schema) {
      throw new Error(`No schema found for table ${tableName}`);
    }
    
    console.log(`Creating table ${tableName} in destination region...`);
    await client.send(new CreateTableCommand(schema));
    
    // Wait for table to be active
    console.log(`Waiting for table ${tableName} to be active...`);
    await sleep(10000); // Wait 10 seconds for table creation
    
    console.log(`Table ${tableName} created successfully`);
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log(`Table ${tableName} already exists`);
    } else {
      throw error;
    }
  }
};

const migrateTable = async (tableName) => {
  console.log(`\n=== Starting migration for ${tableName} ===`);
  
  try {
    // Step 1: Create table in destination
    await createTable(tableName, destinationClient);
    
    // Step 2: Export data from source
    console.log(`Exporting data from ${tableName} in source region...`);
    const items = await scanTable(tableName, sourceDocClient);
    console.log(`Exported ${items.length} items from ${tableName}`);
    
    // Step 3: Import data to destination
    if (items.length > 0) {
      console.log(`Importing ${items.length} items to ${tableName} in destination region...`);
      
      // Batch write items (DynamoDB allows max 25 items per batch)
      const batchSize = 25;
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const writeRequests = batch.map(item => ({
          PutRequest: { Item: item }
        }));
        
        await destinationDocClient.send(new BatchWriteCommand({
          RequestItems: {
            [tableName]: writeRequests
          }
        }));
        
        console.log(`Imported batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(items.length / batchSize)}`);
        await sleep(100); // Rate limiting
      }
    }
    
    console.log(`✅ Migration completed for ${tableName}`);
    
  } catch (error) {
    console.error(`❌ Error migrating ${tableName}:`, error);
    throw error;
  }
};

const main = async () => {
  console.log('🚀 Starting DynamoDB Migration from us-east-2 to us-west-2');
  console.log('==================================================');
  
  try {
    // Migrate all tables
    for (const tableName of Object.values(TABLES)) {
      await migrateTable(tableName);
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Update your backend config to use us-west-2');
    console.log('2. Update your frontend Amplify config to use us-west-2');
    console.log('3. Test your application thoroughly');
    console.log('4. Delete old tables in us-east-2 (after confirming everything works)');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
if (require.main === module) {
  main();
}

module.exports = { migrateTable, TABLES }; 