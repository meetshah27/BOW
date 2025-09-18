import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  MapPin, 
  Clock, 
  Star, 
  CheckCircle,
  ArrowRight,
  Filter,
  Search,
  Heart,
  Award,
  Music,
  Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import VolunteerApplicationForm from '../components/volunteer/VolunteerApplicationForm';
import api from '../config/api';
import HeroSection from '../components/common/HeroSection';

const VolunteerOpportunitiesPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Fetch logo from about page content
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch('/api/about-page');
        if (response.ok) {
          const data = await response.json();
          setLogoUrl(data.logo || '');
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
    fetchLogo();
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await api.get('/volunteers/opportunities');
      if (response.ok) {
        const data = await response.json();
        setOpportunities(data);
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Events', label: 'Events' },
    { value: 'Education', label: 'Education' },
    { value: 'Outreach', label: 'Outreach' },
    { value: 'Technical', label: 'Technical' }
  ];

  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesCategory = filterCategory === 'all' || opportunity.category === filterCategory;
    const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Add function to handle application button click with auth check
  const handleApplicationClick = (opportunity) => {
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

  const stats = [
    { number: "500+", label: "Active Volunteers", icon: Users },
    { number: "2,000+", label: "Hours Contributed", icon: Clock },
    { number: "200+", label: "Events Supported", icon: Calendar },
    { number: "15", label: "Years of Service", icon: Award }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Volunteer Opportunities - Beats of Washington</title>
        <meta name="description" content="Join our volunteer team and make a difference in your community. Find opportunities that match your skills and interests." />
      </Helmet>

      {/* Hero Section */}
      <HeroSection
        title="Volunteer Opportunities"
        description="Join our dedicated team of volunteers and make a real impact in your community. We have opportunities for all skill levels and interests."
        icon={Users}
        logoUrl={logoUrl}
        showLogo={true}
        floatingElements={[
          { icon: Users, position: 'top-10 left-10', animation: 'animate-float-slow' },
          { icon: Heart, position: 'top-20 right-32', animation: 'animate-float-slow-reverse' },
          { icon: Award, position: 'bottom-20 left-32', animation: 'animate-float-slow' },
          { icon: Star, position: 'bottom-32 right-10', animation: 'animate-float-slow-reverse' }
        ]}
        interactiveElements={[
          { icon: Users, label: 'Community', color: 'text-red-300' },
          { icon: Heart, label: 'Volunteer', color: 'text-yellow-300' },
          { icon: Award, label: 'Impact', color: 'text-blue-300' }
        ]}
      />

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-12 h-12 text-primary-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Available Positions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our current volunteer opportunities and find the perfect role for you.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Opportunities Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {opportunity.title}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                    {opportunity.category}
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {opportunity.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {opportunity.timeCommitment}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {opportunity.description}
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Requirements:
                    </h5>
                    <ul className="space-y-2">
                      {opportunity.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-2" />
                      Benefits:
                    </h5>
                    <ul className="space-y-2">
                      {opportunity.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <button
                  onClick={() => handleApplicationClick(opportunity)}
                  className="btn-primary w-full justify-center"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            ))}
          </div>

          {filteredOpportunities.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No opportunities found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Volunteer Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Volunteer with BOW?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our community and make a difference while gaining valuable experience and connections.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Make a Difference
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Contribute to your community and help create meaningful connections through music and culture.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Gain Experience
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Develop new skills, build your resume, and gain valuable experience in event management and community outreach.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Build Connections
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Meet like-minded people, network with community leaders, and become part of our vibrant community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Application Form Modal */}
      {showApplicationForm && selectedOpportunity && (
        <VolunteerApplicationForm
          opportunity={selectedOpportunity}
          onClose={() => {
            setShowApplicationForm(false);
            setSelectedOpportunity(null);
          }}
          onSuccess={(data) => {
            console.log('Application submitted successfully:', data);
            setShowApplicationForm(false);
            setSelectedOpportunity(null);
          }}
        />
      )}
    </>
  );
};

export default VolunteerOpportunitiesPage; 