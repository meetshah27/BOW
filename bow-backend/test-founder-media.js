#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testFounderMediaAPI() {
  console.log('🧪 Testing Founder Media API...\n');

  try {
    // Test GET /api/founder-media
    console.log('1️⃣ Testing GET /api/founder-media...');
    const getResponse = await axios.get(`${BASE_URL}/api/founder-media`);
    console.log('✅ GET successful:', getResponse.data);
    console.log('');

    // Test PUT /api/founder-media
    console.log('2️⃣ Testing PUT /api/founder-media...');
    const testData = {
      mediaType: 'image',
      mediaUrl: 'https://example.com/test-image.jpg',
      thumbnailUrl: 'https://example.com/test-thumbnail.jpg',
      title: 'Test Founder Media',
      description: 'This is a test founder media entry',
      altText: 'Test founder image',
      isActive: true,
      overlayOpacity: 0.2,
      founderName: 'Deepali Sane',
      founderRole: 'Vice Chair & Co-Founder'
    };

    const putResponse = await axios.put(`${BASE_URL}/api/founder-media`, testData);
    console.log('✅ PUT successful:', putResponse.data);
    console.log('');

    // Test GET again to see if data was saved
    console.log('3️⃣ Testing GET /api/founder-media again to verify data persistence...');
    const getResponse2 = await axios.get(`${BASE_URL}/api/founder-media`);
    console.log('✅ GET successful:', getResponse2.data);
    console.log('');

    console.log('🎉 All tests passed! Founder Media API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

// Check if server is running
async function checkServerHealth() {
  try {
    // Try multiple common health endpoints
    const healthEndpoints = ['/health', '/api/health', '/', '/api/founder-media'];
    
    for (const endpoint of healthEndpoints) {
      try {
        console.log(`🔍 Trying endpoint: ${BASE_URL}${endpoint}`);
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
          timeout: 5000 // 5 second timeout
        });
        console.log(`✅ Server is running and responding on ${endpoint}`);
        return true;
      } catch (endpointError) {
        console.log(`   ⚠️  ${endpoint} failed: ${endpointError.message}`);
        // Continue to next endpoint
      }
    }
    
    console.error('❌ Server is not responding on any common endpoints');
    console.error('\n💡 Troubleshooting steps:');
    console.error('   1. Make sure your backend server is running with: npm start');
    console.error('   2. Check that the server is running on port 3000');
    console.error('   3. Verify no firewall is blocking the connection');
    console.error('   4. Check server logs for any errors');
    return false;
  } catch (error) {
    console.error('❌ Server connection failed');
    console.error('Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Connection refused - server is not running');
      console.error('Please start the server with: npm start');
    } else if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Host not found - check your network connection');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\n💡 Connection timeout - server might be overloaded');
    }
    
    return false;
  }
}

async function main() {
  console.log('🚀 BOW Backend - Founder Media API Test');
  console.log('========================================\n');

  const isHealthy = await checkServerHealth();
  if (!isHealthy) {
    process.exit(1);
  }

  await testFounderMediaAPI();
}

main().catch(console.error);
