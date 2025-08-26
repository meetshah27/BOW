# Founder Media Management Setup Guide

## Overview
The Founder Media Management system allows administrators to upload and manage photos/videos for Deepali Sane's founder section on the About page. This system integrates with AWS S3 for file storage and DynamoDB for metadata persistence.

## What's Been Implemented

### 1. Backend Infrastructure
- ✅ **S3 Configuration**: Added `founders` folder to S3 bucket structure
- ✅ **Upload Route**: New `/api/upload/founder` endpoint for file uploads
- ✅ **API Routes**: Enhanced `/api/founder-media` GET and PUT endpoints
- ✅ **DynamoDB Integration**: Updated Founder model with media fields
- ✅ **Error Handling**: Comprehensive error handling and fallback modes

### 2. Frontend Components
- ✅ **FounderMediaManagement**: Complete admin interface for managing founder media
- ✅ **AboutPage Integration**: Dynamic display of founder media
- ✅ **Admin Panel Integration**: Added to main admin navigation

### 3. Media Fields Supported
- `mediaType`: 'image' or 'video'
- `mediaUrl`: S3 URL of the uploaded media
- `thumbnailUrl`: Thumbnail URL (same as mediaUrl for now)
- `title`: Media title/heading
- `description`: Media description
- `altText`: Alt text for accessibility
- `isActive`: Whether to display the media
- `overlayOpacity`: Overlay opacity for text readability

## How to Use

### 1. Start the Backend
```bash
cd bow-backend
npm run start-stable
```

### 2. Access Admin Panel
1. Go to your website's admin panel
2. Navigate to "Founder Media" in the sidebar
3. You'll see the Founder Media Management interface

### 3. Upload Media
1. **Select File**: Click "Choose File" and select an image or video
2. **File Types Supported**: JPEG, PNG, GIF, WebP, MP4, MOV, AVI, WebM
3. **File Size Limit**: 50MB maximum
4. **Upload**: Click "Upload Media" to upload to S3

### 4. Configure Media Settings
1. **Title**: Enter a descriptive title
2. **Description**: Add detailed description
3. **Alt Text**: Provide accessibility text
4. **Overlay Opacity**: Adjust text overlay (0.0 to 1.0)
5. **Active Status**: Toggle media visibility

### 5. Save Changes
1. Click "Save Founder Media" to persist to DynamoDB
2. Changes will immediately appear on the About page

## Testing the System

### Test API Endpoints
```bash
# Test founder media API
npm run test-founder-media

# Test file upload functionality
npm run test-founder-upload
```

### Manual Testing
1. **Upload Test**: Try uploading a small image file
2. **Save Test**: Save media data and verify persistence
3. **Display Test**: Check if media appears on About page
4. **Toggle Test**: Test active/inactive status

## Troubleshooting

### Common Issues

#### 1. Upload Fails
- **Check**: S3 bucket permissions and credentials
- **Verify**: `.env` file has correct AWS settings
- **Test**: Run `npm run test-founder-upload`

#### 2. Media Not Displaying
- **Check**: Media is marked as active
- **Verify**: S3 URL is accessible
- **Test**: Run `npm run test-founder-media`

#### 3. DynamoDB Errors
- **Check**: AWS credentials and region
- **Verify**: DynamoDB table exists and is accessible
- **Test**: Check backend logs for specific errors

### Debug Commands
```bash
# Check backend health
curl http://localhost:3000/health

# Test founder media API
curl http://localhost:3000/api/founder-media

# Check S3 configuration
curl http://localhost:3000/api/upload/config
```

## File Structure

```
bow-backend/
├── config/
│   ├── s3.js (updated with founders folder)
│   └── dynamodb.js (FOUNDERS table configured)
├── models-dynamodb/
│   └── Founder.js (enhanced with media fields)
├── routes/
│   ├── index.js (founder media API routes)
│   └── upload.js (founder upload endpoint)
└── test-founder-media.js (API testing)
```

## S3 Bucket Structure

```
bow-media-bucket/
├── events/
├── gallery/
├── profiles/
├── sponsors/
├── stories/
└── founders/          ← New folder for founder media
    ├── timestamp_random_filename.jpg
    └── timestamp_random_filename.mp4
```

## DynamoDB Schema

The `bow-founders` table now supports these additional fields:
- `mediaType` (String)
- `mediaUrl` (String)
- `thumbnailUrl` (String)
- `mediaTitle` (String)
- `mediaDescription` (String)
- `mediaAltText` (String)
- `isMediaActive` (Boolean)
- `mediaOverlayOpacity` (Number)

## Security Considerations

- ✅ **File Type Validation**: Only allows image/video files
- ✅ **File Size Limits**: 50MB maximum per file
- ✅ **Admin Access**: Only authenticated admins can upload
- ✅ **S3 Security**: Files stored in private S3 bucket
- ✅ **Input Sanitization**: All user inputs are validated

## Performance Features

- ✅ **Connection Pooling**: AWS SDK connection management
- ✅ **Retry Logic**: Automatic retry on failures
- ✅ **Keep-Alive**: Persistent connections for stability
- ✅ **Async Processing**: Non-blocking file uploads
- ✅ **Error Recovery**: Graceful fallback modes

## Next Steps

1. **Test the System**: Run the test scripts to verify functionality
2. **Upload Media**: Use the admin panel to upload founder media
3. **Customize Display**: Adjust overlay opacity and text settings
4. **Monitor Performance**: Check backend logs for any issues
5. **Scale as Needed**: Add more founders or enhance media features

## Support

If you encounter any issues:
1. Check the backend logs for error messages
2. Run the test scripts to isolate problems
3. Verify AWS credentials and permissions
4. Check S3 bucket and DynamoDB table access

The system is designed to be robust and will fall back to default behavior if any component fails, ensuring your website remains functional.
