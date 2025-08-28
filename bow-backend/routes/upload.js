const express = require('express');
const router = express.Router();
const multer = require('multer');
const { upload, uploadToS3, deleteFromS3, S3_CONFIG } = require('../config/s3');

// Upload single file
router.post('/single', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const folder = req.body.folder || 'general';
    const result = await uploadToS3(req.file, folder);

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: result
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Upload failed'
    });
  }
});

// Upload multiple files
router.post('/multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const folder = req.body.folder || 'general';
    const results = [];

    for (const file of req.files) {
      try {
        const result = await uploadToS3(file, folder);
        results.push(result);
      } catch (error) {
        console.error(`Error uploading ${file.originalname}:`, error);
        results.push({
          success: false,
          originalName: file.originalname,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      data: results
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Upload failed'
    });
  }
});

// Upload event image
router.post('/event', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const result = await uploadToS3(req.file, S3_CONFIG.FOLDERS.EVENTS);

    res.json({
      success: true,
      message: 'Event image uploaded successfully',
      data: result
    });
  } catch (error) {
    console.error('Event image upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Upload failed'
    });
  }
});

// Upload gallery media
router.post('/gallery', upload.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No media uploaded' });
    }

    const result = await uploadToS3(req.file, S3_CONFIG.FOLDERS.GALLERY);

    res.json({
      success: true,
      message: 'Gallery media uploaded successfully',
      data: result
    });
  } catch (error) {
    console.error('Gallery upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Upload failed'
    });
  }
});

// Upload profile image
router.post('/profile', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const result = await uploadToS3(req.file, S3_CONFIG.FOLDERS.PROFILES);

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: result
    });
  } catch (error) {
    console.error('Profile upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Upload failed'
    });
  }
});

// Upload sponsor image
router.post('/sponsor', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const result = await uploadToS3(req.file, S3_CONFIG.FOLDERS.SPONSORS);

    res.json({
      success: true,
      message: 'Sponsor image uploaded successfully',
      data: result
    });
  } catch (error) {
    console.error('Sponsor upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Upload failed'
    });
  }
});

// Upload story media (image or video)
router.post('/story', upload.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No media uploaded' });
    }

    // Check if it's an image or video
    const isImage = req.file.mimetype.startsWith('image/');
    const isVideo = req.file.mimetype.startsWith('video/');
    
    if (!isImage && !isVideo) {
      return res.status(400).json({ error: 'Only images and videos are allowed for stories' });
    }

    const result = await uploadToS3(req.file, S3_CONFIG.FOLDERS.STORIES);

    res.json({
      success: true,
      message: `Story ${isImage ? 'image' : 'video'} uploaded successfully`,
      data: result,
      mediaType: isImage ? 'image' : 'video'
    });
  } catch (error) {
    console.error('Story media upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Upload failed'
    });
  }
});

// Upload founder media
router.post('/founder', upload.single('media'), async (req, res) => {
  try {
    console.log('🚀 POST /api/upload/founder called');
    console.log('📁 Request headers:', req.headers);
    console.log('📁 Request body:', req.body);
    console.log('📁 Request file:', req.file);
    console.log('📁 Request files:', req.files);
    
    if (!req.file) {
      console.log('❌ No file uploaded');
      console.log('📁 Checking if this is a multer error...');
      return res.status(400).json({ 
        error: 'No media uploaded',
        details: 'File was not received by multer middleware'
      });
    }

    console.log('📋 File details:', {
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    const result = await uploadToS3(req.file, S3_CONFIG.FOLDERS.FOUNDERS);
    console.log('✅ Upload to S3 successful:', result);

    res.json({
      success: true,
      message: 'Founder media uploaded successfully',
      data: result
    });
  } catch (error) {
    console.error('❌ Founder media upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Upload failed'
    });
  }
});

// Test endpoint to check if server is working
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Upload route is working',
    timestamp: new Date().toISOString()
  });
});

// Upload about page logo
router.post('/about-logo', upload.single('logo'), async (req, res) => {
  try {
    console.log('🚀 POST /api/upload/about-logo called');
    console.log('📋 Request headers:', req.headers);
    console.log('📋 Request body keys:', Object.keys(req.body));
    console.log('📋 Request files:', req.files);
    console.log('📋 Request file:', req.file);
    
    if (!req.file) {
      console.log('❌ No file received in request');
      return res.status(400).json({ 
        error: 'No logo uploaded',
        details: 'Logo file was not received'
      });
    }

    // Validate that it's an image
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ 
        error: 'Invalid file type',
        details: 'Only image files are allowed for logos'
      });
    }

    console.log('📋 Logo file details:', {
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    const result = await uploadToS3(req.file, 'about');
    console.log('✅ Logo upload to S3 successful:', result);

    res.json({
      success: true,
      message: 'About page logo uploaded successfully',
      data: result
    });
  } catch (error) {
    console.error('❌ About logo upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Upload failed'
    });
  }
});

// Error handling middleware for multer errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    console.error('❌ Multer error:', error);
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large. Maximum size is 50MB.' 
      });
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: 'Too many files. Maximum is 1 file.' 
      });
    } else {
      return res.status(400).json({ 
        error: `Upload error: ${error.message}` 
      });
    }
  } else if (error) {
    console.error('❌ General upload error:', error);
    return res.status(400).json({ 
      error: error.message || 'Upload failed' 
    });
  }
  next();
});

// Delete file
router.delete('/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params;
    
    if (!fileName) {
      return res.status(400).json({ error: 'File name is required' });
    }

    const result = await deleteFromS3(fileName);

    res.json({
      success: true,
      message: 'File deleted successfully',
      data: result
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Delete failed'
    });
  }
});

// Get upload configuration
router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: {
      maxFileSize: '50MB',
      allowedTypes: [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/mov',
        'video/avi',
        'video/webm'
      ],
      folders: S3_CONFIG.FOLDERS
    }
  });
});

module.exports = router; 