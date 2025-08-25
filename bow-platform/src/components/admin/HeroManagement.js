import React, { useState, useEffect } from 'react';
import { 
  Image, 
  Video, 
  Settings, 
  Upload, 
  Save, 
  Eye,
  EyeOff,
  RefreshCw,
  X
} from 'lucide-react';
import api from '../../config/api';
import toast from 'react-hot-toast';

const HeroManagement = () => {
  const [heroSettings, setHeroSettings] = useState({
    backgroundType: 'image',
    backgroundUrl: '',
    overlayOpacity: 0.2,
    title: 'Empowering Communities',
    subtitle: 'Through Music',
    description: 'Beats of Washington connects, inspires, and celebrates cultural diversity through music and community events across Washington State since 2019.',
    isActive: true
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    fetchHeroSettings();
  }, []);
  
  // Debug: Log whenever heroSettings changes
  useEffect(() => {
    console.log('Hero settings state changed:', heroSettings);
  }, [heroSettings]);
  


  const fetchHeroSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/hero');
      if (response.ok) {
        const data = await response.json();

        
        // Ensure we have default values for required fields
        const settingsWithDefaults = {
          backgroundType: 'image', // Default to image
          backgroundUrl: '',
          overlayOpacity: 0.2,
          title: 'Empowering Communities',
          subtitle: 'Through Music',
          description: 'Beats of Washington connects, inspires, and celebrates cultural diversity through music and community events across Washington State since 2019.',
          isActive: true,
          ...data // Override with backend data if available
        };
        

        

        setHeroSettings(settingsWithDefaults);
      } else {
        console.error('Failed to fetch hero settings');
        toast.error('Failed to load hero settings');
      }
    } catch (error) {
      console.error('Error fetching hero settings:', error);
      toast.error('Error loading hero settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      

      
      // Ensure background type is set before saving
      if (!heroSettings.backgroundType) {
        toast.error('Please select a background type (image or video)');
        setSaving(false);
        return;
      }
      
      // If no file is uploaded, use a placeholder URL for now
      if (!heroSettings.backgroundUrl) {
        // Set a default placeholder URL based on background type
        const placeholderUrl = heroSettings.backgroundType === 'image' 
          ? 'https://via.placeholder.com/1920x1080/4F46E5/FFFFFF?text=Upload+Your+Image'
          : 'https://via.placeholder.com/1920x1080/4F46E5/FFFFFF?text=Upload+Your+Video';
        
        setHeroSettings(prev => ({
          ...prev,
          backgroundUrl: placeholderUrl
        }));
      }
      
      const response = await api.put('/hero', heroSettings);
      
      if (response.ok) {
        toast.success('Hero settings saved successfully!');
        // Don't reload the page, just show success message
        // The changes will be visible in the preview
      } else {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        toast.error(errorData.error || 'Failed to save hero settings');
      }
    } catch (error) {
      console.error('Error saving hero settings:', error);
      toast.error('Error saving hero settings');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (files) => {
    if (files.length > 0) {
      const file = files[0];
      
      // Determine file type and set backgroundType accordingly
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      if (!isVideo && !isImage) {
        toast.error('Please upload an image or video file');
        return;
      }
      
      // Set the background type based on file type
      const newBackgroundType = isVideo ? 'video' : 'image';
      
      try {
        // Show uploading state
        toast.loading('Uploading file to S3...');
        
        // Create FormData for upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'hero');
        
        // Upload to S3
        const response = await api.upload('/upload/single', formData);
        
        if (response.ok) {
          const result = await response.json();
          
          if (result.success) {
            // Get the permanent S3 URL
            const fileUrl = result.data.fileUrl;
            
            setHeroSettings(prev => {
              const newSettings = {
                ...prev,
                backgroundType: newBackgroundType,
                backgroundUrl: fileUrl
              };
              return newSettings;
            });
            
            setUploadedFiles(files);
            toast.dismiss();
            toast.success(`${newBackgroundType.charAt(0).toUpperCase() + newBackgroundType.slice(1)} uploaded successfully!`);
          } else {
            throw new Error(result.error || 'Upload failed');
          }
        } else {
          throw new Error('Upload request failed');
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.dismiss();
        toast.error(`Upload failed: ${error.message}`);
        
        // Fallback to local blob URL for preview (but won't persist)
        const fileUrl = URL.createObjectURL(file);
        setHeroSettings(prev => {
          const newSettings = {
            ...prev,
            backgroundType: newBackgroundType,
            backgroundUrl: fileUrl
          };
          return newSettings;
        });
        setUploadedFiles(files);
      }
    }
  };

  const handleFileRemove = () => {
    setUploadedFiles([]);
    setHeroSettings(prev => ({
      ...prev,
      backgroundUrl: ''
    }));
  };

  const handleInputChange = (field, value) => {
    setHeroSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Loading hero settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hero Section Management</h2>
          <p className="text-gray-600">Customize your homepage hero section with dynamic backgrounds and content</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 rounded-lg border ${
              previewMode 
                ? 'bg-blue-100 border-blue-300 text-blue-700' 
                : 'bg-gray-100 border-gray-300 text-gray-700'
            } hover:bg-opacity-80 transition-colors`}
          >
            {previewMode ? <EyeOff className="w-4 h-4 mr-2 inline" /> : <Eye className="w-4 h-4 mr-2 inline" />}
            {previewMode ? 'Hide Preview' : 'Show Preview'}
          </button>




          
          <button
            onClick={handleSave}
            disabled={saving || !heroSettings.backgroundType}
            className={`px-6 py-2 ${
              saving || !heroSettings.backgroundType
                ? 'bg-gray-400 cursor-not-allowed'
                : 'btn-primary'
            }`}
            title={
              !heroSettings.backgroundType
                ? 'Please select a background type first'
                : 'Save hero settings'
            }
          >
            {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Background Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="backgroundType"
                  value="image"
                  checked={heroSettings.backgroundType === 'image'}
                  onChange={(e) => handleInputChange('backgroundType', e.target.value)}
                  className="mr-2"
                />
                <Image className="w-5 h-5 mr-2 text-gray-600" />
                Image
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="backgroundType"
                  value="video"
                  checked={heroSettings.backgroundType === 'video'}
                  onChange={(e) => handleInputChange('backgroundType', e.target.value)}
                  className="mr-2"
                />
                <Video className="w-5 h-4 mr-2 text-gray-600" />
                Video
              </label>
            </div>
          </div>

                     {/* Background Upload */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Background {heroSettings.backgroundType === 'image' ? 'Image' : 'Video'}
             </label>
             
                                                       {/* Status indicator */}
               <div className="mb-3 p-3 bg-gray-50 rounded-lg border">
                 <div className="flex items-center justify-between text-sm">
                   <span className="font-medium">Status:</span>
                   <div className="flex items-center space-x-2">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                       heroSettings.backgroundType ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                     }`}>
                       {heroSettings.backgroundType || 'Not set'}
                     </span>
                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                       heroSettings.backgroundUrl ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                     }`}>
                       {heroSettings.backgroundUrl ? 'File ready' : 'No file'}
                     </span>
                   </div>
                 </div>
                 
                                   {/* Status info */}
                  <div className="mt-2 text-xs text-gray-500">
                    <div>Status: {heroSettings.backgroundType ? 'Ready to save' : 'Select background type'}</div>
                    <div>File: {heroSettings.backgroundUrl ? 'Uploaded' : 'Not uploaded (will use placeholder)'}</div>
                  </div>
               </div>
             
                           {/* Simple File Upload */}
              <div className="space-y-3">
                <input
                  type="file"
                  accept={heroSettings.backgroundType === 'image' ? 'image/*' : 'video/*'}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      handleFileUpload(files);
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                
                {/* File Preview */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">Selected File:</div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
                      {uploadedFiles[0].type?.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(uploadedFiles[0])}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <Video className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{uploadedFiles[0].name}</div>
                        <div className="text-xs text-gray-500">
                          {(uploadedFiles[0].size / (1024 * 1024)).toFixed(2)} MB
                        </div>
                      </div>
                      <button
                        onClick={handleFileRemove}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
             
           </div>

          {/* Overlay Opacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overlay Opacity: {heroSettings.overlayOpacity}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={heroSettings.overlayOpacity}
              onChange={(e) => handleInputChange('overlayOpacity', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Content Settings */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Title
              </label>
              <input
                type="text"
                value={heroSettings.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Empowering Communities"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Subtitle
              </label>
              <input
                type="text"
                value={heroSettings.subtitle}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Through Music"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Description
              </label>
              <textarea
                value={heroSettings.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Description text..."
              />
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enable Hero Section
              </label>
              <p className="text-sm text-gray-500">Show or hide the hero section on the homepage</p>
            </div>
            <button
              onClick={() => handleInputChange('isActive', !heroSettings.isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                heroSettings.isActive ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  heroSettings.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
          {previewMode ? (
            <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white overflow-hidden rounded-lg h-96">
              {/* Background */}
              {heroSettings.backgroundUrl && (
                heroSettings.backgroundType === 'image' ? (
                  <img
                    src={heroSettings.backgroundUrl}
                    alt="Hero background"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={heroSettings.backgroundUrl}
                    autoPlay
                    muted
                    loop
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )
              )}
              
              {/* Overlay */}
              <div 
                className="absolute inset-0 bg-black"
                style={{ opacity: heroSettings.overlayOpacity }}
              />
              
              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col justify-center items-center text-center">
                <h1 className="text-4xl font-bold leading-tight mb-4">
                  {heroSettings.title}
                  <span className="block text-secondary-300">{heroSettings.subtitle}</span>
                </h1>
                <p className="text-lg mb-6 text-gray-100 leading-relaxed max-w-2xl">
                  {heroSettings.description}
                </p>
                <div className="flex gap-4">
                  <button className="btn-secondary px-6 py-3">
                    Find Events
                  </button>
                  <button className="btn-outline px-6 py-3 border-white text-white hover:bg-white hover:text-primary-600">
                    Get Involved
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-2" />
                <p>Click "Show Preview" to see how your hero section will look</p>
              </div>
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            <p><strong>Note:</strong> This preview shows how the hero section will appear on the homepage.</p>
            <p>Make sure to save your changes to apply them.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroManagement;
