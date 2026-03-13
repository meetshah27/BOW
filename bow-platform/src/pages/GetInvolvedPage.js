import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  Star,
  ArrowRight,
  CheckCircle,
  Music,
  Award,
  Mail,
  Phone
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import VolunteerApplicationForm from '../components/volunteer/VolunteerApplicationForm';
import MembershipApplicationForm from '../components/membership/MembershipApplicationForm';
import VendorApplicationForm from '../components/applications/VendorApplicationForm';
import PerformerApplicationForm from '../components/applications/PerformerApplicationForm';
import api from '../config/api';
import HeroSection from '../components/common/HeroSection';

const GetInvolvedPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('volunteer');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [membershipApplicationEnabled, setMembershipApplicationEnabled] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showPerformerModal, setShowPerformerModal] = useState(false);
  
  // Debug logging for modal state
  useEffect(() => {
    console.log('Modal state changed - showApplicationForm:', showApplicationForm);
    console.log('Modal state changed - selectedOpportunity:', selectedOpportunity);
  }, [showApplicationForm, selectedOpportunity]);

  // Handle tab parameter from URL when returning from login
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam === 'member') {
      setActiveTab('member');
    }
  }, []);

  // Add function to handle volunteer application button click with auth check
  const handleVolunteerApplicationClick = (opportunity) => {
    if (!currentUser) {
      // Store the current page location to redirect back after login
      const currentPath = window.location.pathname;
      navigate('/login', { 
        state: { from: { pathname: currentPath } },
        replace: false 
      });
      toast.error('Please log in to apply for volunteer opportunities');
      return;
    }
    setSelectedOpportunity(opportunity);
    setShowApplicationForm(true);
  };

  // Add function to handle membership application button click with auth check
  const handleMembershipApplicationClick = () => {
    if (!currentUser) {
      // Store the current page location and tab to redirect back after login
      const currentPath = window.location.pathname;
      navigate('/login', { 
        state: { 
          from: { 
            pathname: currentPath,
            search: '?tab=member' // Add tab parameter to redirect to member tab
          } 
        },
        replace: false 
      });
      toast.error('Please log in to apply for membership');
      return;
    }
    setShowCommunityModal(true);
  };

  // Fetch membership application setting
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setSettingsLoading(true);
        const response = await api.get('/settings/membershipApplicationEnabled');
        if (response.ok) {
          const data = await response.json();
          setMembershipApplicationEnabled(data.value);
        }
      } catch (error) {
        console.error('Error fetching membership application setting:', error);
        // Default to enabled if there's an error
        setMembershipApplicationEnabled(true);
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchSettings();
  }, []);
  
  // Debug logging for component re-renders
  useEffect(() => {
    console.log('GetInvolvedPage component rendered');
  });
  
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [volunteerOpportunities, setVolunteerOpportunities] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);
  const [logoUrl, setLogoUrl] = useState('');

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

  // Fetch volunteer opportunities from API
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        console.log('Fetching volunteer opportunities...');
        const response = await api.get('/volunteer-opportunities/opportunities/active');
        console.log('Volunteer opportunities response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Volunteer opportunities data:', data);
          setVolunteerOpportunities(data.opportunities || []);
        } else {
          console.error('Failed to fetch volunteer opportunities, status:', response.status);
          // Fallback to sample data if API fails
          setVolunteerOpportunities(fallbackOpportunities);
        }
      } catch (error) {
        console.error('Error fetching volunteer opportunities:', error);
        // Fallback to sample data if API fails
        setVolunteerOpportunities(fallbackOpportunities);
      } finally {
        setLoadingOpportunities(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Fallback opportunities if API fails
  const fallbackOpportunities = [
    {
      id: 1,
      opportunityId: 1, // Add this for compatibility
      title: "Event Coordinator",
      category: "Events",
      location: "Seattle Area",
      timeCommitment: "4-8 hours per event",
      description: "Help coordinate and manage BOW events, including setup, coordination with vendors, and ensuring smooth event execution.",
      requirements: [
        "Strong organizational skills",
        "Experience with event planning",
        "Good communication skills",
        "Ability to work under pressure"
      ],
      benefits: [
        "Gain event management experience",
        "Network with community leaders",
        "Contribute to cultural events",
        "Build leadership skills"
      ],
      isActive: true
    },
    {
      id: 2,
      opportunityId: 2,
      title: "Social Media Manager",
      category: "Marketing",
      location: "Remote",
      timeCommitment: "2-4 hours per week",
      description: "Manage BOW's social media presence across platforms, create engaging content, and grow our online community.",
      requirements: [
        "Experience with social media platforms",
        "Creative content creation skills",
        "Understanding of BOW's mission",
        "Consistent availability"
      ],
      benefits: [
        "Build digital marketing portfolio",
        "Creative freedom",
        "Remote work opportunity",
        "Community impact"
      ],
      isActive: true
    },
    {
      id: 3,
      opportunityId: 3,
      title: "Music Instructor",
      category: "Education",
      location: "Seattle Area",
      timeCommitment: "3-6 hours per week",
      description: "Teach traditional Indian music and instruments to community members, helping preserve cultural heritage.",
      requirements: [
        "Proficiency in Indian classical music",
        "Teaching experience preferred",
        "Patience and enthusiasm",
        "Cultural knowledge"
      ],
      benefits: [
        "Share cultural knowledge",
        "Teaching experience",
        "Community recognition",
        "Cultural preservation"
      ],
      isActive: true
    }
  ];

  const closeCommunityModal = () => setShowCommunityModal(false);

  return (
    <>
      <Helmet>
        <title>Get Involved - Beats of Washington</title>
        <meta name="description" content="Join Beats of Washington as a volunteer or member. Make a difference in your community through music, events, and cultural programs." />
      </Helmet>

      {/* Hero Section */}
      <HeroSection
        title="Get Involved"
        description="Whether you want to volunteer your time or become a member, there are many ways to get involved with BOW."
        badge="🤝 Join Our Community 🤝"
        logoUrl={logoUrl}
        showLogo={true}
        floatingElements={[
          { icon: Users, position: 'top-10 left-10', animation: 'animate-float-slow' },
          { icon: Heart, position: 'top-20 right-32', animation: 'animate-float-slow-reverse' },
          { icon: Calendar, position: 'bottom-20 left-32', animation: 'animate-float-slow' },
          { icon: Star, position: 'bottom-32 right-10', animation: 'animate-float-slow-reverse' }
        ]}
        interactiveElements={[
          { icon: Users, label: 'Volunteer', color: 'text-green-300' },
          { icon: Heart, label: 'Member', color: 'text-red-300' },
          { icon: Award, label: 'Vendor', color: 'text-yellow-300' },
          { icon: Music, label: 'Performer', color: 'text-purple-300' }
        ]}
      />

      {/* Tabs Section */}
      <section className="py-8 sm:py-12 md:py-20 bg-gray-50">
        <div className="container-custom px-4 sm:px-6">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8 sm:mb-12 md:mb-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-2xl border border-white/20 flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  setActiveTab('volunteer');
                  // Add a small delay to ensure the tab content is rendered before scrolling
                  setTimeout(() => {
                    const element = document.getElementById('volunteer-section');
                    if (element) {
                      element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                  }, 100);
                }}
                className={`px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:ring-offset-2 text-sm sm:text-base md:text-lg shadow-lg border-2 flex items-center justify-center gap-2 sm:gap-3 ${
                  activeTab === 'volunteer' 
                    ? 'text-white border-primary-600 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-primary-500/50' 
                    : 'text-primary-600 border-primary-600 bg-white hover:bg-primary-50 hover:border-primary-700 hover:text-primary-700'
                }`}
                type="button"
                aria-pressed={activeTab === 'volunteer'}
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span>Volunteer</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('member');
                  // Add a small delay to ensure the tab content is rendered before scrolling
                  setTimeout(() => {
                    const element = document.getElementById('member-section');
                    if (element) {
                      element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                  }, 100);
                }}
                className={`px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:ring-offset-2 text-sm sm:text-base md:text-lg shadow-lg border-2 flex items-center justify-center gap-2 sm:gap-3 ${
                  activeTab === 'member' 
                    ? 'text-white border-primary-600 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-primary-500/50' 
                    : 'text-primary-600 border-primary-600 bg-white hover:bg-primary-50 hover:border-primary-700 hover:text-primary-700'
                }`}
                type="button"
                aria-pressed={activeTab === 'member'}
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span className="hidden sm:inline">Become a Member</span>
                <span className="sm:hidden">Member</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('vendor');
                  setTimeout(() => {
                    const element = document.getElementById('vendor-section');
                    if (element) {
                      element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                    }
                  }, 100);
                }}
                className={`px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:ring-offset-2 text-sm sm:text-base md:text-lg shadow-lg border-2 flex items-center justify-center gap-2 sm:gap-3 ${
                  activeTab === 'vendor'
                    ? 'text-white border-primary-600 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-primary-500/50'
                    : 'text-primary-600 border-primary-600 bg-white hover:bg-primary-50 hover:border-primary-700 hover:text-primary-700'
                }`}
                type="button"
                aria-pressed={activeTab === 'vendor'}
              >
                <Award className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span>Vendor</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('performer');
                  setTimeout(() => {
                    const element = document.getElementById('performer-section');
                    if (element) {
                      element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                    }
                  }, 100);
                }}
                className={`px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:ring-offset-2 text-sm sm:text-base md:text-lg shadow-lg border-2 flex items-center justify-center gap-2 sm:gap-3 ${
                  activeTab === 'performer'
                    ? 'text-white border-primary-600 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-primary-500/50'
                    : 'text-primary-600 border-primary-600 bg-white hover:bg-primary-50 hover:border-primary-700 hover:text-primary-700'
                }`}
                type="button"
                aria-pressed={activeTab === 'performer'}
              >
                <Music className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span>Performer</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-6xl mx-auto">
            {activeTab === 'volunteer' && (
              <div id="volunteer-section" className="space-y-6 sm:space-y-8">
                <div className="text-center mb-8 sm:mb-12 md:mb-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mb-4 sm:mb-6 shadow-lg animate-pulse overflow-hidden">
                    {logoUrl ? (
                      <img 
                        src={logoUrl} 
                        alt="BOW Logo" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
                    Volunteer Opportunities
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                    Make a difference in your community by volunteering with BOW. We have various opportunities that match different skills and interests.
                  </p>
                </div>

                {loadingOpportunities ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-sm sm:text-base text-gray-600">Loading volunteer opportunities...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {volunteerOpportunities.map((opportunity) => (
                      <div key={opportunity.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-5 md:p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                          <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 w-fit">
                            {opportunity.category}
                          </span>
                          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">{opportunity.location}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">{opportunity.title}</h3>
                        
                        <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                          <span className="truncate">{opportunity.timeCommitment}</span>
                        </div>
                        
                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed line-clamp-3">
                          {opportunity.description}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                          <div>
                            <h5 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">Requirements:</h5>
                            <ul className="space-y-1.5 sm:space-y-2">
                              {opportunity.requirements.slice(0, 3).map((req, index) => (
                                <li key={index} className="flex items-start text-xs sm:text-sm text-gray-600">
                                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1.5 sm:mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="break-words">{req}</span>
                                </li>
                              ))}
                              {opportunity.requirements.length > 3 && (
                                <li className="text-xs sm:text-sm text-gray-500 italic">
                                  +{opportunity.requirements.length - 3} more requirements
                                </li>
                              )}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">Benefits:</h5>
                            <ul className="space-y-1.5 sm:space-y-2">
                              {opportunity.benefits.slice(0, 3).map((benefit, index) => (
                                <li key={index} className="flex items-start text-xs sm:text-sm text-gray-600">
                                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 mr-1.5 sm:mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="break-words">{benefit}</span>
                                </li>
                              ))}
                              {opportunity.benefits.length > 3 && (
                                <li className="text-xs sm:text-sm text-gray-500 italic">
                                  +{opportunity.benefits.length - 3} more benefits
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mt-4 sm:mt-6">
                          <button
                            onClick={() => handleVolunteerApplicationClick(opportunity)}
                            className="btn-primary w-full justify-center text-sm sm:text-base py-2.5 sm:py-3"
                            type="button"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'member' && (
              <div id="member-section" className="space-y-6 sm:space-y-8">
                <div className="text-center mb-8 sm:mb-12 md:mb-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full mb-4 sm:mb-6 shadow-lg animate-pulse overflow-hidden">
                    {logoUrl ? (
                      <img 
                        src={logoUrl} 
                        alt="BOW Logo" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
                    Become a Member
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                    Join BOW as a member and become part of our growing community. Enjoy exclusive benefits and help support our mission.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6 md:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Membership Benefits</h3>
                    <ul className="space-y-3 sm:space-y-4">
                      <li className="flex items-start">
                        <Award className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-500 mr-2 sm:mr-3 mt-0.5 sm:mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm sm:text-base text-gray-900">Exclusive Access</h4>
                          <p className="text-xs sm:text-sm text-gray-600">Priority access to events, workshops, and special programs</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Music className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-500 mr-2 sm:mr-3 mt-0.5 sm:mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm sm:text-base text-gray-900">Cultural Programs</h4>
                          <p className="text-xs sm:text-sm text-gray-600">Participate in traditional music and cultural activities</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-500 mr-2 sm:mr-3 mt-0.5 sm:mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm sm:text-base text-gray-900">Community Network</h4>
                          <p className="text-xs sm:text-sm text-gray-600">Connect with like-minded individuals and cultural enthusiasts</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-500 mr-2 sm:mr-3 mt-0.5 sm:mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm sm:text-base text-gray-900">Event Discounts</h4>
                          <p className="text-xs sm:text-sm text-gray-600">Special pricing on workshops, performances, and merchandise</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6 md:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">How to Join</h3>
                    <div className="space-y-4 sm:space-y-6">
                      <div className="flex items-start">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm mr-3 sm:mr-4 mt-0.5 sm:mt-1 flex-shrink-0">1</div>
                        <div>
                          <h4 className="font-semibold text-sm sm:text-base text-gray-900">Complete Application</h4>
                          <p className="text-xs sm:text-sm text-gray-600">Fill out our membership application form with your details</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm mr-3 sm:mr-4 mt-0.5 sm:mt-1 flex-shrink-0">2</div>
                        <div>
                          <h4 className="font-semibold text-sm sm:text-base text-gray-900">Review Process</h4>
                          <p className="text-xs sm:text-sm text-gray-600">Our team will review your application within 2-3 business days</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm mr-3 sm:mr-4 mt-0.5 sm:mt-1 flex-shrink-0">3</div>
                        <div>
                          <h4 className="font-semibold text-sm sm:text-base text-gray-900">Welcome Package</h4>
                          <p className="text-xs sm:text-sm text-gray-600">Receive your welcome kit and start enjoying member benefits</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 sm:mt-8">
                      {membershipApplicationEnabled ? (
                        <button
                          onClick={handleMembershipApplicationClick}
                          className="btn-secondary w-full justify-center text-sm sm:text-base py-2.5 sm:py-3"
                        >
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Apply for Membership
                        </button>
                      ) : (
                        <div className="text-center p-4 sm:p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2 sm:mb-3" />
                          <h4 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">Membership Applications Temporarily Closed</h4>
                          <p className="text-xs sm:text-sm text-gray-500 px-2">
                            We're currently not accepting new membership applications. 
                            Please check back later or contact us for more information.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vendor' && (
              <div id="vendor-section" className="space-y-6 sm:space-y-8">
                <div className="text-center mb-8 sm:mb-12 md:mb-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mb-4 sm:mb-6 shadow-lg animate-pulse overflow-hidden">
                    {logoUrl ? (
                      <img src={logoUrl} alt="BOW Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Award className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
                    Vendor Applications
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                    Want to be a vendor at BOW events? Apply here and we’ll reach out with upcoming opportunities.
                  </p>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6 md:p-8 max-w-3xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Apply as a Vendor</h3>
                      <p className="text-sm sm:text-base text-gray-600 mt-2">
                        Food, crafts, services, and community partners are welcome.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-primary w-full sm:w-auto justify-center"
                      onClick={() => setShowVendorModal(true)}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'performer' && (
              <div id="performer-section" className="space-y-6 sm:space-y-8">
                <div className="text-center mb-8 sm:mb-12 md:mb-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full mb-4 sm:mb-6 shadow-lg animate-pulse overflow-hidden">
                    {logoUrl ? (
                      <img src={logoUrl} alt="BOW Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Music className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
                    Performer Applications
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                    Interested in performing at BOW events? Apply here with your act details.
                  </p>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6 md:p-8 max-w-3xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Apply as a Performer</h3>
                      <p className="text-sm sm:text-base text-gray-600 mt-2">
                        Bands, solo artists, dancers, DJs, and cultural performances are welcome.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-primary w-full sm:w-auto justify-center"
                      onClick={() => setShowPerformerModal(true)}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {showVendorModal && (
        <VendorApplicationForm logoUrl={logoUrl} onClose={() => setShowVendorModal(false)} />
      )}

      {showPerformerModal && (
        <PerformerApplicationForm logoUrl={logoUrl} onClose={() => setShowPerformerModal(false)} />
      )}

      {/* Membership Application Form Modal */}
      {showCommunityModal && (
        <MembershipApplicationForm
          logoUrl={logoUrl}
          onClose={() => setShowCommunityModal(false)}
        />
      )}

      {/* Volunteer Application Form Modal */}
      {showApplicationForm && selectedOpportunity && (
        <VolunteerApplicationForm
          opportunity={selectedOpportunity}
          logoUrl={logoUrl}
          onClose={() => {
            setShowApplicationForm(false);
            setSelectedOpportunity(null);
          }}
        />
      )}
    </>
  );
};

export default GetInvolvedPage;
