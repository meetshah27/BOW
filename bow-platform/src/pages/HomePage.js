import React, { useEffect, useRef, useState } from 'react';
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
import FrontendStabilityMonitor from '../utils/frontend-stability-test';


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
      // If dateStr is date-only (YYYY-MM-DD), treat as end of that day
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return new Date(dateStr + 'T23:59:59');
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
    description: 'Beats of Washington connects, inspires, and celebrates cultural diversity through music and community events across Washington State since 2019.',
    isActive: true
  });
  const [loadingHero, setLoadingHero] = useState(true);
  const [heroFetched, setHeroFetched] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      // Prevent duplicate calls
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
        setEventsFetched(true); // Mark as fetched
      } catch (err) {
        setEventsError('Could not load events.');
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };
    
    const fetchHeroSettings = async () => {
      // Prevent duplicate calls
      if (heroFetched) {
        console.log('⚠️ Hero settings already fetched, skipping duplicate request');
        return;
      }
      
      setLoadingHero(true);
      try {
        console.log('🔄 Fetching hero settings from backend...');
        console.log('🔄 Current heroSettings state:', heroSettings);
        
        const res = await api.get('/hero');
        console.log('📡 Backend response status:', res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log('✅ Hero settings fetched from backend:', data);
          console.log('✅ Setting new hero settings:', data);
          
          // Only update if we have valid data
          if (data && (data.backgroundUrl || data.title)) {
            setHeroSettings(data);
            setHeroFetched(true); // Mark as fetched
            console.log('✅ Hero settings updated successfully');
          } else {
            console.log('⚠️ Backend returned empty data, keeping current settings');
          }
        } else {
          console.error('❌ Failed to fetch hero settings, status:', res.status);
          const errorText = await res.text();
          console.error('Error response:', errorText);
          console.log('⚠️ Keeping current hero settings instead of using defaults');
        }
      } catch (err) {
        console.error('💥 Error fetching hero settings:', err);
        console.log('⚠️ Keeping current hero settings due to error (not resetting to defaults)');
      } finally {
        setLoadingHero(false);
      }
    };
    
    fetchEvents();
    fetchHeroSettings();
  }, []);

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

  // Start frontend stability monitoring
  useEffect(() => {
    if (window.frontendStabilityMonitor) {
      // Monitor hero settings specifically
      window.frontendStabilityMonitor.monitorData('heroSettings', () => heroSettings);
      window.frontendStabilityMonitor.monitorData('events', () => events);
      window.frontendStabilityMonitor.monitorData('loadingHero', () => loadingHero);
      window.frontendStabilityMonitor.monitorData('loadingEvents', () => loadingEvents);
      
      console.log('🔍 Frontend stability monitoring started for HomePage');
    }
  }, []);

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
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white overflow-hidden">


        
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
        <div className="container-custom section-padding relative z-10">
          {/* Live event placeholder absolutely at the far left of the hero section, outside the centered container */}
          {(loadingEvents || liveEvent) && (
            <div className="absolute left-0 top-[30%] -translate-y-1/2 z-20">
              {loadingEvents ? (
                <div className="bg-white/80 rounded-2xl px-5 py-5 min-w-[240px] max-w-[280px] flex items-center justify-center shadow-2xl border-2 border-orange-200 animate-pulse text-gray-400 text-base">
                  Loading event...
                </div>
              ) : eventsError ? null : liveEvent ? (
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-orange-200 px-5 py-5 min-w-[240px] max-w-[280px] h-[280px] flex flex-col items-start hover:shadow-2xl transition-all duration-200 text-left text-base">
                  <div className="flex items-center mb-3 w-full">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200 mr-2">Live</span>
                    <span className="text-xs text-gray-500 font-medium truncate">{liveEvent.isActive ? 'Available' : 'Draft'}</span>
                  </div>
                  <div className="font-bold text-gray-900 text-base truncate w-full mb-2">{liveEvent.title}</div>
                  <div className="flex items-center text-gray-600 mb-2 text-sm w-full">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{liveEvent.date}</span>
                  </div>
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
          <div className="max-w-4xl mx-auto mb-6 flex items-center justify-center">
            <div className="flex-1 text-center">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                {heroSettings.title || 'Empowering Communities'}
                <span className="block text-secondary-300">{heroSettings.subtitle || 'Through Music'}</span>
              </h1>
            </div>
          </div>
          <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed">
            {heroSettings.description || 'Beats of Washington connects, inspires, and celebrates cultural diversity through music and community events across Washington State since 2019.'}
          </p>
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
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="bg-white py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join us for exciting community events, workshops, and performances 
              that bring people together through the power of music.
            </p>
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
            <Link to="/events" className="btn-primary">
              View All Events
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Our Impact in Numbers Section */}
      <section className="bg-white py-20">
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
                <Users className="w-12 h-12 text-primary-600" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                50,000+
              </div>
              <div className="text-gray-600 font-medium">
                Community Members
              </div>
            </div>
            <div className="text-center stats-card">
              <div className="flex justify-center mb-4">
                <Heart className="w-12 h-12 text-primary-600" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                2,000+
              </div>
              <div className="text-gray-600 font-medium">
                Volunteers
              </div>
            </div>
            <div className="text-center stats-card">
              <div className="flex justify-center mb-4">
                <Calendar className="w-12 h-12 text-primary-600" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                200+
              </div>
              <div className="text-gray-600 font-medium">
                Events Annually
              </div>
            </div>
            <div className="text-center stats-card">
              <div className="flex justify-center mb-4">
                <Star className="w-12 h-12 text-primary-600" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Since 2019
              </div>
              <div className="text-gray-600 font-medium">
                Years of Service
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Beats of Washington (BOW) is dedicated to fostering community connections 
                through the universal language of music. We believe that music has the 
                power to bridge cultural divides, inspire creativity, and create lasting 
                bonds within our communities.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                As a 501(c)(3) non-profit organization, we serve over 50,000 community 
                members and coordinate 5,000+ volunteers across Washington State, 
                creating inclusive spaces where everyone can participate, learn, and grow.
              </p>
              <Link to="/about" className="btn-primary">
                Learn More About Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="/logo512.png"
                alt="Beats of Washington Logo"
                className="rounded-2xl shadow-2xl w-full h-80 object-contain bg-white p-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from the people who make our community vibrant and diverse.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Slider Section */}
      <section className="bg-white py-12">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Sponsors</h2>
          <div className="overflow-hidden relative">
            <div className="flex gap-8 animate-sponsor-scroll whitespace-nowrap">
              {sponsors.concat(sponsors).map((sponsor, idx) => (
                <div key={idx} className="sponsor-card">
                  <a 
                    href={sponsor.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-32 h-20 flex items-center justify-center"
                  >
                    <img
                      src={sponsor.logo}
                      alt={`${sponsor.name} logo`}
                      className="sponsor-logo"
                      title={sponsor.name}
                    />
                  </a>
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