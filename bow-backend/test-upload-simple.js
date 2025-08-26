#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';

async function testUpload() {
  console.log('🧪 Testing Simple Upload...\n');

  try {
    // Test 1: Check if server is running
    console.log('1️⃣ Testing server health...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is healthy:', healthResponse.status);
    
    // Test 2: Check upload config
    console.log('\n2️⃣ Testing upload configuration...');
    const configResponse = await axios.get(`${BASE_URL}/api/upload/config`);
    console.log('✅ Upload config:', configResponse.data);
    
    // Test 3: Test simple file upload
    console.log('\n3️⃣ Testing file upload...');
    
    // Create a simple test file
    const testFile = Buffer.from('test content');
    const formData = new FormData();
    formData.append('media', testFile, {
      filename: 'test.txt',
      contentType: 'text/plain'
    });
    formData.append('type', 'founder-media');
    formData.append('founderName', 'Deepali Sane');

    const uploadResponse = await axios.post(`${BASE_URL}/api/upload/founder`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    console.log('✅ Upload successful:', uploadResponse.data);
    
    console.log('\n🎉 All tests passed! Upload is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    }
  }
}

testUpload().catch(console.error);
