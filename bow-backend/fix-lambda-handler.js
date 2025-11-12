const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function fixLambdaHandler() {
  console.log('🔧 Lambda Handler Fix Script\n');

  const functionName = await question('Lambda Function Name (default: bow-backend-lambda): ') || 'bow-backend-lambda';
  const region = await question('AWS Region (default: us-west-2): ') || 'us-west-2';

  console.log('\n📋 Updating Lambda handler...\n');

  try {
    // Update the handler
    console.log('1️⃣ Updating handler to lambda.handler...');
    const updateCmd = `aws lambda update-function-configuration --function-name ${functionName} --handler lambda.handler --region ${region} --output json`;
    const response = JSON.parse(execSync(updateCmd, { encoding: 'utf-8' }));
    
    console.log('✅ Handler updated successfully!');
    console.log(`   Function: ${response.FunctionName}`);
    console.log(`   Handler: ${response.Handler}`);
    console.log(`   Runtime: ${response.Runtime}`);
    console.log(`   Status: ${response.State}`);
    console.log('\n⏳ Waiting for update to complete (this may take a few seconds)...\n');

    // Wait a bit for the update to propagate
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('✅ Lambda handler has been updated!');
    console.log('\n🧪 Test your API again:');
    console.log('   https://b312t31med.execute-api.us-west-2.amazonaws.com/prod/health\n');

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
fixLambdaHandler();

