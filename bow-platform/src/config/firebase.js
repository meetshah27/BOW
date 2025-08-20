import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Import Firebase configuration
// You can either use environment variables or create a firebase-config.js file
let firebaseConfig;

try {
  // Try to import from a local config file first
  const configModule = require('./firebase-config');
  firebaseConfig = configModule.firebaseConfig;
} catch (error) {
  // Fallback to environment variables
  firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  };
}

// Check if we have valid configuration
if (!firebaseConfig.apiKey || 
    firebaseConfig.apiKey === 'your_firebase_api_key_here' ||
    firebaseConfig.apiKey === 'your-api-key-here') {
  console.error('❌ Firebase configuration not found or invalid!');
  console.error('Please follow these steps:');
  console.error('1. Go to https://console.firebase.google.com/');
  console.error('2. Create a new project or select existing one');
  console.error('3. Click on the gear icon (Project Settings)');
  console.error('4. Scroll down to "Your apps" section');
  console.error('5. Click "Add app" and select Web');
  console.error('6. Copy the config object values');
  console.error('7. Update src/config/firebase-config.js with your credentials');
  console.error('8. Enable Google Sign-In in Authentication > Sign-in method');
  
  // Don't initialize Firebase with invalid config
  throw new Error('Firebase configuration not found. Please set up your Firebase credentials.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app; 
