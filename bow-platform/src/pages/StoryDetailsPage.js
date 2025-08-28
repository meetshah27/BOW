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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading story...</p>
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
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-12">
        <div className="container-custom">
          <Link to="/stories" className="inline-flex items-center text-white hover:text-secondary-200 mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Stories
          </Link>
          
          <div className="max-w-4xl mx-auto text-center">
            {story.featured && (
              <div className="inline-flex items-center px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full text-sm font-semibold mb-4">
                <Star className="w-4 h-4 mr-2" />
                Featured Story
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{story.title}</h1>
            
            {story.excerpt && (
              <p className="text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
                {story.excerpt}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-12 bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          {/* Author Info */}
          <div className="flex items-center justify-between mb-8 p-6 bg-gray-50 rounded-2xl">
            <div className="flex items-center">
              {story.authorImage ? (
                <img
                  src={story.authorImage}
                  alt={story.author}
                  className="w-16 h-16 rounded-full mr-4 object-cover border-4 border-white shadow-lg"
                  onError={e => { e.target.src = '/assets/default-author.jpg'; }}
                />
              ) : (
                <div className="w-16 h-16 rounded-full mr-4 bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-xl border-4 border-white shadow-lg">
                  {story.author.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{story.author}</h4>
                <p className="text-gray-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(story.date)}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              {story.category && (
                <span className="inline-block px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-semibold mb-2">
                  {story.category}
                </span>
              )}
              <p className="text-sm text-gray-500">Story ID: {story.id}</p>
            </div>
          </div>

          {/* Media Section */}
          <div className="mb-8">
            {story.video ? (
              <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
                <video 
                  className="w-full h-auto max-h-96 object-contain"
                  poster={story.image || '/assets/video-placeholder.jpg'}
                  controls
                  preload="metadata"
                >
                  <source src={story.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute top-4 right-4">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <VideoIcon className="w-4 h-4 mr-1" />
                    Video
                  </div>
                </div>
              </div>
            ) : story.image ? (
              <div className="relative">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-auto max-h-96 object-cover rounded-2xl shadow-2xl"
                  onError={e => { e.target.src = '/assets/default-story.jpg'; }}
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <ImageIcon className="w-4 h-4 mr-1" />
                    Image
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                  <p>No media available</p>
                </div>
              </div>
            )}
          </div>

          {/* Story Content */}
          <div className="prose prose-lg max-w-none mb-8 text-gray-800">
            {story.content?.split('\n').map((para, idx) => (
              <p key={idx} className="mb-4 leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-3">
                {story.tags.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-primary-100 text-primary-800 font-medium hover:bg-primary-200 transition-colors">
                    <Tag className="w-4 h-4 mr-2" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="border-t pt-8 mt-8">
            <Link 
              to="/stories" 
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors"
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