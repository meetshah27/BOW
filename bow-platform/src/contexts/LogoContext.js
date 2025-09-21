import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const LogoContext = createContext();

export const useLogo = () => {
  const context = useContext(LogoContext);
  if (!context) {
    throw new Error('useLogo must be used within a LogoProvider');
  }
  return context;
};

export const LogoProvider = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLogo = async () => {
    try {
      const response = await api.get('/about-page');
      if (response.ok) {
        const data = await response.json();
        if (data.logo) {
          setLogoUrl(data.logo);
          console.log('🎨 Logo fetched and set:', data.logo);
        }
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogo();
    
    // Refresh logo every 30 seconds to catch updates
    const logoRefreshInterval = setInterval(fetchLogo, 30000);
    
    return () => clearInterval(logoRefreshInterval);
  }, []);

  const value = {
    logoUrl,
    loading,
    refreshLogo: fetchLogo
  };

  return (
    <LogoContext.Provider value={value}>
      {children}
    </LogoContext.Provider>
  );
};
