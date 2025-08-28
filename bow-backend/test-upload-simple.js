#!/usr/bin/env node

require('dotenv').config();
const express = require('express');
const multer = require('multer');
const app = express();

// Basic multer setup
const upload = multer({ dest: 'uploads/' });

// Test endpoint
app.post('/test-upload', upload.single('file'), (req, res) => {
  console.log('Test upload endpoint called');
  console.log('File:', req.file);
  console.log('Body:', req.body);
  
  res.json({
    success: true,
    message: 'Test upload successful',
    file: req.file ? req.file.originalname : 'No file'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Test endpoints:');
  console.log('  GET  /health');
  console.log('  POST /test-upload');
});
