#!/usr/bin/env node

/**
 * Test Email with Real Address
 * 
 * This script tests the donation receipt email with a real email address
 * that you can verify in AWS SES.
 */

require('dotenv').config();
const { EmailService } = require('./config/ses');

async function testWithRealEmail() {
  console.log('📧 Test Email with Real Address');
  console.log('===============================');
  console.log('');
  
  // You can change this to your own email address for testing
  const testEmailAddress = 'beatsofredmond@gmail.com'; // Change this to your email
  
  console.log('📋 Testing with email address: ' + testEmailAddress);
  console.log('');
  console.log('⚠️  IMPORTANT: Make sure this email address is verified in AWS SES first!');
  console.log('');
  
  try {
    // Test donation data
    const testDonationData = {
      donorName: 'Test User',
      donorEmail: testEmailAddress,
      amount: 5000, // $50.00 in cents
      paymentIntentId: 'pi_test_1234567890abcdef',
      donationDate: new Date().toISOString()
    };
    
    console.log('📧 Sending test donation receipt...');
    console.log('   To:', testDonationData.donorEmail);
    console.log('   Amount: $' + (testDonationData.amount / 100).toFixed(2));
    console.log('   Type: One-time Donation');
    console.log('   From: beatsofredmond@gmail.com');
    console.log('');
    
    // Send the test email
    const result = await EmailService.sendDonationReceipt(testDonationData);
    
    if (result.success) {
      console.log('✅ Test donation receipt sent successfully!');
      console.log('   Message ID:', result.messageId);
      console.log('');
      console.log('📋 Check your email inbox for the receipt.');
      console.log('   If you don\'t see it, check your spam folder.');
      console.log('');
      console.log('🎉 Email system is working perfectly!');
      console.log('   Users will receive beautiful donation receipts from beatsofredmond@gmail.com');
    } else {
      console.log('❌ Failed to send test email');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('');
    
    if (error.message.includes('not verified')) {
      console.error('🔧 This email address needs to be verified in AWS SES:');
      console.error('   1. Go to AWS SES Console');
      console.error('   2. Navigate to "Verified identities"');
      console.error('   3. Add this email address: ' + testEmailAddress);
      console.error('   4. Check email and click verification link');
      console.error('   5. Run this test again');
    } else {
      console.error('🔧 Other troubleshooting:');
      console.error('   - Check your AWS credentials');
      console.error('   - Ensure SES is properly configured');
      console.error('   - Check AWS CloudWatch logs');
    }
  }
}

// Instructions
function showInstructions() {
  console.log('');
  console.log('📋 How to Use This Test:');
  console.log('========================');
  console.log('');
  console.log('1. 📧 First, verify an email address in AWS SES:');
  console.log('   - Go to: https://console.aws.amazon.com/ses/');
  console.log('   - Navigate to "Verified identities"');
  console.log('   - Add your email address');
  console.log('   - Check email and click verification link');
  console.log('');
  console.log('2. ✏️  Edit this script:');
  console.log('   - Change the testEmailAddress variable above');
  console.log('   - Set it to your verified email address');
  console.log('');
  console.log('3. 🧪 Run the test:');
  console.log('   - node test-email-with-real-address.js');
  console.log('   - Check your email for the donation receipt');
  console.log('');
  console.log('4. 🎉 Once working, your donation system will send real receipts!');
  console.log('');
}

// Run the test
if (require.main === module) {
  testWithRealEmail()
    .then(() => {
      showInstructions();
    })
    .catch(error => {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = { testWithRealEmail };
