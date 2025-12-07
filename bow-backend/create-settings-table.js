const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { TABLE_SCHEMAS } = require('./config/dynamodb');

// Check if running in Lambda
const isLambda = !!process.env.LAMBDA_TASK_ROOT || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-west-2',
  // In Lambda, NEVER use explicit credentials - always use IAM role
  // Only use explicit credentials for local development (outside Lambda)
  ...(!isLambda && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  } : {})
});

async function createSettingsTable() {
  const params = TABLE_SCHEMAS['bow-settings'];

  try {
    console.log('🚀 Creating Settings table...');
    const command = new CreateTableCommand(params);
    const result = await dynamoClient.send(command);

    console.log('✅ Settings table created successfully!');
    console.log('📋 Table details:', {
      TableName: result.TableDescription.TableName,
      TableStatus: result.TableDescription.TableStatus,
      CreationDateTime: result.TableDescription.CreationDateTime
    });

    console.log('\n🎉 Next steps:');
    console.log('   1. Wait for table to be ACTIVE (check AWS Console)');
    console.log('   2. Settings will be initialized with defaults on first access');
    console.log('   3. Test the admin panel settings functionality');

  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️  Settings table already exists');
    } else {
      console.error('❌ Error creating Settings table:', error);
      throw error;
    }
  }
}

// Run if executed directly
if (require.main === module) {
  createSettingsTable()
    .then(() => {
      console.log('\n✅ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createSettingsTable };






