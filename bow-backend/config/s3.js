const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const multer = require('multer');
const path = require('path');

// S3 Configuration
const s3Config = {
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
};

// Create S3 client
const s3Client = new S3Client(s3Config);

// S3 bucket configuration
const S3_CONFIG = {
  BUCKET_NAME: process.env.S3_BUCKET_NAME || 'bow-media-bucket',
  REGION: process.env.AWS_REGION || 'us-east-1',
  FOLDERS: {
    EVENTS: 'events',
    GALLERY: 'gallery',
    PROFILES: 'profiles',
    SPONSORS: 'sponsors',
    STORIES: 'stories'
  }
};

// Multer configuration for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow images and videos
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/mov',
    'video/avi',
    'video/webm'
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
    const fileName = generateFileName(file.originalname, folder);
    
    const uploadParams = {
      Bucket: S3_CONFIG.BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read', // Make files publicly accessible
      Metadata: {
        originalName: file.originalname,
        uploadedBy: 'bow-application',
        uploadedAt: new Date().toISOString()
      }
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    const fileUrl = `https://${S3_CONFIG.BUCKET_NAME}.s3.${S3_CONFIG.REGION}.amazonaws.com/${fileName}`;
    
    return {
      success: true,
      fileName: fileName,
      fileUrl: fileUrl,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    };
  } catch (error) {
    console.error('S3 upload error:', error);
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