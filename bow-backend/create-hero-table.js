require('dotenv').config();
const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { TABLES, TABLE_SCHEMAS } = require('./config/dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

async function createHeroTable() {
  try {
    console.log('🚀 Creating HERO table...');
    
    const createTableCommand = new CreateTableCommand(TABLE_SCHEMAS[TABLES.HERO]);
    const result = await client.send(createTableCommand);
    
    console.log('✅ HERO table created successfully!');
    console.log('Table ARN:', result.TableDescription.TableArn);
    console.log('Table Status:', result.TableDescription.TableStatus);
    
    // Wait for table to be active
    console.log('⏳ Waiting for table to become active...');
    await waitForTableActive(TABLES.HERO);
    console.log('🎉 HERO table is now active and ready to use!');
    
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️  HERO table already exists');
    } else {
      console.error('❌ Error creating HERO table:', error);
    }
  }
}

async function waitForTableActive(tableName) {
  const { DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
  
  while (true) {
    try {
      const describeCommand = new DescribeTableCommand({ TableName: tableName });
      const result = await client.send(describeCommand);
      
      if (result.Table.TableStatus === 'ACTIVE') {
        return;
      }
      
      console.log(`⏳ Table status: ${result.Table.TableStatus}`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
    } catch (error) {
      console.error('Error checking table status:', error);
      break;
    }
  }
}

// Run the script
createHeroTable().catch(console.error);
