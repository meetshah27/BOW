const express = require('express');
const router = express.Router();
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

// Upload story image
router.post('/story', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const result = await uploadToS3(req.file, S3_CONFIG.FOLDERS.STORIES);

    res.json({
      success: true,
      message: 'Story image uploaded successfully',
      data: result
    });
  } catch (error) {
    console.error('Story upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Upload failed'
    });
  }
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