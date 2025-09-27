require('dotenv').config();
const { KMSClient, DecryptCommand } = require('@aws-sdk/client-kms');
const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');
const { docClient } = require('./aws-config');

// AWS KMS and SSM Configuration
const awsConfig = {
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

const kmsClient = new KMSClient(awsConfig);
const ssmClient = new SSMClient(awsConfig);

// Cache for decrypted keys to avoid repeated KMS calls
const keyCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class SecureKeyManager {
  constructor() {
    this.initialized = false;
    this.keys = {};
  }

  /**
   * Initialize the key manager by fetching encrypted keys from SSM Parameter Store
   */
  async initialize() {
    if (this.initialized) return;

    try {
      console.log('🔐 Initializing Secure Key Manager...');

      // Fetch encrypted Stripe keys from SSM Parameter Store
      const stripeSecretKey = await this.getParameter('/bow/stripe/secret-key', true);
      const stripePublishableKey = await this.getParameter('/bow/stripe/publishable-key', true);
      const stripeWebhookSecret = await this.getParameter('/bow/stripe/webhook-secret', true);

      this.keys = {
        stripeSecretKey,
        stripePublishableKey,
        stripeWebhookSecret
      };

      this.initialized = true;
      console.log('✅ Secure Key Manager initialized successfully');
      console.log('   Stripe Secret Key: ', stripeSecretKey ? '✓ Loaded' : '✗ Missing');
      console.log('   Stripe Publishable Key: ', stripePublishableKey ? '✓ Loaded' : '✗ Missing');
      console.log('   Stripe Webhook Secret: ', stripeWebhookSecret ? '✓ Loaded' : '✗ Missing');

    } catch (error) {
      console.error('❌ Failed to initialize Secure Key Manager:', error.message);
      throw error;
    }
  }

  /**
   * Get a parameter from SSM Parameter Store, with optional KMS decryption
   */
  async getParameter(parameterName, decrypt = false) {
    const cacheKey = `${parameterName}_${decrypt}`;
    
    // Check cache first
    if (keyCache.has(cacheKey)) {
      const cached = keyCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.value;
      }
      keyCache.delete(cacheKey);
    }

    try {
      const command = new GetParameterCommand({
        Name: parameterName,
        WithDecryption: decrypt
      });

      const response = await ssmClient.send(command);
      const value = response.Parameter?.Value;

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
      
      // If parameter doesn't exist, try to get it from DynamoDB as fallback
      try {
        const fallbackValue = await this.getFallbackParameter(parameterName);
        if (fallbackValue) {
          console.log(`⚠️ Using fallback value for ${parameterName}`);
          return fallbackValue;
        }
      } catch (fallbackError) {
        console.error(`❌ Fallback also failed for ${parameterName}:`, fallbackError.message);
      }
      
      throw error;
    }
  }

  /**
   * Fallback method to get keys from DynamoDB (for migration purposes)
   */
  async getFallbackParameter(parameterName) {
    try {
      const { GetCommand } = require('@aws-sdk/lib-dynamodb');
      
      const command = new GetCommand({
        TableName: `${process.env.DYNAMODB_TABLE_PREFIX}app_config`,
        Key: {
          configKey: parameterName
        }
      });

      const response = await docClient.send(command);
      return response.Item?.configValue;

    } catch (error) {
      console.error('❌ Fallback parameter retrieval failed:', error.message);
      return null;
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
   * Store encrypted keys in SSM Parameter Store (for setup)
   */
  async storeEncryptedKey(parameterName, value, encrypt = true) {
    try {
      const { PutParameterCommand } = require('@aws-sdk/client-ssm');
      
      const command = new PutParameterCommand({
        Name: parameterName,
        Value: value,
        Type: encrypt ? 'SecureString' : 'String',
        Overwrite: true,
        Description: `BOW ${parameterName.split('/').pop()} - ${new Date().toISOString()}`
      });

      await ssmClient.send(command);
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
const keyManager = new SecureKeyManager();

module.exports = {
  keyManager,
  SecureKeyManager
};
