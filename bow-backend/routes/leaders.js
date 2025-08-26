const express = require('express');
const router = express.Router();
const Leader = require('../models-dynamodb/Leader');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

// Configure AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ error: 'File upload error: ' + error.message });
  } else if (error) {
    return res.status(400).json({ error: error.message });
  }
  next();
};

// GET /api/leaders - Get all active leaders (public)
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/leaders - Fetching all active leaders');
    const leaders = await Leader.getAll();
    console.log(`Found ${leaders.length} active leaders`);
    res.json(leaders);
  } catch (error) {
    console.error('Error fetching leaders:', error);
    res.status(500).json({ error: 'Failed to fetch leaders' });
  }
});

// GET /api/leaders/admin - Get all leaders for admin (including inactive)
router.get('/admin', async (req, res) => {
  try {
    console.log('GET /api/leaders/admin - Fetching all leaders for admin');
    const leaders = await Leader.getAllForAdmin();
    console.log(`Found ${leaders.length} total leaders for admin`);
    res.json(leaders);
  } catch (error) {
    console.error('Error fetching leaders for admin:', error);
    res.status(500).json({ error: 'Failed to fetch leaders for admin' });
  }
});

// GET /api/leaders/:id - Get leader by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`GET /api/leaders/${id} - Fetching leader by ID`);
    
    const leader = await Leader.getById(id);
    if (!leader) {
      console.log(`Leader with ID ${id} not found`);
      return res.status(404).json({ error: 'Leader not found' });
    }
    
    console.log(`Found leader: ${leader.name}`);
    res.json(leader);
  } catch (error) {
    console.error('Error fetching leader by ID:', error);
    res.status(500).json({ error: 'Failed to fetch leader' });
  }
});

// POST /api/leaders - Create new leader
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/leaders - Creating new leader');
    console.log('Request body:', req.body);
    
    const leaderData = {
      name: req.body.name,
      position: req.body.position,
      roles: req.body.roles || [],
      bio: req.body.bio || '',
      isActive: req.body.isActive !== undefined ? req.body.isActive : 'true',
      order: req.body.order || 0
    };
    
    console.log('Processed leader data:', leaderData);
    
    const leader = await Leader.create(leaderData);
    console.log(`Created leader: ${leader.name} with ID: ${leader.id}`);
    
    res.status(201).json(leader);
  } catch (error) {
    console.error('Error creating leader:', error);
    res.status(500).json({ error: 'Failed to create leader' });
  }
});

// PUT /api/leaders/:id - Update leader
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`PUT /api/leaders/${id} - Updating leader`);
    console.log('Update data:', req.body);
    
    const updateData = {
      name: req.body.name,
      position: req.body.position,
      roles: req.body.roles || [],
      bio: req.body.bio || '',
      isActive: req.body.isActive,
      order: req.body.order
    };
    
    console.log('Processed update data:', updateData);
    
    const updatedLeader = await Leader.update(id, updateData);
    console.log(`Updated leader: ${updatedLeader.name}`);
    
    res.json(updatedLeader);
  } catch (error) {
    console.error('Error updating leader:', error);
    res.status(500).json({ error: 'Failed to update leader' });
  }
});

// DELETE /api/leaders/:id - Delete leader
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`DELETE /api/leaders/${id} - Deleting leader`);
    
    await Leader.delete(id);
    console.log(`Deleted leader with ID: ${id}`);
    
    res.json({ message: 'Leader deleted successfully' });
  } catch (error) {
    console.error('Error deleting leader:', error);
    res.status(500).json({ error: 'Failed to delete leader' });
  }
});

