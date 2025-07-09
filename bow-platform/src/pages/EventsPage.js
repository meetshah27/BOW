import React, { useState } from 'react';
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

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');

  // Mock events data
  const events = [
    {
      id: 1,
      title: "Summer Music Festival 2024",
      date: "2024-07-15",
      time: "12:00 PM - 10:00 PM",
      location: "Seattle Center",
      category: "Festival",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Join us for our biggest event of the year! Three days of music, culture, and community celebration featuring local and international artists.",
      price: "$25",
      capacity: 5000,
      registered: 3200,
      featured: true,
      tags: ["Music", "Festival", "Family-Friendly"]
    },
    {
      id: 2,
      title: "Community Drum Circle",
      date: "2024-06-22",
      time: "6:00 PM - 8:00 PM",
      location: "Gas Works Park",
      category: "Workshop",
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Experience the power of rhythm and community in our monthly drum circle. All skill levels welcome!",
      price: "Free",
      capacity: 100,
      registered: 45,
      featured: false,
      tags: ["Drumming", "Community", "Free"]
    },
    {
      id: 3,
      title: "Youth Music Workshop",
      date: "2024-06-29",
      time: "10:00 AM - 2:00 PM",
      location: "Community Center",
      category: "Education",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "A hands-on workshop for young musicians aged 12-18. Learn about different instruments and musical styles.",
      price: "$15",
      capacity: 50,
      registered: 32,
      featured: false,
      tags: ["Youth", "Education", "Workshop"]
    },
    {
      id: 4,
      title: "Jazz in the Park",
      date: "2024-07-08",
      time: "7:00 PM - 9:00 PM",
      location: "Volunteer Park",
      category: "Concert",
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "An evening of smooth jazz under the stars. Bring a blanket and enjoy the music!",
      price: "$10",
      capacity: 300,
      registered: 180,
      featured: false,
      tags: ["Jazz", "Outdoor", "Concert"]
    },
    {
      id: 5,
      title: "Cultural Music Showcase",
      date: "2024-07-20",
      time: "5:00 PM - 8:00 PM",
      location: "Seattle Town Hall",
      category: "Showcase",
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Celebrate the diverse musical traditions of our community with performances from various cultural groups.",
      price: "$20",
      capacity: 400,
      registered: 250,
      featured: true,
      tags: ["Cultural", "Showcase", "Diverse"]
    }
  ];

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
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {filteredEvents.length} Events Found
            </h2>
            <p className="text-gray-600">
              {searchTerm && `Searching for "${searchTerm}"`}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => {
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
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
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
            </div>
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