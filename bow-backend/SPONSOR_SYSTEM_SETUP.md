# Sponsor Management System Setup Guide

## 🚀 Overview

This guide will help you set up the dynamic sponsor management system for the BOW (Beats of Washington) application. The system allows administrators to upload sponsor logos to S3 and manage them through a web interface, while maintaining the same moving animation layout on the home page.

## 📋 Prerequisites

1. **AWS Account**: You need an AWS account with DynamoDB and S3 access
2. **Backend Running**: The BOW backend server should be running
3. **Frontend Running**: The BOW frontend should be running
4. **Admin Access**: You need admin access to the BOW platform

## 🔧 Step 1: Create DynamoDB Table

First, create the sponsors table in DynamoDB:

```bash
cd bow-backend
node create-sponsors-table.js
```

This will create the `bow-sponsors` table with the following structure:
- **Primary Key**: `id` (String)
- **Global Secondary Index**: `active-index` on `isActive` field
- **Fields**: name, logoUrl, website, description, isActive, createdAt, updatedAt

## 🌱 Step 2: Seed Initial Data (Optional)

If you want to populate the table with initial sponsor data:

```bash
node seed-sponsors.js
```

This will add sample sponsors with placeholder S3 URLs.

## 🧪 Step 3: Test the System

Run the comprehensive test suite:

```bash
node test-sponsor-system.js
```

This will test all CRUD operations and verify the system is working correctly.

## 🎯 Step 4: Access Admin Panel

1. Navigate to your BOW frontend application
2. Go to the admin panel (usually `/admin`)
3. Look for the "Sponsors" tab in the navigation menu
4. Click on "Sponsors" to access the sponsor management interface

## 📤 Step 5: Upload Sponsor Logos

### Using the Admin Panel:

1. Click "Add Sponsor" button
2. Fill in the sponsor details:
   - **Name**: Sponsor company name
   - **Logo**: Upload image file (PNG, JPG, etc.)
   - **Website**: Optional website URL
   - **Description**: Optional description
3. Click "Create Sponsor"

### Supported File Types:
- Images: PNG, JPG, JPEG, GIF, WebP, AVIF
- Maximum file size: 5MB
- Recommended dimensions: 200x100px or similar aspect ratio

## 🔄 Step 6: Manage Sponsors

### Available Actions:
- **View**: See all sponsors in a grid layout
- **Edit**: Update sponsor information
- **Toggle Status**: Activate/deactivate sponsors
- **Delete**: Remove sponsors permanently

### Status Management:
- **Active**: Sponsors appear on the home page
- **Inactive**: Sponsors are hidden from the home page

## 🏠 Step 7: View on Home Page

The sponsors will automatically appear on the home page with:
- **Moving Animation**: Continuous horizontal scroll
- **Responsive Design**: Adapts to different screen sizes
- **Error Handling**: Shows sponsor name if logo fails to load
- **Loading State**: Shows loading spinner while fetching data

## 🔧 API Endpoints

The system provides the following API endpoints:

### Public Endpoints:
- `GET /api/sponsors` - Get all active sponsors

### Admin Endpoints:
- `GET /api/sponsors/admin` - Get all sponsors (including inactive)
- `POST /api/sponsors` - Create new sponsor
- `GET /api/sponsors/:id` - Get sponsor by ID
- `PUT /api/sponsors/:id` - Update sponsor
- `DELETE /api/sponsors/:id` - Delete sponsor
- `PATCH /api/sponsors/:id/toggle` - Toggle sponsor status

### Upload Endpoints:
- `POST /api/upload/sponsor` - Upload sponsor logo to S3

## 🗂️ S3 Structure

Sponsor logos are stored in S3 with the following structure:
```
bow-platform/
└── sponsors/
    ├── sponsor-1-logo.png
    ├── sponsor-2-logo.jpg
    └── ...
```

## 🎨 Customization

### CSS Classes:
- `.sponsor-section` - Main sponsor section container
- `.sponsor-card` - Individual sponsor card
- `.sponsor-logo` - Sponsor logo image
- `.animate-sponsor-scroll` - Moving animation class

### Animation Settings:
The sponsor scroll animation can be customized in `index.css`:
```css
.animate-sponsor-scroll {
  animation: sponsor-scroll 30s linear infinite;
}

@keyframes sponsor-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

## 🐛 Troubleshooting

### Common Issues:

#### 1. Sponsors not appearing on home page
- Check if sponsors are marked as active
- Verify API endpoint is working: `GET /api/sponsors`
- Check browser console for errors

#### 2. Logo upload fails
- Verify S3 credentials are configured
- Check file size (must be under 5MB)
- Ensure file type is supported

#### 3. Admin panel not accessible
- Verify you have admin privileges
- Check if the sponsors route is properly configured
- Ensure the SponsorManagement component is imported

#### 4. Database connection issues
- Verify DynamoDB table exists
- Check AWS credentials
- Ensure region is set correctly (us-west-2)

### Debug Steps:

1. **Check Backend Logs**:
   ```bash
   cd bow-backend
   npm start
   ```

2. **Test API Endpoints**:
   ```bash
   curl http://localhost:3000/api/sponsors
   ```

3. **Check Frontend Console**:
   Open browser developer tools and check for JavaScript errors

4. **Verify S3 Access**:
   Check if files are being uploaded to the correct S3 bucket

## 📊 Monitoring

### Key Metrics to Monitor:
- Number of active sponsors
- Upload success rate
- API response times
- S3 storage usage

### Logs to Watch:
- Sponsor creation/update/deletion
- Upload success/failure
- API errors
- Database connection issues

## 🔒 Security Considerations

1. **File Upload Validation**: Only image files are allowed
2. **File Size Limits**: 5MB maximum per file
3. **Admin Access**: Only authenticated admins can manage sponsors
4. **S3 Permissions**: Proper bucket policies for public read access
5. **Input Sanitization**: All text inputs are sanitized

## 🚀 Deployment

### Production Checklist:
- [ ] DynamoDB table created
- [ ] S3 bucket configured with proper permissions
- [ ] Environment variables set
- [ ] Admin panel accessible
- [ ] Sponsors displaying on home page
- [ ] Upload functionality working
- [ ] Error handling in place

### Environment Variables:
```env
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=bow-platform
```

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the test results from `test-sponsor-system.js`
3. Check backend and frontend logs
4. Verify AWS credentials and permissions

## 🎉 Success!

Once everything is set up, you should be able to:
- ✅ Upload sponsor logos through the admin panel
- ✅ Manage sponsor information
- ✅ See sponsors moving on the home page
- ✅ Toggle sponsor visibility
- ✅ Handle errors gracefully

The sponsor section will now be completely dynamic and manageable through the admin interface!
