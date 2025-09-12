import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Calendar, 
  Users, 
  Heart, 
  Music, 
  ArrowRight, 
  Star,
  MapPin,
  Clock
} from 'lucide-react';
import { parseDateString, formatDate, isFuture } from '../utils/dateUtils';
import api from '../config/api';



// CountUpNumber component with Intersection Observer
function CountUpNumber({ end, duration = 1.5, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let observer;
    let rafId;
    
    function animate() {
      let startTime = null;
      const startValue = 0;
      const endValue = end;

      function step(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
        
        setCount(currentCount);

        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          setCount(endValue);
          setIsComplete(true);
        }
      }
      
      rafId = requestAnimationFrame(step);
    }
    
    function handleIntersect(entries) {
      if (entries[0].isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        animate();
      }
    }
    
    observer = new window.IntersectionObserver(handleIntersect, { threshold: 0.1 });
    observer.observe(node);
    
    return () => {
      if (observer && node) observer.unobserve(node);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [end, duration, hasAnimated]);

  return (
    <span 
      ref={ref} 
      className={isComplete ? 'count-animate' : ''}
    >
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// Countdown component
function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function parseTargetDate(dateStr) {
      // Parse the date string manually to avoid timezone issues
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day, 23, 59, 59); // month is 0-indexed, set to end of day
      }
      // Otherwise, let Date parse it
      return new Date(dateStr);
    }
    function updateCountdown() {
      const now = new Date();
      const target = parseTargetDate(targetDate);
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    }
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.days + timeLeft.hours + timeLeft.minutes + timeLeft.seconds <= 0) return null;

  return (
    <div className="flex items-center text-xs font-semibold text-orange-600 mb-1 space-x-1">
      <Clock className="w-4 h-4 mr-1 text-orange-500" />
      {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
      <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
      <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
      <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
      <span>left</span>
    </div>
  );
}

// Live Event Timer component for hero section
function LiveEventTimer({ event }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!event || !event.date) return;

    function updateCountdown() {
      const now = new Date();
      // Parse the date string manually to avoid timezone issues
      let target;
      if (/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
        const [year, month, day] = event.date.split('-').map(Number);
        target = new Date(year, month - 1, day, 23, 59, 59); // month is 0-indexed, set to end of day
      } else {
        target = new Date(event.date);
      }
      const diff = target - now;
      
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [event]);

  if (!event || !event.date) return null;

  const hasTimeLeft = timeLeft.days + timeLeft.hours + timeLeft.minutes + timeLeft.seconds > 0;

  return (
    <div className="mt-4 text-center">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 max-w-xl mx-auto">
        <h3 className="text-base font-semibold text-white mb-3">
          🎉 Next Event: {event.title}
        </h3>
        
        {hasTimeLeft ? (
          <>
            <div className="text-xs text-gray-200 mb-2">
              Event starts in:
            </div>
            <div className="flex justify-center space-x-2 mb-3">
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-2 min-w-[50px]">
                  <div className="text-lg font-bold text-white">{String(timeLeft.days).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-200">Days</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-2 min-w-[50px]">
                  <div className="text-lg font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-200">Hours</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-2 min-w-[50px]">
                  <div className="text-lg font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-200">Minutes</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-2 min-w-[50px]">
                  <div className="text-lg font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-200">Seconds</div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-200">
              📅 {(() => {
                // Parse the date string manually to avoid timezone issues
                const [year, month, day] = event.date.split('-').map(Number);
                const localDate = new Date(year, month - 1, day); // month is 0-indexed
                return localDate.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                });
              })()}
              {event.time && (
                <span className="ml-2">🕐 {event.time}</span>
              )}
              {event.location && (
                <span className="ml-2">📍 {event.location}</span>
              )}
            </div>
          </>
        ) : (
          <div className="text-base font-semibold text-white">
            🎊 Event is happening now!
          </div>
        )}
      </div>
    </div>
  );
}

