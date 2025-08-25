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
  Settings
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../config/api';

const MissionMediaManagement = () => {
  const [missionMedia, setMissionMedia] = useState({
    mediaType: 'image',
    mediaUrl: '',
    thumbnailUrl: '',
    title: 'Our Mission',
    description: 'Beats of Washington Mission',
    altText: 'Mission media',
    isActive: true
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchMissionMedia();
  }, []);

  const fetchMissionMedia = async () => {
    try {
      setLoading(true);
      const res = await api.get('/mission-media');
      if (res.ok) {
        const data = await res.json();
        setMissionMedia(data);
        setPreviewUrl(data.mediaUrl);
        console.log('✅ Mission media loaded:', data);
      } else {
        console.error('Failed to fetch mission media');
        toast.error('Failed to load mission media');
      }
    } catch (error) {
      console.error('Error fetching mission media:', error);
      toast.error('Error loading mission media');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!missionMedia.mediaUrl) {
      toast.error('Please upload a media file first');
      return;
    }

    try {
      setSaving(true);
      
      // Ensure media type is set before saving
      if (!missionMedia.mediaType) {
        toast.error('Please select a media type (image or video)');
        setSaving(false);
        return;
      }
      
      const response = await api.put('/mission-media', missionMedia);
      
      if (response.ok) {
        toast.success('Mission media saved successfully!');
        // Refresh the data to show the updated values
        await fetchMissionMedia();
      } else {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        toast.error(errorData.error || 'Failed to save mission media');
      }
    } catch (error) {
      console.error('Error saving mission media:', error);
      toast.error('Error saving mission media');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (files) => {
    if (files.length > 0) {
      const file = files[0];
      
      // Determine file type and set mediaType accordingly
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      if (!isVideo && !isImage) {
        toast.error('Please upload an image or video file');
        return;
      }
      
      // Set the media type based on file type
      const newMediaType = isVideo ? 'video' : 'image';
      
      try {
        // Show uploading state
        toast.loading('Uploading file to S3...');
        
        // Create FormData for upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'mission');
        
        // Upload to S3
        const response = await api.upload('/upload/single', formData);
        
        if (response.ok) {
          const result = await response.json();
          
          if (result.success) {
            // Get the permanent S3 URL
            const fileUrl = result.data.fileUrl;
            
            setMissionMedia(prev => ({
              ...prev,
              mediaType: newMediaType,
              mediaUrl: fileUrl
            }));
            
            setPreviewUrl(fileUrl);
            setUploadedFiles(files);
            toast.dismiss();
            toast.success(`${newMediaType.charAt(0).toUpperCase() + newMediaType.slice(1)} uploaded successfully!`);
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
        setMissionMedia(prev => ({
          ...prev,
          mediaType: newMediaType,
          mediaUrl: fileUrl
        }));
        setPreviewUrl(fileUrl);
        setUploadedFiles(files);
      }
    }
  };

  const handleFileRemove = () => {
    setUploadedFiles([]);
    setMissionMedia(prev => ({
      ...prev,
      mediaUrl: ''
    }));
    setPreviewUrl('');
  };

  const handleInputChange = (field, value) => {
    setMissionMedia(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleActive = () => {
    setMissionMedia(prev => ({
      ...prev,
      isActive: !prev.isActive
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Loading mission media...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary-600" />
            Mission Media Management
          </h2>
          <p className="text-gray-600 mt-1">
            Upload and manage the mission image or video for the About page
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="space-y-6">
          {/* Media Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mediaType"
                  value="image"
                  checked={missionMedia.mediaType === 'image'}
                  onChange={(e) => handleInputChange('mediaType', e.target.value)}
                  className="mr-2 text-primary-600"
                />
                <Image className="w-5 h-5 mr-2 text-gray-600" />
                Image
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mediaType"
                  value="video"
                  checked={missionMedia.mediaType === 'video'}
                  onChange={(e) => handleInputChange('mediaType', e.target.value)}
                  className="mr-2 text-primary-600"
                />
                <Video className="w-5 h-5 mr-2 text-gray-600" />
                Video
              </label>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload {missionMedia.mediaType === 'image' ? 'Image' : 'Video'}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
              <input
                type="file"
                accept={missionMedia.mediaType === 'image' ? 'image/*' : 'video/*'}
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="mission-media-upload"
              />
              <label htmlFor="mission-media-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  {missionMedia.mediaType === 'image' 
                    ? 'PNG, JPG, GIF up to 50MB' 
                    : 'MP4, MOV, AVI up to 50MB'
                  }
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
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={missionMedia.title}
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
              value={missionMedia.description}
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
              value={missionMedia.altText}
              onChange={(e) => handleInputChange('altText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter alt text"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <p className="text-sm text-gray-500">
                {missionMedia.isActive ? 'Active and visible on About page' : 'Hidden from About page'}
              </p>
            </div>
            <button
              onClick={toggleActive}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                missionMedia.isActive ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  missionMedia.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving || !missionMedia.mediaUrl}
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
                Save Mission Media
              </>
            )}
          </button>
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
                {missionMedia.mediaType === 'image' ? (
                  <img
                    src={previewUrl}
                    alt={missionMedia.altText}
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
                    <span className="font-medium capitalize">{missionMedia.mediaType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Title:</span>
                    <span className="font-medium">{missionMedia.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${missionMedia.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {missionMedia.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Upload a {missionMedia.mediaType} to see preview
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
              <p><strong>Media Type:</strong> {missionMedia.mediaType}</p>
              <p><strong>Title:</strong> {missionMedia.title}</p>
              <p><strong>Description:</strong> {missionMedia.description}</p>
              <p><strong>Status:</strong> {missionMedia.isActive ? 'Active' : 'Hidden'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionMediaManagement;
