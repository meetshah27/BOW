#!/usr/bin/env node

/**
 * AWS SES Setup Script for BOW Newsletter System
 * 
 * This script helps set up AWS SES for sending newsletters
 */

require('dotenv').config();
const { EmailService } = require('./config/ses');

async function setupSES() {
  console.log('🚀 Setting up AWS SES for BOW Newsletter System...\n');

  // Check environment variables
  console.log('📋 Checking Environment Configuration:');
  console.log('   AWS_REGION:', process.env.AWS_REGION || 'us-west-2');
  console.log('   AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing');
  console.log('   AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing');
  console.log('   SES_FROM_EMAIL:', process.env.SES_FROM_EMAIL || 'beatsofredmond@gmail.com');
  console.log('   SES_FROM_NAME:', process.env.SES_FROM_NAME || 'Beats of Washington');
  console.log('');

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('❌ Missing AWS credentials!');
    console.error('   Please add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to your .env file');
    process.exit(1);
  }

  try {
    // Check current verified emails
    console.log('📧 Checking verified email addresses...');
    const verifiedEmails = await EmailService.getVerifiedEmails();
    
    if (verifiedEmails.length > 0) {
      console.log('✅ Found verified email addresses:');
      verifiedEmails.forEach(email => console.log(`   - ${email}`));
    } else {
      console.log('⚠️  No verified email addresses found');
    }
    console.log('');

    // Check if the FROM email is verified
    const fromEmail = process.env.SES_FROM_EMAIL || 'beatsofredmond@gmail.com';
    const isFromEmailVerified = verifiedEmails.includes(fromEmail);
    
    if (!isFromEmailVerified) {
      console.log(`⚠️  Your FROM email (${fromEmail}) is not verified with SES`);
      console.log('   This email address needs to be verified before you can send newsletters');
      console.log('');
      
      // Offer to verify the email
      console.log('🔧 Would you like to verify this email address now?');
      console.log('   Run: node setup-aws-ses.js --verify-email');
      console.log('');
    } else {
      console.log(`✅ Your FROM email (${fromEmail}) is verified and ready to use!`);
      console.log('');
    }

    // Display next steps
    console.log('📋 Next Steps:');
    console.log('');
    
    if (!isFromEmailVerified) {
      console.log('1. 🔐 Verify your sender email address:');
      console.log('   node setup-aws-ses.js --verify-email');
      console.log('');
    }
    
    console.log('2. 🧪 Test email sending:');
    console.log('   node setup-aws-ses.js --test-email your-email@example.com');
    console.log('');
    
    console.log('3. 📊 Check SES sending limits:');
    console.log('   - New SES accounts start in sandbox mode (can only send to verified emails)');
    console.log('   - Request production access in AWS Console to send to any email');
    console.log('   - Default limit: 200 emails/day, 1 email/second');
    console.log('');
    
    console.log('4. 🚀 Start your server and test newsletter functionality:');
    console.log('   npm start');
    console.log('');

  } catch (error) {
    console.error('❌ Error setting up SES:', error.message);
    
    if (error.name === 'UnauthorizedOperation') {
      console.error('   Make sure your AWS credentials have SES permissions');
    } else if (error.name === 'InvalidClientTokenId') {
      console.error('   Check your AWS_ACCESS_KEY_ID');
    } else if (error.name === 'SignatureDoesNotMatch') {
      console.error('   Check your AWS_SECRET_ACCESS_KEY');
    }
    
    process.exit(1);
  }
}

async function verifyEmail() {
  const emailToVerify = process.env.SES_FROM_EMAIL || 'beatsofredmond@gmail.com';
  
  console.log(`📧 Sending verification email to: ${emailToVerify}`);
  
  try {
    await EmailService.verifyEmailAddress(emailToVerify);
    console.log('✅ Verification email sent!');
    console.log('   Check your inbox and click the verification link');
    console.log('   Note: It may take a few minutes to appear');
  } catch (error) {
    console.error('❌ Failed to send verification email:', error.message);
  }
}

async function testEmail(testEmailAddress) {
  if (!testEmailAddress) {
    console.error('❌ Please provide a test email address');
    console.error('   Usage: node setup-aws-ses.js --test-email your-email@example.com');
    process.exit(1);
  }

  console.log(`🧪 Sending test email to: ${testEmailAddress}`);
  
  try {
    await EmailService.sendEmail({
      to: testEmailAddress,
      subject: 'BOW Newsletter System - Test Email',
      htmlContent: `
        <h1>Test Email Successful!</h1>
        <p>Your BOW Newsletter System is working correctly.</p>
        <p>AWS SES is configured and ready to send newsletters.</p>
        <hr>
        <p><small>This is a test email from your Beats of Washington newsletter system.</small></p>
      `
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('   Check the recipient\'s inbox');
  } catch (error) {
    console.error('❌ Failed to send test email:', error.message);
    
    if (error.message.includes('Email address not verified')) {
      console.error('   Your sender email needs to be verified first');
      console.error('   Run: node setup-aws-ses.js --verify-email');
    }
  }
}

// Command line argument handling
const args = process.argv.slice(2);

if (args.includes('--verify-email')) {
  verifyEmail();
} else if (args.includes('--test-email')) {
  const emailIndex = args.indexOf('--test-email');
  const testEmailAddress = args[emailIndex + 1];
  testEmail(testEmailAddress);
} else {
  setupSES();
}
