import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import toast from 'react-hot-toast';
import api from '../config/api';

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

// Square-enabled registration form component
const SquareRegistrationForm = ({ event, currentUser, registrationData, setRegistrationData, onRegister, isRegistering, onClose, selectedAddons, eventAddons }) => {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [squareReady, setSquareReady] = useState(false);
  const [squareInitError, setSquareInitError] = useState(null);
  const [totalAmountCents, setTotalAmountCents] = useState(0);

  const cardRef = useRef(null);
  const containerId = useMemo(
    () => `square-card-container-${Math.random().toString(36).slice(2)}`,
    []
  );

  /* Stripe payment intent + wallet flow removed (migrated to Square)
  useEffect(() => {
    // Create payment intent for paid events OR if there are paid addons
    if (event && (isPaidEvent(event.price) || hasPaidAddons(selectedAddons, eventAddons))) {
      createPaymentIntent();
    }
  }, [event, selectedAddons, eventAddons]);

  const createPaymentIntent = async () => {
    try {
      const unitPrice = parseEventPrice(event.price) * 100; // Convert to cents
      let totalAmount = unitPrice * registrationData.quantity; // Multiply by quantity
      
      // Add addon prices (excluding free items)
      const addonsArray = [];
      if (selectedAddons && eventAddons) {
        Object.keys(selectedAddons).forEach(addonId => {
          const quantity = selectedAddons[addonId];
          if (quantity > 0) {
            const addon = eventAddons.find(a => a.id === addonId);
            if (addon && !addon.isFreeWithTicket) {
              totalAmount += (addon.price * 100 * quantity); // Convert to cents
              addonsArray.push({ addonId, quantity });
            } else if (addon && addon.isFreeWithTicket) {
              // Include free addons in array for tracking
              addonsArray.push({ addonId, quantity });
            }
          }
        });
      }
      
      // If total amount is 0, don't create payment intent
      if (totalAmount === 0) {
        console.log('[Payment] Total amount is 0, skipping payment intent creation');
        setClientSecret('');
        return;
      }
      
      // Track total for Payment Request button
      setTotalAmountCents(Math.round(totalAmount));
      
      const response = await api.post(`/events/${event.id}/create-payment-intent`, {
        amount: totalAmount,
        quantity: registrationData.quantity,
        userEmail: currentUser?.email || registrationData.email,
        userName: currentUser?.displayName || registrationData.name,
        userId: currentUser?.uid || currentUser?.id || `anon_${Date.now()}`,
        addons: addonsArray
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

  // Initialize Payment Request (Apple Pay / Google Pay) when Stripe and client secret are ready
  useEffect(() => {
    const initPaymentRequest = async () => {
      if (!stripe || !clientSecret || totalAmountCents <= 0) return;

      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: event?.title || 'Event Registration',
          amount: totalAmountCents
        },
        requestPayerName: true,
        requestPayerEmail: true
      });

      const result = await pr.canMakePayment();
      if (result) {
        setPaymentRequest(pr);
        setCanUsePaymentRequest(true);

        pr.on('paymentmethod', async (ev) => {
          try {
            setPaymentLoading(true);

            // Use the payment method from the wallet to confirm the intent
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
              payment_method: ev.paymentMethod.id,
              payment_method_options: {
                card: {
                  request_three_d_secure: 'automatic'
                }
              },
              receipt_email: currentUser?.email || registrationData.email
            });

            if (error) {
              ev.complete('fail');
              toast.error(error.message || 'Payment failed. Please try again.');
              setPaymentLoading(false);
              return;
            }

            ev.complete('success');

            if (paymentIntent.status === 'succeeded') {
              await onRegister(paymentIntent.id);
              toast.success('Payment successful! Registration confirmation will be sent via email.');
            }
          } catch (err) {
            console.error('Payment Request error:', err);
            ev.complete('fail');
            toast.error('Payment failed. Please try again.');
          } finally {
            setPaymentLoading(false);
          }
        });
      } else {
        setCanUsePaymentRequest(false);
        setPaymentRequest(null);
      }
    };

    initPaymentRequest();
  }, [stripe, clientSecret, totalAmountCents, event, currentUser, registrationData]);
  */

  const isPaidEventValue = isPaidEvent(event.price);
  const hasPaidAddonsValue = hasPaidAddons(selectedAddons, eventAddons);
  const requiresPayment = isPaidEventValue || hasPaidAddonsValue;

  const calculateTotals = () => {
    const unitPriceCents = parseEventPrice(event.price) * 100;
    let totalAmount = unitPriceCents * (registrationData.quantity || 1);

    const addonsArray = [];
    if (selectedAddons && eventAddons) {
      Object.keys(selectedAddons).forEach((addonId) => {
        const quantity = selectedAddons[addonId];
        if (quantity > 0) {
          const addon = eventAddons.find((a) => a.id === addonId);
          if (addon && !addon.isFreeWithTicket) {
            totalAmount += addon.price * 100 * quantity;
            addonsArray.push({ addonId, quantity });
          } else if (addon && addon.isFreeWithTicket) {
            addonsArray.push({ addonId, quantity });
          }
        }
      });
    }

    return { totalAmountCents: Math.round(totalAmount), addonsArray };
  };

  useEffect(() => {
    if (!event) return;
    if (!requiresPayment) {
      setTotalAmountCents(0);
      return;
    }
    const { totalAmountCents: total } = calculateTotals();
    setTotalAmountCents(total);
  }, [event, requiresPayment, registrationData.quantity, selectedAddons, eventAddons]);

  useEffect(() => {
    let cancelled = false;

    async function initSquare() {
      if (!requiresPayment) {
        setSquareReady(false);
        setSquareInitError(null);
        return;
      }

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
        const card = await payments.card();
        cardRef.current = card;
        await card.attach(`#${containerId}`);
        if (cancelled) return;

        setSquareReady(true);
      } catch (e) {
        console.error('Square init error:', e);
        setSquareInitError(e.message || 'Failed to initialize Square');
      }
    }

    initSquare();

    return () => {
      cancelled = true;
      try {
        cardRef.current?.destroy?.();
      } catch (e) {
        // ignore
      }
      cardRef.current = null;
    };
  }, [requiresPayment, containerId]);

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

    // Check if payment is required (paid event OR paid addons)
    const requiresPayment = isPaidEvent(event.price) || hasPaidAddons(selectedAddons, eventAddons);
    
    if (requiresPayment) {
      // Handle paid registration with Stripe (for paid events or paid addons)
      await handlePaidRegistration();
    } else {
      // Handle free event registration (no paid items)
      await handleFreeRegistration();
    }
  };

  const handlePaidRegistration = async () => {
    if (!squareReady || !cardRef.current) {
      toast.error('Payment system is loading. Please wait a moment and try again.');
      return;
    }

    setPaymentLoading(true);

    try {
      const { totalAmountCents: totalAmount, addonsArray } = calculateTotals();
      if (!totalAmount || totalAmount <= 0) {
        toast.error('Invalid payment amount. Please try again.');
        return;
      }

      const tokenizeResult = await cardRef.current.tokenize();
      if (tokenizeResult.status !== 'OK') {
        const message =
          tokenizeResult.errors?.[0]?.message ||
          'Card information is invalid. Please check and try again.';
        throw new Error(message);
      }

      const response = await api.post(`/events/${event.id}/create-payment`, {
        sourceId: tokenizeResult.token,
        amount: totalAmount,
        quantity: registrationData.quantity,
        userEmail: currentUser?.email || registrationData.email,
        userName: currentUser?.displayName || registrationData.name,
        userId: currentUser?.uid || currentUser?.id || `anon_${Date.now()}`,
        addons: addonsArray,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Payment failed. Please try again.');
      }

      if (data.paymentId) {
        await onRegister(data.paymentId);
        toast.success('Payment successful! Registration confirmation will be sent via email.');
      } else {
        throw new Error('Payment succeeded but no paymentId was returned.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleFreeRegistration = async () => {
    await onRegister();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 animate-in my-4">
        <div className="p-4 sm:p-5 md:p-6">
          <div className="flex justify-between items-start mb-4 sm:mb-5 md:mb-6">
            <div className="flex items-center min-w-0 flex-1 mr-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">Register for Event</h3>
                <p className="text-xs sm:text-sm text-gray-600 break-words truncate">{event.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
              aria-label="Close registration modal"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

           {requiresPayment && (
             <div className="mb-4 sm:mb-5 md:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
               <div className="flex items-center mb-1.5 sm:mb-2">
                 <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-1.5 sm:mr-2 flex-shrink-0" />
                 <span className="text-sm sm:text-base font-semibold text-blue-900 break-words">Payment Required</span>
               </div>
               <p className="text-xs sm:text-sm text-blue-700 break-words">
                 {isPaidEventValue && hasPaidAddonsValue 
                   ? `Event ticket ($${parseEventPrice(event.price).toFixed(2)} per person) + selected items require payment`
                   : isPaidEventValue
                   ? `This event requires a payment of $${parseEventPrice(event.price).toFixed(2)} per person`
                   : 'Selected items require payment'}
               </p>
             </div>
           )}

           {/* Quantity Selector for Paid Events or when addons are selected */}
           {(isPaidEventValue || hasPaidAddonsValue) && (
             <div className="mb-4 sm:mb-5 md:mb-6 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
               <div className="flex items-center mb-2 sm:mb-3">
                 <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-1.5 sm:mr-2 flex-shrink-0" />
                 <span className="text-sm sm:text-base font-semibold text-green-900 break-words">Number of Attendees</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                 <label className="text-xs sm:text-sm text-gray-700 flex-shrink-0">Quantity:</label>
                 <select
                   value={registrationData.quantity}
                   onChange={(e) => setRegistrationData({...registrationData, quantity: parseInt(e.target.value)})}
                   className="px-2.5 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                 >
                   <option value={1}>1 person</option>
                   <option value={2}>2 people</option>
                   <option value={3}>3 people</option>
                   <option value={4}>4 people</option>
                   <option value={5}>5 people</option>
                   <option value={6}>6 people</option>
                   <option value={7}>7 people</option>
                   <option value={8}>8 people</option>
                   <option value={9}>9 people</option>
                   <option value={10}>10 people</option>
                 </select>
               </div>
                 <div className="mt-2 sm:mt-3 p-3 sm:p-4 bg-white rounded-lg border-2 border-green-200">
                   <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Order Summary</div>
                   
                   {/* Ticket Price */}
                   <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200">
                     <div>
                       <span className="text-xs sm:text-sm text-gray-700">Event Ticket</span>
                       <div className="text-xs text-gray-500">
                         ${typeof event.price === 'number' ? event.price.toFixed(2) : (parseEventPrice(event.price).toFixed(2))} × {registrationData.quantity} {registrationData.quantity === 1 ? 'person' : 'people'}
                       </div>
                     </div>
                     <span className="text-sm sm:text-base font-semibold text-gray-900">
                       ${(parseEventPrice(event.price) * registrationData.quantity).toFixed(2)}
                     </span>
                   </div>

                   {/* Selected Addons */}
                   {selectedAddons && eventAddons && Object.keys(selectedAddons).some(id => selectedAddons[id] > 0) && (
                     <div className="mb-2 pb-2 border-b border-gray-200">
                       <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Additional Items:</div>
                       {Object.keys(selectedAddons).map(addonId => {
                         const quantity = selectedAddons[addonId];
                         if (quantity === 0) return null;
                         const addon = eventAddons.find(a => a.id === addonId);
                         if (!addon) return null;
                         
                         // Show free items with a note
                         if (addon.isFreeWithTicket) {
                           return (
                             <div key={addonId} className="flex justify-between items-center mb-1 text-xs text-gray-600">
                               <div>
                                 <span>{addon.name} × {quantity}</span>
                                 <span className="ml-2 text-green-600 font-semibold">(FREE)</span>
                               </div>
                               <span className="text-green-600 font-semibold">$0.00</span>
                             </div>
                           );
                         }
                         
                         // Show paid items
                         return (
                           <div key={addonId} className="flex justify-between items-center mb-1 text-xs text-gray-700">
                             <div>
                               <span className="font-medium">{addon.name}</span>
                               <span className="text-gray-500 ml-1">× {quantity}</span>
                             </div>
                             <span className="font-semibold">${(addon.price * quantity).toFixed(2)}</span>
                           </div>
                         );
                       })}
                     </div>
                   )}

                   {/* Total Amount */}
                   <div className="flex justify-between items-center pt-2 border-t-2 border-green-300">
                     <span className="text-sm sm:text-base font-bold text-gray-900">Total Amount:</span>
                     <span className="text-lg sm:text-xl font-bold text-green-700">
                       ${(() => {
                         let total = parseEventPrice(event.price) * registrationData.quantity;
                         if (selectedAddons && eventAddons) {
                           Object.keys(selectedAddons).forEach(addonId => {
                             const quantity = selectedAddons[addonId];
                             if (quantity > 0) {
                               const addon = eventAddons.find(a => a.id === addonId);
                               if (addon && !addon.isFreeWithTicket) {
                                 total += addon.price * quantity;
                               }
                             }
                           });
                         }
                         return total.toFixed(2);
                       })()}
                     </span>
                   </div>
                 </div>
             </div>
           )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {currentUser ? (
              <>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={registrationData.name}
                    disabled
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={registrationData.email}
                    disabled
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={registrationData.name}
                    onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={registrationData.phone || ''}
                onChange={currentUser ? undefined : (e) => setRegistrationData({...registrationData, phone: e.target.value})}
                disabled={!!currentUser}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${currentUser ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`}
                placeholder="Enter your phone number (optional)"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Dietary Restrictions
              </label>
              <textarea
                value={registrationData.dietaryRestrictions}
                onChange={(e) => setRegistrationData({...registrationData, dietaryRestrictions: e.target.value})}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Any dietary restrictions or allergies?"
                rows="2"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Special Requests
              </label>
              <textarea
                value={registrationData.specialRequests}
                onChange={(e) => setRegistrationData({...registrationData, specialRequests: e.target.value})}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Any special requests or accommodations needed?"
                rows="2"
              />
            </div>

            {requiresPayment && (
              <div className="border-t pt-3 sm:pt-4">
                 <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                   Payment Information
                 </label>
                {squareInitError ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-xs sm:text-sm text-red-800 break-words">{squareInitError}</p>
                  </div>
                ) : null}

                <div className="space-y-2.5 sm:space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Card details</label>
                    <div className="px-2.5 sm:px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                      <div id={containerId} />
                    </div>
                    {!squareReady && !squareInitError ? (
                      <p className="text-xs text-gray-500 mt-1">Loading payment form…</p>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {validationErrors.general && (
              <div className="text-red-600 text-xs sm:text-sm break-words">{validationErrors.general}</div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 sm:py-2 px-4 text-sm sm:text-base border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
               <button
                 type="submit"
                 disabled={isRegistering || paymentLoading || (requiresPayment && !squareReady)}
                 className="flex-1 py-2.5 sm:py-2 px-4 text-sm sm:text-base bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200 break-words"
               >
                 {paymentLoading ? 'Processing Payment...' : isRegistering ? 'Registering...' : requiresPayment ? (() => {
                   let total = parseEventPrice(event.price) * registrationData.quantity;
                   if (selectedAddons && eventAddons) {
                     Object.keys(selectedAddons).forEach(addonId => {
                       const quantity = selectedAddons[addonId];
                       if (quantity > 0) {
                         const addon = eventAddons.find(a => a.id === addonId);
                         if (addon && !addon.isFreeWithTicket) {
                           total += addon.price * quantity;
                         }
                       }
                     });
                   }
                   return `Pay $${total.toFixed(2)} & Register ${registrationData.quantity} ${registrationData.quantity === 1 ? 'Person' : 'People'}`;
                 })() : 'Register'}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Helper function to safely parse event price (handles both string "$10" and number 10)
const parseEventPrice = (price) => {
  if (price === null || price === undefined) return 0;
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    // Handle "Free" string
    if (price.toLowerCase() === 'free') return 0;
    // Remove $ and any whitespace, then parse
    const cleaned = price.replace('$', '').trim();
    return parseFloat(cleaned) || 0;
  }
  return 0;
};

// Helper function to check if event is paid
const isPaidEvent = (price) => {
  const parsedPrice = parseEventPrice(price);
  return parsedPrice > 0;
};

// Helper function to check if there are any paid addons selected
const hasPaidAddons = (selectedAddons, eventAddons) => {
  if (!selectedAddons || !eventAddons) return false;
  return Object.keys(selectedAddons).some(addonId => {
    const quantity = selectedAddons[addonId];
    if (quantity > 0) {
      const addon = eventAddons.find(a => a.id === addonId);
      return addon && !addon.isFreeWithTicket && addon.price > 0;
    }
    return false;
  });
};

// Helper function to calculate total addon price
const calculateAddonTotal = (selectedAddons, eventAddons) => {
  if (!selectedAddons || !eventAddons) return 0;
  let total = 0;
  Object.keys(selectedAddons).forEach(addonId => {
    const quantity = selectedAddons[addonId];
    if (quantity > 0) {
      const addon = eventAddons.find(a => a.id === addonId);
      if (addon && !addon.isFreeWithTicket) {
        total += addon.price * quantity;
      }
    }
  });
  return total;
};

const EventDetailsPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { triggerConfetti } = useCelebration();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: currentUser ? (currentUser.displayName || '') : '',
    email: currentUser ? (currentUser.email || '') : '',
    phone: currentUser ? (currentUser.phone || '') : '',
    dietaryRestrictions: '',
    specialRequests: '',
    cardNumber: '',
    quantity: 1
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [ticketInfo, setTicketInfo] = useState(null);
  const [copiedTicket, setCopiedTicket] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [existingRegistration, setExistingRegistration] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [eventAddons, setEventAddons] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState({}); // { addonId: quantity }
  const [registrationAddons, setRegistrationAddons] = useState([]); // Store addons for the current registration

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

  // Fetch event addons
  useEffect(() => {
    const fetchAddons = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/events/${id}/addons`);
        if (response.ok) {
          const data = await response.json();
          setEventAddons(data || []);
        } else {
          // Log detailed error information
          const errorText = await response.text();
          console.error('Error fetching addons - Status:', response.status, 'Response:', errorText);
          // Set empty array on error to prevent UI issues
          setEventAddons([]);
        }
      } catch (err) {
        console.error('❌ Error fetching addons:', err);
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
          eventId: id,
          url: `/events/${id}/addons`
        });
        // Show user-friendly error
        if (err.message && !err.message.includes('Failed to fetch')) {
          console.error('API Error:', err.message);
        }
        // Set empty array on error to prevent UI issues
        setEventAddons([]);
      }
    };
    fetchAddons();
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
       const eventPrice = parseEventPrice(event.price);
       if (eventPrice > 0) {
         paymentAmount = eventPrice * 100 * registrationData.quantity; // Convert to cents and multiply by quantity
       }
       
       // Add addon prices (excluding free items)
       const addonsArray = [];
       if (selectedAddons && eventAddons) {
         Object.keys(selectedAddons).forEach(addonId => {
           const quantity = selectedAddons[addonId];
           if (quantity > 0) {
             const addon = eventAddons.find(a => a.id === addonId);
             if (addon && !addon.isFreeWithTicket) {
               paymentAmount += (addon.price * 100 * quantity); // Convert to cents
               addonsArray.push({ addonId, quantity });
             } else if (addon && addon.isFreeWithTicket) {
               // Include free addons in the array for tracking
               addonsArray.push({ addonId, quantity });
             }
           }
         });
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
          quantity: registrationData.quantity,
          paymentAmount: paymentAmount,
          paymentIntentId: paymentIntentId,
          isPaidEvent: paymentAmount > 0,
          addons: addonsArray
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
          quantity: registrationData.quantity,
          paymentAmount: paymentAmount,
          paymentIntentId: paymentIntentId,
          isPaidEvent: paymentAmount > 0,
          addons: addonsArray
        };
        console.log('Registration data for guest user:', requestBody);
      }
      const response = await api.post(`/events/${id}/register`, requestBody, { headers });
      if (response.ok) {
        const result = await response.json();
        // Store addon details for display in confirmation
        const addonDetails = [];
        if (selectedAddons && eventAddons) {
          Object.keys(selectedAddons).forEach(addonId => {
            const quantity = selectedAddons[addonId];
            if (quantity > 0) {
              const addon = eventAddons.find(a => a.id === addonId);
              if (addon) {
                addonDetails.push({
                  id: addon.id,
                  name: addon.name,
                  price: addon.price,
                  quantity: quantity,
                  isFreeWithTicket: addon.isFreeWithTicket
                });
              }
            }
          });
        }
        // Also check if registration has addon info stored
        if (result.registration && result.registration.addons && result.registration.addons.length > 0) {
          // Fetch addon details from stored addon IDs
          const storedAddonDetails = [];
          for (const addonItem of result.registration.addons) {
            const addon = eventAddons.find(a => a.id === addonItem.addonId);
            if (addon) {
              storedAddonDetails.push({
                id: addon.id,
                name: addon.name,
                price: addon.price,
                quantity: addonItem.quantity || 1,
                isFreeWithTicket: addon.isFreeWithTicket
              });
            }
          }
          if (storedAddonDetails.length > 0) {
            setRegistrationAddons(storedAddonDetails);
          } else {
            setRegistrationAddons(addonDetails);
          }
        } else {
          setRegistrationAddons(addonDetails);
        }
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
  
  // Calculate if payment is required (paid event OR paid addons)
  const isPaidEventValue = event ? isPaidEvent(event.price) : false;
  const hasPaidAddonsValue = hasPaidAddons(selectedAddons, eventAddons);
  const requiresPayment = isPaidEventValue || hasPaidAddonsValue;

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
        <div className="relative h-64 sm:h-80 md:h-96">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="absolute inset-0 flex items-center">
            <div className="container-custom px-4 sm:px-6">
              <div className="max-w-4xl">
                <Link to="/events" className="inline-flex items-center text-white hover:text-gray-200 mb-3 sm:mb-4 text-sm sm:text-base">
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Back to Events
                </Link>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 break-words px-2">
                  {event.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-white text-xs sm:text-sm md:text-base px-2">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span className="break-words">{event.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span className="break-words">{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span className="break-words">{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-8 sm:py-10 md:py-12 px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Event Details Section */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border-l-4 border-primary-500 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-3 sm:mr-4 overflow-hidden flex-shrink-0">
                      {logoUrl ? (
                        <img 
                          src={logoUrl} 
                          alt="BOW Logo" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">Event Details</h2>
                  </div>
                  <div className="flex space-x-1.5 sm:space-x-2 flex-shrink-0">
                    <button className="p-1.5 sm:p-2 text-gray-600 hover:text-primary-600 transition-colors hover:bg-primary-50 rounded-lg" aria-label="Share event">
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button className="p-1.5 sm:p-2 text-gray-600 hover:text-red-600 transition-colors hover:bg-red-50 rounded-lg" aria-label="Like event">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <div className="whitespace-pre-line text-sm sm:text-base text-gray-700 leading-relaxed bg-gray-50 p-4 sm:p-5 md:p-6 rounded-lg border-l-4 border-primary-200 break-words">
                    {event.longDescription || event.description}
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border-l-4 border-secondary-500 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                    <span className="text-white text-xs sm:text-sm font-bold">#</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">Event Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {event.tags && event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-secondary-100 text-secondary-800 rounded-full text-xs sm:text-sm font-medium hover:bg-secondary-200 transition-colors duration-200 cursor-default break-words"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Event Addons Section */}
              {eventAddons.length > 0 && (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">Available Items</h3>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {eventAddons.map((addon) => {
                      const isOutOfStock = addon.stock !== null && addon.availableStock !== null && addon.availableStock <= 0;
                      const quantity = selectedAddons[addon.id] || 0;
                      const isFreeWithTicket = addon.isFreeWithTicket && addon.freeQuantityPerTicket > 0;
                      
                      return (
                        <div
                          key={addon.id}
                          className={`p-3 sm:p-4 rounded-lg border ${
                            isOutOfStock ? 'bg-gray-100 border-gray-300 opacity-60' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          } transition-colors duration-200`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm sm:text-base font-semibold text-gray-900 break-words">{addon.name}</h4>
                                {isFreeWithTicket ? (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-semibold">
                                    FREE {addon.freeQuantityPerTicket} per ticket
                                  </span>
                                ) : (
                                  <span className="text-sm sm:text-base font-bold text-purple-600">
                                    ${addon.price.toFixed(2)}
                                  </span>
                                )}
                                {addon.stock !== null && addon.availableStock !== null && (
                                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                    addon.availableStock > 0 
                                      ? 'bg-yellow-100 text-yellow-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {addon.availableStock > 0 ? `${addon.availableStock} left!` : 'SOLD OUT'}
                                  </span>
                                )}
                              </div>
                              {addon.description && (
                                <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">{addon.description}</p>
                              )}
                            </div>
                          </div>
                          
                          {!isFreeWithTicket && !isOutOfStock && (
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => {
                                  if (quantity > 0) {
                                    setSelectedAddons({ ...selectedAddons, [addon.id]: quantity - 1 });
                                  }
                                }}
                                disabled={quantity === 0}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                                  quantity === 0 
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                                }`}
                              >
                                −
                              </button>
                              <span className="text-sm sm:text-base font-semibold text-gray-900 min-w-[2rem] text-center">
                                {quantity}
                              </span>
                              <button
                                onClick={() => {
                                  const maxQty = addon.stock !== null && addon.availableStock !== null 
                                    ? addon.availableStock 
                                    : 999;
                                  if (quantity < maxQty) {
                                    setSelectedAddons({ ...selectedAddons, [addon.id]: quantity + 1 });
                                  }
                                }}
                                disabled={addon.stock !== null && addon.availableStock !== null && quantity >= addon.availableStock}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                                  (addon.stock !== null && addon.availableStock !== null && quantity >= addon.availableStock)
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                    : 'bg-purple-600 text-white hover:bg-purple-700'
                                }`}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Total Addon Price */}
                    {Object.keys(selectedAddons).some(id => selectedAddons[id] > 0) && (
                      <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-purple-900">Addon Total:</span>
                          <span className="text-base font-bold text-purple-700">
                            ${Object.keys(selectedAddons).reduce((total, addonId) => {
                              const addon = eventAddons.find(a => a.id === addonId);
                              if (!addon || addon.isFreeWithTicket) return total;
                              return total + (addon.price * selectedAddons[addonId]);
                            }, 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Registration Section */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mr-2 sm:mr-3 overflow-hidden flex-shrink-0">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">Registration</h3>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm sm:text-base text-gray-600">Price:</span>
                    <span className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                      {parseEventPrice(event.price) === 0 
                        ? 'Free' 
                        : typeof event.price === 'number' 
                          ? `$${event.price.toFixed(2)}` 
                          : event.price}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm sm:text-base text-gray-600">Capacity:</span>
                    <span className="text-sm sm:text-base font-semibold text-gray-900">{event.capacity}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm sm:text-base text-gray-600">Registered:</span>
                    <span className="text-sm sm:text-base font-semibold text-gray-900">{event.registeredCount}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Registration Progress</span>
                      <span className="text-gray-900">{Math.round(registrationPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 sm:h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${registrationPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {isAlreadyRegistered ? (
                    <div className="text-center py-3 sm:py-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center justify-center mb-2">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-1.5 sm:mr-2 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-green-800 font-medium break-words">Already Registered</span>
                        </div>
                        <p className="text-xs sm:text-sm text-green-700 break-words">You have successfully registered for this event!</p>
                        {ticketInfo?.ticketNumber && (
                          <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-white rounded border">
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">Your Ticket Number:</p>
                            <p className="font-mono text-xs sm:text-sm text-green-700 break-all">{ticketInfo.ticketNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : event.isLive ? (
                    <button 
                      onClick={handleRegistrationClick}
                      className={`w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 transform hover:scale-105 ${
                        isRegistrationOpen
                          ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!isRegistrationOpen}
                    >
                      {!isRegistrationOpen 
                        ? 'Registration Full' 
                        : 'Register Now'
                      }
                    </button>
                  ) : (
                    <div className="text-center py-3 sm:py-4">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center justify-center mb-2">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mr-1.5 sm:mr-2 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-yellow-800 font-medium break-words">Registration Not Open</span>
                        </div>
                        <p className="text-xs sm:text-sm text-yellow-700 break-words">This event is not yet live for registration. Check back later!</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Information Section */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">Event Information</h3>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start p-2.5 sm:p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 mt-0.5 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-medium text-gray-900 break-words">{event.date}</p>
                      <p className="text-xs sm:text-sm text-gray-600 break-words">{event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-2.5 sm:p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 mt-0.5 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-medium text-gray-900 break-words">{event.location}</p>
                      <p className="text-xs sm:text-sm text-gray-600 break-words">{event.address || event.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-2.5 sm:p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-blue-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-900 break-words">{event.organizer}</span>
                  </div>
                </div>
              </div>

              {/* Shop Section */}
              {(event.extraUrl1 || event.extraUrl2 || event.extraUrl3) && (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">Shop</h3>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    {event.extraUrl1 && (
                      <div className="flex items-center p-2.5 sm:p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
                        <Globe className="w-4 h-4 mr-2 sm:mr-3 text-green-500 flex-shrink-0" />
                        <a 
                          href={event.extraUrl1} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs sm:text-sm text-gray-900 hover:text-green-600 transition-colors duration-200 break-all"
                        >
                          {event.extraUrl1}
                        </a>
                      </div>
                    )}
                    
                    {event.extraUrl2 && (
                      <div className="flex items-center p-2.5 sm:p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
                        <Globe className="w-4 h-4 mr-2 sm:mr-3 text-green-500 flex-shrink-0" />
                        <a 
                          href={event.extraUrl2} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs sm:text-sm text-gray-900 hover:text-green-600 transition-colors duration-200 break-all"
                        >
                          {event.extraUrl2}
                        </a>
                      </div>
                    )}
                    
                    {event.extraUrl3 && (
                      <div className="flex items-center p-2.5 sm:p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
                        <Globe className="w-4 h-4 mr-2 sm:mr-3 text-green-500 flex-shrink-0" />
                        <a 
                          href={event.extraUrl3} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs sm:text-sm text-gray-900 hover:text-green-600 transition-colors duration-200 break-all"
                        >
                          {event.extraUrl3}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Information Section */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">Contact Information</h3>
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center p-2.5 sm:p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                    <Mail className="w-4 h-4 mr-2 sm:mr-3 text-purple-500 flex-shrink-0" />
                    <a href="mailto:beatsofredmond@gmail.com" className="text-xs sm:text-sm text-gray-900 hover:text-purple-600 transition-colors duration-200 break-all">
                      beatsofredmond@gmail.com
                    </a>
                  </div>
                  
                  <div className="flex items-center p-2.5 sm:p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                    <Phone className="w-4 h-4 mr-2 sm:mr-3 text-purple-500 flex-shrink-0" />
                    <a href="tel:+12063699576" className="text-xs sm:text-sm text-gray-900 hover:text-purple-600 transition-colors duration-200">
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
        <SquareRegistrationForm
          event={event}
          currentUser={currentUser}
          registrationData={registrationData}
          setRegistrationData={setRegistrationData}
          onRegister={handleRegistration}
          isRegistering={isRegistering}
          onClose={() => setShowRegistrationModal(false)}
          selectedAddons={selectedAddons}
          eventAddons={eventAddons}
        />
      )}

      {/* Ticket Success Modal */}
      {ticketInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 animate-in my-4">
            <div className="p-4 sm:p-5 md:p-6 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg overflow-hidden">
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt="BOW Logo" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                )}
              </div>
               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 px-2 break-words">
                 {ticketInfo.registration?.paymentAmount > 0 && ticketInfo.registration?.paymentStatus === 'pending' 
                   ? 'Registration Pending!' 
                   : 'Registration Successful!'
                 }
               </h3>
               <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2 break-words">
                 {ticketInfo.registration?.paymentAmount > 0 && ticketInfo.registration?.paymentStatus === 'pending'
                   ? `Your registration for ${ticketInfo.registration?.quantity || 1} ${(ticketInfo.registration?.quantity || 1) === 1 ? 'person' : 'people'} is being processed. You will receive a confirmation email once payment is confirmed.`
                   : `Your ticket for ${ticketInfo.registration?.quantity || 1} ${(ticketInfo.registration?.quantity || 1) === 1 ? 'person' : 'people'} has been generated and sent to your email.`
                 }
               </p>
              
               {/* Payment Information for Paid Events */}
               {ticketInfo.registration?.paymentAmount > 0 && (
                 <div className={`rounded-lg p-4 sm:p-5 mb-3 sm:mb-4 border-2 ${
                   ticketInfo.registration.paymentStatus === 'pending' 
                     ? 'bg-yellow-50 border-yellow-300' 
                     : 'bg-blue-50 border-blue-300'
                 }`}>
                   <div className="flex items-center justify-center mb-3">
                     <CreditCard className={`w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0 ${
                       ticketInfo.registration.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-blue-600'
                     }`} />
                     <span className={`text-base sm:text-lg font-bold break-words ${
                       ticketInfo.registration.paymentStatus === 'pending' ? 'text-yellow-900' : 'text-blue-900'
                     }`}>
                       {ticketInfo.registration.paymentStatus === 'pending' ? 'Payment Processing' : 'Payment Confirmed'}
                     </span>
                   </div>
                   
                   {/* Itemized Breakdown */}
                   <div className="bg-white rounded-lg p-3 sm:p-4 mb-3 border border-gray-200">
                     <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 pb-2 border-b border-gray-200">
                       Payment Breakdown
                     </div>
                     
                     {/* Event Ticket */}
                     <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                       <div>
                         <div className="text-sm font-medium text-gray-900">Event Ticket</div>
                         <div className="text-xs text-gray-500">
                           {ticketInfo.registration.quantity} {ticketInfo.registration.quantity === 1 ? 'person' : 'people'} × ${parseEventPrice(event.price).toFixed(2)}
                         </div>
                       </div>
                       <span className="text-sm font-semibold text-gray-900">
                         ${(parseEventPrice(event.price) * ticketInfo.registration.quantity).toFixed(2)}
                       </span>
                     </div>
                     
                     {/* Addon Items */}
                     {registrationAddons && registrationAddons.length > 0 && (
                       <>
                         {registrationAddons.map((addon) => (
                           <div key={addon.id} className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                             <div>
                               <div className="text-sm font-medium text-gray-900">
                                 {addon.name}
                                 {addon.isFreeWithTicket && (
                                   <span className="ml-2 text-xs text-green-600 font-semibold">(FREE)</span>
                                 )}
                               </div>
                               <div className="text-xs text-gray-500">
                                 Quantity: {addon.quantity}
                               </div>
                             </div>
                             <span className="text-sm font-semibold text-gray-900">
                               {addon.isFreeWithTicket ? (
                                 <span className="text-green-600">$0.00</span>
                               ) : (
                                 `$${(addon.price * addon.quantity).toFixed(2)}`
                               )}
                             </span>
                           </div>
                         ))}
                       </>
                     )}
                     
                     {/* Total */}
                     <div className="flex justify-between items-center pt-2 border-t-2 border-gray-300 mt-2">
                       <span className="text-base font-bold text-gray-900">Total Amount:</span>
                       <span className="text-lg font-bold text-green-700">
                         ${(ticketInfo.registration.paymentAmount / 100).toFixed(2)}
                       </span>
                     </div>
                   </div>
                   
                   {ticketInfo.registration.paymentIntentId && (
                     <div className="text-center">
                       <p className={`text-xs break-all ${
                         ticketInfo.registration.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-blue-600'
                       }`}>
                         Transaction ID: {ticketInfo.registration.paymentIntentId.slice(-12)}
                       </p>
                     </div>
                   )}
                 </div>
               )}
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6 border border-green-200">
                <div className="flex items-center justify-center space-x-2 sm:space-x-3 flex-wrap gap-2">
                  <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                  <p className="text-lg sm:text-xl font-mono text-green-700 font-bold break-all">{ticketInfo.ticketNumber}</p>
                  <button
                    onClick={copyTicketToClipboard}
                    className="p-1.5 sm:p-2 text-gray-500 hover:text-green-600 transition-all duration-200 hover:bg-green-100 rounded-lg flex-shrink-0"
                    title="Copy ticket number"
                    aria-label="Copy ticket number"
                  >
                    {copiedTicket ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 break-words">Click the copy button to save your ticket number</p>
              </div>
              
               <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                 {ticketInfo.registration?.paymentAmount > 0 && ticketInfo.registration?.paymentStatus === 'completed' && (
                   <button
                     onClick={() => generateReceipt()}
                     className="flex-1 py-2.5 sm:py-3 px-4 sm:px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                   >
                     Download Receipt
                   </button>
                 )}
              <button
                onClick={() => setTicketInfo(null)}
                   className={`py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 text-sm sm:text-base font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 ${ticketInfo.registration?.paymentAmount > 0 && ticketInfo.registration?.paymentStatus === 'completed' ? 'flex-1' : 'w-full'}`}
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