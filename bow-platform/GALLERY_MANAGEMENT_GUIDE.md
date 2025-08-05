# Gallery Management Guide

## Overview

The Gallery Management system provides comprehensive CRUD (Create, Read, Update, Delete) functionality for managing photos and videos in the BOW platform. This guide covers both the admin interface and the public gallery display.

## Features

### Admin Panel Gallery Manager

#### 1. **Upload Media**
- **Location**: Admin Panel → Gallery Manager
- **Functionality**: 
  - Upload multiple images and videos simultaneously
  - Set title, description, and album for all uploaded files
  - Preview uploaded files before saving
  - Automatic file type detection (image/video)
  - S3 integration for file storage

#### 2. **View and Manage Gallery Items**
- **Grid Display**: Shows all gallery items with thumbnails
- **Search**: Filter items by title, description, or album
- **Album Filter**: Filter by specific albums
- **Item Information**: Displays title, description, album, and creation date
- **Media Type Badge**: Visual indicator for images vs videos

#### 3. **Edit Gallery Items**
- **Edit Modal**: Click the edit icon (pencil) on any gallery item
- **Editable Fields**:
  - Title
  - Description
  - Album
- **Preview**: Shows current image and URL
- **Real-time Updates**: Changes are immediately reflected in the gallery

#### 4. **Delete Gallery Items**
- **Confirmation Dialog**: Prevents accidental deletions
- **S3 Cleanup**: Automatically removes files from S3 storage
- **Database Cleanup**: Removes item from DynamoDB

### Public Gallery Page

#### 1. **Gallery Display**
- **Responsive Grid**: Adapts to different screen sizes
- **Category Filtering**: Filter by event types
- **Search Functionality**: Search across titles, descriptions, and tags
- **Media Type Indicators**: Visual badges for images and videos

#### 2. **Interactive Features**
- **Like System**: Users can like/favorite items
- **Share Functionality**: Share items on social media
- **Download**: Download images and videos
- **Modal View**: Full-screen view with detailed information

#### 3. **User Experience**
- **Loading States**: Smooth loading indicators
- **Error Handling**: Graceful fallbacks for failed images
- **Empty States**: Helpful messages when no items are found

## Technical Implementation

### Backend API Endpoints

```javascript
// Gallery Routes (bow-backend/routes/gallery.js)
GET    /api/gallery          // Get all gallery items
GET    /api/gallery/:id      // Get specific gallery item
POST   /api/gallery          // Create new gallery item
PUT    /api/gallery/:id      // Update gallery item
DELETE /api/gallery/:id      // Delete gallery item
```

### Database Schema

```javascript
// Gallery Item Structure
{
  id: "uuid",
  title: "string",
  description: "string", 
  album: "string",
  imageUrl: "string (S3 URL)",
  type: "image|video",
  createdAt: "ISO date string",
  updatedAt: "ISO date string"
}
```

### Frontend Components

#### 1. **AdminPanel.js - GalleryManager Component**
- **State Management**: Uses React hooks for local state
- **API Integration**: Uses centralized `api` utility
- **File Upload**: Integrates with `FileUpload` component
- **Modal Management**: Handles upload and edit modals

#### 2. **GalleryPage.js**
- **Public Display**: Shows gallery items to visitors
- **Filtering**: Client-side search and category filtering
- **Interactive Features**: Like, share, download functionality

#### 3. **FileUpload.js**
- **Drag & Drop**: Uses react-dropzone
- **S3 Integration**: Handles file uploads to S3
- **Progress Tracking**: Shows upload progress
- **Error Handling**: Graceful error management

### API Configuration

The system uses a centralized API configuration (`src/config/api.js`) that automatically switches between development and production environments:

```javascript
// Development
baseURL: 'http://localhost:3000'
apiPath: '/api'

// Production  
baseURL: 'https://z1rt2gxnei.execute-api.us-west-2.amazonaws.com/default/bow-backend-clean'
apiPath: ''
```

