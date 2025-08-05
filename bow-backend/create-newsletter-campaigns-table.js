require('dotenv').config();
const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');

// Check for required environment variables
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error('❌ AWS credentials not found!');
  console.log('🔧 Please set the following environment variables:');
  console.log('   AWS_ACCESS_KEY_ID=your_access_key_here');
  console.log('   AWS_SECRET_ACCESS_KEY=your_secret_key_here');
  console.log('   AWS_REGION=us-west-2');
  console.log('\n📝 Create a .env file in the bow-backend directory with these values');
  process.exit(1);
}

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const TABLE_NAME = 'NewsletterCampaigns';

async function createNewsletterCampaignsTable() {
  try {
    console.log('📧 Creating NewsletterCampaigns table...');
    
    // Check if table already exists
    try {
      await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
      console.log('✅ NewsletterCampaigns table already exists');
      return;
    } catch (error) {
      if (error.name !== 'ResourceNotFoundException') {
        throw error;
      }
    }

    const params = {
      TableName: TABLE_NAME,
      KeySchema: [
        {
          AttributeName: 'campaignId',
          KeyType: 'HASH' // Partition key
        }
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'campaignId',
          AttributeType: 'S'
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    };

    const command = new CreateTableCommand(params);
    await client.send(command);
    
    console.log('✅ NewsletterCampaigns table created successfully');
    console.log('📊 Table details:');
    console.log('   - Name: NewsletterCampaigns');
    console.log('   - Partition Key: campaignId (String)');
    console.log('   - Read Capacity: 5 units');
    console.log('   - Write Capacity: 5 units');
    
  } catch (error) {
    console.error('❌ Error creating NewsletterCampaigns table:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  createNewsletterCampaignsTable()
    .then(() => {
      console.log('🎉 Newsletter campaigns table setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Newsletter campaigns table setup failed:', error);
      process.exit(1);
    });
}

module.exports = { createNewsletterCampaignsTable }; 