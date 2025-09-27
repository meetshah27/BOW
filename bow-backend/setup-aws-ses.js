#!/usr/bin/env node

/**
 * AWS SES Setup Helper Script
 * 
 * This script helps you set up AWS SES for sending emails from beatsofredmond@gmail.com
 */

require('dotenv').config();
const { SESClient, VerifyEmailIdentityCommand, ListVerifiedEmailAddressesCommand, GetSendQuotaCommand } = require('@aws-sdk/client-ses');

// AWS SES Configuration
const sesConfig = {
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
};

const sesClient = new SESClient(sesConfig);

async function setupAWSSES() {
  console.log('📧 AWS SES Setup Helper');
  console.log('======================');
  console.log('');
  
  try {
    // Check current SES status
    console.log('🔍 Checking current SES status...');
    
    // Get send quota
    const quotaCommand = new GetSendQuotaCommand({});
    const quotaResult = await sesClient.send(quotaCommand);
    
    console.log('📊 Current SES Limits:');
    console.log('   Max 24 Hour Send: ' + quotaResult.Max24HourSend);
    console.log('   Max Send Rate: ' + quotaResult.MaxSendRate + ' emails per second');
    console.log('   Sent Last 24 Hours: ' + quotaResult.SentLast24Hours);
    console.log('');
    
    // List verified email addresses
    const listCommand = new ListVerifiedEmailAddressesCommand({});
    const listResult = await sesClient.send(listCommand);
    
    console.log('📋 Currently Verified Email Addresses:');
    if (listResult.VerifiedEmailAddresses && listResult.VerifiedEmailAddresses.length > 0) {
      listResult.VerifiedEmailAddresses.forEach(email => {
        console.log('   ✅ ' + email);
      });
    } else {
      console.log('   ❌ No verified email addresses found');
    }
    console.log('');
    
    // Check if beatsofredmond@gmail.com is verified
    const isVerified = listResult.VerifiedEmailAddresses && 
                      listResult.VerifiedEmailAddresses.includes('beatsofredmond@gmail.com');
    
    if (isVerified) {
      console.log('✅ beatsofredmond@gmail.com is already verified!');
      console.log('');
      
      if (quotaResult.Max24HourSend > 200) {
        console.log('🎉 Your SES account is in production mode!');
        console.log('   You can send emails to any address.');
      } else {
        console.log('⚠️  Your SES account is still in sandbox mode.');
        console.log('   You can only send emails to verified addresses.');
        console.log('');
        console.log('📋 To move to production mode:');
        console.log('   1. Go to AWS SES Console');
        console.log('   2. Navigate to "Account dashboard"');
        console.log('   3. Click "Request production access"');
        console.log('   4. Fill out the form and submit');
        console.log('   5. Wait for AWS approval (usually 24-48 hours)');
      }
    } else {
      console.log('❌ beatsofredmond@gmail.com is NOT verified');
      console.log('');
      console.log('🔧 Let\'s verify it now...');
      
      try {
        const verifyCommand = new VerifyEmailIdentityCommand({
          EmailAddress: 'beatsofredmond@gmail.com'
        });
        
        await sesClient.send(verifyCommand);
        console.log('✅ Verification email sent to beatsofredmond@gmail.com!');
        console.log('');
        console.log('📧 Next steps:');
        console.log('   1. Check the email inbox for beatsofredmond@gmail.com');
        console.log('   2. Look for an email from AWS SES');
        console.log('   3. Click the verification link in the email');
        console.log('   4. Run this script again to confirm verification');
        console.log('');
        console.log('⚠️  Note: The verification email might take a few minutes to arrive');
        
      } catch (error) {
        console.error('❌ Failed to send verification email:', error.message);
        console.error('');
        console.error('🔧 Manual verification steps:');
        console.error('   1. Go to AWS SES Console: https://console.aws.amazon.com/ses/');
        console.error('   2. Navigate to "Verified identities"');
        console.error('   3. Click "Create identity"');
        console.error('   4. Select "Email address"');
        console.error('   5. Enter: beatsofredmond@gmail.com');
        console.error('   6. Click "Create identity"');
        console.error('   7. Check email and click verification link');
      }
    }
    
    console.log('');
    console.log('🧪 Testing email with verified address...');
    
    // Try to send a test email to a verified address
    if (listResult.VerifiedEmailAddresses && listResult.VerifiedEmailAddresses.length > 0) {
      const testEmail = listResult.VerifiedEmailAddresses[0];
      console.log('📤 Sending test email to verified address: ' + testEmail);
      
      try {
        const { EmailService } = require('./config/ses');
        
        const result = await EmailService.sendEmail({
          to: testEmail,
          subject: 'BOW SES Test - Email Working!',
          htmlContent: `
            <h2>🎵 BOW SES Test 🎵</h2>
            <p>Congratulations! Your email system is working correctly.</p>
            <p>Emails are being sent from: <strong>beatsofredmond@gmail.com</strong></p>
            <hr>
            <p><strong>Beats of Washington</strong><br>
            beatsofredmond@gmail.com</p>
          `,
          textContent: `
            BOW SES Test
            
            Congratulations! Your email system is working correctly.
            Emails are being sent from: beatsofredmond@gmail.com
            
            Beats of Washington
            beatsofredmond@gmail.com
          `
        });
        
        if (result.success) {
          console.log('✅ Test email sent successfully!');
          console.log('   Message ID: ' + result.messageId);
          console.log('');
          console.log('🎉 Email system is fully functional!');
          console.log('   Users will receive donation receipts from beatsofredmond@gmail.com');
        }
        
      } catch (emailError) {
        console.error('❌ Test email failed:', emailError.message);
      }
    } else {
      console.log('⚠️  No verified email addresses to test with');
      console.log('   Verify beatsofredmond@gmail.com first, then run this script again');
    }
    
  } catch (error) {
    console.error('❌ SES setup check failed:', error.message);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   - Check your AWS credentials are configured correctly');
    console.error('   - Ensure your AWS user has SES permissions');
    console.error('   - Verify you\'re in the correct AWS region (us-west-2)');
    console.error('   - Check AWS CloudWatch logs for more details');
  }
}

// Show SES setup guide
function showSESGuide() {
  console.log('');
  console.log('📋 AWS SES Setup Guide');
  console.log('======================');
  console.log('');
  console.log('1. 📧 Verify Email Address:');
  console.log('   - Go to: https://console.aws.amazon.com/ses/');
  console.log('   - Navigate to "Verified identities"');
  console.log('   - Add beatsofredmond@gmail.com');
  console.log('   - Check email and click verification link');
  console.log('');
  console.log('2. 🏠 Verify Domain (Optional but Recommended):');
  console.log('   - Add DNS records to verify beatsofredmond.org');
  console.log('   - This allows sending from any email at your domain');
  console.log('');
  console.log('3. 📤 Request Production Access:');
  console.log('   - Go to "Account dashboard" in SES Console');
  console.log('   - Click "Request production access"');
  console.log('   - Fill out the form explaining your use case');
  console.log('   - Wait for AWS approval (24-48 hours)');
  console.log('');
  console.log('4. 🔒 IAM Permissions Required:');
  console.log('   - ses:SendEmail');
  console.log('   - ses:SendRawEmail');
  console.log('   - ses:VerifyEmailIdentity');
  console.log('   - ses:ListVerifiedEmailAddresses');
  console.log('');
}

// Run the setup
if (require.main === module) {
  setupAWSSES()
    .then(() => {
      showSESGuide();
    })
    .catch(error => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupAWSSES };