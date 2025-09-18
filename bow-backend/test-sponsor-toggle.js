// Use built-in fetch (Node.js 18+) or require node-fetch for older versions
let fetch;
try {
  // Try to use built-in fetch first
  fetch = globalThis.fetch;
  if (!fetch) {
    throw new Error('Built-in fetch not available');
  }
} catch (error) {
  // Fallback to node-fetch if available
  try {
    fetch = require('node-fetch');
  } catch (e) {
    console.error('❌ Neither built-in fetch nor node-fetch is available');
    console.error('Please install node-fetch: npm install node-fetch');
    process.exit(1);
  }
}

async function testSponsorToggle() {
  console.log('🧪 Testing Sponsor Toggle API...\n');

  const baseUrl = 'http://localhost:3000';
  
  try {
    // Test 1: Create a test sponsor
    console.log('1️⃣ Creating test sponsor...');
    const testSponsor = {
      name: 'Toggle Test Sponsor',
      logoUrl: 'https://example.com/test-logo.png',
      website: 'https://testsponsor.com',
      description: 'Test sponsor for toggle functionality',
      isActive: 'true'
    };

    const createResponse = await fetch(`${baseUrl}/api/sponsors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testSponsor)
    });

    if (!createResponse.ok) {
      throw new Error(`Failed to create test sponsor: ${createResponse.status}`);
    }

    const createdSponsor = await createResponse.json();
    console.log('✅ Test sponsor created:', createdSponsor.name, '(ID:', createdSponsor.id, ')');

    // Test 2: Toggle to inactive
    console.log('\n2️⃣ Toggling sponsor to inactive...');
    const toggleInactiveResponse = await fetch(`${baseUrl}/api/sponsors/${createdSponsor.id}/toggle`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isActive: 'false' })
    });

    if (!toggleInactiveResponse.ok) {
      const errorText = await toggleInactiveResponse.text();
      throw new Error(`Failed to toggle inactive: ${toggleInactiveResponse.status} ${errorText}`);
    }

    const inactiveSponsor = await toggleInactiveResponse.json();
    console.log('✅ Sponsor toggled to inactive:', inactiveSponsor.isActive);

    // Test 3: Toggle back to active
    console.log('\n3️⃣ Toggling sponsor back to active...');
    const toggleActiveResponse = await fetch(`${baseUrl}/api/sponsors/${createdSponsor.id}/toggle`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isActive: 'true' })
    });

    if (!toggleActiveResponse.ok) {
      const errorText = await toggleActiveResponse.text();
      throw new Error(`Failed to toggle active: ${toggleActiveResponse.status} ${errorText}`);
    }

    const activeSponsor = await toggleActiveResponse.json();
    console.log('✅ Sponsor toggled to active:', activeSponsor.isActive);

    // Test 4: Clean up - delete test sponsor
    console.log('\n4️⃣ Cleaning up test sponsor...');
    const deleteResponse = await fetch(`${baseUrl}/api/sponsors/${createdSponsor.id}`, {
      method: 'DELETE'
    });

    if (deleteResponse.ok) {
      console.log('✅ Test sponsor deleted successfully');
    } else {
      console.log('⚠️ Failed to delete test sponsor');
    }

    console.log('\n🎉 Sponsor toggle API test completed successfully!');

  } catch (error) {
    console.error('❌ Sponsor toggle test failed:', error.message);
    console.log('\n💡 Make sure your backend server is running:');
    console.log('   cd bow-backend && npm start');
  }
}

// Run the test
testSponsorToggle();
