// Copy this file to src/config/firebase-config.js and fill in your Firebase credentials
// You can get these from your Firebase Console: https://console.firebase.google.com/

export const firebaseConfig = {
  apiKey: "your_firebase_api_key_here",
  authDomain: "your_project_id.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project_id.appspot.com",
  messagingSenderId: "your_messaging_sender_id",
  appId: "your_app_id"
};

// Steps to get these credentials:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select existing one
// 3. Click on the gear icon (Project Settings)
// 4. Scroll down to "Your apps" section
// 5. Click "Add app" and select Web
// 6. Copy the config object values
// 7. Enable Google Sign-In in Authentication > Sign-in method
