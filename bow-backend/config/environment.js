require('dotenv').config();

const environment = {
  // Server configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  
  // AWS Configuration
  AWS_REGION: process.env.AWS_REGION || 'us-west-2',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  
  // Cognito Configuration
  COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID || 'us-west-2_Imazy2DXa',
  COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID || '7qiar42f9ujh3p8atoel4dp055',
  COGNITO_REGION: process.env.COGNITO_REGION || 'us-west-2',
  
  // DynamoDB Configuration
  DYNAMODB_TABLE_PREFIX: process.env.DYNAMODB_TABLE_PREFIX || 'bow_',
  
  // S3 Configuration
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'bow-media-storages',
  S3_REGION: process.env.S3_REGION || 'us-west-2',
  
  // Stripe Configuration
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  
  // Security Configuration
  JWT_SECRET: process.env.JWT_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret-change-this',
  
  // CORS Configuration
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(',') : 
    ['http://localhost:3000', 'http://localhost:3001'],
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // API Configuration
  API_BASE_URL: process.env.API_BASE_URL,
  
  // Email Configuration (if using SES)
  SES_REGION: process.env.SES_REGION || 'us-west-2',
  SES_ACCESS_KEY_ID: process.env.SES_ACCESS_KEY_ID,
  SES_SECRET_ACCESS_KEY: process.env.SES_SECRET_ACCESS_KEY,
  
  // Database Configuration (if using other databases)
  DATABASE_URL: process.env.DATABASE_URL,
  
  // Redis Configuration (if using Redis for sessions/caching)
  REDIS_URL: process.env.REDIS_URL,
  
  // Monitoring and Analytics
  SENTRY_DSN: process.env.SENTRY_DSN,
  NEW_RELIC_LICENSE_KEY: process.env.NEW_RELIC_LICENSE_KEY,
  
  // Feature Flags
  ENABLE_REGISTRATION: process.env.ENABLE_REGISTRATION !== 'false',
  ENABLE_EMAIL_VERIFICATION: process.env.ENABLE_EMAIL_VERIFICATION !== 'false',
  ENABLE_STRIPE_PAYMENTS: process.env.ENABLE_STRIPE_PAYMENTS !== 'false',
  
  // Development/Testing
  ENABLE_MOCK_DATA: process.env.ENABLE_MOCK_DATA === 'true',
  SKIP_AUTHENTICATION: process.env.SKIP_AUTHENTICATION === 'true',
};

// Validation function
const validateEnvironment = () => {
  const required = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'STRIPE_SECRET_KEY'
  ];
  
  const missing = required.filter(key => !environment[key]);
  
  if (missing.length > 0) {
    console.warn('⚠️  Missing required environment variables:', missing);
    console.warn('💡 Some features may not work properly without these variables');
  }
  
  // Validate AWS configuration
  if (!environment.AWS_ACCESS_KEY_ID || !environment.AWS_SECRET_ACCESS_KEY) {
    console.warn('⚠️  AWS credentials not configured - DynamoDB and S3 features will be disabled');
  }
  
  // Validate Stripe configuration
  if (!environment.STRIPE_SECRET_KEY) {
    console.warn('⚠️  Stripe secret key not configured - payment features will be disabled');
  }
  
  // Validate JWT secret
  if (!environment.JWT_SECRET) {
    console.warn('⚠️  JWT_SECRET not configured - using default (not recommended for production)');
  }
  
  return environment;
};

// Get environment variable with validation
const get = (key, defaultValue = null) => {
  return environment[key] !== undefined ? environment[key] : defaultValue;
};

// Check if environment is production
const isProduction = () => {
  return environment.NODE_ENV === 'production';
};

// Check if environment is development
const isDevelopment = () => {
  return environment.NODE_ENV === 'development';
};

// Check if environment is test
const isTest = () => {
  return environment.NODE_ENV === 'test';
};

module.exports = {
  ...environment,
  validateEnvironment,
  get,
  isProduction,
  isDevelopment,
  isTest
};

