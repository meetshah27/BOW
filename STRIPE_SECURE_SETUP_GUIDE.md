# 🔐 BOW Stripe Secure Setup Guide

This guide will help you set up secure Stripe key management using AWS SSM Parameter Store instead of environment variables.

## 🎯 Overview

We've implemented a secure key management system that:
- ✅ Stores Stripe keys encrypted in AWS SSM Parameter Store
- ✅ Retrieves keys securely at runtime
- ✅ Eliminates the need for keys in environment files
- ✅ Provides better security and key rotation capabilities

## 🚀 Quick Setup

### 1. Prerequisites

Ensure you have:
- AWS CLI configured with appropriate permissions
- Stripe account with API keys
- Node.js environment running

### 2. Run the Setup Script

```bash
cd bow-backend
node setup-stripe-keys.js
```

The script will:
- Prompt for your Stripe API keys
- Validate key formats
- Store keys securely in AWS SSM Parameter Store
- Test the configuration

### 3. Required Stripe Keys

You'll need these keys from your Stripe Dashboard:

1. **Secret Key** (`sk_live_...` or `sk_test_...`)
   - Found in: Stripe Dashboard > Developers > API keys
   - Used for server-side operations

2. **Publishable Key** (`pk_live_...` or `pk_test_...`)
   - Found in: Stripe Dashboard > Developers > API keys
   - Used for client-side operations

3. **Webhook Secret** (`whsec_...`)
   - Found in: Stripe Dashboard > Developers > Webhooks
   - Used for webhook signature verification

## 🔧 Manual Setup (Alternative)

If you prefer to set up manually:

### 1. Store Keys in SSM Parameter Store

```bash
# Store Stripe Secret Key (encrypted)
aws ssm put-parameter \
  --name "/bow/stripe/secret-key" \
  --value "sk_live_your_actual_secret_key" \
  --type "SecureString" \
  --description "BOW Stripe Secret Key"

# Store Stripe Publishable Key (not encrypted - safe for frontend)
aws ssm put-parameter \
  --name "/bow/stripe/publishable-key" \
  --value "pk_live_your_actual_publishable_key" \
  --type "String" \
  --description "BOW Stripe Publishable Key"

# Store Stripe Webhook Secret (encrypted)
aws ssm put-parameter \
  --name "/bow/stripe/webhook-secret" \
  --value "whsec_your_actual_webhook_secret" \
  --type "SecureString" \
  --description "BOW Stripe Webhook Secret"
```

### 2. Test Configuration

```bash
# Test the key retrieval
curl http://localhost:3000/api/stripe-config/test
```

## 🔒 Security Benefits

### Before (Environment Variables)
```
❌ Keys stored in .env file
❌ Keys visible in code repositories
❌ Keys in server logs
❌ Manual key rotation
❌ No access control
```

### After (AWS SSM Parameter Store)
```
✅ Keys encrypted at rest in AWS
✅ Keys not stored in code or environment files
✅ Keys not visible in logs
✅ Automated key rotation capability
✅ Access controlled via AWS IAM permissions
✅ Audit trail for key access
```

## 📋 AWS IAM Permissions

Your AWS user/role needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:GetParameters",
        "ssm:PutParameter"
      ],
      "Resource": [
        "arn:aws:ssm:us-west-2:*:parameter/bow/stripe/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt"
      ],
      "Resource": [
        "arn:aws:kms:us-west-2:*:key/*"
      ]
    }
  ]
}
```

## 🧪 Testing

### 1. Test Key Retrieval
```bash
curl http://localhost:3000/api/stripe-config/test
```

Expected response:
```json
{
  "success": true,
  "message": "Stripe keys are configured correctly",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Test Frontend Integration
1. Visit the donation page
2. Check browser console for "✅ Stripe loaded successfully"
3. Try making a test donation

## 🔄 Key Rotation

To rotate keys:

1. Update keys in Stripe Dashboard
2. Run the setup script again:
   ```bash
   node setup-stripe-keys.js
   ```
3. Restart the application

## 🐛 Troubleshooting

### Common Issues

#### 1. "Stripe keys are not configured correctly"
- Check AWS credentials are configured
- Verify SSM parameters exist:
  ```bash
  aws ssm get-parameter --name "/bow/stripe/secret-key"
  ```

#### 2. "Payment processing is not configured"
- Ensure all three keys are stored in SSM
- Check AWS region is set to `us-west-2`
- Verify IAM permissions

#### 3. Frontend shows "Loading payment system..."
- Check browser console for errors
- Verify `/api/stripe-config` endpoint is accessible
- Ensure backend is running

### Debug Commands

```bash
# Check SSM parameters
aws ssm describe-parameters --parameter-filters "Key=Name,Values=/bow/stripe/"

# Test key retrieval
aws ssm get-parameter --name "/bow/stripe/secret-key" --with-decryption

# Check application logs
tail -f /path/to/your/app.log | grep -i stripe
```

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review AWS CloudWatch logs
3. Verify Stripe Dashboard configuration
4. Test with Stripe test keys first

## 🎉 Next Steps

After successful setup:
1. Remove `STRIPE_*` variables from your `.env` file
2. Restart your application
3. Test donation functionality
4. Set up monitoring and alerts for key access

---

**🔐 Your Stripe keys are now securely managed!** 🎵✨
