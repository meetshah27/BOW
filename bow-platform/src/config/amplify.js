import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'us-west-2',
    userPoolId: 'us-west-2_Imazy2DXa',
    userPoolWebClientId: '7qiar42f9ujh3p8atoel4dp055',
    oauth: {
      domain: 'bow-users.auth.us-west-2.amazoncognito.com',
      scope: ['email', 'openid', 'profile'],
      redirectSignIn: 'http://localhost:3001/',
      redirectSignOut: 'http://localhost:3001/',
      responseType: 'code', // or 'token' 
    }
  }
});