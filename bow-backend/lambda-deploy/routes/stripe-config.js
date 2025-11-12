const express = require('express');
const router = express.Router();

// Try to import key manager, fallback to env vars if not available
let keyManager;
try {
  keyManager = require('../config/key-management-simple').keyManager;
} catch (error) {
  console.log('⚠️ Key management not available for stripe-config, using environment variables');
  keyManager = null;
}

// GET /api/stripe-config - Get Stripe publishable key securely
router.get('/stripe-config', async (req, res) => {
  try {
    console.log('🔐 Retrieving Stripe configuration...');
    
    // Get publishable key from secure key manager or environment variables
    let publishableKey;
    
    // Try key manager first, with proper fallback to environment variables
    if (keyManager) {
      try {
        publishableKey = await keyManager.getStripePublishableKey();
        console.log('✅ Retrieved publishable key from secure key manager');
      } catch (keyError) {
        console.log('⚠️ Key manager failed, falling back to environment variables:', keyError.message);
        publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
      }
    } else {
      publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
      console.log('✅ Retrieved publishable key from environment variables');
    }
    
    if (!publishableKey) {
      console.log('❌ No publishable key found in key manager or environment variables');
      return res.status(500).json({ 
        error: 'Stripe configuration not available. Please check your Stripe keys in .env file.',
        publishableKey: null 
      });
    }
    
    // Return only the publishable key (safe to expose to frontend)
    res.json({
      publishableKey,
      success: true,
      timestamp: new Date().toISOString()
    });
    
    console.log('✅ Stripe configuration retrieved successfully');
    
  } catch (error) {
    console.error('❌ Failed to retrieve Stripe configuration:', error.message);
    res.status(500).json({ 
      error: 'Failed to retrieve Stripe configuration',
      publishableKey: null 
    });
  }
});

// GET /api/stripe-config/test - Test Stripe key configuration
router.get('/stripe-config/test', async (req, res) => {
  try {
    console.log('🧪 Testing Stripe key configuration...');
    
    // Test key retrieval
    const testResult = await keyManager.testKeys();
    
    if (testResult) {
      res.json({
        success: true,
        message: 'Stripe keys are configured correctly',
        timestamp: new Date().toISOString(),
        cacheStatus: keyManager.getCacheStatus()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Stripe keys are not configured correctly'
      });
    }
    
  } catch (error) {
    console.error('❌ Stripe configuration test failed:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
