import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_Zk7dtdrv3',
    userPoolWebClientId: '1p577744bm0bko388dq4g5it16',
    oauth: {
      domain: 'us-east-1-zk7dtdrv3.auth.us-east-1.amazoncognito.com', // e.g. bow-users.auth.us-east-1.amazoncognito.com
      scope: ['email', 'openid', 'profile'],
      redirectSignIn: 'http://localhost:3001/',
      redirectSignOut: 'http://localhost:3001/',
      responseType: 'code', // or 'token' 
    }
  }
});