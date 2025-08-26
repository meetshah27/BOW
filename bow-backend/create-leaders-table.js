const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
require('dotenv').config();

// Configure AWS
const dynamodbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const dynamodb = dynamodbClient;
const docClient = DynamoDBDocumentClient.from(dynamodbClient);

const createLeadersTable = async () => {
  const params = {
    TableName: process.env.LEADERS_TABLE || 'Leaders',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }  // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'position', AttributeType: 'S' },
      { AttributeName: 'order', AttributeType: 'N' },
      { AttributeName: 'isActive', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    },
    GlobalSecondaryIndexes: [
      {
        IndexName: 'PositionIndex',
        KeySchema: [
          { AttributeName: 'position', KeyType: 'HASH' },
          { AttributeName: 'order', KeyType: 'RANGE' }
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
        IndexName: 'ActiveOrderIndex',
        KeySchema: [
          { AttributeName: 'isActive', KeyType: 'HASH' },
          { AttributeName: 'order', KeyType: 'RANGE' }
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

  try {
    console.log('Creating Leaders table...');
    const command = new CreateTableCommand(params);
    const result = await dynamodb.send(command);
    console.log('✅ Leaders table created successfully!');
    console.log('Table ARN:', result.TableDescription.TableArn);
    console.log('Table Status:', result.TableDescription.TableStatus);
    
    // Wait for table to be active
    console.log('Waiting for table to become active...');
    await waitForTableActive();
    console.log('🎉 Leaders table is now active and ready to use!');
    
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('⚠️  Leaders table already exists');
    } else {
      console.error('❌ Error creating Leaders table:', error);
    }
  }
};

const waitForTableActive = async () => {
  const params = {
    TableName: process.env.LEADERS_TABLE || 'Leaders'
  };

  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const command = new DescribeTableCommand(params);
        const result = await dynamodb.send(command);
        const status = result.Table.TableStatus;
        
        if (status === 'ACTIVE') {
          resolve();
        } else if (status === 'CREATING') {
          console.log('Table is still being created...');
          setTimeout(checkStatus, 5000); // Check again in 5 seconds
        } else {
          reject(new Error(`Unexpected table status: ${status}`));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    checkStatus();
  });
};

const seedLeadersTable = async () => {
  const sampleLeaders = [
         {
       id: '1',
       name: 'Anand Sane',
       position: 'Board Chair',
       roles: ['Founder', 'Strategic Planning', 'Community Outreach'],
       bio: 'Anand Sane is the visionary founder and board chair of Beats of Washington, leading our mission to foster community connections through music.',
       isActive: 'true',
       order: 1,
       createdAt: new Date().toISOString(),
       updatedAt: new Date().toISOString()
     },
         {
       id: '2',
       name: 'Deepali Sane',
       position: 'Vice Chair',
       roles: ['Co-Founder', 'Program Development', 'Event Coordination'],
       bio: 'Deepali Sane co-founded Beats of Washington and leads our program development and event coordination efforts.',
       isActive: 'true',
       order: 2,
       createdAt: new Date().toISOString(),
       updatedAt: new Date().toISOString()
     },
         {
       id: '3',
       name: 'Amit Bonde',
       position: 'Volunteer',
       roles: ['Dhol-Tasha Performer'],
       bio: 'Amit Bonde is a dedicated volunteer and talented Dhol-Tasha performer who brings energy to our cultural events.',
       isActive: 'true',
       order: 3,
       createdAt: new Date().toISOString(),
       updatedAt: new Date().toISOString()
     },
         {
       id: '4',
       name: 'Kedar Pathak',
       position: 'Volunteer',
       roles: ['Dhol-Tasha Performer', 'Dance Performer', 'Event Coordinator'],
       bio: 'Kedar Pathak is a multi-talented volunteer who contributes as a performer and helps coordinate our events.',
       isActive: 'true',
       order: 4,
       createdAt: new Date().toISOString(),
       updatedAt: new Date().toISOString()
     },
         {
       id: '5',
       name: 'Priyanka Pokale',
       position: 'Volunteer',
       roles: ['Dhol-Tasha Performer'],
       bio: 'Priyanka Pokale is a passionate volunteer and skilled Dhol-Tasha performer who adds vibrancy to our performances.',
       isActive: 'true',
       order: 5,
       createdAt: new Date().toISOString(),
       updatedAt: new Date().toISOString()
     }
  ];

  try {
    console.log('Seeding Leaders table with sample data...');
    
    for (const leader of sampleLeaders) {
      const putCommand = new PutCommand({
        TableName: process.env.LEADERS_TABLE || 'Leaders',
        Item: leader
      });
      await docClient.send(putCommand);
      console.log(`✅ Added leader: ${leader.name}`);
    }
    
    console.log('🎉 Leaders table seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding Leaders table:', error);
  }
};

const main = async () => {
  try {
    await createLeadersTable();
    await seedLeadersTable();
  } catch (error) {
    console.error('❌ Error in main process:', error);
  }
};

if (require.main === module) {
  main();
}

module.exports = { createLeadersTable, seedLeadersTable };
