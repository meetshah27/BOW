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

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Save user to MongoDB
      const response = await fetch('http://localhost:3000/users/signup', {
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
        const savedUser = await response.json();
        setUserData(savedUser);
        toast.success('Successfully signed in!');
        return savedUser;
      } else if (response.status === 400) {
        // User already exists, try to sign in
        const signInResponse = await fetch('http://localhost:3000/users/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid: user.uid }),
        });
        if (signInResponse.ok) {
          const existingUser = await signInResponse.json();
          setUserData(existingUser);
          toast.success('Successfully signed in!');
          return existingUser;
        }
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign in. Please try again.');
      throw error;
    }
  };

  // UPDATED: Register with Firebase Auth, then backend
  const registerWithEmail = async ({ email, password, ...rest }) => {
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // 2. Register user in backend (MongoDB)
      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          ...rest
        }),
      });
      if (response.ok) {
        const savedUser = await response.json();
        setUserData(savedUser);
        toast.success('Successfully registered!');
        return savedUser;
      } else {
        let errorMsg = 'Registration failed';
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {}
        toast.error(`Failed to register: ${errorMsg}`);
        throw new Error(errorMsg);
      }
    } catch (error) {
      toast.error(`Failed to register: ${error.message}`);
      throw error;
    }
  };

  // UPDATED: Sign in with Firebase Auth, then fetch user data from backend
  const signInWithEmail = async (email, password) => {
    try {
      // 1. Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // 2. Fetch user data from backend (MongoDB)
      const response = await fetch(`http://localhost:3000/users/${user.uid}`);
      if (response.ok) {
        const userData = await response.json();
        setUserData(userData);
        toast.success('Successfully signed in!');
        return userData;
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
        // Try to get user data from MongoDB
        try {
          const response = await fetch(`http://localhost:3000/users/${user.uid}`);
          if (response.ok) {
            const userData = await response.json();
            setUserData(userData);
          } else {
            // Fallback to default role
            setUserData({ role: 'member' });
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
    if (role === 'member') return userData.role === 'member' || userData.role === 'admin'; // admin is also a member
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