#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting BOW Backend Server...');
console.log('📁 Working directory:', process.cwd());
console.log('⏰ Started at:', new Date().toISOString());

// Check if .env file exists
const fs = require('fs');
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  No .env file found. Creating a basic one...');
  const basicEnv = `# BOW Backend Environment Variables
PORT=3000
NODE_ENV=development

# AWS DynamoDB Configuration (optional)
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=your_access_key_here
# AWS_SECRET_ACCESS_KEY=your_secret_key_here

# Other Configuration
# STRIPE_SECRET_KEY=your_stripe_secret_key
# GOOGLE_CLIENT_ID=your_google_client_id
`;
  fs.writeFileSync(envPath, basicEnv);
  console.log('✅ Created basic .env file');
}

// Start the server
const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
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