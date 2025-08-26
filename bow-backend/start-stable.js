#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting BOW Backend Server with Enhanced Stability...');
console.log('📁 Working directory:', process.cwd());
console.log('⏰ Started at:', new Date().toISOString());

// Check and create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  No .env file found. Creating one with stability settings...');
  const stableEnv = `# BOW Backend Environment Configuration - Enhanced for Stability

# Server Configuration
NODE_ENV=development
PORT=3000

# AWS Configuration
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key

# Connection Stability Settings
AWS_HTTP_TIMEOUT=30000
AWS_MAX_RETRIES=3
AWS_CONNECTION_TIMEOUT=10000
AWS_REQUEST_TIMEOUT=30000

# Keep-alive settings
KEEP_ALIVE_TIMEOUT=65000
KEEP_ALIVE_INTERVAL=30000

# Health check settings
HEALTH_CHECK_INTERVAL=30000
CONNECTION_MONITOR_INTERVAL=60000

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# IMPORTANT: Replace the AWS credentials above with your actual values!
# The server will not work without valid AWS credentials.
`;
  fs.writeFileSync(envPath, stableEnv);
  console.log('✅ Created .env file with stability settings');
  console.log('⚠️  IMPORTANT: Edit .env file and add your actual AWS credentials!');
} else {
  console.log('✅ .env file found');
}

// Load environment variables
require('dotenv').config();

// Validate critical environment variables
const requiredEnvVars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:', missingVars.join(', '));
  console.log('💡 Please edit the .env file and add your AWS credentials');
  console.log('   Example:');
  console.log('   AWS_ACCESS_KEY_ID=AKIA...');
  console.log('   AWS_SECRET_ACCESS_KEY=...');
  process.exit(1);
}

console.log('✅ Environment variables validated');
console.log('🔧 Starting server with enhanced stability features...');

// Start the server
const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: __dirname,
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'development'
  }
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
    console.log('💡 This might be due to:');
    console.log('   - Invalid AWS credentials');
    console.log('   - Port already in use');
    console.log('   - Missing dependencies');
    console.log('   - Network connectivity issues');
    process.exit(code);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGTERM');
});

console.log('\n💡 Server is starting...');
console.log('🔍 Check the logs above for any errors or connection issues.');
console.log('🏥 Health check will be available at http://localhost:3000/health');
console.log('📊 Use Ctrl+C to stop the server gracefully.');
