import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, Shield, Users, Music, Star, Smartphone, CreditCard, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCelebration } from '../contexts/CelebrationContext';

import api from '../config/api';
import HeroSection from '../components/common/HeroSection';

const SQUARE_SCRIPTS = {
  sandbox: 'https://sandbox.web.squarecdn.com/v1/square.js',
  production: 'https://web.squarecdn.com/v1/square.js',
};

function loadSquareScript(environment) {
  const env = environment === 'production' ? 'production' : 'sandbox';
  const src = SQUARE_SCRIPTS[env];

  return new Promise((resolve, reject) => {
    if (window.Square) return resolve();

    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Square script')));
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => reject(new Error('Failed to load Square script')));
    document.head.appendChild(script);
  });
}

function SquareDonationForm({ amount, donorEmail, donorName, logoUrl }) {
  const { triggerConfetti } = useCelebration();
  const [loading, setLoading] = useState(false);
  const [initError, setInitError] = useState(null);
  const [ready, setReady] = useState(false);
  const [applePayAvailable, setApplePayAvailable] = useState(false);
  const [googlePayAvailable, setGooglePayAvailable] = useState(false);

  const cardRef = useRef(null);
  const paymentsRef = useRef(null);
  const applePayRef = useRef(null);
  const googlePayRef = useRef(null);
  const applePayBtnRef = useRef(null);
  const containerId = useMemo(() => `square-card-container-${Math.random().toString(36).slice(2)}`, []);
  const googlePayId = useMemo(() => `sq-google-pay-${Math.random().toString(36).slice(2)}`, []);

  const runDonationPayment = useCallback(
    async (sourceId) => {
      const amountNumber = Number(amount);
      const amountCents = Math.round(amountNumber * 100);
      const payRes = await api.post('/payment/create-payment', {
        sourceId,
        amount: amountCents,
        currency: 'USD',
        donorEmail,
        donorName,
      });
      const payData = await payRes.json().catch(() => ({}));
      if (!payRes.ok) {
        throw new Error(payData.error || 'Payment failed. Please try again.');
      }
      toast.success(
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="BOW Logo" className="w-full h-full object-cover" />
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
      triggerConfetti();
    },
    [amount, donorEmail, donorName, logoUrl, triggerConfetti]
  );

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setInitError(null);
        setReady(false);
        paymentsRef.current = null;

        const cfgRes = await api.get('/square-config');
        const cfg = cfgRes.ok ? await cfgRes.json() : null;
        if (!cfgRes.ok || !cfg?.applicationId || !cfg?.locationId) {
          throw new Error(cfg?.error || 'Square configuration not available');
        }

        await loadSquareScript(cfg.environment);
        if (cancelled) return;

        const payments = window.Square.payments(cfg.applicationId, cfg.locationId);
        paymentsRef.current = payments;
        
        // Card initialization
        const card = await payments.card();
        cardRef.current = card;
        await card.attach(`#${containerId}`);
        
        // Digital Wallets Initialization
        try {
          const paymentRequest = payments.paymentRequest({
            countryCode: 'US',
            currencyCode: 'USD',
            total: { amount: Number(amount).toFixed(2), label: 'Donation' },
          });

          // Google Pay
          try {
            const gp = await payments.googlePay(paymentRequest);
            googlePayRef.current = gp;
            await gp.attach(`#${googlePayId}`);
            setGooglePayAvailable(true);
          } catch (e) {
            console.debug('Google Pay unavailable');
          }

          // Apple Pay
          try {
            const ap = await payments.applePay(paymentRequest);
            applePayRef.current = ap;
            setApplePayAvailable(true);
          } catch (e) {
            console.debug('Apple Pay unavailable');
          }
        } catch (pwErr) {
          console.debug('Wallet initialization failed');
        }

        if (cancelled) return;
        setReady(true);
      } catch (e) {
        console.error('Square init error:', e);
        setInitError(e.message || 'Failed to initialize Square');
      }
    }

    init();

    return () => {
      cancelled = true;
      cardRef.current?.destroy?.();
      applePayRef.current?.destroy?.();
      googlePayRef.current?.destroy?.();
    };
  }, [containerId, googlePayId, amount]);

  // Handle Google Pay initialization update when amount changes
  useEffect(() => {
    if (!ready || !paymentsRef.current) return;
    
    let cancelled = false;
    async function updateWallets() {
      // Re-initialize for new amount
      // (Square usually handles this but sometimes needs a refresh)
    }
    updateWallets();
    return () => { cancelled = true; };
  }, [ready, amount]);

  useEffect(() => {
    const btn = applePayBtnRef.current;
    if (!btn || !applePayAvailable) return;

    const onApplePayClick = async (e) => {
      e.preventDefault();
      const ap = applePayRef.current;
      if (!ap) return;
      if (!donorName?.trim() || !donorEmail?.trim()) {
        toast.error('Please enter your name and email.');
        return;
      }
      const amountNumber = Number(amount);
      if (!amountNumber || amountNumber < 0.5) {
        toast.error('Min donation is $0.50.');
        return;
      }
      
      setLoading(true);
      try {
        const result = await ap.tokenize();
        if (result.status !== 'OK') throw new Error(result.errors[0].message);
        await runDonationPayment(result.token);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    btn.addEventListener('click', onApplePayClick);
    return () => btn.removeEventListener('click', onApplePayClick);
  }, [applePayAvailable, amount, donorName, donorEmail, runDonationPayment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!donorName || !donorEmail) {
      toast.error('Name and Email are required');
      return;
    }
    if (Number(amount) < 0.5) {
      toast.error('Min donation is $0.50');
      return;
    }
    if (!ready || !cardRef.current) {
      toast.error('Payment system loading...');
      return;
    }

    setLoading(true);
    try {
      const result = await cardRef.current.tokenize();
      if (result.status !== 'OK') throw new Error(result.errors[0].message);
      await runDonationPayment(result.token);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 mt-8">
      {initError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-800">
          {initError}
        </div>
      )}

      {/* Quick Pay Wallets */}
      {(googlePayAvailable || applePayAvailable) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Smartphone className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Express Checkout</span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {googlePayAvailable && <div id={googlePayId} className="min-h-[48px]" />}
            {applePayAvailable && (
              <button
                type="button"
                ref={applePayBtnRef}
                className="bow-apple-pay-button min-h-[48px]"
                disabled={loading}
              />
            )}
          </div>
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <span className="relative px-4 text-[10px] font-black text-gray-300 uppercase bg-white">Or use your card</span>
          </div>
        </div>
      )}

      {/* Card Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-bold text-gray-700">Card Details</span>
          </div>
          <div className="p-4 border border-gray-200 rounded-2xl bg-gray-50 focus-within:ring-2 focus-within:ring-primary-500 transition-all">
            <div id={containerId} className="min-h-[40px]" />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !ready}
          className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary-100 hover:shadow-2xl hover:bg-primary-700 transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? <Loader className="w-6 h-6 animate-spin" /> : <Heart className="w-6 h-6" />}
          {loading ? 'Processing...' : `Donate $${amount}`}
        </button>
      </form>
      
      <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
        <Shield className="w-3 h-3 text-green-500" /> Secure Encryption by Square
      </div>
    </div>
  );
}

const DonationPage = () => {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorName, setDonorName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Fetch logo
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
    return Number(customAmount || selectedAmount || 0);
  };

  return (
    <>
      <Helmet>
        <title>Donate - Beats of Washington</title>
        <meta name="description" content="Support Beats of Washington's mission to empower communities through music." />
      </Helmet>

      <HeroSection
        title={<><span>Support Our</span><br /><span>Mission</span></>}
        description="Your donation helps us create inclusive spaces, provide music education and bring communities together through the power of music."
        logoUrl={logoUrl}
        showLogo={true}
        floatingElements={[
          { icon: Heart, position: 'top-12 left-16', animation: 'animate-spin-slow' },
          { icon: Music, position: 'top-24 right-24', animation: 'animate-pulse' },
          { icon: Users, position: 'bottom-20 left-1/4', animation: 'animate-bounce' },
          { icon: Star, position: 'bottom-12 right-16', animation: 'animate-pulse' }
        ]}
      />

      <section className="py-20 bg-gray-50">
        <div className="container-custom px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Donation Form */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 sm:p-10 border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {logoUrl ? <img src={logoUrl} alt="BOW" className="w-full h-full object-cover" /> : <Heart className="w-8 h-8 text-primary-600" />}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Make a Donation</h2>
                  <p className="text-gray-500">Every contribution matters</p>
                </div>
              </div>

              {/* Amount Selection */}
              <div className="mb-10">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Select Amount</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                      className={`py-4 rounded-2xl border-2 font-bold transition-all duration-300 ${
                        selectedAmount === amount && !customAmount
                          ? 'border-primary-600 bg-primary-600 text-white shadow-lg shadow-primary-100 scale-105'
                          : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-primary-200'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</div>
                  <input
                    type="number"
                    placeholder="Other Amount"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(0); }}
                    className="w-full pl-10 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
                  />
                </div>
              </div>

              {/* Donor Info */}
              <div className="space-y-6 mb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>

              <SquareDonationForm amount={getAmount()} donorEmail={donorEmail} donorName={donorName} logoUrl={logoUrl} />
            </div>

            {/* Impact Content */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-primary-600 to-orange-500 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-3xl font-black mb-4">Your Impact</h2>
                  <p className="text-white/80 text-lg leading-relaxed mb-8">
                    Your generous support enables us to create meaningful programs and events 
                    that bring communities together through music.
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                      <div className="text-3xl font-black mb-1">5k+</div>
                      <div className="text-xs font-bold uppercase tracking-wider text-white/60">Lives Impacted</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                      <div className="text-3xl font-black mb-1">100+</div>
                      <div className="text-xs font-bold uppercase tracking-wider text-white/60">Annual Events</div>
                    </div>
                  </div>
                </div>
                <Heart className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {donationTiers.map((tier, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-2xl text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all">
                      ${tier.amount}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{tier.name}</h4>
                      <p className="text-sm text-gray-500">{tier.benefits[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DonationPage;