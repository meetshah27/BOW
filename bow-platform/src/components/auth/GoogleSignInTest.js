import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../config/firebase';
import toast from 'react-hot-toast';

const GoogleSignInTest = () => {
  const { currentUser, signInWithGoogle, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleTestGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      toast.success('Google Sign-In test successful!');
    } catch (error) {
      console.error('Test failed:', error);
      toast.error(`Test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSignOut = async () => {
    try {
      await signOut();
      toast.success('Sign out successful!');
    } catch (error) {
      console.error('Sign out failed:', error);
      toast.error(`Sign out failed: ${error.message}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">Google Sign-In Test</h3>
      
      <div className="space-y-4">
        <div>
          <strong>Firebase Auth State:</strong>
          <div className="text-sm text-gray-600 mt-1">
            {auth ? '✅ Firebase initialized' : '❌ Firebase not initialized'}
          </div>
        </div>

        <div>
          <strong>Current User:</strong>
          <div className="text-sm text-gray-600 mt-1">
            {currentUser ? (
              <div>
                <div>Name: {currentUser.displayName || 'N/A'}</div>
                <div>Email: {currentUser.email}</div>
                <div>Provider: {currentUser.provider || 'N/A'}</div>
                <div>Role: {currentUser.role}</div>
                {currentUser.photoURL && (
                  <div className="mt-2">
                    <img 
                      src={currentUser.photoURL} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                )}
              </div>
            ) : (
              'No user signed in'
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          {!currentUser ? (
            <button
              onClick={handleTestGoogleSignIn}
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Google Sign-In'}
            </button>
          ) : (
            <button
              onClick={handleTestSignOut}
              className="btn-outline flex-1"
            >
              Test Sign Out
            </button>
          )}
        </div>

        <div className="text-xs text-gray-500">
          This component helps verify that Google Sign-In is properly configured.
          Check the browser console for detailed logs.
        </div>
      </div>
    </div>
  );
};

export default GoogleSignInTest;
