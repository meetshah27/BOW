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
  Clock,
  Building2,
  Award,
  Sparkles,
  Quote,
  ChevronLeft,
  ChevronRight,
  Image,
  Play,
  Mail
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
    <div className="mt-0 md:mt-16 mb-0 text-center px-2 sm:px-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-3.5 md:p-4 border border-white/20 max-w-xl mx-auto">
        <h3 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3 line-clamp-2 px-1">
          🎉 Next Event: {event.title}
        </h3>
        
        {hasTimeLeft ? (
          <>
            <div className="text-xs text-gray-200 mb-2">
              Event starts in:
            </div>
            <div className="flex justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-1.5 sm:p-2 min-w-[45px] sm:min-w-[50px]">
                  <div className="text-base sm:text-lg font-bold text-white">{String(timeLeft.days).padStart(2, '0')}</div>
                  <div className="text-[10px] sm:text-xs text-gray-200">Days</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-1.5 sm:p-2 min-w-[45px] sm:min-w-[50px]">
                  <div className="text-base sm:text-lg font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-[10px] sm:text-xs text-gray-200">Hours</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-1.5 sm:p-2 min-w-[45px] sm:min-w-[50px]">
                  <div className="text-base sm:text-lg font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-[10px] sm:text-xs text-gray-200">Minutes</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-1.5 sm:p-2 min-w-[45px] sm:min-w-[50px]">
                  <div className="text-base sm:text-lg font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-[10px] sm:text-xs text-gray-200">Seconds</div>
                </div>
              </div>
            </div>
            <div className="text-[10px] sm:text-xs text-gray-200 px-1 break-words">
              <span className="block sm:inline">📅 {(() => {
                // Parse the date string manually to avoid timezone issues
                const [year, month, day] = event.date.split('-').map(Number);
                const localDate = new Date(year, month - 1, day); // month is 0-indexed
                return localDate.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                });
              })()}</span>
              {event.time && (
                <span className="block sm:inline sm:ml-2">🕐 {event.time}</span>
              )}
              {event.location && (
                <span className="block sm:inline sm:ml-2">📍 {event.location}</span>
              )}
            </div>
          </>
        ) : (
          <div className="text-sm sm:text-base font-semibold text-white px-1">
            🎊 Event is happening now!
          </div>
        )}
        <div className="mt-3 sm:mt-4">
          <Link
            to={`/events/${event.id}`}
            className="inline-flex items-center justify-center px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
          >
            Register Now
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
          </Link>
        </div>
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

  // Sponsors state
  const [sponsors, setSponsors] = useState([]);
  const [loadingSponsors, setLoadingSponsors] = useState(true);
  const [sponsorsFetched, setSponsorsFetched] = useState(false);

  // Slideshow photos state
  const [slideshowPhotos, setSlideshowPhotos] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadingSlideshow, setLoadingSlideshow] = useState(true);
  const [slideshowFetched, setSlideshowFetched] = useState(false);

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

  const handleScrollToNewsletter = useCallback(() => {
    const newsletterSection = document.getElementById('newsletter-signup');
    if (newsletterSection) {
      newsletterSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleScrollToEvents = useCallback(() => {
    const eventsSection = document.getElementById('upcoming-events-section');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  const fetchSponsors = useCallback(async () => {
    if (sponsorsFetched) {
      console.log('⚠️ Sponsors already fetched, skipping duplicate request');
      return;
    }
    
    setLoadingSponsors(true);
    try {
      console.log('🔄 Fetching sponsors from backend...');
      const res = await api.get('/sponsors');
      console.log('📡 Sponsors response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('✅ Sponsors fetched from backend:', data);
        
        if (Array.isArray(data)) {
          setSponsors(data);
          setSponsorsFetched(true);
          console.log('✅ Sponsors updated successfully');
          console.log('📊 Total sponsors received:', data.length);
          
          // Debug each sponsor's details
          data.forEach((sponsor, index) => {
            console.log(`Sponsor ${index + 1}:`, {
              name: sponsor.name,
              id: sponsor.id,
              logoUrl: sponsor.logoUrl,
              isActive: sponsor.isActive,
              website: sponsor.website
            });
          });
        } else {
          console.log('⚠️ Backend returned invalid data format, keeping empty array');
        }
      } else {
        console.error('❌ Failed to fetch sponsors, status:', res.status);
        console.log('⚠️ Keeping empty sponsors array');
      }
    } catch (err) {
      console.error('💥 Error fetching sponsors:', err);
      console.log('⚠️ Keeping empty sponsors array due to error');
    } finally {
      setLoadingSponsors(false);
    }
  }, [sponsorsFetched]);

  // Initial data fetch - only run once
  useEffect(() => {
    fetchEvents();
    fetchHeroSettings();
    fetchMissionMedia();
    fetchSponsors();
    fetchLogo();
  }, []); // Empty dependency array - only run on mount

  // Add refresh capability for sponsors when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Refresh sponsors when page becomes visible (user switches back to tab)
        console.log('🔄 Page became visible, refreshing sponsors...');
        setSponsorsFetched(false);
        fetchSponsors();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchSponsors]);

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

  // Cultural quotes state
  const [culturalQuotes, setCulturalQuotes] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [quotesFetched, setQuotesFetched] = useState(false);

  // State for rotating quotes
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [quoteFade, setQuoteFade] = useState(true);

  // Fetch cultural quotes from API
  const fetchCulturalQuotes = useCallback(async () => {
    if (quotesFetched) {
      console.log('⚠️ Cultural quotes already fetched, skipping duplicate request');
      return;
    }
    
    setLoadingQuotes(true);
    try {
      const res = await api.get('/cultural-quotes');
      if (!res.ok) throw new Error('Failed to fetch cultural quotes');
      const data = await res.json();
      
      // Use fetched quotes if available, otherwise use defaults
      if (Array.isArray(data) && data.length > 0) {
        setCulturalQuotes(data);
      } else {
        // Default quotes if none exist in DB
        setCulturalQuotes([
          {
            id: 'default-1',
            text: "Music is the universal language that transcends all boundaries and unites hearts.",
            author: "Ancient Wisdom"
          },
          {
            id: 'default-2',
            text: "Unity in diversity creates the strongest communities where everyone belongs.",
            author: "Community Philosophy"
          },
          {
            id: 'default-3',
            text: "When we celebrate our culture together, we build bridges that connect generations.",
            author: "Cultural Heritage"
          },
          {
            id: 'default-4',
            text: "The rhythm of community beats stronger when every voice is heard.",
            author: "BOW Mission"
          },
          {
            id: 'default-5',
            text: "Through music and culture, we preserve traditions and create new memories.",
            author: "Legacy & Innovation"
          }
        ]);
      }
      setQuotesFetched(true);
    } catch (err) {
      console.error('Error fetching cultural quotes:', err);
      // Use default quotes on error
      setCulturalQuotes([
        {
          id: 'default-1',
          text: "Music is the universal language that transcends all boundaries and unites hearts.",
          author: "Ancient Wisdom"
        },
        {
          id: 'default-2',
          text: "Unity in diversity creates the strongest communities where everyone belongs.",
          author: "Community Philosophy"
        }
      ]);
    } finally {
      setLoadingQuotes(false);
    }
  }, [quotesFetched]);

  // Fetch quotes on mount
  useEffect(() => {
    fetchCulturalQuotes();
  }, [fetchCulturalQuotes]);

  // Rotate quotes every 5 seconds
  useEffect(() => {
    if (culturalQuotes.length === 0) return;
    
    const quoteInterval = setInterval(() => {
      setQuoteFade(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % culturalQuotes.length);
        setQuoteFade(true);
      }, 500);
    }, 5000);

    return () => clearInterval(quoteInterval);
  }, [culturalQuotes.length]);

  // Fetch slideshow photos from gallery
  const fetchSlideshowPhotos = useCallback(async () => {
    if (slideshowFetched) {
      console.log('⚠️ Slideshow photos already fetched, skipping duplicate request');
      return;
    }
    
    setLoadingSlideshow(true);
    try {
      const res = await api.get('/gallery');
      if (!res.ok) throw new Error('Failed to fetch gallery photos');
      const data = await res.json();
      
      // Get recent photos (limit to 10, exclude videos and event-linked photos for slideshow)
      const photos = data
        .filter(item => {
          const url = item.imageUrl || '';
          const isVideo = url.includes('.mp4') || url.includes('.mov') || url.includes('.avi');
          // Only include photos that are not linked to events (random uploads)
          return !isVideo && url && url.trim() !== '' && !item.eventId;
        })
        .sort((a, b) => {
          // Sort by creation date (newest first)
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        })
        .slice(0, 10) // Take the 10 most recent photos
        .map(item => ({
          id: item.id,
          url: item.imageUrl,
          title: item.title || 'Gallery Photo',
          description: item.description || ''
        }));
      
      setSlideshowPhotos(photos);
      setSlideshowFetched(true);
    } catch (err) {
      console.error('Error fetching slideshow photos:', err);
      setSlideshowPhotos([]);
    } finally {
      setLoadingSlideshow(false);
    }
  }, [slideshowFetched]);

  // Fetch slideshow photos on mount
  useEffect(() => {
    fetchSlideshowPhotos();
  }, [fetchSlideshowPhotos]);

  // Auto-rotate slideshow every 5 seconds
  useEffect(() => {
    if (slideshowPhotos.length <= 1) return;
    
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowPhotos.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [slideshowPhotos.length]);

  // Navigate slideshow
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideshowPhotos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideshowPhotos.length) % slideshowPhotos.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Sponsors are now fetched dynamically from the API

  // Style for event badge (match event section)
  const eventBadgeClass = "inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200";

  return (
    <>
      <Helmet>
        <title>Beats of Washington - Empowering Communities Through Music</title>
        <meta name="description" content="Beats of Washington (BOW) is a non-profit organization serving over 50,000 community members and 5,000+ volunteers across Washington State through music, culture, and connection." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white overflow-hidden rounded-b-[32px] sm:rounded-b-[40px] md:rounded-b-[48px] min-h-[360px] sm:min-h-[420px] md:min-h-[480px] flex flex-col">


        
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
        <div className="container-custom py-6 sm:py-8 md:py-10 px-4 sm:px-6 relative z-10 flex flex-col flex-1">
          <div className="max-w-4xl mx-auto mb-3 sm:mb-4 md:mb-0 flex items-center justify-center">
            <div className="flex-1 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight px-2">
                {heroSettings.title || 'Empowering Communities'}
                <span className="block text-secondary-300 mt-1 sm:mt-2">{heroSettings.subtitle || 'Through Music'}</span>
              </h1>
            </div>
          </div>
          {heroSettings.description && (
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-3 sm:mb-4 md:mb-6 text-gray-100 leading-relaxed max-w-4xl mx-auto text-center px-2 sm:px-4">
              {heroSettings.description}
          </p>
          )}
          {/* Live Event Timer - pushed to bottom on mobile, normal spacing on desktop */}
          {liveEvent && (
            <div className="mt-auto md:mt-8 w-full px-2 sm:px-0">
              <LiveEventTimer event={liveEvent} />
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
       <section id="upcoming-events-section" className="bg-white pt-0 pb-8 sm:pt-2 sm:pb-12 md:pt-4 md:pb-14">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 relative">
            {/* Decorative background elements - hidden on mobile for performance */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-br from-primary-200/20 to-secondary-200/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-gradient-to-br from-orange-200/20 to-yellow-200/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>
            
            {/* Main content with enhanced styling */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 overflow-x-auto sm:overflow-visible py-2 px-2">
              {/* Mobile Buttons - Show on mobile, hide on desktop */}
              <div className="block md:hidden flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full">
                <Link
                  to="/get-involved"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-xs sm:text-sm shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 whitespace-nowrap flex-shrink-0"
                >
                  Get Involved
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
                <div className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleScrollToNewsletter}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border border-primary-500 text-primary-600 font-semibold text-xs sm:text-sm shadow hover:bg-primary-500 hover:text-white transition-all duration-300"
                  >
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Subscribe</span>
                  </button>
                  <Link
                    to="/donate"
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-xs sm:text-sm shadow-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                  >
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                    Donate
                  </Link>
                </div>
              </div>

              {/* Desktop Button - Hide on mobile, show on desktop */}
              <button
                onClick={handleScrollToEvents}
                className="hidden md:inline-flex items-center gap-3 px-8 py-4 rounded-lg text-white text-lg font-bold shadow-lg transition-all duration-300 relative overflow-visible events-button-sputter bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 hover:from-orange-600 hover:via-red-600 hover:to-orange-700"
              >
                <Calendar className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Upcoming Events</span>
              </button>
            </div>
            
            {/* Enhanced description with better typography and animation */}
            <div className="relative mt-4 sm:mt-6 md:mt-8">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed animate-fade-in-up px-2 sm:px-4" style={{animationDelay: '0.3s'}}>
              Join us for exciting community events, workshops, and performances 
              that bring people together through the power of music.
            </p>
              
              {/* Animated underline */}
              <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 h-0.5 sm:h-1 bg-gradient-to-r from-primary-400 via-secondary-500 to-primary-600 rounded-full animate-pulse"></div>
            </div>
            
            {/* Floating accent elements - hidden on mobile */}
            <div className="hidden sm:flex justify-center space-x-4 mt-6 md:mt-8">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-secondary-400 rounded-full animate-bounce" style={{animationDelay: '0.7s'}}></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.9s'}}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {events.slice(0, 6).map((event) => (
              <div key={event.id} className="card group">
                <div className="relative overflow-hidden rounded-t-lg sm:rounded-t-xl">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {event.featured && (
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-primary-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                      Featured
                    </div>
                  )}
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white text-gray-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                    {event.category}
                  </div>
                </div>
                <div className="p-4 sm:p-5 md:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center text-sm sm:text-base text-gray-600">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                      <span className="truncate">{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm sm:text-base text-gray-600">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                  <Link
                    to={`/events/${event.id}`}
                    className="btn-outline w-full text-sm sm:text-base py-2 sm:py-2.5"
                  >
                    Learn More
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link to="/events" className="btn-primary dhol-enhanced inline-flex items-center gap-2 text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3">
              View All Events
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Slideshow Section */}
      {slideshowPhotos.length > 0 && (
        <section className="relative py-8 sm:py-12 md:py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
          {/* Background decorative elements - hidden on mobile */}
          <div className="absolute inset-0 overflow-hidden hidden sm:block">
            <div className="absolute top-10 right-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
          </div>

          <div className="container-custom relative z-10 px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent px-2">
                Our Community in Action
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto px-2">
                Moments captured from our events and celebrations
              </p>
            </div>

            <div className="relative max-w-5xl mx-auto">
              {/* Slideshow Container */}
              <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[450px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
                {loadingSlideshow ? (
                  <div className="flex items-center justify-center h-full bg-gray-800">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-orange-500 mx-auto mb-3 sm:mb-4"></div>
                      <p className="text-gray-400 text-xs sm:text-sm md:text-base">Loading gallery photos...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Slides */}
                    {slideshowPhotos.map((photo, index) => (
                      <div
                        key={photo.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                          index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                      >
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        
                        {/* Photo Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white z-20">
                          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">{photo.title}</h3>
                          {photo.description && (
                            <p className="text-gray-200 text-sm sm:text-base md:text-lg">{photo.description}</p>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Navigation Arrows */}
                    {slideshowPhotos.length > 1 && (
                      <>
                        <button
                          onClick={prevSlide}
                          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110"
                          aria-label="Previous slide"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        </button>
                        <button
                          onClick={nextSlide}
                          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110"
                          aria-label="Next slide"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        </button>
                      </>
                    )}

                    {/* Dots Indicator */}
                    {slideshowPhotos.length > 1 && (
                      <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-1.5 sm:gap-2">
                        {slideshowPhotos.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                              index === currentSlide
                                ? 'bg-white w-6 sm:w-7 md:w-8'
                                : 'bg-white/40 hover:bg-white/60'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* View Gallery Button */}
              <div className="text-center mt-6 sm:mt-8">
                <Link
                  to="/gallery"
                  className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-semibold text-sm sm:text-base md:text-lg hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Image className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">View Full Gallery</span>
                  <span className="xs:hidden">View Gallery</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Our Impact in Numbers Section */}
      <section className="stats-section relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        {/* Animated Background Elements - visible on all screens, smaller/subtle on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating particles - smaller on mobile */}
          <div className="absolute top-20 left-10 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-primary-400/20 sm:bg-primary-400/30 rounded-full animate-float-slow"></div>
          <div className="absolute top-32 right-20 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 bg-secondary-400/25 sm:bg-secondary-400/40 rounded-full animate-float-slow-reverse"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-orange-400/20 sm:bg-orange-400/30 rounded-full animate-float-slow" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 right-1/3 w-3 h-3 sm:w-3 sm:h-3 md:w-5 md:h-5 bg-purple-400/20 sm:bg-purple-400/30 rounded-full animate-float-slow-reverse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-1 h-1 sm:w-2 sm:h-2 md:w-2 md:h-2 bg-pink-400/25 sm:bg-pink-400/40 rounded-full animate-float-slow" style={{animationDelay: '3s'}}></div>

          {/* Large gradient orbs - smaller and more subtle on mobile */}
          <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-gradient-to-br from-primary-200/10 sm:from-primary-200/15 md:from-primary-200/20 to-blue-200/10 sm:to-blue-200/15 md:to-blue-200/20 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 sm:w-56 sm:h-56 md:w-80 md:h-80 bg-gradient-to-br from-purple-200/10 sm:from-purple-200/15 md:from-purple-200/20 to-pink-200/10 sm:to-pink-200/15 md:to-pink-200/20 rounded-full blur-2xl sm:blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-br from-orange-200/8 sm:from-orange-200/12 md:from-orange-200/15 to-yellow-200/8 sm:to-yellow-200/12 md:to-yellow-200/15 rounded-full blur-xl sm:blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="container-custom relative z-10 px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-block">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4 md:mb-6 transform hover:scale-105 transition-all duration-500 px-2">
                Our Impact in Numbers
              </h2>
              <div className="h-0.5 sm:h-1 w-16 sm:w-20 md:w-24 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto rounded-full mb-4 sm:mb-5 md:mb-6"></div>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed transform hover:scale-105 transition-all duration-500 px-2 sm:px-4">
              See how our community has grown and the impact we've made together
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {/* Community Members */}
            <div className="group text-center stats-card bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 sm:hover:-translate-y-4 transition-all duration-500 border border-white/20 relative overflow-hidden">
              {/* Card background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Animated icon */}
              <div className="relative mb-4 sm:mb-5 md:mb-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8 text-white" />
                    </div>
                    {/* Pulsing ring - visible on all screens, smaller on mobile */}
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-blue-400/20 sm:border-2 sm:border-blue-400/30 group-hover:border-blue-400/40 sm:group-hover:border-blue-400/60 animate-ping"></div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-500">
                  50,000+
                </div>
                <div className="text-gray-700 font-semibold text-sm sm:text-base md:text-lg group-hover:text-blue-700 transition-colors duration-300">
                  Community Members
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Growing every day
                </div>
              </div>
            </div>

            {/* Volunteers */}
            <div className="group text-center stats-card bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 sm:hover:-translate-y-4 transition-all duration-500 border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-pink-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative mb-4 sm:mb-5 md:mb-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <Heart className="w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-red-400/20 sm:border-2 sm:border-red-400/30 group-hover:border-red-400/40 sm:group-hover:border-red-400/60 animate-ping"></div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-500">
                  2,000+
                </div>
                <div className="text-gray-700 font-semibold text-sm sm:text-base md:text-lg group-hover:text-red-700 transition-colors duration-300">
                  Volunteers
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Making a difference
                </div>
              </div>
            </div>

            {/* Events Annually */}
            <div className="group text-center stats-card bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 sm:hover:-translate-y-4 transition-all duration-500 border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative mb-4 sm:mb-5 md:mb-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <Calendar className="w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-green-400/20 sm:border-2 sm:border-green-400/30 group-hover:border-green-400/40 sm:group-hover:border-green-400/60 animate-ping"></div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-500">
                  100+
                </div>
                <div className="text-gray-700 font-semibold text-sm sm:text-base md:text-lg group-hover:text-green-700 transition-colors duration-300">
                  Events Annually
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Community celebrations
                </div>
              </div>
            </div>

            {/* Years of Service */}
            <div className="group text-center stats-card bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 sm:hover:-translate-y-4 transition-all duration-500 border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-indigo-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative mb-4 sm:mb-5 md:mb-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <Star className="w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-purple-400/20 sm:border-2 sm:border-purple-400/30 group-hover:border-purple-400/40 sm:group-hover:border-purple-400/60 animate-ping"></div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-500">
                  Since 2019
                </div>
                <div className="text-gray-700 font-semibold text-sm sm:text-base md:text-lg group-hover:text-purple-700 transition-colors duration-300">
                  Years of Service
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Building community
                </div>
              </div>
            </div>
          </div>

          {/* Additional Impact Statement */}
          <div className="mt-8 sm:mt-12 md:mt-16 text-center px-2 sm:px-4">
            <div className="inline-block bg-gradient-to-r from-primary-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-primary-200/30 shadow-lg">
              <p className="text-sm sm:text-base md:text-lg text-gray-700 font-medium px-2">
                <span className="text-primary-600 font-bold">Every number tells a story</span> of community, 
                connection, and the power of music to bring people together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 sm:py-16 md:py-20 relative overflow-hidden">
        {/* Background decorative elements - hidden on mobile */}
        <div className="absolute inset-0 overflow-hidden hidden sm:block">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary-200/10 to-secondary-200/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-secondary-200/10 to-primary-200/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container-custom relative z-10 px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">                                                              
            <div className="animate-fade-in-up order-1 lg:order-1">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full mb-4 sm:mb-6 md:mb-8 shadow-lg animate-pulse overflow-hidden">
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt="BOW Logo" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Music className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white animate-bounce" />
                )}
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent animate-fade-in px-2">
                {missionMedia.missionTitle || 'Our Mission'}
              </h2>
              
              <div className="space-y-4 sm:space-y-5 md:space-y-6 mb-6 sm:mb-8 md:mb-10">
                <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed animate-fade-in-up px-2" style={{animationDelay: '0.2s'}}>
                  {missionMedia.missionDescription || 
                    'Beats of Washington (BOW) is dedicated to fostering community connections ' +
                    'through the universal language of music. We believe that music has the ' +
                    'power to bridge cultural divides, inspire creativity, and create lasting ' +
                    'bonds within our communities.'
                  }
                </p>
                
                {missionMedia.missionLegacy && (
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed animate-fade-in-up px-2" style={{animationDelay: '0.4s'}}>
                    {missionMedia.missionLegacy}
                  </p>
                )}
                
                {!missionMedia.missionLegacy && (
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed animate-fade-in-up px-2" style={{animationDelay: '0.4s'}}>
                    As a 501(c)(3) non-profit organization, we serve over 50,000 community 
                    members and coordinate 5,000+ volunteers across Washington State, 
                    creating inclusive spaces where everyone can participate, learn, and grow.
                  </p>
                )}
              </div>
              
              <div className="relative px-2">
                <Link to="/about" className="group relative inline-flex items-center px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-sm sm:text-base md:text-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-500/30 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative flex items-center">
                    Learn More About Us
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-2 sm:ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </Link>
                <div className="absolute -bottom-1 sm:-bottom-2 left-2 w-[calc(100%-1rem)] sm:w-full h-0.5 sm:h-1 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="relative mission-placeholder animate-fade-in-up order-2 lg:order-2" style={{animationDelay: '0.6s'}}>                               
              {/* Multiple layered placeholders behind - hidden on mobile */}   
              <div className="placeholder-layer-1 hidden sm:block"></div>       
              <div className="placeholder-layer-2 hidden sm:block"></div>
              
              {/* Main placeholder content */}
              <div className="placeholder-content hover:shadow-2xl transition-all duration-500">
                {loadingMissionMedia ? (
                  <div className="w-full h-48 sm:h-64 md:h-80 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl animate-pulse border border-gray-200">
                    <div className="text-center px-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-bounce">
                        <Music className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                      </div>
                      <div className="text-sm sm:text-base md:text-lg text-gray-500 font-medium">Loading mission media...</div>
                    </div>
                  </div>
                ) : missionMedia.mediaUrl ? (
                  missionMedia.mediaType === 'video' ? (
                    <video
                      src={missionMedia.mediaUrl}
                      className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
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
                      className="w-full h-48 sm:h-64 md:h-80 object-contain rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                      title={missionMedia.title || ''}
                    />
                  )
                ) : (
                  <div className="w-full h-48 sm:h-64 md:h-80 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary-400 transition-all duration-300">
                    <div className="text-center px-4">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
                        <Music className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
                      </div>
                      <div className="text-base sm:text-lg font-medium text-gray-500 mb-1 sm:mb-2">No Media Set</div>
                      <div className="text-xs sm:text-sm text-gray-400">Admins can add content from the admin panel</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Cultural Section */}
      <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        {/* Animated background patterns - hidden on mobile */}
        <div className="absolute inset-0 overflow-hidden hidden sm:block">
          {/* Floating cultural pattern elements */}
          <div className="absolute top-10 left-10 w-32 h-32 opacity-20">
            <svg className="w-full h-full animate-spin-slow" style={{animation: 'spin 20s linear infinite'}} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-400"/>
              <path d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z" fill="currentColor" className="text-orange-500 opacity-60"/>
            </svg>
          </div>
          <div className="absolute bottom-20 right-20 w-40 h-40 opacity-15">
            <svg className="w-full h-full animate-spin-slow-reverse" style={{animation: 'spin 25s linear infinite reverse'}} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-400"/>
              <path d="M50 5 L60 40 L95 50 L60 60 L50 95 L40 60 L5 50 L40 40 Z" fill="currentColor" className="text-amber-500 opacity-50"/>
              <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" className="text-yellow-400"/>
            </svg>
          </div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 opacity-10">
            <svg className="w-full h-full animate-pulse" viewBox="0 0 100 100">
              <path d="M50 10 Q30 30 50 50 Q70 30 50 10" fill="currentColor" className="text-orange-500"/>
              <path d="M50 50 Q30 70 50 90 Q70 70 50 50" fill="currentColor" className="text-amber-500"/>
            </svg>
          </div>
          <div className="absolute bottom-10 left-1/3 w-28 h-28 opacity-12">
            <svg className="w-full h-full animate-bounce" style={{animationDuration: '4s'}} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-500"/>
              <path d="M50 20 L55 45 L80 50 L55 55 L50 80 L45 55 L20 50 L45 45 Z" fill="currentColor" className="text-orange-400 opacity-70"/>
            </svg>
          </div>
          
          {/* Gradient orbs */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-orange-400/20 to-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-yellow-500/15 to-orange-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="container-custom relative z-10 px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            {/* Animated cultural icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 rounded-full mb-4 sm:mb-6 md:mb-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="BOW Logo" 
                  className="w-full h-full object-cover relative z-10 animate-fade-in"
                />
              ) : (
                <Music className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white relative z-10 animate-bounce" style={{animationDuration: '2s'}} />
              )}
              {/* Rotating decorative rings - hidden on mobile */}
              <div className="absolute inset-0 border-4 border-white/30 rounded-full animate-spin-slow hidden sm:block"></div>
              <div className="absolute inset-2 border-2 border-white/20 rounded-full animate-spin-slow-reverse hidden sm:block" style={{animationDuration: '3s'}}></div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent animate-fade-in px-2">
              Cultural Wisdom & Heritage
            </h2>
            <div className="relative">
              <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed animate-fade-in-up px-2 sm:px-4">
                Timeless wisdom that guides our community and celebrates our shared values
              </p>
              <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 h-0.5 sm:h-1 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Rotating Quote Display */}
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl border-2 border-orange-200/50 overflow-hidden">
              {/* Animated border gradient */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 opacity-20 animate-pulse"></div>
              <div className="absolute inset-[2px] rounded-2xl sm:rounded-3xl bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50"></div>
              
              {/* Decorative corner elements - hidden on mobile */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 w-12 h-12 sm:w-16 sm:h-16 opacity-30 hidden sm:block">
                <svg viewBox="0 0 100 100" className="w-full h-full text-orange-400 animate-pulse">
                  <path d="M10 10 L40 10 L10 40 Z" fill="currentColor"/>
                  <circle cx="25" cy="25" r="5" fill="currentColor" className="text-amber-500"/>
                </svg>
                  </div>
              <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 opacity-30 hidden sm:block">
                <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-400 animate-pulse" style={{animationDelay: '1s'}}>
                  <path d="M90 90 L60 90 L90 60 Z" fill="currentColor"/>
                  <circle cx="75" cy="75" r="5" fill="currentColor" className="text-orange-500"/>
                </svg>
                </div>
                
              {/* Quote content */}
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4 sm:mb-6 md:mb-8">
                  <Quote className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-orange-500 animate-pulse" style={{animationDelay: '0.5s'}} />
                </div>
                
                {loadingQuotes ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-orange-500 mx-auto mb-3 sm:mb-4"></div>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600">Loading cultural wisdom...</p>
                  </div>
                ) : culturalQuotes.length > 0 ? (
                  <>
                    <div 
                      className={`transition-opacity duration-500 ${quoteFade ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-gray-800 text-center leading-relaxed mb-4 sm:mb-6 md:mb-8 italic px-2 sm:px-4">
                        "{culturalQuotes[currentQuoteIndex]?.text || ''}"
                      </p>
                  <div className="text-center">
                        <p className="text-sm sm:text-base md:text-lg font-semibold text-orange-600 bg-gradient-to-r from-orange-50 to-amber-50 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full inline-block border border-orange-200">
                          — {culturalQuotes[currentQuoteIndex]?.author || ''}
                        </p>
                    </div>
                    </div>

                    {/* Quote indicator dots */}
                    <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 md:mt-8">
                      {culturalQuotes.map((_, index) => (
                        <div
                          key={index}
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                            index === currentQuoteIndex
                              ? 'bg-orange-500 w-6 sm:w-7 md:w-8'
                              : 'bg-orange-300'
                          }`}
                        />
                      ))}
                  </div>
                  </>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2">No quotes available at the moment.</p>
                </div>
                )}
              </div>

              {/* Floating decorative elements - hidden on mobile */}
              <div className="absolute top-4 sm:top-8 right-4 sm:right-8 w-16 h-16 sm:w-20 sm:h-20 opacity-10 hidden sm:block">
                <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-400"/>
                  <path d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z" fill="currentColor" className="text-amber-500"/>
                </svg>
          </div>
              <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 w-12 h-12 sm:w-16 sm:h-16 opacity-10 hidden sm:block">
                <svg className="w-full h-full animate-spin-slow-reverse" viewBox="0 0 100 100" style={{animationDuration: '8s'}}>
                  <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-yellow-400"/>
                  <path d="M50 15 L60 40 L85 50 L60 60 L50 85 L40 60 L15 50 L40 40 Z" fill="currentColor" className="text-orange-400"/>
                </svg>
        </div>
            </div>
          </div>
        </div>

        {/* Add custom CSS for animations */}
        <style>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spin-slow-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
          .animate-spin-slow-reverse {
            animation: spin-slow-reverse 25s linear infinite;
          }
        `}</style>
      </section>

      {/* Enhanced Sponsors Slider Section */}
      <section className="sponsor-section py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 via-orange-50 to-amber-50 relative overflow-hidden">
        {/* Background decorative elements - hidden on mobile */}
        <div className="absolute inset-0 overflow-hidden hidden sm:block">
          <div className="absolute top-10 left-10 w-48 h-48 bg-gradient-to-br from-orange-300/10 to-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-br from-amber-300/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-orange-400/5 to-amber-500/5 rounded-full blur-2xl animate-bounce" style={{animationDuration: '6s'}}></div>
        </div>
        
        {/* Subtle pattern overlay - hidden on mobile */}
        <div className="absolute inset-0 opacity-5 hidden sm:block">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='0.2'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="container-custom relative z-10 px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 rounded-full mb-4 sm:mb-5 md:mb-6 shadow-lg overflow-hidden group hover:scale-110 transition-transform duration-300 cursor-pointer">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="BOW Logo" 
                  className="w-full h-full object-cover group-hover:rotate-12 transition-transform duration-500"
                />
              ) : (
                <Building2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform duration-300" />
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent animate-fade-in hover:from-orange-500 hover:via-amber-500 hover:to-yellow-500 transition-all duration-500 px-2">
              Our Valued Sponsors
            </h2>
            <div className="relative">
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up hover:text-gray-800 transition-colors duration-300 px-2 sm:px-4">
                Thank you to our amazing sponsors who make our community events possible
              </p>
              <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 w-20 sm:w-24 md:w-28 h-0.5 sm:h-1 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 rounded-full animate-pulse hover:w-32 sm:hover:w-36 transition-all duration-500"></div>
            </div>
          </div>
          
          <div className="overflow-hidden relative" style={{ width: '100%' }}>
            {loadingSponsors ? (
              <div className="flex items-center justify-center py-12 sm:py-14 md:py-16">
                <div className="text-center px-4">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-orange-500 mx-auto mb-3 sm:mb-4"></div>
                    <Sparkles className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-500 animate-pulse" />
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base md:text-lg font-medium">Loading our amazing sponsors...</p>
                </div>
              </div>
            ) : sponsors.length > 0 ? (
              <div className="relative w-full overflow-hidden">
                {/* Gradient fade effects on sides */}
                <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-gray-50 via-orange-50 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-gray-50 via-amber-50 to-transparent z-10 pointer-events-none"></div>
                
                {/* Duplicate sponsors multiple times for smooth infinite scroll, especially on mobile */}
                {/* Minimum 6 copies to ensure smooth scrolling even with few sponsors */}
                <div 
                  className="flex gap-3 md:gap-6 lg:gap-8 animate-sponsor-scroll-mobile md:animate-sponsor-scroll whitespace-nowrap py-4" 
                  style={{ 
                    width: 'max-content',
                    display: 'flex',
                    flexWrap: 'nowrap',
                    willChange: 'transform'
                  }}
                >
                  {[...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors].map((sponsor, idx) => (
                    <div key={`sponsor-${idx}-${sponsor.id || sponsor.name}`} className="sponsor-card relative group flex-shrink-0" style={{
                      outline: 'none', 
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      MozUserSelect: 'none',
                      msUserSelect: 'none',
                      WebkitTapHighlightColor: 'transparent',
                      WebkitTouchCallout: 'none'
                    }}>
                      {/* Award badge for first sponsor in each set */}
                      {idx % sponsors.length === 0 && idx < sponsors.length && (
                        <div className="absolute -top-2 -right-2 z-20">
                          <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                            <Award className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                      
                      <div className="block w-24 h-16 md:w-32 md:h-20 flex items-center justify-center relative z-10 bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 border border-gray-100 group-hover:border-orange-200 px-2" style={{
                        outline: 'none',
                        WebkitTapHighlightColor: 'transparent',
                        minWidth: '96px'
                      }}>
                        <img
                          src={sponsor.logoUrl}
                          alt={`${sponsor.name} logo`}
                          className="sponsor-logo group-hover:scale-110 transition-transform duration-300 max-w-full max-h-full object-contain"
                          draggable="false"
                          style={{
                            outline: 'none', 
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            MozUserSelect: 'none',
                            msUserSelect: 'none',
                            WebkitTapHighlightColor: 'transparent',
                            WebkitTouchCallout: 'none',
                            border: 'none',
                            boxShadow: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            appearance: 'none',
                            pointerEvents: 'none',
                            width: 'auto',
                            height: 'auto',
                            maxWidth: '100%',
                            maxHeight: '100%'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.nextElementSibling;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-full h-full items-center justify-center text-gray-400 text-xs md:text-sm font-medium text-center px-1">
                          {sponsor.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 sm:py-14 md:py-16 px-4">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-100 rounded-full mb-3 sm:mb-4">
                  <Building2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-1 sm:mb-2">No sponsors available at the moment.</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">Check back soon for updates!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-12 sm:py-16 md:py-20">
        <div className="container-custom text-center px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6 px-2">
            Join Our Community Today
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-7 md:mb-8 max-w-2xl mx-auto leading-relaxed px-2 sm:px-4">
            Whether you want to volunteer, attend events, or support our mission, 
            there's a place for you in the Beats of Washington family.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/get-involved" className="btn-secondary text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 inline-flex items-center justify-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              Get Involved
            </Link>
            <Link to="/donate" className="btn-outline text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 border-white text-white hover:bg-white hover:text-primary-600 inline-flex items-center justify-center">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              Make a Donation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage; 