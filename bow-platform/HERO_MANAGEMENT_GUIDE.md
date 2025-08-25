# Hero Section Management Guide

## Overview
The Hero Section Management feature allows administrators to dynamically customize the homepage hero section through the admin panel. This includes changing background images/videos, text content, overlay opacity, and more.

## Features

### 🎨 **Dynamic Backgrounds**
- **Image Backgrounds**: Upload and manage hero background images
- **Video Backgrounds**: Support for video backgrounds with autoplay and loop
- **S3 Integration**: Files are stored in your S3 bucket for reliable delivery

### 📝 **Customizable Content**
- **Hero Title**: Main headline (e.g., "Empowering Communities")
- **Hero Subtitle**: Secondary headline (e.g., "Through Music")
- **Description**: Detailed description text below the headlines
- **Content Preview**: Live preview of how changes will look

### ⚙️ **Advanced Settings**
- **Overlay Opacity**: Adjust the dark overlay opacity (0-100%)
- **Background Type**: Switch between image and video backgrounds
- **Active Toggle**: Enable/disable the hero section entirely
- **Real-time Preview**: See changes before saving

## How to Use

### 1. **Access Hero Management**
1. Log into the admin panel
2. Navigate to **Hero** in the left sidebar
3. You'll see the Hero Management interface

### 2. **Upload Background Media**
1. Choose **Background Type** (Image or Video)
2. Click **Upload** to select a file from your computer
3. Supported formats:
   - **Images**: JPG, PNG, GIF, WebP
   - **Videos**: MP4, WebM, MOV
4. Files are automatically uploaded to S3

### 3. **Customize Content**
1. **Hero Title**: Enter your main headline
2. **Hero Subtitle**: Enter your secondary headline
3. **Description**: Write your hero description
4. **Overlay Opacity**: Use the slider to adjust overlay darkness

### 4. **Preview and Save**
1. Click **Show Preview** to see live preview
2. Make adjustments as needed
3. Click **Save Changes** to apply updates
4. Changes appear immediately on the homepage

## Technical Implementation

### Backend Components
- **API Endpoints**: `/api/hero` (GET, PUT)
- **DynamoDB Model**: `Hero` model for persistent storage
- **S3 Integration**: File upload and storage
- **Fallback System**: Graceful degradation if DynamoDB unavailable

### Frontend Components
- **HeroManagement**: Admin interface component
- **HomePage**: Dynamic hero display
- **FileUpload**: S3 file upload component
- **Real-time Preview**: Live preview system

### Database Schema
```javascript
{
  id: 'hero-settings',
  backgroundType: 'image' | 'video',
  backgroundUrl: 'string',
  overlayOpacity: 0.2,
  title: 'string',
  subtitle: 'string',
  description: 'string',
  isActive: boolean,
  updatedAt: 'ISO date string'
}
```

## Setup Instructions

### 1. **Create DynamoDB Table**
```bash
cd bow-backend
node create-hero-table.js
```

### 2. **Verify S3 Configuration**
Ensure your S3 bucket is properly configured in:
- `bow-backend/config/s3.js`
- Environment variables

### 3. **Test the Feature**
1. Start your backend server
2. Start your frontend application
3. Log into admin panel
4. Navigate to Hero section
5. Upload a test image and customize content

## Best Practices

### 🖼️ **Image Optimization**
- **Recommended Size**: 1920x1080px or larger
- **Format**: JPG for photos, PNG for graphics with transparency
- **File Size**: Keep under 5MB for fast loading
- **Aspect Ratio**: 16:9 or wider for best results

### 🎥 **Video Optimization**
- **Duration**: 10-30 seconds for best user experience
- **Format**: MP4 with H.264 encoding
- **File Size**: Keep under 20MB
- **Quality**: 720p minimum, 1080p recommended

### 📱 **Content Guidelines**
- **Title**: Keep under 25 characters
- **Subtitle**: Keep under 20 characters
- **Description**: Keep under 150 characters
- **Readability**: Ensure text is readable over any background

## Troubleshooting

### Common Issues

#### **Background Not Displaying**
- Check if file uploaded successfully to S3
- Verify S3 bucket permissions
- Check browser console for errors

#### **Changes Not Saving**
- Verify DynamoDB table exists
- Check backend server logs
- Ensure admin permissions

#### **Preview Not Working**
- Check if file format is supported
- Verify file size limits
- Check browser console for errors

### **Debug Steps**
1. Check browser console for JavaScript errors
2. Check backend server logs
3. Verify DynamoDB table status
4. Test S3 file access
5. Check network requests in browser dev tools

## File Structure
```
bow-platform/
├── src/
│   ├── components/
│   │   └── admin/
│   │       └── HeroManagement.js    # Admin interface
│   └── pages/
│       └── HomePage.js              # Dynamic hero display
└── bow-backend/
    ├── models-dynamodb/
    │   └── Hero.js                  # Database model
    ├── routes/
    │   └── index.js                 # API endpoints
    ├── config/
    │   └── dynamodb.js              # Table configuration
    └── create-hero-table.js         # Table creation script
```

## Future Enhancements

### **Planned Features**
- **Multiple Hero Variations**: A/B testing different hero layouts
- **Scheduled Changes**: Automatically change hero content on specific dates
- **Analytics**: Track hero performance and engagement
- **Mobile Optimization**: Different hero layouts for mobile devices
- **Animation Controls**: Customize entrance animations

### **Integration Opportunities**
- **CMS Integration**: Connect with external content management systems
- **API Webhooks**: Notify external services of hero changes
- **Multi-language Support**: Localized hero content
- **Personalization**: User-specific hero content based on preferences

## Support

If you encounter issues or need assistance:
1. Check this guide first
2. Review browser console and server logs
3. Verify all setup steps are completed
4. Test with different file types and sizes
5. Contact the development team with specific error messages

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Compatibility**: React 18+, Node.js 16+, DynamoDB
