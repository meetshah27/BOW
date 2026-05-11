const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('./config/dynamodb');

async function debugProducts() {
  const command = new ScanCommand({
    TableName: TABLES.PRODUCTS
  });

  try {
    const result = await docClient.send(command);
    console.log('--- PRODUCTS IN DYNAMODB ---');
    result.Items.forEach(p => {
      console.log(`Product: ${p.name}`);
      console.log(`ID: ${p.id}`);
      console.log(`Images: ${JSON.stringify(p.images)}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error scanning products:', error);
  }
}

debugProducts();
