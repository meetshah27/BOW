# 📧 BOW Email Setup Verification Guide

This guide ensures that users receive donation receipts from `beatsofredmond@gmail.com`.

## ✅ Current Configuration

The BOW system is already configured to send emails from:
- **From Email**: `beatsofredmond@gmail.com`
- **From Name**: `Beats of Washington`
- **Reply To**: `beatsofredmond@gmail.com`

## 🧪 Testing Email Setup

Run the verification script to test email functionality:

```bash
cd bow-backend
node verify-email-setup.js
```

This will:
- ✅ Verify email configuration
- 📧 Send a test email
- 📋 Show current settings

## 📧 What Users Will See

When users make donations, they'll receive emails with:

**Email Header:**
```
From: Beats of Washington <beatsofredmond@gmail.com>
To: [User's Email]
Subject: Thank you for your donation to Beats of Washington!
```

**Email Footer:**
```
Beats of Washington
9256 225th Way NE, Redmond, WA 98053
Phone: 206 369-9576
Email: beatsofredmond@gmail.com
```

## 🔧 AWS SES Setup Requirements

To ensure emails are delivered successfully:

### 1. Verify Email Address
```bash
# In AWS SES Console:
# 1. Go to "Verified identities"
# 2. Add beatsofredmond@gmail.com
# 3. Check email and click verification link
```

### 2. Verify Domain (Recommended)
```bash
# Add DNS records to verify beatsofredmond.org
# This allows sending from any email at your domain
```

### 3. Move Out of Sandbox
```bash
# Request production access in AWS SES
# This allows sending to any email address
```

### 4. IAM Permissions
Ensure your AWS user has these permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
```

## 📋 Email Templates

All email templates include:
- ✅ **Professional BOW branding**
- ✅ **beatsofredmond@gmail.com** as sender
- ✅ **Contact information** in footer
- ✅ **Tax-deductible receipt** information
- ✅ **Social media links**

## 🎯 Testing Donation Emails

To test the complete donation email flow:

```bash
cd bow-backend
node test-donation-receipt.js
```

This will send a test donation receipt to verify the complete email system.

## 🔍 Troubleshooting

### Email Not Received?
1. Check spam/junk folder
2. Verify `beatsofredmond@gmail.com` is verified in AWS SES
3. Check AWS CloudWatch logs for errors
4. Ensure SES is out of sandbox mode

### Configuration Issues?
1. Verify `.env` file has correct settings:
   ```
   SES_FROM_EMAIL=beatsofredmond@gmail.com
   SES_FROM_NAME=Beats of Washington
   SES_REPLY_TO=beatsofredmond@gmail.com
   ```

### AWS Issues?
1. Check AWS credentials are configured
2. Verify SES region is `us-west-2`
3. Ensure IAM permissions are correct

## ✅ Verification Checklist

- [ ] Email configuration shows `beatsofredmond@gmail.com`
- [ ] Test email sends successfully
- [ ] AWS SES email address is verified
- [ ] Domain verification completed (optional)
- [ ] Production access granted (if needed)
- [ ] IAM permissions configured
- [ ] Donation receipt test passes

## 🎉 Result

When everything is set up correctly:
- ✅ Users receive professional donation receipts
- ✅ Emails come from `beatsofredmond@gmail.com`
- ✅ All contact information is correct
- ✅ Tax-deductible information is included
- ✅ Professional BOW branding throughout

---

**📧 Users will now receive beautiful donation receipts from beatsofredmond@gmail.com!** 🎵✨
