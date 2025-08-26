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
  // Connection stability settings - Increased for better stability
  maxAttempts: parseInt(process.env.AWS_MAX_RETRIES) || 5,
  requestTimeout: parseInt(process.env.AWS_REQUEST_TIMEOUT) || 120000, // 2 minutes
  connectionTimeout: parseInt(process.env.AWS_CONNECTION_TIMEOUT) || 30000, // 30 seconds
  // Keep-alive settings - More aggressive for stability
  keepAlive: true,
  keepAliveMsecs: 60000, // 1 minute
  // Retry configuration
  retryMode: 'adaptive',
  // HTTP agent settings - Optimized for long-running connections
  httpOptions: {
    timeout: parseInt(process.env.AWS_HTTP_TIMEOUT) || 120000, // 2 minutes
    connectTimeout: parseInt(process.env.AWS_CONNECTION_TIMEOUT) || 30000, // 30 seconds
    keepAlive: true,
    keepAliveMsecs: 60000, // 1 minute
    maxSockets: 100, // Increased from 50
    maxFreeSockets: 20, // Increased from 10
    freeSocketTimeout: 60000, // Increased to 1 minute
    // Add socket keep-alive
    keepAliveMsecs: 60000,
    // Add connection pooling
    pool: {
      maxSockets: 100,
      maxFreeSockets: 20,
      timeout: 60000,
      freeSocketTimeout: 60000
    }
  }
};

// Create DynamoDB client with enhanced configuration
console.log('🔧 Creating DynamoDB client with enhanced stability config...');
console.log('   Max retries:', awsConfig.maxAttempts);
console.log('   Request timeout:', awsConfig.requestTimeout + 'ms');
console.log('   Connection timeout:', awsConfig.connectionTimeout + 'ms');
console.log('   Keep-alive interval:', awsConfig.keepAliveMsecs + 'ms');

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
let consecutiveFailures = 0;
const MAX_CONSECUTIVE_FAILURES = 3;

// Health check function with exponential backoff
async function checkConnectionHealth() {
  try {
    const { ListTablesCommand } = require('@aws-sdk/client-dynamodb');
    const command = new ListTablesCommand({ Limit: 1 });
    await dynamoClient.send(command);
    
    if (!connectionHealthy) {
      console.log('✅ Connection restored at:', new Date().toISOString());
      connectionHealthy = true;
      consecutiveFailures = 0;
    }
    
    lastHealthCheck = Date.now();
    return true;
  } catch (error) {
    consecutiveFailures++;
    
    if (connectionHealthy) {
      console.error('❌ Connection lost at:', new Date().toISOString());
      console.error('   Error:', error.message);
      console.error('   Consecutive failures:', consecutiveFailures);
      connectionHealthy = false;
    }
    
    // If we have too many consecutive failures, try to recreate the client
    if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
      console.log('🔄 Too many consecutive failures, attempting to recreate DynamoDB client...');
      try {
        // Recreate the client
        const newDynamoClient = new DynamoDBClient(awsConfig);
        const newDocClient = DynamoDBDocumentClient.from(newDynamoClient, {
          marshallOptions: {
            removeUndefinedValues: true,
          },
          unmarshallOptions: {
            wrapNumbers: false,
          },
        });
        
        // Test the new client
        const testCommand = new ListTablesCommand({ Limit: 1 });
        await newDynamoClient.send(testCommand);
        
        // Replace the old clients
        Object.assign(dynamoClient, newDynamoClient);
        Object.assign(docClient, newDocClient);
        
        console.log('✅ DynamoDB client recreated successfully');
        connectionHealthy = true;
        consecutiveFailures = 0;
        return true;
      } catch (recreateError) {
        console.error('❌ Failed to recreate DynamoDB client:', recreateError.message);
      }
    }
    
    return false;
  }
}

// Periodic health monitoring - More frequent for better stability
const healthCheckInterval = setInterval(checkConnectionHealth, 
  parseInt(process.env.CONNECTION_MONITOR_INTERVAL) || 30000); // 30 seconds instead of 60

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
  getLastHealthCheck: () => lastHealthCheck,
  getConsecutiveFailures: () => consecutiveFailures
};
