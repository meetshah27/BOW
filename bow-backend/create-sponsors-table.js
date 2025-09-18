const { CreateTableCommand, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { TABLES, TABLE_SCHEMAS } = require('./config/dynamodb');

// Create DynamoDB client for table operations
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

async function createSponsorsTable() {
  console.log('🚀 Creating sponsors table...');

  try {
    // Check existing tables
    const listCommand = new ListTablesCommand({});
    const existingTables = await client.send(listCommand);
    console.log('📋 Existing tables:', existingTables.TableNames);

    const tableName = TABLES.SPONSORS;
    const schema = TABLE_SCHEMAS[TABLES.SPONSORS];

    if (existingTables.TableNames.includes(tableName)) {
      console.log(`✅ Table ${tableName} already exists`);
      return;
    }

    console.log(`📝 Creating table: ${tableName}`);
    const createCommand = new CreateTableCommand(schema);
    
    try {
      await client.send(createCommand);
      console.log(`✅ Successfully created table: ${tableName}`);
    } catch (error) {
      if (error.name === 'ResourceInUseException') {
        console.log(`ℹ️  Table ${tableName} already exists`);
      } else {
        console.error(`❌ Error creating table ${tableName}:`, error.message);
        throw error;
      }
    }

    console.log('🎉 Sponsors table creation completed!');

  } catch (error) {
    console.error('❌ Error in sponsors table creation:', error);
  }
}

// Run table creation
createSponsorsTable();
