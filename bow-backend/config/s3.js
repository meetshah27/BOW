const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const multer = require('multer');
const path = require('path');

// S3 Configuration
const s3Config = {
  region: process.env.AWS_REGION || 'us-west-2', // Updated to us-west-2
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
};

// Log S3 configuration (without sensitive data)
console.log('🔍 S3 Configuration:');
console.log('   Region:', s3Config.region);
console.log('   Access Key ID set:', !!s3Config.credentials.accessKeyId);
console.log('   Secret Access Key set:', !!s3Config.credentials.secretAccessKey);
console.log('   Bucket Name:', process.env.S3_BUCKET_NAME || 'bow-media-bucket');

// Check if required environment variables are set
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error('❌ AWS credentials not found in environment variables!');
  console.error('   Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env file');
}

if (!process.env.S3_BUCKET_NAME) {
  console.error('❌ S3 bucket name not found in environment variables!');
  console.error('   Please set S3_BUCKET_NAME in your .env file');
}

// Create S3 client
const s3Client = new S3Client(s3Config);

// S3 bucket configuration
const S3_CONFIG = {
  BUCKET_NAME: process.env.S3_BUCKET_NAME || 'bow-media-bucket',
  REGION: process.env.AWS_REGION || 'us-west-2', // Updated to us-west-2
  FOLDERS: {
    EVENTS: 'events',
    GALLERY: 'gallery',
    PROFILES: 'profiles',
    SPONSORS: 'sponsors',
    STORIES: 'stories',
    FOUNDERS: 'founders',
    ABOUT: 'about'
  }
};

// Multer configuration for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow images, videos, and text files for testing
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/mov',
    'video/avi',
    'video/webm',
    'text/plain' // Added for testing
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

// Generate unique filename
const generateFileName = (originalName, folder) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = path.extname(originalName);
  const name = path.basename(originalName, extension);
  const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '_');
  
  return `${folder}/${timestamp}_${randomString}_${sanitizedName}${extension}`;
};

// Upload file to S3
const uploadToS3 = async (file, folder) => {
  try {
    console.log('🚀 Starting S3 upload...');
    console.log('📁 S3 Config:', {
      bucket: S3_CONFIG.BUCKET_NAME,
      region: S3_CONFIG.REGION,
      folder: folder
    });
    console.log('📁 File info:', {
      name: file.originalname,
      type: file.mimetype,
      size: file.size
    });
    
    const fileName = generateFileName(file.originalname, folder);
    console.log('📝 Generated filename:', fileName);
    
    const uploadParams = {
      Bucket: S3_CONFIG.BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      // Removed ACL parameter since bucket has ACLs disabled
      Metadata: {
        originalName: file.originalname,
        uploadedBy: 'bow-application',
        uploadedAt: new Date().toISOString()
      }
    };

    console.log('📤 Sending to S3...');
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    console.log('✅ S3 upload successful');

    const fileUrl = `https://${S3_CONFIG.BUCKET_NAME}.s3.${S3_CONFIG.REGION}.amazonaws.com/${fileName}`;
    console.log('🔗 Generated file URL:', fileUrl);
    
    return {
      success: true,
      fileName: fileName,
      fileUrl: fileUrl,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    };
  } catch (error) {
    console.error('❌ S3 upload error:', error);
    throw new Error('Failed to upload file to S3');
  }
};

// Delete file from S3
const deleteFromS3 = async (fileName) => {
  try {
    const deleteParams = {
      Bucket: S3_CONFIG.BUCKET_NAME,
      Key: fileName
    };

    const command = new DeleteObjectCommand(deleteParams);
    await s3Client.send(command);
    
    return { success: true };
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('Failed to delete file from S3');
  }
};

// Generate presigned URL for secure uploads (optional)
const generatePresignedUrl = async (fileName, contentType, expiresIn = 3600) => {
  try {
    const command = new PutObjectCommand({
      Bucket: S3_CONFIG.BUCKET_NAME,
      Key: fileName,
      ContentType: contentType
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return presignedUrl;
  } catch (error) {
    console.error('Presigned URL generation error:', error);
    throw new Error('Failed to generate presigned URL');
  }
};

// Get file URL
const getFileUrl = (fileName) => {
  return `https://${S3_CONFIG.BUCKET_NAME}.s3.${S3_CONFIG.REGION}.amazonaws.com/${fileName}`;
};

module.exports = {
  s3Client,
  S3_CONFIG,
  upload,
  uploadToS3,
  deleteFromS3,
  generatePresignedUrl,
  getFileUrl,
  generateFileName
}; 