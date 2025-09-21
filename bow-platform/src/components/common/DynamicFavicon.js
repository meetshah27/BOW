import React, { useEffect } from 'react';

const DynamicFavicon = ({ logoUrl }) => {
  useEffect(() => {
    if (logoUrl && logoUrl.startsWith('http')) {
      // Create a new favicon link element
      const createFavicon = (url, sizes = '') => {
        // Remove existing favicon links
        const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
        existingFavicons.forEach(link => link.remove());
        
        // Create new favicon link
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = url;
        if (sizes) {
          favicon.sizes = sizes;
        }
        favicon.type = 'image/png';
        
        // Add to document head
        document.head.appendChild(favicon);
        
        return favicon;
      };

      // Create multiple favicon sizes using the same logo URL
      createFavicon(logoUrl, '192x192');
      createFavicon(logoUrl, '512x512');
      
      // Also update the manifest.json icon reference (this would require a backend update)
      // For now, we'll update the favicon which is the most visible
      
      console.log('🎨 Dynamic favicon updated with uploaded logo:', logoUrl);
    }
  }, [logoUrl]);

  // This component doesn't render anything visible
  return null;
};

export default DynamicFavicon;
