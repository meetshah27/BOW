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
    font-bold
    ${showBorder && !className.includes('border-') ? 'border-2 border-primary-600' : ''}
    ${className}
  `.trim();

  // Determine text color based on background
  const getTextColor = () => {
    // Check for dark backgrounds (gradients with dark colors, white backgrounds with specific classes)
    if (className.includes('bg-white/20') || 
        className.includes('bg-white/30') ||
        className.includes('from-primary-500') ||
        className.includes('from-primary-600') ||
        className.includes('text-white')) {
      return 'text-white';
    }
    // Default to primary color for light backgrounds
    return 'text-primary-700';
  };

  return (
    <div className={baseClasses}>
      <span className={`font-bold ${getTextColor()}`}>
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
