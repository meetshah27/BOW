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

async function setupApiGateway() {
  console.log('🚀 API Gateway Setup Script\n');

  // Get API details
  const apiName = await question('API Name (default: bow-backend-api): ') || 'bow-backend-api';
  const region = await question('AWS Region (default: us-west-2): ') || 'us-west-2';
  const lambdaFunctionName = await question('Lambda Function Name: ');
  const stageName = await question('Stage Name (default: prod): ') || 'prod';

  if (!lambdaFunctionName) {
    console.error('❌ Lambda Function Name is required!');
    process.exit(1);
  }

  console.log('\n📋 Creating API Gateway...\n');

  try {
    // Step 1: Create REST API
    console.log('1️⃣ Creating REST API...');
    const createApiCmd = `aws apigateway create-rest-api --name "${apiName}" --endpoint-configuration types=REGIONAL --region ${region} --output json`;
    const apiResponse = JSON.parse(execSync(createApiCmd, { encoding: 'utf-8' }));
    const apiId = apiResponse.id;
    console.log(`✅ API created: ${apiId}\n`);

    // Step 2: Get Root Resource ID
    console.log('2️⃣ Getting root resource ID...');
    const getResourcesCmd = `aws apigateway get-resources --rest-api-id ${apiId} --region ${region} --output json`;
    const resourcesResponse = JSON.parse(execSync(getResourcesCmd, { encoding: 'utf-8' }));
    const rootResourceId = resourcesResponse.items.find(item => item.path === '/').id;
    console.log(`✅ Root resource ID: ${rootResourceId}\n`);

    // Step 3: Create {proxy+} Resource
    console.log('3️⃣ Creating {proxy+} resource...');
    const createProxyCmd = `aws apigateway create-resource --rest-api-id ${apiId} --parent-id ${rootResourceId} --path-part "{proxy+}" --region ${region} --output json`;
    const proxyResponse = JSON.parse(execSync(createProxyCmd, { encoding: 'utf-8' }));
    const proxyResourceId = proxyResponse.id;
    console.log(`✅ Proxy resource created: ${proxyResourceId}\n`);

    // Step 4: Create ANY Method on Proxy Resource
    console.log('4️⃣ Creating ANY method on proxy resource...');
    const putMethodCmd = `aws apigateway put-method --rest-api-id ${apiId} --resource-id ${proxyResourceId} --http-method ANY --authorization-type NONE --region ${region} --output json`;
    execSync(putMethodCmd, { encoding: 'utf-8' });
    console.log('✅ ANY method created\n');

    // Step 5: Set up Lambda Integration
    console.log('5️⃣ Setting up Lambda integration...');
    const lambdaArn = `arn:aws:lambda:${region}:${execSync('aws sts get-caller-identity --query Account --output text', { encoding: 'utf-8' }).trim()}:function:${lambdaFunctionName}`;
    
    const putIntegrationCmd = `aws apigateway put-integration --rest-api-id ${apiId} --resource-id ${proxyResourceId} --http-method ANY --type AWS_PROXY --integration-http-method POST --uri "arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${lambdaArn}/invocations" --region ${region} --output json`;
    execSync(putIntegrationCmd, { encoding: 'utf-8' });
    console.log('✅ Lambda integration configured\n');

    // Step 6: Create ANY Method on Root Resource
    console.log('6️⃣ Creating ANY method on root resource...');
    const putRootMethodCmd = `aws apigateway put-method --rest-api-id ${apiId} --resource-id ${rootResourceId} --http-method ANY --authorization-type NONE --region ${region} --output json`;
    execSync(putRootMethodCmd, { encoding: 'utf-8' });
    console.log('✅ Root method created\n');

    // Step 7: Set up Lambda Integration for Root
    console.log('7️⃣ Setting up Lambda integration for root...');
    const putRootIntegrationCmd = `aws apigateway put-integration --rest-api-id ${apiId} --resource-id ${rootResourceId} --http-method ANY --type AWS_PROXY --integration-http-method POST --uri "arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${lambdaArn}/invocations" --region ${region} --output json`;
    execSync(putRootIntegrationCmd, { encoding: 'utf-8' });
    console.log('✅ Root Lambda integration configured\n');

    // Step 8: Add Lambda Permission
    console.log('8️⃣ Adding Lambda permission for API Gateway...');
    try {
      const sourceArn = `arn:aws:execute-api:${region}:${execSync('aws sts get-caller-identity --query Account --output text', { encoding: 'utf-8' }).trim()}:${apiId}/*/*`;
      const addPermissionCmd = `aws lambda add-permission --function-name ${lambdaFunctionName} --statement-id apigateway-invoke --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "${sourceArn}" --region ${region}`;
      execSync(addPermissionCmd, { encoding: 'utf-8' });
      console.log('✅ Lambda permission added\n');
    } catch (error) {
      console.log('⚠️  Permission might already exist (this is OK)\n');
    }

    // Step 9: Deploy API
    console.log('9️⃣ Deploying API...');
    const deployCmd = `aws apigateway create-deployment --rest-api-id ${apiId} --stage-name ${stageName} --region ${region} --output json`;
    execSync(deployCmd, { encoding: 'utf-8' });
    console.log(`✅ API deployed to stage: ${stageName}\n`);

    // Get the endpoint URL
    const endpointUrl = `https://${apiId}.execute-api.${region}.amazonaws.com/${stageName}`;

    console.log('🎉 API Gateway setup complete!\n');
    console.log('📋 Summary:');
    console.log(`   API ID: ${apiId}`);
    console.log(`   Stage: ${stageName}`);
    console.log(`   Endpoint URL: ${endpointUrl}\n`);
    console.log('🧪 Test URLs:');
    console.log(`   Root: ${endpointUrl}/`);
    console.log(`   Health: ${endpointUrl}/health`);
    console.log(`   API Events: ${endpointUrl}/api/events\n`);
    console.log('⚠️  Note: CORS needs to be configured manually in the console or via AWS CLI');
    console.log('   Run: aws apigateway put-integration-response (for CORS setup)\n');

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
setupApiGateway();

