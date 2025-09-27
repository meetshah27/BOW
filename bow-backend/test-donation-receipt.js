#!/usr/bin/env node

/**
 * Test Donation Receipt Email
 * 
 * This script tests the donation receipt email functionality
 * without requiring an actual payment.
 */

require('dotenv').config();
const { EmailService } = require('./config/ses');

async function testDonationReceipt() {
  console.log('🧪 Testing Donation Receipt Email');
  console.log('=================================');
  
  try {
    // Test donation data
    const testDonationData = {
      donorName: 'John Doe',
      donorEmail: 'test@example.com', // Replace with your email for testing
      amount: 5000, // $50.00 in cents
      paymentIntentId: 'pi_test_1234567890abcdef',
      donationDate: new Date().toISOString()
    };
    
    console.log('📧 Sending test donation receipt...');
    console.log('   To:', testDonationData.donorEmail);
    console.log('   Amount: $' + (testDonationData.amount / 100).toFixed(2));
    console.log('   Type: One-time Donation');
    
    // Send the test email
    const result = await EmailService.sendDonationReceipt(testDonationData);
    
    if (result.success) {
      console.log('✅ Test donation receipt sent successfully!');
      console.log('   Message ID:', result.messageId);
      console.log('');
      console.log('📋 Check your email inbox for the receipt.');
      console.log('   If you don\'t see it, check your spam folder.');
    } else {
      console.log('❌ Failed to send test email');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   - Check your AWS credentials are configured');
    console.error('   - Ensure SES is set up in your AWS account');
    console.error('   - Verify the sender email is verified in SES');
    console.error('   - Check AWS CloudWatch logs for more details');
  }
}


// Run the tests
if (require.main === module) {
  console.log('🚀 Starting donation receipt email tests...');
  console.log('');
  
  testDonationReceipt()
    .then(() => {
      console.log('');
      console.log('🎉 All tests completed!');
      console.log('');
      console.log('📝 Next steps:');
      console.log('   1. Check your email for the test receipts');
      console.log('   2. Verify the email formatting and content');
      console.log('   3. Test with real donations on the website');
      console.log('   4. Monitor email delivery in AWS SES console');
    })
    .catch(error => {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = { testDonationReceipt };
