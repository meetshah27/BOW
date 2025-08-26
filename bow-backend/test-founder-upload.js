#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

async function testFounderUpload() {
  console.log('🧪 Testing Founder Media Upload...\n');

  try {
    // Create a test image file (1x1 pixel PNG)
    const testImagePath = path.join(__dirname, 'test-image.png');
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync(testImagePath, testImageBuffer);
    console.log('✅ Test image created');

    // Test upload
    console.log('1️⃣ Testing POST /api/upload/founder...');
    
    const formData = new FormData();
    formData.append('media', fs.createReadStream(testImagePath));
    formData.append('type', 'founder-media');
    formData.append('founderName', 'Deepali Sane');

    const uploadResponse = await axios.post(`${BASE_URL}/api/upload/founder`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    console.log('✅ Upload successful:', uploadResponse.data);
    console.log('');

    // Clean up test file
    fs.unlinkSync(testImagePath);
    console.log('✅ Test image cleaned up');

    // Test saving the media data
    console.log('2️⃣ Testing PUT /api/founder-media with uploaded file...');
    const mediaData = {
      mediaType: 'image',
      mediaUrl: uploadResponse.data.data.fileUrl,
      thumbnailUrl: uploadResponse.data.data.fileUrl,
      title: 'Test Uploaded Image',
      description: 'This image was uploaded via the test script',
      altText: 'Test founder image upload',
      isActive: true,
      overlayOpacity: 0.1,
      founderName: 'Deepali Sane',
      founderRole: 'Vice Chair & Co-Founder'
    };

    const saveResponse = await axios.put(`${BASE_URL}/api/founder-media`, mediaData);
    console.log('✅ Save successful:', saveResponse.data);
    console.log('');

    // Verify the data was saved
    console.log('3️⃣ Verifying saved data...');
    const verifyResponse = await axios.get(`${BASE_URL}/api/founder-media`);
    console.log('✅ Verification successful:', verifyResponse.data);
    console.log('');

    console.log('🎉 All upload tests passed! Founder Media upload is working correctly.');

  } catch (error) {
    console.error('❌ Upload test failed:', error.response?.data || error.message);
    
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
  console.log('🚀 BOW Backend - Founder Media Upload Test');
  console.log('==========================================\n');

  const isHealthy = await checkServerHealth();
  if (!isHealthy) {
    process.exit(1);
  }

  await testFounderUpload();
}

main().catch(console.error);
