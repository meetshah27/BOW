# 🚨 Firebase Setup Required - Fix the "auth/invalid-api-key" Error

## The Problem
You're getting this error because Firebase doesn't have valid credentials to work with.

## Quick Fix (5 minutes)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Name it something like "bow-platform"
4. Follow the setup wizard (you can skip Google Analytics for now)

### Step 2: Enable Google Authentication
1. In your Firebase project, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click on **"Google"** in the list
5. Click **"Enable"**
6. Add your project's public-facing name
7. Add `localhost` as an authorized domain
8. Click **"Save"**

### Step 3: Get Your Credentials
1. Click the **gear icon** (Project Settings) in the left sidebar
2. Scroll down to **"Your apps"** section
3. Click **"Add app"** and select the **web icon** (</>)
4. Register your app with a nickname like "bow-platform-web"
5. **Copy the configuration object** that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz",
  authDomain: "my-bow-project.firebaseapp.com",
  projectId: "my-bow-project",
  storageBucket: "my-bow-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### Step 4: Update Your Config
1. Open `src/config/firebase-config.js`
2. Replace the placeholder values with your actual Firebase credentials
3. Save the file
4. Restart your development server (`npm start`)

## What Your Config Should Look Like

```javascript
export const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz",        // Your actual API key
  authDomain: "my-bow-project.firebaseapp.com",                   // Your actual domain
  projectId: "my-bow-project",                                    // Your actual project ID
  storageBucket: "my-bow-project.appspot.com",                    // Your actual bucket
  messagingSenderId: "123456789012",                              // Your actual sender ID
  appId: "1:123456789012:web:abcdef1234567890"                   // Your actual app ID
};
```

## Test It
1. After updating the config, restart your app
2. Go to the login page
3. Click "Continue with Google"
4. You should see the Google Sign-In popup!

## Still Having Issues?
- Check the browser console for new error messages
- Make sure you copied ALL the values from Firebase
- Verify that Google Sign-In is enabled in Firebase Authentication
- Ensure `localhost` is added as an authorized domain

## Need Help?
The error messages in the console will now be much more helpful and guide you through the setup process.
