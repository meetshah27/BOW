# Newsletter System Setup Guide

This guide will help you set up the complete newsletter system for the BOW platform.

## 🎯 Overview

The newsletter system includes:
- **Frontend**: Newsletter signup form in the footer
- **Backend**: API endpoints for subscription management
- **Database**: DynamoDB table for storing subscribers
- **Admin Panel**: Management interface for subscribers

## 📋 Prerequisites

1. **Backend Server**: Running on `http://localhost:3000`
2. **Frontend**: Running on `http://localhost:3001`
3. **AWS Credentials**: Configured in `.env` file
4. **DynamoDB Access**: Proper permissions for table creation

## 🚀 Setup Steps

### Step 1: Create Newsletter Tables

Run the following commands to create both newsletter tables in DynamoDB:

```bash
cd bow-backend

# Create subscribers table
node create-newsletter-table.js

# Create campaigns table
node create-newsletter-campaigns-table.js
```

**Expected Output:**
```
📧 Creating NewsletterSubscribers table...
✅ NewsletterSubscribers table created successfully
📊 Table details:
   - Name: NewsletterSubscribers
   - Partition Key: email (String)
   - GSI: ActiveSubscribersIndex (isActive + subscriptionDate)
   - Read Capacity: 5 units
   - Write Capacity: 5 units
🎉 Newsletter table setup completed

📧 Creating NewsletterCampaigns table...
✅ NewsletterCampaigns table created successfully
📊 Table details:
   - Name: NewsletterCampaigns
   - Partition Key: campaignId (String)
   - Read Capacity: 5 units
   - Write Capacity: 5 units
🎉 Newsletter campaigns table setup completed
```

### Step 2: Verify Backend Routes

The newsletter routes are automatically added to the server. Verify they're working:

```bash
# Test subscription endpoint
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Test getting subscribers (should return empty array initially)
curl http://localhost:3000/api/newsletter/subscribers
```

### Step 3: Test Frontend Integration

1. **Start the frontend** (if not already running):
   ```bash
   cd bow-platform
   npm start
   ```

2. **Navigate to any page** and scroll to the footer
3. **Test the newsletter signup form**:
   - Enter a valid email address
   - Click "Subscribe"
   - You should see a success message

### Step 4: Access Admin Panel

1. **Navigate to the admin panel**: `http://localhost:3001/admin`
2. **Click on "Newsletter"** in the sidebar
3. **You'll see two tabs**:
   - **Subscribers**: Manage newsletter subscribers
   - **Campaigns**: Create and manage newsletter content
4. **Click on "Campaigns"** to create your first newsletter

## 📊 Features

### Frontend Features
- ✅ **Footer Signup Form**: Functional newsletter subscription
- ✅ **Form Validation**: Email format validation
- ✅ **Loading States**: Visual feedback during subscription
- ✅ **Success/Error Messages**: Toast notifications

### Backend Features
- ✅ **Subscribe**: Add new subscribers
- ✅ **Unsubscribe**: Deactivate subscribers
- ✅ **Resubscribe**: Reactivate inactive subscribers
- ✅ **Duplicate Prevention**: Prevents duplicate email subscriptions
- ✅ **Email Validation**: Server-side email format validation

### Admin Panel Features
- ✅ **Subscriber Management**: View, search, filter, and manage subscribers
- ✅ **Campaign Creation**: Create newsletter content with rich text editor
- ✅ **Campaign Management**: Edit, schedule, and track campaign status
- ✅ **Bulk Operations**: Select and delete multiple subscribers
- ✅ **Export CSV**: Download subscriber data
- ✅ **Status Management**: View active/inactive subscribers and campaign status
- ✅ **Statistics**: Total, active, and inactive counts
- ✅ **Targeted Campaigns**: Send to specific subscriber groups

## 🔧 API Endpoints

### Public Endpoints
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter

### Admin Endpoints
- `GET /api/newsletter/subscribers` - Get all subscribers
- `GET /api/newsletter/subscriber-count` - Get subscriber count
- `GET /api/newsletter/subscribers/preference/:preference` - Get subscribers by preference
- `PUT /api/newsletter/subscribers/:email` - Update subscriber
- `DELETE /api/newsletter/subscribers/:email` - Delete subscriber
- `POST /api/newsletter/subscribers/:email/resubscribe` - Resubscribe inactive user

### Campaign Endpoints
- `POST /api/newsletter/campaigns` - Create new campaign
- `GET /api/newsletter/campaigns` - Get all campaigns
- `GET /api/newsletter/campaigns/:campaignId` - Get campaign by ID
- `GET /api/newsletter/campaigns/status/:status` - Get campaigns by status
- `PUT /api/newsletter/campaigns/:campaignId` - Update campaign
- `DELETE /api/newsletter/campaigns/:campaignId` - Delete campaign
- `POST /api/newsletter/campaigns/:campaignId/schedule` - Schedule campaign
- `POST /api/newsletter/campaigns/:campaignId/send` - Mark campaign as sent
- `GET /api/newsletter/campaigns/stats/overview` - Get campaign statistics

## 📁 File Structure

