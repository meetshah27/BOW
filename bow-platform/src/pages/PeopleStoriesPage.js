import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Heart, 
  ArrowRight, 
  BookOpen,
  MessageCircle,
  Tag
} from 'lucide-react';

const PeopleStoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/api/stories')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stories');
        return res.json();
      })
      .then(data => {
        setStories(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const categories = [
    { value: 'all', label: 'All Stories', count: stories.length },
    ...Array.from(new Set(stories.flatMap(story => story.category ? [story.category] : []))).map(cat => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      count: stories.filter(story => story.category === cat).length
    }))
  ];

  const filteredStories = stories.filter(story => {
    const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (story.excerpt && story.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (story.tags && story.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) return <div className="container-custom py-20 text-center text-xl">Loading stories...</div>;
  if (error) return <div className="container-custom py-20 text-center text-red-600">{error}</div>;

  return (
    <>
      <Helmet>
        <title>People Stories - Beats of Washington</title>
        <meta name="description" content="Read inspiring stories from our community members, volunteers, and participants. Discover how music and community have transformed lives across Washington State." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-20">
        <div className="container-custom text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <BookOpen className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            People Stories
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Discover inspiring stories from our community members, volunteers, 
            and participants who have been transformed by the power of music.
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
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search stories..."
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

      {/* Featured Story */}
      {filteredStories.filter(story => story.featured).length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Story
              </h2>
            </div>
            
            {filteredStories.filter(story => story.featured).slice(0, 1).map((story) => (
              <div key={story.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid lg:grid-cols-2">
                  <div className="relative">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </div>
                  </div>
                  <div className="p-8 lg:p-12">
                    <div className="flex items-center mb-4">
                      <img
                        src={story.authorImage}
                        alt={story.author}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {story.author}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatDate(story.date)} • {story.readTime}
                        </p>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {story.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {story.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {story.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {story.likes}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {story.comments}
                        </span>
                      </div>
                      <Link
                        to={`/stories/${story.id}`}
                        className="btn-primary"
                      >
                        Read Full Story
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}



      {/* Stories Grid */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {filteredStories.length} Stories Found
            </h2>
            <p className="text-gray-600">
              {searchTerm && `Searching for "${searchTerm}"`}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.filter(story => !story.featured).map((story) => (
              <div key={story.id} className="card group">
                <div className="relative overflow-hidden rounded-t-xl">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-white text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {story.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={story.authorImage}
                      alt={story.author}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {story.author}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {formatDate(story.date)} • {story.readTime}
                      </p>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
                    {story.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {story.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {story.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {story.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {story.comments}
                      </span>
                    </div>
                    <Link
                      to={`/stories/${story.id}`}
                      className="btn-outline text-sm py-2 px-4"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStories.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No stories found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or check back later for new stories.
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

      {/* Share Your Story CTA */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Share Your Story
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Have a story about how BOW has impacted your life? We'd love to hear from you 
            and share your experience with our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary text-lg px-8 py-4">
              <MessageCircle className="w-5 h-5 mr-2" />
              Share Your Story
            </Link>
            <Link to="/get-involved" className="btn-outline text-lg px-8 py-4">
              <Users className="w-5 h-5 mr-2" />
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default PeopleStoriesPage; 