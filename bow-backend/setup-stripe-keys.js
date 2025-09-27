#!/usr/bin/env node

/**
 * BOW Stripe Keys Setup Script
 * 
 * This script helps you securely store Stripe keys in AWS SSM Parameter Store
 * instead of using environment variables.
 * 
 * Usage:
 *   node setup-stripe-keys.js
 * 
 * Prerequisites:
 *   - AWS CLI configured with appropriate permissions
 *   - Stripe account with API keys
 *   - Node.js environment with AWS SDK
 */

require('dotenv').config();
const readline = require('readline');
const { keyManager } = require('./config/key-management');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Helper function to mask sensitive input
function promptMasked(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    let input = '';
    process.stdin.on('data', function(char) {
      char = char + '';
      
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.removeAllListeners('data');
          process.stdout.write('\n');
          resolve(input);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // Backspace
          if (input.length > 0) {
            input = input.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          input += char;
          process.stdout.write('*');
          break;
      }
    });
  });
}

async function setupStripeKeys() {
  console.log('🔐 BOW Stripe Keys Setup');
  console.log('========================');
  console.log('');
  console.log('This script will help you securely store Stripe API keys');
  console.log('in AWS SSM Parameter Store instead of environment files.');
  console.log('');

  try {
    // Check if keys already exist
    console.log('🔍 Checking existing keys...');
    try {
      await keyManager.initialize();
      console.log('⚠️  Keys already exist in the system.');
      
      const overwrite = await prompt('Do you want to overwrite existing keys? (y/N): ');
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        console.log('❌ Setup cancelled.');
        rl.close();
        return;
      }
    } catch (error) {
      console.log('✅ No existing keys found, proceeding with setup...');
    }

    console.log('');
    console.log('📝 Please provide your Stripe API keys:');
    console.log('   (You can find these in your Stripe Dashboard > Developers > API keys)');
    console.log('');

    // Get Stripe keys from user
    const stripeSecretKey = await promptMasked('Enter Stripe Secret Key (sk_live_... or sk_test_...): ');
    const stripePublishableKey = await prompt('Enter Stripe Publishable Key (pk_live_... or pk_test_...): ');
    const stripeWebhookSecret = await promptMasked('Enter Stripe Webhook Secret (whsec_...): ');

    console.log('');
    console.log('🔍 Validating keys...');

    // Validate keys format
    if (!stripeSecretKey.startsWith('sk_')) {
      throw new Error('Invalid Stripe Secret Key format. Should start with sk_live_ or sk_test_');
    }

    if (!stripePublishableKey.startsWith('pk_')) {
      throw new Error('Invalid Stripe Publishable Key format. Should start with pk_live_ or pk_test_');
    }

    if (!stripeWebhookSecret.startsWith('whsec_')) {
      throw new Error('Invalid Stripe Webhook Secret format. Should start with whsec_');
    }

    console.log('✅ Key formats are valid');

    // Store keys in SSM Parameter Store
    console.log('');
    console.log('💾 Storing keys securely in AWS SSM Parameter Store...');

    await keyManager.storeEncryptedKey('/bow/stripe/secret-key', stripeSecretKey, true);
    await keyManager.storeEncryptedKey('/bow/stripe/publishable-key', stripePublishableKey, false);
    await keyManager.storeEncryptedKey('/bow/stripe/webhook-secret', stripeWebhookSecret, true);

    console.log('✅ Keys stored successfully!');

    // Test the configuration
    console.log('');
    console.log('🧪 Testing configuration...');

    const testResult = await keyManager.testKeys();
    if (testResult) {
      console.log('✅ Configuration test passed!');
      console.log('');
      console.log('🎉 Setup completed successfully!');
      console.log('');
      console.log('📋 Next steps:');
      console.log('   1. Your Stripe keys are now securely stored in AWS SSM Parameter Store');
      console.log('   2. The application will automatically use these keys');
      console.log('   3. You can remove STRIPE_* variables from your .env file');
      console.log('   4. Restart your application to use the new secure key management');
      console.log('');
      console.log('🔒 Security benefits:');
      console.log('   - Keys are encrypted at rest in AWS');
      console.log('   - Keys are not stored in code or environment files');
      console.log('   - Access is controlled via AWS IAM permissions');
      console.log('   - Keys can be rotated without code changes');
    } else {
      throw new Error('Configuration test failed');
    }

  } catch (error) {
    console.error('');
    console.error('❌ Setup failed:', error.message);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   - Verify your AWS credentials are configured');
    console.error('   - Ensure your AWS user has SSM Parameter Store permissions');
    console.error('   - Check that your Stripe keys are correct');
    console.error('   - Verify your AWS region is set to us-west-2');
  } finally {
    rl.close();
  }
}

// Run the setup
if (require.main === module) {
  setupStripeKeys().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { setupStripeKeys };