## Usage Instructions

### For Administrators

#### Uploading New Media
1. Navigate to Admin Panel → Gallery Manager
2. Click "Upload Media" button
3. Drag and drop files or click to select
4. Fill in title, description, and album information
5. Click "Save to Gallery"

#### Editing Existing Items
1. Find the item in the gallery grid
2. Click the edit icon (pencil)
3. Modify title, description, or album
4. Click "Save Changes"

#### Deleting Items
1. Find the item in the gallery grid
2. Click the delete icon (trash)
3. Confirm deletion in the dialog

#### Managing Albums
- Albums are automatically created based on the "album" field
- Use the album filter to view items by album
- Edit individual items to change their album

### For Users

#### Browsing the Gallery
1. Visit the Gallery page
2. Use search to find specific items
3. Use category filters to narrow results
4. Click on items to view full details

#### Interacting with Items
- **Like**: Click the heart icon to favorite items
- **Share**: Click share icon to share on social media
- **Download**: Click download icon to save files
- **View**: Click on items to open full-screen modal

## Error Handling

### Image Loading Errors
- **Fallback Images**: Uses SVG placeholder for failed images
- **Error Logging**: Console errors for debugging
- **User Feedback**: Toast notifications for errors

### Upload Errors
- **File Validation**: Checks file type and size
- **Network Errors**: Retry mechanisms for failed uploads
- **S3 Errors**: Proper error messages for storage issues

### API Errors
- **Response Validation**: Checks API response status
- **User Notifications**: Toast messages for success/error
- **Graceful Degradation**: Continues working even if some features fail

## Security Considerations

### File Upload Security
- **File Type Validation**: Only allows images and videos
- **File Size Limits**: Prevents oversized uploads
- **S3 Security**: Files stored in secure S3 bucket

### Access Control
- **Admin Only**: Upload/edit/delete restricted to admin users
- **Public Read**: Gallery viewing available to all users
- **API Protection**: Backend validates all requests

## Performance Optimizations

### Image Optimization
- **Thumbnails**: Uses appropriate image sizes for grid display
- **Lazy Loading**: Images load as needed
- **Caching**: Browser caching for static assets

### API Optimization
- **Batch Operations**: Handles multiple uploads efficiently
- **Pagination**: Ready for future pagination implementation
- **Caching**: Client-side caching of gallery data

## Troubleshooting

### Common Issues

#### Images Not Loading
1. Check S3 bucket permissions
2. Verify image URLs are correct
3. Check CORS configuration
4. Ensure bucket is publicly accessible

#### Upload Failures
1. Check file size limits
2. Verify file type is supported
3. Check network connectivity
4. Verify S3 credentials

#### Edit/Delete Not Working
1. Check admin permissions
2. Verify API endpoints are accessible
3. Check browser console for errors
4. Ensure proper authentication

### Debug Information
- **Console Logs**: Check browser console for detailed errors
- **Network Tab**: Monitor API requests in browser dev tools
- **S3 Console**: Check file uploads in AWS S3 console
- **DynamoDB Console**: Verify data in AWS DynamoDB console

## Future Enhancements

### Planned Features
- **Bulk Operations**: Select multiple items for batch actions
- **Advanced Filtering**: Date ranges, file types, etc.
- **Image Cropping**: Built-in image editing tools
- **Album Management**: Create/edit/delete albums separately
- **Analytics**: Track views, likes, downloads
- **CDN Integration**: Faster image delivery
- **Video Thumbnails**: Auto-generated video previews

### Technical Improvements
- **Pagination**: Handle large galleries efficiently
- **Image Compression**: Automatic image optimization
- **Progressive Loading**: Better loading experience
- **Offline Support**: Cache gallery for offline viewing
- **Real-time Updates**: WebSocket integration for live updates

## Support

For technical support or questions about the gallery management system:
1. Check this documentation first
2. Review browser console for error messages
3. Verify AWS S3 and DynamoDB configurations
4. Contact the development team with specific error details 