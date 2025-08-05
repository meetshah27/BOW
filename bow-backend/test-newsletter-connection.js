require('dotenv').config();
const Newsletter = require('./models-dynamodb/Newsletter');

async function testNewsletterConnection() {
  try {
    console.log('🔍 Testing Newsletter System Connection...');
    
    // Test 1: Check if we can connect to DynamoDB
    console.log('\n📋 Test 1: DynamoDB Connection');
    console.log('   AWS Region:', process.env.AWS_REGION || 'us-west-2');
    console.log('   AWS Access Key ID set:', !!process.env.AWS_ACCESS_KEY_ID);
    console.log('   AWS Secret Access Key set:', !!process.env.AWS_SECRET_ACCESS_KEY);

    // Test 2: Try to find a non-existent subscriber (should not throw error)
    console.log('\n📋 Test 2: Newsletter Model Operations');
    try {
      const testEmail = 'test@example.com';
      const subscriber = await Newsletter.findByEmail(testEmail);
      console.log('   ✅ Newsletter.findByEmail() - Working');
      console.log('   📧 Test email lookup result:', subscriber ? 'Found' : 'Not found (expected)');
    } catch (error) {
      console.log('   ❌ Newsletter.findByEmail() - Failed:', error.message);
      return false;
    }

    // Test 3: Try to create a test subscriber
    console.log('\n📋 Test 3: Newsletter Subscription');
    try {
      const testSubscriber = {
        email: `test-${Date.now()}@example.com`,
        firstName: 'Test',
        lastName: 'User'
      };
      
      const created = await Newsletter.create(testSubscriber);
      console.log('   ✅ Newsletter.create() - Working');
      console.log('   📧 Created test subscriber:', created.email);
      
      // Clean up - delete the test subscriber
      await Newsletter.deleteSubscriber(created.email);
      console.log('   🧹 Cleaned up test subscriber');
      
    } catch (error) {
      console.log('   ❌ Newsletter.create() - Failed:', error.message);
      
      if (error.message.includes('Table') || error.message.includes('table')) {
        console.log('   💡 This suggests the NewsletterSubscribers table may not exist');
        console.log('   🔧 Run: node create-newsletter-table.js');
      }
      return false;
    }

    console.log('\n✅ All newsletter tests passed!');
    console.log('🎉 Newsletter system is ready to use');
    return true;
    
  } catch (error) {
    console.error('❌ Newsletter connection test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Check if .env file has correct AWS credentials');
    console.log('   2. Ensure NewsletterSubscribers table exists');
    console.log('   3. Verify AWS region is set to us-west-2');
    console.log('   4. Check AWS credentials have DynamoDB permissions');
    return false;
  }
}

// Run the test
if (require.main === module) {
  testNewsletterConnection()
    .then((success) => {
      if (success) {
        console.log('\n🎉 Newsletter system is working correctly!');
      } else {
        console.log('\n💥 Newsletter system needs attention');
      }
      process.exit(success ? 0 : 1);
    });
}

module.exports = { testNewsletterConnection }; 