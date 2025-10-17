import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  Ticket,
  Copy,
  Check,
  ShoppingCart,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCelebration } from '../contexts/CelebrationContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import api from '../config/api';

// Stripe will be initialized dynamically with secure key
let stripePromise = null;

// Stripe-enabled registration form component
const StripeRegistrationForm = ({ event, currentUser, registrationData, setRegistrationData, onRegister, isRegistering, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Create payment intent for paid events
    if (event.price && event.price !== 'Free' && event.price !== 0) {
      createPaymentIntent();
    }
  }, [event]);

  const createPaymentIntent = async () => {
    try {
      const amount = parseFloat(event.price.replace('$', '')) * 100; // Convert to cents
      const response = await api.post(`/events/${event.id}/create-payment-intent`, {
        amount: amount,
        userEmail: currentUser?.email || registrationData.email,
        userName: currentUser?.displayName || registrationData.name,
        userId: currentUser?.uid || currentUser?.id || `anon_${Date.now()}`
      });

      if (response.ok) {
        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } else {
        toast.error('Failed to initialize payment. Please try again.');
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast.error('Failed to initialize payment. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    // Validate form fields
    const errors = {};
    
    if (!currentUser && (!registrationData.name || !registrationData.email)) {
      errors.general = 'Name and email are required.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (event.price && event.price !== 'Free' && event.price !== 0) {
      // Handle paid event registration with Stripe
      await handlePaidRegistration();
    } else {
      // Handle free event registration
      await handleFreeRegistration();
    }
  };

  const handlePaidRegistration = async () => {
    if (!stripe || !elements || !clientSecret) {
      toast.error('Payment system is loading. Please wait a moment and try again.');
      return;
    }

    setPaymentLoading(true);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: currentUser?.displayName || registrationData.name,
            email: currentUser?.email || registrationData.email,
          },
        }
      });

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        toast.error(stripeError.message || 'Payment failed. Please try again.');
        setPaymentLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Registration with successful payment - webhook will handle confirmation
        await onRegister(paymentIntent.id);
        toast.success('Payment successful! Registration confirmation will be sent via email.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      setPaymentLoading(false);
    }
  };

  const handleFreeRegistration = async () => {
    await onRegister();
  };

  const isPaidEvent = event.price && event.price !== 'Free' && event.price !== 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 animate-in">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Register for Event</h3>
                <p className="text-sm text-gray-600">{event.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {isPaidEvent && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-semibold text-blue-900">Payment Required</span>
              </div>
              <p className="text-blue-700 text-sm">
                This event requires a payment of <span className="font-semibold">{event.price}</span>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                Phone Number
              </label>
              <input
                type="tel"
                value={registrationData.phone || ''}
                onChange={currentUser ? undefined : (e) => setRegistrationData({...registrationData, phone: e.target.value})}
                disabled={!!currentUser}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${currentUser ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`}
                placeholder="Enter your phone number (optional)"
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

            {isPaidEvent && (
              <div className="border-t pt-4">
                 <label className="block text-sm font-medium text-gray-700 mb-3">
                   Payment Information
                 </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Card Number</label>
                    <div className="px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
                       <CardNumberElement
                         options={{
                           showIcon: true,
                           disableLink: true,
                           style: {
                             base: {
                               fontSize: '16px',
                               color: '#424770',
                               fontFamily: 'system-ui, -apple-system, sans-serif',
                               '::placeholder': {
                                 color: '#aab7c4',
                               },
                             },
                             invalid: {
                               color: '#e25950',
                             },
                           },
                           hidePostalCode: true,
                         }}
                       />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Expiry Date</label>
                      <div className="px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
                         <CardExpiryElement
                           options={{
                             style: {
                               base: {
                                 fontSize: '16px',
                                 color: '#424770',
                                 fontFamily: 'system-ui, -apple-system, sans-serif',
                                 '::placeholder': {
                                   color: '#aab7c4',
                                 },
                               },
                               invalid: {
                                 color: '#e25950',
                               },
                             },
                           }}
                         />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">CVC</label>
                      <div className="px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
                         <CardCvcElement
                           options={{
                             style: {
                               base: {
                                 fontSize: '16px',
                                 color: '#424770',
                                 fontFamily: 'system-ui, -apple-system, sans-serif',
                                 '::placeholder': {
                                   color: '#aab7c4',
                                 },
                               },
                               invalid: {
                                 color: '#e25950',
                               },
                             },
                           }}
                         />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {validationErrors.general && (
              <div className="text-red-600 text-sm">{validationErrors.general}</div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isRegistering || paymentLoading || (isPaidEvent && !clientSecret)}
                className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {paymentLoading ? 'Processing Payment...' : isRegistering ? 'Registering...' : isPaidEvent ? `Pay ${event.price} & Register` : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const EventDetailsPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { triggerConfetti } = useCelebration();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stripeLoaded, setStripeLoaded] = useState(false);
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
  const [copiedTicket, setCopiedTicket] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [existingRegistration, setExistingRegistration] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');

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
        const response = await api.get(`/events/${id}`);
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

  // Fetch logo from about page content
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await api.get('/about-page');
        if (response.ok) {
          const data = await response.json();
          if (data.logo) {
            setLogoUrl(data.logo);
          }
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
    
    fetchLogo();
  }, []);

  // Keep registrationData in sync with currentUser
  useEffect(() => {
    if (currentUser) {
      console.log('Current user data:', currentUser);
      const userName = currentUser.displayName || 
                      (currentUser.firstName && currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : null) ||
                      currentUser.firstName ||
                      currentUser.email || '';
      console.log('Setting userName to:', userName);
      setRegistrationData(data => ({
        ...data,
        name: userName,
        email: currentUser.email || '',
        phone: currentUser.phone || ''
      }));
    }
  }, [currentUser]);

  // Check if user is already registered for this event
  useEffect(() => {
    const checkExistingRegistration = async () => {
      if (!event) return;
      
      if (currentUser) {
        // For logged-in users, check from backend
        try {
          const userId = currentUser.uid || currentUser.id;
          const response = await api.get(`/events/user/${userId}/registrations`);
          if (response.ok) {
            const registrations = await response.json();
            const existingReg = registrations.find(reg => reg.eventId === event.id || reg.eventId === event._id);
            
            if (existingReg) {
              setIsAlreadyRegistered(true);
              setExistingRegistration(existingReg);
              setTicketInfo({
                ticketNumber: existingReg.ticketNumber,
                registration: existingReg
              });
            }
          }
        } catch (error) {
          console.error('Error checking existing registration:', error);
        }
      } else {
        // For guest users, check localStorage
        const guestRegistrations = JSON.parse(localStorage.getItem('guestRegistrations') || '[]');
        const existingReg = guestRegistrations.find(reg => reg.eventId === event.id || reg.eventId === event._id);
        
        if (existingReg) {
          setIsAlreadyRegistered(true);
          setExistingRegistration(existingReg);
          setTicketInfo({
            ticketNumber: existingReg.ticketNumber,
            registration: existingReg
          });
        }
      }
    };
    
    checkExistingRegistration();
  }, [currentUser, event]);

  // Initialize Stripe dynamically
  useEffect(() => {
    const initializeStripe = async () => {
      try {
        console.log('🔐 Initializing Stripe...');
        const response = await api.get('/stripe-config');
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.publishableKey) {
            // Initialize Stripe with the secure publishable key
            stripePromise = loadStripe(data.publishableKey);
            setStripeLoaded(true);
            console.log('✅ Stripe loaded successfully');
          } else {
            throw new Error('No publishable key received');
          }
        } else {
          throw new Error('Failed to fetch Stripe configuration');
        }
      } catch (error) {
        console.error('❌ Failed to initialize Stripe:', error.message);
        toast.error('Payment system is not available. Please try again later.');
      }
    };

    initializeStripe();
  }, []);

  // Add function to handle registration button click with auth check
  const handleRegistrationClick = () => {
    if (!currentUser) {
      // Store the current page location to redirect back after login
      const currentPath = window.location.pathname;
      navigate('/login', { 
        state: { from: { pathname: currentPath } },
        replace: false 
      });
      toast.error('Please log in to register for events');
      return;
    }
    setShowRegistrationModal(true);
  };

  const handleRegistration = async (paymentIntentId = null) => {
    setIsRegistering(true);
    try {
      // Extra validation for required fields
      if (!currentUser && (!registrationData.name || !registrationData.email)) {
        toast.error('Name and email are required.');
        setIsRegistering(false);
        return;
      }
      
      // Prepare request body
      let requestBody;
      let headers = { 'Content-Type': 'application/json' };
      
      // Calculate payment amount if it's a paid event
      let paymentAmount = 0;
      if (event.price && event.price !== 'Free' && event.price !== 0) {
        paymentAmount = parseFloat(event.price.replace('$', '')) * 100; // Convert to cents
      }
      
      if (currentUser) {
        requestBody = {
          userId: currentUser.uid || currentUser.id,
          userEmail: currentUser.email,
          userName: currentUser.displayName || 
                   (currentUser.firstName && currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : null) ||
                   currentUser.firstName ||
                   currentUser.email,
          phone: currentUser.phone || registrationData.phone || '',
          dietaryRestrictions: registrationData.dietaryRestrictions,
          specialRequests: registrationData.specialRequests,
          paymentAmount: paymentAmount,
          paymentIntentId: paymentIntentId,
          isPaidEvent: paymentAmount > 0
        };
        console.log('Registration data for logged-in user:', requestBody);
        // Add auth token if available
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }
      } else {
        const tempUserId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        requestBody = {
          userId: tempUserId,
          userEmail: registrationData.email,
          userName: registrationData.name,
          phone: registrationData.phone || '',
          dietaryRestrictions: registrationData.dietaryRestrictions,
          specialRequests: registrationData.specialRequests,
          paymentAmount: paymentAmount,
          paymentIntentId: paymentIntentId,
          isPaidEvent: paymentAmount > 0
        };
        console.log('Registration data for guest user:', requestBody);
      }
      const response = await api.post(`/events/${id}/register`, requestBody, { headers });
      if (response.ok) {
        const result = await response.json();
        setTicketInfo(result);
        setShowRegistrationModal(false);
        setIsAlreadyRegistered(true);
        setExistingRegistration(result.registration);
        
        // Save guest registration to localStorage if not logged in
        if (!currentUser && result.registration) {
          const guestRegistrations = JSON.parse(localStorage.getItem('guestRegistrations') || '[]');
          guestRegistrations.push(result.registration);
          localStorage.setItem('guestRegistrations', JSON.stringify(guestRegistrations));
        }
        
        toast.success('Registration successful! Check your email for ticket details.');
        triggerConfetti();
        
        // Refetch the event to get the updated registration count
        console.log('[Frontend] Refetching event data after registration...');
        const eventResponse = await api.get(`/events/${id}`);
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
        
        // Check if user is already registered
        if (errorData.message && errorData.message.includes('already registered')) {
          setIsAlreadyRegistered(true);
          if (errorData.registration) {
            setExistingRegistration(errorData.registration);
            setTicketInfo({
              ticketNumber: errorData.registration.ticketNumber,
              registration: errorData.registration
            });
          }
          toast.info('You are already registered for this event!');
        } else {
          toast.error(errorData.message || 'Registration failed');
        }
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

  const copyTicketToClipboard = async () => {
    if (ticketInfo?.ticketNumber) {
      try {
        await navigator.clipboard.writeText(ticketInfo.ticketNumber);
        setCopiedTicket(true);
        toast.success('Ticket number copied to clipboard!');
        setTimeout(() => setCopiedTicket(false), 2000);
      } catch (err) {
        toast.error('Failed to copy ticket number');
      }
    }
  };

  const generateReceipt = () => {
    if (!ticketInfo?.registration) return;
    
    const registration = ticketInfo.registration;
    const receiptData = {
      event: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      ticketNumber: ticketInfo.ticketNumber,
      attendeeName: registration.userName,
      attendeeEmail: registration.userEmail,
      paymentAmount: (registration.paymentAmount / 100).toFixed(2),
      paymentDate: new Date(registration.paymentDate).toLocaleDateString(),
      transactionId: registration.paymentIntentId,
      receiptDate: new Date().toLocaleDateString()
    };

    // Create receipt HTML
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Event Registration Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
          .receipt-title { color: #2563eb; font-size: 28px; font-weight: bold; margin: 0; }
          .receipt-subtitle { color: #6b7280; margin: 5px 0 0 0; }
          .section { margin-bottom: 25px; }
          .section-title { font-weight: bold; color: #374151; margin-bottom: 10px; font-size: 16px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .info-label { color: #6b7280; }
          .info-value { font-weight: 500; color: #111827; }
          .payment-section { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 20px; }
          .total { font-size: 18px; font-weight: bold; color: #059669; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="receipt-title">Beats of Washington</h1>
          <p class="receipt-subtitle">Event Registration Receipt</p>
        </div>
        
        <div class="section">
          <div class="section-title">Event Details</div>
          <div class="info-row">
            <span class="info-label">Event:</span>
            <span class="info-value">${receiptData.event}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Date:</span>
            <span class="info-value">${receiptData.date}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Time:</span>
            <span class="info-value">${receiptData.time}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Location:</span>
            <span class="info-value">${receiptData.location}</span>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Registration Details</div>
          <div class="info-row">
            <span class="info-label">Ticket Number:</span>
            <span class="info-value">${receiptData.ticketNumber}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Attendee Name:</span>
            <span class="info-value">${receiptData.attendeeName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">${receiptData.attendeeEmail}</span>
          </div>
        </div>
        
        <div class="payment-section">
          <div class="section-title">Payment Information</div>
          <div class="info-row">
            <span class="info-label">Amount Paid:</span>
            <span class="info-value total">$${receiptData.paymentAmount}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Payment Date:</span>
            <span class="info-value">${receiptData.paymentDate}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Transaction ID:</span>
            <span class="info-value">${receiptData.transactionId}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for supporting Beats of Washington!</p>
          <p>Receipt generated on ${receiptData.receiptDate}</p>
        </div>
      </body>
      </html>
    `;

    // Create and download the receipt
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${receiptData.ticketNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Receipt downloaded successfully!');
  };



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
              {/* Event Details Section */}
              <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-primary-500 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-4 overflow-hidden">
                      {logoUrl ? (
                        <img 
                          src={logoUrl} 
                          alt="BOW Logo" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Star className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Event Details</h2>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors hover:bg-primary-50 rounded-lg">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-600 transition-colors hover:bg-red-50 rounded-lg">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg border-l-4 border-primary-200">
                    {event.longDescription || event.description}
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-secondary-500 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">#</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Event Tags</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-secondary-100 text-secondary-800 rounded-full text-sm font-medium hover:bg-secondary-200 transition-colors duration-200 cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <Ticket className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Registration</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-gray-900">{event.price}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-semibold text-gray-900">{event.capacity}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Registered:</span>
                    <span className="font-semibold text-gray-900">{event.registeredCount}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Registration Progress</span>
                      <span className="text-gray-900">{Math.round(registrationPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${registrationPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {isAlreadyRegistered ? (
                    <div className="text-center py-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-center mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <span className="text-green-800 font-medium">Already Registered</span>
                        </div>
                        <p className="text-green-700 text-sm">You have successfully registered for this event!</p>
                        {ticketInfo?.ticketNumber && (
                          <div className="mt-3 p-3 bg-white rounded border">
                            <p className="text-sm text-gray-600 mb-1">Your Ticket Number:</p>
                            <p className="font-mono text-sm text-green-700">{ticketInfo.ticketNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : event.isLive ? (
                    <button 
                      onClick={handleRegistrationClick}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                        isRegistrationOpen && ((event.price && event.price !== 'Free' && event.price !== 0) ? stripeLoaded : true)
                          ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!isRegistrationOpen || ((event.price && event.price !== 'Free' && event.price !== 0) && !stripeLoaded)}
                    >
                      {!isRegistrationOpen 
                        ? 'Registration Full' 
                        : (event.price && event.price !== 'Free' && event.price !== 0) && !stripeLoaded
                        ? 'Loading Payment System...'
                        : 'Register Now'
                      }
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

              {/* Event Information Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Event Information</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                    <Calendar className="w-5 h-5 mr-3 mt-0.5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">{event.date}</p>
                      <p className="text-sm text-gray-600">{event.time}</p>
                    </div>
                  </div>
                  
                                     <div className="flex items-start p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                     <MapPin className="w-5 h-5 mr-3 mt-0.5 text-blue-500" />
                     <div>
                       <p className="font-medium text-gray-900">{event.location}</p>
                       <p className="text-sm text-gray-600">{event.address || event.location}</p>
                     </div>
                   </div>
                  
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                    <Users className="w-5 h-5 mr-3 text-blue-500" />
                    <span className="text-gray-900">{event.organizer}</span>
                  </div>
                </div>
              </div>

              {/* Shop Section */}
              {(event.extraUrl1 || event.extraUrl2 || event.extraUrl3) && (
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                      <ShoppingCart className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Shop</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {event.extraUrl1 && (
                      <div className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
                        <Globe className="w-4 h-4 mr-3 text-green-500" />
                        <a 
                          href={event.extraUrl1} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-900 hover:text-green-600 transition-colors duration-200 break-all"
                        >
                          {event.extraUrl1}
                        </a>
                      </div>
                    )}
                    
                    {event.extraUrl2 && (
                      <div className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
                        <Globe className="w-4 h-4 mr-3 text-green-500" />
                        <a 
                          href={event.extraUrl2} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-900 hover:text-green-600 transition-colors duration-200 break-all"
                        >
                          {event.extraUrl2}
                        </a>
                      </div>
                    )}
                    
                    {event.extraUrl3 && (
                      <div className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
                        <Globe className="w-4 h-4 mr-3 text-green-500" />
                        <a 
                          href={event.extraUrl3} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-900 hover:text-green-600 transition-colors duration-200 break-all"
                        >
                          {event.extraUrl3}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Information Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                    <Mail className="w-4 h-4 mr-3 text-purple-500" />
                    <a href="mailto:beatsofredmond@gmail.com" className="text-gray-900 hover:text-purple-600 transition-colors duration-200">
                      beatsofredmond@gmail.com
                    </a>
                  </div>
                  
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                    <Globe className="w-4 h-4 mr-3 text-purple-500" />
                    <a href="https://beatsofwashington.com" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-purple-600 transition-colors duration-200">
                      beatsofwashington.com
                    </a>
                  </div>
                  
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                    <Phone className="w-4 h-4 mr-3 text-purple-500" />
                    <a href="tel:+12063699576" className="text-gray-900 hover:text-purple-600 transition-colors duration-200">
                      (206) 369-9576
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
        (event.price && event.price !== 'Free' && event.price !== 0 && stripeLoaded) || 
        (!event.price || event.price === 'Free' || event.price === 0)
      ) && (
        <Elements stripe={stripePromise}>
          <StripeRegistrationForm
            event={event}
            currentUser={currentUser}
            registrationData={registrationData}
            setRegistrationData={setRegistrationData}
            onRegister={handleRegistration}
            isRegistering={isRegistering}
            onClose={() => setShowRegistrationModal(false)}
          />
        </Elements>
      )}

      {/* Ticket Success Modal */}
      {ticketInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 animate-in">
            <div className="p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt="BOW Logo" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <CheckCircle className="w-10 h-10 text-white" />
                )}
              </div>
               <h3 className="text-2xl font-bold text-gray-900 mb-2">
                 {ticketInfo.registration?.paymentAmount > 0 && ticketInfo.registration?.paymentStatus === 'pending' 
                   ? 'Registration Pending!' 
                   : 'Registration Successful!'
                 }
               </h3>
               <p className="text-gray-600 mb-6">
                 {ticketInfo.registration?.paymentAmount > 0 && ticketInfo.registration?.paymentStatus === 'pending'
                   ? 'Your registration is being processed. You will receive a confirmation email once payment is confirmed.'
                   : 'Your ticket has been generated and sent to your email.'
                 }
               </p>
              
               {/* Payment Information for Paid Events */}
               {ticketInfo.registration?.paymentAmount > 0 && (
                 <div className={`rounded-lg p-4 mb-4 border ${
                   ticketInfo.registration.paymentStatus === 'pending' 
                     ? 'bg-yellow-50 border-yellow-200' 
                     : 'bg-blue-50 border-blue-200'
                 }`}>
                   <div className="flex items-center justify-center mb-2">
                     <CreditCard className={`w-5 h-5 mr-2 ${
                       ticketInfo.registration.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-blue-600'
                     }`} />
                     <span className={`font-semibold ${
                       ticketInfo.registration.paymentStatus === 'pending' ? 'text-yellow-900' : 'text-blue-900'
                     }`}>
                       {ticketInfo.registration.paymentStatus === 'pending' ? 'Payment Processing' : 'Payment Confirmed'}
                     </span>
                   </div>
                   <p className={`text-sm ${
                     ticketInfo.registration.paymentStatus === 'pending' ? 'text-yellow-700' : 'text-blue-700'
                   }`}>
                     Amount: <span className="font-semibold">${(ticketInfo.registration.paymentAmount / 100).toFixed(2)}</span>
                   </p>
                   {ticketInfo.registration.paymentIntentId && (
                     <p className={`text-xs mt-1 ${
                       ticketInfo.registration.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-blue-600'
                     }`}>
                       Transaction ID: {ticketInfo.registration.paymentIntentId}
                     </p>
                   )}
                 </div>
               )}
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6 border border-green-200">
                <div className="flex items-center justify-center space-x-3">
                  <Ticket className="w-6 h-6 text-green-600" />
                  <p className="text-xl font-mono text-green-700 font-bold">{ticketInfo.ticketNumber}</p>
                  <button
                    onClick={copyTicketToClipboard}
                    className="p-2 text-gray-500 hover:text-green-600 transition-all duration-200 hover:bg-green-100 rounded-lg"
                    title="Copy ticket number"
                  >
                    {copiedTicket ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">Click the copy button to save your ticket number</p>
              </div>
              
               <div className="flex space-x-3">
                 {ticketInfo.registration?.paymentAmount > 0 && ticketInfo.registration?.paymentStatus === 'completed' && (
                   <button
                     onClick={() => generateReceipt()}
                     className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                   >
                     Download Receipt
                   </button>
                 )}
                 <button
                   onClick={() => setTicketInfo(null)}
                   className={`py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 ${ticketInfo.registration?.paymentAmount > 0 && ticketInfo.registration?.paymentStatus === 'completed' ? 'flex-1' : 'w-full'}`}
                 >
                   Close
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetailsPage; 