const { CreateTableCommand, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { TABLES, TABLE_SCHEMAS } = require('./config/dynamodb');
require('dotenv').config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

async function createProductsTable() {
  console.log('🚀 Starting bow-products and bow-orders table creation...');

  try {
    const listCommand = new ListTablesCommand({});
    const existingTables = await client.send(listCommand);
    console.log('📋 Existing tables:', existingTables.TableNames);

    const tablesToCreate = [TABLES.PRODUCTS, TABLES.ORDERS];

    for (const tableName of tablesToCreate) {
      if (existingTables.TableNames.includes(tableName)) {
        console.log(`✅ Table ${tableName} already exists`);
        continue;
      }

      const schema = TABLE_SCHEMAS[tableName];
      console.log(`📝 Creating table: ${tableName}`);
      const createCommand = new CreateTableCommand(schema);
      
      try {
        await client.send(createCommand);
        console.log(`✅ Successfully created table: ${tableName}`);
      } catch (error) {
        console.error(`❌ Error creating table ${tableName}:`, error.message);
      }
    }

    console.log('🎉 Done!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createProductsTable();
