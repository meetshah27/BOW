import React, { useState } from 'react';
import { Image, X, Upload, Trash2, Video } from 'lucide-react';

const ImagePlaceholder = ({ 
  src, 
  alt, 
  className = "w-full h-48 object-cover", 
  placeholderClassName = "w-full h-48 bg-gray-100 flex items-center justify-center",
  onError,
  onRemove,
  onReplace,
  showActions = false,
  children 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Standard placeholder SVG (200x200)
  const placeholderSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCAxMDBDODAgODkuNTQ0NyA4OC4wMDAxIDgxIDk4IDgxSDEwMkMxMTEuOTk5OSA4MSAxMjAgODkuNTQ0NyAxMjAgMTAwVjEwNEMxMjAgMTE0LjQ1NSAxMTEuOTk5OSAxMjMgMTAyIDEyM0g5OEM4OC4wMDAxIDEyMyA4MCAxMTQuNDU1IDgwIDEwNFYxMDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMDAgMTMwQzExMC40NTUgMTMwIDExOSAxMjEuNDU1IDExOSAxMTFDMTE5IDEwMC41NDUgMTEwLjQ1NSA5MiAxMDAgOTJDODkuNTQ0NyA5MiA4MSAxMDAuNTQ1IDgxIDExMUM4MSAxMjEuNDU1IDg5LjU0NDcgMTMwIDEwMCAxMzBaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';

  // Check if the source is a video
  const isVideo = src && (
    src.includes('.mp4') || 
    src.includes('.mov') || 
    src.includes('.avi') || 
    src.includes('.webm') || 
    src.includes('.mkv')
  );

  const handleImageError = (e) => {
    setImageError(true);
    if (onError) {
      onError(e);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  const handleReplace = (e) => {
    e.stopPropagation();
    if (onReplace) {
      onReplace();
    }
  };

  // If no source, show placeholder
  if (!src) {
    return (
      <div 
        className={`relative ${placeholderClassName}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          src={placeholderSvg} 
          alt="Placeholder" 
          className="w-full h-full object-contain"
        />
        
        {/* Placeholder Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image className="w-12 h-12 text-gray-400" />
        </div>

        {/* Action Buttons */}
        {showActions && isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-4">
            {onReplace && (
              <button
                onClick={handleReplace}
                className="bg-white text-gray-700 p-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200"
                title="Replace Media"
              >
                <Upload className="w-5 h-5" />
              </button>
            )}
            {onRemove && (
              <button
                onClick={handleRemove}
                className="bg-white text-gray-700 p-3 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200"
                title="Remove Media"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Placeholder Text */}
        <div className="absolute bottom-2 left-2 right-2 text-center">
          <p className="text-xs text-gray-500 bg-white bg-opacity-90 px-2 py-1 rounded">
            No media
          </p>
        </div>

        {children}
      </div>
    );
  }

  // If it's a video, render video element
  if (isVideo) {
    return (
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <video
          src={src}
          className={className}
          controls
          preload="metadata"
        />
        
        {/* Action Buttons Overlay */}
        {showActions && isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-4">
            {onReplace && (
              <button
                onClick={handleReplace}
                className="bg-white text-gray-700 p-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200"
                title="Replace Video"
              >
                <Upload className="w-5 h-5" />
              </button>
            )}
            {onRemove && (
              <button
                onClick={handleRemove}
                className="bg-white text-gray-700 p-3 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200"
                title="Remove Video"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {children}
      </div>
    );
  }

  // If image failed to load, show placeholder with actions
  if (imageError) {
    return (
      <div 
        className={`relative ${placeholderClassName}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          src={placeholderSvg} 
          alt="Placeholder" 
          className="w-full h-full object-contain"
        />
        
        {/* Placeholder Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image className="w-12 h-12 text-gray-400" />
        </div>

        {/* Action Buttons */}
        {showActions && isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-4">
            {onReplace && (
              <button
                onClick={handleReplace}
                className="bg-white text-gray-700 p-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200"
                title="Replace Image"
              >
                <Upload className="w-5 h-5" />
              </button>
            )}
            {onRemove && (
              <button
                onClick={handleRemove}
                className="bg-white text-gray-700 p-3 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200"
                title="Remove Image"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Placeholder Text */}
        <div className="absolute bottom-2 left-2 right-2 text-center">
          <p className="text-xs text-gray-500 bg-white bg-opacity-90 px-2 py-1 rounded">
            Image failed to load
          </p>
        </div>

        {children}
      </div>
    );
  }

  // Show actual image with overlay actions
  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleImageError}
      />
      
      {/* Action Buttons Overlay */}
      {showActions && isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-4">
          {onReplace && (
            <button
              onClick={handleReplace}
              className="bg-white text-gray-700 p-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200"
              title="Replace Image"
            >
              <Upload className="w-5 h-5" />
            </button>
          )}
          {onRemove && (
            <button
              onClick={handleRemove}
              className="bg-white text-gray-700 p-3 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200"
              title="Remove Image"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {children}
    </div>
  );
};

export default ImagePlaceholder; 