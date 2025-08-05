// Using built-in fetch (available in Node.js 18+)
// If you get an error, install node-fetch: npm install node-fetch

async function testVolunteerAPI() {
  try {
    console.log('🧪 Testing Volunteer API...');
    
    // Test the health endpoint first
    const healthResponse = await fetch('http://localhost:3000/health');
    if (healthResponse.ok) {
      console.log('✅ Backend server is running');
    } else {
      console.log('❌ Backend server is not responding');
      return;
    }
    
    // Test the volunteer apply endpoint
    const testData = {
      opportunityId: 'test-opp-123',
      opportunityTitle: 'Test Opportunity',
      opportunityCategory: 'Test',
      applicantName: 'Test User',
      applicantEmail: 'test@example.com',
      applicantPhone: '555-1234',
      applicantAge: '25',
      applicantAddress: {
        street: '123 Test St',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101'
      },
      availability: {
        weekdays: true,
        weekends: false,
        evenings: true,
        flexible: true
      },
      experience: 'Some experience',
      skills: ['Skill 1', 'Skill 2'],
      motivation: 'Want to help',
      timeCommitment: '2-4 hours/week',
      references: [
        {
          name: 'John Doe',
          relationship: 'Friend',
          phone: '555-5678',
          email: 'john@example.com'
        }
      ],
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '555-9999'
      },
      backgroundCheckConsent: true
    };
    
    const response = await fetch('http://localhost:3000/api/volunteers/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Volunteer API is working');
      console.log('📝 Response:', data);
    } else {
      console.log('❌ Volunteer API error:', data);
    }
    
  } catch (error) {
    console.error('💥 Error testing volunteer API:', error.message);
    console.log('🔧 Make sure the backend server is running on port 3000');
  }
}

testVolunteerAPI(); 