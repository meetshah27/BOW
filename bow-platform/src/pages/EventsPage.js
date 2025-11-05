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
  Tag,
  Music,
  ChevronLeft,
  ChevronRight,
  Grid,
  Calendar as CalendarIcon,
  X,
  DollarSign,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';
import { formatDate, parseDateString, isFuture } from '../utils/dateUtils';
import api from '../config/api';
import HeroSection from '../components/common/HeroSection';

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
      phone: '206 369-9576',
      email: 'events@bow.org'
    },
    tags: ['cultural', 'festival', 'music', 'dance'],
    featured: true,
    isActive: true,
    isLive: false,
    registeredCount: 2,
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
    registeredCount: 1,
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
  const [logoUrl, setLogoUrl] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [founderContent, setFounderContent] = useState(null);
  const [selectedEventModal, setSelectedEventModal] = useState(null);
  const [shouldScrollToEvents, setShouldScrollToEvents] = useState(false);

  // Scroll to events section only when view mode is changed by button click (not on initial load)
  useEffect(() => {
    if (shouldScrollToEvents) {
      const eventsSection = document.getElementById('events-content');
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setShouldScrollToEvents(false); // Reset flag after scrolling
      }
    }
  }, [viewMode, shouldScrollToEvents]);

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

  // Fetch founder content
  useEffect(() => {
    const fetchFounderContent = async () => {
      try {
        const response = await api.get('/founder-content');
        if (response.ok) {
          const data = await response.json();
          setFounderContent(data);
        }
      } catch (error) {
        console.error('Error fetching founder content:', error);
      }
    };
    fetchFounderContent();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get('/events');
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
    { value: 'all', label: 'All Events' },
    { value: 'upcoming', label: 'Upcoming Events' },
    { value: 'past', label: 'Past Events' }
  ];

  // Filter events based on search and filters
  const filteredEvents = events.filter(event => {
    const matchesSearch = searchTerm === '' || 
                         event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    // Date filtering logic
    let matchesDate = true;
    if (selectedDate === 'upcoming') {
      matchesDate = event.date && isFuture(event.date);
    } else if (selectedDate === 'past') {
      matchesDate = event.date && !isFuture(event.date);
    }
    // 'all' case: matchesDate remains true
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`Event: ${event.title}, Date: ${event.date}, isFuture: ${isFuture(event.date)}, selectedDate: ${selectedDate}, matchesDate: ${matchesDate}`);
    }
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const formatDateLocal = (dateString) => {
    return formatDate(dateString, 'full');
  };

  const getRegistrationStatus = (event) => {
    if (event.registeredCount >= event.capacity) {
      return { status: 'full', text: 'Event Full', color: 'text-red-600' };
    } else if (event.registeredCount > event.capacity * 0.8) {
      return { status: 'limited', text: 'Limited Spots', color: 'text-orange-600' };
    } else {
      return { status: 'available', text: 'Available', color: 'text-green-600' };
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return filteredEvents.filter(event => {
      const eventDate = event.date ? event.date.split('T')[0] : '';
      return eventDate === dateString;
    });
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      <Helmet>
        <title>Events - Beats of Washington</title>
        <meta name="description" content="Discover upcoming events, workshops, and performances hosted by Beats of Washington. Join our community events and connect through music." />
      </Helmet>

      {/* Hero Section */}
      <HeroSection
        title="Upcoming Events"
        description="Join us for exciting community events, workshops, and performances that bring people together through the power of music."
        badge="🎵 Discover & Connect 🎵"
        logoUrl={logoUrl}
        showLogo={true}
        floatingElements={[
          { icon: Music, position: 'top-10 left-10', animation: 'animate-float-slow' },
          { icon: Star, position: 'top-20 right-32', animation: 'animate-float-slow-reverse' },
          { icon: Calendar, position: 'bottom-20 left-32', animation: 'animate-float-slow' },
          { icon: Users, position: 'bottom-32 right-10', animation: 'animate-float-slow-reverse' }
        ]}
        interactiveElements={[
          { icon: Calendar, label: 'Live Events', color: 'text-yellow-300' },
          { icon: Users, label: 'Community', color: 'text-blue-300' },
          { icon: Music, label: 'Music', color: 'text-green-300' }
        ]}
      />

      {/* Search and Filters */}
      <section className="bg-white py-8 border-b">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Events</h2>
            {/* View Toggle */}
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => {
                  setViewMode('list');
                  setShouldScrollToEvents(true);
                }}
                className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
                List View
              </button>
              <button
                onClick={() => {
                  setViewMode('calendar');
                  setShouldScrollToEvents(true);
                }}
                className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  viewMode === 'calendar'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                Calendar View
              </button>
            </div>
          </div>
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

      {/* Events Content */}
      <section id="events-content" className="py-16 bg-gray-50">
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

          {/* Calendar View */}
          {!loading && viewMode === 'calendar' && (
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Calendar Header */}
              <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white p-6 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24"></div>
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    {logoUrl && (
                      <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
                        <img 
                          src={logoUrl} 
                          alt="BOW Logo" 
                          className="w-12 h-12 object-cover rounded-full shadow-lg"
                        />
                        <span className="text-white text-xs font-bold mt-1">BOW</span>
                      </div>
                    )}
                    <button
                      onClick={goToPreviousMonth}
                      className="p-2.5 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm border border-white/20"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  </div>
                   <div className="text-center">
                     <h2 className="text-3xl font-bold mb-1 drop-shadow-lg">
                       {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                     </h2>
                     <div className="text-xl font-bold mb-2 text-yellow-300 drop-shadow-lg">
                       गणपती बाप्पा मोरया
                     </div>
                     <button
                       onClick={goToToday}
                       className="text-sm opacity-90 hover:opacity-100 mt-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30 font-medium"
                       title="Click to go to today"
                     >
                       {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                     </button>
                   </div>
                  <button
                    onClick={goToNextMonth}
                    className="p-2.5 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm border border-white/20"
                    aria-label="Next month"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                {/* Day Names Header */}
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {dayNames.map(day => (
                    <div key={day} className="text-center text-sm font-bold text-gray-700 py-3 bg-gradient-to-b from-gray-100 to-gray-50 rounded-lg border border-gray-200">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-3">
                  {getDaysInMonth(currentMonth).map((date, index) => {
                    const isToday = date && 
                      date.toDateString() === new Date().toDateString();
                    const isCurrentMonth = date && 
                      date.getMonth() === currentMonth.getMonth();
                    const isWeekend = !!date && (date.getDay() === 0 || date.getDay() === 6);
                    const dayEvents = date ? getEventsForDate(date) : [];
                    const hasEvents = dayEvents.length > 0;

                    return (
                      <div
                        key={index}
                        className={`min-h-[120px] rounded-xl p-3 transition-all duration-300 ${
                          !isCurrentMonth 
                            ? 'bg-gray-50/50 opacity-40 border border-gray-100' 
                            : isToday
                            ? 'bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-400 shadow-lg transform scale-105'
                            : 'bg-white border border-gray-200 hover:border-primary-300 hover:shadow-md hover:scale-105'
                        } ${hasEvents ? 'ring-2 ring-primary-200' : ''} ${
                          // subtle weekend highlight (only for current month and non-today)
                          isCurrentMonth && !isToday && isWeekend ? 'bg-amber-50' : ''
                        }`}
                      >
                        {date && (
                          <>
                            <div className={`text-sm font-bold mb-1.5 tracking-tight flex items-center justify-between ${
                              isToday 
                                ? 'text-primary-700' 
                                : isCurrentMonth 
                                ? 'text-gray-900' 
                                : 'text-gray-400'
                            }`}>
                              <span className={`${
                                isToday 
                                  ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white px-2.5 py-1 rounded-full shadow-md ring-2 ring-primary-200'
                                  : 'bg-white text-gray-900 px-2 py-0.5 rounded-full border border-gray-200 shadow-sm'
                              }`}>
                                {date.getDate()}
                              </span>
                              {hasEvents && (
                                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                              )}
                            </div>
                            <div className="space-y-2">
                              {dayEvents.slice(0, 2).map((event, eventIndex) => (
                                <div
                                  key={event.id}
                                  className="group relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                                  title={event.title}
                                  onClick={() => {
                                    setSelectedEventModal(event);
                                  }}
                                >
                                  {/* Event Image */}
                                  <div className="relative h-12 overflow-hidden">
                                    <img
                                      src={event.image || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                                      alt={event.title}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                      onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                                      }}
                                    />
                                    {/* Subtle Gradient Overlay for text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                                    {/* Event Title */}
                                    <div className="absolute bottom-0 left-0 right-0 p-1.5">
                                      <p className="text-[10px] font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
                                        {event.title}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {dayEvents.length > 2 && (
                                <div className="text-[10px] text-primary-700 font-bold px-2 py-1.5 bg-gradient-to-r from-primary-100 to-primary-50 rounded-lg text-center border border-primary-200 hover:from-primary-200 hover:to-primary-100 transition-colors cursor-pointer">
                                  +{dayEvents.length - 2} more events
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 p-5">
                <div className="flex items-center justify-center gap-8 text-sm flex-wrap">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                    <div className="w-5 h-5 border-2 border-primary-500 rounded-lg bg-primary-50"></div>
                    <span className="text-gray-700 font-medium">Today</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                    <div className="w-5 h-5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg"></div>
                    <span className="text-gray-700 font-medium">Events</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Has Events</span>
                  </div>
                  
                  {/* Organization Name */}
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-sm font-bold text-primary-600">
                      Beats Of Washington
                    </span>
                  </div>
                  
                  {/* Founders Section */}
                  {founderContent && (
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                      <span className="text-xs text-gray-500">Founded by</span>
                      <span className="text-sm font-semibold text-gray-700">
                        {founderContent.aandSane?.name || 'Aand Sane'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* List View */}
          {!loading && viewMode === 'list' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {filteredEvents.length} Events Found
                </h2>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  {searchTerm && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      Search: "{searchTerm}"
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      Category: {selectedCategory}
                    </span>
                  )}
                  {selectedDate !== 'all' && (
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                      {selectedDate === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
                    </span>
                  )}
                  {!searchTerm && selectedCategory === 'all' && selectedDate === 'all' && (
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      No filters active
                    </span>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.isArray(filteredEvents) && filteredEvents.map((event) => {
                  const eventId = `event-${event.id}`;
                  const registrationStatus = getRegistrationStatus(event);
                  const registrationPercentage = (event.registeredCount / event.capacity) * 100;
                  
                  return (
                    <div key={event.id} id={eventId} className="card group">
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
                            {formatDateLocal(event.date)}
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
                              {event.registeredCount} / {event.capacity} registered
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
                      Clear All Filters
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

      {/* Event Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEventModal(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="relative">
              <img
                src={selectedEventModal.image || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                alt={selectedEventModal.title}
                className="w-full h-64 object-cover rounded-t-2xl"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-t-2xl"></div>
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedEventModal(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Event Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  {selectedEventModal.featured && (
                    <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Featured
                    </div>
                  )}
                  <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {selectedEventModal.category}
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">{selectedEventModal.title}</h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Event Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 mr-3 text-primary-600" />
                  <span className="font-medium">{formatDateLocal(selectedEventModal.date)}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <Clock className="w-5 h-5 mr-3 text-primary-600" />
                  <span className="font-medium">{selectedEventModal.time}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 mr-3 text-primary-600" />
                  <div>
                    <span className="font-medium">{selectedEventModal.location}</span>
                    {selectedEventModal.address && (
                      <p className="text-sm text-gray-500">{selectedEventModal.address}</p>
                    )}
                  </div>
                </div>

                {selectedEventModal.price !== undefined && (
                  <div className="flex items-center text-gray-700">
                    <DollarSign className="w-5 h-5 mr-3 text-primary-600" />
                    <span className="font-medium">
                      {selectedEventModal.price === 0 ? 'Free' : `$${selectedEventModal.price}`}
                    </span>
                  </div>
                )}

                {selectedEventModal.organizer && (
                  <div className="flex items-center text-gray-700">
                    <Users className="w-5 h-5 mr-3 text-primary-600" />
                    <span className="font-medium">{selectedEventModal.organizer}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedEventModal.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About This Event</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedEventModal.description}</p>
                </div>
              )}

              {/* Long Description */}
              {selectedEventModal.longDescription && (
                <div className="mb-6">
                  <p className="text-gray-600 leading-relaxed">{selectedEventModal.longDescription}</p>
                </div>
              )}

              {/* Tags */}
              {selectedEventModal.tags && selectedEventModal.tags.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {selectedEventModal.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Registration Status */}
              {selectedEventModal.capacity && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Registration</span>
                    <span className={`text-sm font-semibold ${
                      getRegistrationStatus(selectedEventModal).status === 'full' 
                        ? 'text-red-600' 
                        : getRegistrationStatus(selectedEventModal).status === 'limited'
                        ? 'text-orange-600'
                        : 'text-green-600'
                    }`}>
                      {getRegistrationStatus(selectedEventModal).text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        getRegistrationStatus(selectedEventModal).status === 'full'
                          ? 'bg-red-500'
                          : getRegistrationStatus(selectedEventModal).status === 'limited'
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                      }`}
                      style={{
                        width: `${Math.min((selectedEventModal.registeredCount / selectedEventModal.capacity) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {selectedEventModal.registeredCount} of {selectedEventModal.capacity} spots filled
                  </p>
                </div>
              )}

              {/* Contact Info */}
              {selectedEventModal.contact && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    {selectedEventModal.contact.phone && (
                      <div className="flex items-center text-sm text-gray-700">
                        <Phone className="w-4 h-4 mr-2 text-primary-600" />
                        <a href={`tel:${selectedEventModal.contact.phone}`} className="hover:text-primary-600">
                          {selectedEventModal.contact.phone}
                        </a>
                      </div>
                    )}
                    {selectedEventModal.contact.email && (
                      <div className="flex items-center text-sm text-gray-700">
                        <Mail className="w-4 h-4 mr-2 text-primary-600" />
                        <a href={`mailto:${selectedEventModal.contact.email}`} className="hover:text-primary-600">
                          {selectedEventModal.contact.email}
                        </a>
                      </div>
                    )}
                    {selectedEventModal.contact.website && (
                      <div className="flex items-center text-sm text-gray-700">
                        <ExternalLink className="w-4 h-4 mr-2 text-primary-600" />
                        <a href={selectedEventModal.contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link
                  to={`/events/${selectedEventModal.id}`}
                  className="flex-1 btn-primary flex items-center justify-center"
                  onClick={() => setSelectedEventModal(null)}
                >
                  View Full Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                {selectedEventModal.capacity && getRegistrationStatus(selectedEventModal).status !== 'full' && (
                  <Link
                    to={`/events/${selectedEventModal.id}?register=true`}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                    onClick={() => setSelectedEventModal(null)}
                  >
                    Register Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventsPage; 