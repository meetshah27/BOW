import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import api from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [isSyncing, setIsSyncing] = useState(false); // Prevent multiple simultaneous syncs

    // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log('Firebase user photoURL:', firebaseUser.photoURL);
        
        // Prevent multiple simultaneous syncs
        if (isSyncing) {
          console.log('🔄 Sync already in progress, skipping...');
          return;
        }
        
        setIsSyncing(true);
        try {
          // Sync with backend to get complete user data
          const backendUser = await syncUserWithBackend(firebaseUser);
          console.log('Backend user response:', backendUser);
          if (backendUser && backendUser.user) {
            console.log('Setting user from backend, photoURL:', backendUser.user.photoURL);
            setCurrentUser(backendUser.user);
            localStorage.setItem('currentUser', JSON.stringify(backendUser.user));
          } else {
            // Fallback to basic user data if backend sync fails
            const basicUser = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              firstName: firebaseUser.displayName?.split(' ')[0] || '',
              lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
              photoURL: firebaseUser.photoURL,
              provider: 'google',
              role: 'member' // Default role
            };
            console.log('Setting basic user, photoURL:', basicUser.photoURL);
            setCurrentUser(basicUser);
            localStorage.setItem('currentUser', JSON.stringify(basicUser));
          }
        } catch (error) {
          console.error('Error syncing user with backend:', error);
          // Fallback to basic user data
          const basicUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            firstName: firebaseUser.displayName?.split(' ')[0] || '',
            lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
            photoURL: firebaseUser.photoURL,
            provider: 'google',
            role: 'member' // Default role
          };
          console.log('Setting fallback user, photoURL:', basicUser.photoURL);
          setCurrentUser(basicUser);
          localStorage.setItem('currentUser', JSON.stringify(basicUser));
        } finally {
          setIsSyncing(false);
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Check user role once when user is loaded (instead of continuous polling)
  // REMOVED: This was redundant since syncUserWithBackend already fetches the role
  // The role is fetched once during initial authentication and doesn't need to be checked again

  // Periodic role check (every 30 seconds) to detect role changes
  useEffect(() => {
    if (!currentUser?.email) return;
    
    const interval = setInterval(async () => {
      // Only check if user is active (page is visible)
      if (document.visibilityState === 'visible') {
        await refreshUserRole();
      }
    }, 30000); // Check every 30 seconds instead of 5 seconds

    return () => clearInterval(interval);
  }, [currentUser?.email]);

  // Sync Firebase user with your backend
  const syncUserWithBackend = async (firebaseUser) => {
    try {
      // Always try to get the latest user data from backend first
      const res = await api.user.get(`/users/email/${firebaseUser.email}`);
      if (res.ok) {
        const userData = await res.json();
        console.log('✅ Found existing user in backend:', userData.user?.role);
        return userData;
      }
    } catch (error) {
      console.log('User not found in backend, will create new one');
    }

    // Create new user in backend via Google auth endpoint
    try {
      const googleUserData = {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || '',
        firstName: firebaseUser.displayName?.split(' ')[0] || '',
        lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
        phone: firebaseUser.phoneNumber || '',
        photoURL: firebaseUser.photoURL || '',
        provider: 'google'
      };

      const res = await api.user.post('/users/google', googleUserData);
      if (res.ok) {
        const data = await res.json();
        console.log('✅ Created new user in backend:', data.user?.role);
        return data;
      } else {
        throw new Error('Failed to create user in backend');
      }
    } catch (error) {
      console.error('Error creating user in backend:', error);
      throw error;
    }
  };

  // Google Sign-In
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // The user will be automatically set via the auth state listener
      return result.user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      setCurrentUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Email/password login
  const signInWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.user.post('/users/login', { email, password });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store user data and generate a simple token for persistence
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      // Generate a simple token for session management
      const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('authToken', token);
      
      setCurrentUser(data.user);
      return data.user;
    } catch (err) {
      setCurrentUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Email/password registration
  const registerWithEmail = async ({ email, password, firstName, lastName, phone }) => {
    setLoading(true);
    try {
      const res = await api.user.post('/users/register', { email, password, firstName, lastName, phone });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Store user data and generate a simple token for persistence
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      // Generate a simple token for session management
      const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('authToken', token);
      
      setCurrentUser(data.user);
      return data.user;
    } catch (err) {
      setCurrentUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Firebase sign out error:', error);
    }
    
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  };

  // Function to manually refresh user role (useful for detecting role changes)
  const refreshUserRole = async () => {
    if (!currentUser?.email) return;
    
    try {
      console.log('🔄 Manually refreshing user role...');
      const res = await api.user.get(`/users/refresh-role/${currentUser.email}`);
      
      if (res.ok) {
        const data = await res.json();
        if (data.user && data.user.role !== currentUser.role) {
          console.log('✅ Role change detected!', currentUser.role, '→', data.user.role);
          setCurrentUser(data.user);
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          
          // Show notification for role change
          if (data.user.role === 'admin') {
            console.log('🎉 User now has admin access!');
            // Force a re-render to show admin dashboard button
            window.location.reload();
          }
          return data.user;
        } else {
          console.log('🔄 No role change detected. Current role:', currentUser.role);
          return currentUser;
        }
      } else {
        console.log('❌ Failed to refresh role:', res.status);
        return currentUser;
      }
    } catch (error) {
      console.error('❌ Error refreshing role:', error);
      return currentUser;
    }
  };


  const value = {
    currentUser,
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
    signOut,
    loading,
    refreshUserRole, // Add this function to the context
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 