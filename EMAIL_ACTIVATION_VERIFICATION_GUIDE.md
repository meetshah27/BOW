# 📧 Email Service Activation & Verification Guide

This guide will help you activate and verify the AWS SES email service for your BOW platform.

## ✅ Current Status

Your email service is **already integrated** and configured to send emails from:
- **From Email**: `beatsofredmond@gmail.com`
- **From Name**: `Beats of Washington`
- **Reply To**: `beatsofredmond@gmail.com`
- **AWS Region**: `us-west-2`

## 🚀 Step-by-Step Activation

### Step 1: Verify Environment Variables

First, ensure your `.env` file in `bow-backend/` has the email configuration:

```bash
cd bow-backend
```

Check if `.env` file exists and contains:

```env
# AWS Configuration (Required)
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key

# Email Configuration (AWS SES)
SES_FROM_EMAIL=beatsofredmond@gmail.com
SES_FROM_NAME=Beats of Washington
SES_REPLY_TO=beatsofredmond@gmail.com
```

**If `.env` doesn't exist**, copy from the example:
```bash
cp env.example .env
```

Then edit `.env` and add your AWS credentials.

### Step 2: Check Current SES Status

Run the setup script to check your current AWS SES status:

```bash
cd bow-backend
node setup-aws-ses.js
```

This will show you:
- ✅ Current SES sending limits
- 📋 List of verified email addresses
- ⚠️ Whether you're in sandbox or production mode

### Step 3: Verify Email Address in AWS SES

**Option A: Using the Script (Recommended)**

If `beatsofredmond@gmail.com` is not verified, the script will guide you. You can also manually verify:

```bash
# The script will automatically send verification email if not verified
node setup-aws-ses.js
```

**Option B: Manual Verification via AWS Console**

1. Go to [AWS SES Console](https://console.aws.amazon.com/ses/)
2. Make sure you're in the **us-west-2** region (top right)
3. Click **"Verified identities"** in the left sidebar
4. Click **"Create identity"**
5. Select **"Email address"**
6. Enter: `beatsofredmond@gmail.com`
7. Click **"Create identity"**
8. Check the email inbox for `beatsofredmond@gmail.com`
9. Look for an email from AWS SES
10. Click the verification link in the email
11. Wait a few seconds, then refresh the AWS SES console - status should show "Verified"

### Step 4: Test Email Sending

Once the email is verified, test the email functionality:

```bash
cd bow-backend
node verify-email-setup.js
```

This will:
- ✅ Verify your email configuration
- 📧 Send a test email (you'll need to update the recipient email in the script)
- 📋 Show current settings

**To test with your own email**, edit `verify-email-setup.js` and change line 47:
```javascript
to: 'your-email@example.com', // Replace with your email
```

### Step 5: Request Production Access (Important!)

**New AWS SES accounts start in "sandbox mode"** which means:
- ❌ Can only send emails to verified email addresses
- ❌ Limited to 200 emails per day
- ❌ Cannot send to newsletter subscribers or donation recipients

**To send to any email address:**

1. Go to [AWS SES Console](https://console.aws.amazon.com/ses/)
2. Make sure you're in the **us-west-2** region
3. Click **"Account dashboard"** in the left sidebar
4. Scroll down to **"Sending statistics"**
5. Click **"Request production access"** button
6. Fill out the form:
   - **Mail Type**: Transactional (for receipts) or Marketing (for newsletters)
   - **Website URL**: `https://beatsofredmond.org`
   - **Use case description**: 
     ```
     We are a 501(c)(3) nonprofit organization (EIN: 85-3674038) 
     sending donation receipts, event confirmations, and newsletter 
     updates to our community members. We use double opt-in for 
     newsletter subscriptions and maintain a clean email list.
     ```
   - **Compliance**: Check all boxes that apply
   - **Additional contact information**: Your contact details
7. Click **"Submit request"**
8. **Wait for approval**: Usually 24-48 hours (AWS will email you)

### Step 6: Verify IAM Permissions

Ensure your AWS user/role has the necessary SES permissions:

**Required IAM Permissions:**
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
        "ses:ListVerifiedEmailAddresses",
        "ses:GetSendQuota",
        "ses:GetSendStatistics"
      ],
      "Resource": "*"
    }
  ]
}
```

**To check/add permissions:**
1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Click **"Users"** or **"Roles"** (depending on your setup)
3. Find your AWS user/role
4. Click **"Add permissions"** → **"Attach policies directly"**
5. Search for **"AmazonSESFullAccess"** or create a custom policy with the permissions above

## 🧪 Complete Verification Checklist

Run through this checklist to ensure everything is working:

- [ ] AWS credentials configured in `.env` file
- [ ] Email environment variables set (`SES_FROM_EMAIL`, `SES_FROM_NAME`, `SES_REPLY_TO`)
- [ ] `beatsofredmond@gmail.com` verified in AWS SES
- [ ] Test email sent successfully
- [ ] IAM permissions configured correctly
- [ ] Production access requested (if needed)
- [ ] Backend server can send emails

## 🧪 Testing Different Email Types

### Test Donation Receipt Email

```bash
cd bow-backend
node test-donation-receipt.js
```

### Test Newsletter Welcome Email

Subscribe to the newsletter through your website footer, then check for the welcome email.

### Test Contact Form Email

Submit a contact form through your website, then check `beatsofredmond@gmail.com` inbox.

## 🔍 Troubleshooting

### Issue: "Email address not verified"

**Solution:**
1. Go to AWS SES Console → Verified identities
2. Verify `beatsofredmond@gmail.com`
3. Check email inbox and click verification link

### Issue: "Access Denied" or "Invalid credentials"

**Solution:**
1. Check `.env` file has correct `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
2. Verify IAM user has SES permissions
3. Ensure credentials are not expired

