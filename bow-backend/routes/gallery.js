const express = require('express');
const router = express.Router();
const Gallery = require('../models-dynamodb/Gallery');

// GET all gallery images
router.get('/', async (req, res) => {
  try {
    const images = await Gallery.findAll();
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch gallery images' });
  }
});

// GET single image by id
router.get('/:id', async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch image' });
  }
});

// POST create new image
router.post('/', async (req, res) => {
  try {
    const image = await Gallery.create(req.body);
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create image' });
  }
});

// PUT update image
router.put('/:id', async (req, res) => {
  try {
    const updated = await Gallery.update(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update image' });
  }
});

// DELETE image
router.delete('/:id', async (req, res) => {
  try {
    await Gallery.delete(req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete image' });
  }
});

module.exports = router; 