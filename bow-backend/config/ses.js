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

  // Send donation receipt email
  static async sendDonationReceipt(donationData) {
    const subject = `Thank you for your donation to Beats of Washington!`;
    const htmlContent = this.getDonationReceiptTemplate(donationData);
    const textContent = this.getDonationReceiptTextTemplate(donationData);
    
    return await this.sendEmail({
      to: donationData.donorEmail,
      subject,
      htmlContent,
      textContent
    });
  }

  // Send event registration confirmation email
  static async sendEventRegistrationConfirmation(registrationData) {
    const subject = `Event Registration Confirmed - Beats of Washington`;
    const htmlContent = this.getEventRegistrationTemplate(registrationData);
    const textContent = this.getEventRegistrationTextTemplate(registrationData);
    
    return await this.sendEmail({
      to: registrationData.userEmail,
      subject,
      htmlContent,
      textContent
    });
  }

  // Get donation receipt email template
  static getDonationReceiptTemplate(donationData) {
    const { donorName, amount, paymentIntentId, donationDate } = donationData;
    const formattedAmount = `$${(amount / 100).toFixed(2)}`;
    const receiptNumber = paymentIntentId ? paymentIntentId.slice(-8).toUpperCase() : 'N/A';
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Donation Receipt - Beats of Washington</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .receipt-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .receipt-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 5px 0; border-bottom: 1px solid #e9ecef; }
        .receipt-row:last-child { border-bottom: none; font-weight: bold; font-size: 18px; color: #ff6b35; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        .button { display: inline-block; background: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .tax-info { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2196f3; }
        .thank-you { text-align: center; margin: 30px 0; }
        .impact-stats { display: flex; justify-content: space-around; margin: 30px 0; text-align: center; }
        .impact-stat { flex: 1; padding: 15px; }
        .impact-number { font-size: 24px; font-weight: bold; color: #ff6b35; }
        .impact-label { font-size: 14px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎵 Thank You for Your Support! 🎵</h1>
            <p>Your donation helps us create amazing community experiences through music</p>
        </div>
        
        <div class="content">
            <div class="thank-you">
                <h2>Dear ${donorName},</h2>
                <p>Thank you so much for your generous donation to Beats of Washington! Your support makes a real difference in our community.</p>
            </div>

            <div class="receipt-details">
                <h3 style="color: #ff6b35; margin-top: 0;">📄 Donation Receipt</h3>
                <div class="receipt-row">
                    <span>Donation Amount:</span>
                    <span><strong>${formattedAmount}</strong></span>
                </div>
                <div class="receipt-row">
                    <span>Type:</span>
                    <span>One-time Donation</span>
                </div>
                <div class="receipt-row">
                    <span>Donation Date:</span>
                    <span>${new Date(donationDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</span>
                </div>
                <div class="receipt-row">
                    <span>Receipt Number:</span>
                    <span>BOW-${receiptNumber}</span>
                </div>
                <div class="receipt-row">
                    <span>Total Amount:</span>
                    <span>${formattedAmount}</span>
                </div>
            </div>

            <div class="impact-stats">
                <div class="impact-stat">
                    <div class="impact-number">500+</div>
                    <div class="impact-label">Community Members</div>
                </div>
                <div class="impact-stat">
                    <div class="impact-number">50+</div>
                    <div class="impact-label">Events Annually</div>
                </div>
                <div class="impact-stat">
                    <div class="impact-number">10+</div>
                    <div class="impact-label">Years of Service</div>
                </div>
            </div>

            <div class="tax-info">
                <h4 style="margin-top: 0; color: #1976d2;">📋 Tax Deductible Information</h4>
                <p><strong>Beats of Washington</strong> is a 501(c)(3) nonprofit organization. Your donation is tax-deductible to the full extent allowed by law.</p>
                <p><strong>Tax ID (EIN):</strong> 85-3674038</p>
                <p><strong>Organization:</strong> Beats of Washington<br>
                <strong>Address:</strong> 9256 225th Way NE, Redmond, WA 98053</p>
                <p><em>Please save this receipt for your tax records. No goods or services were provided in exchange for this donation.</em></p>
            </div>

            <div style="text-align: center;">
                <h3>How Your Donation Helps</h3>
                <p>Your generous support enables us to:</p>
                <ul style="text-align: left; max-width: 400px; margin: 0 auto;">
                    <li>🎵 Provide free music education programs</li>
                    <li>🎪 Host inclusive community events</li>
                    <li>🤝 Support cultural exchange and diversity</li>
                    <li>🌟 Create meaningful connections through music</li>
                </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="https://beatsofredmond.org" class="button">Visit Our Website</a>
                <a href="https://beatsofredmond.org/events" class="button" style="background: #667eea; margin-left: 10px;">View Upcoming Events</a>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Beats of Washington</strong><br>
            9256 225th Way NE, Redmond, WA 98053<br>
            Phone: 206 369-9576<br>
            Email: <a href="mailto:beatsofredmond@gmail.com">beatsofredmond@gmail.com</a></p>
            
            <p>Follow us on: 
            <a href="https://www.facebook.com/BeatsOfRedmond/">Facebook</a> | 
            <a href="https://www.instagram.com/beatsofwa/">Instagram</a> | 
            <a href="https://www.youtube.com/c/BeatsOfRedmond">YouTube</a></p>
            
            <p><small>This is an automated receipt. Please keep this email for your tax records.<br>
            If you have any questions about your donation, please contact us at beatsofredmond@gmail.com</small></p>
        </div>
    </div>
</body>
</html>`;
  }

  // Get donation receipt text template (for email clients that don't support HTML)
  static getDonationReceiptTextTemplate(donationData) {
    const { donorName, amount, paymentIntentId, donationDate } = donationData;
    const formattedAmount = `$${(amount / 100).toFixed(2)}`;
    const receiptNumber = paymentIntentId ? paymentIntentId.slice(-8).toUpperCase() : 'N/A';
    
    return `
Thank You for Your Donation to Beats of Washington!

Dear ${donorName},

Thank you so much for your generous donation to Beats of Washington! Your support makes a real difference in our community.

DONATION RECEIPT:
================
Donation Amount: ${formattedAmount}
Type: One-time Donation
Donation Date: ${new Date(donationDate).toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
Receipt Number: BOW-${receiptNumber}

TAX DEDUCTIBLE INFORMATION:
==========================
Beats of Washington is a 501(c)(3) nonprofit organization. Your donation is tax-deductible to the full extent allowed by law.

Tax ID (EIN): 85-3674038
Organization: Beats of Washington
Address: 9256 225th Way NE, Redmond, WA 98053

Please save this receipt for your tax records. No goods or services were provided in exchange for this donation.

HOW YOUR DONATION HELPS:
=======================
Your generous support enables us to:
- Provide free music education programs
- Host inclusive community events  
- Support cultural exchange and diversity
- Create meaningful connections through music

CONTACT INFORMATION:
===================
Beats of Washington
9256 225th Way NE, Redmond, WA 98053
Phone: 206 369-9576
Email: beatsofredmond@gmail.com

Website: https://beatsofredmond.org
Facebook: https://www.facebook.com/BeatsOfRedmond/
Instagram: https://www.instagram.com/beatsofwa/
YouTube: https://www.youtube.com/c/BeatsOfRedmond

This is an automated receipt. Please keep this email for your tax records.
If you have any questions about your donation, please contact us at beatsofredmond@gmail.com

Thank you again for supporting our mission!
The Beats of Washington Team
`;
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

  // Get event registration confirmation email template
  static getEventRegistrationTemplate(registrationData) {
    const { userName, userEmail, ticketNumber, eventTitle, eventDate, eventTime, eventLocation, quantity, paymentAmount, paymentIntentId } = registrationData;
    const isPaidEvent = paymentAmount > 0;
    const formattedAmount = isPaidEvent ? `$${(paymentAmount / 100).toFixed(2)}` : 'Free';
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Registration Confirmed - Beats of Washington</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .ticket-details { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
        .ticket-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 5px 0; }
        .ticket-number { background: #dcfce7; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; font-family: monospace; font-size: 18px; font-weight: bold; color: #166534; }
        .payment-info { background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .thank-you { text-align: center; margin: 30px 0; }
        .event-details { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://bow-platform.s3.amazonaws.com/bow-logo.png" alt="Beats of Washington Logo" style="max-width: 200px; height: auto; background: white; padding: 10px; border-radius: 8px;">
            </div>
            <h1>🎉 Registration Confirmed!</h1>
            <p>You're all set for ${eventTitle}</p>
        </div>
        <div class="content">
            <div class="thank-you">
                <h2>Thank you, ${userName}!</h2>
                <p>Your registration has been confirmed. We're excited to see you at the event!</p>
            </div>

            <div class="ticket-details">
                <h3>🎫 Your Ticket Information</h3>
                <div class="ticket-number">${ticketNumber}</div>
                <div class="ticket-row">
                    <span><strong>Event:</strong></span>
                    <span>${eventTitle}</span>
                </div>
                <div class="ticket-row">
                    <span><strong>Date:</strong></span>
                    <span>${eventDate}</span>
                </div>
                <div class="ticket-row">
                    <span><strong>Time:</strong></span>
                    <span>${eventTime}</span>
                </div>
                <div class="ticket-row">
                    <span><strong>Location:</strong></span>
                    <span>${eventLocation}</span>
                </div>
                <div class="ticket-row">
                    <span><strong>Number of Attendees:</strong></span>
                    <span>${quantity} ${quantity === 1 ? 'person' : 'people'}</span>
                </div>
            </div>

            ${isPaidEvent ? `
            <div class="payment-info">
                <h3>💳 Payment Information</h3>
                <div class="ticket-row">
                    <span><strong>Amount Paid:</strong></span>
                    <span>${formattedAmount}</span>
                </div>
                ${paymentIntentId ? `
                <div class="ticket-row">
                    <span><strong>Transaction ID:</strong></span>
                    <span>${paymentIntentId}</span>
                </div>
                ` : ''}
                <p style="margin-top: 15px; font-size: 14px; color: #666;">
                    Payment has been processed successfully. Keep this email as your receipt.
                </p>
            </div>
            ` : ''}

            <div class="event-details">
                <h3>📋 Important Information</h3>
                <ul>
                    <li>Please arrive 15 minutes before the event starts</li>
                    <li>Bring a valid ID for check-in</li>
                    <li>Save this email or take a screenshot of your ticket number</li>
                    <li>Contact us if you have any questions or need to make changes</li>
                </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <p><strong>Need help or have questions?</strong></p>
                <p>Email: <a href="mailto:beatsofredmond@gmail.com">beatsofredmond@gmail.com</a><br>
                Phone: <a href="tel:+12063699576">(206) 369-9576</a></p>
            </div>
        </div>
        <div class="footer">
            <p><strong>Beats of Washington</strong><br>
            9256 225th Way NE, WA 98053<br>
            Phone: (206) 369-9576<br>
            <a href="mailto:beatsofredmond@gmail.com">beatsofredmond@gmail.com</a></p>
            
            <p>Follow us on:
            <a href="https://www.facebook.com/BeatsOfRedmond/">Facebook</a> | 
            <a href="https://www.instagram.com/beatsofwa/">Instagram</a> | 
            <a href="https://www.youtube.com/c/BeatsOfRedmond">YouTube</a></p>
        </div>
    </div>
</body>
</html>`;
  }

  // Get event registration confirmation text template
  static getEventRegistrationTextTemplate(registrationData) {
    const { userName, userEmail, ticketNumber, eventTitle, eventDate, eventTime, eventLocation, quantity, paymentAmount, paymentIntentId } = registrationData;
    const isPaidEvent = paymentAmount > 0;
    const formattedAmount = isPaidEvent ? `$${(paymentAmount / 100).toFixed(2)}` : 'Free';
    
    return `
EVENT REGISTRATION CONFIRMED - BEATS OF WASHINGTON
[LOGO: Beats of Washington Logo]

Thank you, ${userName}!

Your registration has been confirmed. We're excited to see you at the event!

TICKET INFORMATION:
Ticket Number: ${ticketNumber}
Event: ${eventTitle}
Date: ${eventDate}
Time: ${eventTime}
Location: ${eventLocation}
Number of Attendees: ${quantity} ${quantity === 1 ? 'person' : 'people'}

${isPaidEvent ? `
PAYMENT INFORMATION:
Amount Paid: ${formattedAmount}
${paymentIntentId ? `Transaction ID: ${paymentIntentId}` : ''}

Payment has been processed successfully. Keep this email as your receipt.
` : ''}

IMPORTANT INFORMATION:
- Please arrive 15 minutes before the event starts
- Bring a valid ID for check-in
- Save this email or take a screenshot of your ticket number
- Contact us if you have any questions or need to make changes

CONTACT INFORMATION:
Email: beatsofredmond@gmail.com
Phone: (206) 369-9576

Beats of Washington
9256 225th Way NE, WA 98053
Phone: (206) 369-9576
Email: beatsofredmond@gmail.com

Follow us on:
Facebook: https://www.facebook.com/BeatsOfRedmond/
Instagram: https://www.instagram.com/beatsofwa/
YouTube: https://www.youtube.com/c/BeatsOfRedmond
`;
  }
}

module.exports = {
  sesClient,
  EmailService,
  SES_CONFIG
};
