#!/usr/bin/env node

/**
 * Resend AWS SES Verification Email
 * 
 * This script resends the verification email for beatsofredmond@gmail.com
 */

require('dotenv').config();
const { SESClient, VerifyEmailIdentityCommand, DeleteIdentityCommand, ListIdentitiesCommand } = require('@aws-sdk/client-ses');

// AWS SES Configuration
const sesConfig = {
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
};

const sesClient = new SESClient(sesConfig);
const emailToVerify = 'beatsofredmond@gmail.com';

async function resendVerificationEmail() {
  console.log('📧 Resending AWS SES Verification Email');
  console.log('=====================================');
  console.log('');
  console.log(`📧 Email: ${emailToVerify}`);
  console.log('');

  try {
    // First, check if the identity exists
    console.log('🔍 Checking if email identity exists...');
    const listCommand = new ListIdentitiesCommand({});
    const listResult = await sesClient.send(listCommand);
    
    const emailExists = listResult.Identities && listResult.Identities.includes(emailToVerify);
    
    if (emailExists) {
      console.log('✅ Email identity found in SES');
      console.log('');
      console.log('🔄 Deleting existing identity to resend verification...');
      
      // Delete the existing identity
      const deleteCommand = new DeleteIdentityCommand({
        Identity: emailToVerify
      });
      await sesClient.send(deleteCommand);
      console.log('✅ Existing identity deleted');
      console.log('');
      
      // Wait a moment for AWS to process
      console.log('⏳ Waiting 2 seconds for AWS to process...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.log('ℹ️  Email identity not found (this is okay)');
      console.log('');
    }

    // Now create/verify the email identity
    console.log('📤 Sending verification email...');
    const verifyCommand = new VerifyEmailIdentityCommand({
      EmailAddress: emailToVerify
    });
    
    await sesClient.send(verifyCommand);
    
    console.log('');
    console.log('✅ Verification email sent successfully!');
    console.log('');
    console.log('📧 Next steps:');
    console.log('   1. Check the inbox for: ' + emailToVerify);
    console.log('   2. Look for an email from AWS SES (noreply-aws@amazon.com)');
    console.log('   3. Subject: "Amazon SES Email Address Verification Request"');
    console.log('   4. Click the verification link in the email');
    console.log('   5. You should see a confirmation page');
    console.log('');
    console.log('⚠️  Note:');
    console.log('   - The email might take a few minutes to arrive');
    console.log('   - Check your spam/junk folder if you don\'t see it');
    console.log('   - The verification link expires after 24 hours');
    console.log('');

  } catch (error) {
    console.error('❌ Error resending verification email:', error.message);
    console.error('');
    
    if (error.name === 'MessageRejected') {
      console.error('⚠️  This email might already be verified or in a pending state.');
      console.error('   Try deleting it manually in AWS Console first:');
      console.error('   1. Go to: https://console.aws.amazon.com/ses/');
      console.error('   2. Navigate to "Verified identities"');
      console.error('   3. Find and delete: ' + emailToVerify);
      console.error('   4. Then run this script again');
    } else {
      console.error('🔧 Troubleshooting:');
      console.error('   - Check your AWS credentials are configured correctly');
      console.error('   - Ensure your AWS user has SES permissions');
      console.error('   - Verify you\'re in the correct AWS region (us-west-2)');
    }
    console.error('');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  resendVerificationEmail()
    .then(() => {
      console.log('✅ Done!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { resendVerificationEmail };



