require('dotenv').config();
const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');

async function testAWSCredentials() {
  try {
    console.log('🔍 Testing AWS credentials...');
    
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-west-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    console.log('📋 AWS Configuration:');
    console.log('   Region:', process.env.AWS_REGION || 'us-west-2');
    console.log('   Access Key ID:', process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing');
    console.log('   Secret Access Key:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing');

    // Test connection by listing tables
    const command = new ListTablesCommand({});
    const response = await client.send(command);
    
    console.log('✅ AWS credentials are valid!');
    console.log('📊 Found tables:', response.TableNames.length);
    console.log('   Tables:', response.TableNames.join(', '));
    
    return true;
  } catch (error) {
    console.error('❌ AWS credentials test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Check if .env file exists in bow-backend directory');
    console.log('   2. Verify AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are set');
    console.log('   3. Ensure AWS_REGION is set to us-west-2');
    console.log('   4. Verify your AWS credentials have DynamoDB permissions');
    return false;
  }
}

// Run the test
if (require.main === module) {
  testAWSCredentials()
    .then((success) => {
      if (success) {
        console.log('\n🎉 Ready to create newsletter tables!');
      } else {
        console.log('\n💥 Please fix credentials before proceeding');
      }
      process.exit(success ? 0 : 1);
    });
}

module.exports = { testAWSCredentials }; 