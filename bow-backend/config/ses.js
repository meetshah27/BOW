const { SESClient, SendEmailCommand, VerifyEmailIdentityCommand, ListVerifiedEmailAddressesCommand } = require('@aws-sdk/client-ses');

// SES Configuration
const sesConfig = {
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
};

// Log SES configuration (without sensitive data)
console.log('📧 SES Configuration:');
console.log('   Region:', sesConfig.region);
console.log('   Access Key ID set:', !!sesConfig.credentials.accessKeyId);
console.log('   Secret Access Key set:', !!sesConfig.credentials.secretAccessKey);

// Check if required environment variables are set
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error('❌ AWS credentials not found in environment variables!');
  console.error('   Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env file');
}

// Create SES client
const sesClient = new SESClient(sesConfig);

// SES Configuration
const SES_CONFIG = {
  FROM_EMAIL: process.env.SES_FROM_EMAIL || 'beatsofredmond@gmail.com',
  FROM_NAME: process.env.SES_FROM_NAME || 'Beats of Washington',
  REPLY_TO: process.env.SES_REPLY_TO || 'beatsofredmond@gmail.com',
  REGION: process.env.AWS_REGION || 'us-west-2'
};

// Email service functions
class EmailService {
  // Send a single email
  static async sendEmail({ to, subject, htmlContent, textContent }) {
    try {
      const params = {
        Source: `${SES_CONFIG.FROM_NAME} <${SES_CONFIG.FROM_EMAIL}>`,
        Destination: {
          ToAddresses: Array.isArray(to) ? to : [to]
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8'
          },
          Body: {
            Html: {
              Data: htmlContent,
              Charset: 'UTF-8'
            },
            Text: {
              Data: textContent || this.stripHtml(htmlContent),
              Charset: 'UTF-8'
            }
          }
        },
        ReplyToAddresses: [SES_CONFIG.REPLY_TO]
      };

      const command = new SendEmailCommand(params);
      const result = await sesClient.send(command);
      
      console.log('✅ Email sent successfully:', result.MessageId);
      return {
        success: true,
        messageId: result.MessageId
      };
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }
  }

  // Send newsletter to multiple subscribers
  static async sendNewsletter({ subscribers, subject, htmlContent, textContent }) {
    const results = [];
    const batchSize = 50; // SES rate limit consideration
    
    console.log(`📧 Sending newsletter to ${subscribers.length} subscribers...`);
    
    // Process subscribers in batches
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (subscriber) => {
        try {
          // Personalize content if needed
          const personalizedHtml = this.personalizeContent(htmlContent, subscriber);
          const personalizedText = textContent ? this.personalizeContent(textContent, subscriber) : null;
          
          const result = await this.sendEmail({
            to: subscriber.email,
            subject,
            htmlContent: personalizedHtml,
            textContent: personalizedText
          });
          
          return {
            email: subscriber.email,
            success: true,
            messageId: result.messageId
          };
        } catch (error) {
          console.error(`❌ Failed to send to ${subscriber.email}:`, error.message);
          return {
            email: subscriber.email,
            success: false,
            error: error.message
          };
        }
      });
      
      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults.map(result => result.value || result.reason));
      
      // Add delay between batches to respect rate limits
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`📊 Newsletter sending complete: ${successful} successful, ${failed} failed`);
    
    return {
      total: subscribers.length,
      successful,
      failed,
      results
    };
  }

  // Send welcome email to new subscriber
  static async sendWelcomeEmail(subscriber) {
    const subject = 'Welcome to Beats of Washington Newsletter!';
    const htmlContent = this.getWelcomeEmailTemplate(subscriber);
    
    return await this.sendEmail({
      to: subscriber.email,
      subject,
      htmlContent
    });
  }

  // Verify email address with SES
  static async verifyEmailAddress(email) {
    try {
      const command = new VerifyEmailIdentityCommand({ EmailAddress: email });
      await sesClient.send(command);
      console.log(`✅ Email verification initiated for: ${email}`);
      return { success: true, message: 'Verification email sent' };
    } catch (error) {
      console.error('❌ Error verifying email:', error);
      throw error;
    }
  }

  // Get list of verified email addresses
  static async getVerifiedEmails() {
    try {
      const command = new ListVerifiedEmailAddressesCommand({});
      const result = await sesClient.send(command);
      return result.VerifiedEmailAddresses;
    } catch (error) {
      console.error('❌ Error getting verified emails:', error);
      throw error;
    }
  }

  // Helper function to personalize content
  static personalizeContent(content, subscriber) {
    return content
      .replace(/{{firstName}}/g, subscriber.firstName || 'Friend')
      .replace(/{{lastName}}/g, subscriber.lastName || '')
      .replace(/{{email}}/g, subscriber.email)
      .replace(/{{fullName}}/g, `${subscriber.firstName || ''} ${subscriber.lastName || ''}`.trim() || 'Friend');
  }

  // Helper function to strip HTML tags for text version
  static stripHtml(html) {
    return html
      .replace(/<style[^>]*>.*<\/style>/gmi, '')
      .replace(/<script[^>]*>.*<\/script>/gmi, '')
      .replace(/<[^>]+>/gm, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Get welcome email template
  static getWelcomeEmailTemplate(subscriber) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Beats of Washington</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Beats of Washington!</h1>
            <p>Thank you for joining our community, ${subscriber.firstName || 'Friend'}!</p>
        </div>
        <div class="content">
            <h2>You're all set!</h2>
            <p>We're excited to have you as part of the Beats of Washington family. You'll now receive:</p>
            <ul>
                <li>📅 Updates about upcoming events and performances</li>
                <li>📖 Inspiring stories from our community</li>
                <li>🤝 Volunteer opportunities to get involved</li>
                <li>💝 Ways to support our mission</li>
            </ul>
            <p>Stay tuned for our latest news and don't forget to follow us on social media!</p>
            <a href="https://beatsofredmond.org" class="button">Visit Our Website</a>
        </div>
        <div class="footer">
            <p>Beats of Washington<br>
            9256 225th Way NE, WA 98053<br>
            <a href="mailto:beatsofredmond@gmail.com">beatsofredmond@gmail.com</a></p>
            <p><small>You can unsubscribe from these emails at any time by replying to this email.</small></p>
        </div>
    </div>
</body>
</html>`;
  }

  // Get default newsletter template
  static getNewsletterTemplate(content, title = 'Newsletter') {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Beats of Washington</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { background: white; padding: 30px; }
        .footer { background: #f4f4f4; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        .logo { max-width: 200px; height: auto; }
        h1, h2, h3 { color: #667eea; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Beats of Washington</h1>
            <p>${title}</p>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>Beats of Washington<br>
            9256 225th Way NE, WA 98053<br>
            Phone: 206 369-9576<br>
            <a href="mailto:beatsofredmond@gmail.com">beatsofredmond@gmail.com</a></p>
            
            <p>Follow us on:
            <a href="https://www.facebook.com/BeatsOfRedmond/">Facebook</a> | 
            <a href="https://www.instagram.com/beatsofwa/">Instagram</a> | 
            <a href="https://www.youtube.com/c/BeatsOfRedmond">YouTube</a></p>
            
            <p><small>You received this email because you subscribed to our newsletter.<br>
            You can unsubscribe by replying to this email with "UNSUBSCRIBE".</small></p>
        </div>
    </div>
</body>
</html>`;
  }
}

module.exports = {
  sesClient,
  EmailService,
  SES_CONFIG
};
