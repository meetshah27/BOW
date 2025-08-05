# ImagePlaceholder Component Guide

## Overview

The `ImagePlaceholder` component is a reusable React component that provides a standardized way to handle image display with fallback placeholders and interactive actions for removing/replacing images.

## Features

### 1. Standard Size Placeholder
- Uses a consistent 200x200 SVG placeholder image
- Maintains aspect ratio and proper sizing across different contexts
- Provides visual feedback when images fail to load

### 2. Remove/Replace Functionality
- **Remove**: Allows users to remove the image from the gallery item
- **Replace**: Enables users to upload a new image to replace the existing one
- Hover-activated action buttons for better UX

### 3. Flexible Configuration
- Customizable CSS classes for both image and placeholder
- Optional action buttons (can be disabled for read-only views)
- Support for custom error handling

## Usage

### Basic Usage
```jsx
import ImagePlaceholder from '../components/common/ImagePlaceholder';

<ImagePlaceholder
  src={item.imageUrl}
  alt={item.title}
  className="w-full h-48 object-cover"
/>
```

### With Actions (Admin Panel)
```jsx
<ImagePlaceholder
  src={item.imageUrl}
  alt={item.title}
  className="w-full h-48 object-cover"
  showActions={true}
  onRemove={() => handleRemoveImage(item)}
  onReplace={() => handleReplaceImage(item)}
>
  {/* Additional content like badges */}
  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
    {item.type === 'video' ? 'Video' : 'Image'}
  </div>
</ImagePlaceholder>
```

### Read-only Usage (Public Gallery)
```jsx
<ImagePlaceholder
  src={item.thumbnail}
  alt={item.title}
  className="w-full h-48 object-contain bg-gray-100"
  placeholderClassName="w-full h-48 bg-gray-100 flex items-center justify-center"
  showActions={false} // No actions for public view
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | - | Image source URL |
| `alt` | string | - | Alt text for accessibility |
| `className` | string | "w-full h-48 object-cover" | CSS classes for the image |
| `placeholderClassName` | string | "w-full h-48 bg-gray-100 flex items-center justify-center" | CSS classes for the placeholder |
| `onError` | function | - | Custom error handler |
| `onRemove` | function | - | Function called when remove button is clicked |
| `onReplace` | function | - | Function called when replace button is clicked |
| `showActions` | boolean | false | Whether to show remove/replace buttons |
| `children` | ReactNode | - | Additional content to render inside the component |

## Implementation Details

### Placeholder SVG
The component uses a base64-encoded SVG that provides:
- Light gray background (#F3F4F6)
- Simple camera icon in darker gray (#9B9BA0)
- Consistent 200x200 dimensions

### Action Buttons
- **Upload Icon**: For replacing images
- **Trash Icon**: For removing images
- Hover-activated overlay with semi-transparent background
- Smooth transitions and hover effects

### Error Handling
- Automatically detects image load failures
- Falls back to placeholder when `src` is null/undefined or fails to load
- Supports custom error handlers via `onError` prop

## Integration Points

### AdminPanel.js
- Gallery management with full CRUD operations
- Remove/replace functionality for existing gallery items
- Preview in edit modals

### GalleryPage.js
- Public gallery display (read-only)
- Modal image viewing
- Consistent placeholder across all image displays

## Benefits

1. **Consistency**: Standardized placeholder across the application
2. **User Experience**: Clear visual feedback and intuitive actions
3. **Maintainability**: Centralized image handling logic
4. **Accessibility**: Proper alt text and semantic structure
5. **Flexibility**: Configurable for different use cases

## Future Enhancements

- Support for video placeholders
- Loading states with skeleton animations
- Image optimization and lazy loading
- Drag-and-drop functionality for replacements 