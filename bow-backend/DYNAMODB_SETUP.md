# DynamoDB Setup Guide for BOW Application

## 🚀 Overview

This guide will help you set up DynamoDB for your BOW (Beats of Washington) application. DynamoDB is AWS's fully managed NoSQL database service.

## 📋 Prerequisites

1. **AWS Account**: You need an AWS account
2. **AWS CLI**: Install AWS CLI for local development
3. **AWS Credentials**: Configure your AWS credentials

## 🔧 Step 1: AWS Setup

### Install AWS CLI
```bash
# Windows (using chocolatey)
choco install awscli

# Or download from: https://aws.amazon.com/cli/
```

### Configure AWS Credentials
```bash
aws configure
```

You'll be prompted for:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (use: us-east-1)
- Default output format (use: json)

## 🔑 Step 2: Create Environment File

Create a `.env` file in your `bow-backend` directory:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# Server Configuration
PORT=3000
NODE_ENV=production

# Stripe Configuration (update with your production keys)
STRIPE_SECRET_KEY=your_production_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_production_stripe_publishable_key_here

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.com
```

## 🗄️ Step 3: Create DynamoDB Tables

Run the table creation script:

```bash
cd bow-backend
node create-dynamodb-tables.js
```

This will create the following tables:
- `bow-users` - User accounts and profiles
- `bow-events` - Event information
- `bow-stories` - Community stories
- `bow-founders` - Founder information
- `bow-donations` - Donation records
- `bow-registrations` - Event registrations
- `bow-volunteers` - Volunteer applications

## 🌱 Step 4: Seed Initial Data

Populate your tables with initial data:

```bash
node seed-dynamodb.js
```

This will create:
- Founder accounts (Aand and Deepali Sane)
- Sample events (Summer Festival, Workshops, Concerts)

## 🧪 Step 5: Test the Setup

Start your server to test the DynamoDB connection:

```bash
npm start
```

You should see:
```
🔍 Environment check:
   AWS_REGION: us-east-1
   AWS_ACCESS_KEY_ID set: true
   AWS_SECRET_ACCESS_KEY set: true
✅ DynamoDB client initialized
📊 Using AWS Region: us-east-1
```

## 🔍 Step 6: Verify in AWS Console

1. Go to AWS Console → DynamoDB
2. Check that all tables are created
3. Verify data is populated in the tables

## 🛡️ Step 7: Security Best Practices

### IAM Permissions
Create a dedicated IAM user with minimal permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:YOUR_ACCOUNT_ID:table/bow-*"
      ]
    }
  ]
}
```

### Environment Variables
- Never commit `.env` files to version control
- Use AWS Secrets Manager for production credentials
- Rotate access keys regularly

## 📊 Step 8: Monitoring and Optimization

### CloudWatch Monitoring
- Set up CloudWatch alarms for table metrics
- Monitor read/write capacity
- Track error rates

### Cost Optimization
- Use on-demand pricing for development
- Consider provisioned capacity for production
- Monitor data transfer costs

## 🔄 Step 9: Production Deployment

When deploying to production:

1. **Environment Variables**: Set AWS credentials on your hosting platform
2. **Region**: Ensure your app and DynamoDB are in the same region
3. **VPC**: Consider using VPC endpoints for better security
4. **Backup**: Enable point-in-time recovery for critical tables

## 🚨 Troubleshooting

### Common Issues

**1. Access Denied Error**
- Check IAM permissions
- Verify access keys are correct
- Ensure region matches

**2. Table Not Found**
- Run table creation script
- Check table names in code
- Verify AWS region

**3. Connection Timeout**
- Check internet connection
- Verify AWS region
- Check VPC settings (if applicable)

### Debug Commands

```bash
# Test AWS credentials
aws sts get-caller-identity

# List DynamoDB tables
aws dynamodb list-tables

# Check table details
aws dynamodb describe-table --table-name bow-users
```

## 📚 Additional Resources

- [DynamoDB Developer Guide](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)

## 🎯 Next Steps

After setup:
1. Update your routes to use DynamoDB models
2. Test all CRUD operations
3. Set up monitoring and alerts
4. Plan for data backup and recovery 