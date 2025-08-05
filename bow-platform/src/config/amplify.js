import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'us-east-1', // Keep existing User Pool region
    userPoolId: 'us-east-1_Zk7dtdrv3', // Keep existing User Pool ID
    userPoolWebClientId: '1p577744bm0bko388dq4g5it16', // Keep existing Client ID
    oauth: {
      domain: 'us-east-1-zk7dtdrv3.auth.us-east-1.amazoncognito.com', // Keep existing domain
      scope: ['email', 'openid', 'profile'],
      redirectSignIn: 'http://localhost:3001/',
      redirectSignOut: 'http://localhost:3001/',
      responseType: 'code', // or 'token' 
    }
  }
});