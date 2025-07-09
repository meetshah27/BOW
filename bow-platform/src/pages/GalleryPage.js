import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Image, 
  Video, 
  Filter, 
  Search, 
  Calendar,
  MapPin,
  Users,
  Heart,
  Share2,
  Download
} from 'lucide-react';

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);

  const categories = [
    { value: 'all', label: 'All Media', count: 156 },
    { value: 'events', label: 'Events', count: 89 },
    { value: 'workshops', label: 'Workshops', count: 34 },
    { value: 'community', label: 'Community', count: 23 },
    { value: 'performances', label: 'Performances', count: 45 }
  ];

  // Mock gallery data
  const galleryItems = [
    {
      id: 1,
      title: "Summer Music Festival 2023",
      type: "image",
      category: "events",
      url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      date: "2023-07-15",
      location: "Seattle Center",
      description: "Our biggest event of the year brought together thousands of community members for three days of music and celebration.",
      tags: ["festival", "summer", "community", "music"],
      likes: 234,
      views: 1247
    },
    {
      id: 2,
      title: "Community Drum Circle",
      type: "video",
      category: "workshops",
      url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      date: "2023-06-22",
      location: "Gas Works Park",
      description: "Monthly community drum circle brings people together through rhythm and music.",
      tags: ["drumming", "workshop", "community", "rhythm"],
      likes: 156,
      views: 892
    },
    {
      id: 3,
      title: "Youth Music Workshop",
      type: "image",
      category: "workshops",
      url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      date: "2023-06-29",
      location: "Community Center",
      description: "Young musicians learning and growing together in our educational programs.",
      tags: ["youth", "education", "workshop", "learning"],
      likes: 189,
      views: 567
    },
    {
      id: 4,
      title: "Cultural Music Showcase",
      type: "image",
      category: "performances",
      url: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      date: "2023-07-20",
      location: "Seattle Town Hall",
      description: "Celebrating diverse musical traditions from around the world.",
      tags: ["cultural", "showcase", "diverse", "performance"],
      likes: 267,
      views: 1456
    },
    {
      id: 5,
      title: "Volunteer Appreciation Day",
      type: "image",
      category: "community",
      url: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      date: "2023-05-15",
      location: "BOW Headquarters",
      description: "Celebrating our amazing volunteers who make everything possible.",
      tags: ["volunteers", "appreciation", "community", "celebration"],
      likes: 312,
      views: 789
    },
    {
      id: 6,
      title: "Jazz in the Park",
      type: "video",
      category: "performances",
      url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      date: "2023-07-08",
      location: "Volunteer Park",
      description: "An evening of smooth jazz under the stars with local musicians.",
      tags: ["jazz", "outdoor", "concert", "local"],
      likes: 198,
      views: 1123
    }
  ];

  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const openModal = (item) => {
    setSelectedMedia(item);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  return (
    <>
      <Helmet>
        <title>Gallery - Beats of Washington</title>
        <meta name="description" content="Explore our photo and video gallery showcasing community events, workshops, performances, and the people who make BOW special." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-20">
        <div className="container-custom text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Image className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Our Gallery
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Explore photos and videos from our community events, workshops, 
            and performances that bring people together through music.
          </p>
        </div>
      </section>

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
              {filteredItems.length} Items Found
            </h2>
            <p className="text-gray-600">
              {searchTerm && `Searching for "${searchTerm}"`}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div key={item.id} className="card group cursor-pointer" onClick={() => openModal(item)}>
                <div className="relative overflow-hidden rounded-t-xl">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 bg-white text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {item.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
                    {item.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(item.date)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {item.location}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {item.likes}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {item.views}
                      </span>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No media found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or check back later for new content.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
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
                ×
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
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.title}
                    className="w-full h-96 object-cover rounded-t-2xl"
                  />
                )}
              </div>
              
              {/* Media Info */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedMedia.title}
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(selectedMedia.date)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {selectedMedia.location}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200">
                      <Heart className="w-4 h-4 mr-1" />
                      {selectedMedia.likes}
                    </button>
                    <button className="flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </button>
                    <button className="flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-4">
                  {selectedMedia.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {selectedMedia.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
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
              <Calendar className="w-5 h-5 mr-2" />
              Attend Events
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default GalleryPage; 