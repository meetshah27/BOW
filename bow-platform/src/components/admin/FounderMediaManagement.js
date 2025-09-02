import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Image, 
  Video, 
  Save, 
  X,
  Eye,
  FileText,
  User,
  Star,
  Plus,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../config/api';

const FounderMediaManagement = () => {
  const [founderMedia, setFounderMedia] = useState({
    founderName: 'Deepali Sane',
    mediaType: 'image',
    mediaUrl: '',
    thumbnailUrl: '',
    title: '',
    description: '',
    altText: '',
    isActive: true,
    overlayOpacity: 0.1,
    founderRole: 'Vice Chair & Co-Founder',
    founderBio: ''
  });

  const [aandSaneContent, setAandSaneContent] = useState({
    name: 'Aand Sane',
    role: 'Board Chair & Co-Founder',
    partnership: 'Partnering with Deepali Sane',
    description: 'Aand Sane & Deepali Sane are the visionary co-founders of Beats of Washington, whose shared passion for community building through music has inspired thousands across Washington State. As Board Chair, Aand continues to lead our organization with dedication and innovative thinking, working closely with Deepali to guide our mission together.',
    traits: ['Visionary Leader', 'Community Builder'],
    avatar: 'A',
    isActive: true
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchFounderMedia();
    fetchFounderContent();
  }, []);

  const fetchFounderMedia = async () => {
    try {
      setLoading(true);
      const res = await api.get('founder-media');
      if (res.ok) {
        const data = await res.json();
        
        // Ensure overlayOpacity has a valid default value
        const founderMediaWithDefaults = {
          ...data,
          overlayOpacity: data.overlayOpacity !== undefined && !isNaN(data.overlayOpacity) ? data.overlayOpacity : 0.1
        };
        
        setFounderMedia(founderMediaWithDefaults);
        setPreviewUrl(data.mediaUrl);
        console.log('✅ Founder media loaded:', founderMediaWithDefaults);
      } else {
        console.error('Failed to fetch founder media');
        toast.error('Failed to load founder media');
      }
    } catch (error) {
      console.error('Error fetching founder media:', error);
      toast.error('Error loading founder media');
    } finally {
      setLoading(false);
    }
  };

  const fetchFounderContent = async () => {
    try {
      const res = await api.get('/founder-content/admin');
      if (res.ok) {
        const data = await res.json();
        // Extract Aand Sane's content
        if (data.aandSane) {
          setAandSaneContent(data.aandSane);
        }
        console.log('✅ Founder content loaded:', data.aandSane);
      } else {
        console.error('Failed to fetch founder content');
      }
    } catch (error) {
      console.error('Error fetching founder content:', error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Ensure media type is set before saving (only if media is being uploaded)
      if (founderMedia.mediaUrl && !founderMedia.mediaType) {
        toast.error('Please select a media type (image or video)');
        setSaving(false);
        return;
      }
      
      console.log('💾 Saving founder media with data:', founderMedia);
      console.log('💾 Saving founder content with data:', aandSaneContent);
      
      // Save founder media
      const mediaResponse = await api.put('founder-media', founderMedia);
      
      // Save founder content - we need to get the full structure first
      console.log('🔄 Fetching full founder content structure...');
      const fullContentResponse = await api.get('/founder-content/admin');
      let fullContent = {};
      
      if (fullContentResponse.ok) {
        fullContent = await fullContentResponse.json();
        console.log('✅ Full content structure loaded:', fullContent);
      } else {
        console.error('❌ Failed to fetch full content structure');
        const errorText = await fullContentResponse.text();
        console.error('Error response:', errorText);
      }
      
      // Update only the aandSane part
      const updatedContent = {
        ...fullContent,
        aandSane: aandSaneContent
      };
      
      console.log('📤 Sending updated content to save:', updatedContent);
      const contentResponse = await api.post('/founder-content', updatedContent);
      
      if (mediaResponse.ok && contentResponse.ok) {
        const mediaResult = await mediaResponse.json();
        const contentResult = await contentResponse.json();
        console.log('✅ Save responses:', { mediaResult, contentResult });
        toast.success('Founder media and content saved successfully!');
        await fetchFounderMedia(); // Refresh data
        await fetchFounderContent(); // Refresh content data
      } else {
        const mediaError = mediaResponse.ok ? null : await mediaResponse.json();
        const contentError = contentResponse.ok ? null : await contentResponse.json();
        console.error('❌ Save failed:', { mediaError, contentError });
        
        // Show specific error messages
        if (!mediaResponse.ok && !contentResponse.ok) {
          toast.error(`Failed to save both media and content. Media: ${mediaError?.message || 'Unknown error'}, Content: ${contentError?.message || 'Unknown error'}`);
        } else if (!mediaResponse.ok) {
          toast.error(`Failed to save media: ${mediaError?.message || 'Unknown error'}`);
        } else if (!contentResponse.ok) {
          toast.error(`Failed to save content: ${contentError?.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error saving founder data:', error);
      toast.error('Error saving founder data');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      console.log('📁 Starting file upload for:', file.name, 'Type:', file.type, 'Size:', file.size);
      
      const formData = new FormData();
      formData.append('media', file);
      formData.append('type', 'founder-media');
      formData.append('founderName', founderMedia.founderName);

      console.log('📤 FormData created with fields:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }
      console.log('📤 Sending to upload/founder endpoint...');
      const response = await api.upload('upload/founder', formData);
      
      console.log('📥 Upload response received:', response.status, response.statusText);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Upload successful:', result);
        
        setFounderMedia(prev => ({
          ...prev,
          mediaUrl: result.data.fileUrl,
          thumbnailUrl: result.data.fileUrl,
          mediaType: file.type.startsWith('image/') ? 'image' : 'video',
          isActive: true // Automatically activate media when uploaded
        }));
        
        setPreviewUrl(result.data.fileUrl);
        toast.success('File uploaded successfully!');
      } else {
        const errorData = await response.json();
        console.error('❌ Upload failed:', errorData);
        toast.error(errorData.message || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ Error uploading file:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('Network error: Unable to connect to server. Please check your connection.');
      } else if (error.message) {
        toast.error(`Upload error: ${error.message}`);
      } else {
        toast.error('Error uploading file. Please try again.');
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log('📁 File selected:', file);
    
    if (file) {
      console.log('📋 File details:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: new Date(file.lastModified).toISOString()
      });
      
      // Validate file type and size
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        // Check file size (50MB limit)
        const maxSize = 50 * 1024 * 1024; // 50MB in bytes
        if (file.size > maxSize) {
          console.log('❌ File too large:', file.size, 'bytes (max:', maxSize, 'bytes)');
          toast.error('File size must be less than 50MB');
          return;
        }
        
        console.log('✅ File type and size validated, proceeding with upload...');
        handleFileUpload(file);
      } else {
        console.log('❌ Invalid file type:', file.type);
        toast.error('Please select an image or video file');
      }
    } else {
      console.log('⚠️  No file selected');
    }
  };

  const handleRemoveMedia = () => {
    setFounderMedia(prev => ({
      ...prev,
      mediaUrl: '',
      thumbnailUrl: '',
      mediaType: 'image'
    }));
    setPreviewUrl('');
    toast.success('Media removed');
  };

  const handleInputChange = (field, value) => {
    setFounderMedia(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAandSaneContentChange = (field, value) => {
    setAandSaneContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTraitChange = (index, value) => {
    const newTraits = [...aandSaneContent.traits];
    newTraits[index] = value;
    handleAandSaneContentChange('traits', newTraits);
  };

  const addTrait = () => {
    const newTraits = [...aandSaneContent.traits, 'New Trait'];
    handleAandSaneContentChange('traits', newTraits);
  };

  const removeTrait = (index) => {
    const newTraits = aandSaneContent.traits.filter((_, i) => i !== index);
    handleAandSaneContentChange('traits', newTraits);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading founder media...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Star className="w-8 h-8 mr-3 text-primary-600" />
            Founder Media Management
          </h2>
          <p className="text-gray-600 mt-2">Manage photos and videos for Aand Sane's founder section</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Media Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Upload className="w-6 h-6 mr-2 text-primary-600" />
            Upload Media
          </h3>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Image or Video
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-400 transition-colors"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('border-primary-400', 'bg-primary-50');
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-primary-400', 'bg-primary-50');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-primary-400', 'bg-primary-50');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                  console.log('📁 File dropped:', files[0]);
                  handleFileChange({ target: { files } });
                }
              }}
            >
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                id="founder-media-upload"
              />
              <label
                htmlFor="founder-media-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-2">
                  <span className="text-primary-600 font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF, MP4, MOV up to 50MB</p>
              </label>
            </div>
          </div>

          {/* Media Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Media Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mediaType"
                  value="image"
                  checked={founderMedia.mediaType === 'image'}
                  onChange={(e) => handleInputChange('mediaType', e.target.value)}
                  className="mr-2"
                />
                <Image className="w-4 h-4 mr-1" />
                Image
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mediaType"
                  value="video"
                  checked={founderMedia.mediaType === 'video'}
                  onChange={(e) => handleInputChange('mediaType', e.target.value)}
                  className="mr-2"
                />
                <Video className="w-4 h-4 mr-1" />
                Video
              </label>
            </div>
          </div>

          {/* Media Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={founderMedia.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Deepali Sane at Community Event"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={founderMedia.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of the media content"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt Text (for accessibility)
              </label>
              <input
                type="text"
                value={founderMedia.altText}
                onChange={(e) => handleInputChange('altText', e.target.value)}
                placeholder="e.g., Deepali Sane speaking at community gathering"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overlay Opacity: {founderMedia.overlayOpacity}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={founderMedia.overlayOpacity}
                onChange={(e) => handleInputChange('overlayOpacity', parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Adjust the overlay opacity for better text readability</p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={founderMedia.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active (show on website)
              </label>
            </div>
          </div>
        </div>

        {/* Aand Sane Content Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <User className="w-6 h-6 mr-2 text-primary-600" />
            Aand Sane Details
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={aandSaneContent.name}
                  onChange={(e) => handleAandSaneContentChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Aand Sane"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={aandSaneContent.role}
                  onChange={(e) => handleAandSaneContentChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Board Chair & Co-Founder"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Partnership Text
              </label>
              <input
                type="text"
                value={aandSaneContent.partnership}
                onChange={(e) => handleAandSaneContentChange('partnership', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Partnering with Deepali Sane"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={aandSaneContent.description}
                onChange={(e) => handleAandSaneContentChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Aand Sane & Deepali Sane are the visionary co-founders..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar Letter
              </label>
              <input
                type="text"
                value={aandSaneContent.avatar}
                onChange={(e) => handleAandSaneContentChange('avatar', e.target.value)}
                className="w-16 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-lg font-bold"
                placeholder="A"
                maxLength={1}
              />
            </div>

            {/* Traits */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Key Traits
                </label>
                <button
                  onClick={addTrait}
                  className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2">
                {aandSaneContent.traits.map((trait, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={trait}
                      onChange={(e) => handleTraitChange(index, e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                      placeholder="Trait description"
                    />
                    <button
                      onClick={() => removeTrait(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-gray-600">Active Status</span>
              <button
                onClick={() => handleAandSaneContentChange('isActive', !aandSaneContent.isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  aandSaneContent.isActive ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    aandSaneContent.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Eye className="w-6 h-6 mr-2 text-primary-600" />
            Preview
          </h3>

          {/* Media Preview */}
          <div className="mb-6">
            {previewUrl ? (
              <div className="relative">
                {founderMedia.mediaType === 'image' ? (
                  <img
                    src={previewUrl}
                    alt={founderMedia.altText || 'Founder media preview'}
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                  />
                ) : (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-64 object-cover rounded-xl shadow-lg bg-black"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
                
                {/* Overlay Preview */}
                <div 
                  className="absolute inset-0 bg-primary-600 rounded-xl pointer-events-none"
                  style={{ opacity: founderMedia.overlayOpacity }}
                ></div>
                
                {/* Remove Button */}
                <button
                  onClick={handleRemoveMedia}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-secondary-100 to-primary-100 rounded-xl shadow-lg flex items-center justify-center">
                <div className="text-center text-secondary-600">
                  <User className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-semibold">No Media Uploaded</p>
                  <p className="text-sm text-gray-500">Upload a photo or video to see preview</p>
                </div>
              </div>
            )}
          </div>

          {/* Media Info */}
          {previewUrl && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Type:</span>
                <span className="text-sm text-gray-900 capitalize">{founderMedia.mediaType}</span>
              </div>
              {founderMedia.title && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Title:</span>
                  <span className="text-sm text-gray-900">{founderMedia.title}</span>
                </div>
              )}
              {founderMedia.description && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Description:</span>
                  <span className="text-sm text-gray-900">{founderMedia.description}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  founderMedia.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {founderMedia.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary text-lg px-8 py-4 flex items-center"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Saving...' : 'Save Founder Media & Content'}
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          How to Use
        </h4>
        <ul className="text-blue-800 space-y-2 text-sm">
          <li>• Upload a high-quality photo or video of Aand Sane</li>
          <li>• Edit founder content including name, role, and description</li>
          <li>• Add or remove key traits that describe the founder</li>
          <li>• Add a descriptive title and description for better context</li>
          <li>• Adjust overlay opacity to ensure text remains readable</li>
          <li>• Set the media and content as active to display on the About page</li>
          <li>• The media and content will appear in Aand Sane's founder section</li>
        </ul>
      </div>
    </div>
  );
};

export default FounderMediaManagement;
