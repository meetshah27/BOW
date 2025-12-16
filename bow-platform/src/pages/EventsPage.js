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
        const response = await api.get('/about-page');
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
      <section className="bg-white py-4 sm:py-6 md:py-8 border-b">
        <div className="container-custom px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Events</h2>
            {/* View Toggle */}
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
              <button
                onClick={() => {
                  setViewMode('list');
                  setShouldScrollToEvents(true);
                }}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-colors flex items-center justify-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline">List View</span>
                <span className="sm:hidden">List</span>
              </button>
              <button
                onClick={() => {
                  setViewMode('calendar');
                  setShouldScrollToEvents(true);
                }}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-colors flex items-center justify-center gap-2 ${
                  viewMode === 'calendar'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Calendar View</span>
                <span className="sm:hidden">Calendar</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Search */}
            <div className="sm:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
      <section id="events-content" className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="container-custom px-4 sm:px-6">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <div className="text-lg sm:text-xl text-gray-600">Loading events...</div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm text-yellow-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Calendar View */}
          {!loading && viewMode === 'calendar' && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Calendar Header */}
              <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white p-4 sm:p-6 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-3xl -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div>
                
                <div className="flex items-center justify-between relative z-10 gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {logoUrl && (
                      <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-1 sm:p-1.5 md:p-2 border border-white/20">
                        <img 
                          src={logoUrl} 
                          alt="BOW Logo" 
                          className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 object-cover rounded-full shadow-lg"
                        />
                        <span className="text-white text-[10px] sm:text-xs font-bold mt-0.5 sm:mt-1 hidden md:block">BOW</span>
                      </div>
                    )}
                    <button
                      onClick={goToPreviousMonth}
                      className="p-2 sm:p-2.5 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm border border-white/20"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                   <div className="text-center flex-1 min-w-0">
                     <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-1 drop-shadow-lg truncate">
                       {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                     </h2>
                     <div className="text-sm sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-yellow-300 drop-shadow-lg">
                       गणपती बाप्पा मोरया
                     </div>
                     <button
                       onClick={goToToday}
                       className="text-xs sm:text-sm opacity-90 hover:opacity-100 mt-1 sm:mt-2 px-2 sm:px-4 py-1 sm:py-1.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30 font-medium"
                       title="Click to go to today"
                     >
                       <span className="hidden sm:inline">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                       <span className="sm:hidden">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                     </button>
                   </div>
                  <button
                    onClick={goToNextMonth}
                    className="p-2 sm:p-2.5 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm border border-white/20"
                    aria-label="Next month"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-white overflow-x-auto">
                {/* Day Names Header */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-3 min-w-[700px] sm:min-w-0">
                  {dayNames.map(day => (
                    <div key={day} className="text-center text-xs sm:text-sm font-bold text-gray-700 py-2 sm:py-3 bg-gradient-to-b from-gray-100 to-gray-50 rounded-lg border border-gray-200">
                      <span className="hidden sm:inline">{day}</span>
                      <span className="sm:hidden">{day.substring(0, 1)}</span>
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3 min-w-[700px] sm:min-w-0">
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
                        className={`min-h-[60px] sm:min-h-[80px] md:min-h-[120px] rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-3 transition-all duration-300 ${
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
                            <div className={`text-xs sm:text-sm font-bold mb-1 sm:mb-1.5 tracking-tight flex items-center justify-between ${
                              isToday 
                                ? 'text-primary-700' 
                                : isCurrentMonth 
                                ? 'text-gray-900' 
                                : 'text-gray-400'
                            }`}>
                              <span className={`text-xs sm:text-sm ${
                                isToday 
                                  ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-md ring-2 ring-primary-200'
                                  : 'bg-white text-gray-900 px-1.5 sm:px-2 py-0.5 rounded-full border border-gray-200 shadow-sm'
                              }`}>
                                {date.getDate()}
                              </span>
                              {hasEvents && (
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-500 rounded-full"></span>
                              )}
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                              {/* Show 1 event on mobile, 2 on larger screens */}
                              <div className="hidden sm:block">
                                {dayEvents.slice(0, 2).map((event, eventIndex) => (
                                  <div
                                    key={event.id}
                                    className="group relative overflow-hidden rounded-md sm:rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg mb-1 sm:mb-2"
                                    title={event.title}
                                    onClick={() => {
                                      setSelectedEventModal(event);
                                    }}
                                  >
                                    {/* Event Image */}
                                    <div className="relative h-8 sm:h-10 md:h-12 overflow-hidden">
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
                                      <div className="absolute bottom-0 left-0 right-0 p-1 sm:p-1.5">
                                        <p className="text-[8px] sm:text-[10px] font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
                                          {event.title}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {/* Show only first event on mobile */}
                              <div className="sm:hidden">
                                {dayEvents.slice(0, 1).map((event, eventIndex) => (
                                  <div
                                    key={event.id}
                                    className="group relative overflow-hidden rounded-md cursor-pointer transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg mb-1"
                                    title={event.title}
                                    onClick={() => {
                                      setSelectedEventModal(event);
                                    }}
                                  >
                                    {/* Event Image */}
                                    <div className="relative h-8 overflow-hidden">
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
                                      <div className="absolute bottom-0 left-0 right-0 p-1">
                                        <p className="text-[8px] font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
                                          {event.title}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {dayEvents.length > 2 && (
                                <div className="text-[8px] sm:text-[10px] text-primary-700 font-bold px-1.5 sm:px-2 py-1 sm:py-1.5 bg-gradient-to-r from-primary-100 to-primary-50 rounded-md sm:rounded-lg text-center border border-primary-200 hover:from-primary-200 hover:to-primary-100 transition-colors cursor-pointer">
                                  +{dayEvents.length - 2} more
                                </div>
                              )}
                              {dayEvents.length > 1 && dayEvents.length <= 2 && (
                                <div className="sm:hidden text-[8px] text-primary-700 font-bold px-1.5 py-1 bg-gradient-to-r from-primary-100 to-primary-50 rounded-md text-center border border-primary-200 hover:from-primary-200 hover:to-primary-100 transition-colors cursor-pointer">
                                  +{dayEvents.length - 1} more
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
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 p-3 sm:p-4 md:p-5">
                <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-8 text-xs sm:text-sm flex-wrap">
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm border border-gray-200">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-500 rounded-lg bg-primary-50"></div>
                    <span className="text-gray-700 font-medium">Today</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm border border-gray-200">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg"></div>
                    <span className="text-gray-700 font-medium">Events</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm border border-gray-200">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Has Events</span>
                  </div>
                  
                  {/* Organization Name */}
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-xs sm:text-sm font-bold text-primary-600">
                      <span className="hidden sm:inline">Beats Of Washington</span>
                      <span className="sm:hidden">BOW</span>
                    </span>
                  </div>
                  
                  {/* Founders Section */}
                  {founderContent && (
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm border border-gray-200">
                      <span className="text-xs text-gray-500 hidden sm:inline">Founded by</span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-700">
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
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {filteredEvents.length} Events Found
                </h2>
                <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600">
                  {searchTerm && (
                    <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full">
                      Search: "{searchTerm}"
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full">
                      Category: {selectedCategory}
                    </span>
                  )}
                  {selectedDate !== 'all' && (
                    <span className="bg-purple-100 text-purple-800 px-2 sm:px-3 py-1 rounded-full">
                      {selectedDate === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
                    </span>
                  )}
                  {!searchTerm && selectedCategory === 'all' && selectedDate === 'all' && (
                    <span className="bg-gray-100 text-gray-600 px-2 sm:px-3 py-1 rounded-full">
                      No filters active
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {Array.isArray(filteredEvents) && filteredEvents
                  .sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
                    if (isNaN(dateA.getTime())) return 1;
                    if (isNaN(dateB.getTime())) return -1;
                    return dateB - dateA; // Most recent first
                  })
                  .map((event) => {
                  const eventId = `event-${event.id}`;
                  const registrationStatus = getRegistrationStatus(event);
                  const registrationPercentage = (event.registeredCount / event.capacity) * 100;
                  
                  return (
                    <div key={event.id} id={eventId} className="card group">
                      <div className="relative overflow-hidden rounded-t-lg sm:rounded-t-xl">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {event.featured && (
                          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-primary-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-current" />
                            <span className="hidden sm:inline">Featured</span>
                            <span className="sm:hidden">★</span>
                          </div>
                        )}
                        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                          {event.category}
                        </div>
                        {!event.isLive && (
                          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                            Draft
                          </div>
                        )}
                        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/70 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                          {typeof event.price === 'number' ? (event.price === 0 ? 'Free' : `$${event.price}`) : event.price}
                        </div>
                      </div>
                      
                      <div className="p-4 sm:p-5 md:p-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                          {event.title}
                        </h3>
                        
                        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                          <div className="flex items-center text-gray-600 text-sm sm:text-base">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                            <span className="truncate">{formatDateLocal(event.date)}</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm sm:text-base">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                            <span className="truncate">{event.time}</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm sm:text-base">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                        
                        <p
                          className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed overflow-hidden text-ellipsis line-clamp-3"
                          title={event.description}
                        >
                          {event.description}
                        </p>
                        
                        {/* Tags */}
                        {event.tags && event.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                            {event.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                              >
                                <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                            {event.tags.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                +{event.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Registration Status */}
                        {event.capacity && (
                          <div className="mb-3 sm:mb-4">
                            <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                              <span className="text-xs sm:text-sm text-gray-600">
                                {event.registeredCount} / {event.capacity} registered
                              </span>
                              <span className={`text-xs sm:text-sm font-medium ${registrationStatus.color}`}>
                                {registrationStatus.text}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                              <div
                                className="bg-primary-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(registrationPercentage, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        <Link
                          to={`/events/${event.id}`}
                          className="btn-outline w-full justify-center text-sm sm:text-base py-2 sm:py-2.5"
                        >
                          View Details
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredEvents.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    No events found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
                    Try adjusting your search criteria or check back later for new events.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                        setSelectedDate('all');
                      }}
                      className="btn-primary text-sm sm:text-base py-2 sm:py-2.5 px-4 sm:px-6"
                    >
                      Clear All Filters
                    </button>
                    <Link to="/" className="btn-outline text-sm sm:text-base py-2 sm:py-2.5 px-4 sm:px-6">
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
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container-custom text-center px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Want to Host an Event?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Are you interested in hosting a community event or workshop? 
            We'd love to hear from you and help make it happen!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/contact" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
              Contact Us
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Link>
            <Link to="/get-involved" className="btn-outline text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
              Get Involved
            </Link>
          </div>
        </div>
      </section>

      {/* Event Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto" onClick={() => setSelectedEventModal(null)}>
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl my-4 sm:my-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="relative">
              <img
                src={selectedEventModal.image || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                alt={selectedEventModal.title}
                className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-t-xl sm:rounded-t-2xl"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-t-xl sm:rounded-t-2xl"></div>
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedEventModal(null)}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 p-1.5 sm:p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Event Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {selectedEventModal.featured && (
                    <div className="bg-primary-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Featured
                    </div>
                  )}
                  <div className="bg-white/20 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
                    {selectedEventModal.category}
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg line-clamp-2">{selectedEventModal.title}</h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-5 md:p-6">
              {/* Event Details */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex items-start sm:items-center text-gray-700">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-primary-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span className="font-medium text-sm sm:text-base break-words">{formatDateLocal(selectedEventModal.date)}</span>
                </div>
                
                <div className="flex items-start sm:items-center text-gray-700">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-primary-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span className="font-medium text-sm sm:text-base break-words">{selectedEventModal.time}</span>
                </div>
                
                <div className="flex items-start sm:items-center text-gray-700">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-primary-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm sm:text-base block break-words">{selectedEventModal.location}</span>
                    {selectedEventModal.address && (
                      <p className="text-xs sm:text-sm text-gray-500 break-words">{selectedEventModal.address}</p>
                    )}
                  </div>
                </div>

                {selectedEventModal.price !== undefined && (
                  <div className="flex items-center text-gray-700">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-primary-600 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">
                      {selectedEventModal.price === 0 ? 'Free' : `$${selectedEventModal.price}`}
                    </span>
                  </div>
                )}

                {selectedEventModal.organizer && (
                  <div className="flex items-center text-gray-700">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-primary-600 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base break-words">{selectedEventModal.organizer}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedEventModal.description && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">About This Event</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed break-words">{selectedEventModal.description}</p>
                </div>
              )}

              {/* Long Description */}
              {selectedEventModal.longDescription && (
                <div className="mb-4 sm:mb-6">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed break-words">{selectedEventModal.longDescription}</p>
                </div>
              )}

              {/* Tags */}
              {selectedEventModal.tags && selectedEventModal.tags.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <div className="flex flex-wrap gap-2">
                    {selectedEventModal.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Registration Status */}
              {selectedEventModal.capacity && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Registration</span>
                    <span className={`text-xs sm:text-sm font-semibold ${
                      getRegistrationStatus(selectedEventModal).status === 'full' 
                        ? 'text-red-600' 
                        : getRegistrationStatus(selectedEventModal).status === 'limited'
                        ? 'text-orange-600'
                        : 'text-green-600'
                    }`}>
                      {getRegistrationStatus(selectedEventModal).text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                    <div
                      className={`h-1.5 sm:h-2 rounded-full transition-all ${
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
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    {selectedEventModal.contact.phone && (
                      <div className="flex items-center text-xs sm:text-sm text-gray-700">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-primary-600 flex-shrink-0" />
                        <a href={`tel:${selectedEventModal.contact.phone}`} className="hover:text-primary-600 break-words">
                          {selectedEventModal.contact.phone}
                        </a>
                      </div>
                    )}
                    {selectedEventModal.contact.email && (
                      <div className="flex items-center text-xs sm:text-sm text-gray-700">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-primary-600 flex-shrink-0" />
                        <a href={`mailto:${selectedEventModal.contact.email}`} className="hover:text-primary-600 break-words">
                          {selectedEventModal.contact.email}
                        </a>
                      </div>
                    )}
                    {selectedEventModal.contact.website && (
                      <div className="flex items-center text-xs sm:text-sm text-gray-700">
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-primary-600 flex-shrink-0" />
                        <a href={selectedEventModal.contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 break-words">
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Link
                  to={`/events/${selectedEventModal.id}`}
                  className="flex-1 btn-primary flex items-center justify-center text-sm sm:text-base py-2.5 sm:py-3"
                  onClick={() => setSelectedEventModal(null)}
                >
                  View Full Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                {selectedEventModal.capacity && getRegistrationStatus(selectedEventModal).status !== 'full' && (
                  <Link
                    to={`/events/${selectedEventModal.id}?register=true`}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
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