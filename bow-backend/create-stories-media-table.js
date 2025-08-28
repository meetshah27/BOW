const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { docClient, TABLES, TABLE_SCHEMAS } = require('./config/dynamodb');

async function createStoriesMediaTable() {
  console.log('🚀 Creating STORIES_MEDIA table...');
  
  try {
    const command = new CreateTableCommand(TABLE_SCHEMAS[TABLES.STORIES_MEDIA]);
    const result = await docClient.send(command);
    
    console.log('✅ STORIES_MEDIA table created successfully!');
    console.log('📋 Table details:', {
      TableName: result.TableDescription.TableName,
      TableStatus: result.TableDescription.TableStatus,
      CreationDateTime: result.TableDescription.CreationDateTime
    });
    
    // Wait for table to be active
    console.log('⏳ Waiting for table to become active...');
    await waitForTableActive(TABLES.STORIES_MEDIA);
    console.log('✅ STORIES_MEDIA table is now active and ready to use!');
    
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️  STORIES_MEDIA table already exists');
    } else {
      console.error('❌ Error creating STORIES_MEDIA table:', error);
      throw error;
    }
  }
}

async function waitForTableActive(tableName) {
  const { DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
  
  while (true) {
    try {
      const command = new DescribeTableCommand({ TableName: tableName });
      const result = await docClient.send(command);
      
      if (result.Table.TableStatus === 'ACTIVE') {
        return;
      }
      
      console.log(`⏳ Table status: ${result.Table.TableStatus}`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      
    } catch (error) {
      console.error('❌ Error checking table status:', error);
      throw error;
    }
  }
}

// Run the script
if (require.main === module) {
  createStoriesMediaTable()
    .then(() => {
      console.log('🎉 STORIES_MEDIA table setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Failed to create STORIES_MEDIA table:', error);
      process.exit(1);
    });
}

module.exports = { createStoriesMediaTable };
