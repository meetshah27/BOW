#!/usr/bin/env node

require('dotenv').config();
const { checkConnectionHealth, isConnectionHealthy, getLastHealthCheck } = require('./config/aws-config');

console.log('🔍 BOW Backend Connection Monitor');
console.log('⏰ Started at:', new Date().toISOString());
console.log('📊 Monitoring interval: 30 seconds');
console.log('🔄 Max retries: 3');

let consecutiveFailures = 0;
let totalChecks = 0;
let successfulChecks = 0;

// Connection monitoring function
async function monitorConnection() {
  totalChecks++;
  const timestamp = new Date().toISOString();
  
  try {
    console.log(`\n🧪 Check #${totalChecks} at ${timestamp}`);
    
    const healthy = await checkConnectionHealth();
    
    if (healthy) {
      successfulChecks++;
      consecutiveFailures = 0;
      console.log('✅ Connection healthy');
      console.log(`📈 Success rate: ${((successfulChecks / totalChecks) * 100).toFixed(1)}%`);
    } else {
      consecutiveFailures++;
      console.log('❌ Connection unhealthy');
      console.log(`⚠️  Consecutive failures: ${consecutiveFailures}`);
      
      if (consecutiveFailures >= 3) {
        console.log('🚨 CRITICAL: Multiple consecutive failures detected!');
        console.log('💡 Possible causes:');
        console.log('   - AWS credentials expired');
        console.log('   - Network connectivity issues');
        console.log('   - AWS service outage');
        console.log('   - Rate limiting');
      }
    }
    
    console.log(`📊 Stats: ${successfulChecks}/${totalChecks} successful`);
    console.log(`⏰ Last health check: ${new Date(getLastHealthCheck()).toISOString()}`);
    
  } catch (error) {
    consecutiveFailures++;
    console.error('💥 Monitoring error:', error.message);
    console.log(`⚠️  Consecutive failures: ${consecutiveFailures}`);
  }
}

// Start monitoring
const monitorInterval = setInterval(monitorConnection, 30000);

// Initial check
monitorConnection();

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping connection monitor...');
  clearInterval(monitorInterval);
  
  console.log('\n📊 Final Statistics:');
  console.log(`   Total checks: ${totalChecks}`);
  console.log(`   Successful: ${successfulChecks}`);
  console.log(`   Failed: ${totalChecks - successfulChecks}`);
  console.log(`   Success rate: ${((successfulChecks / totalChecks) * 100).toFixed(1)}%`);
  
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping connection monitor...');
  clearInterval(monitorInterval);
  process.exit(0);
});

console.log('\n💡 Monitor is running. Press Ctrl+C to stop.');
console.log('🔍 Check the logs above for connection status updates.');
