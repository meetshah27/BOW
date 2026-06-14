import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, Shield, Users, Music, Star, Smartphone, CreditCard, Loader, User, Mail, Award, Check } from 'lucide-react';
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
    
    async function updateWallets() {
      // Re-initialize for new amount
    }
    updateWallets();
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
            <Smartphone className="w-4 h-4 text-orange-500" />
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
            <span className="relative px-4 text-[10px] font-black text-gray-400 uppercase bg-white">Or use your card</span>
          </div>
        </div>
      )}

      {/* Card Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-primary-600 animate-pulse" />
            <span className="text-sm font-bold text-gray-700">Card Details</span>
          </div>
          <div className="p-4 border border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent transition-all duration-300">
            <div id={containerId} className="min-h-[40px]" />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !ready}
          className="w-full bg-gradient-to-r from-primary-600 via-orange-500 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-orange-100 hover:shadow-2xl transition-all duration-300 transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          <span className="absolute inset-0 w-full h-full bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
          {loading ? <Loader className="w-6 h-6 animate-spin" /> : <Heart className="w-6 h-6 animate-bounce" />}
          <span className="relative z-10">{loading ? 'Processing...' : `Donate $${amount}`}</span>
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

  const presetAmounts = [
    { value: 25, label: 'Friend', impact: 'Supports local cultural programs & updates.' },
    { value: 50, label: 'Supporter', impact: 'Provides music classes & training supplies.' },
    { value: 100, label: 'Advocate', impact: 'Sponsors community music workshop events.' },
    { value: 250, label: 'Champion', impact: 'Empowers seasonal cultural community festivals.' },
    { value: 500, label: 'Patron', impact: 'Creates permanent youth music education impact.' }
  ];

  const donationTiers = [
    {
      name: "Community Supporter",
      amount: 25,
      benefits: [
        "Event updates and notifications",
        "Recognition on our website contributors list",
        "Personalized thank you email from the team"
      ]
    },
    {
      name: "Music Advocate",
      amount: 50,
      benefits: [
        "All Community Supporter benefits",
        "Early access to seasonal event tickets",
        "Exclusive behind-the-scenes content & videos",
        "VIP invitations to our donor networking circles"
      ]
    },
    {
      name: "Cultural Champion",
      amount: 100,
      benefits: [
        "All Music Advocate benefits",
        "Invitation to annual donor appreciation dinners",
        "Personal call of thanks from our founders",
        "Reserved seating at community event stages"
      ]
    },
    {
      name: "Community Leader",
      amount: 250,
      benefits: [
        "All Cultural Champion benefits",
        "Corporate/Personal logo placing at events",
        "Annual detailed community impact report",
        "Complimentary VIP passes to all festivals"
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
        title={<><span>Support Our</span><br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400">Mission & Vision</span></>}
        description="Your generous donation helps us build inclusive community spaces, support music education, and bring neighborhoods together through the transcendent power of rhythm."
        logoUrl={logoUrl}
        showLogo={true}
        className="bg-gradient-to-br from-slate-900 via-purple-950 to-orange-950"
        floatingElements={[
          { icon: Heart, position: 'top-12 left-16', animation: 'animate-spin-slow text-red-500/20' },
          { icon: Music, position: 'top-24 right-24', animation: 'animate-pulse text-yellow-500/20' },
          { icon: Users, position: 'bottom-20 left-1/4', animation: 'animate-bounce text-blue-500/20' },
          { icon: Star, position: 'bottom-12 right-16', animation: 'animate-pulse text-yellow-500/20' }
        ]}
      />

      <section className="py-24 bg-gradient-to-b from-gray-50 via-slate-50 to-white relative overflow-hidden">
        {/* Background visual accents */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl -z-10"></div>

        <div className="container-custom px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Donation Form Wrapper (Glassmorphism card) */}
            <div className="lg:col-span-7 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 sm:p-12 border border-white/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-orange-500/10 rounded-full blur-2xl"></div>
              
              <div className="flex items-center gap-5 mb-10 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100 overflow-hidden flex-shrink-0">
                  {logoUrl ? <img src={logoUrl} alt="BOW" className="w-full h-full object-cover" /> : <Heart className="w-8 h-8 text-white" />}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Make a Difference</h2>
                  <p className="text-gray-500 text-sm">Empower our community through music</p>
                </div>
              </div>

              {/* Amount Selection Block */}
              <div className="mb-10 relative z-10">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Select Donation Amount</label>
                
                {/* Preset cards grid */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => { setSelectedAmount(preset.value); setCustomAmount(''); }}
                      className={`p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between items-center text-center ${
                        selectedAmount === preset.value && !customAmount
                          ? 'border-primary-600 bg-gradient-to-br from-primary-600 to-orange-600 text-white shadow-xl shadow-orange-200 scale-[1.03]'
                          : 'border-gray-100 bg-gray-50/50 hover:bg-gray-50 text-gray-600 hover:border-primary-200'
                      }`}
                    >
                      <span className="text-lg font-black">${preset.value}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${
                        selectedAmount === preset.value && !customAmount ? 'text-orange-200' : 'text-gray-400'
                      }`}>
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Show impact snippet dynamically based on selected preset */}
                {selectedAmount > 0 && !customAmount && (
                  <div className="bg-primary-50/50 border border-primary-100/50 rounded-2xl px-5 py-3 text-xs text-primary-800 font-semibold mb-4 transition-all duration-300 animate-fade-in flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span>Impact: {presetAmounts.find(p => p.value === selectedAmount)?.impact}</span>
                  </div>
                )}

                {/* Custom Amount Box */}
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within:text-primary-600 transition-colors">$</div>
                  <input
                    type="number"
                    placeholder="Enter Other Amount"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(0); }}
                    className="w-full pl-10 pr-5 py-4 bg-gray-50/50 hover:bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary-500 focus:bg-white focus:ring-0 font-bold transition-all duration-300 text-gray-800"
                  />
                </div>
              </div>

              {/* Donor Info block */}
              <div className="space-y-6 mb-10 relative z-10">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest -mb-2 ml-1">Your Information</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full pl-12 pr-5 py-4 bg-gray-50/50 hover:bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary-500 focus:bg-white focus:ring-0 transition-all duration-300 text-gray-800"
                        placeholder="Your Full Name"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        className="w-full pl-12 pr-5 py-4 bg-gray-50/50 hover:bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary-500 focus:bg-white focus:ring-0 transition-all duration-300 text-gray-800"
                        placeholder="Your Email Address"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Square Payment Form Component */}
              <div className="relative z-10">
                <SquareDonationForm amount={getAmount()} donorEmail={donorEmail} donorName={donorName} logoUrl={logoUrl} />
              </div>
            </div>

            {/* Impact Panel (Sophisticated dark dashboard card) */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Premium Impact Card */}
              <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-orange-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                  <span className="inline-block bg-white/10 backdrop-blur-md text-orange-400 text-[10px] font-bold px-4 py-2 rounded-full tracking-widest uppercase mb-6 border border-white/10">
                    Beats of Washington
                  </span>
                  <h2 className="text-3xl font-black mb-4 tracking-tight leading-tight">Your Direct Impact</h2>
                  <p className="text-gray-300 text-sm leading-relaxed mb-8">
                    Beats of Washington is a non-profit dedicated to cultural amplification. Every contribution directly funds program delivery, instrument storage, and public performances.
                  </p>
                  
                  {/* Glowing Counter Block */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 group hover:bg-white/10 transition-all duration-300">
                      <div className="text-3xl font-black mb-1 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">5k+</div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">People Impacted</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 group hover:bg-white/10 transition-all duration-300">
                      <div className="text-3xl font-black mb-1 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">100%</div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">Directly Invested</div>
                    </div>
                  </div>
                </div>
                
                <Heart className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
              </div>

              {/* Tiers List (Premium Membership cards) */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Donation Tiers & Benefits</h3>
                
                {donationTiers.map((tier, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-6 group hover:shadow-md hover:border-gray-200 transition-all duration-300 cursor-pointer"
                    onClick={() => { setSelectedAmount(tier.amount); setCustomAmount(''); }}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0 transition-all duration-300 ${
                      selectedAmount === tier.amount && !customAmount
                        ? 'bg-gradient-to-br from-primary-600 to-orange-600 text-white shadow-lg shadow-orange-100 scale-105'
                        : 'bg-slate-50 text-slate-700 group-hover:bg-primary-50 group-hover:text-primary-600'
                    }`}>
                      ${tier.amount}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{tier.name}</h4>
                        {selectedAmount === tier.amount && !customAmount && (
                          <span className="text-[9px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                        )}
                      </div>
                      
                      {/* Show benefits dropdown/subtext */}
                      <ul className="mt-2 space-y-1">
                        {tier.benefits.slice(0, 2).map((benefit, bIdx) => (
                          <li key={bIdx} className="text-xs text-gray-500 flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                            <span className="line-clamp-1">{benefit}</span>
                          </li>
                        ))}
                      </ul>
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