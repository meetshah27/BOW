# S3 Setup Guide for BOW Application

## 🚀 Overview

This guide will help you set up AWS S3 for file storage in your BOW (Beats of Washington) application. S3 will be used for storing images, videos, and other media files.

## 📋 Prerequisites

1. **AWS Account**: You need an AWS account with S3 access
2. **AWS Credentials**: Configure your AWS credentials (same as DynamoDB setup)
3. **S3 Bucket**: Create an S3 bucket for media storage

## 🔧 Step 1: Create S3 Bucket

### Via AWS Console
1. Go to AWS S3 Console
2. Click "Create bucket"
3. Choose a unique bucket name (e.g., `bow-media-bucket-2024`)
4. Select your preferred region (same as DynamoDB)
5. Configure settings:
   - **Block Public Access**: Uncheck "Block all public access" (we need public read access)
   - **Bucket Versioning**: Optional
   - **Default Encryption**: Enable (recommended)
6. Click "Create bucket"

### Via AWS CLI
```bash
aws s3 mb s3://bow-media-bucket-2024 --region us-east-1
```

## 🔑 Step 2: Configure Bucket Permissions

### Public Read Access
Your bucket needs to allow public read access for images to be displayed on the website.

1. Go to your S3 bucket → Permissions
2. Edit "Block public access" settings
3. Uncheck "Block all public access"
4. Save changes

### Bucket Policy
Add this bucket policy for public read access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

## 🔧 Step 3: Update Environment Variables

Add S3 configuration to your `.env` file:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# S3 Configuration
S3_BUCKET_NAME=your-bucket-name-here
```

## 📦 Step 4: Install Dependencies

Install the required npm packages:

```bash
cd bow-backend
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner multer
```

## 🧪 Step 5: Test S3 Integration

### Test Upload Endpoint
```bash
curl -X POST http://localhost:3000/api/upload/config
```

You should see:
```json
{
  "success": true,
  "data": {
    "maxFileSize": "50MB",
    "allowedTypes": ["image/jpeg", "image/jpg", "image/png", ...],
    "folders": {
      "EVENTS": "events",
      "GALLERY": "gallery",
      "PROFILES": "profiles",
      "SPONSORS": "sponsors",
      "STORIES": "stories"
    }
  }
}
```

### Test File Upload
```bash
curl -X POST \
  -F "file=@test-image.jpg" \
  -F "folder=events" \
  http://localhost:3000/api/upload/single
```

## 📁 Step 6: Folder Structure

Your S3 bucket will have this folder structure:

```
your-bucket-name/
├── events/          # Event images
├── gallery/         # Gallery media
├── profiles/        # User profile images
├── sponsors/        # Sponsor logos
└── stories/         # Story images
```

## 🎯 Step 7: Frontend Integration

The frontend includes a reusable `FileUpload` component that you can use:

```jsx
import FileUpload from '../components/common/FileUpload';

// Single image upload
<FileUpload
  onUpload={(fileData) => console.log('Uploaded:', fileData)}
  folder="events"
  accept="image/*"
/>

// Multiple files upload
<FileUpload
  onUpload={(fileData) => console.log('Uploaded:', fileData)}
  multiple={true}
  maxFiles={5}
  folder="gallery"
  accept="image/*,video/*"
/>
```

## 🛡️ Step 8: Security Best Practices

### IAM Permissions
Create a dedicated IAM user with minimal S3 permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name/*"
      ]
    }
  ]
}
```

### File Validation
- File size limit: 50MB
- Allowed types: Images (JPG, PNG, GIF, WebP) and Videos (MP4, MOV, AVI, WebM)
- Automatic file type validation
- Unique filename generation

## 📊 Step 9: Monitoring and Costs

### CloudWatch Monitoring
- Set up CloudWatch alarms for S3 metrics
- Monitor storage usage and costs
- Track upload/download requests

### Cost Optimization
- Use S3 Standard for frequently accessed files
- Consider S3-IA for less frequently accessed files
- Set up lifecycle policies for old files
- Monitor and optimize storage usage

## 🔄 Step 10: Production Deployment

When deploying to production:

1. **Environment Variables**: Set S3 credentials on your hosting platform
2. **CORS Configuration**: Configure CORS for your domain
3. **CDN**: Consider using CloudFront for better performance
4. **Backup**: Enable versioning for important files

### CORS Configuration
Add this CORS configuration to your S3 bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
    "AllowedOrigins": ["https://your-domain.com"],
    "ExposeHeaders": []
  }
]
```

## 🚨 Troubleshooting

### Common Issues

**1. Access Denied Error**
- Check IAM permissions
- Verify bucket policy
- Ensure bucket is not blocking public access

**2. Upload Fails**
- Check file size limits
- Verify file type is allowed
- Check network connectivity

**3. Images Not Displaying**
- Verify bucket policy allows public read
- Check file URLs are correct
- Ensure CORS is configured properly

**4. CORS Errors**
- Configure CORS policy on S3 bucket
- Check allowed origins in CORS configuration

## 📞 Support

For issues or questions:
1. Check the console logs for error messages
2. Verify S3 bucket configuration
3. Test upload endpoints manually
4. Check AWS CloudWatch for S3 metrics

The S3 integration provides a robust, scalable solution for file storage in your BOW application! 🎉 