// POST /api/leaders/:id/upload - Upload leader image
router.post('/:id/upload', upload.single('image'), handleMulterError, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`POST /api/leaders/${id}/upload - Uploading image for leader`);
    
    if (!req.file) {
      console.log('No file provided');
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
    
    // Get leader to check if exists
    const leader = await Leader.getById(id);
    if (!leader) {
      console.log(`Leader with ID ${id} not found`);
      return res.status(404).json({ error: 'Leader not found' });
    }
    
    // Generate unique filename
    const fileExtension = req.file.originalname.split('.').pop();
    const fileName = `leaders/${id}/${uuidv4()}.${fileExtension}`;
    
    console.log('Generated filename:', fileName);
    
    // Upload to S3
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    };
    
    console.log('Uploading to S3 with params:', {
      Bucket: uploadParams.Bucket,
      Key: uploadParams.Key,
      ContentType: uploadParams.ContentType
    });
    
    const putObjectCommand = new PutObjectCommand(uploadParams);
    const s3Result = await s3Client.send(putObjectCommand);
    console.log('S3 upload successful');
    
    // Construct the S3 URL since PutObjectCommand doesn't return Location
    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-west-2'}.amazonaws.com/${fileName}`;
    
    // Update leader with image URL and key
    const updateData = {
      imageUrl: imageUrl,
      imageKey: fileName
    };
    
    const updatedLeader = await Leader.update(id, updateData);
    console.log(`Updated leader ${updatedLeader.name} with image URL: ${updatedLeader.imageUrl}`);
    
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      imageKey: fileName,
      leader: updatedLeader
    });
    
  } catch (error) {
    console.error('Error uploading leader image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// PUT /api/leaders/:id/toggle-active - Toggle leader active status
router.put('/:id/toggle-active', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`PUT /api/leaders/${id}/toggle-active - Toggling active status`);
    
    const updatedLeader = await Leader.toggleActive(id);
    console.log(`Toggled active status for leader ${updatedLeader.name}: ${updatedLeader.isActive}`);
    
    res.json(updatedLeader);
  } catch (error) {
    console.error('Error toggling leader active status:', error);
    res.status(500).json({ error: 'Failed to toggle active status' });
  }
});

// PUT /api/leaders/:id/order - Update leader order
router.put('/:id/order', async (req, res) => {
  try {
    const { id } = req.params;
    const { order } = req.body;
    console.log(`PUT /api/leaders/${id}/order - Updating order to ${order}`);
    
    if (order === undefined || order === null) {
      return res.status(400).json({ error: 'Order is required' });
    }
    
    const updatedLeader = await Leader.updateOrder(id, parseInt(order));
    console.log(`Updated order for leader ${updatedLeader.name}: ${updatedLeader.order}`);
    
    res.json(updatedLeader);
  } catch (error) {
    console.error('Error updating leader order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// GET /api/leaders/search/:query - Search leaders
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    console.log(`GET /api/leaders/search/${query} - Searching leaders`);
    
    const leaders = await Leader.search(query);
    console.log(`Found ${leaders.length} leaders matching query: ${query}`);
    
    res.json(leaders);
  } catch (error) {
    console.error('Error searching leaders:', error);
    res.status(500).json({ error: 'Failed to search leaders' });
  }
});

// GET /api/leaders/position/:position - Get leaders by position
router.get('/position/:position', async (req, res) => {
  try {
    const { position } = req.params;
    console.log(`GET /api/leaders/position/${position} - Getting leaders by position`);
    
    const leaders = await Leader.getByPosition(position);
    console.log(`Found ${leaders.length} leaders with position: ${position}`);
    
    res.json(leaders);
  } catch (error) {
    console.error('Error getting leaders by position:', error);
    res.status(500).json({ error: 'Failed to get leaders by position' });
  }
});

// GET /api/leaders/role/:role - Get leaders by role
router.get('/role/:role', async (req, res) => {
  try {
    const { role } = req.params;
    console.log(`GET /api/leaders/role/${role} - Getting leaders by role`);
    
    const leaders = await Leader.getByRole(role);
    console.log(`Found ${leaders.length} leaders with role: ${role}`);
    
    res.json(leaders);
  } catch (error) {
    console.error('Error getting leaders by role:', error);
    res.status(500).json({ error: 'Failed to get leaders by role' });
  }
});

// GET /api/leaders/stats/overview - Get leader statistics
router.get('/stats/overview', async (req, res) => {
  try {
    console.log('GET /api/leaders/stats/overview - Getting leader statistics');
    
    const stats = await Leader.getStats();
    console.log('Leader statistics:', stats);
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting leader statistics:', error);
    res.status(500).json({ error: 'Failed to get leader statistics' });
  }
});

module.exports = router;
