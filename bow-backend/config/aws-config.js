require('dotenv').config();

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { S3Client } = require('@aws-sdk/client-s3');

// Enhanced AWS Configuration with connection stability
const awsConfig = {
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  // Connection stability settings
  maxAttempts: parseInt(process.env.AWS_MAX_RETRIES) || 3,
  requestTimeout: parseInt(process.env.AWS_REQUEST_TIMEOUT) || 30000,
  connectionTimeout: parseInt(process.env.AWS_CONNECTION_TIMEOUT) || 10000,
  // Keep-alive settings
  keepAlive: true,
  keepAliveMsecs: 30000,
  // Retry configuration
  retryMode: 'adaptive',
  // HTTP agent settings
  httpOptions: {
    timeout: parseInt(process.env.AWS_HTTP_TIMEOUT) || 30000,
    connectTimeout: parseInt(process.env.AWS_CONNECTION_TIMEOUT) || 10000,
    keepAlive: true,
    keepAliveMsecs: 30000,
    maxSockets: 50,
    maxFreeSockets: 10,
    freeSocketTimeout: 30000,
  }
};

// Create DynamoDB client with enhanced configuration
console.log('🔧 Creating DynamoDB client with enhanced stability config...');
console.log('   Max retries:', awsConfig.maxAttempts);
console.log('   Request timeout:', awsConfig.requestTimeout + 'ms');
console.log('   Connection timeout:', awsConfig.connectionTimeout + 'ms');

const dynamoClient = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(dynamoClient, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

// Create S3 client with enhanced configuration
const s3Client = new S3Client(awsConfig);

// Connection health monitoring
let connectionHealthy = true;
let lastHealthCheck = Date.now();

// Health check function
async function checkConnectionHealth() {
  try {
    const { ListTablesCommand } = require('@aws-sdk/client-dynamodb');
    const command = new ListTablesCommand({ Limit: 1 });
    await dynamoClient.send(command);
    
    if (!connectionHealthy) {
      console.log('✅ Connection restored at:', new Date().toISOString());
      connectionHealthy = true;
    }
    
    lastHealthCheck = Date.now();
    return true;
  } catch (error) {
    if (connectionHealthy) {
      console.error('❌ Connection lost at:', new Date().toISOString());
      console.error('   Error:', error.message);
      connectionHealthy = false;
    }
    return false;
  }
}

// Periodic health monitoring
const healthCheckInterval = setInterval(checkConnectionHealth, 
  parseInt(process.env.CONNECTION_MONITOR_INTERVAL) || 60000);

// Cleanup on process exit
process.on('SIGINT', () => {
  clearInterval(healthCheckInterval);
  console.log('🛑 Health monitoring stopped');
});

process.on('SIGTERM', () => {
  clearInterval(healthCheckInterval);
  console.log('🛑 Health monitoring stopped');
});

// Export enhanced clients and health status
module.exports = {
  docClient,
  dynamoClient,
  s3Client,
  awsConfig,
  checkConnectionHealth,
  isConnectionHealthy: () => connectionHealthy,
  getLastHealthCheck: () => lastHealthCheck
};
