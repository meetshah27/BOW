import React, { createContext, useContext, useState } from 'react';

const CelebrationContext = createContext();

export const useCelebration = () => {
  const context = useContext(CelebrationContext);
  if (!context) {
    throw new Error('useCelebration must be used within a CelebrationProvider');
  }
  return context;
};

export const CelebrationProvider = ({ children }) => {
  const [confettiTrigger, setConfettiTrigger] = useState(false);

  const triggerConfetti = () => {
    setConfettiTrigger(true);
    setTimeout(() => setConfettiTrigger(false), 100);
  };

  const value = {
    confettiTrigger,
    triggerConfetti
  };

  return (
    <CelebrationContext.Provider value={value}>
      {children}
    </CelebrationContext.Provider>
  );
}; 