const HomePage = () => {
  // Dynamic events state
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState(null);
  const [eventsFetched, setEventsFetched] = useState(false);
  
  // Hero settings state
  const [heroSettings, setHeroSettings] = useState({
    backgroundType: 'image',
    backgroundUrl: '',
    overlayOpacity: 0.2,
    title: 'Empowering Communities',
    subtitle: 'Through Music',
    description: '',
    isActive: true
  });
  const [loadingHero, setLoadingHero] = useState(true);
  const [heroFetched, setHeroFetched] = useState(false);

  // Mission media state
  const [missionMedia, setMissionMedia] = useState({
    mediaType: 'image',
    mediaUrl: '/logo512.png',
    thumbnailUrl: '',
    title: '',
    description: '',
    altText: 'Beats of Washington Logo',
    isActive: true,
    overlayOpacity: 0.2,
    missionTitle: '',
    missionDescription: '',
    missionLegacy: ''
  });
  const [loadingMissionMedia, setLoadingMissionMedia] = useState(true);
  const [missionMediaFetched, setMissionMediaFetched] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  // Fetch functions defined outside useEffect to prevent recreation
  const fetchEvents = useCallback(async () => {
    if (eventsFetched) {
      console.log('⚠️ Events already fetched, skipping duplicate request');
      return;
    }
    
    setLoadingEvents(true);
    setEventsError(null);
    try {
      const res = await api.get('/events');
      if (!res.ok) throw new Error('Failed to fetch events');
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
      setEventsFetched(true);
    } catch (err) {
      setEventsError('Could not load events.');
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  }, [eventsFetched]);

  const fetchHeroSettings = useCallback(async () => {
    if (heroFetched) {
      console.log('⚠️ Hero settings already fetched, skipping duplicate request');
      return;
    }
    
    setLoadingHero(true);
    try {
      console.log('🔄 Fetching hero settings from backend...');
      const res = await api.get('/hero');
      console.log('📡 Backend response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('✅ Hero settings fetched from backend:', data);
        
        if (data && (data.backgroundUrl || data.title)) {
          setHeroSettings(data);
          setHeroFetched(true);
          console.log('✅ Hero settings updated successfully');
        } else {
          console.log('⚠️ Backend returned empty data, keeping current settings');
        }
      } else {
        console.error('❌ Failed to fetch hero settings, status:', res.status);
        console.log('⚠️ Keeping current hero settings instead of using defaults');
      }
    } catch (err) {
      console.error('💥 Error fetching hero settings:', err);
      console.log('⚠️ Keeping current hero settings due to error (not resetting to defaults)');
    } finally {
      setLoadingHero(false);
    }
  }, [heroFetched]);

  const fetchLogo = useCallback(async () => {
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
  }, []);

  const fetchMissionMedia = useCallback(async () => {
    if (missionMediaFetched) {
      console.log('⚠️ Mission media already fetched, skipping duplicate request');
      return;
    }
    
    setLoadingMissionMedia(true);
    try {
      console.log('🔄 Fetching mission media from backend...');
      const res = await api.get('/mission-media');
      console.log('📡 Mission media response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('✅ Mission media fetched from backend:', data);
        
        if (data && (data.mediaUrl || data.missionTitle || data.missionDescription)) {
          setMissionMedia(data);
          setMissionMediaFetched(true);
          console.log('✅ Mission media updated successfully');
        } else {
          console.log('⚠️ Backend returned empty data, keeping current settings');
        }
      } else {
        console.error('❌ Failed to fetch mission media, status:', res.status);
        console.log('⚠️ Keeping current mission media settings');
      }
    } catch (err) {
      console.error('💥 Error fetching mission media:', err);
      console.log('⚠️ Keeping current mission media settings due to error');
    } finally {
      setLoadingMissionMedia(false);
    }
  }, [missionMediaFetched]);

  // Initial data fetch - only run once
  useEffect(() => {
    fetchEvents();
    fetchHeroSettings();
    fetchMissionMedia();
    fetchLogo();
  }, []); // Empty dependency array - only run on mount

  // Debug: Log whenever heroSettings changes
  useEffect(() => {
    console.log('🔄 Hero settings state changed:', heroSettings);
    
    // Validate hero settings are stable
    if (heroSettings.backgroundUrl && heroSettings.backgroundUrl.startsWith('http')) {
      console.log('✅ Hero settings are stable with permanent URLs');
    } else if (heroSettings.backgroundUrl && heroSettings.backgroundUrl.startsWith('blob:')) {
      console.log('⚠️ Hero settings using temporary blob URLs (will not persist)');
    }
  }, [heroSettings]);



   

  // Find the nearest (soonest) live event by date, only if date is today or in the future
  const liveEvents = events.filter(e => {
    if (!e.isLive || !e.date) return false;
    return isFuture(e.date) || parseDateString(e.date)?.getTime() === parseDateString(new Date())?.getTime();
  });
  liveEvents.sort((a, b) => {
    const dateA = parseDateString(a.date);
    const dateB = parseDateString(b.date);
    return dateA - dateB;
  });
  const liveEvent = liveEvents[0];

  // DEBUG: Log the live event date and parsed date
  if (typeof window !== 'undefined' && liveEvent && liveEvent.date) {
    // eslint-disable-next-line no-console
    console.log('Live Event Date:', liveEvent.date, 'Parsed:', parseDateString(liveEvent.date));
  }

  const stats = [
    {
      label: 'Community Members',
      number: 50000,
      suffix: '+',
      icon: Users
    },
    {
      label: 'Volunteers',
      number: 5000,
      suffix: '+',
      icon: Heart
    },
    {
      label: 'Events Annually',
      number: 25,
      suffix: '+',
      icon: Calendar
    },
    {
      label: 'Years of Service',
      number: 5,
      suffix: '',
      icon: Star
    }
  ];

  const testimonials = [
    {
      name: "Shivam Pawar",
      role: "Community Member",
      content: "BOW has transformed our neighborhood through the power of music. The events bring people together in ways I never imagined possible.",
      rating: 5
    },
    {
      name: "Mandar",
      role: "Volunteer",
      content: "Being part of BOW has given me a sense of purpose and community. The impact we make on people's lives is incredible.",
      rating: 5
    },
    {
      name: "Nirmal Mantri",
      role: "Volunteer",
      content: "BOW provides a platform for local artists to showcase their talent and connect with the community. It's been life-changing.",
      rating: 5
    }
  ];

  // Add this after testimonials section, before CTA section
  const sponsors = [
    {
      name: 'Apna Bazar',
      logo: '/sponsors/apana-bazar.png',
      website: '#'
    },
    {
      name: 'Bel Red Best Smiles',
      logo: '/sponsors/bel-red-best-smiles.png',
      website: '#'
    },
    {
      name: 'Chutneys',
      logo: '/sponsors/chutneys.jpg',
      website: '#'
    },
    {
      name: 'Dulay Homes',
      logo: '/sponsors/dulay-homes.png',
      website: '#'
    },
    {
      name: 'Emerald Pacific Capital',
      logo: '/sponsors/emerald-pacific-capital.png',
      website: '#'
    },
    {
      name: 'Fusion India',
      logo: '/sponsors/fusion-india.avif',
      website: '#'
    },
    {
      name: 'goEzz',
      logo: '/sponsors/goezz.png',
      website: '#'
    },
    {
      name: 'Mayuri',
      logo: '/sponsors/mayuri-foods.png',
      website: '#'
    },
    {
      name: 'Soul Kitchen',
      logo: '/sponsors/soul-kitchen.png',
      website: '#'
    },
    {
      name: 'Sukarya USA',
      logo: '/sponsors/sukarya-usa.jpg',
      website: '#'
    },
    {
      name: 'Swapna Kadam',
      logo: '/sponsors/swapna-kadam.webp',
      website: '#'
    },
    {
      name: 'The Shade Home',
      logo: '/sponsors/the-shade-home.jpg',
      website: '#'
    },
    {
      name: 'VG Force',
      logo: '/sponsors/vg-force.png',
      website: '#'
    },
    {
      name: 'Washington State India Trade Relations Action Committee',
      logo: '/sponsors/washington-state-india-trade-relations-action-committee.jpg',
      website: '#'
    }
  ];

  // Style for event badge (match event section)
  const eventBadgeClass = "inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200";

  return (
    <>
      <Helmet>
        <title>Beats of Washington - Empowering Communities Through Music</title>
        <meta name="description" content="Beats of Washington (BOW) is a non-profit organization serving over 50,000 community members and 5,000+ volunteers across Washington State through music, culture, and connection." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white overflow-hidden rounded-b-[50px] min-h-[500px]">


        
        {/* Background Image/Video */}
        {heroSettings.backgroundUrl && heroSettings.backgroundType && (
          heroSettings.backgroundType === 'image' ? (
            <img
              src={heroSettings.backgroundUrl}
              alt="Hero background"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <video
              src={heroSettings.backgroundUrl}
              autoPlay
              muted
              loop
              className="absolute inset-0 w-full h-full object-cover"
            />
          )
        )}
        
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: heroSettings.overlayOpacity || 0.2 }}
        ></div>
        <div className="container-custom py-12 relative z-10">
          {/* Live event placeholder absolutely at the far left of the hero section, outside the centered container */}
          {(loadingEvents || liveEvent) && (
            <div className="absolute -left-8 top-[35%] -translate-y-1/2 z-20">
              {loadingEvents ? (
                <div className="bg-white/80 rounded-2xl px-5 py-5 min-w-[240px] max-w-[280px] flex items-center justify-center shadow-2xl border-2 border-orange-200 animate-pulse text-gray-400 text-base">
                  Loading event...
                </div>
              ) : eventsError ? null : liveEvent ? (
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-orange-200 px-5 py-5 min-w-[240px] max-w-[280px] h-[280px] flex flex-col items-start hover:shadow-2xl transition-all duration-200 text-left text-base">
                                     <div className="flex items-center mb-3 w-full">
                     <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200 mr-2">Live</span>
                     <span className="text-xs text-gray-500 font-medium truncate mr-2">{liveEvent.isActive ? 'Available' : 'Draft'}</span>
                     
                     {/* Dhol Animation next to Live/Available icons */}
                     <div className="dhol-animation-container relative">
                       {/* Dhol Drum */}
                       <div className="dhol-drum"></div>
                       
                       {/* Two Dhol Sticks */}
                       <div className="dhol-stick"></div>
                       <div className="dhol-stick"></div>
                       
                       {/* Ripple Effect */}
                       <div className="dhol-ripple"></div>
                     </div>
                   </div>
                  <div className="font-bold text-gray-900 text-base w-full mb-2 break-words leading-tight">{liveEvent.title}</div>
                  <div className="flex items-center text-gray-600 mb-2 text-sm w-full">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{(() => {
                      // Parse the date string manually to avoid timezone issues
                      const [year, month, day] = liveEvent.date.split('-').map(Number);
                      const localDate = new Date(year, month - 1, day); // month is 0-indexed
                      return localDate.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      });
                    })()}</span>
                  </div>
                  {liveEvent.time && (
                    <div className="flex items-center text-gray-600 mb-2 text-sm w-full">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{liveEvent.time}</span>
                    </div>
                  )}
                  {/* Countdown Timer */}
                  <div className="mb-2 w-full">
                    <CountdownTimer targetDate={liveEvent.date} />
                  </div>
                  <div className="flex items-center text-gray-600 mb-2 text-sm w-full">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{liveEvent.location || '—'}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-3 text-sm w-full">
                    <span className="mr-2">/</span>
                    <span className="font-medium text-green-700 truncate">{liveEvent.registeredCount || 0}{liveEvent.capacity ? ` / ${liveEvent.capacity}` : ''} registered</span>
                  </div>
                                     <div className="mt-auto w-full">
                     <Link
                       to={`/events/${liveEvent.id}`}
                       className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold py-2 rounded-xl shadow hover:from-orange-600 hover:to-orange-700 transition-all duration-200 text-center block"
                     >
                       Register Now
                     </Link>
                   </div>
                </div>
              ) : null}
            </div>
          )}
          <div className="max-w-4xl mx-auto mb-3 flex items-center justify-center">
            <div className="flex-1 text-center">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                {heroSettings.title || 'Empowering Communities'}
                <span className="block text-secondary-300">{heroSettings.subtitle || 'Through Music'}</span>
              </h1>
            </div>
          </div>
          {heroSettings.description && (
            <p className="text-xl md:text-2xl mb-4 text-gray-100 leading-relaxed">
              {heroSettings.description}
          </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events" className="btn-secondary text-lg px-8 py-4">
              <Calendar className="w-5 h-5 mr-2" />
              Find Events
            </Link>
            <Link to="/get-involved" className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600">
              <Users className="w-5 h-5 mr-2" />
              Get Involved
            </Link>
          </div>
          
          {/* Live Event Timer */}
          {liveEvent && (
            <LiveEventTimer event={liveEvent} />
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
       <section id="upcoming-events-section" className="bg-white py-16">
        <div className="container-custom">
          <div className="text-center mb-16 relative">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-br from-primary-200/20 to-secondary-200/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-gradient-to-br from-orange-200/20 to-yellow-200/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>
            
            {/* Main content with enhanced styling */}
            <div className="relative z-10">

              
                             {/* Enhanced title with button effect and animation */}
               <div className="relative inline-block">
                                                     {/* Enhanced title with button effect and animation */}
                  <div className="relative inline-block">
                    {/* Small floating bubbles around the title */}
                    <div className="absolute -top-2 -left-2 w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-orange-300 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                    <div className="absolute -bottom-1 -left-3 w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.6s'}}></div>
                    <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.9s'}}></div>
                    <div className="absolute top-1/2 -left-4 w-1.5 h-1.5 bg-orange-300 rounded-full animate-bounce" style={{animationDelay: '1.2s'}}></div>
                    <div className="absolute top-1/2 -right-4 w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
                    
                    <h2 
                      onClick={() => {
                        const eventsSection = document.getElementById('upcoming-events-section');
                        if (eventsSection) {
                          eventsSection.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                          });
                        }
                      }}
                      className="inline-block text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white animate-fade-in px-6 py-3 rounded-2xl shadow-lg hover:from-orange-600 hover:to-orange-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer dhol-enhanced"
                    >
                      Upcoming Events
                    </h2>
                  </div>
               </div>
              
              {/* Enhanced description with better typography and animation */}
              <div className="relative">
                <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              Join us for exciting community events, workshops, and performances 
              that bring people together through the power of music.
            </p>
                
                {/* Animated underline */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-primary-400 via-secondary-500 to-primary-600 rounded-full animate-pulse"></div>
              </div>
              
              {/* Floating accent elements */}
              <div className="flex justify-center space-x-4 mt-8">
                <div className="w-3 h-3 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                <div className="w-3 h-3 bg-secondary-400 rounded-full animate-bounce" style={{animationDelay: '0.7s'}}></div>
                <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.9s'}}></div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.slice(0, 6).map((event) => (
              <div key={event.id} className="card group">
                <div className="relative overflow-hidden rounded-t-xl">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {event.featured && (
                    <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {event.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {event.title}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                  <Link
                    to={`/events/${event.id}`}
                    className="btn-outline w-full"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

                                           <div className="text-center mt-12">
                        <Link to="/events" className="btn-primary dhol-enhanced">
                          View All Events
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                      </div>
        </div>
      </section>

      {/* Our Impact in Numbers Section */}
      <section className="stats-section bg-white py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how our community has grown and the impact we've made together
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center stats-card">
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12 text-primary-600 stats-icon" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 stats-number">
                50,000+
              </div>
              <div className="text-gray-600 font-medium stats-label">
                Community Members
              </div>
            </div>
            <div className="text-center stats-card">
              <div className="flex justify-center mb-4">
                <Heart className="w-12 h-12 text-primary-600 stats-icon" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 stats-number">
                2,000+
              </div>
              <div className="text-gray-600 font-medium stats-label">
                Volunteers
              </div>
            </div>
            <div className="text-center stats-card">
              <div className="flex justify-center mb-4">
                <Calendar className="w-12 h-12 text-primary-600 stats-icon" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 stats-number">
                100+
              </div>
              <div className="text-gray-600 font-medium stats-label">
                Events Annually
              </div>
            </div>
            <div className="text-center stats-card">
              <div className="flex justify-center mb-4">
                <Star className="w-12 h-12 text-primary-600 stats-icon" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 stats-number">
                Since 2019
              </div>
              <div className="text-gray-600 font-medium stats-label">
                Years of Service
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary-200/10 to-secondary-200/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-secondary-200/10 to-primary-200/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full mb-8 shadow-lg animate-pulse overflow-hidden">
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt="BOW Logo" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Music className="w-10 h-10 text-white animate-bounce" />
                )}
              </div>
              
              <h2 className="text-5xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent animate-fade-in">
                {missionMedia.missionTitle || 'Our Mission'}
              </h2>
              
              <div className="space-y-6 mb-10">
                <p className="text-xl text-gray-600 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                  {missionMedia.missionDescription || 
                    'Beats of Washington (BOW) is dedicated to fostering community connections ' +
                    'through the universal language of music. We believe that music has the ' +
                    'power to bridge cultural divides, inspire creativity, and create lasting ' +
                    'bonds within our communities.'
                  }
                </p>
                
                {missionMedia.missionLegacy && (
                  <p className="text-xl text-gray-600 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                    {missionMedia.missionLegacy}
                  </p>
                )}
                
                {!missionMedia.missionLegacy && (
                  <p className="text-xl text-gray-600 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                    As a 501(c)(3) non-profit organization, we serve over 50,000 community 
                    members and coordinate 5,000+ volunteers across Washington State, 
                    creating inclusive spaces where everyone can participate, learn, and grow.
                  </p>
                )}
              </div>
              
              <div className="relative">
                <Link to="/about" className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-500/30 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative flex items-center">
                    Learn More About Us
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </Link>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="relative mission-placeholder animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              {/* Multiple layered placeholders behind */}
              <div className="placeholder-layer-1"></div>
              <div className="placeholder-layer-2"></div>
              
              {/* Main placeholder content */}
              <div className="placeholder-content hover:shadow-2xl transition-all duration-500">
                {loadingMissionMedia ? (
                  <div className="w-full h-80 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl animate-pulse border border-gray-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <Music className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-gray-500 font-medium">Loading mission media...</div>
                    </div>
                  </div>
                ) : missionMedia.mediaUrl ? (
                  missionMedia.mediaType === 'video' ? (
                    <video
                      src={missionMedia.mediaUrl}
                      className="w-full h-80 object-cover rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                      controls
                      autoPlay
                      muted
                      loop
                      poster={missionMedia.thumbnailUrl}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={missionMedia.mediaUrl}
                      alt={missionMedia.altText || 'Mission Media'}
                      className="w-full h-80 object-contain rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                      title={missionMedia.title || ''}
                    />
                  )
                ) : (
                  <div className="w-full h-80 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary-400 transition-all duration-300">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Music className="w-10 h-10 text-white" />
                      </div>
                      <div className="text-lg font-medium text-gray-500 mb-2">No Media Set</div>
                      <div className="text-sm text-gray-400">Admins can add content from the admin panel</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-orange-400/10 to-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 rounded-full mb-8 shadow-lg animate-pulse overflow-hidden">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="BOW Logo" 
                  className="w-full h-full object-cover animate-fade-in"
                />
              ) : (
                <Users className="w-10 h-10 text-white animate-bounce" />
              )}
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent animate-fade-in">
              What Our Community Says
            </h2>
            <div className="relative">
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
                Hear from the people who make our community vibrant and diverse.
              </p>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl border border-gray-100 hover:border-orange-300 transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
                style={{animationDelay: `${0.2 + index * 0.2}s`}}
              >
                {/* Rating stars with enhanced styling */}
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-6 h-6 text-yellow-500 fill-current mr-1 transform hover:scale-110 transition-transform duration-200 animate-pulse"
                      style={{animationDelay: `${i * 0.1}s`}}
                    />
                  ))}
                </div>
                
                {/* Quote icon */}
                <div className="absolute top-6 right-6 opacity-30 group-hover:opacity-60 transition-opacity duration-500">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl font-serif">"</span>
                  </div>
                </div>
                
                {/* Testimonial content */}
                <p className="text-gray-700 mb-8 leading-relaxed text-lg group-hover:text-gray-900 transition-colors duration-300">
                  "{testimonial.content}"
                </p>
                
                {/* Author info with enhanced styling */}
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-white font-bold text-xl">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900 text-lg mb-1 group-hover:text-orange-600 transition-colors duration-300">
                      {testimonial.name}
                    </div>
                    <div className="text-orange-600 font-medium text-sm bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-2 rounded-full inline-block group-hover:from-orange-100 group-hover:to-amber-100 transition-all duration-300 border border-orange-200">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Slider Section */}
      <section className="sponsor-section py-12">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 relative z-10">Our Sponsors</h2>
          <div className="overflow-hidden relative">
            <div className="flex gap-8 animate-sponsor-scroll whitespace-nowrap">
              {sponsors.concat(sponsors).map((sponsor, idx) => (
                <div key={idx} className="sponsor-card">
                  <div className="block w-32 h-20 flex items-center justify-center">
                    <img
                      src={sponsor.logo}
                      alt={`${sponsor.name} logo`}
                      className="sponsor-logo"
                      title={sponsor.name}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">
            Join Our Community Today
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you want to volunteer, attend events, or support our mission, 
            there's a place for you in the Beats of Washington family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/get-involved" className="btn-secondary text-lg px-8 py-4">
              <Users className="w-5 h-5 mr-2" />
              Get Involved
            </Link>
            <Link to="/donate" className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600">
              <Heart className="w-5 h-5 mr-2" />
              Make a Donation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage; 