import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Heart, 
  Shield, 
  Users, 
  Music, 
  Award,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';
import {loadStripe} from '@stripe/stripe-js';
import {Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements} from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { useCelebration } from '../contexts/CelebrationContext';

import api from '../config/api';
import HeroSection from '../components/common/HeroSection';

// Stripe will be initialized dynamically with secure key
let stripePromise = null;

function StripeDonationForm({amount, donorEmail, donorName, logoUrl}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { triggerConfetti } = useCelebration();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors({});
    
    // Validate form fields before proceeding
    const errors = {};
    
    if (!donorName || donorName.trim() === '') {
      errors.donorName = 'Please enter your full name';
    }
    
    if (!donorEmail || donorEmail.trim() === '') {
      errors.donorEmail = 'Please enter your email address';
    } else {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(donorEmail)) {
        errors.donorEmail = 'Please enter a valid email address';
      }
    }
    
    if (!amount || amount <= 0) {
      errors.amount = 'Please select a donation amount';
    }
    
    // Check if Stripe is loaded
    if (!stripe || !elements) {
      toast.error('Payment system is loading. Please wait a moment and try again.');
      return;
    }
    
    // If there are validation errors, show them and return
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      
      // Show the first error as a toast
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      
      return;
    }
    
    setLoading(true);
    
    try {
      // Create payment intent
      const res = await api.post('/payment/create-payment-intent', {
        amount: Math.round(amount * 100), 
        currency: 'usd',
        donorEmail: donorEmail,
        donorName: donorName,
        isRecurring: false,
        frequency: 'one-time'
      });
      
      if (!res.ok) {
        throw new Error('Payment intent creation failed');
      }
      
      const {clientSecret, error} = await res.json();
      if (error) throw new Error(error);
           
      // Create payment method first
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardNumberElement),
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      // Confirm payment with the payment method
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });
      
      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        // Custom success toast with logo
        toast.success(
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="BOW Logo" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-sm">B</span>
              )}
            </div>
            <div>
              <div className="font-semibold text-green-800">Thank you for your donation!</div>
              <div className="text-sm text-green-600">Your contribution makes a difference</div>
            </div>
          </div>,
          {
            duration: 5000,
            style: {
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '16px',
            },
          }
        );
        triggerConfetti(); // Trigger confetti animation
        // Clear the form
        elements.getElement(CardNumberElement).clear();
        elements.getElement(CardExpiryElement).clear();
        elements.getElement(CardCvcElement).clear();
      }
    } catch (err) {
      console.error('Payment error:', err);
      
      // Provide more specific error messages
      if (err.message.includes('email')) {
        toast.error('Please enter a valid email address');
      } else if (err.message.includes('name')) {
        toast.error('Please enter your full name');
      } else if (err.message.includes('amount')) {
        toast.error('Please select a donation amount');
      } else if (err.message.includes('card')) {
        toast.error('Please check your card details and try again');
      } else if (err.message.includes('network') || err.message.includes('fetch')) {
        toast.error('Connection error. Please check your internet and try again');
      } else if (err.message.includes('intent')) {
        toast.error('Payment system error. Please try again in a moment');
      } else {
        toast.error(err.message || 'Payment failed. Please check your details and try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      {/* Card Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Number *
        </label>
        <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
          <CardNumberElement 
            options={{
              showIcon: true,
              disableLink: true, // Disabled autofill link
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {/* Card Details Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Expiration Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiration Date (MM/YY) *
          </label>
          <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
            <CardExpiryElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* CVC */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVC *
          </label>
          <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
            <CardCvcElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        className="btn-primary w-full" 
        disabled={!stripe || loading}
      >
        {loading ? 'Processing Payment...' : `Donate $${amount}`}
      </button>
    </form>
  );
}

const DonationPage = () => {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorName, setDonorName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [stripeError, setStripeError] = useState(null);

  // Fetch logo and Stripe configuration
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

    const fetchStripeConfig = async () => {
      try {
        console.log('🔐 Fetching Stripe configuration...');
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
        console.error('❌ Error fetching Stripe configuration:', error);
        setStripeError('Payment processing is currently unavailable. Please try again later.');
        toast.error('Payment system is temporarily unavailable');
      }
    };
    
    fetchLogo();
    fetchStripeConfig();
  }, []);

  const presetAmounts = [25, 50, 100, 250, 500];

  const donationTiers = [
    {
      name: "Community Supporter",
      amount: 25,
      benefits: [
        "Event updates and notifications",
        "Recognition on our website",
        "Thank you message from our team"
      ]
    },
    {
      name: "Music Advocate",
      amount: 50,
      benefits: [
        "All Community Supporter benefits",
        "Early access to event tickets",
        "Exclusive behind-the-scenes content",
        "Invitation to special events"
      ]
    },
    {
      name: "Cultural Champion",
      amount: 100,
      benefits: [
        "All Music Advocate benefits",
        "Invitation to donor appreciation events",
        "Personal thank you from our founders",
        "Behind-the-scenes event access"
      ]
    },
    {
      name: "Community Leader",
      amount: 250,
      benefits: [
        "All Cultural Champion benefits",
        "Naming opportunity at events",
        "Annual impact report",
        "VIP access to all events"
      ]
    }
  ];





  const getAmount = () => {
    return customAmount || selectedAmount;
  };

  return (
    <>
      <Helmet>
        <title>Donate - Beats of Washington</title>
        <meta name="description" content="Support Beats of Washington's mission to empower communities through music. Your donation helps us create inclusive spaces and cultural programs." />
      </Helmet>

      {/* Hero Section */}
      <HeroSection
        title={
          <>
            <span>Support Our</span>
            <br />
            <span>Mission</span>
          </>
        }
        description="Your donation helps us create inclusive spaces, provide music education and bring communities together through the power of music."
        logoUrl={logoUrl}
        showLogo={true}
        floatingElements={[
          { icon: Heart, position: 'top-12 left-16', animation: 'animate-spin-slow' },
          { icon: Music, position: 'top-24 right-24', animation: 'animate-pulse' },
          { icon: Users, position: 'bottom-20 left-1/4', animation: 'animate-bounce' },
          { icon: Star, position: 'bottom-12 right-16', animation: 'animate-pulse' }
        ]}
        interactiveElements={[
          { icon: Heart, label: 'Give Back', color: 'text-red-300' },
          { icon: Music, label: 'Make Impact', color: 'text-orange-300' }
        ]}
      />

      {/* Donation Form */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Donation Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center overflow-hidden">
                  {logoUrl ? (
                    <img 
                      src={logoUrl} 
                      alt="BOW Logo" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-xl">B</span>
                  )}
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Make a Donation
                </h2>
              </div>

              {/* Amount Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Select Amount
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                      className={`py-3 px-4 rounded-lg border-2 font-medium transition-all duration-200 ${
                        selectedAmount === amount && !customAmount
                          ? 'border-primary-600 bg-primary-50 text-primary-600'
                          : 'border-gray-300 text-gray-700 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(0);
                    }}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>


              {/* Donation Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Donation Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Donation Amount:</span>
                    <span className="font-medium">${getAmount()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">One-time Donation</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-900 font-semibold">Total:</span>
                      <span className="text-gray-900 font-semibold">${getAmount()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Donor Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Donor Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
              </div>

                             {/* Donate Button */}
               {stripeLoaded && stripePromise ? (
                 <Elements stripe={stripePromise}>
                   <StripeDonationForm 
                     amount={getAmount()} 
                     donorEmail={donorEmail}
                     donorName={donorName}
                     logoUrl={logoUrl}
                   />
                 </Elements>
               ) : stripeError ? (
                 <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                   <div className="flex items-center">
                     <div className="flex-shrink-0">
                       <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                         <span className="text-white text-xs font-bold">!</span>
                       </div>
                     </div>
                     <div className="ml-3">
                       <p className="text-sm text-red-800">{stripeError}</p>
                     </div>
                   </div>
                 </div>
               ) : (
                 <div className="flex items-center justify-center py-8">
                   <div className="text-center">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                     <p className="text-gray-600">Loading payment system...</p>
                   </div>
                 </div>
               )}

              {/* Security Notice */}
              <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                <Shield className="w-4 h-4 mr-2" />
                Secure payment processed by Stripe
              </div>
            </div>

            {/* Donation Tiers */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Donation Impact
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                See how your donation helps our community and unlocks exclusive benefits.
              </p>

              <div className="space-y-6">
                {donationTiers.map((tier, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-6 transition-all duration-200 ${
                      getAmount() >= tier.amount
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {tier.name}
                        </h3>
                        <p className="text-2xl font-bold text-primary-600">
                          ${tier.amount}
                        </p>
                      </div>
                      {getAmount() >= tier.amount && (
                        <CheckCircle className="w-6 h-6 text-primary-600" />
                      )}
                    </div>
                    <ul className="space-y-2">
                      {tier.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center text-gray-600">
                          <Star className="w-4 h-4 text-primary-500 mr-2" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Your Donation Helps */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Your Donation Helps
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your generous support enables us to create meaningful programs and events 
              that bring communities together through music.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Music Education
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Provide free and low-cost music education programs for youth and adults 
                in underserved communities.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Community Events
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Host inclusive community events, workshops, and performances that bring 
                people together across cultural boundaries.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Cultural Programs
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Support cultural preservation and celebration through music, dance, 
                and artistic expression programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Other Ways to Support */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Other Ways to Support
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Financial donations aren't the only way to support our mission. 
            There are many ways to get involved and make a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/get-involved"
              className="btn-primary text-lg px-8 py-4"
            >
              <Users className="w-5 h-5 mr-2" />
              Volunteer
            </a>
            <a
              href="/events"
              className="btn-outline text-lg px-8 py-4"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Attend Events
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default DonationPage; 