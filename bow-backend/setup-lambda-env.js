const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt, hideInput = false) {
  return new Promise((resolve) => {
    if (hideInput) {
      const stdin = process.stdin;
      stdin.setRawMode(true);
      stdin.resume();
      stdin.setEncoding('utf8');
      process.stdout.write(prompt);
      
      let input = '';
      stdin.on('data', (char) => {
        char = char.toString();
        if (char === '\n' || char === '\r' || char === '\u0004') {
          stdin.setRawMode(false);
          stdin.pause();
          process.stdout.write('\n');
          resolve(input);
        } else if (char === '\u0003') {
          process.exit();
        } else if (char === '\u007f') {
          if (input.length > 0) {
            input = input.slice(0, -1);
            process.stdout.write('\b \b');
          }
        } else {
          input += char;
          process.stdout.write('*');
        }
      });
    } else {
      rl.question(prompt, resolve);
    }
  });
}

async function setupLambdaEnv() {
  console.log('🔧 Lambda Environment Variables Setup\n');

  const functionName = await question('Lambda Function Name (default: bow-backend-lambda): ') || 'bow-backend-lambda';
  const region = await question('AWS Region (default: us-west-2): ') || 'us-west-2';

  console.log('\n📋 Environment Variables:\n');

  // Check if .env file exists
  const envPath = path.join(__dirname, '.env');
  let envVars = {};

  if (fs.existsSync(envPath)) {
    console.log('📄 Found .env file. Reading values...\n');
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        envVars[key] = value;
      }
    });
  }

  // Get required variables
  const awsRegion = envVars.AWS_REGION || await question(`AWS_REGION (default: ${region}): `) || region;
  const awsAccessKeyId = envVars.AWS_ACCESS_KEY_ID || await question('AWS_ACCESS_KEY_ID: ');
  const awsSecretAccessKey = envVars.AWS_SECRET_ACCESS_KEY || await question('AWS_SECRET_ACCESS_KEY (hidden): ', true);

  // Optional variables
  console.log('\n📋 Optional Variables (press Enter to skip):\n');
  const s3BucketName = envVars.S3_BUCKET_NAME || await question('S3_BUCKET_NAME (optional): ');
  const sesFromEmail = envVars.SES_FROM_EMAIL || await question('SES_FROM_EMAIL (optional): ');
  const nodeEnv = await question('NODE_ENV (default: production): ') || 'production';

  if (!awsAccessKeyId || !awsSecretAccessKey) {
    console.error('\n❌ Error: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are required!');
    process.exit(1);
  }

  console.log('\n📦 Updating Lambda environment variables...\n');

  try {
    // Build environment variables object
    const environment = {
      Variables: {
        AWS_REGION: awsRegion,
        AWS_ACCESS_KEY_ID: awsAccessKeyId,
        AWS_SECRET_ACCESS_KEY: awsSecretAccessKey,
        NODE_ENV: nodeEnv
      }
    };

    // Add optional variables if provided
    if (s3BucketName) environment.Variables.S3_BUCKET_NAME = s3BucketName;
    if (sesFromEmail) environment.Variables.SES_FROM_EMAIL = sesFromEmail;

    // Convert to JSON and escape properly for Windows PowerShell
    const envJson = JSON.stringify(environment);
    
    // For Windows, we need to escape differently
    const isWindows = process.platform === 'win32';
    let updateCmd;
    
    if (isWindows) {
      // Windows PowerShell/CMD escaping
      const escapedJson = envJson.replace(/"/g, '\\"');
      updateCmd = `aws lambda update-function-configuration --function-name ${functionName} --region ${region} --environment "Variables=${escapedJson}" --output json`;
    } else {
      // Unix/Linux escaping
      const escapedJson = envJson.replace(/"/g, '\\"');
      updateCmd = `aws lambda update-function-configuration --function-name ${functionName} --region ${region} --environment 'Variables=${escapedJson}' --output json`;
    }
    
    console.log('1️⃣ Updating environment variables...');
    console.log('   (This may take a moment...)');
    const response = JSON.parse(execSync(updateCmd, { encoding: 'utf-8', shell: isWindows ? 'powershell.exe' : '/bin/bash' }));
    
    console.log('✅ Environment variables updated successfully!');
    console.log(`   Function: ${response.FunctionName}`);
    console.log(`   Environment Variables: ${Object.keys(response.Environment.Variables).length} variables set`);
    console.log('\n📋 Set Variables:');
    Object.keys(response.Environment.Variables).forEach(key => {
      if (key.includes('SECRET') || key.includes('KEY')) {
        console.log(`   ${key}: ********`);
      } else {
        console.log(`   ${key}: ${response.Environment.Variables[key]}`);
      }
    });

    console.log('\n⏳ Waiting for update to complete...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('✅ Lambda environment variables configured!');
    console.log('\n🧪 Test your API again:');
    console.log('   https://b312t31med.execute-api.us-west-2.amazonaws.com/prod/health\n');
    console.log('💡 The health check should now connect to DynamoDB successfully.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stdout) console.error('Output:', error.stdout);
    if (error.stderr) console.error('Error:', error.stderr);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
setupLambdaEnv();

