const express = require('express');
const router = express.Router();

// In-memory settings storage (in production, this would be in a database)
let settings = {
  membershipApplicationEnabled: true, // Default to enabled
  lastUpdated: new Date().toISOString(),
  updatedBy: 'system'
};

// Get all settings
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      settings: settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch settings' 
    });
  }
});

// Get specific setting
router.get('/:key', (req, res) => {
  try {
    const { key } = req.params;
    
    if (!settings.hasOwnProperty(key)) {
      return res.status(404).json({ 
        success: false,
        error: 'Setting not found' 
      });
    }

    res.json({
      success: true,
      key: key,
      value: settings[key]
    });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch setting' 
    });
  }
});

// Update settings
router.put('/', (req, res) => {
  try {
    const { updates, updatedBy } = req.body;

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid updates provided' 
      });
    }

    // Update settings
    Object.keys(updates).forEach(key => {
      if (settings.hasOwnProperty(key)) {
        settings[key] = updates[key];
      }
    });

    // Update metadata
    settings.lastUpdated = new Date().toISOString();
    settings.updatedBy = updatedBy || 'unknown';

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update settings' 
    });
  }
});

// Toggle membership application specifically
router.put('/membership-application', (req, res) => {
  try {
    const { enabled, updatedBy } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid enabled value. Must be boolean.' 
      });
    }

    settings.membershipApplicationEnabled = enabled;
    settings.lastUpdated = new Date().toISOString();
    settings.updatedBy = updatedBy || 'unknown';

    res.json({
      success: true,
      message: `Membership application ${enabled ? 'enabled' : 'disabled'} successfully`,
      settings: {
        membershipApplicationEnabled: settings.membershipApplicationEnabled,
        lastUpdated: settings.lastUpdated,
        updatedBy: settings.updatedBy
      }
    });
  } catch (error) {
    console.error('Error toggling membership application:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to toggle membership application' 
    });
  }
});

module.exports = router;
