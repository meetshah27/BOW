const http = require('http');

console.log('🔍 Testing backend server status...');

// Test the test endpoint we added
const testOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/upload/test',
  method: 'GET'
};

const testReq = http.request(testOptions, (res) => {
  console.log('✅ Test endpoint response status:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📋 Test endpoint response:', data);
  });
});

testReq.on('error', (error) => {
  console.error('❌ Test endpoint error:', error.message);
});

testReq.end();

// Test the health endpoint
const healthOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/health',
  method: 'GET'
};

const healthReq = http.request(healthOptions, (res) => {
  console.log('✅ Health endpoint response status:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📋 Health endpoint response:', data);
  });
});

healthReq.on('error', (error) => {
  console.error('❌ Health endpoint error:', error.message);
});

healthReq.end();
