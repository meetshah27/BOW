import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Temporary demo configuration - replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAUNdG9BqJ0AMpZTQ4i1BBrO_yaeJtrwBs",
  authDomain: "beatsofwashington-a760b.firebaseapp.com",
  projectId: "beatsofwashington-a760b",
  storageBucket: "beatsofwashington-a760b.firebasestorage.app",
  messagingSenderId: "713875891450",
  appId: "1:713875891450:web:492ceb6a966d6532b6d543",
  measurementId: "G-QBLS8QQXFZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app; 