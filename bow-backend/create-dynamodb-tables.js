const { CreateTableCommand, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { docClient, TABLES, TABLE_SCHEMAS } = require('./config/dynamodb');

// Create DynamoDB client for table operations
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

async function createTables() {
  console.log('🚀 Starting DynamoDB table creation...');

  try {
    // Check existing tables
    const listCommand = new ListTablesCommand({});
    const existingTables = await client.send(listCommand);
    console.log('📋 Existing tables:', existingTables.TableNames);

    // Create each table
    for (const [tableName, schema] of Object.entries(TABLE_SCHEMAS)) {
      if (existingTables.TableNames.includes(schema.TableName)) {
        console.log(`✅ Table ${schema.TableName} already exists`);
        continue;
      }

      console.log(`📝 Creating table: ${schema.TableName}`);
      const createCommand = new CreateTableCommand(schema);
      
      try {
        await client.send(createCommand);
        console.log(`✅ Successfully created table: ${schema.TableName}`);
      } catch (error) {
        if (error.name === 'ResourceInUseException') {
          console.log(`ℹ️  Table ${schema.TableName} already exists`);
        } else {
          console.error(`❌ Error creating table ${schema.TableName}:`, error.message);
        }
      }
    }

    console.log('🎉 Table creation process completed!');
    console.log('\n📊 Tables created:');
    Object.values(TABLES).forEach(tableName => {
      console.log(`   - ${tableName}`);
    });

  } catch (error) {
    console.error('❌ Error in table creation process:', error);
  }
}

// Run table creation
createTables(); 