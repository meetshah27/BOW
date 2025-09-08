# Complete Newsletter Email Setup Guide

This guide will help you set up the complete newsletter system with AWS SES email delivery for the BOW platform.

## 🎯 Overview

Your newsletter system now includes:
- **Frontend**: Newsletter signup form in the footer ✅
- **Backend**: API endpoints for subscription management ✅
- **Database**: DynamoDB table for storing subscribers ✅
- **Admin Panel**: Management interface for subscribers and campaigns ✅
- **Email Service**: AWS SES integration for sending actual emails ✅

## 📋 Prerequisites

1. **Backend Server**: Running on `http://localhost:3000`
2. **Frontend**: Running on `http://localhost:3001`
3. **AWS Account**: With SES access
4. **AWS Credentials**: Configured in `.env` file
5. **DynamoDB Tables**: Newsletter tables created

## 🚀 Step-by-Step Setup

### Step 1: Install Email Dependencies

```bash
cd bow-backend
npm install @aws-sdk/client-ses nodemailer
```

### Step 2: Configure Environment Variables

Add these variables to your `bow-backend/.env` file:

```env
# Email Configuration (AWS SES)
SES_FROM_EMAIL=beatsofredmond@gmail.com
SES_FROM_NAME=Beats of Washington
SES_REPLY_TO=beatsofredmond@gmail.com
```

### Step 3: Set Up AWS SES

Run the SES setup script:

```bash
cd bow-backend
node setup-aws-ses.js
```

This will:
- Check your AWS credentials
- Display current verified email addresses
- Show next steps for email verification

### Step 4: Verify Your Sender Email

**Important**: AWS SES requires email address verification before sending.

```bash
# Verify your sender email
node setup-aws-ses.js --verify-email
```

This will:
1. Send a verification email to `beatsofredmond@gmail.com`
2. You must click the verification link in that email
3. Wait for AWS to confirm verification (usually instant)

### Step 5: Test Email Sending

Once verified, test email functionality:

```bash
# Test sending an email
node setup-aws-ses.js --test-email your-personal-email@example.com
```

### Step 6: Request Production Access (Important!)

**New AWS SES accounts are in "sandbox mode"** which means:
- ❌ Can only send emails to verified addresses
- ❌ Limited to 200 emails per day
- ❌ Cannot send to newsletter subscribers

**To send to actual subscribers:**

1. **Go to AWS SES Console**: https://console.aws.amazon.com/ses/
2. **Navigate to**: Account dashboard → Sending statistics
3. **Click**: "Request production access"
4. **Fill out the form**:
   - Use case: Newsletter/Marketing emails
   - Website: https://beatsofredmond.org
   - Describe: Community newsletter for cultural organization
   - Process: Usually approved within 24-48 hours

### Step 7: Start Your Servers

```bash
# Start backend
cd bow-backend
npm start

# Start frontend (in another terminal)
cd bow-platform
npm start
```

## 🧪 Testing the Complete System

### Test 1: Newsletter Subscription
1. Go to your website footer
2. Enter an email address
3. Click "Subscribe"
4. Check that email for a welcome message

### Test 2: Admin Panel Campaign
1. Go to `http://localhost:3001/admin`
2. Click "Newsletter" tab
3. Click "Campaigns" sub-tab
4. Create a new campaign
5. Send a test email first
6. Send to all subscribers

### Test 3: API Endpoints
```bash
# Check verified emails
curl http://localhost:3000/api/newsletter/ses/verified-emails

# Get subscriber count
curl http://localhost:3000/api/newsletter/subscriber-count
```

## 📧 Email Features

### Welcome Emails
- ✅ Automatically sent when someone subscribes
- ✅ Professional HTML template
- ✅ Includes organization branding

### Newsletter Campaigns
- ✅ Rich HTML email templates
- ✅ Personalization ({{firstName}}, {{lastName}})
- ✅ Batch sending with rate limiting
- ✅ Send to all subscribers or by preference
- ✅ Test email functionality

### Email Templates
- ✅ Responsive HTML design
- ✅ Organization branding
- ✅ Social media links
- ✅ Unsubscribe information

## 🔧 New API Endpoints

### Email Management
- `GET /api/newsletter/ses/verified-emails` - List verified emails
- `POST /api/newsletter/ses/verify-email` - Verify new email address

### Campaign Email Features
- `POST /api/newsletter/campaigns/:id/send` - Send campaign to subscribers
- `POST /api/newsletter/campaigns/:id/test` - Send test email

## 📊 Email Sending Limits

### Sandbox Mode (New Accounts)
- **Daily limit**: 200 emails
- **Rate limit**: 1 email per second
- **Recipients**: Only verified email addresses

### Production Mode (After Approval)
- **Daily limit**: Starts at 200, increases over time
- **Rate limit**: Starts at 1/sec, increases over time
- **Recipients**: Any valid email address
- **Reputation**: Based on bounce/complaint rates

## 🚨 Troubleshooting

### Common Issues

1. **"Email address not verified"**
   ```bash
   node setup-aws-ses.js --verify-email
   ```

2. **"Sending quota exceeded"**
   - Request production access
   - Or wait 24 hours for quota reset

3. **"Invalid credentials"**
   - Check `.env` file AWS credentials
   - Ensure IAM user has SES permissions

4. **"Access denied"**
   - Add SES permissions to IAM user:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": [
             "ses:SendEmail",
             "ses:SendRawEmail",
             "ses:VerifyEmailIdentity",
             "ses:ListVerifiedEmailAddresses"
           ],
           "Resource": "*"
         }
       ]
     }
     ```

### Email Not Receiving

1. **Check spam/junk folder**
2. **Verify sender email is verified in SES**
3. **Check AWS SES sending statistics for bounces**
4. **Ensure recipient email is valid**

### High Bounce/Complaint Rates

- **Monitor**: AWS SES reputation dashboard
- **Clean**: Remove invalid emails from subscriber list
- **Improve**: Email content and frequency
- **Implement**: Double opt-in for subscriptions

## 📈 Monitoring and Analytics

### AWS SES Console
- **Sending statistics**: Delivery, bounce, complaint rates
- **Reputation**: Sender reputation score
- **Suppression list**: Bounced/complained emails

### Application Logs
- **Email sending results**: Check server console
- **Campaign statistics**: Available in admin panel
- **Subscriber activity**: Tracked in database

## ✅ Success Checklist

- [ ] AWS credentials configured
- [ ] SES sender email verified
- [ ] Production access requested (if needed)
- [ ] Welcome emails working
- [ ] Newsletter campaigns sending
- [ ] Test emails successful
- [ ] Admin panel functional
- [ ] Subscriber management working

## 🎉 You're All Set!

Your newsletter system is now **fully functional** with:
- ✅ **Email collection** through website footer
- ✅ **Welcome emails** for new subscribers
- ✅ **Newsletter campaigns** with professional templates
- ✅ **Admin management** interface
- ✅ **AWS SES integration** for reliable delivery

Subscribers will now receive actual emails when:
1. They subscribe (welcome email)
2. You send newsletter campaigns from admin panel

## 📞 Support

For issues or questions:
- Check AWS SES documentation
- Review server logs for error messages
- Test with verified email addresses first
- Monitor AWS SES sending statistics
