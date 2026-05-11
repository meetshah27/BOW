
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('./config/dynamodb');

async function debugUsers() {
  try {
    const command = new ScanCommand({
      TableName: TABLES.USERS
    });
    const result = await docClient.send(command);
    console.log('Users found:', JSON.stringify(result.Items, null, 2));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

debugUsers();
