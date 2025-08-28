import React, { useState, useEffect } from 'react';
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
    foundingDescription: 'Beats of Washington was founded by Aand Sane and Deepali Sane, visionary community leaders who recognized the power of music to bring people together. What started as a small neighborhood drum circle has grown into one of Washington State\'s most impactful community organizations.',
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
      name: 'Aand Sane',
      role: 'Board Chair & Co-Founder',
      partnership: 'Partnering with Deepali Sane',
      description: 'Aand Sane & Deepali Sane are the visionary co-founders of Beats of Washington, whose shared passion for community building through music has inspired thousands across Washington State. As Board Chair, Aand continues to lead our organization with dedication and innovative thinking, working closely with Deepali to guide our mission together.',
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
      name: "Aand Sane",
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
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-white to-yellow-200 rounded-full blur-3xl floating-bg"></div>
          <div className="absolute bottom-20 left-20 w-56 h-56 bg-gradient-to-r from-yellow-200 to-white rounded-full blur-2xl floating-bg" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-white to-orange-200 rounded-full blur-3xl floating-bg opacity-30" style={{animationDelay: '4s'}}></div>
        </div>
        
        {/* Floating about elements */}
        <div className="absolute top-10 left-10 text-white/20 animate-float-slow">
          <Heart className="w-8 h-8" />
        </div>
        <div className="absolute top-20 right-32 text-white/20 animate-float-slow-reverse">
          <Music className="w-6 h-6" />
        </div>
        <div className="absolute bottom-20 left-32 text-white/20 animate-float-slow">
          <Users className="w-7 h-7" />
        </div>
        <div className="absolute bottom-32 right-10 text-white/20 animate-float-slow-reverse">
          <Star className="w-6 h-6" />
        </div>
        
        <div className="container-custom text-center relative z-10">
          {/* Welcome badge */}
          <div className="mb-6 animate-fade-in">
            <span className="inline-block bg-white/10 backdrop-blur-sm text-white text-xs font-semibold px-6 py-3 rounded-full tracking-widest uppercase shadow-lg border border-white/20">
              🎵 Welcome to Our Story 🎵
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-6 font-display tracking-tight animate-fade-in-up text-glow-hero">
            About <span className="text-secondary-300">Beats of Washington</span>
          </h1>
          
          <p className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed text-primary-100 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            Empowering communities through <span className="text-secondary-200 font-semibold">music</span>, <span className="text-secondary-200 font-semibold">culture</span>, and <span className="text-secondary-200 font-semibold">connection</span> since 2019.
          </p>
          
          {/* Interactive elements */}
          <div className="mt-8 flex justify-center space-x-4 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Heart className="w-5 h-5 text-red-300" />
              <span className="text-sm font-medium">Community</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Music className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-medium">Music</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Users className="w-5 h-5 text-blue-300" />
              <span className="text-sm font-medium">Connection</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full blur-3xl floating-bg"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-r from-secondary-200 to-primary-200 rounded-full blur-2xl floating-bg" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-block mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
                  {aboutPageContent.logo ? (
                    <img 
                      src={aboutPageContent.logo} 
                      alt="BOW Logo" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                {missionMedia.missionTitle}
              </h2>
              <p className="text-lg text-black mb-6 leading-relaxed font-semibold animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                {missionMedia.missionDescription}
              </p>
              <p className="text-lg text-primary-600 mb-6 leading-relaxed italic animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                {missionMedia.missionLegacy}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
                <Link to="/get-involved" className="btn-primary transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  Get Involved
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/donate" className="btn-outline transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  Support Our Mission
                </Link>
              </div>
            </div>
            <div className="relative animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              {loadingMission ? (
                <div className="w-full h-80 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-2xl flex items-center justify-center transform transition-all duration-500 hover:scale-105">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading mission media...</p>
                  </div>
                </div>
              ) : missionMedia.mediaUrl && missionMedia.isActive ? (
                <div className="relative transform transition-all duration-500 hover:scale-105 hover:shadow-3xl" key={`mission-media-${missionMedia.overlayOpacity}`}>
                  {missionMedia.mediaType === 'image' ? (
                    <img
                      src={missionMedia.mediaUrl}
                      alt={missionMedia.altText}
                      className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                    />
                  ) : (
                    <video
                      src={missionMedia.mediaUrl}
                      controls
                      className="rounded-2xl shadow-2xl w-full h-80 object-cover bg-black"
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
                <div className="w-full h-80 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl shadow-2xl flex items-center justify-center transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                  <div className="text-center text-primary-600">
                    <div className="relative">
                      <Music className="w-16 h-16 mx-auto mb-4 animate-bounce" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                    </div>
                    <p className="text-lg font-semibold">Mission Media</p>
                    <p className="text-sm">Upload image or video from admin panel</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape our approach to community building.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl shadow-xl p-8 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-fade-in"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-white shadow-lg rounded-full flex items-center justify-center border-4 border-primary-100 group-hover:border-secondary-300 transition-all">
                    <value.icon className="w-8 h-8 text-primary-600 group-hover:text-secondary-600 transition-colors" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-primary-700 mb-3 tracking-tight group-hover:text-secondary-700 transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {aboutPageContent.storyTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {aboutPageContent.storySubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 shadow-xl animate-fade-in">
            <div className="border-l-4 border-primary-400 pl-8 bg-white/80 rounded-2xl shadow p-6">
              <h3 className="text-2xl font-bold text-primary-700 mb-6">{aboutPageContent.foundingTitle}</h3>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {aboutPageContent.foundingDescription}
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">{aboutPageContent.founderBelief}</p>
              <p className="text-lg text-gray-700 leading-relaxed">{aboutPageContent.todayVision}</p>
            </div>
            <div className="space-y-6">
              {aboutPageContent.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-4 bg-white rounded-xl shadow-lg p-5 border-l-4 border-primary-200 hover:border-secondary-400 transition-all animate-fade-in">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-lg">{achievement.year}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-primary-700 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" /> {achievement.title}
                    </h4>
                    <p className="text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Founders Section */}
      <section id="founders" className="py-20 bg-gradient-to-br from-white via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary-200 rounded-full blur-3xl floating-bg"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary-200 rounded-full blur-3xl floating-bg" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-200 rounded-full blur-2xl floating-bg" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg pulse-glow">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">
              {founderContent.sectionTitle}
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {founderContent.sectionSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Aand Sane */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"></div>
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-gray-100 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl founder-card">
                <div className="text-center mb-8">
                  <div className="relative mb-6">
                    <div className="w-28 h-28 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto shadow-2xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 founder-avatar">
                      <span className="text-white font-bold text-3xl">A</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                    {founderContent.aandSane.name}
                  </h3>
                  <p className="text-primary-600 font-semibold text-xl mb-6 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                    {founderContent.aandSane.role}
                  </p>
                  <p className="text-secondary-600 font-medium text-lg mb-4">
                    {founderContent.aandSane.partnership}
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed text-center text-lg group-hover:text-gray-800 transition-colors duration-300">
                  {founderContent.aandSane.description}
                </p>
                <div className="mt-8 flex justify-center space-x-4">
                  {founderContent.aandSane.traits.map((trait, index) => (
                    <div key={index} className="flex items-center space-x-2 text-primary-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{trait}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

                         {/* Deepali Sane - Media Placeholder */}
             <div className="group relative">
               <div className="absolute inset-0 bg-gradient-to-r from-secondary-400 to-primary-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"></div>
               <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-gray-100 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl founder-card">
                 {/* Media Display */}
                  {loadingFounder ? (
                    <div className="w-full h-96 bg-gradient-to-br from-secondary-100 to-primary-100 rounded-2xl shadow-lg flex items-center justify-center mb-6">
                      <div className="text-center text-secondary-600">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-600 mx-auto mb-3"></div>
                        <p className="text-sm font-medium">Loading media...</p>
                      </div>
                    </div>
                  ) : founderMedia.mediaUrl && founderMedia.isActive ? (
                    <div className="relative w-full h-96 mb-6">
                      {founderMedia.mediaType === 'image' ? (
                        <img
                          src={founderMedia.mediaUrl}
                          alt={founderMedia.altText || 'Deepali Sane'}
                          className="w-full h-full object-cover rounded-2xl shadow-lg"
                        />
                      ) : (
                        <video
                          src={founderMedia.mediaUrl}
                          controls
                          className="w-full h-full object-cover rounded-2xl shadow-lg bg-black"
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                      {/* Dynamic overlay based on founder media settings */}
                      <div 
                        className="absolute inset-0 bg-secondary-600 rounded-2xl pointer-events-none"
                        style={{ opacity: founderMedia.overlayOpacity || 0.1 }}
                      ></div>
                    </div>
                  ) : (
                    <div className="w-full h-96 bg-gradient-to-br from-secondary-100 to-primary-100 rounded-2xl shadow-lg flex items-center justify-center mb-6">
                      <div className="text-center text-secondary-600">
                        <Music className="w-20 h-20 mx-auto mb-6" />
                        <p className="text-xl font-semibold">Deepali Sane Media</p>
                        <p className="text-base text-gray-500">Upload photo/video from admin panel</p>
                      </div>
                    </div>
                  )}
                 
                 <div className="mt-6 flex justify-center space-x-4">
                   {founderContent.deepaliSane.traits.map((trait, index) => (
                     <div key={index} className="flex items-center space-x-2 text-secondary-600">
                       <CheckCircle className="w-5 h-5" />
                       <span className="text-sm font-medium">{trait}</span>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-48 h-48 bg-primary-100 rounded-full blur-3xl floating-bg"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-secondary-100 rounded-full blur-2xl floating-bg" style={{animationDelay: '3s'}}></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
              Board of Directors
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Our board provides strategic guidance and ensures we remain accountable 
              to our mission and community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {boardMembers.map((member, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"></div>
                <div className="relative bg-white rounded-2xl p-10 shadow-xl border border-gray-100 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2">
                        <span className="text-white font-bold text-2xl">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                        <Award className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-orange-600 font-semibold text-lg mb-3 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-base font-medium">
                      {member.organization}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 501(c)(3) Status Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              501(c)(3) Non-Profit Status
            </h2>
            <p className="text-xl max-w-3xl mx-auto">
              Beats of Washington is a registered 501(c)(3) non-profit organization, 
              ensuring transparency and accountability in all our operations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Tax Exempt</h3>
              <p className="text-gray-100">
                All donations are tax-deductible to the extent allowed by law.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                {aboutPageContent.logo ? (
                  <img 
                    src={aboutPageContent.logo} 
                    alt="BOW Logo" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">B</span>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-3">Logo</h3>
              <p className="text-gray-100">
                Our organization logo represents our mission and values.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Accountable</h3>
              <p className="text-gray-100">
                Governed by a volunteer board of directors from the community.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg mb-6">
              <strong>EIN:</strong> 84-4396168 | <strong>Founded:</strong> 2019
            </p>
            <Link to="/contact" className="btn-secondary">
              Request Financial Information
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you want to volunteer, attend events, or support our work financially, 
            there are many ways to get involved with Beats of Washington.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/get-involved" className="btn-primary text-lg px-8 py-4">
              <Users className="w-5 h-5 mr-2" />
              Get Involved
            </Link>
            <Link to="/donate" className="btn-outline text-lg px-8 py-4">
              <Heart className="w-5 h-5 mr-2" />
              Make a Donation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage; 