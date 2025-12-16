require('dotenv').config();
const { SESClient, ListVerifiedEmailAddressesCommand, GetSendQuotaCommand, GetAccountSendingEnabledCommand } = require('@aws-sdk/client-ses');

// Check if running in Lambda
const isLambda = !!process.env.LAMBDA_TASK_ROOT || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

const sesConfig = {
  region: process.env.AWS_REGION || 'us-west-2',
  ...(!isLambda && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  } : {}),
};

const sesClient = new SESClient(sesConfig);

async function checkSESStatus() {
  console.log('📧 AWS SES Status Check');
  console.log('======================\n');
  
  try {
    // Check if account sending is enabled
    console.log('🔍 Checking account sending status...');
    try {
      const accountStatusCommand = new GetAccountSendingEnabledCommand({});
      const accountStatus = await sesClient.send(accountStatusCommand);
      console.log(`   Account Sending Enabled: ${accountStatus.Enabled ? '✅ YES' : '❌ NO'}\n`);
    } catch (error) {
      console.log('   ⚠️  Could not check account status (may require IAM permissions)\n');
    }
    
    // Get send quota
    console.log('📊 Checking send quota...');
    try {
      const quotaCommand = new GetSendQuotaCommand({});
      const quotaResult = await sesClient.send(quotaCommand);
      console.log(`   Max 24 Hour Send: ${quotaResult.Max24HourSend}`);
      console.log(`   Max Send Rate: ${quotaResult.MaxSendRate} emails/second`);
      console.log(`   Sent Last 24 Hours: ${quotaResult.SentLast24Hours}`);
      
      if (quotaResult.Max24HourSend === 200 && quotaResult.MaxSendRate === 1) {
        console.log('   ⚠️  You are in SES Sandbox mode (limited to verified emails only)');
        console.log('   💡 Request production access to send to any email address\n');
      } else {
        console.log('   ✅ You are in Production mode (can send to any email)\n');
      }
    } catch (error) {
      console.log(`   ❌ Error checking quota: ${error.message}\n`);
    }
    
    // List verified email addresses
    console.log('📋 Checking verified email addresses...');
    try {
      const listCommand = new ListVerifiedEmailAddressesCommand({});
      const listResult = await sesClient.send(listCommand);
      
      if (listResult.VerifiedEmailAddresses && listResult.VerifiedEmailAddresses.length > 0) {
        console.log(`   ✅ Found ${listResult.VerifiedEmailAddresses.length} verified email(s):`);
        listResult.VerifiedEmailAddresses.forEach(email => {
          console.log(`      - ${email}`);
        });
        
        // Check if beatsofredmond@gmail.com is verified
        const fromEmail = process.env.SES_FROM_EMAIL || 'beatsofredmond@gmail.com';
        const isVerified = listResult.VerifiedEmailAddresses.includes(fromEmail);
        
        console.log('');
        if (isVerified) {
          console.log(`   ✅ ${fromEmail} is VERIFIED - Emails will work!`);
        } else {
          console.log(`   ❌ ${fromEmail} is NOT VERIFIED`);
          console.log(`   🔧 You need to verify this email in AWS SES Console`);
        }
      } else {
        console.log('   ❌ No verified email addresses found');
        console.log('   🔧 You need to verify at least one email address in AWS SES');
      }
    } catch (error) {
      console.log(`   ❌ Error checking verified emails: ${error.message}`);
      console.log('   This might be a permissions issue');
    }
    
    console.log('\n📋 Current Configuration:');
    console.log(`   From Email: ${process.env.SES_FROM_EMAIL || 'beatsofredmond@gmail.com'}`);
    console.log(`   From Name: ${process.env.SES_FROM_NAME || 'Beats of Washington'}`);
    console.log(`   Region: ${process.env.AWS_REGION || 'us-west-2'}`);
    
    console.log('\n💡 Next Steps:');
    console.log('   1. If email is not verified, go to AWS SES Console → Verified identities');
    console.log('   2. Add and verify: beatsofredmond@gmail.com');
    console.log('   3. If in Sandbox mode, request production access for full functionality');
    
  } catch (error) {
    console.error('\n❌ Error checking SES status:', error.message);
    console.error('\nPossible issues:');
    console.error('   - AWS credentials not configured');
    console.error('   - IAM permissions missing');
    console.error('   - Wrong AWS region');
  }
}

checkSESStatus();

