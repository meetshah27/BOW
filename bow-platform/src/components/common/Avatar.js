import React from 'react';

const Avatar = ({ 
  user, 
  size = 'md', 
  className = '', 
  showBorder = true,
  fallbackText = '?'
}) => {
  // Size configurations
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm', 
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-24 h-24 text-2xl',
    '3xl': 'w-32 h-32 text-4xl'
  };

  // Get user display properties
  const getUserInitial = () => {
    if (user?.displayName) return user.displayName[0].toUpperCase();
    if (user?.firstName) return user.firstName[0].toUpperCase();
    if (user?.name) return user.name[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return fallbackText;
  };

  const getAltText = () => {
    return user?.displayName || 
           user?.name || 
           `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 
           user?.email || 
           'User';
  };

  const baseClasses = `
    ${sizeClasses[size]} 
    rounded-full 
    flex 
    items-center 
    justify-center 
    relative 
    overflow-hidden
    ${showBorder ? 'border-2 border-primary-600' : ''}
    ${className}
  `.trim();

  return (
    <div className={baseClasses}>
      <span className="font-bold text-primary-700">
        {getUserInitial()}
      </span>
      {user?.photoURL ? (
        <img
          src={user.photoURL}
          alt={getAltText()}
          className="w-full h-full object-cover absolute inset-0"
          onError={(e) => {
            console.error('Failed to load avatar image:', user.photoURL);
            e.target.style.display = 'none';
          }}
        />
      ) : null}
    </div>
  );
};

export default Avatar;
