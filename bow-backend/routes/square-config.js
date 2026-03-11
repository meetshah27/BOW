const express = require('express');
const router = express.Router();

const { getSquareFrontendConfig } = require('../config/square-client');

// GET /api/square-config - Safe config for Square Web Payments SDK
router.get('/square-config', async (req, res) => {
  try {
    const config = getSquareFrontendConfig();

    if (!config.applicationId || !config.locationId) {
      return res.status(500).json({
        success: false,
        error:
          'Square configuration not available. Please set SQUARE_APPLICATION_ID and SQUARE_LOCATION_ID.',
        ...config,
      });
    }

    return res.json({
      success: true,
      ...config,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve Square configuration',
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;

