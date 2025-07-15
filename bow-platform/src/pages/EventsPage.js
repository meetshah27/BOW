import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Search, 
  Filter,
  ArrowRight,
  Star,
  Tag
} from 'lucide-react';

// Fallback events data
const FALLBACK_EVENTS = [
  {
    id: 'event_1',
    title: 'Annual Cultural Festival',
    description: 'Join us for our biggest celebration of the year',
    longDescription: 'Experience the rich cultural diversity of our community through music, dance, food, and art. This annual festival brings together people from all backgrounds to celebrate our shared humanity.',
    date: '2024-08-15',
    time: '2:00 PM - 8:00 PM',
    location: 'Seattle Center',
    address: '305 Harrison St, Seattle, WA 98109',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    capacity: 500,
    price: 25,
    organizer: 'Beats of Washington',
    contact: {
      phone: '(206) 555-0123',
      email: 'events@bow.org'
    },
    tags: ['cultural', 'festival', 'music', 'dance'],
    featured: true,
    isActive: true,
    isLive: false,
    registered: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 'event_2',
    title: 'Community Workshop Series',
    description: 'Learn new skills and connect with neighbors',
    longDescription: 'Our monthly workshop series offers hands-on learning opportunities in various topics including cooking, crafts, technology, and wellness. All skill levels welcome.',
    date: '2024-07-20',
    time: '10:00 AM - 12:00 PM',
    location: 'Community Center',
    address: '123 Main St, Seattle, WA 98101',
    category: 'Educational',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    capacity: 30,
    price: 0,
    organizer: 'Beats of Washington',
    contact: {
      phone: '(206) 555-0123',
      email: 'workshops@bow.org'
    },
    tags: ['workshop', 'learning', 'community'],
    featured: false,
    isActive: true,
    isLive: false,
    registered: 0,
    createdAt: new Date().toISOString()
  }
];

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:3000/api/events');
        if (!response.ok) {
          console.log('API not available, using fallback data');
          setEvents(FALLBACK_EVENTS);
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Unable to load events. Showing sample data.');
        setEvents(FALLBACK_EVENTS);
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const categories = [
    { value: 'all', label: 'All Events' },
    { value: 'Festival', label: 'Festivals' },
    { value: 'Workshop', label: 'Workshops' },
    { value: 'Education', label: 'Education' },
    { value: 'Concert', label: 'Concerts' },
    { value: 'Showcase', label: 'Showcases' }
  ];

  const dateFilters = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'upcoming', label: 'Upcoming' }
  ];

  // Filter events based on search and filters
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    // Simple date filtering (in a real app, you'd use proper date logic)
    const matchesDate = selectedDate === 'all' || true; // Placeholder
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getRegistrationStatus = (event) => {
    if (event.registered >= event.capacity) {
      return { status: 'full', text: 'Event Full', color: 'text-red-600' };
    } else if (event.registered > event.capacity * 0.8) {
      return { status: 'limited', text: 'Limited Spots', color: 'text-orange-600' };
    } else {
      return { status: 'available', text: 'Available', color: 'text-green-600' };
    }
  };

  return (
    <>
      <Helmet>
        <title>Events - Beats of Washington</title>
        <meta name="description" content="Discover upcoming events, workshops, and performances hosted by Beats of Washington. Join our community events and connect through music." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Upcoming Events
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Join us for exciting community events, workshops, and performances 
            that bring people together through the power of music.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white py-8 border-b">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
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
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {dateFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <div className="text-xl text-gray-600">Loading events...</div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Events Content */}
          {!loading && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {filteredEvents.length} Events Found
                </h2>
                <p className="text-gray-600">
                  {searchTerm && `Searching for "${searchTerm}"`}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.isArray(filteredEvents) && filteredEvents.map((event) => {
                  const registrationStatus = getRegistrationStatus(event);
                  const registrationPercentage = (event.registered / event.capacity) * 100;
                  
                  return (
                    <div key={event.id} className="card group">
                      <div className="relative overflow-hidden rounded-t-xl">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {event.featured && (
                          <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                            <Star className="w-4 h-4 mr-1 fill-current" />
                            Featured
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                          {event.category}
                        </div>
                        {!event.isLive && (
                          <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Draft
                          </div>
                        )}
                        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                          {event.price}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
                          {event.title}
                        </h3>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            {event.time}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                          </div>
                        </div>
                        
                        <p
                          className="text-gray-600 mb-4 leading-relaxed overflow-hidden text-ellipsis"
                          style={{
                            maxHeight: '3.6em', // ~3 lines
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            whiteSpace: 'normal',
                          }}
                          title={event.description}
                        >
                          {event.description}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {event.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        {/* Registration Status */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">
                              {event.registered} / {event.capacity} registered
                            </span>
                            <span className={`text-sm font-medium ${registrationStatus.color}`}>
                              {registrationStatus.text}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(registrationPercentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <Link
                          to={`/events/${event.id}`}
                          className="btn-outline w-full justify-center"
                        >
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No events found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search criteria or check back later for new events.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                        setSelectedDate('all');
                      }}
                      className="btn-primary"
                    >
                      Clear Filters
                    </button>
                    <Link to="/" className="btn-outline">
                      Go Back to Home
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Want to Host an Event?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Are you interested in hosting a community event or workshop? 
            We'd love to hear from you and help make it happen!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary text-lg px-8 py-4">
              Contact Us
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link to="/get-involved" className="btn-outline text-lg px-8 py-4">
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default EventsPage; 