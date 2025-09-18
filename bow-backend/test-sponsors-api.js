const fetch = require('node-fetch');

async function testSponsorsAPI() {
  console.log('🧪 Testing Sponsors API endpoints...\n');

  const baseUrl = 'http://localhost:3000';
  
  try {
    // Test 1: Check if server is running
    console.log('1️⃣ Testing server health...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    if (healthResponse.ok) {
      console.log('✅ Server is running');
    } else {
      throw new Error('Server is not responding');
    }

    // Test 2: Test GET /api/sponsors
    console.log('\n2️⃣ Testing GET /api/sponsors...');
    const getResponse = await fetch(`${baseUrl}/api/sponsors`);
    console.log('Status:', getResponse.status);
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log('✅ GET /api/sponsors working, found', data.length, 'sponsors');
    } else {
      const errorText = await getResponse.text();
      console.log('❌ GET /api/sponsors failed:', errorText);
    }

    // Test 3: Test GET /api/sponsors/admin
    console.log('\n3️⃣ Testing GET /api/sponsors/admin...');
    const adminResponse = await fetch(`${baseUrl}/api/sponsors/admin`);
    console.log('Status:', adminResponse.status);
    if (adminResponse.ok) {
      const data = await adminResponse.json();
      console.log('✅ GET /api/sponsors/admin working, found', data.length, 'sponsors');
    } else {
      const errorText = await adminResponse.text();
      console.log('❌ GET /api/sponsors/admin failed:', errorText);
    }

    // Test 4: Test POST /api/sponsors
    console.log('\n4️⃣ Testing POST /api/sponsors...');
    const testSponsor = {
      name: 'Test API Sponsor',
      logoUrl: 'https://example.com/test-logo.png',
      website: 'https://testsponsor.com',
      description: 'Test sponsor created via API',
      isActive: 'true'
    };

    const postResponse = await fetch(`${baseUrl}/api/sponsors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testSponsor)
    });

    console.log('Status:', postResponse.status);
    if (postResponse.ok) {
      const data = await postResponse.json();
      console.log('✅ POST /api/sponsors working, created sponsor:', data.name);
      
      // Test 5: Delete the test sponsor
      console.log('\n5️⃣ Cleaning up test sponsor...');
      const deleteResponse = await fetch(`${baseUrl}/api/sponsors/${data.id}`, {
        method: 'DELETE'
      });
      if (deleteResponse.ok) {
        console.log('✅ Test sponsor deleted successfully');
      } else {
        console.log('⚠️ Failed to delete test sponsor');
      }
    } else {
      const errorText = await postResponse.text();
      console.log('❌ POST /api/sponsors failed:', errorText);
    }

    console.log('\n🎉 API testing completed!');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('\n💡 Make sure your backend server is running:');
    console.log('   cd bow-backend && npm start');
  }
}

// Run the test
testSponsorsAPI();

