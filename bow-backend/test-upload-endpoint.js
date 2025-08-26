#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testUploadEndpoint() {
  console.log('🧪 Testing Upload Endpoint...\n');

  try {
    // Test 1: Check if server is running
    console.log('1️⃣ Testing server health...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is healthy:', healthResponse.status);
    
    // Test 2: Check upload config
    console.log('\n2️⃣ Testing upload configuration...');
    const configResponse = await axios.get(`${BASE_URL}/api/upload/config`);
    console.log('✅ Upload config:', configResponse.data);
    
    // Test 3: Test upload endpoint accessibility
    console.log('\n3️⃣ Testing upload endpoint accessibility...');
    try {
      const uploadResponse = await axios.post(`${BASE_URL}/api/upload/founder`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('⚠️  Upload endpoint responded without file (expected 400):', uploadResponse.status);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Upload endpoint is accessible (returned 400 as expected for no file)');
        console.log('Response:', error.response.data);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    
    console.log('\n🎉 Upload endpoint test completed!');
    console.log('\n💡 Next steps:');
    console.log('   1. Try uploading a file from the frontend');
    console.log('   2. Check backend console for detailed logs');
    console.log('   3. Verify AWS credentials are set in .env file');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    }
  }
}

testUploadEndpoint().catch(console.error);
