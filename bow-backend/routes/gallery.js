const express = require('express');
const router = express.Router();
const Gallery = require('../models-dynamodb/Gallery');
const Event = require('../models-dynamodb/Event');

// GET all gallery images
router.get('/', async (req, res) => {
  try {
    const images = await Gallery.findAll();
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch gallery images' });
  }
});

// GET gallery items grouped by events (albums)
router.get('/albums/events', async (req, res) => {
  try {
    const allImages = await Gallery.findAll();
    const allEvents = await Event.findAll();
    
    // Group images by eventId
    const eventAlbums = {};
    
    // Initialize with events that have gallery items
    allImages.forEach(image => {
      if (image.eventId) {
        if (!eventAlbums[image.eventId]) {
          const event = allEvents.find(e => e.id === image.eventId);
          eventAlbums[image.eventId] = {
            eventId: image.eventId,
            eventTitle: event ? event.title : 'Unknown Event',
            eventDate: event ? event.date : null,
            eventImage: event ? event.image : null,
            photos: []
          };
        }
        eventAlbums[image.eventId].photos.push(image);
      }
    });
    
    // Convert to array and sort by event date (newest first)
    const albums = Object.values(eventAlbums).sort((a, b) => {
      if (!a.eventDate) return 1;
      if (!b.eventDate) return -1;
      return new Date(b.eventDate) - new Date(a.eventDate);
    });
    
    res.json(albums);
  } catch (error) {
    console.error('Error fetching event albums:', error);
    res.status(500).json({ message: 'Failed to fetch event albums' });
  }
});

// GET gallery items for a specific event
router.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const images = await Gallery.findByEventId(eventId);
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event gallery' });
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
    res.json({ message: 'Image deleted successfully from database and S3' });
  } catch (error) {
    console.error('Gallery delete error:', error);
    res.status(500).json({ message: 'Failed to delete image' });
  }
});

module.exports = router; 