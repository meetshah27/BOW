require('dotenv').config();
const { EmailService } = require('../config/ses');
const { GetSendQuotaCommand, ListIdentitiesCommand, GetIdentityVerificationAttributesCommand } = require('@aws-sdk/client-ses');
const { sesClient } = require('../config/ses');

async function checkSESStatus() {
  console.log('🔍 Checking AWS SES Status...');
  
  try {
    // Check Quota (to see if in sandbox)
    const quota = await sesClient.send(new GetSendQuotaCommand({}));
    const isSandbox = quota.Max24HourSend === 200;
    
    console.log('\n📈 SES Quota Info:');
    console.log(`   - Max Send (24h): ${quota.Max24HourSend}`);
    console.log(`   - Sent (last 24h): ${quota.SentLast24Hours}`);
    console.log(`   - Sending Rate: ${quota.MaxSendRate} emails/second`);
    console.log(`   - Status: ${isSandbox ? '📦 SANDBOX MODE' : '🚀 PRODUCTION MODE'}`);

    // Check Verified Identities
    const identities = await sesClient.send(new ListIdentitiesCommand({}));
    console.log('\n🆔 Verified Identities:');
    
    if (identities.Identities.length === 0) {
      console.log('   - No verified identities found.');
    } else {
      const attributes = await sesClient.send(new GetIdentityVerificationAttributesCommand({
        Identities: identities.Identities
      }));
      
      for (const identity of identities.Identities) {
        const status = attributes.VerificationAttributes[identity]?.VerificationStatus;
        console.log(`   - ${identity}: [${status}]`);
      }
    }
    
    if (isSandbox) {
      console.log('\n⚠️  ACTION REQUIRED: You are in SANDBOX MODE.');
      console.log('   In sandbox mode, you can ONLY send emails to verified addresses.');
      console.log('   To send to customers, you must request "Production Access" in the AWS SES Console.');
    } else {
      console.log('\n✅ You are in PRODUCTION MODE. You can send emails to any customer.');
    }

  } catch (error) {
    console.error('❌ Error checking SES status:', error.message);
  }
}

checkSESStatus();
