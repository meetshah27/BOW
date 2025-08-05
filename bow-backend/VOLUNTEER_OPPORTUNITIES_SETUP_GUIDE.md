# Volunteer Opportunities Management System Setup Guide

## 🚀 Overview

This guide will help you set up the volunteer opportunities management system for your BOW application. This system allows you to create, edit, and manage volunteer opportunities that appear on the "Get Involved" page.

## 📋 Prerequisites

1. **AWS Account**: You need an AWS account with DynamoDB access
2. **AWS Credentials**: Configure your AWS credentials
3. **Node.js**: Ensure Node.js is installed

## 🔧 Step 1: Create DynamoDB Table

### Create the VolunteerOpportunities table
Run this command in your `bow-backend` directory:

```bash
node create-volunteer-opportunities-table.js
```

This will create the `VolunteerOpportunities` table with:
- **Partition Key**: `opportunityId` (String)
- **GSI 1**: `CategoryIndex` (category + opportunityId)
- **GSI 2**: `ActiveOpportunitiesIndex` (isActive + createdAt)

## 🌱 Step 2: Seed Initial Opportunities

### Add sample volunteer opportunities
Run this command to add initial opportunities:

```bash
node seed-volunteer-opportunities.js
```

This will create 6 sample opportunities including:
- Event Coordinator
- Music Workshop Assistant
- Community Outreach Specialist
- Technical Support
- **LED Light Setup Coordinator** (as requested!)
- Fundraising Coordinator

## 🎯 Step 3: Features Overview

### What You Can Do:

1. **Create New Opportunities**: Add custom volunteer positions
2. **Edit Existing Opportunities**: Update details, requirements, benefits
3. **Activate/Deactivate**: Show/hide opportunities from the public page
4. **Manage Categories**: Organize opportunities by type
5. **Set Volunteer Limits**: Control how many people can apply
6. **Track Applications**: See how many people have applied

### Admin Panel Access:
- Go to **Admin Panel** → **Volunteer Opportunities**
- Add, edit, delete, and manage all opportunities

## 📧 Step 4: How to Add "LED Light Setup" (Example)

1. **Go to Admin Panel** → **Volunteer Opportunities**
2. **Click "Add Opportunity"**
3. **Fill in the details:**
   - **Title**: "LED Light Setup Coordinator"
   - **Category**: "Technical"
   - **Location**: "Seattle Area"
   - **Time Commitment**: "3-6 hours per event"
   - **Description**: "Help set up and manage LED lighting systems for our events and performances."
   - **Requirements**: 
     - Experience with LED lighting systems
     - Basic electrical knowledge
     - Available for evening events
   - **Benefits**:
     - Technical lighting experience
     - Event production skills
     - Creative expression
4. **Click "Create Opportunity"**

## 🔌 Step 5: API Endpoints

### Admin Endpoints (for managing opportunities)
- `GET /api/volunteer-opportunities/opportunities` - Get all opportunities
- `POST /api/volunteer-opportunities/opportunities` - Create new opportunity
- `PUT /api/volunteer-opportunities/opportunities/:id` - Update opportunity
- `DELETE /api/volunteer-opportunities/opportunities/:id` - Delete opportunity
- `PATCH /api/volunteer-opportunities/opportunities/:id/toggle` - Toggle active status

### Public Endpoints (for the website)
- `GET /api/volunteer-opportunities/opportunities/active` - Get active opportunities
- `GET /api/volunteer-opportunities/opportunities/:id` - Get specific opportunity

## 🎨 Step 6: Frontend Integration

### Get Involved Page
The "Get Involved" page now automatically fetches opportunities from the database and displays them with:
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive design
- ✅ Apply functionality

### Admin Panel
The admin panel includes a new "Volunteer Opportunities" section with:
- ✅ Opportunity management interface
- ✅ Add/Edit/Delete functionality
- ✅ Active/Inactive toggle
- ✅ Category management

## 📁 Step 7: File Structure

```
bow-backend/
├── models-dynamodb/
│   └── VolunteerOpportunity.js          # Database model
├── routes/
│   └── volunteer-opportunities.js       # API routes
├── create-volunteer-opportunities-table.js # Table creation
├── seed-volunteer-opportunities.js      # Initial data
└── server.js                           # Updated with new routes

bow-platform/src/
├── components/admin/
│   └── VolunteerOpportunityManager.js   # Admin interface
├── pages/
│   ├── AdminPanel.js                    # Updated with new tab
│   └── GetInvolvedPage.js               # Updated to fetch from API
```

## 🧪 Step 8: Testing

### Test the System
1. **Start your servers:**
   ```bash
   # Backend
   cd bow-backend
   npm start
   
   # Frontend
   cd bow-platform
   npm start
   ```

2. **Test Admin Panel:**
   - Go to Admin Panel → Volunteer Opportunities
   - Try creating a new opportunity
   - Edit an existing opportunity
   - Toggle active/inactive status

3. **Test Public Page:**
   - Go to Get Involved page
   - Verify opportunities are displayed
   - Test the apply functionality

## 🔍 Troubleshooting

### Common Issues:

**Table Creation Fails:**
- Check AWS credentials in `.env` file
- Ensure region is set to `us-west-2`
- Verify DynamoDB permissions

**Opportunities Not Showing:**
- Check if opportunities are marked as "Active"
- Verify API endpoints are working
- Check browser console for errors

**Admin Panel Not Working:**
- Ensure backend server is running
- Check API routes are properly configured
- Verify CORS settings

## 🎉 Success!

Once completed, you'll have:
- ✅ Editable volunteer opportunities
- ✅ Admin management interface
- ✅ Public display on Get Involved page
- ✅ Ability to add custom opportunities like "LED Light Setup"
- ✅ Full CRUD operations for opportunities

## 💡 Tips for Adding New Opportunities

1. **Be Specific**: Clear titles and descriptions work best
2. **Set Realistic Requirements**: Don't over-qualify positions
3. **Highlight Benefits**: What will volunteers gain?
4. **Use Categories**: Helps organize and filter opportunities
5. **Set Volunteer Limits**: Prevents overwhelming popular positions

The volunteer opportunities system is now fully functional and ready to use! 