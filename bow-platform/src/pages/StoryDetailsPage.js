import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Tag, ArrowLeft, Calendar, Star, Play, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import api from '../config/api';

const FALLBACK_STORY = {
  id: '',
  title: 'Story Not Found',
  author: 'Unknown',
  authorImage: '',
  date: '',
  image: '',
  video: '',
  content: 'Sorry, we could not find this story.',
  tags: [],
  category: '',
  excerpt: '',
  featured: false
};

const StoryDetailsPage = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/stories/${id}`)
      .then(res => res.ok ? res.json() : Promise.resolve(FALLBACK_STORY))
      .then(data => {
        setStory(data);
        setLoading(false);
      })
      .catch(() => {
        setStory(FALLBACK_STORY);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-base sm:text-lg text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story) return null;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <Helmet>
        <title>{story.title} - Story Details</title>
        <meta name="description" content={story.excerpt || story.content?.substring(0, 160)} />
      </Helmet>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-6 sm:py-12">
        <div className="container-custom px-4 sm:px-6">
          <Link to="/stories" className="inline-flex items-center text-white hover:text-secondary-200 mb-4 sm:mb-6 transition-colors text-sm sm:text-base">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Back to Stories
          </Link>
          
          <div className="max-w-4xl mx-auto text-center">
            {story.featured && (
              <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-yellow-400 text-yellow-900 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Featured Story
              </div>
            )}
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight px-2">{story.title}</h1>
            
            {story.excerpt && (
              <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed px-2">
                {story.excerpt}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-6 sm:py-12 bg-white">
        <div className="container-custom max-w-4xl mx-auto px-4 sm:px-6">
          {/* Author Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 rounded-2xl gap-4">
            <div className="flex items-center">
              {story.authorImage ? (
                <img
                  src={story.authorImage}
                  alt={story.author}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mr-3 sm:mr-4 object-cover border-2 sm:border-4 border-white shadow-lg"
                  onError={e => { e.target.src = '/assets/default-author.jpg'; }}
                />
              ) : (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mr-3 sm:mr-4 bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-lg sm:text-xl border-2 sm:border-4 border-white shadow-lg">
                  {story.author.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900">{story.author}</h4>
                <p className="text-sm sm:text-base text-gray-600 flex items-center">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  {formatDate(story.date)}
                </p>
              </div>
            </div>
            
            <div className="text-left sm:text-right">
              {story.category && (
                <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-100 text-primary-800 rounded-full text-xs sm:text-sm font-semibold mb-2">
                  {story.category}
                </span>
              )}
              <p className="text-xs sm:text-sm text-gray-500">Story ID: {story.id}</p>
            </div>
          </div>

          {/* Media Section */}
          <div className="mb-6 sm:mb-8">
            {story.video ? (
              <div className="relative bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
                <video 
                  className="w-full h-auto max-h-48 sm:max-h-96 object-contain"
                  poster={story.image || '/assets/video-placeholder.jpg'}
                  controls
                  preload="metadata"
                >
                  <source src={story.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                  <div className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center">
                    <VideoIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Video</span>
                  </div>
                </div>
              </div>
            ) : story.image ? (
              <div className="relative">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-auto max-h-48 sm:max-h-96 object-cover rounded-xl sm:rounded-2xl shadow-2xl"
                  onError={e => { e.target.src = '/assets/default-story.jpg'; }}
                />
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                  <div className="bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center">
                    <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Image</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2" />
                  <p className="text-sm sm:text-base">No media available</p>
                </div>
              </div>
            )}
          </div>

          {/* Story Content */}
          <div className="prose prose-sm sm:prose-lg max-w-none mb-6 sm:mb-8 text-gray-800">
            {story.content?.split('\n').map((para, idx) => (
              <p key={idx} className="mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                {para}
              </p>
            ))}
          </div>

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="border-t pt-4 sm:pt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {story.tags.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm bg-primary-100 text-primary-800 font-medium hover:bg-primary-200 transition-colors">
                    <Tag className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="border-t pt-6 sm:pt-8 mt-6 sm:mt-8">
            <Link 
              to="/stories" 
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Stories
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default StoryDetailsPage; 