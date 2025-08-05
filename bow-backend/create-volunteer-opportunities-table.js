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

const TABLE_NAME = 'VolunteerOpportunities';

async function createVolunteerOpportunitiesTable() {
  try {
    console.log('🎯 Creating VolunteerOpportunities table...');
    
    // Check if table already exists
    try {
      await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
      console.log('✅ VolunteerOpportunities table already exists');
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
          AttributeName: 'opportunityId',
          KeyType: 'HASH' // Partition key
        }
      ],
             AttributeDefinitions: [
         {
           AttributeName: 'opportunityId',
           AttributeType: 'S'
         },
         {
           AttributeName: 'category',
           AttributeType: 'S'
         },
         {
           AttributeName: 'isActive',
           AttributeType: 'S'
         },
         {
           AttributeName: 'createdAt',
           AttributeType: 'S'
         }
       ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: 'CategoryIndex',
          KeySchema: [
            {
              AttributeName: 'category',
              KeyType: 'HASH'
            },
            {
              AttributeName: 'opportunityId',
              KeyType: 'RANGE'
            }
          ],
          Projection: {
            ProjectionType: 'ALL'
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        },
        {
          IndexName: 'ActiveOpportunitiesIndex',
          KeySchema: [
            {
              AttributeName: 'isActive',
              KeyType: 'HASH'
            },
            {
              AttributeName: 'createdAt',
              KeyType: 'RANGE'
            }
          ],
          Projection: {
            ProjectionType: 'ALL'
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        }
      ]
    };

    const command = new CreateTableCommand(params);
    await client.send(command);
    
    console.log('✅ VolunteerOpportunities table created successfully');
    console.log('📊 Table details:');
    console.log('   - Name: VolunteerOpportunities');
    console.log('   - Partition Key: opportunityId (String)');
    console.log('   - GSI 1: CategoryIndex (category + opportunityId)');
    console.log('   - GSI 2: ActiveOpportunitiesIndex (isActive + createdAt)');
    console.log('   - Read Capacity: 5 units');
    console.log('   - Write Capacity: 5 units');
    
  } catch (error) {
    console.error('❌ Error creating VolunteerOpportunities table:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  createVolunteerOpportunitiesTable()
    .then(() => {
      console.log('🎉 Volunteer opportunities table setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Volunteer opportunities table setup failed:', error);
      process.exit(1);
    });
}

module.exports = { createVolunteerOpportunitiesTable }; 