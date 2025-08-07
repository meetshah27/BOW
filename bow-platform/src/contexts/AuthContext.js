import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Load user from localStorage on app start
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        // Clear invalid data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

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
  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  };

  // Dummy Google for now
  const value = {
    currentUser,
    signInWithGoogle: () => Promise.reject('Google sign-in not implemented'),
    signInWithEmail,
    registerWithEmail,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 