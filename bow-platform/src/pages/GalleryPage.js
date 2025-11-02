import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Image, 
  Video, 
  Filter, 
  Search, 
  Users,
  Heart,
  Share2,
  Download,
  X,
  Copy,
  ExternalLink,
  MessageCircle,
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast';
import ImagePlaceholder from '../components/common/ImagePlaceholder';
import api from '../config/api';
import HeroSection from '../components/common/HeroSection'; // Added import for HeroSection

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [likedItems, setLikedItems] = useState(new Set());
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');

  // Fetch logo from about page content
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch('/api/about-page');
        if (response.ok) {
          const data = await response.json();
          setLogoUrl(data.logo || '');
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
    fetchLogo();
  }, []);

  const categories = [
    { value: 'all', label: 'All Media', count: 0 },
    { value: 'events', label: 'Events', count: 0 },
    { value: 'workshops', label: 'Workshops', count: 0 },
    { value: 'community', label: 'Community', count: 0 },
    { value: 'performances', label: 'Performances', count: 0 }
  ];

  // Fetch gallery data from backend
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        const response = await api.get('/gallery');
        if (!response.ok) {
          throw new Error('Failed to fetch gallery items');
        }
        const data = await response.json();
        
        // Filter out items without valid image URLs and transform the data
        const transformedData = data
          .filter(item => item.imageUrl && item.imageUrl.trim() !== '') // Filter out items without image URLs
          .map(item => ({
            id: item.id,
            title: item.title || 'Untitled',
            type: item.imageUrl?.includes('.mp4') || item.imageUrl?.includes('.mov') || item.imageUrl?.includes('.avi') ? 'video' : 'image',
            category: item.album || 'general',
            url: item.imageUrl,
            thumbnail: item.imageUrl, // Use the same URL for thumbnail
            createdAt: item.createdAt,
            likes: 0,
            views: 0
          }));
        
        // Sort by creation date (newest first)
        const sortedData = transformedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setGalleryItems(sortedData);
        
        // Update category counts
        const categoryCounts = {};
        transformedData.forEach(item => {
          categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
        });
        
        categories.forEach(cat => {
          if (cat.value !== 'all') {
            cat.count = categoryCounts[cat.value] || 0;
          }
        });
        categories[0].count = transformedData.length; // All Media count
        
      } catch (err) {
        console.error('Error fetching gallery items:', err);
        setError(err.message);
        toast.error('Failed to load gallery items');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });


  const openModal = (item) => {
    setSelectedMedia(item);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  // Like functionality
  const handleLike = (itemId, e) => {
    e.stopPropagation();
    const newLikedItems = new Set(likedItems);
    
    if (newLikedItems.has(itemId)) {
      newLikedItems.delete(itemId);
      toast.success('Removed from favorites');
    } else {
      newLikedItems.add(itemId);
      toast.success('Added to favorites');
    }
    
    setLikedItems(newLikedItems);
    
    // Update likes count
    setGalleryItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, likes: newLikedItems.has(itemId) ? item.likes + 1 : item.likes - 1 }
        : item
    ));
  };

  // Share functionality
  const handleShare = (item, e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/gallery/${item.id}`;
    setShareUrl(shareUrl);
    setShowShareModal(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
      setShowShareModal(false);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const shareOnSocialMedia = (platform) => {
    const text = `Check out this amazing content from Beats of Washington: ${selectedMedia?.title}`;
    const url = shareUrl;
    
    let shareUrl_platform = '';
    switch (platform) {
      case 'facebook':
        shareUrl_platform = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl_platform = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl_platform = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl_platform, '_blank', 'width=600,height=400');
    setShowShareModal(false);
    toast.success(`Shared on ${platform}!`);
  };

  // Download functionality
  const handleDownload = async (item, e) => {
    e.stopPropagation();
    
    try {
      if (item.type === 'image') {
        // For images, create a download link
        const link = document.createElement('a');
        link.href = item.url;
        link.download = `${item.title.replace(/\s+/g, '_')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Image downloaded successfully!');
      } else if (item.type === 'video') {
        // For videos, we'll show a message since direct download might not work with external URLs
        toast.success('Video download started!');
        // In a real app, you'd have the video file on your server
        const link = document.createElement('a');
        link.href = item.url;
        link.download = `${item.title.replace(/\s+/g, '_')}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      toast.error('Download failed. Please try again.');
    }
  };

  const isLiked = (itemId) => likedItems.has(itemId);

  return (
    <>
      <Helmet>
        <title>Gallery - Beats of Washington</title>
        <meta name="description" content="Explore our photo and video gallery showcasing community events, workshops, performances, and the people who make BOW special." />
      </Helmet>

      {/* Hero Section */}
      <HeroSection
        title="Our Gallery"
        description="Explore photos and videos from our community events, workshops, and performances that bring people together through music."
        badge="📸 Capture & Share ��"
        logoUrl={logoUrl}
        showLogo={true}
        floatingElements={[
          { icon: Image, position: 'top-10 left-10', animation: 'animate-float-slow' },
          { icon: Video, position: 'top-20 right-32', animation: 'animate-float-slow-reverse' },
          { icon: Heart, position: 'bottom-20 left-32', animation: 'animate-float-slow' },
          { icon: Share2, position: 'bottom-32 right-10', animation: 'animate-float-slow-reverse' }
        ]}
        interactiveElements={[
          { icon: Image, label: 'Photos', color: 'text-green-300' },
          { icon: Video, label: 'Videos', color: 'text-blue-300' },
          { icon: Heart, label: 'Memories', color: 'text-pink-300' }
        ]}
      />

      {/* Filters and Search */}
      <section className="bg-white py-8 border-b">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search gallery..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label} ({category.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {loading ? 'Loading...' : `${filteredItems.length} Items Found`}
            </h2>
            <p className="text-gray-600">
              {loading ? 'Fetching gallery items...' : (searchTerm && `Searching for "${searchTerm}"`)}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading gallery items...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Gallery</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredItems.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Gallery Items Found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? `No items match your search for "${searchTerm}"`
                    : 'No images or videos have been uploaded to the gallery yet.'
                  }
                </p>
                {!searchTerm && (
                  <p className="text-sm text-gray-500">
                    Check back later or contact an administrator to upload content.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Gallery Items Grid */}
          {!loading && !error && filteredItems.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
              <div key={item.id} className="card group cursor-pointer" onClick={() => openModal(item)}>
                <div className="relative overflow-hidden rounded-t-xl">
                  <ImagePlaceholder
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-48 object-contain bg-gray-100 group-hover:scale-105 transition-transform duration-300"
                    placeholderClassName="w-full h-48 bg-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Media Type Badge */}
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    {item.type === 'video' ? (
                      <Video className="w-4 h-4 mr-1" />
                    ) : (
                      <Image className="w-4 h-4 mr-1" />
                    )}
                    {item.type === 'video' ? 'Video' : 'Photo'}
                  </div>
                  

                  {/* Action Buttons */}
                  <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => handleLike(item.id, e)}
                      className={`p-2 rounded-full ${
                        isLiked(item.id) 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
                      } transition-all duration-200`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked(item.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => handleShare(item, e)}
                      className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-primary-500 hover:text-white transition-all duration-200"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDownload(item, e)}
                      className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-green-500 hover:text-white transition-all duration-200"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </section>

      {/* Media Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Media Content */}
              <div className="relative">
                {selectedMedia.type === 'video' ? (
                  <video
                    src={selectedMedia.url}
                    controls
                    className="w-full h-96 object-cover rounded-t-2xl"
                  />
                ) : (
                  <ImagePlaceholder
                    src={selectedMedia.url}
                    alt={selectedMedia.title}
                    className="w-full h-96 object-contain bg-gray-100 rounded-t-2xl"
                    placeholderClassName="w-full h-96 bg-gray-100 flex items-center justify-center rounded-t-2xl"
                  />
                )}
              </div>
              
              {/* Media Info */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedMedia.title}
                </h2>
                
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <button 
                    onClick={(e) => handleLike(selectedMedia.id, e)}
                    className={`flex items-center transition-colors duration-200 ${
                      isLiked(selectedMedia.id) 
                        ? 'text-red-600' 
                        : 'text-gray-600 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 mr-1 ${isLiked(selectedMedia.id) ? 'fill-current' : ''}`} />
                    {selectedMedia.likes}
                  </button>
                  <button 
                    onClick={(e) => handleShare(selectedMedia, e)}
                    className="flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200"
                  >
                    <Share2 className="w-5 h-5 mr-1" />
                    Share
                  </button>
                  <button 
                    onClick={(e) => handleDownload(selectedMedia, e)}
                    className="flex items-center text-gray-600 hover:text-green-600 transition-colors duration-200"
                  >
                    <Download className="w-5 h-5 mr-1" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Share This Content</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Copy Link */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              
              {/* Social Media Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => shareOnSocialMedia('facebook')}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Facebook
                </button>
                <button
                  onClick={() => shareOnSocialMedia('twitter')}
                  className="flex items-center justify-center px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Twitter
                </button>
                <button
                  onClick={() => shareOnSocialMedia('linkedin')}
                  className="flex items-center justify-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Share Your Memories
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Have photos or videos from BOW events? We'd love to see them! 
            Share your memories with our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="btn-primary text-lg px-8 py-4">
              <Image className="w-5 h-5 mr-2" />
              Share Your Media
            </a>
            <a href="/events" className="btn-outline text-lg px-8 py-4">
              <Video className="w-5 h-5 mr-2" />
              Attend Events
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default GalleryPage; 