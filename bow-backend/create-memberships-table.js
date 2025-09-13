const { TABLES, TABLE_SCHEMAS } = require('./config/dynamodb');
const { dynamoClient } = require('./config/aws-config');
const { 
  CreateTableCommand, 
  DescribeTableCommand 
} = require('@aws-sdk/client-dynamodb');

const createMembershipsTable = async () => {
  try {
    console.log('🔧 Creating memberships table...');
    
    const tableSchema = TABLE_SCHEMAS[TABLES.MEMBERSHIPS];
    console.log('📋 Table schema:', JSON.stringify(tableSchema, null, 2));
    
    // Check if table already exists
    try {
      const describeCommand = new DescribeTableCommand({ TableName: TABLES.MEMBERSHIPS });
      await dynamoClient.send(describeCommand);
      console.log('✅ Table already exists:', TABLES.MEMBERSHIPS);
      return;
    } catch (error) {
      if (error.name !== 'ResourceNotFoundException') {
        throw error;
      }
      // Table doesn't exist, create it
    }
    
    // Create the table
    const createTableParams = {
      ...tableSchema,
      TableName: TABLES.MEMBERSHIPS
    };
    
    console.log('🚀 Creating table with params:', JSON.stringify(createTableParams, null, 2));
    
    const createCommand = new CreateTableCommand(createTableParams);
    const result = await dynamoClient.send(createCommand);
    console.log('✅ Table creation initiated:', result.TableDescription.TableName);
    
    // Wait for table to be active
    console.log('⏳ Waiting for table to become active...');
    let tableStatus = 'CREATING';
    while (tableStatus === 'CREATING') {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      try {
        const statusCommand = new DescribeTableCommand({ TableName: TABLES.MEMBERSHIPS });
        const statusResult = await dynamoClient.send(statusCommand);
        tableStatus = statusResult.Table.TableStatus;
        console.log(`   Current status: ${tableStatus}`);
      } catch (error) {
        console.log('   Still creating...');
      }
    }
    
    console.log('🎉 Memberships table created successfully!');
    
    // Describe the created table
    const describeResultCommand = new DescribeTableCommand({ TableName: TABLES.MEMBERSHIPS });
    const describeResult = await dynamoClient.send(describeResultCommand);
    console.log('📊 Table details:', {
      TableName: describeResult.Table.TableName,
      TableStatus: describeResult.Table.TableStatus,
      ItemCount: describeResult.Table.ItemCount,
      KeySchema: describeResult.Table.KeySchema
    });
    
  } catch (error) {
    console.error('❌ Error creating memberships table:', error);
    throw error;
  }
};

// Run the script if called directly
if (require.main === module) {
  createMembershipsTable()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = createMembershipsTable;
