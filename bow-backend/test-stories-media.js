const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testStoriesMedia() {
  console.log('🧪 Testing Stories Media Endpoints...\n');

  try {
    // Test 1: GET stories media
    console.log('📖 Test 1: Getting stories media...');
    const getResponse = await axios.get(`${BASE_URL}/stories-media`);
    console.log('✅ GET /stories-media successful:', getResponse.data);
    console.log('');

    // Test 2: POST new stories media
    console.log('📝 Test 2: Creating new stories media...');
    const newMedia = {
      mediaType: 'image',
      mediaUrl: 'https://example.com/test-image.jpg',
      title: 'Test Stories Media',
      description: 'This is a test stories media entry',
      storiesTitle: 'Test Community Stories',
      storiesDescription: 'Test description for community stories',
      storiesSubtitle: 'Test subtitle'
    };
    
    const postResponse = await axios.post(`${BASE_URL}/stories-media`, newMedia);
    console.log('✅ POST /stories-media successful:', postResponse.data);
    console.log('');

    // Test 3: PUT update stories media
    console.log('💾 Test 3: Updating stories media...');
    const updateData = {
      title: 'Updated Test Stories Media',
      description: 'This is an updated test stories media entry'
    };
    
    const putResponse = await axios.put(`${BASE_URL}/stories-media`, updateData);
    console.log('✅ PUT /stories-media successful:', putResponse.data);
    console.log('');

    // Test 4: GET updated stories media
    console.log('📖 Test 4: Getting updated stories media...');
    const getUpdatedResponse = await axios.get(`${BASE_URL}/stories-media`);
    console.log('✅ GET updated /stories-media successful:', getUpdatedResponse.data);
    console.log('');

    console.log('🎉 All tests passed! Stories media endpoints are working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('📊 Response status:', error.response.status);
      console.error('📄 Response data:', error.response.data);
    }
  }
}

// Run the test
testStoriesMedia();
