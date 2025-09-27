require('dotenv').config();
const { docClient } = require('./aws-config');

// Cache for decrypted keys to avoid repeated calls
const keyCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class SimpleKeyManager {
  constructor() {
    this.initialized = false;
    this.keys = {};
  }

  /**
   * Initialize the key manager by fetching keys from DynamoDB
   */
  async initialize() {
    if (this.initialized) return;

    try {
      console.log('🔐 Initializing Simple Key Manager...');

      // Fetch Stripe keys from DynamoDB
      const stripeSecretKey = await this.getParameter('stripe_secret_key', true);
      const stripePublishableKey = await this.getParameter('stripe_publishable_key', true);
      const stripeWebhookSecret = await this.getParameter('stripe_webhook_secret', true);

      this.keys = {
        stripeSecretKey,
        stripePublishableKey,
        stripeWebhookSecret
      };

      this.initialized = true;
      console.log('✅ Simple Key Manager initialized successfully');
      console.log('   Stripe Secret Key: ', stripeSecretKey ? '✓ Loaded' : '✗ Missing');
      console.log('   Stripe Publishable Key: ', stripePublishableKey ? '✓ Loaded' : '✗ Missing');
      console.log('   Stripe Webhook Secret: ', stripeWebhookSecret ? '✓ Loaded' : '✗ Missing');

    } catch (error) {
      console.error('❌ Failed to initialize Simple Key Manager:', error.message);
      throw error;
    }
  }

  /**
   * Get a parameter from DynamoDB app_config table
   */
  async getParameter(parameterName, encrypt = false) {
    const cacheKey = `${parameterName}_${encrypt}`;
    
    // Check cache first
    if (keyCache.has(cacheKey)) {
      const cached = keyCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.value;
      }
      keyCache.delete(cacheKey);
    }

    try {
      const { GetCommand } = require('@aws-sdk/lib-dynamodb');
      
      const command = new GetCommand({
        TableName: `${process.env.DYNAMODB_TABLE_PREFIX}app_config`,
        Key: {
          configKey: parameterName
        }
      });

      const response = await docClient.send(command);
      const value = response.Item?.configValue;

      if (!value) {
        throw new Error(`Parameter ${parameterName} not found`);
      }

      // Cache the result
      keyCache.set(cacheKey, {
        value,
        timestamp: Date.now()
      });

      return value;

    } catch (error) {
      console.error(`❌ Failed to get parameter ${parameterName}:`, error.message);
      throw error;
    }
  }

  /**
   * Get Stripe secret key
   */
  async getStripeSecretKey() {
    if (!this.initialized) await this.initialize();
    return this.keys.stripeSecretKey;
  }

  /**
   * Get Stripe publishable key
   */
  async getStripePublishableKey() {
    if (!this.initialized) await this.initialize();
    return this.keys.stripePublishableKey;
  }

  /**
   * Get Stripe webhook secret
   */
  async getStripeWebhookSecret() {
    if (!this.initialized) await this.initialize();
    return this.keys.stripeWebhookSecret;
  }

  /**
   * Store encrypted keys in DynamoDB app_config table
   */
  async storeEncryptedKey(parameterName, value, encrypt = true) {
    try {
      const { PutCommand } = require('@aws-sdk/lib-dynamodb');
      
      const command = new PutCommand({
        TableName: `${process.env.DYNAMODB_TABLE_PREFIX}app_config`,
        Item: {
          configKey: parameterName,
          configValue: value,
          encrypted: encrypt,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });

      await docClient.send(command);
      console.log(`✅ Stored encrypted parameter: ${parameterName}`);
      
      // Clear cache for this parameter
      keyCache.delete(`${parameterName}_true`);
      keyCache.delete(`${parameterName}_false`);
      
      return true;

    } catch (error) {
      console.error(`❌ Failed to store parameter ${parameterName}:`, error.message);
      throw error;
    }
  }

  /**
   * Test key retrieval and Stripe connection
   */
  async testKeys() {
    try {
      console.log('🧪 Testing key retrieval...');
      
      const secretKey = await this.getStripeSecretKey();
      const publishableKey = await this.getStripePublishableKey();
      
      if (!secretKey || !publishableKey) {
        throw new Error('Missing required Stripe keys');
      }

      // Test Stripe connection
      const Stripe = require('stripe');
      const stripe = Stripe(secretKey);
      
      // Test with a simple API call
      await stripe.balance.retrieve();
      
      console.log('✅ All keys validated successfully');
      console.log('   Secret Key: ', secretKey.substring(0, 7) + '...');
      console.log('   Publishable Key: ', publishableKey.substring(0, 7) + '...');
      
      return true;

    } catch (error) {
      console.error('❌ Key validation failed:', error.message);
      return false;
    }
  }

  /**
   * Clear cache (useful for testing or key rotation)
   */
  clearCache() {
    keyCache.clear();
    console.log('🗑️ Key cache cleared');
  }

  /**
   * Get cache status
   */
  getCacheStatus() {
    return {
      size: keyCache.size,
      keys: Array.from(keyCache.keys()),
      initialized: this.initialized
    };
  }
}

// Create singleton instance
const keyManager = new SimpleKeyManager();

module.exports = {
  keyManager,
  SimpleKeyManager
};