### Issue: "Sending quota exceeded"

**Solution:**
- If in sandbox: Request production access
- If in production: Wait 24 hours for quota reset, or request quota increase

### Issue: "Email not received"

**Check:**
1. Spam/junk folder
2. AWS SES sending statistics for bounces
3. Email address is correct
4. SES is out of sandbox mode (if sending to unverified addresses)

### Issue: "Region mismatch"

**Solution:**
- Ensure AWS region is `us-west-2` in both `.env` and AWS Console
- Verify email in the same region you're sending from

## 📊 Monitoring Email Sending

### AWS SES Console
- **Sending statistics**: View delivery, bounce, and complaint rates
- **Reputation**: Monitor sender reputation score
- **Suppression list**: See bounced/complained emails

### Application Logs
Check your backend server console for email sending logs:
- ✅ `Email sent successfully: [MessageId]`
- ❌ `Error sending email: [error message]`

## 🎯 What Emails Will Be Sent

Once activated, your system will automatically send:

1. **Donation Receipts** - When users make donations
2. **Event Registration Confirmations** - When users register for events
3. **Newsletter Welcome Emails** - When users subscribe to newsletter
4. **Newsletter Campaigns** - When you send campaigns from admin panel
5. **Contact Form Notifications** - When users submit contact forms

## ✅ Success Indicators

You'll know the email service is working when:

- ✅ `setup-aws-ses.js` shows verified email addresses
- ✅ `verify-email-setup.js` sends test email successfully
- ✅ Users receive donation receipts
- ✅ Newsletter subscribers receive welcome emails
- ✅ No errors in backend server logs

## 🎉 Next Steps

Once verified:

1. **Test with real scenarios**: Make a test donation, subscribe to newsletter
2. **Monitor sending statistics**: Check AWS SES console regularly
3. **Maintain clean email list**: Remove bounced emails from subscriber list
4. **Request production access**: If you need to send to unverified addresses

## 📞 Need Help?

If you encounter issues:
1. Check AWS CloudWatch logs for detailed error messages
2. Review AWS SES documentation
3. Verify all environment variables are set correctly
4. Ensure you're using the correct AWS region (`us-west-2`)

---

**🎵 Your email service is ready to send beautiful emails from beatsofredmond@gmail.com! 🎵**




