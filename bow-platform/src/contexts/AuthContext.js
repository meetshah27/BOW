import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Google Sign-in
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Send to backend for Google authentication
      const response = await fetch('http://localhost:3000/users/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        toast.success('Successfully signed in!');
        return data.user;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Google sign-in failed');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign in. Please try again.');
      throw error;
    }
  };

  // Email/Password Registration
  const registerWithEmail = async ({ email, password, ...rest }) => {
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 2. Register user in backend
      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password, // Send plain password for backend hashing
          ...rest
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        toast.success('Successfully registered!');
        return data.user;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(`Failed to register: ${error.message}`);
      throw error;
    }
  };

  // Email/Password Sign-in
  const signInWithEmail = async (email, password) => {
    try {
      // 1. Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 2. Authenticate with backend
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        toast.success('Successfully signed in!');
        return data.user;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign in failed');
      }
    } catch (error) {
      console.error('Email sign-in error:', error);
      toast.error('Failed to sign in. Please try again.');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserData(null);
      toast.success('Successfully signed out!');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Try to get user data from backend
        try {
          const response = await fetch(`http://localhost:3000/users/${user.uid}`);
          if (response.ok) {
            const userData = await response.json();
            setUserData(userData);
          } else {
            // If not found by UID, try to find by email
            const emailResponse = await fetch(`http://localhost:3000/users/email/${user.email}`);
            if (emailResponse.ok) {
              const userData = await emailResponse.json();
              setUserData(userData);
            } else {
              // Fallback to default role
              setUserData({ role: 'member' });
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData({ role: 'member' });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const hasRole = (role) => {
    if (!userData || !userData.role) return false;
    if (role === 'member') return userData.role === 'member' || userData.role === 'admin';
    return userData.role === role;
  };

  const value = {
    currentUser,
    userData,
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
    signOut,
    loading,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 