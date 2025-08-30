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

// Live Stripe publishable key
const stripePromise = loadStripe('pk_live_YOUR_ACTUAL_LIVE_PUBLISHABLE_KEY');

function StripeDonationForm({amount, donorEmail, donorName, isMonthly, logoUrl}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { triggerConfetti } = useCelebration();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create payment intent
      const res = await api.post('/payment/create-payment-intent', {
        amount: Math.round(amount * 100), 
        currency: 'usd',
        donorEmail: donorEmail,
        donorName: donorName,
        isRecurring: isMonthly,
        frequency: isMonthly ? 'monthly' : 'one-time'
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
      toast.error('Payment failed. Please try again.');
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
  const [isMonthly, setIsMonthly] = useState(false);
  const [donorEmail, setDonorEmail] = useState('');
  const [donorName, setDonorName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

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

  const presetAmounts = [25, 50, 100, 250, 500];

  const donationTiers = [
    {
      name: "Community Supporter",
      amount: 25,
      benefits: [
        "Event updates",
        "Recognition on our website"
      ]
    },
    {
      name: "Music Advocate",
      amount: 50,
      benefits: [
        "All Community Supporter benefits",
        "Early access to event tickets",
        "Exclusive behind-the-scenes content"
      ]
    },
    {
      name: "Cultural Champion",
      amount: 100,
      benefits: [
        "All Music Advocate benefits",
        "Invitation to donor appreciation events",
        "Personal thank you from our team"
      ]
    },
    {
      name: "Community Leader",
      amount: 250,
      benefits: [
        "All Cultural Champion benefits",
        "Naming opportunity at events",
        "Annual impact report"
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
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white overflow-hidden py-12">
        {/* Enhanced background with multiple layers */}
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating geometric shapes */}
          <div className="absolute top-12 left-16 w-20 h-20 border-2 border-white/10 rounded-full animate-spin-slow"></div>
          <div className="absolute top-24 right-24 w-16 h-16 border-2 border-white/10 rotate-45 animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-white/10 rounded-full animate-bounce"></div>
          <div className="absolute bottom-12 right-16 w-16 h-16 border-2 border-white/10 rotate-12 animate-pulse"></div>
          
          {/* Gradient orbs */}
          <div className="absolute top-1/3 left-1/3 w-24 h-24 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-3xl animate-float-slow-reverse"></div>
          
          {/* Shimmer lines */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-horizontal"></div>
          <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/30 to-transparent animate-shimmer-vertical"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Enhanced title with staggered animation */}
            <div className="mb-3 overflow-hidden">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight animate-slide-in-up text-glow-hero">
                <span className="inline-block animate-slide-in-left" style={{animationDelay: '0.2s'}}>Support Our</span>
                <br />
                <span className="inline-block animate-slide-in-right" style={{animationDelay: '0.4s'}}>Mission</span>
              </h1>
            </div>
            
            {/* Enhanced subtitle with typewriter effect */}
            <div className="mb-4 overflow-hidden">
              <p className="text-base md:text-lg text-gray-100 leading-relaxed animate-fade-in-up delay-800 text-glow-subtitle">
                Your donation helps us create inclusive spaces, provide{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-orange-300 font-semibold animate-text-shine">
                  music education
                </span>{' '}
                and bring communities together through the power of music.
              </p>
            </div>
            
            {/* Decorative CTA elements (non-clickable) */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-in-up delay-1000">
              <div className="group relative px-5 py-2.5 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg text-white font-semibold text-sm transition-all duration-500 overflow-hidden cursor-default">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative flex items-center">
                  <Heart className="w-3.5 h-3.5 mr-2 transition-transform duration-300" />
                  Give Back
                </span>
              </div>
              
              <div className="group relative px-5 py-2.5 bg-gradient-to-r from-red-500/80 to-orange-500/80 backdrop-blur-sm border-2 border-red-400/50 rounded-lg text-white font-semibold text-sm transition-all duration-500 overflow-hidden cursor-default">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative flex items-center">
                  <Music className="w-3.5 h-3.5 mr-2 transition-transform duration-300" />
                  Make Impact
                </span>
              </div>
            </div>
            
            {/* Decorative elements at bottom */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 animate-bounce">
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>





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

              {/* Monthly/One-time Toggle */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Donation Type
                </label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setIsMonthly(false)}
                    className={`btn-toggle ${
                      !isMonthly
                        ? 'btn-toggle-active'
                        : 'btn-toggle-inactive'
                    }`}
                  >
                    One-time
                  </button>
                  <button
                    onClick={() => setIsMonthly(true)}
                    className={`btn-toggle ${
                      isMonthly
                        ? 'btn-toggle-active'
                        : 'btn-toggle-inactive'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Donation Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Donation Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">${getAmount()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frequency:</span>
                    <span className="font-medium">{isMonthly ? 'Monthly' : 'One-time'}</span>
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
               <Elements stripe={stripePromise}>
                 <StripeDonationForm 
                   amount={getAmount()} 
                   donorEmail={donorEmail}
                   donorName={donorName}
                   isMonthly={isMonthly}
                   logoUrl={logoUrl}
                 />
               </Elements>

              {/* Security Notice */}
              <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                <Shield className="w-4 h-4 mr-2" />
                Secure payment processed by Stripe
              </div>
            </div>

            {/* Donation Tiers */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Donation Tiers
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Choose a donation tier and unlock exclusive benefits while supporting our mission.
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