```
bow-backend/
├── models-dynamodb/
│   ├── Newsletter.js              # Newsletter DynamoDB model
│   └── NewsletterCampaign.js      # Newsletter Campaign DynamoDB model
├── routes/
│   ├── newsletter.js              # Newsletter API routes
│   └── newsletter-campaigns.js    # Newsletter Campaign API routes
├── create-newsletter-table.js     # Subscribers table creation script
├── create-newsletter-campaigns-table.js  # Campaigns table creation script
└── server.js                      # Updated with newsletter routes

bow-platform/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── NewsletterManagement.js      # Admin management component
│   │   │   └── NewsletterCampaignManager.js # Campaign management component
│   │   └── layout/
│   │       └── Footer.js                     # Updated with functional signup
│   └── pages/
│       └── AdminPanel.js                     # Updated with newsletter tab
```

## 🗄️ Database Schema

### NewsletterSubscribers Table
```javascript
{
  email: "user@example.com",           // Partition Key (String)
  firstName: "John",                   // String
  lastName: "Doe",                     // String
  isActive: true,                      // Boolean
  subscriptionDate: "2024-01-01T...",  // String (ISO date)
  preferences: {                       // Object
    events: true,
    stories: true,
    volunteerOpportunities: true,
    donationUpdates: true
  },
  updatedAt: "2024-01-01T..."          // String (ISO date)
}
```

### NewsletterSubscribers Table
```javascript
{
  email: "user@example.com",           // Partition Key (String)
  firstName: "John",                   // String
  lastName: "Doe",                     // String
  isActive: true,                      // Boolean
  subscriptionDate: "2024-01-01T...",  // String (ISO date)
  preferences: {                       // Object
    events: true,
    stories: true,
    volunteerOpportunities: true,
    donationUpdates: true
  },
  updatedAt: "2024-01-01T..."          // String (ISO date)
}
```

### NewsletterCampaigns Table
```javascript
{
  campaignId: "campaign_1234567890_abc123",  // Partition Key (String)
  title: "Monthly Newsletter",               // String
  subject: "Your Monthly Update",            // String
  content: "<h1>Newsletter Content</h1>",   // String (HTML)
  author: "Admin",                           // String
  status: "draft",                           // String (draft, scheduled, sent)
  scheduledDate: "2024-01-01T10:00:00Z",    // String (ISO date, optional)
  sentDate: "2024-01-01T10:00:00Z",         // String (ISO date, optional)
  targetAudience: "all",                     // String
  template: "default",                       // String
  metadata: {},                              // Object
  createdAt: "2024-01-01T...",              // String (ISO date)
  updatedAt: "2024-01-01T..."               // String (ISO date)
}
```

### Global Secondary Index (NewsletterSubscribers)
- **Name**: ActiveSubscribersIndex
- **Partition Key**: isActive (String)
- **Sort Key**: subscriptionDate (String)
- **Projection**: ALL

## 🧪 Testing

### Test Cases

1. **Valid Subscription**:
   ```bash
   curl -X POST http://localhost:3000/api/newsletter/subscribe \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "firstName": "John", "lastName": "Doe"}'
   ```

2. **Duplicate Subscription**:
   ```bash
   # Run the same command twice - second should return error
   ```

3. **Invalid Email**:
   ```bash
   curl -X POST http://localhost:3000/api/newsletter/subscribe \
     -H "Content-Type: application/json" \
     -d '{"email": "invalid-email"}'
   ```

4. **Unsubscribe**:
   ```bash
   curl -X POST http://localhost:3000/api/newsletter/unsubscribe \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com"}'
   ```

## 🚨 Troubleshooting

### Common Issues

1. **Table Creation Fails**:
   - Verify AWS credentials are set
   - Check DynamoDB permissions
   - Ensure region is correct (`us-west-2`)

2. **API Endpoints Not Found**:
   - Restart the backend server
   - Check that `newsletter.js` routes are imported in `server.js`

3. **Frontend Signup Not Working**:
   - Check browser console for errors
   - Verify backend is running on port 3000
   - Check CORS settings

4. **Admin Panel Not Loading**:
   - Verify `NewsletterManagement.js` is imported
   - Check that the "Newsletter" tab appears in navigation

### Error Messages

- **"Email already subscribed"**: Normal behavior for duplicate subscriptions
- **"Please enter a valid email address"**: Email format validation
- **"Failed to subscribe"**: Check backend server status

## 📈 Next Steps

### Potential Enhancements

1. **Email Service Integration**:
   - Integrate with AWS SES or SendGrid
   - Send welcome emails to new subscribers
   - Send newsletter campaigns

2. **Advanced Features**:
   - Email templates
   - Campaign management
   - Analytics and tracking
   - A/B testing

3. **User Preferences**:
   - Allow users to manage their preferences
   - Unsubscribe links in emails
   - Preference update forms

## ✅ Verification Checklist

- [ ] Newsletter table created in DynamoDB
- [ ] Backend routes responding correctly
- [ ] Frontend signup form functional
- [ ] Admin panel accessible
- [ ] Subscriber management working
- [ ] Export functionality working
- [ ] Search and filter working
- [ ] Bulk operations working

## 🎉 Success!

Your newsletter system is now fully functional! Users can subscribe through the footer, and you can manage subscribers through the admin panel.

For any issues or questions, check the troubleshooting section above or review the console logs for detailed error messages. 