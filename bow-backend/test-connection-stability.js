#!/usr/bin/env node

/**
 * Connection Stability Test
 * 
 * This script tests the connection stability of your backend
 * by making periodic requests and monitoring for disconnections.
 */

const axios = require('axios');
const { checkConnectionHealth } = require('./config/aws-config');

// Configuration
const TEST_DURATION = 10 * 60 * 1000; // 10 minutes
const TEST_INTERVAL = 30 * 1000; // 30 seconds
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

// Test results
let testResults = {
  startTime: Date.now(),
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  connectionErrors: 0,
  disconnections: 0,
  lastSuccess: null,
  lastFailure: null,
  errors: []
};

console.log('🧪 Starting Connection Stability Test...');
console.log(`⏱️  Test Duration: ${TEST_DURATION / 60000} minutes`);
console.log(`🔄 Test Interval: ${TEST_INTERVAL / 1000} seconds`);
console.log(`🌐 Base URL: ${BASE_URL}`);
console.log('📊 Monitoring for disconnections...\n');

// Test function
async function runTest() {
  const timestamp = new Date().toISOString();
  testResults.totalRequests++;
  
  try {
    // Test 1: Health endpoint
    const healthResponse = await axios.get(`${BASE_URL}/health`, {
      timeout: 10000
    });
    
    if (healthResponse.status === 200) {
      testResults.successfulRequests++;
      testResults.lastSuccess = timestamp;
      
      const healthData = healthResponse.data;
      console.log(`✅ [${timestamp}] Health check: ${healthData.status}`);
      
      if (healthData.database && healthData.database.connected) {
        console.log(`   📊 Database: Connected`);
      } else {
        console.log(`   ⚠️  Database: Disconnected`);
        testResults.disconnections++;
      }
    }
    
  } catch (error) {
    testResults.failedRequests++;
    testResults.lastFailure = timestamp;
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.log(`❌ [${timestamp}] Connection refused - Server may be down`);
      testResults.connectionErrors++;
    } else if (error.code === 'ETIMEDOUT') {
      console.log(`⏰ [${timestamp}] Request timeout`);
      testResults.errors.push({ timestamp, error: 'Request timeout' });
    } else {
      console.log(`❌ [${timestamp}] Request failed: ${error.message}`);
      testResults.errors.push({ timestamp, error: error.message });
    }
  }
  
  // Test 2: AWS Connection health
  try {
    const awsHealthy = await checkConnectionHealth();
    if (awsHealthy) {
      console.log(`   🔗 AWS Connection: Healthy`);
    } else {
      console.log(`   ⚠️  AWS Connection: Unhealthy`);
      testResults.disconnections++;
    }
  } catch (error) {
    console.log(`   ❌ AWS Connection Error: ${error.message}`);
    testResults.errors.push({ timestamp, error: `AWS: ${error.message}` });
  }
  
  // Print summary every 10 requests
  if (testResults.totalRequests % 10 === 0) {
    printSummary();
  }
}

// Print test summary
function printSummary() {
  const uptime = Date.now() - testResults.startTime;
  const uptimeMinutes = Math.floor(uptime / 60000);
  const uptimeSeconds = Math.floor((uptime % 60000) / 1000);
  
  console.log('\n📊 Test Summary:');
  console.log(`   ⏱️  Uptime: ${uptimeMinutes}m ${uptimeSeconds}s`);
  console.log(`   📡 Total Requests: ${testResults.totalRequests}`);
  console.log(`   ✅ Successful: ${testResults.successfulRequests}`);
  console.log(`   ❌ Failed: ${testResults.failedRequests}`);
  console.log(`   🔗 Connection Errors: ${testResults.connectionErrors}`);
  console.log(`   🔄 Disconnections: ${testResults.disconnections}`);
  console.log(`   📈 Success Rate: ${((testResults.successfulRequests / testResults.totalRequests) * 100).toFixed(1)}%`);
  
  if (testResults.lastSuccess) {
    console.log(`   🕐 Last Success: ${testResults.lastSuccess}`);
  }
  if (testResults.lastFailure) {
    console.log(`   🕐 Last Failure: ${testResults.lastFailure}`);
  }
  
  console.log(''); // Empty line for readability
}

// Main test loop
async function startTest() {
  const testInterval = setInterval(runTest, TEST_INTERVAL);
  
  // Stop test after duration
  setTimeout(() => {
    clearInterval(testInterval);
    console.log('\n🏁 Test completed!');
    printSummary();
    
    // Final analysis
    if (testResults.disconnections === 0) {
      console.log('🎉 No disconnections detected during the test period!');
    } else {
      console.log(`⚠️  Detected ${testResults.disconnections} disconnections during the test.`);
    }
    
    if (testResults.successfulRequests / testResults.totalRequests > 0.95) {
      console.log('✅ Connection stability is excellent (>95% success rate)');
    } else if (testResults.successfulRequests / testResults.totalRequests > 0.90) {
      console.log('⚠️  Connection stability is good (>90% success rate)');
    } else {
      console.log('❌ Connection stability needs improvement (<90% success rate)');
    }
    
    process.exit(0);
  }, TEST_DURATION);
  
  // Run initial test immediately
  await runTest();
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted by user');
  printSummary();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Test terminated');
  printSummary();
  process.exit(0);
});

// Start the test
startTest().catch(error => {
  console.error('❌ Test failed to start:', error.message);
  process.exit(1);
});
