# Stories Functionality Guide

## Overview

The Stories functionality has been enhanced to support media uploads (images and videos) with a comprehensive admin panel and beautiful public display page. Stories can now include:

- **Images**: Story cover images and author profile pictures
- **Videos**: Story videos (MP4, MOV, AVI, WebM formats)
- **Rich Content**: Title, author, excerpt, full content, tags, and categories
- **Featured Stories**: Mark important stories as featured
- **Categories**: Organize stories by type (Community, Education, Music, Volunteer, Personal)

## Features

### 🎯 Admin Panel Features
- **Add New Stories**: Complete form with media uploads
- **Edit Existing Stories**: Modify any story content and media
- **Delete Stories**: Remove stories with confirmation
- **Media Management**: Upload images and videos directly to S3
- **Category Management**: Organize stories by type
- **Featured Stories**: Mark stories as featured for prominence

### 🌟 Public Display Features
- **Responsive Grid Layout**: Beautiful card-based display
- **Media Support**: Images and videos with proper fallbacks
- **Search & Filtering**: Find stories by content, author, or tags
- **Category Filtering**: Browse stories by category
- **Pagination**: Navigate through large numbers of stories
- **Featured Stories**: Highlighted featured content
- **Detailed View**: Full story pages with media and content

## File Structure

```
bow-platform/src/
├── pages/
│   ├── PeopleStoriesPage.js     # Main stories listing page
│   └── StoryDetailsPage.js      # Individual story detail page
├── components/admin/
│   └── StoriesManagement.js     # Admin panel for managing stories
└── config/
    └── api.js                   # API configuration for uploads

bow-backend/
├── routes/
│   ├── stories.js               # Stories API endpoints
│   └── upload.js                # File upload endpoints (including /story)
├── models-dynamodb/
│   └── Story.js                 # Story data model
└── config/
    └── s3.js                    # S3 configuration for media storage
```

## Usage

### For Administrators

#### 1. Access Stories Management
- Navigate to the Admin Panel
- Click on "Stories" section
- Use the "Add New Story" button to create stories

#### 2. Creating a New Story
1. **Basic Information**
   - Title (required)
   - Author (required)
   - Category (dropdown selection)
   - Featured checkbox (optional)

2. **Content**
   - Excerpt (brief summary)
   - Full content (required)
   - Tags (comma-separated)

3. **Media Uploads**
   - **Story Image**: Upload a cover image
   - **Story Video**: Upload a video (optional)
   - **Author Image**: Upload author profile picture (optional)

#### 3. Managing Stories
- **Edit**: Click the edit icon to modify any story
- **Delete**: Click the delete icon to remove stories
- **View**: Stories automatically appear on the public page

### For Users

#### 1. Viewing Stories
- Navigate to `/stories` to see all stories
- Use search bar to find specific content
- Filter by category using the category buttons
- Click on any story card to read the full story

#### 2. Story Details
- Full story content with proper formatting
- Media display (images/videos)
- Author information and date
- Tags and category information
- Navigation back to stories list

## Technical Details

### Backend API Endpoints

#### Stories
- `GET /api/stories` - Get all stories
- `GET /api/stories/:id` - Get specific story
- `POST /api/stories` - Create new story
- `PUT /api/stories/:id` - Update story
- `DELETE /api/stories/:id` - Delete story

#### File Uploads
- `POST /api/upload/story` - Upload story media (images/videos)
- Supports: JPEG, PNG, GIF, WebP, MP4, MOV, AVI, WebM
- File size limit: 50MB
- Files stored in S3 `stories` folder

### Data Model

```javascript
{
  id: "uuid",
  title: "Story Title",
  author: "Author Name",
  authorImage: "https://s3-url/author-image.jpg",
  category: "Community",
  image: "https://s3-url/story-image.jpg",
  video: "https://s3-url/story-video.mp4", // optional
  excerpt: "Brief story summary",
  content: "Full story content...",
  date: "2024-01-15",
  tags: ["community", "music", "volunteer"],
  featured: false,
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z"
}
```

### S3 Storage

- **Bucket**: Configured in `bow-backend/config/s3.js`
- **Folder**: `stories/` for all story media
- **File Naming**: `timestamp_randomstring_originalname.ext`
- **Access**: Public read access for media files

## Styling

The stories functionality uses Tailwind CSS classes and custom CSS:

- **Responsive Design**: Mobile-first approach
- **Card Layout**: Modern card-based design with hover effects
- **Color Scheme**: Primary/secondary color palette
- **Animations**: Smooth transitions and hover effects
- **Typography**: Consistent font hierarchy and spacing

## Testing

### Manual Testing
1. **Admin Panel**: Create, edit, and delete stories
2. **Media Uploads**: Test image and video uploads
3. **Public Display**: Verify stories appear correctly
4. **Search & Filtering**: Test search and category filters
5. **Responsive Design**: Test on different screen sizes

### Automated Testing
Use the test script: `bow-platform/test-stories.js`
- Run in browser console on stories page
- Tests API endpoints, components, and functionality
- Provides detailed feedback on test results

## Troubleshooting

### Common Issues

#### 1. Upload Failures
- Check file size (max 50MB)
- Verify file format (images: jpg, png, gif, webp; videos: mp4, mov, avi, webm)
- Ensure S3 credentials are configured correctly

#### 2. Stories Not Loading
- Check backend server is running
- Verify API endpoints are accessible
- Check browser console for errors

#### 3. Media Not Displaying
- Verify S3 bucket permissions
- Check file URLs in story data
- Ensure media files were uploaded successfully

### Debug Steps
1. Check browser console for JavaScript errors
2. Verify network requests in browser dev tools
3. Check backend server logs for API errors
4. Test S3 connectivity and permissions

## Future Enhancements

### Planned Features
- **Rich Text Editor**: WYSIWYG content editing
- **Media Gallery**: Multiple images per story
- **Social Sharing**: Share stories on social media
- **Comments System**: User comments on stories
- **Analytics**: Story view and engagement metrics
- **SEO Optimization**: Meta tags and structured data

### Technical Improvements
- **Image Optimization**: Automatic resizing and compression
- **Video Processing**: Thumbnail generation and format conversion
- **Caching**: Redis caching for improved performance
- **CDN Integration**: Global content delivery network

## Support

For technical support or questions about the stories functionality:

1. Check this documentation first
2. Review the test script output
3. Check browser console and network logs
4. Verify backend server status and logs
5. Contact the development team with specific error details

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Compatibility**: React 18+, Node.js 16+, AWS S3
