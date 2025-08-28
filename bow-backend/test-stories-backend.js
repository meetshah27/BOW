// Test script for Stories Backend
// Run this with: node test-stories-backend.js

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testStory = {
  title: 'Test Story Title',
  author: 'Test Author',
  content: 'This is a test story content for testing purposes.',
  excerpt: 'A brief test excerpt',
  category: 'Community',
  tags: ['test', 'community'],
  featured: false
};

async function testStoriesBackend() {
  console.log('🧪 Testing Stories Backend Endpoints...\n');

  try {
    // Test 1: Get all stories
    console.log('📖 Test 1: Getting all stories...');
    const getResponse = await axios.get(`${BASE_URL}/stories`);
    console.log('✅ GET /stories:', getResponse.status, getResponse.data.length, 'stories found');
    
    // Test 2: Create a test story
    console.log('\n📝 Test 2: Creating a test story...');
    const createResponse = await axios.post(`${BASE_URL}/stories/test`, testStory);
    console.log('✅ POST /stories/test:', createResponse.status, createResponse.data);
    
    const storyId = createResponse.data.id;
    
    // Test 3: Get the created story
    console.log('\n🔍 Test 3: Getting the created story...');
    const getOneResponse = await axios.get(`${BASE_URL}/stories/${storyId}`);
    console.log('✅ GET /stories/:id:', getOneResponse.status, getOneResponse.data.title);
    
    // Test 4: Update the story
    console.log('\n✏️ Test 4: Updating the story...');
    const updateData = { ...testStory, title: 'Updated Test Story Title' };
    const updateResponse = await axios.put(`${BASE_URL}/stories/test/${storyId}`, updateData);
    console.log('✅ PUT /stories/test/:id:', updateResponse.status, updateResponse.data);
    
    // Test 5: Delete the story
    console.log('\n🗑️ Test 5: Deleting the story...');
    const deleteResponse = await axios.delete(`${BASE_URL}/stories/test/${storyId}`);
    console.log('✅ DELETE /stories/test/:id:', deleteResponse.status, deleteResponse.data);
    
    // Test 6: Verify story is deleted
    console.log('\n🔍 Test 6: Verifying story is deleted...');
    try {
      await axios.get(`${BASE_URL}/stories/${storyId}`);
      console.log('❌ Story still exists after deletion');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ Story successfully deleted (404 as expected)');
      } else {
        console.log('⚠️ Unexpected error:', error.message);
      }
    }
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests
testStoriesBackend();
