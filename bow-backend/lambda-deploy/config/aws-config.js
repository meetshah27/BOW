require('dotenv').config();

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { S3Client } = require('@aws-sdk/client-s3');

// Enhanced AWS Configuration with connection stability
// In Lambda, credentials come from IAM role automatically
// Only use explicit credentials if running outside Lambda
const isLambda = !!process.env.LAMBDA_TASK_ROOT || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

const awsConfig = {
  region: process.env.AWS_REGION || 'us-west-2',
  // In Lambda, NEVER use explicit credentials - always use IAM role
  // Only use explicit credentials for local development (outside Lambda)
  ...(!isLambda && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  } : {}),
  // Connection stability settings - Optimized for Lambda
  maxAttempts: parseInt(process.env.AWS_MAX_RETRIES) || 3, // Lambda doesn't need as many retries
  requestTimeout: parseInt(process.env.AWS_REQUEST_TIMEOUT) || 10000, // 10 seconds for Lambda
  connectionTimeout: parseInt(process.env.AWS_CONNECTION_TIMEOUT) || 5000, // 5 seconds for Lambda
  // Retry configuration
  retryMode: 'adaptive',
  // HTTP agent settings - Simplified for Lambda
  // Lambda doesn't need complex connection pooling since containers are short-lived
  httpOptions: {
    timeout: parseInt(process.env.AWS_HTTP_TIMEOUT) || 10000, // 10 seconds
    connectTimeout: parseInt(process.env.AWS_CONNECTION_TIMEOUT) || 5000, // 5 seconds
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

// isLambda is already defined above
let connectionHealthy = true; // Start optimistic - SDK will handle retries
let lastHealthCheck = Date.now();
let consecutiveFailures = 0;
const MAX_CONSECUTIVE_FAILURES = isLambda ? 5 : 3; // More lenient in Lambda

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

// isLambda is already defined above

if (!isLambda) {
  // Only run periodic health checks outside Lambda (for local/dev servers)
  const healthCheckInterval = setInterval(checkConnectionHealth, 
    parseInt(process.env.CONNECTION_MONITOR_INTERVAL) || 30000); // 30 seconds

  // Cleanup on process exit
  process.on('SIGINT', () => {
    clearInterval(healthCheckInterval);
    console.log('🛑 Health monitoring stopped');
  });

  process.on('SIGTERM', () => {
    clearInterval(healthCheckInterval);
    console.log('🛑 Health monitoring stopped');
  });
} else {
  console.log('🔧 Running in Lambda - periodic health checks disabled (on-demand only)');
}

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
