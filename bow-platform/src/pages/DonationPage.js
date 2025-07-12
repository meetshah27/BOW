import React, { useState } from 'react';
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
import {Elements, CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { useCelebration } from '../contexts/CelebrationContext';
import DonorTicker from '../components/common/DonorTicker';

// Live Stripe publishable key
const stripePromise = loadStripe('pk_live_YOUR_ACTUAL_LIVE_PUBLISHABLE_KEY');

function StripeDonationForm({amount, donorEmail, donorName, isMonthly}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { triggerConfetti } = useCelebration();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create payment intent
      const res = await fetch('http://localhost:3000/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          amount: Math.round(amount * 100), 
          currency: 'usd',
          donorEmail: donorEmail,
          donorName: donorName,
          isRecurring: isMonthly,
          frequency: isMonthly ? 'monthly' : 'one-time'
        }),
      });
      
      if (!res.ok) {
        throw new Error('Payment intent creation failed');
      }
      
      const {clientSecret, error} = await res.json();
      if (error) throw new Error(error);
      
      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {card: elements.getElement(CardElement)},
      });
      
      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        toast.success('Thank you for your donation!');
        triggerConfetti(); // Trigger confetti animation
        // Clear the form
        elements.getElement(CardElement).clear();
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
      <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
        <CardElement 
          options={{
            hidePostalCode: true,
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

  const impactStats = [
    {
      icon: Users,
      number: "50,000+",
      label: "Community Members Served"
    },
    {
      icon: Music,
      number: "200+",
      label: "Events Annually"
    },
    {
      icon: Award,
      number: "15",
      label: "Years of Service"
    },
    {
      icon: Heart,
      number: "5,000+",
      label: "Volunteers Coordinated"
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
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-20">
        <div className="container-custom text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Support Our Mission
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Your donation helps us create inclusive spaces, provide music education, 
            and bring communities together through the power of music.
          </p>
        </div>
      </section>

      {/* Donor Ticker */}
      <DonorTicker />

      {/* Impact Stats */}
      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Impact
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how your support makes a difference in our community
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-12 h-12 text-primary-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Donation Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Make a Donation
              </h2>

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