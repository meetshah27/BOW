import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
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
import VolunteerApplicationForm from '../components/volunteer/VolunteerApplicationForm';
import MembershipApplicationForm from '../components/membership/MembershipApplicationForm';
import api from '../config/api';
import HeroSection from '../components/common/HeroSection';

const GetInvolvedPage = () => {
  const [activeTab, setActiveTab] = useState('volunteer');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [membershipApplicationEnabled, setMembershipApplicationEnabled] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);
  
  // Debug logging for modal state
  useEffect(() => {
    console.log('Modal state changed - showApplicationForm:', showApplicationForm);
    console.log('Modal state changed - selectedOpportunity:', selectedOpportunity);
  }, [showApplicationForm, selectedOpportunity]);

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
          { icon: Calendar, label: 'Events', color: 'text-blue-300' }
        ]}
      />

      {/* Tabs Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-2xl border border-white/20 flex gap-3">
              <button
                onClick={() => {
                  setActiveTab('volunteer');
                  // Add a small delay to ensure the tab content is rendered before scrolling
                  setTimeout(() => {
                    document.getElementById('volunteer-section').scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }, 100);
                }}
                className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:ring-offset-2 text-lg shadow-lg border-2 ${
                  activeTab === 'volunteer' 
                    ? 'text-white border-primary-600 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-primary-500/50' 
                    : 'text-primary-600 border-primary-600 bg-white hover:bg-primary-50 hover:border-primary-700 hover:text-primary-700'
                }`}
                type="button"
                aria-pressed={activeTab === 'volunteer'}
              >
                <Users className="w-6 h-6 inline mr-3 align-text-bottom" />
                Volunteer
              </button>
              <button
                onClick={() => {
                  setActiveTab('member');
                  // Add a small delay to ensure the tab content is rendered before scrolling
                  setTimeout(() => {
                    document.getElementById('member-section').scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }, 100);
                }}
                className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:ring-offset-2 text-lg shadow-lg border-2 ${
                  activeTab === 'member' 
                    ? 'text-white border-primary-600 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-primary-500/50' 
                    : 'text-primary-600 border-primary-600 bg-white hover:bg-primary-50 hover:border-primary-700 hover:text-primary-700'
                }`}
                type="button"
                aria-pressed={activeTab === 'member'}
              >
                <Heart className="w-6 h-6 inline mr-3 align-text-bottom" />
                Become a Member
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-6xl mx-auto">
            {activeTab === 'volunteer' && (
              <div id="volunteer-section" className="space-y-8">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mb-6 shadow-lg animate-pulse overflow-hidden">
                    {logoUrl ? (
                      <img 
                        src={logoUrl} 
                        alt="BOW Logo" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Volunteer Opportunities
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Make a difference in your community by volunteering with BOW. We have various opportunities that match different skills and interests.
                  </p>
                </div>

                {loadingOpportunities ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading volunteer opportunities...</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {volunteerOpportunities.map((opportunity) => (
                      <div key={opportunity.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {opportunity.category}
                          </span>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>{opportunity.location}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{opportunity.title}</h3>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{opportunity.timeCommitment}</span>
                        </div>
                        
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {opportunity.description}
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-3">Requirements:</h5>
                            <ul className="space-y-2">
                              {opportunity.requirements.map((req, index) => (
                                <li key={index} className="flex items-start text-sm text-gray-600">
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-3">Benefits:</h5>
                            <ul className="space-y-2">
                              {opportunity.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start text-sm text-gray-600">
                                  <Star className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <button
                            onClick={() => {
                              console.log('Apply Now clicked for opportunity:', opportunity);
                              console.log('Setting selectedOpportunity to:', opportunity);
                              console.log('Setting showApplicationForm to true');
                              
                              // Test if the state setters are working
                              try {
                                setSelectedOpportunity(opportunity);
                                setShowApplicationForm(true);
                                console.log('State setters called successfully');
                              } catch (error) {
                                console.error('Error setting state:', error);
                              }
                              
                              console.log('State should now be updated');
                            }}
                            className="btn-primary w-full justify-center"
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
              <div id="member-section" className="space-y-8">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full mb-6 shadow-lg animate-pulse overflow-hidden">
                    {logoUrl ? (
                      <img 
                        src={logoUrl} 
                        alt="BOW Logo" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Heart className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Become a Member
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Join BOW as a member and become part of our growing community. Enjoy exclusive benefits and help support our mission.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Membership Benefits</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <Award className="w-6 h-6 text-secondary-500 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Exclusive Access</h4>
                          <p className="text-gray-600">Priority access to events, workshops, and special programs</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Music className="w-6 h-6 text-secondary-500 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Cultural Programs</h4>
                          <p className="text-gray-600">Participate in traditional music and cultural activities</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Users className="w-6 h-6 text-secondary-500 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Community Network</h4>
                          <p className="text-gray-600">Connect with like-minded individuals and cultural enthusiasts</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Calendar className="w-6 h-6 text-secondary-500 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Event Discounts</h4>
                          <p className="text-gray-600">Special pricing on workshops, performances, and merchandise</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">How to Join</h3>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4 mt-1">1</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Complete Application</h4>
                          <p className="text-gray-600">Fill out our membership application form with your details</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4 mt-1">2</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Review Process</h4>
                          <p className="text-gray-600">Our team will review your application within 2-3 business days</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4 mt-1">3</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Welcome Package</h4>
                          <p className="text-gray-600">Receive your welcome kit and start enjoying member benefits</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      {membershipApplicationEnabled ? (
                        <button
                          onClick={() => setShowCommunityModal(true)}
                          className="btn-secondary w-full justify-center"
                        >
                          <Heart className="w-5 h-5 mr-2" />
                          Apply for Membership
                        </button>
                      ) : (
                        <div className="text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <Heart className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                          <h4 className="text-lg font-semibold text-gray-600 mb-2">Membership Applications Temporarily Closed</h4>
                          <p className="text-gray-500 text-sm">
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
          </div>
        </div>
      </section>

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
