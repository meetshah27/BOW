const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { TABLES } = require('./config/dynamodb');

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function createFounderContentTable() {
  const params = {
    TableName: TABLES.FOUNDER_CONTENT,
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
    console.log('🚀 Creating Founder Content table...');
    const command = new CreateTableCommand(params);
    const result = await dynamoClient.send(command);
    
    console.log('✅ Founder Content table created successfully!');
    console.log('📋 Table details:', {
      TableName: result.TableDescription.TableName,
      TableStatus: result.TableDescription.TableStatus,
      CreationDateTime: result.TableDescription.CreationDateTime
    });
    
    console.log('\n🎯 Next steps:');
    console.log('   1. Wait for table to be ACTIVE (check AWS Console)');
    console.log('   2. Run seed script to populate initial content');
    console.log('   3. Test the admin panel functionality');
    
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️  Founder Content table already exists');
    } else {
      console.error('❌ Error creating Founder Content table:', error);
    }
  }
}

// Run the function
createFounderContentTable();
