import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  Music, 
  Award, 
  ArrowRight,
  Star,
  CheckCircle
} from 'lucide-react';
import api from '../config/api';
import HeroSection from '../components/common/HeroSection';
import { useCelebration } from '../contexts/CelebrationContext';

const AboutPage = () => {
  const [missionMedia, setMissionMedia] = useState({
    mediaType: 'image',
    mediaUrl: '',
    thumbnailUrl: '',
    title: '',
    description: '',
    altText: '',
    isActive: true,
    overlayOpacity: 0.2,
    missionTitle: '',
    missionDescription: '',
    missionLegacy: ''
  });
  const [loadingMission, setLoadingMission] = useState(true);
  const [founderMedia, setFounderMedia] = useState({
    mediaType: 'image',
    mediaUrl: '',
    thumbnailUrl: '',
    title: '',
    description: '',
    altText: '',
    isActive: true,
    overlayOpacity: 0.1
  });
  const [loadingFounder, setLoadingFounder] = useState(true);
  
  // New state for dynamic content
  const [aboutPageContent, setAboutPageContent] = useState({
    storyTitle: 'Our Story',
    storySubtitle: 'From humble beginnings to a statewide movement, here\'s how BOW has grown and evolved over the years.',
    foundingYear: '2019',
    foundingTitle: 'Founded in 2019',
    foundingDescription: 'Beats of Washington was founded by Anand Sane and Deepali Sane, visionary community leaders who recognized the power of music to bring people together. What started as a small neighborhood drum circle has grown into one of Washington State\'s most impactful community organizations.',
    founderBelief: 'Our founders believed that music transcends barriers of language, culture, and background, creating opportunities for genuine connection and understanding between diverse communities.',
    todayVision: 'Today, we continue to honor that vision while adapting to meet the evolving needs of our communities through innovative programming and partnerships.',
    logo: '', // New logo field
    achievements: [
      {
        year: '2019',
        title: 'Foundation Established',
        description: 'BOW was founded with a vision of community building through music.'
      },
      {
        year: '2020',
        title: 'First Community Event',
        description: 'Successfully organized our first major community music festival.'
      },
      {
        year: '2021',
        title: 'Statewide Expansion',
        description: 'Extended programs to multiple cities across Washington State.'
      },
      {
        year: '2022',
        title: 'Cultural Partnerships',
        description: 'Formed partnerships with diverse cultural organizations.'
      },
      {
        year: '2023',
        title: 'Digital Innovation',
        description: 'Launched online programs and virtual community events.'
      },
      {
        year: '2024',
        title: 'Community Impact',
        description: 'Reached over 50,000 community members across the state.'
      }
    ],
    isActive: true
  });
  const [founderContent, setFounderContent] = useState({
    sectionTitle: 'Our Founders',
    sectionSubtitle: 'Meet the visionary leaders who founded Beats of Washington and continue to guide our mission of empowering communities through music.',
    aandSane: {
      name: 'Anand Sane',
      role: 'Board Chair & Co-Founder',
      partnership: 'Partnering with Deepali Sane',
      description: 'Anand Sane & Deepali Sane are the visionary co-founders of Beats of Washington, whose shared passion for community building through music has inspired thousands across Washington State. As Board Chair, Anand continues to lead our organization with dedication and innovative thinking, working closely with Deepali to guide our mission together.',
      traits: ['Visionary Leader', 'Community Builder'],
      avatar: 'A',
      isActive: true
    },
    deepaliSane: {
      name: 'Deepali Sane',
      role: 'Co-Founder & Strategic Director',
      description: 'Deepali Sane brings her strategic vision and cultural expertise to BOW, working alongside Aand to create meaningful community connections through music and cultural exchange.',
      traits: ['Strategic Vision', 'Cultural Expert'],
      isActive: true
    },
    isActive: true
  });
  const [loadingAboutContent, setLoadingAboutContent] = useState(true);
  const [loadingFounderContent, setLoadingFounderContent] = useState(true);
  const { triggerConfetti } = useCelebration();
  const [isLogoSpinning, setIsLogoSpinning] = useState(false);
  
  // Scroll animation states
  const [isStoryVisible, setIsStoryVisible] = useState(false);
  const [isTimelineVisible, setIsTimelineVisible] = useState(false);
  const storyRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    fetchMissionMedia();
    fetchFounderMedia();
    fetchAboutPageContent();
    fetchFounderContent();
    
    // Refresh founder media every 30 seconds to catch updates
    const interval = setInterval(() => {
      fetchFounderMedia();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Scroll-triggered animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const storyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsStoryVisible(true);
        }
      });
    }, observerOptions);

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsTimelineVisible(true);
        }
      });
    }, observerOptions);

    if (storyRef.current) {
      storyObserver.observe(storyRef.current);
    }
    if (timelineRef.current) {
      timelineObserver.observe(timelineRef.current);
    }

    return () => {
      if (storyRef.current) {
        storyObserver.unobserve(storyRef.current);
      }
      if (timelineRef.current) {
        timelineObserver.unobserve(timelineRef.current);
      }
    };
  }, []);

  const fetchMissionMedia = async () => {
    try {
      setLoadingMission(true);
      const res = await api.get('/mission-media');
      if (res.ok) {
        const data = await res.json();
        // Ensure overlayOpacity has a valid default value
        const missionMediaWithDefaults = {
          ...data,
          overlayOpacity: data.overlayOpacity !== undefined && !isNaN(data.overlayOpacity) ? data.overlayOpacity : 0.2
        };
        
        setMissionMedia(missionMediaWithDefaults);
        console.log('✅ Mission media loaded:', missionMediaWithDefaults);
        console.log('🎯 Mission content check:');
        console.log('  - Title:', missionMediaWithDefaults.missionTitle);
        console.log('  - Description:', missionMediaWithDefaults.missionDescription);
        console.log('  - Legacy:', missionMediaWithDefaults.missionLegacy);
        
        // Debug: Check if content fields are empty
        if (!missionMediaWithDefaults.missionTitle && !missionMediaWithDefaults.missionDescription && !missionMediaWithDefaults.missionLegacy) {
          console.log('⚠️  WARNING: All mission content fields are empty!');
          console.log('📋 Full data received:', data);
        }
      } else {
        console.error('Failed to fetch mission media');
      }
    } catch (error) {
      console.error('Error fetching mission media:', error);
    } finally {
      setLoadingMission(false);
    }
  };

  const fetchFounderMedia = async () => {
    try {
      setLoadingFounder(true);
      const res = await api.get('founder-media');
      if (res.ok) {
        const data = await res.json();
        console.log('📡 Founder media response:', data);
        console.log('🔍 Checking media display conditions:');
        console.log('  - mediaUrl:', data.mediaUrl);
        console.log('  - isActive:', data.isActive);
        console.log('  - mediaType:', data.mediaType);
        console.log('  - Will display media:', !!(data.mediaUrl && data.isActive));
        setFounderMedia(data);
        console.log('✅ Founder media loaded:', data);
      } else {
        console.error('Failed to fetch founder media');
      }
    } catch (error) {
      console.error('Error fetching founder media:', error);
    } finally {
      setLoadingFounder(false);
    }
  };

  const fetchAboutPageContent = async () => {
    try {
      setLoadingAboutContent(true);
      const res = await api.get('/about-page');
      if (res.ok) {
        const data = await res.json();
        console.log('✅ About page content loaded:', data);
        console.log('🔍 Logo field value:', data.logo);
        setAboutPageContent(data);
      }
    } catch (error) {
      console.error('Error fetching about page content:', error);
    } finally {
      setLoadingAboutContent(false);
    }
  };

  const fetchFounderContent = async () => {
    try {
      setLoadingFounderContent(true);
      const res = await api.get('/founder-content');
      if (res.ok) {
        const data = await res.json();
        setFounderContent(data);
        console.log('✅ Founder content loaded:', data);
      }
    } catch (error) {
      console.error('Error fetching founder content:', error);
    } finally {
      setLoadingFounderContent(false);
    }
  };


  const boardMembers = [
    {
      name: "Anand Sane",
      role: "Board Chair",
      organization: "Beats of Washington Founder"
    },
    {
      name: "Deepali Sane",
      role: "Vice Chair",
      organization: "Beats of Washington Founder"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Community First",
      description: "We prioritize the needs and voices of our community members in everything we do."
    },
    {
      icon: Users,
      title: "Inclusivity",
      description: "We create welcoming spaces where everyone feels valued and represented."
    },
    {
      icon: Music,
      title: "Cultural Celebration",
      description: "We honor and celebrate the diverse musical traditions that enrich our community."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain high standards in our programs and services to ensure meaningful impact."
    }
  ];



  return (
    <>
      <Helmet>
        <title>About Us - Beats of Washington</title>
        <meta name="description" content="Learn about Beats of Washington's mission, history, leadership team, and our commitment to empowering communities through music and culture." />
      </Helmet>

      {/* Hero Section */}
      <HeroSection
        title={
          <>
            About <span className="text-secondary-300">Beats of Washington</span>
          </>
        }
        description="Empowering communities through music, culture, and connection since 2019."
        badge="🎵 Welcome to Our Story 🎵"
        logoUrl={aboutPageContent.logo}
        showLogo={true}
        floatingElements={[
          { icon: Heart, position: 'top-10 left-10', animation: 'animate-float-slow' },
          { icon: Music, position: 'top-20 right-32', animation: 'animate-float-slow-reverse' },
          { icon: Users, position: 'bottom-20 left-32', animation: 'animate-float-slow' },
          { icon: Star, position: 'bottom-32 right-10', animation: 'animate-float-slow-reverse' }
        ]}
        interactiveElements={[
          { icon: Heart, label: 'Community', color: 'text-red-300' },
          { icon: Music, label: 'Music', color: 'text-yellow-300' },
          { icon: Users, label: 'Connection', color: 'text-blue-300' }
        ]}
      />

      {/* Mission Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-white via-blue-50 to-indigo-50 relative overflow-hidden">                                                
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full blur-3xl floating-bg hidden md:block"></div>       
          <div className="absolute bottom-20 left-20 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-gradient-to-r from-secondary-200 to-primary-200 rounded-full blur-2xl floating-bg hidden sm:block" style={{animationDelay: '2s'}}></div>                                                      
        </div>

        <div className="container-custom relative z-10 px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            <div className="animate-fade-in-up order-1 lg:order-1">
              <div className="inline-block mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg overflow-hidden">                                                             
                  {aboutPageContent.logo ? (
                    <img
                      src={aboutPageContent.logo}
                      alt="BOW Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                  )}
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 animate-fade-in-up px-2" style={{animationDelay: '0.2s'}}>                                        
                {missionMedia.missionTitle}
              </h2>
              <p className="text-base sm:text-lg text-black mb-4 sm:mb-5 md:mb-6 leading-relaxed font-semibold animate-fade-in-up px-2" style={{animationDelay: '0.4s'}}>                         
                {missionMedia.missionDescription}
              </p>
              <p className="text-base sm:text-lg text-primary-600 mb-4 sm:mb-5 md:mb-6 leading-relaxed italic animate-fade-in-up px-2" style={{animationDelay: '0.6s'}}>                          
                {missionMedia.missionLegacy}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up px-2" style={{animationDelay: '0.8s'}}>                                             
                <Link to="/get-involved" className="btn-primary text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center">                         
                  Get Involved
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
                <Link to="/donate" className="btn-outline text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center">                               
                  Support Our Mission
                </Link>
              </div>
            </div>
            <div className="relative animate-fade-in-up order-2 lg:order-2" style={{animationDelay: '0.3s'}}>                                                                      
              {loadingMission ? (
                <div className="w-full h-48 sm:h-64 md:h-80 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl sm:rounded-2xl shadow-2xl flex items-center justify-center transform transition-all duration-500 hover:scale-105">                                         
                  <div className="text-center px-4">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-primary-600 mx-auto mb-3 sm:mb-4"></div>                                      
                    <p className="text-sm sm:text-base text-gray-600">Loading mission media...</p>   
                  </div>
                </div>
              ) : missionMedia.mediaUrl && missionMedia.isActive ? (
                <div className="relative transform transition-all duration-500 hover:scale-105 hover:shadow-3xl" key={`mission-media-${missionMedia.overlayOpacity}`}>                                                                          
                  {missionMedia.mediaType === 'image' ? (
                    <img
                      src={missionMedia.mediaUrl}
                      alt={missionMedia.altText}
                      className="rounded-xl sm:rounded-2xl shadow-2xl w-full h-48 sm:h-64 md:h-80 object-cover"                                                                               
                    />
                  ) : (
                    <video
                      src={missionMedia.mediaUrl}
                      controls
                      className="rounded-xl sm:rounded-2xl shadow-2xl w-full h-48 sm:h-64 md:h-80 object-cover bg-black"                                                                      
                    >
                      Sorry, your browser doesn't support embedded videos.
                    </video>
                  )}
                  {/* Dynamic overlay based on mission media settings */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl pointer-events-none"
                    style={{ opacity: missionMedia.overlayOpacity || 0.2 }}
                  ></div>
                  
                  {/* Floating elements overlay */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Star className="w-3 h-3 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-secondary-400 rounded-full flex items-center justify-center shadow-lg animate-pulse" style={{animationDelay: '1s'}}>
                    <Heart className="w-2 h-2 text-white" />
                  </div>
                </div>
              ) : (
                <div className="w-full h-48 sm:h-64 md:h-80 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl sm:rounded-2xl shadow-2xl flex items-center justify-center transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">                
                  <div className="text-center text-primary-600 px-4">
                    <div className="relative">
                      <Music className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 animate-bounce" />                                                                               
                      <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full animate-ping"></div>                                          
                    </div>
                    <p className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Mission Media</p>      
                    <p className="text-xs sm:text-sm">Upload image or video from admin panel</p>                                                                           
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 via-primary-50/30 to-secondary-50/30 relative overflow-hidden">                                  
        {/* Background Effects - Always Visible */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-10 left-10 w-36 h-36 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse hidden md:block"></div>                 
          <div className="absolute top-40 right-10 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse hidden md:block" style={{animationDelay: '2s'}}></div>                                                               
          <div className="absolute -bottom-8 left-1/2 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse hidden md:block" style={{animationDelay: '4s'}}></div>                                                               
        </div>

        <div className="container-custom relative z-10 px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <div className="inline-block">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent mb-4 sm:mb-5 md:mb-6 animate-fade-in-up px-2">                                                                      
                Our Values
              </h2>
              <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full animate-scale-in"></div>                         
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mt-6 sm:mt-7 md:mt-8 leading-relaxed animate-fade-in-up px-4" style={{animationDelay: '0.2s'}}>                    
              These core values guide everything we do and shape our approach to community building.                                                            
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 text-center transform transition-all duration-500 hover:-translate-y-4 hover:scale-105 hover:shadow-3xl animate-fade-in-up animate-values-card"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationFillMode: 'both'
                }}
              >
                {/* Card Background Effects - Always Visible */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 rounded-2xl sm:rounded-3xl opacity-60 animate-values-glow"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-100/20 to-secondary-100/20 rounded-2xl sm:rounded-3xl opacity-40 animate-values-shimmer"></div>
                
                {/* Floating Particles Effect - Always Visible, smaller on mobile */}
                <div className="absolute top-4 right-4 w-1 h-1 sm:w-2 sm:h-2 md:w-2 md:h-2 bg-primary-400 rounded-full opacity-60 sm:opacity-80 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="absolute top-8 right-8 w-1 h-1 sm:w-1 sm:h-1 bg-secondary-400 rounded-full opacity-60 sm:opacity-80 animate-bounce" style={{animationDelay: '0.3s'}}></div>
                <div className="absolute bottom-6 left-6 w-1 h-1 sm:w-2 sm:h-2 bg-orange-400 rounded-full opacity-60 sm:opacity-80 animate-bounce" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-4 right-8 w-1 h-1 sm:w-1 sm:h-1 bg-green-400 rounded-full opacity-50 sm:opacity-70 animate-bounce" style={{animationDelay: '0.7s'}}></div>
                <div className="absolute top-12 left-4 w-1 h-1 sm:w-2 sm:h-2 bg-purple-400 rounded-full opacity-55 sm:opacity-75 animate-bounce" style={{animationDelay: '0.9s'}}></div>

                <div className="relative z-10">
                  <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
                    <div className="relative">
                      {/* Icon Container with Multiple Effects - Always Visible */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20 bg-gradient-to-br from-white to-primary-50 shadow-2xl rounded-full flex items-center justify-center border-2 sm:border-4 border-primary-100 animate-values-icon-container">
                        <value.icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-10 md:h-10 text-primary-600 animate-values-icon" />
                      </div>
                      
                      {/* Pulsing Ring Effect - Always Visible, smaller/subtle on mobile */}
                      <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20 border border-primary-200/40 sm:border-2 sm:border-primary-200 rounded-full opacity-30 sm:opacity-60 animate-ping"></div>
                      <div className="absolute inset-2 w-12 h-12 sm:w-16 sm:h-16 md:w-16 md:h-16 border border-secondary-200/40 sm:border-2 sm:border-secondary-200 rounded-full opacity-25 sm:opacity-50 animate-ping" style={{animationDelay: '0.2s'}}></div>
                      <div className="absolute inset-4 w-8 h-8 sm:w-12 sm:h-12 md:w-12 md:h-12 border border-orange-200/30 sm:border-orange-200 rounded-full opacity-20 sm:opacity-40 animate-ping" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-700 to-secondary-700 bg-clip-text text-transparent mb-3 sm:mb-4 tracking-tight animate-values-title">
                    {value.title}
                  </h3>
                  
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed animate-values-description px-2">
                    {value.description}
                  </p>
                </div>

                {/* Always Visible Border Effect */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-gradient-to-r from-primary-400 to-secondary-400 opacity-60 animate-values-border"></div>
              </div>
            ))}
          </div>

          {/* Bottom Decorative Element - Enhanced */}
          <div className="text-center mt-10 sm:mt-12 md:mt-16">
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 text-primary-600 animate-fade-in-up flex-wrap justify-center gap-1.5 sm:gap-2 px-2" style={{animationDelay: '0.8s'}}>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-secondary-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
              <span className="ml-1.5 sm:ml-2 md:ml-4 text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-600 animate-values-text break-words">Building Community Through Shared Values</span>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.8s'}}></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-secondary-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced History Section - Our Story */}
      <section ref={storyRef} className={`py-12 sm:py-16 md:py-20 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 relative overflow-hidden transition-all duration-1000 ${isStoryVisible ? 'animate-story-entrance' : 'opacity-0'}`}>                 
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-36 h-36 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full blur-3xl animate-float-slow hidden md:block"></div> 
          <div className="absolute bottom-20 right-20 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-gradient-to-r from-secondary-200 to-primary-200 rounded-full blur-3xl animate-float-slow-reverse hidden md:block" style={{animationDelay: '2s'}}></div>                                      
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-full blur-2xl animate-pulse hidden md:block" style={{animationDelay: '4s'}}></div>             
        </div>

        {/* Enhanced Floating Particles - Hidden on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">  
          <div className="absolute top-10 left-10 w-2 h-2 bg-primary-400 rounded-full animate-particle-float-enhanced" style={{animationDelay: '0.5s'}}></div>  
          <div className="absolute top-32 right-20 w-1.5 h-1.5 bg-secondary-400 rounded-full animate-particle-float-enhanced" style={{animationDelay: '1.5s'}}></div>                                                                           
          <div className="absolute bottom-40 left-32 w-2 h-2 bg-orange-400 rounded-full animate-particle-float-enhanced" style={{animationDelay: '2.5s'}}></div>
          <div className="absolute bottom-20 right-40 w-1 h-1 bg-green-400 rounded-full animate-particle-float-enhanced" style={{animationDelay: '3.5s'}}></div>
          <div className="absolute top-1/2 right-10 w-1.5 h-1.5 bg-purple-400 rounded-full animate-particle-float-enhanced" style={{animationDelay: '4.5s'}}></div>                                                                             
          <div className="absolute top-20 left-1/2 w-1 h-1 bg-pink-400 rounded-full animate-particle-float-enhanced" style={{animationDelay: '5.5s'}}></div>    
          <div className="absolute bottom-32 left-10 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-particle-float-enhanced" style={{animationDelay: '6.5s'}}></div>                                                                              
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-particle-float-enhanced" style={{animationDelay: '7.5s'}}></div>
        </div>

        <div className="container-custom relative z-10 px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <div className="inline-block mb-6 sm:mb-8">
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent mb-4 sm:mb-5 md:mb-6 animate-fade-in-up px-2">                                                                    
                  {aboutPageContent.storyTitle}
                </h2>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 h-0.5 sm:h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-scale-in"></div>                                                        
              </div>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed animate-fade-in-up px-4" style={{animationDelay: '0.2s'}}>                         
              {aboutPageContent.storySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-start">
            {/* Enhanced Founding Story */}
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-all duration-700 transform group-hover:scale-105"></div>
              
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl border border-white/20 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl">                                            
                {/* Decorative Border */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-gradient-to-r from-primary-400 to-secondary-400 opacity-20"></div>                 

                {/* Floating Elements - Hidden on mobile */}
                <div className="absolute -top-3 -right-3 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg animate-pulse hidden sm:block">                                                         
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="absolute -bottom-3 -left-3 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg animate-pulse hidden sm:block" style={{animationDelay: '1s'}}>                           
                  <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center mb-4 sm:mb-6 md:mb-8">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 md:mr-6 shadow-xl overflow-hidden flex-shrink-0">                                                                
                      {aboutPageContent.logo ? (
                        <img
                          src={aboutPageContent.logo}
                          alt="BOW Logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Music className="w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8 text-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-700 to-secondary-700 bg-clip-text text-transparent mb-1 sm:mb-2 break-words">                 
                        {aboutPageContent.foundingTitle}
                      </h3>
                      <div className="w-16 sm:w-20 md:w-20 h-0.5 sm:h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>                                          
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-5 md:space-y-6">
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed font-medium animate-fade-in-up break-words" style={{animationDelay: '0.3s'}}>                       
                      {aboutPageContent.foundingDescription}
                    </p>
                    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border-l-4 border-primary-400 animate-fade-in-up" style={{animationDelay: '0.4s'}}>                                                        
                      <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed italic break-words">                                                                              
                        {aboutPageContent.founderBelief}
                      </p>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed animate-fade-in-up break-words" style={{animationDelay: '0.5s'}}>                                   
                      {aboutPageContent.todayVision}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Timeline with Scroll Animations */}
            <div ref={timelineRef} className={`relative transition-all duration-1000 ${isTimelineVisible ? 'animate-story-entrance' : 'opacity-0'}`}>           
              {/* Animated Timeline Line */}
              <div className="absolute left-4 sm:left-6 md:left-8 top-0 w-0.5 sm:w-1 bg-gradient-to-b from-primary-400 via-secondary-400 to-primary-400 rounded-full animate-draw-line"></div>                                                                               

              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {aboutPageContent.achievements.map((achievement, index) => (    
                  <div
                    key={index}
                    className="relative group animate-stagger-fade-in"
                    style={{animationDelay: `${0.6 + index * 0.15}s`}}
                  >
                    {/* Enhanced Timeline Dot */}
                    <div className="absolute left-3 sm:left-5 md:left-6 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full shadow-lg z-10 group-hover:scale-125 transition-transform duration-300 animate-timeline-pulse">                     
                      <div className="absolute inset-0 bg-white rounded-full scale-50"></div>                                                                   
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-300 to-secondary-300 rounded-full scale-75 opacity-60 animate-ping hidden sm:block"></div> 
                    </div>

                    {/* Achievement Card with Enhanced Effects */}
                    <div className="ml-10 sm:ml-14 md:ml-16 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-xl sm:rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500 transform group-hover:scale-105"></div>              

                      <div className="relative bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 border border-white/20 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group-hover:border-primary-200 animate-card-glow">                                                                     
                        {/* Year Badge with Enhanced Animation */}
                        <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white font-bold text-xs sm:text-sm">{achievement.year}</span>                                                              
                          <div className="absolute inset-0 bg-gradient-to-r from-primary-300 to-secondary-300 rounded-full scale-75 opacity-60 animate-ping hidden sm:block"></div>                                                                             
                        </div>

                        {/* Content with Shimmer Effect */}
                        <div className="pr-10 sm:pr-12 md:pr-16 relative overflow-hidden">
                          <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3 group-hover:text-primary-700 transition-colors duration-300 break-words">                                                                             
                            <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">                                      
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 text-white" />    
                            </div>
                            <span className="break-words">{achievement.title}</span>
                          </h4>
                          <p className="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 break-words">                                
                            {achievement.description}
                          </p>

                          {/* Shimmer Effect on Hover */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 animate-shimmer"></div>                                                                               
                        </div>

                        {/* Enhanced Hover Effect Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/50 to-secondary-50/50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>                                           

                        {/* Corner Accent - Hidden on mobile */}
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block"></div>                                
                        <div className="absolute bottom-2 left-2 w-1 h-1 bg-gradient-to-r from-secondary-400 to-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block"></div>                              
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Decorative Element */}
          <div className="text-center mt-12 sm:mt-16 md:mt-20">
            <div className="inline-flex items-center space-x-2 sm:space-x-3 text-primary-600 animate-fade-in-up flex-wrap justify-center gap-2 px-2" style={{animationDelay: '1s'}}>                             
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-primary-500 rounded-full animate-pulse"></div>                                                                         
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-secondary-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>                                      
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>                                         
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>                                          
              <span className="ml-2 sm:ml-4 md:ml-6 text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-700 break-words">Our Journey Continues</span>                                                           
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.8s'}}></div>                                          
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>                                         
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-secondary-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>                                      
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-primary-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>                                        
            </div>
          </div>
        </div>
      </section>



      {/* Founders Section */}
      <section id="founders" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-white via-blue-50 to-indigo-50 relative overflow-hidden">                                  
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-primary-200 rounded-full blur-3xl floating-bg hidden sm:block"></div>                                            
          <div className="absolute bottom-10 right-10 w-30 h-30 sm:w-40 sm:h-40 bg-secondary-200 rounded-full blur-3xl floating-bg hidden sm:block" style={{animationDelay: '2s'}}></div>       
          <div className="absolute top-1/2 left-1/4 w-20 h-20 sm:w-24 sm:h-24 bg-blue-200 rounded-full blur-2xl floating-bg hidden md:block" style={{animationDelay: '4s'}}></div>              
        </div>

        <div className="container-custom relative z-10 px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <div className="inline-block mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg pulse-glow overflow-hidden">                                                    
                {aboutPageContent.logo ? (
                  <img
                    src={aboutPageContent.logo}
                    alt="BOW Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Star className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                )}
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4 sm:mb-5 md:mb-6 px-2">                           
              {founderContent.sectionTitle}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">                                                                             
              {founderContent.sectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16">
            {/* Anand Sane */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"></div>                     
              <div className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl border border-gray-100 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl founder-card">                                                   
                <div className="text-center mb-6 sm:mb-8">
                  <div className="relative mb-4 sm:mb-5 md:mb-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto shadow-2xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 founder-avatar">                                                        
                      <span className="text-white font-bold text-2xl sm:text-3xl md:text-3xl">A</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">                    
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors duration-300 break-words px-2">                            
                    {founderContent.aandSane.name}
                  </h3>
                  <p className="text-primary-600 font-semibold text-base sm:text-lg md:text-xl mb-4 sm:mb-5 md:mb-6 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent break-words px-2">  
                    {founderContent.aandSane.role}
                  </p>
                  <p className="text-secondary-600 font-medium text-sm sm:text-base md:text-lg mb-3 sm:mb-4 break-words px-2">   
                    {founderContent.aandSane.partnership}
                  </p>
                </div>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed text-center group-hover:text-gray-800 transition-colors duration-300 break-words px-2">                      
                  {founderContent.aandSane.description}
                </p>
                <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
                  {founderContent.aandSane.traits.map((trait, index) => (       
                    <div key={index} className="flex items-center space-x-1.5 sm:space-x-2 text-primary-600">                                                                  
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium break-words">{trait}</span>      
                    </div>
                  ))}
                </div>
              </div>
            </div>

                         {/* Deepali Sane - Media Placeholder */}
             <div className="group relative">
               <div className="absolute inset-0 bg-gradient-to-r from-secondary-400 to-primary-400 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"></div>                    
               <div className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl border border-gray-100 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl founder-card">                                                  
                 {/* Media Display */}
                  {loadingFounder ? (
                    <div className="w-full h-64 sm:h-80 md:h-96 bg-gradient-to-br from-secondary-100 to-primary-100 rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center mb-4 sm:mb-5 md:mb-6">                                                                               
                      <div className="text-center text-secondary-600 px-4">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 md:h-8 md:w-8 border-b-2 border-secondary-600 mx-auto mb-2 sm:mb-3"></div>                                  
                        <p className="text-xs sm:text-sm font-medium">Loading media...</p> 
                      </div>
                    </div>
                  ) : founderMedia.mediaUrl && founderMedia.isActive ? (        
                    <div className="relative w-full h-64 sm:h-80 md:h-96 mb-4 sm:mb-5 md:mb-6">
                      {founderMedia.mediaType === 'image' ? (
                        <img
                          src={founderMedia.mediaUrl}
                          alt={founderMedia.altText || 'Deepali Sane'}
                          className="w-full h-full object-cover rounded-xl sm:rounded-2xl shadow-lg"                                                                          
                        />
                      ) : (
                        <video
                          src={founderMedia.mediaUrl}
                          controls
                          className="w-full h-full object-cover rounded-xl sm:rounded-2xl shadow-lg bg-black"                                                                 
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                      {/* Dynamic overlay based on founder media settings */}   
                      <div
                        className="absolute inset-0 bg-secondary-600 rounded-xl sm:rounded-2xl pointer-events-none"                                                           
                        style={{ opacity: founderMedia.overlayOpacity || 0.1 }} 
                      ></div>
                    </div>
                  ) : (
                    <div className="w-full h-64 sm:h-80 md:h-96 bg-gradient-to-br from-secondary-100 to-primary-100 rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center mb-4 sm:mb-5 md:mb-6">                                                                               
                      <div className="text-center text-secondary-600 px-4">
                        <Music className="w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20 mx-auto mb-4 sm:mb-5 md:mb-6" />
                        <p className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">Deepali Sane Media</p>                                                                             
                        <p className="text-xs sm:text-sm md:text-base text-gray-500">Upload photo/video from admin panel</p>                                                          
                      </div>
                    </div>
                  )}

                 <div className="mt-4 sm:mt-5 md:mt-6 flex flex-wrap justify-center gap-3 sm:gap-4">
                   {founderContent.deepaliSane.traits.map((trait, index) => (   
                     <div key={index} className="flex items-center space-x-1.5 sm:space-x-2 text-secondary-600">                                                               
                       <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                       <span className="text-xs sm:text-sm font-medium break-words">{trait}</span>     
                     </div>
                   ))}
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      

      {/* 501(c)(3) Status Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-transparent relative overflow-hidden">       
        <div className="container-custom px-4 sm:px-6">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl overflow-hidden">                               
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
                501(c)(3) Non-Profit Status
              </h2>
              <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-white/95 px-4">
                Beats of Washington is a registered 501(c)(3) non-profit organization,                                                                          
                ensuring transparency and accountability in all our operations. 
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">                                              
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Tax Exempt</h3>      
                <p className="text-sm sm:text-base text-white/90 px-2">
                  All donations are tax-deductible to the extent allowed by law.
                </p>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogoSpinning(true);
                    try { triggerConfetti(); } catch (e) {}
                    setTimeout(() => setIsLogoSpinning(false), 1200);
                  }}
                  aria-label="Celebrate BOW 501(c)(3)"
                  className={`w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 overflow-hidden cursor-pointer transition-transform duration-300 ${isLogoSpinning ? 'animate-spin' : ''}`}                       
                >
                  {aboutPageContent.logo ? (
                    <img
                      src={aboutPageContent.logo}
                      alt="BOW Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center">                                                   
                      <span className="text-white font-bold text-3xl sm:text-4xl md:text-4xl">B</span>  
                    </div>
                  )}
                </button>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">                                              
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Accountable</h3>     
                <p className="text-sm sm:text-base text-white/90 px-2">
                  Governed by a volunteer board of directors from the community.
                </p>
              </div>
            </div>

            <div className="mt-8 sm:mt-10 md:mt-12 text-center">
              <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 text-white/95 px-4 break-words">
                <strong>EIN:</strong> 84-4396168 | <strong>Founded:</strong> 2019                                                                               
              </p>
              <Link to="/donate" className="btn-secondary text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 inline-flex items-center justify-center">
                Make a Donation
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Link>

              {/* Compact "Feel the Beat" band (white variant) */}
              <div className="mt-6 sm:mt-8 md:mt-10">
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/30 bg-white/10">
                  {/* local keyframes fallback */}
                  <style>{`
                    @keyframes waveHeightMini { 0%{transform:scaleY(0.3)} 50%{transform:scaleY(1)} 100%{transform:scaleY(0.3)} }
                    @keyframes floatYMini { 0%{transform:translateY(0)} 50%{transform:translateY(-6px)} 100%{transform:translateY(0)} }
                  `}</style>
                  {/* Floating icons - Hidden on mobile */}
                  <div className="absolute left-2 sm:left-3 top-2 sm:top-3 text-xl sm:text-2xl select-none hidden sm:block" style={{ animation: 'floatYMini 3s ease-in-out infinite' }}>🥁</div>
                  <div className="absolute right-3 sm:right-4 bottom-2 sm:bottom-3 text-xl sm:text-2xl select-none hidden sm:block" style={{ animation: 'floatYMini 3.2s ease-in-out infinite', animationDelay: '0.4s' }}>🪘</div>

                  <div className="px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6 text-center">
                    <h4 className="text-white font-bold text-sm sm:text-base md:text-lg tracking-tight drop-shadow-sm break-words">Feel the Beat · Dhol & Tasha</h4>
                    <p className="text-white/80 text-xs mt-1 mb-3 sm:mb-4 break-words">A subtle rhythm celebrating our cultural heartbeat</p>
                  </div>
                  <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 overflow-x-auto">
                    <div className="mx-auto max-w-4xl h-12 sm:h-14 md:h-16 flex items-end gap-[2px] sm:gap-[3px] justify-center">
                      {Array.from({ length: 96 }).map((_, i) => {
                        const delay = (i % 8) * 0.1;
                        const width = i % 5 === 0 ? 3 : 2;
                        const base = 8 + (i % 7);
                        const shades = ['bg-white/90','bg-white/70','bg-white/60'];
                        return (
                          <div
                            key={`mini-beat-${i}`}
                            className={`origin-bottom rounded-full ${shades[i % shades.length]}`}
                            style={{
                              width: `${width}px`,
                              height: `${base}px`,
                              animation: `waveHeightMini 1.7s ease-in-out ${delay}s infinite`,
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-10 sm:pt-12 pb-16 sm:pb-20 bg-gray-50">
        <div className="container-custom text-center px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 px-2">
            Join Our Mission
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-7 md:mb-8 max-w-2xl mx-auto px-4">
            Whether you want to volunteer, attend events, or support our work financially, 
            there are many ways to get involved with Beats of Washington.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/get-involved" className="btn-primary text-sm sm:text-base md:text-lg px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 md:py-4 inline-flex items-center justify-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage; 