const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
require('dotenv').config();

// Test both regions
const testRegion = async (region, regionName) => {
  console.log(`\n🔍 Testing ${regionName} (${region})...`);
  
  const client = new DynamoDBClient({
    region: region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  });

  try {
    const command = new ListTablesCommand({});
    const response = await client.send(command);
    
    console.log(`✅ Successfully connected to ${regionName}`);
    console.log(`📋 Found ${response.TableNames.length} tables:`);
    
    const bowTables = response.TableNames.filter(name => name.startsWith('bow-'));
    bowTables.forEach(table => {
      console.log(`   - ${table}`);
    });
    
    if (bowTables.length === 0) {
      console.log(`   ⚠️  No BOW tables found in ${regionName}`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error connecting to ${regionName}:`, error.message);
    return false;
  }
};

const main = async () => {
  console.log('🧪 Testing Migration Setup');
  console.log('==========================');
  
  // Check environment variables
  console.log('\n📋 Environment Variables:');
  console.log(`AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`AWS_REGION: ${process.env.AWS_REGION || 'Not set (will use default)'}`);
  
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('\n❌ Missing AWS credentials. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env file.');
    process.exit(1);
  }
  
  // Test source region (us-east-2)
  const sourceOk = await testRegion('us-east-2', 'Source Region (us-east-2)');
  
  // Test destination region (us-west-2)
  const destOk = await testRegion('us-west-2', 'Destination Region (us-west-2)');
  
  console.log('\n📊 Test Results:');
  console.log(`Source Region (us-east-2): ${sourceOk ? '✅ Ready' : '❌ Issues'}`);
  console.log(`Destination Region (us-west-2): ${destOk ? '✅ Ready' : '❌ Issues'}`);
  
  if (sourceOk && destOk) {
    console.log('\n🎉 All tests passed! You can proceed with migration.');
    console.log('\nNext step: Run "node migrate-dynamodb.js"');
  } else {
    console.log('\n❌ Some tests failed. Please fix the issues before proceeding.');
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}

module.exports = { testRegion }; 