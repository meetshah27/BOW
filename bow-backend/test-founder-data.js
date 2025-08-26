#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testFounderData() {
  console.log('🧪 Testing Founder Media Data Flow...\n');

  try {
    // Test 1: Check current founder media
    console.log('1️⃣ Checking current founder media...');
    const getResponse = await axios.get(`${BASE_URL}/api/founder-media`);
    console.log('✅ Current founder media:', getResponse.data);
    
    // Test 2: Update founder media with test data
    console.log('\n2️⃣ Updating founder media with test data...');
    const testData = {
      mediaType: 'image',
      mediaUrl: 'https://example.com/test-image.jpg',
      thumbnailUrl: 'https://example.com/test-thumbnail.jpg',
      title: 'Test Founder Image',
      description: 'This is a test image for Deepali Sane',
      altText: 'Test founder image',
      isActive: true,
      overlayOpacity: 0.2,
      founderName: 'Deepali Sane',
      founderRole: 'Vice Chair & Co-Founder'
    };
    
    const putResponse = await axios.put(`${BASE_URL}/api/founder-media`, testData);
    console.log('✅ Update response:', putResponse.data);
    
    // Test 3: Check if data was saved by fetching again
    console.log('\n3️⃣ Verifying saved data...');
    const getResponse2 = await axios.get(`${BASE_URL}/api/founder-media`);
    console.log('✅ Updated founder media:', getResponse2.data);
    
    // Test 4: Check if media will display
    const willDisplay = !!(getResponse2.data.mediaUrl && getResponse2.data.isActive);
    console.log('\n4️⃣ Media display check:');
    console.log(`   - mediaUrl: ${getResponse2.data.mediaUrl}`);
    console.log(`   - isActive: ${getResponse2.data.isActive}`);
    console.log(`   - Will display: ${willDisplay ? 'YES' : 'NO'}`);
    
    if (willDisplay) {
      console.log('🎉 Founder media should display correctly on About page!');
    } else {
      console.log('❌ Founder media will NOT display - check the conditions above');
    }
    
    console.log('\n💡 Next steps:');
    console.log('   1. Check the About page to see if media appears');
    console.log('   2. If not, check backend console for DynamoDB errors');
    console.log('   3. Verify AWS credentials and DynamoDB table exist');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    }
  }
}

testFounderData().catch(console.error);
