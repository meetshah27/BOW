const fetch = require('node-fetch');

async function testVolunteerAPI() {
  console.log('🔍 Testing Volunteer Opportunities API...\n');

  const baseUrl = 'http://localhost:3000/api';

  try {
    // Test 1: GET all opportunities
    console.log('1. Testing GET /volunteer-opportunities/opportunities');
    const getResponse = await fetch(`${baseUrl}/volunteer-opportunities/opportunities`);
    console.log(`   Status: ${getResponse.status}`);
    
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log(`   ✅ Success - Found ${data.opportunities ? data.opportunities.length : data.length} opportunities`);
    } else {
      console.log(`   ❌ Failed - ${getResponse.statusText}`);
    }

    // Test 2: POST create new opportunity
    console.log('\n2. Testing POST /volunteer-opportunities/opportunities');
    const testOpportunity = {
      title: 'Test Volunteer Opportunity',
      category: 'Events',
      location: 'Seattle',
      timeCommitment: '2 hours per week',
      description: 'This is a test volunteer opportunity',
      requirements: ['No experience needed'],
      benefits: ['Make a difference'],
      maxVolunteers: 5
    };

    const postResponse = await fetch(`${baseUrl}/volunteer-opportunities/opportunities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOpportunity)
    });

    console.log(`   Status: ${postResponse.status}`);
    
    if (postResponse.ok) {
      const data = await postResponse.json();
      console.log(`   ✅ Success - Created opportunity: ${data.opportunity?.title}`);
      console.log(`   ID: ${data.opportunity?.opportunityId}`);
    } else {
      const error = await postResponse.text();
      console.log(`   ❌ Failed - ${postResponse.statusText}`);
      console.log(`   Error details: ${error}`);
    }

  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testVolunteerAPI(); 