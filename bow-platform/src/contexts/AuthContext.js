import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Email/password login
  const signInWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
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
      const res = await fetch('/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName, phone })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      setCurrentUser(data.user);
      return data.user;
    } catch (err) {
      setCurrentUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Dummy Google for now
  const value = {
    currentUser,
    signInWithGoogle: () => Promise.reject('Google sign-in not implemented'),
    signInWithEmail,
    registerWithEmail,
    signOut: () => setCurrentUser(null),
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 