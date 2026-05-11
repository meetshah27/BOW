import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Shield, CreditCard, Loader, X, ShoppingBag, User, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../config/api';

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

const SquareOrderForm = ({ amount, items, onSuccess, onCancel, user }) => {
  const [loading, setLoading] = useState(false);
  const [squareInitError, setSquareInitError] = useState(null);
  const [squareReady, setSquareReady] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  const [applePayAvailable, setApplePayAvailable] = useState(false);

  const cardRef = useRef(null);
  const applePayRef = useRef(null);
  const applePayBtnRef = useRef(null);
  const paymentsRef = useRef(null);
  
  const containerId = useMemo(
    () => `square-card-container-${Math.random().toString(36).slice(2)}`,
    []
  );

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setCustomerInfo(prev => ({
        ...prev,
        name: user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const submitPaidWithSourceId = useCallback(async (sourceId) => {
    const shippingAddress = `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} ${customerInfo.zip}`;
    
    try {
      const response = await api.post('/payment/create-order-payment', {
        sourceId,
        amount: Math.round(amount * 100),
        currency: 'USD',
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: user?.phone || '',
        shippingAddress,
        userId: user?.uid || user?.id || null,
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity }))
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Payment failed');
      onSuccess(data);
    } catch (err) {
      throw err;
    }
  }, [amount, customerInfo, items, user, onSuccess]);

  useEffect(() => {
    if (amount === 0) {
      setSquareReady(true);
      return;
    }

    let cancelled = false;

    async function initSquare() {
      try {
        setSquareInitError(null);
        setSquareReady(false);

        const cfgRes = await api.get('/square-config');
        const cfg = cfgRes.ok ? await cfgRes.json() : null;
        if (!cfgRes.ok || !cfg?.applicationId || !cfg?.locationId) {
          throw new Error(cfg?.error || 'Square configuration not available');
        }

        await loadSquareScript(cfg.environment);
        if (cancelled) return;

        const payments = window.Square.payments(cfg.applicationId, cfg.locationId);
        paymentsRef.current = payments;
        const card = await payments.card();
        cardRef.current = card;
        
        // Use the exact same technique as Tickets (no timeout, just await)
        await card.attach(`#${containerId}`);
        if (cancelled) return;

        // Best effort Apple Pay
        try {
          const paymentRequest = payments.paymentRequest({
            countryCode: 'US',
            currencyCode: 'USD',
            total: { amount: amount.toFixed(2), label: 'Shop Purchase' },
          });
          const ap = await payments.applePay(paymentRequest);
          applePayRef.current = ap;
          setApplePayAvailable(true);
        } catch (e) {
          console.log('Apple Pay unavailable');
        }

        setSquareReady(true);
      } catch (e) {
        console.error('Square init error:', e);
        if (!cancelled) setSquareInitError(e.message || 'Failed to initialize Square');
      }
    }

    initSquare();

    return () => {
      cancelled = true;
      try { applePayRef.current?.destroy?.(); } catch (e) {}
      try { cardRef.current?.destroy?.(); } catch (e) {}
      cardRef.current = null;
      applePayRef.current = null;
      paymentsRef.current = null;
    };
  }, [containerId, amount]);

  // Apple Pay listener
  useEffect(() => {
    const btn = applePayBtnRef.current;
    if (!btn || !applePayAvailable) return;

    const onApplePayClick = async (e) => {
      e.preventDefault();
      const ap = applePayRef.current;
      if (!ap) return;

      if (!customerInfo.name || !customerInfo.email || !customerInfo.address) {
        toast.error('Please enter shipping details first.');
        return;
      }

      setLoading(true);
      try {
        const result = await ap.tokenize();
        if (result.status !== 'OK') {
          throw new Error(result.errors?.[0]?.message || 'Apple Pay failed');
        }
        await submitPaidWithSourceId(result.token);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    btn.addEventListener('click', onApplePayClick);
    return () => btn.removeEventListener('click', onApplePayClick);
  }, [applePayAvailable, customerInfo, submitPaidWithSourceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!squareReady || loading) return;

    if (!customerInfo.name || !customerInfo.email || !customerInfo.address) {
      toast.error('Please complete all shipping fields.');
      return;
    }

    setLoading(true);
    try {
      if (amount === 0) {
        // Free order bypass
        await submitPaidWithSourceId('FREE_ORDER');
        return;
      }

      if (!cardRef.current) throw new Error('Payment system not ready');
      
      const result = await cardRef.current.tokenize();
      if (result.status !== 'OK') {
        throw new Error(result.errors?.[0]?.message || 'Payment failed');
      }
      await submitPaidWithSourceId(result.token);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Checkout</h3>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3 font-bold text-gray-900">
            <ShoppingBag className="w-4 h-4" /> Order Summary
          </div>
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name} × {item.quantity}</span>
                <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Form */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <User className="w-4 h-4" /> Contact & Shipping
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input 
              placeholder="Full Name" 
              name="name" 
              value={customerInfo.name} 
              onChange={handleInputChange} 
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" 
            />
            <input 
              placeholder="Email" 
              name="email" 
              value={customerInfo.email} 
              onChange={handleInputChange} 
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" 
            />
          </div>
          <input 
            placeholder="Street Address" 
            name="address" 
            value={customerInfo.address} 
            onChange={handleInputChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" 
          />
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="City" name="city" value={customerInfo.city} onChange={handleInputChange} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input placeholder="State" name="state" value={customerInfo.state} onChange={handleInputChange} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input placeholder="Zip" name="zip" value={customerInfo.zip} onChange={handleInputChange} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
        </div>

        <div className="space-y-4 border-t pt-4">
          {amount > 0 && (
            <>
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <CreditCard className="w-4 h-4" /> Payment Details
              </div>
              
              {squareInitError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs">{squareInitError}</div>
              )}

              <div className="space-y-3">
                <label className="block text-xs text-gray-500">Card details</label>
                <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[50px] flex flex-col justify-center">
                  <div id={containerId} />
                </div>
                {!squareReady && !squareInitError && (
                  <p className="text-xs text-gray-400">Loading payment system...</p>
                )}
              </div>

              {applePayAvailable && (
                <div className="pt-2">
                  <button type="button" ref={applePayBtnRef} className="bow-apple-pay-button" />
                  <div className="relative flex items-center justify-center my-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                    <span className="relative px-2 text-[10px] font-bold text-gray-300 uppercase bg-white">or pay with card</span>
                  </div>
                </div>
              )}
            </>
          )}

          {amount === 0 && (
            <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-sm font-bold text-green-800">Free Order</p>
                <p className="text-xs text-green-600">No payment required for this order.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <button
          onClick={handleSubmit}
          disabled={loading || !squareReady}
          className={`w-full py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all ${
            amount === 0 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          {loading ? <Loader className="w-5 h-5 animate-spin" /> : (amount === 0 ? <CheckCircle className="w-5 h-5" /> : <Shield className="w-5 h-5" />)}
          {loading ? 'Processing...' : (amount === 0 ? 'Place Free Order' : `Pay $${amount.toFixed(2)}`)}
        </button>
        <div className="flex items-center justify-center gap-1 mt-3 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
          <CheckCircle className="w-3 h-3 text-green-500" /> {amount === 0 ? 'Direct Order Processing' : 'Secure Square Encryption'}
        </div>
      </div>
    </div>
  );
};

export default SquareOrderForm;
