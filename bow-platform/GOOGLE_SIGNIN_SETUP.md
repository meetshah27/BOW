# Google Sign-In Setup Guide

This guide will help you set up Google Sign-In authentication for your BOW platform.

## Prerequisites

- A Google Cloud Console account
- Firebase project (can be created through Google Cloud Console)
- Node.js and npm installed

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Enter a project name (e.g., "bow-platform")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Click on "Google" in the list of providers
5. Click "Enable"
6. Enter your project's public-facing name
7. Add your authorized domain (localhost for development)
8. Click "Save"

## Step 3: Get Firebase Configuration

1. In your Firebase project, click on the gear icon (Project Settings)
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (</>)
4. Register your app with a nickname (e.g., "bow-platform-web")
5. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 4: Configure Your App

1. Copy the `firebase-config.example.js` file to `src/config/firebase-config.js`
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
// src/config/firebase-config.js
export const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-actual-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-actual-project-id.appspot.com",
  messagingSenderId: "your-actual-messaging-sender-id",
  appId: "your-actual-app-id"
};
```

## Step 5: Update Environment Variables (Optional)

Alternatively, you can use environment variables by creating a `.env` file in your project root:

```bash
# .env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Step 6: Test the Setup

1. Start your development server: `npm start`
2. Navigate to the login page
3. Click "Continue with Google"
4. You should see the Google Sign-In popup
5. Sign in with a Google account

## Step 7: Backend Integration

The backend is already configured to handle Google Sign-In users. When a user signs in with Google:

1. Firebase authenticates the user
2. The frontend sends user data to your backend
3. The backend creates or updates the user record
4. The user is logged in and redirected

## Troubleshooting

### Common Issues

1. **"Firebase configuration not found" warning**
   - Make sure you've copied and configured `firebase-config.js`
   - Check that all required fields are filled in

2. **"Google sign-in not implemented" error**
   - Ensure Firebase is properly initialized
   - Check browser console for Firebase errors

3. **Authentication popup blocked**
   - Allow popups for your domain
   - Check if you're using HTTPS (required for production)

4. **Backend errors**
   - Ensure your backend server is running
   - Check that the `/users/google` endpoint is accessible
   - Verify DynamoDB connection

### Debug Mode

To enable debug logging, add this to your browser console:

```javascript
localStorage.setItem('firebase:debug', '*');
```

## Security Considerations

1. **API Key Security**: The Firebase API key is safe to expose in client-side code, but keep your service account keys private
2. **Domain Restrictions**: Configure authorized domains in Firebase Console
3. **User Data**: Only store necessary user information
4. **Token Validation**: Firebase handles token validation automatically

## Production Deployment

1. Add your production domain to Firebase authorized domains
2. Update environment variables for production
3. Ensure HTTPS is enabled
4. Test the complete authentication flow

## Additional Features

Once Google Sign-In is working, you can:

1. Add profile picture display
2. Implement account linking (Google + email)
3. Add social sharing features
4. Implement user role management

## Support

If you encounter issues:

1. Check the Firebase Console for error logs
2. Review browser console for JavaScript errors
3. Verify backend server logs
4. Check DynamoDB table structure and permissions

## Next Steps

After successful setup:

1. Test with multiple Google accounts
2. Verify user data is properly stored in DynamoDB
3. Test the complete user flow (sign in, profile, sign out)
4. Consider adding other authentication providers (Facebook, Apple, etc.)
