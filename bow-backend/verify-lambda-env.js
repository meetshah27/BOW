const { execSync } = require('child_process');

const functionName = process.argv[2] || 'bow-backend-lambda';
const region = process.argv[3] || 'us-west-2';

console.log('🔍 Checking Lambda Environment Variables...\n');
console.log(`Function: ${functionName}`);
console.log(`Region: ${region}\n`);

try {
  const cmd = `aws lambda get-function-configuration --function-name ${functionName} --region ${region} --output json`;
  const output = execSync(cmd, { encoding: 'utf-8' });
  const config = JSON.parse(output);
  const envVars = config.Environment?.Variables || {};
  
  console.log('📋 Current Environment Variables:');
  console.log('─────────────────────────────────');
  
  if (!envVars || Object.keys(envVars).length === 0) {
    console.log('❌ No environment variables found!');
    console.log('\n💡 You need to set environment variables.');
    console.log('   Run: npm run setup-lambda-env');
  } else {
    Object.keys(envVars).forEach(key => {
      if (key.includes('SECRET') || key.includes('KEY')) {
        const value = envVars[key];
        const masked = value ? '*'.repeat(Math.min(value.length, 8)) + '...' : 'NOT SET';
        console.log(`   ${key}: ${masked}`);
      } else {
        console.log(`   ${key}: ${envVars[key]}`);
      }
    });
    
    // Check required variables
    const required = ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'];
    const missing = required.filter(key => !envVars[key]);
    
    if (missing.length > 0) {
      console.log('\n⚠️  Missing required variables:');
      missing.forEach(key => console.log(`   - ${key}`));
      console.log('\n💡 Run: npm run setup-lambda-env');
    } else {
      console.log('\n✅ All required environment variables are set!');
    }
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
  if (error.stdout) console.error('Output:', error.stdout);
  if (error.stderr) console.error('Error:', error.stderr);
}

