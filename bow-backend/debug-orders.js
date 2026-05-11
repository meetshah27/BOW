
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('./config/dynamodb');

async function debugOrders() {
  try {
    const command = new ScanCommand({
      TableName: TABLES.ORDERS
    });
    const result = await docClient.send(command);
    console.log('Orders found:', JSON.stringify(result.Items, null, 2));
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
}

debugOrders();
