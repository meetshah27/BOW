const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { TABLES } = require('./config/dynamodb');

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function createCulturalQuotesTable() {
  const params = {
    TableName: TABLES.CULTURAL_QUOTES,
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
  };

  try {
    console.log('🚀 Creating Cultural Quotes table...');
    const command = new CreateTableCommand(params);
    const result = await dynamoClient.send(command);
    
    console.log('✅ Cultural Quotes table created successfully!');
    console.log('📋 Table details:', {
      TableName: result.TableDescription.TableName,
      TableStatus: result.TableDescription.TableStatus,
      CreationDateTime: result.TableDescription.CreationDateTime
    });
    
    console.log('\n🎯 Next steps:');
    console.log('   1. Wait for table to be ACTIVE (check AWS Console)');
    console.log('   2. Run seed script to populate initial quotes');
    console.log('   3. Test the admin panel functionality');
    
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️  Cultural Quotes table already exists');
    } else {
      console.error('❌ Error creating Cultural Quotes table:', error);
    }
  }
}

// Run the function
createCulturalQuotesTable();

