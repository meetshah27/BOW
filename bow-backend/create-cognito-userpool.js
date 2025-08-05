const { CognitoIdentityProviderClient, CreateUserPoolCommand, CreateUserPoolClientCommand, AdminCreateUserCommand, AdminSetUserPasswordCommand } = require('@aws-sdk/client-cognito-identity-provider');
require('dotenv').config();

// AWS Configuration for us-west-2
const config = {
  region: 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
};

const cognitoClient = new CognitoIdentityProviderClient(config);

const createUserPool = async () => {
  try {
    console.log('🏗️ Creating Cognito User Pool in us-west-2...');
    
    const createUserPoolCommand = new CreateUserPoolCommand({
      PoolName: 'bow-users',
      Policies: {
        PasswordPolicy: {
          MinimumLength: 8,
          RequireUppercase: true,
          RequireLowercase: true,
          RequireNumbers: true,
          RequireSymbols: false,
        }
      },
      AutoVerifiedAttributes: ['email'],
      UsernameAttributes: ['email'],
      MfaConfiguration: 'OFF',
      EmailConfiguration: {
        EmailSendingAccount: 'COGNITO_DEFAULT'
      },
      Schema: [
        {
          Name: 'email',
          AttributeDataType: 'String',
          Required: true,
          Mutable: true
        },
        {
          Name: 'name',
          AttributeDataType: 'String',
          Required: false,
          Mutable: true
        }
      ],
      AdminCreateUserConfig: {
        AllowAdminCreateUserOnly: false
      }
    });

    const userPoolResponse = await cognitoClient.send(createUserPoolCommand);
    const userPoolId = userPoolResponse.UserPool.Id;
    
    console.log(`✅ User Pool created successfully!`);
    console.log(`📋 User Pool ID: ${userPoolId}`);
    
    return userPoolId;
  } catch (error) {
    if (error.name === 'InvalidParameterException' && error.message.includes('already exists')) {
      console.log('⚠️ User Pool "bow-users" already exists in us-west-2');
      // Try to get existing user pool ID
      return await getExistingUserPoolId();
    }
    throw error;
  }
};

const getExistingUserPoolId = async () => {
  try {
    console.log('🔍 Looking for existing User Pool...');
    const { ListUserPoolsCommand } = require('@aws-sdk/client-cognito-identity-provider');
    const command = new ListUserPoolsCommand({ MaxResults: 60 });
    const response = await cognitoClient.send(command);
    
    const bowUserPool = response.UserPools.find(pool => pool.Name === 'bow-users');
    if (bowUserPool) {
      console.log(`✅ Found existing User Pool: ${bowUserPool.Id}`);
      return bowUserPool.Id;
    }
    
    throw new Error('No existing User Pool found');
  } catch (error) {
    console.error('❌ Error finding existing User Pool:', error.message);
    throw error;
  }
};

const createUserPoolClient = async (userPoolId) => {
  try {
    console.log('🔧 Creating User Pool Client...');
    
    const createClientCommand = new CreateUserPoolClientCommand({
      UserPoolId: userPoolId,
      ClientName: 'bow-web-client',
      GenerateSecret: false,
      ExplicitAuthFlows: [
        'ALLOW_USER_PASSWORD_AUTH',
        'ALLOW_REFRESH_TOKEN_AUTH',
        'ALLOW_USER_SRP_AUTH'
      ],
      SupportedIdentityProviders: ['COGNITO'],
      CallbackURLs: ['http://localhost:3001/', 'http://localhost:3000/'],
      LogoutURLs: ['http://localhost:3001/', 'http://localhost:3000/'],
      AllowedOAuthFlows: ['code'],
      AllowedOAuthScopes: ['email', 'openid', 'profile'],
      AllowedOAuthFlowsUserPoolClient: true
    });

    const clientResponse = await cognitoClient.send(createClientCommand);
    const clientId = clientResponse.UserPoolClient.ClientId;
    
    console.log(`✅ User Pool Client created successfully!`);
    console.log(`📋 Client ID: ${clientId}`);
    
    return clientId;
  } catch (error) {
    if (error.name === 'InvalidParameterException' && error.message.includes('already exists')) {
      console.log('⚠️ User Pool Client already exists');
      return await getExistingClientId(userPoolId);
    }
    throw error;
  }
};

const getExistingClientId = async (userPoolId) => {
  try {
    console.log('🔍 Looking for existing User Pool Client...');
    const { ListUserPoolClientsCommand } = require('@aws-sdk/client-cognito-identity-provider');
    const command = new ListUserPoolClientsCommand({ 
      UserPoolId: userPoolId,
      MaxResults: 60 
    });
    const response = await cognitoClient.send(command);
    
    const bowClient = response.UserPoolClients.find(client => client.ClientName === 'bow-web-client');
    if (bowClient) {
      console.log(`✅ Found existing Client: ${bowClient.ClientId}`);
      return bowClient.ClientId;
    }
    
    throw new Error('No existing Client found');
  } catch (error) {
    console.error('❌ Error finding existing Client:', error.message);
    throw error;
  }
};

const createDomain = async (userPoolId) => {
  try {
    console.log('🌐 Creating Cognito Domain...');
    
    const { CreateUserPoolDomainCommand } = require('@aws-sdk/client-cognito-identity-provider');
    const domainCommand = new CreateUserPoolDomainCommand({
      Domain: 'bow-users',
      UserPoolId: userPoolId
    });

    await cognitoClient.send(domainCommand);
    
    console.log(`✅ Cognito Domain created successfully!`);
    console.log(`🌐 Domain: bow-users.auth.us-west-2.amazoncognito.com`);
    
    return 'bow-users.auth.us-west-2.amazoncognito.com';
  } catch (error) {
    if (error.name === 'InvalidParameterException' && error.message.includes('already exists')) {
      console.log('⚠️ Domain already exists');
      return 'bow-users.auth.us-west-2.amazoncognito.com';
    }
    throw error;
  }
};

const main = async () => {
  console.log('🚀 Setting up Cognito User Pool in us-west-2');
  console.log('============================================');
  
  try {
    // Check AWS credentials
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error('AWS credentials not found. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env file.');
    }
    
    // Create User Pool
    const userPoolId = await createUserPool();
    
    // Create User Pool Client
    const clientId = await createUserPoolClient(userPoolId);
    
    // Create Domain
    const domain = await createDomain(userPoolId);
    
    console.log('\n🎉 Cognito setup completed successfully!');
    console.log('\n📋 Configuration Details:');
    console.log(`Region: us-west-2`);
    console.log(`User Pool ID: ${userPoolId}`);
    console.log(`Client ID: ${clientId}`);
    console.log(`Domain: ${domain}`);
    
    console.log('\n📝 Update your Amplify config with these values:');
    console.log('```javascript');
    console.log('Amplify.configure({');
    console.log('  Auth: {');
    console.log(`    region: 'us-west-2',`);
    console.log(`    userPoolId: '${userPoolId}',`);
    console.log(`    userPoolWebClientId: '${clientId}',`);
    console.log('    oauth: {');
    console.log(`      domain: '${domain}',`);
    console.log('      scope: [\'email\', \'openid\', \'profile\'],');
    console.log('      redirectSignIn: \'http://localhost:3001/\',');
    console.log('      redirectSignOut: \'http://localhost:3001/\',');
    console.log('      responseType: \'code\',');
    console.log('    }');
    console.log('  }');
    console.log('});');
    console.log('```');
    
  } catch (error) {
    console.error('❌ Error setting up Cognito:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}

module.exports = { createUserPool, createUserPoolClient, createDomain }; 