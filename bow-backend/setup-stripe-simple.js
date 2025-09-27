#!/usr/bin/env node

/**
 * Simple Stripe Setup Script
 * 
 * This script helps you set up Stripe keys in environment variables
 * for the BOW donation system.
 */

require('dotenv').config();
const readline = require('readline');
const fs = require('fs');
const path = require('path');

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

async function setupStripeSimple() {
  console.log('🔐 BOW Stripe Simple Setup');
  console.log('==========================');
  console.log('');
  console.log('This script will help you set up Stripe API keys');
  console.log('for the BOW donation system using environment variables.');
  console.log('');

  try {
    // Check if .env file exists
    const envPath = path.join(__dirname, '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      console.log('✅ Found existing .env file');
    } else {
      console.log('⚠️  No .env file found, will create one');
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

    // Update .env file
    console.log('');
    console.log('💾 Updating .env file...');

    // Remove existing Stripe keys
    const lines = envContent.split('\n');
    const filteredLines = lines.filter(line => {
      return !line.startsWith('STRIPE_SECRET_KEY=') &&
             !line.startsWith('STRIPE_PUBLISHABLE_KEY=') &&
             !line.startsWith('STRIPE_WEBHOOK_SECRET=') &&
             !line.startsWith('# Stripe Configuration');
    });

    // Add new Stripe keys
    const newLines = [
      '',
      '# Stripe Configuration',
      `STRIPE_SECRET_KEY=${stripeSecretKey}`,
      `STRIPE_PUBLISHABLE_KEY=${stripePublishableKey}`,
      `STRIPE_WEBHOOK_SECRET=${stripeWebhookSecret}`,
      ''
    ];

    const updatedContent = filteredLines.concat(newLines).join('\n');
    fs.writeFileSync(envPath, updatedContent);

    console.log('✅ Stripe keys stored in .env file');

    // Test the configuration
    console.log('');
    console.log('🧪 Testing configuration...');

    // Test Stripe connection
    const Stripe = require('stripe');
    const stripe = Stripe(stripeSecretKey);
    
    // Test with a simple API call
    await stripe.balance.retrieve();
    
    console.log('✅ Stripe connection successful!');
    console.log('');
    console.log('🎉 Setup completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Your Stripe keys are now stored in .env file');
    console.log('   2. Restart your backend server');
    console.log('   3. Test the donation system');
    console.log('   4. Set up AWS SES for email receipts');
    console.log('');
    console.log('🔒 Security note:');
    console.log('   - Keep your .env file secure and never commit it to version control');
    console.log('   - Consider using AWS SSM Parameter Store for production');
    console.log('');
    console.log('🚀 Your donation system is ready to accept payments!');

  } catch (error) {
    console.error('');
    console.error('❌ Setup failed:', error.message);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   - Verify your Stripe keys are correct');
    console.error('   - Check that you have a Stripe account');
    console.error('   - Ensure your keys match the environment (test vs live)');
    console.error('   - Make sure you have internet connectivity');
  } finally {
    rl.close();
  }
}

// Run the setup
if (require.main === module) {
  setupStripeSimple().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { setupStripeSimple };
