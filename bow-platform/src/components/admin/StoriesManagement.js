import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Image, 
  Video, 
  Save, 
  RefreshCw, 
  X,
  Eye,
  EyeOff,
  FileText,
  Settings,
  BookOpen
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../config/api';

const StoriesManagement = () => {
  const [storiesMedia, setStoriesMedia] = useState({
    mediaType: 'image',
    mediaUrl: '',
    thumbnailUrl: '',
    title: '',
    description: '',
    altText: '',
    isActive: true,
    overlayOpacity: 0.2,
    storiesTitle: '',
    storiesDescription: '',
    storiesSubtitle: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchStoriesMedia();
  }, []);

  const fetchStoriesMedia = async () => {
    try {
      setLoading(true);
      const res = await api.get('/stories-media');
      if (res.ok) {
        const data = await res.json();
        
        // Ensure stories content fields have proper defaults
        const storiesMediaWithDefaults = {
          ...data,
          overlayOpacity: data.overlayOpacity !== undefined && !isNaN(data.overlayOpacity) ? data.overlayOpacity : 0.2
        };
        
        setStoriesMedia(storiesMediaWithDefaults);
        setPreviewUrl(data.mediaUrl);
        console.log('✅ Stories media loaded:', storiesMediaWithDefaults);
        console.log('🎯 Stories content check:');
        console.log('  - Title:', storiesMediaWithDefaults.storiesTitle);
        console.log('  - Description:', storiesMediaWithDefaults.storiesDescription);
        console.log('  - Subtitle:', storiesMediaWithDefaults.storiesSubtitle);
      } else {
        console.error('Failed to fetch stories media');
        toast.error('Failed to load stories media');
      }
    } catch (error) {
      console.error('Error fetching stories media:', error);
      toast.error('Error loading stories media');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Allow saving even without media file if user wants to edit content
    if (!storiesMedia.mediaUrl && !storiesMedia.storiesTitle && !storiesMedia.storiesDescription && !storiesMedia.storiesSubtitle) {
      toast.error('Please either upload a media file or enter some stories content to save');
      return;
    }

    try {
      setSaving(true);
      
      // Ensure media type is set before saving (only if media is being uploaded)
      if (storiesMedia.mediaUrl && !storiesMedia.mediaType) {
        toast.error('Please select a media type (image or video)');
        setSaving(false);
        return;
      }
      
      console.log('💾 Saving stories media with data:', storiesMedia);
      console.log('🎯 Stories content being saved:');
      console.log('  - Title:', storiesMedia.storiesTitle);
      console.log('  - Description:', storiesMedia.storiesDescription);
      console.log('  - Subtitle:', storiesMedia.storiesSubtitle);
      
      const response = await api.put('/stories-media', storiesMedia);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Save response:', result);
        toast.success('Stories media saved successfully!');
        
        // Don't refresh - keep the current form data visible
        // This prevents the content from disappearing
        console.log('💾 Form data preserved after save:', storiesMedia);
      } else {
        const errorData = await response.json();
        console.error('❌ Backend error:', errorData);
        toast.error(errorData.error || 'Failed to save stories media');
      }
    } catch (error) {
      console.error('❌ Error saving stories media:', error);
      toast.error('Error saving stories media');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (files) => {
    if (files.length > 0) {
      const file = files[0];
      
      // Check if the selected media type matches the file type
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      if (!isVideo && !isImage) {
        toast.error('Please upload an image or video file');
        return;
      }
      
      // Verify the file type matches the selected media type
      if ((storiesMedia.mediaType === 'video' && !isVideo) || 
          (storiesMedia.mediaType === 'image' && !isImage)) {
        toast.error(`Please upload a ${storiesMedia.mediaType} file. You selected ${storiesMedia.mediaType} but uploaded ${isVideo ? 'video' : 'image'}`);
        return;
      }
      
      try {
        // Show uploading state
        toast.loading(`Uploading ${storiesMedia.mediaType} to S3...`);
        
        // Create FormData for upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'stories');
        
        // Upload to S3
        const response = await api.upload('/upload/single', formData);
        
        if (response.ok) {
          const result = await response.json();
          
          if (result.success) {
            // Get the permanent S3 URL
            const fileUrl = result.data.fileUrl;
            
            setStoriesMedia(prev => ({
              ...prev,
              mediaUrl: fileUrl,
              // Clear thumbnail if switching from video to image
              thumbnailUrl: prev.mediaType === 'video' ? prev.thumbnailUrl : ''
            }));
            
            setPreviewUrl(fileUrl);
            setUploadedFiles(files);
            toast.dismiss();
            toast.success(`${storiesMedia.mediaType.charAt(0).toUpperCase() + storiesMedia.mediaType.slice(1)} uploaded successfully!`);
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
        setStoriesMedia(prev => ({
          ...prev,
          mediaUrl: fileUrl,
          // Clear thumbnail if switching from video to image
          thumbnailUrl: prev.mediaType === 'video' ? prev.thumbnailUrl : ''
        }));
        setPreviewUrl(fileUrl);
        setUploadedFiles(files);
      }
    }
  };

  const handleFileRemove = () => {
    setUploadedFiles([]);
    setStoriesMedia(prev => ({
      ...prev,
      mediaUrl: ''
    }));
    setPreviewUrl('');
  };

  const handleThumbnailUpload = async (files) => {
    if (files.length > 0) {
      const file = files[0];
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file for thumbnail');
        return;
      }
      
      try {
        toast.loading('Uploading thumbnail to S3...');
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'stories');
        
        const response = await api.upload('/upload/single', formData);
        
        if (response.ok) {
          const result = await response.json();
          
          if (result.success) {
            const thumbnailUrl = result.data.fileUrl;
            
            setStoriesMedia(prev => ({
              ...prev,
              thumbnailUrl: thumbnailUrl
            }));
            
            toast.dismiss();
            toast.success('Thumbnail uploaded successfully!');
          } else {
            throw new Error(result.error || 'Thumbnail upload failed');
          }
        } else {
          throw new Error('Thumbnail upload request failed');
        }
      } catch (error) {
        console.error('Thumbnail upload error:', error);
        toast.dismiss();
        toast.error(`Thumbnail upload failed: ${error.message}`);
      }
    }
  };

  const handleInputChange = (field, value) => {
    console.log(`🔄 handleInputChange called: ${field} = "${value}"`);
    console.log(`📝 Previous state:`, storiesMedia);
    
    // If switching media type, clear the current media and thumbnail
    if (field === 'mediaType') {
      setStoriesMedia(prev => {
        const newState = {
          ...prev,
          [field]: value,
          mediaUrl: '', // Clear current media
          thumbnailUrl: '', // Clear thumbnail
          title: '', // Clear title
          description: '', // Clear description
          altText: '' // Clear alt text
        };
        console.log(`✅ New state after media type change:`, newState);
        return newState;
      });
      setUploadedFiles([]);
      setPreviewUrl('');
    } else {
      setStoriesMedia(prev => {
        const newState = { ...prev, [field]: value };
        console.log(`✅ New state:`, newState);
        return newState;
      });
    }
  };

  const toggleActive = () => {
    setStoriesMedia(prev => ({
      ...prev,
      isActive: !prev.isActive
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading stories media...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Stories Media Management</h1>
          <p className="text-gray-600 mt-2">Upload and manage the stories image or video for the Stories page</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-600" />
                Media Upload
              </h3>
              
              {/* Media Type Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media Type
                </label>
                <div className="flex space-x-4">
                  <label className={`flex items-center px-3 py-2 rounded-lg border-2 transition-all cursor-pointer ${
                    storiesMedia.mediaType === 'image' 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="mediaType"
                      value="image"
                      checked={storiesMedia.mediaType === 'image'}
                      onChange={(e) => handleInputChange('mediaType', e.target.value)}
                      className="mr-2 text-primary-600 focus:ring-primary-500"
                    />
                    <Image className="w-4 h-4 mr-1" />
                    Image
                  </label>
                  <label className={`flex items-center px-3 py-2 rounded-lg border-2 transition-all cursor-pointer ${
                    storiesMedia.mediaType === 'video' 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="mediaType"
                      value="video"
                      checked={storiesMedia.mediaType === 'video'}
                      onChange={(e) => handleInputChange('mediaType', e.target.value)}
                      className="mr-2 text-primary-600 focus:ring-primary-500"
                    />
                    <Video className="w-4 h-4 mr-1" />
                    Video
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {storiesMedia.mediaType === 'video' 
                    ? 'Supported formats: MP4, WebM, OGG (max 100MB)' 
                    : 'Supported formats: PNG, JPG, GIF (max 10MB)'
                  }
                </p>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload {storiesMedia.mediaType === 'video' ? 'Video' : 'Image'} File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                  <input
                    type="file"
                    accept={storiesMedia.mediaType === 'video' ? 'video/*' : 'image/*'}
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {storiesMedia.mediaType === 'video' ? 'MP4, WebM, or OGG up to 100MB' : 'PNG, JPG, or GIF up to 10MB'}
                    </p>
                  </label>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <span className="text-green-700 text-sm">
                      {uploadedFiles[0].name} uploaded successfully
                    </span>
                    <button
                      onClick={handleFileRemove}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Video Thumbnail Upload */}
                {storiesMedia.mediaType === 'video' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Thumbnail (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleThumbnailUpload(e.target.files)}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <label htmlFor="thumbnail-upload" className="cursor-pointer">
                        <Image className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-600">
                          Click to upload thumbnail image
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, or GIF up to 5MB
                        </p>
                      </label>
                    </div>
                    
                    {storiesMedia.thumbnailUrl && (
                      <div className="mt-3 flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                        <span className="text-blue-700 text-sm">
                          Thumbnail uploaded successfully
                        </span>
                        <button
                          onClick={() => handleInputChange('thumbnailUrl', '')}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={storiesMedia.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={storiesMedia.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter description"
                />
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text (for accessibility)
                </label>
                <input
                  type="text"
                  value={storiesMedia.altText}
                  onChange={(e) => handleInputChange('altText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter alt text"
                />
              </div>

              {/* Stories Content Section */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  Stories Content (Stories Page)
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Edit the content that appears on the stories page header section.
                </p>
                
                {/* Stories Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stories Title
                  </label>
                  <input
                    type="text"
                    value={storiesMedia.storiesTitle || ''}
                    onChange={(e) => handleInputChange('storiesTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter stories title"
                  />
                </div>

                {/* Stories Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stories Description
                  </label>
                  <textarea
                    value={storiesMedia.storiesDescription || ''}
                    onChange={(e) => handleInputChange('storiesDescription', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter stories description"
                  />
                </div>

                {/* Stories Subtitle */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stories Subtitle
                  </label>
                  <textarea
                    value={storiesMedia.storiesSubtitle || ''}
                    onChange={(e) => handleInputChange('storiesSubtitle', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter stories subtitle"
                  />
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <p className="text-sm text-gray-500">
                    {storiesMedia.isActive ? 'Active and visible on Stories page' : 'Hidden from Stories page'}
                  </p>
                </div>
                <button
                  onClick={toggleActive}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    storiesMedia.isActive ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      storiesMedia.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Stories Media
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary-600" />
                Preview
              </h3>
              
              {previewUrl ? (
                <div className="bg-gray-100 rounded-lg p-4">
                  {storiesMedia.mediaType === 'image' ? (
                    <img
                      src={previewUrl}
                      alt={storiesMedia.altText}
                      className="w-full h-64 object-cover rounded-lg shadow-lg"
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      controls
                      className="w-full h-64 object-cover rounded-lg shadow-lg"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                  
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{storiesMedia.mediaType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Title:</span>
                      <span className="font-medium">{storiesMedia.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${storiesMedia.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {storiesMedia.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Upload a {storiesMedia.mediaType} to see preview
                  </p>
                </div>
              )}
            </div>

            {/* Current Settings Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Current Settings
              </h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Media Type:</strong> {storiesMedia.mediaType}</p>
                <p><strong>Title:</strong> {storiesMedia.title}</p>
                <p><strong>Description:</strong> {storiesMedia.description}</p>
                <p><strong>Status:</strong> {storiesMedia.isActive ? 'Active' : 'Hidden'}</p>
                <p><strong>Stories Title:</strong> {storiesMedia.storiesTitle || 'Not set'}</p>
                <p><strong>Stories Description:</strong> {storiesMedia.storiesDescription ? (storiesMedia.storiesDescription.length > 50 ? storiesMedia.storiesDescription.substring(0, 50) + '...' : storiesMedia.storiesDescription) : 'Not set'}</p>
                <p><strong>Stories Subtitle:</strong> {storiesMedia.storiesSubtitle ? (storiesMedia.storiesSubtitle.length > 50 ? storiesMedia.storiesSubtitle.substring(0, 50) + '...' : storiesMedia.storiesSubtitle) : 'Not set'}</p>
              </div>
            </div>

            {/* Stories Content Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary-600" />
                Stories Content Preview
              </h4>
              <div className="text-sm text-gray-800 space-y-3">
                <div>
                  <h5 className="font-semibold text-lg text-gray-900 mb-2">
                    {storiesMedia.storiesTitle}
                  </h5>
                  <p className="text-gray-700 leading-relaxed">
                    {storiesMedia.storiesDescription}
                  </p>
                  <p className="text-primary-600 italic mt-2">
                    {storiesMedia.storiesSubtitle}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  This is how your stories content will appear on the Stories page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoriesManagement; 