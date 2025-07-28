import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowLeft,
  Share2,
  Heart,
  Star,
  Phone,
  Mail,
  Globe,
  X,
  CheckCircle,
  Ticket
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCelebration } from '../contexts/CelebrationContext';
import toast from 'react-hot-toast';
import { fetchAuthSession } from 'aws-amplify/auth';

const EventDetailsPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { triggerConfetti } = useCelebration();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: currentUser ? (currentUser.displayName || '') : '',
    email: currentUser ? (currentUser.email || '') : '',
    phone: currentUser ? (currentUser.phone || '') : '',
    dietaryRestrictions: '',
    specialRequests: '',
    cardNumber: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [ticketInfo, setTicketInfo] = useState(null);

  // Mock event data - in a real app, this would come from your backend
  const mockEvents = [
    {
      id: 1,
      title: "Summer Music Festival 2024",
      date: "July 15, 2024",
      time: "2:00 PM - 10:00 PM",
      location: "Seattle Center",
      address: "305 Harrison St, Seattle, WA 98109",
      category: "Festival",
      featured: true,
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      description: "Join us for the biggest music festival of the summer! Experience incredible performances from local and international artists, food trucks, craft vendors, and family-friendly activities. This year's festival celebrates the diversity of our community through music, dance, and cultural performances.",
      longDescription: "The Summer Music Festival 2024 is our flagship event that brings together over 5,000 community members for a day of celebration, music, and cultural exchange. This year's theme is 'Unity Through Music' and features performances from over 20 artists representing diverse musical traditions from around the world.\n\nHighlights include:\n• Main stage performances from 2 PM to 10 PM\n• Cultural dance performances throughout the day\n• Food trucks offering international cuisine\n• Craft vendors and art installations\n• Family activity zone with music workshops\n• Silent disco for late-night fun\n\nAll proceeds support our community music education programs.",
      capacity: 5000,
      registered: 3200,
      price: "Free",
      organizer: "Beats of Washington",
      contact: {
        phone: "(206) 555-0123",
        email: "events@beatsofwashington.org",
        website: "https://beatsofwashington.org"
      },
      tags: ["Music", "Festival", "Family-Friendly", "Cultural", "Free"]
    },
    {
      id: 2,
      title: "Community Drum Circle",
      date: "June 22, 2024",
      time: "6:00 PM - 8:00 PM",
      location: "Gas Works Park",
      address: "2101 N Northlake Way, Seattle, WA 98103",
      category: "Workshop",
      featured: false,
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      description: "Join our monthly community drum circle! All skill levels welcome. Bring your own drum or use one of ours.",
      longDescription: "Our community drum circle is a monthly gathering that celebrates rhythm and connection. Whether you're a seasoned percussionist or have never touched a drum before, you're welcome to join us!\n\nWhat to expect:\n• Guided drumming sessions for beginners\n• Free-form jamming for experienced players\n• Drum rental available (first come, first served)\n• Snacks and refreshments provided\n• Beautiful sunset views over Lake Union\n\nNo experience necessary - just bring your enthusiasm and willingness to connect through rhythm!",
      capacity: 100,
      registered: 45,
      price: "Free",
      organizer: "Beats of Washington",
      contact: {
        phone: "(206) 555-0123",
        email: "events@beatsofwashington.org",
        website: "https://beatsofwashington.org"
      },
      tags: ["Drumming", "Community", "Free", "Outdoor", "All Ages"]
    },
    {
      id: 3,
      title: "Youth Music Workshop",
      date: "June 29, 2024",
      time: "10:00 AM - 2:00 PM",
      location: "Community Center",
      address: "123 Main St, Seattle, WA 98101",
      category: "Workshop",
      featured: false,
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      description: "A hands-on music workshop for youth ages 12-18. Learn to play various instruments and create music together.",
      longDescription: "This youth-focused workshop is designed to inspire the next generation of musicians and music lovers. Participants will have the opportunity to try different instruments, learn basic music theory, and collaborate on group performances.\n\nWorkshop includes:\n• Introduction to various instruments (guitar, keyboard, drums, ukulele)\n• Basic music theory and notation\n• Songwriting workshop\n• Group performance opportunity\n• Take-home materials and resources\n\nInstruments provided - no experience necessary!",
      capacity: 50,
      registered: 32,
      price: "$15",
      organizer: "Beats of Washington",
      contact: {
        phone: "(206) 555-0123",
        email: "events@beatsofwashington.org",
        website: "https://beatsofwashington.org"
      },
            tags: ["Youth", "Workshop", "Educational", "Instruments", "Creative"]
    }
  ];

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/events/${id}`);
        if (!response.ok) throw new Error('Event not found');
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // Keep registrationData in sync with currentUser
  useEffect(() => {
    if (currentUser) {
      setRegistrationData(data => ({
        ...data,
        name: currentUser.displayName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || ''
      }));
    }
  }, [currentUser]);

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      // Extra validation for required fields
      if (!currentUser && (!registrationData.name || !registrationData.email)) {
        toast.error('Name and email are required.');
        setIsRegistering(false);
        return;
      }
      if (!registrationData.phone) {
        toast.error('Phone number is required.');
        setIsRegistering(false);
        return;
      }
      if ((event.price && event.price !== 'Free' && event.price !== 0) && !registrationData.cardNumber) {
        toast.error('Card number is required for paid events.');
        setIsRegistering(false);
        return;
      }
      // Prepare request body
      let requestBody;
      let headers = { 'Content-Type': 'application/json' };
      if (currentUser) {
        requestBody = {
          userId: currentUser.uid || currentUser.id,
          userEmail: currentUser.email,
          userName: currentUser.displayName || currentUser.email,
          phone: currentUser.phone || registrationData.phone,
          dietaryRestrictions: registrationData.dietaryRestrictions,
          specialRequests: registrationData.specialRequests,
          cardNumber: registrationData.cardNumber
        };
        // Add Cognito token if logged in
        const { tokens } = await fetchAuthSession();
        const idToken = tokens?.idToken?.toString();
        headers['Authorization'] = `Bearer ${idToken}`;
      } else {
        const tempUserId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        requestBody = {
          userId: tempUserId,
          userEmail: registrationData.email,
          userName: registrationData.name,
          phone: registrationData.phone,
          dietaryRestrictions: registrationData.dietaryRestrictions,
          specialRequests: registrationData.specialRequests,
          cardNumber: registrationData.cardNumber
        };
      }
      const response = await fetch(`http://localhost:3000/api/events/${id}/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const result = await response.json();
        setTicketInfo(result);
        setShowRegistrationModal(false);
        toast.success('Registration successful! Check your email for ticket details.');
        triggerConfetti();
        
        // Refetch the event to get the updated registration count
        console.log('[Frontend] Refetching event data after registration...');
        const eventResponse = await fetch(`http://localhost:3000/api/events/${id}`);
        if (eventResponse.ok) {
          const updatedEvent = await eventResponse.json();
          console.log('[Frontend] Updated event data:', updatedEvent);
          setEvent(updatedEvent);
        } else {
          console.log('[Frontend] Failed to refetch event, using fallback increment');
          // Fallback to manual increment if refetch fails
          setEvent(prev => ({ ...prev, registeredCount: prev.registeredCount + 1 }));
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Registration failed');
      }
    } catch (error) {
      console.error('[Registration] Network or other error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-8">The event you're looking for doesn't exist.</p>
          <Link to="/events" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const registrationPercentage = (event.registeredCount / event.capacity) * 100;
  const isRegistrationOpen = event.isLive && event.isActive && event.registeredCount < event.capacity;

  return (
    <>
      <Helmet>
        <title>{event.title} - Beats of Washington</title>
        <meta name="description" content={event.description} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-96">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="absolute inset-0 flex items-center">
            <div className="container-custom">
              <div className="max-w-4xl">
                <Link to="/events" className="inline-flex items-center text-white hover:text-gray-200 mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Events
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {event.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {event.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {event.location}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Details */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Event Details</h2>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="text-lg text-gray-600 mb-6">
                    {event.description}
                  </p>
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {event.longDescription}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Registration</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-gray-900">{event.price}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-semibold text-gray-900">{event.capacity}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Registered:</span>
                    <span className="font-semibold text-gray-900">{event.registeredCount}</span>
                  </div>
                  

                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Registration Progress</span>
                      <span className="text-gray-900">{Math.round(registrationPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${registrationPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {event.isLive ? (
                    <button 
                      onClick={() => setShowRegistrationModal(true)}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                        isRegistrationOpen 
                          ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!isRegistrationOpen}
                    >
                      {isRegistrationOpen ? 'Register Now' : 'Registration Full'}
                    </button>
                  ) : (
                    <div className="text-center py-4">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center justify-center mb-2">
                          <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                          <span className="text-yellow-800 font-medium">Registration Not Open</span>
                        </div>
                        <p className="text-yellow-700 text-sm">This event is not yet live for registration. Check back later!</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 mr-3 mt-0.5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{event.date}</p>
                      <p className="text-sm text-gray-600">{event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 mt-0.5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{event.location}</p>
                      <p className="text-sm text-gray-600">{event.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-3 text-gray-500" />
                    <span className="text-gray-900">{event.organizer}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-3 text-gray-500" />
                    <a href={`tel:${event.contact.phone}`} className="text-gray-900 hover:text-primary-600">
                      {event.contact.phone}
                    </a>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-3 text-gray-500" />
                    <a href={`mailto:${event.contact.email}`} className="text-gray-900 hover:text-primary-600">
                      {event.contact.email}
                    </a>
                  </div>
                  
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-3 text-gray-500" />
                    <a href={event.contact.website} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-primary-600">
                      Visit Website
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Register for Event</h3>
                  {currentUser ? (
                    <p className="text-sm text-green-600 mt-1">✓ Logged in as {currentUser.displayName || currentUser.email}</p>
                  ) : (
                    <p className="text-sm text-orange-600 mt-1">⚠ Guest registration - please provide your details</p>
                  )}
                </div>
                <button
                  onClick={() => setShowRegistrationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleRegistration} className="space-y-4">
                {currentUser ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={registrationData.name}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={registrationData.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={registrationData.name}
                        onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={registrationData.email}
                        onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={registrationData.phone}
                    onChange={currentUser ? undefined : (e) => setRegistrationData({...registrationData, phone: e.target.value})}
                    disabled={!!currentUser}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${currentUser ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dietary Restrictions
                  </label>
                  <textarea
                    value={registrationData.dietaryRestrictions}
                    onChange={(e) => setRegistrationData({...registrationData, dietaryRestrictions: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Any dietary restrictions or allergies?"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    value={registrationData.specialRequests}
                    onChange={(e) => setRegistrationData({...registrationData, specialRequests: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Any special requests or accommodations needed?"
                    rows="2"
                  />
                </div>

                {(event.price && event.price !== 'Free' && event.price !== 0) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={registrationData.cardNumber || ''}
                        onChange={e => setRegistrationData({ ...registrationData, cardNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter your card number"
                      />
                    </div>
                    <div className="flex items-center my-2">
                      <button
                        type="button"
                        className="flex-1 py-2 px-4 bg-black text-white rounded-lg mr-2 opacity-70 cursor-not-allowed"
                        disabled
                      >
                        Apple Pay (Coming Soon)
                      </button>
                    </div>
                  </>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRegistrationModal(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {isRegistering ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Success Modal */}
      {ticketInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Registration Successful!</h3>
              <p className="text-gray-600 mb-4">Your ticket has been generated and sent to your email.</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Ticket className="w-5 h-5 mr-2 text-primary-600" />
                  <span className="font-semibold text-gray-900">Ticket Number</span>
                </div>
                <p className="text-lg font-mono text-primary-600">{ticketInfo.ticketNumber}</p>
              </div>
              
              <button
                onClick={() => setTicketInfo(null)}
                className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetailsPage; 