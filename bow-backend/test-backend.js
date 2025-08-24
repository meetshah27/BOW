const axios = require('axios');

async function testBackend() {
  const baseURL = 'http://localhost:3000';
  
  console.log('🧪 Testing Backend Endpoints...\n');
  
  try {
    // Test 1: Basic server response
    console.log('1️⃣ Testing basic server...');
    const response = await axios.get(`${baseURL}/health`);
    console.log('✅ Server is running:', response.status);
    
    // Test 2: Check if User model is loaded
    console.log('\n2️⃣ Testing User model...');
    const userResponse = await axios.get(`${baseURL}/users`);
    console.log('✅ Users endpoint working:', userResponse.status);
    
    // Test 3: Test role refresh endpoint
    console.log('\n3️⃣ Testing role refresh endpoint...');
    const testEmail = 'test@example.com';
    const roleResponse = await axios.get(`${baseURL}/users/refresh-role/${testEmail}`);
    console.log('✅ Role refresh endpoint working:', roleResponse.status);
    console.log('📊 Response:', roleResponse.data);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.response) {
      console.log('📡 Status:', error.response.status);
      console.log('📊 Data:', error.response.data);
    }
  }
}

testBackend();
