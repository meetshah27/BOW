#!/usr/bin/env node

/**
 * BOW Email Setup Verification Script
 * 
 * This script verifies that the email configuration is properly set up
 * to send emails from beatsofredmond@gmail.com
 */

require('dotenv').config();
const { EmailService, SES_CONFIG } = require('./config/ses');

async function verifyEmailSetup() {
  console.log('📧 BOW Email Setup Verification');
  console.log('================================');
  console.log('');
  
  // Display current configuration
  console.log('📋 Current Email Configuration:');
  console.log('   From Email:', SES_CONFIG.FROM_EMAIL);
  console.log('   From Name:', SES_CONFIG.FROM_NAME);
  console.log('   Reply To:', SES_CONFIG.REPLY_TO);
  console.log('   AWS Region:', SES_CONFIG.REGION);
  console.log('');
  
  // Verify configuration
  if (SES_CONFIG.FROM_EMAIL === 'beatsofredmond@gmail.com') {
    console.log('✅ Email configuration is correct!');
    console.log('   Users will receive emails from: beatsofredmond@gmail.com');
  } else {
    console.log('❌ Email configuration issue detected!');
    console.log('   Expected: beatsofredmond@gmail.com');
    console.log('   Found:', SES_CONFIG.FROM_EMAIL);
    console.log('');
    console.log('🔧 To fix this:');
    console.log('   1. Set SES_FROM_EMAIL=beatsofredmond@gmail.com in your .env file');
    console.log('   2. Restart your application');
    return;
  }
  
  console.log('');
  console.log('🧪 Testing email sending capability...');
  
  try {
    // Test email data
    const testEmailData = {
      to: 'test@example.com', // Replace with your email for testing
      subject: 'BOW Email Setup Test',
      htmlContent: `
        <h2>🎵 BOW Email Test 🎵</h2>
        <p>This is a test email to verify that BOW can send emails from <strong>beatsofredmond@gmail.com</strong></p>
        <p>If you receive this email, the configuration is working correctly!</p>
        <hr>
        <p><strong>Beats of Washington</strong><br>
        beatsofredmond@gmail.com</p>
      `,
      textContent: `
        BOW Email Test
        
        This is a test email to verify that BOW can send emails from beatsofredmond@gmail.com
        
        If you receive this email, the configuration is working correctly!
        
        Beats of Washington
        beatsofredmond@gmail.com
      `
    };
    
    console.log('📤 Sending test email...');
    const result = await EmailService.sendEmail(testEmailData);
    
    if (result.success) {
      console.log('✅ Test email sent successfully!');
      console.log('   Message ID:', result.messageId);
      console.log('');
      console.log('📋 Email Details:');
      console.log('   From: Beats of Washington <beatsofredmond@gmail.com>');
      console.log('   To: ' + testEmailData.to);
      console.log('   Subject: ' + testEmailData.subject);
      console.log('');
      console.log('🎉 Email setup is working correctly!');
      console.log('   Users will receive donation receipts from beatsofredmond@gmail.com');
    } else {
      console.log('❌ Failed to send test email');
    }
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   - Check your AWS credentials are configured');
    console.error('   - Ensure beatsofredmond@gmail.com is verified in AWS SES');
    console.error('   - Verify SES is set up in your AWS account');
    console.error('   - Check AWS CloudWatch logs for more details');
  }
}

// Show email verification requirements
function showVerificationRequirements() {
  console.log('');
  console.log('📋 AWS SES Email Verification Requirements:');
  console.log('============================================');
  console.log('');
  console.log('To send emails from beatsofredmond@gmail.com, you need to:');
  console.log('');
  console.log('1. 📧 Verify the email address in AWS SES:');
  console.log('   - Go to AWS SES Console');
  console.log('   - Navigate to "Verified identities"');
  console.log('   - Add beatsofredmond@gmail.com');
  console.log('   - Check the email and click the verification link');
  console.log('');
  console.log('2. 🏠 Verify your domain (optional but recommended):');
  console.log('   - Add DNS records to verify beatsofredmond.org domain');
  console.log('   - This allows sending from any email at your domain');
  console.log('');
  console.log('3. 📤 Move out of SES Sandbox (for production):');
  console.log('   - Request production access in AWS SES');
  console.log('   - This allows sending to any email address');
  console.log('');
  console.log('4. 🔒 Set up proper AWS IAM permissions:');
  console.log('   - Ensure your AWS user/role has SES send permissions');
  console.log('');
}

// Run the verification
if (require.main === module) {
  verifyEmailSetup()
    .then(() => {
      showVerificationRequirements();
    })
    .catch(error => {
      console.error('❌ Verification failed:', error);
      process.exit(1);
    });
}

module.exports = { verifyEmailSetup };
