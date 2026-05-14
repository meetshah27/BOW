require('dotenv').config();
const { EmailService } = require('../config/ses');

async function sendTestEmail() {
  console.log('📤 Attempting to send test email to beatsofredmond@gmail.com...');
  
  try {
    const result = await EmailService.sendEmail({
      to: 'beatsofredmond@gmail.com',
      subject: '🔥 BOW Email System Test',
      htmlContent: '<h1>It Works!</h1><p>This is a test email from your Beats of Washington platform. If you see this, your backend is correctly connected to AWS SES.</p>'
    });
    
    if (result.success) {
      console.log('✅ Success! Test email sent.');
      console.log('   Message ID:', result.messageId);
    } else {
      console.log('❌ Failed to send email.');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

sendTestEmail();
