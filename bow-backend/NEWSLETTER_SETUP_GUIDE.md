# Newsletter System Setup Guide

## 🚀 Overview

This guide will help you set up the complete newsletter system for your BOW application, including subscriber management and campaign creation.

## 📋 Prerequisites

1. **AWS Account**: You need an AWS account with DynamoDB access
2. **AWS Credentials**: Configure your AWS credentials
3. **Node.js**: Ensure Node.js is installed

## 🔧 Step 1: AWS Credentials Setup

### Create .env file
Create a `.env` file in your `bow-backend` directory:

```env
# BOW Backend Environment Variables
PORT=3000
NODE_ENV=development

# AWS Configuration
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# S3 Configuration
S3_BUCKET_NAME=bow-media-storages

# Other Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
```

### Get AWS Credentials
1. Go to **AWS Console** → **IAM** → **Users** → **Your User**
2. Click **Security credentials** tab
3. Click **Create access key**
4. Copy the **Access Key ID** and **Secret Access Key**
5. Update the `.env` file with your actual credentials

## 🗄️ Step 2: Create DynamoDB Tables

### Test AWS Credentials
First, test if your credentials work:

```bash
cd bow-backend
node test-aws-credentials.js
```

### Create Newsletter Tables
If the credentials test passes, create the tables:

```bash
node create-newsletter-table.js
node create-newsletter-campaigns-table.js
```

This will create:
- `NewsletterSubscribers` - Stores subscriber information
- `NewsletterCampaigns` - Stores newsletter campaigns

## 📧 Step 3: Newsletter System Features

### Subscriber Management
- **Subscribe**: Users can subscribe via the footer form
- **Unsubscribe**: Users can unsubscribe via email
- **Resubscribe**: Inactive subscribers can be reactivated
- **Preferences**: Manage email preferences (events, stories, etc.)

### Campaign Management
- **Create Campaigns**: Create newsletter content
- **Schedule Campaigns**: Set future send dates
- **Send Campaigns**: Mark campaigns as sent
- **Campaign Statistics**: View campaign performance

## 🔌 Step 4: API Endpoints

### Subscriber Endpoints
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter
- `GET /api/newsletter/subscribers` - Get all subscribers (admin)
- `GET /api/newsletter/subscriber-count` - Get subscriber count (admin)
- `PUT /api/newsletter/subscribers/:email` - Update subscriber (admin)
- `DELETE /api/newsletter/subscribers/:email` - Delete subscriber (admin)

### Campaign Endpoints
- `POST /api/newsletter/campaigns` - Create new campaign
- `GET /api/newsletter/campaigns` - Get all campaigns
- `GET /api/newsletter/campaigns/:campaignId` - Get specific campaign
- `PUT /api/newsletter/campaigns/:campaignId` - Update campaign
- `DELETE /api/newsletter/campaigns/:campaignId` - Delete campaign
- `POST /api/newsletter/campaigns/:campaignId/schedule` - Schedule campaign
- `POST /api/newsletter/campaigns/:campaignId/send` - Mark as sent

## 🎨 Step 5: Frontend Integration

### Newsletter Signup Form
The newsletter signup form is already integrated in the footer (`Footer.js`).

### Admin Panel
The admin panel includes:
- **Newsletter Management** component with tabs for:
  - **Subscribers**: View and manage newsletter subscribers
  - **Campaigns**: Create and manage newsletter campaigns

## 📁 Step 6: File Structure

```
bow-backend/
├── models-dynamodb/
│   ├── Newsletter.js              # Subscriber model
│   └── NewsletterCampaign.js      # Campaign model
├── routes/
│   ├── newsletter.js              # Subscriber routes
│   └── newsletter-campaigns.js    # Campaign routes
├── create-newsletter-table.js     # Table creation script
├── create-newsletter-campaigns-table.js # Campaign table script
├── test-aws-credentials.js        # Credential testing
└── .env                           # Environment variables

bow-platform/src/
├── components/
│   ├── layout/
│   │   └── Footer.js              # Newsletter signup form
│   └── admin/
│       ├── NewsletterManagement.js # Admin newsletter interface
│       └── NewsletterCampaignManager.js # Campaign management
└── pages/
    └── AdminPanel.js              # Admin panel with newsletter section
```

## 🧪 Step 7: Testing

### Test Subscriber Management
1. Start your backend server: `npm start`
2. Go to your website footer
3. Try subscribing with an email
4. Check the admin panel to see the subscriber

### Test Campaign Management
1. Go to Admin Panel → Newsletter → Campaigns
2. Create a new campaign
3. Test scheduling and sending features

## 🔍 Troubleshooting

### AWS Credential Issues
If you get `Error: Resolved credential object is not valid`:
1. Check if `.env` file exists in `bow-backend` directory
2. Verify AWS credentials are correct
3. Run `node test-aws-credentials.js` to test

### Table Creation Issues
If table creation fails:
1. Ensure AWS credentials have DynamoDB permissions
2. Check if tables already exist
3. Verify region is set to `us-west-2`

### Frontend Issues
If newsletter signup doesn't work:
1. Check browser console for errors
2. Verify backend server is running
3. Check CORS configuration

## 📊 Database Schema

### NewsletterSubscribers Table
- **Partition Key**: `email` (String)
- **Attributes**:
  - `firstName` (String)
  - `lastName` (String)
  - `isActive` (Boolean)
  - `subscriptionDate` (String)
  - `preferences` (Map)
  - `updatedAt` (String)

### NewsletterCampaigns Table
- **Partition Key**: `campaignId` (String)
- **Attributes**:
  - `title` (String)
  - `subject` (String)
  - `content` (String)
  - `author` (String)
  - `status` (String) - draft, scheduled, sent
  - `scheduledDate` (String)
  - `sentDate` (String)
  - `targetAudience` (String)
  - `template` (String)
  - `metadata` (Map)
  - `createdAt` (String)
  - `updatedAt` (String)

## 🎉 Success!

Once all steps are completed, you'll have a fully functional newsletter system with:
- ✅ Subscriber management
- ✅ Campaign creation and management
- ✅ Admin interface
- ✅ API endpoints
- ✅ Frontend integration

The newsletter system is now ready to use! 