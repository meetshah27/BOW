import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Users, 
  Music, 
  Calendar, 
  MapPin, 
  Star,
  Award,
  Heart,
  ArrowRight
} from 'lucide-react';
import api from '../config/api';
import HeroSection from '../components/common/HeroSection';

const volunteerStory = `Our volunteers are the heartbeat of Beats of Washington. They bring energy, skills, and commitment, driving our mission forward with every action they take. Whether they are working directly with the community, supporting events, or lending their expertise behind the scenes, our volunteers make a significant impact. Discover the stories of these incredible individuals and learn why they choose to be part of the Beats of Washington family, contributing to our shared vision of a brighter future.`;

const LeadershipPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [leadershipTeam, setLeadershipTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    fetchLeaders();
    fetchLogo();
  }, []);

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

  const fetchLeaders = async () => {
    try {
      setLoading(true);
      const response = await api.get('leaders');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched leaders data:', data);
        setLeadershipTeam(data);
      } else {
        console.error('Failed to fetch leaders');
        // Fallback to empty array
        setLeadershipTeam([]);
      }
    } catch (error) {
      console.error('Error fetching leaders:', error);
      // Fallback to empty array
      setLeadershipTeam([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (leader) => {
    console.log('Opening modal for leader:', leader);
    setSelectedLeader(leader);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedLeader(null);
  };

  return (
    <>
      <Helmet>
        <title>Leadership Team - Beats of Washington</title>
        <meta name="description" content="Meet the leadership team of Beats of Washington - the dedicated individuals who lead our community through music and cultural events." />
      </Helmet>

      {/* Hero Section */}
      <HeroSection
        title={
          <>
            <span>Meet Our</span>
            <br />
            <span>Leadership</span>
            <br />
            <span>Team</span>
          </>
        }
        description="Discover the dedicated individuals who lead Beats of Washington and make our community events possible."
        logoUrl={logoUrl}
        showLogo={true}
        floatingElements={[
          { icon: Users, position: 'top-12 left-16', animation: 'animate-spin-slow' },
          { icon: Award, position: 'top-24 right-24', animation: 'animate-pulse' },
          { icon: Star, position: 'bottom-20 left-1/4', animation: 'animate-bounce' },
          { icon: Heart, position: 'bottom-12 right-16', animation: 'animate-pulse' }
        ]}
        interactiveElements={[
          { icon: Users, label: 'Explore Team', color: 'text-blue-300' },
          { icon: Heart, label: 'Join Us', color: 'text-purple-300' }
        ]}
      />

      {/* Introduction Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-2xl"></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="floating-particle particle-1"></div>
          <div className="floating-particle particle-2"></div>
          <div className="floating-particle particle-3"></div>
          <div className="floating-particle particle-4"></div>
          <div className="floating-particle particle-5"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Main description with enhanced styling */}
            <div className="mb-12 transform hover:scale-105 transition-all duration-500">
              <div className="inline-block bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/30 shadow-xl">
                <p className="text-xl text-gray-700 leading-relaxed font-medium">
                  Discover the individuals who lead <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold">Beats of Washington</span>, 
                  learn about their roles, and understand their motivations. Each member of our leadership team brings 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-semibold"> unique skills and experiences</span>, 
                  contributing to our collective success.
                </p>
              </div>
            </div>
           </div>
         </div>
       </section>
 
       {/* Leadership Team Grid */}
       <section className="bg-gray-50 py-2">
        <div className="container-custom">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : leadershipTeam.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No leaders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Check back later or contact us for more information about our leadership team.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leadershipTeam.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={`${member.name} - ${member.position}`}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <Users className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {member.position}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-semibold mb-3">
                    {member.roles.join(', ')}
                  </p>
                  {member.bio && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {member.bio}
                    </p>
                  )}
                  <button className="w-full btn-outline text-sm py-2" onClick={() => openModal(member)}>
                    More Info
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal for More Info */}
      {modalOpen && selectedLeader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-8 relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-primary-600 text-2xl font-bold focus:outline-none"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              {selectedLeader.imageUrl ? (
                <img
                  src={selectedLeader.imageUrl}
                  alt={selectedLeader.name}
                  className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-primary-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 border-4 border-primary-100">
                  <Users className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedLeader.name}</h3>
              <p className="text-primary-600 font-semibold mb-2">{selectedLeader.position}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedLeader.roles.map((role, idx) => (
                  <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    <Users className="w-3 h-3 mr-1" />
                    {role}
                  </span>
                ))}
              </div>
              {selectedLeader.bio && (
                <p className="text-gray-700 text-center leading-relaxed mt-2">
                  {selectedLeader.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

             {/* Enhanced CTA Section */}
       <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 overflow-hidden">
         {/* Background decorative elements */}
         <div className="absolute inset-0">
           <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-float-slow"></div>
           <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-indigo-200/20 to-blue-200/20 rounded-full blur-3xl animate-float-slow-reverse"></div>
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-2xl animate-pulse"></div>
         </div>
         
         {/* Floating particles */}
         <div className="absolute inset-0 overflow-hidden">
           <div className="floating-particle particle-1"></div>
           <div className="floating-particle particle-2"></div>
           <div className="floating-particle particle-3"></div>
           <div className="floating-particle particle-4"></div>
         </div>
         
         {/* Shimmer lines */}
         <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300/30 to-transparent animate-shimmer-horizontal"></div>
         <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-300/30 to-transparent animate-shimmer-horizontal" style={{animationDelay: '2s'}}></div>
         
         <div className="container-custom relative z-10">
           <div className="max-w-4xl mx-auto text-center">
                           {/* Enhanced title with animation */}
              <div className="mb-8 overflow-hidden">
                <h2 className="text-5xl md:text-6xl font-bold mb-4 animate-slide-in-up text-glow-hero">
                  <span className="inline-block animate-slide-in-left" style={{animationDelay: '0.2s'}}>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-red-600">
                      Join Our Team
                    </span>
                  </span>
                </h2>
              </div>
              
              {/* Enhanced description with typewriter effect */}
              <div className="mb-12 overflow-hidden">
                <div className="inline-block bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-2xl p-8 border border-orange-200/30 shadow-xl transform hover:scale-105 transition-all duration-500">
                  <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium animate-fade-in-up delay-500">
                    Interested in becoming part of our leadership team? We're always looking for{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 font-bold animate-text-shine">
                      passionate individuals
                    </span>{' '}
                    who want to make a difference in our community.
                  </p>
                </div>
              </div>
              
              {/* Enhanced CTA buttons with effects */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-800">
                {/* Contact Us Button */}
                <div className="group relative">
                  <a href="/contact" className="relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {/* Icon with animation */}
                    <div className="relative flex items-center">
                      <div className="mr-3 group-hover:rotate-12 transition-transform duration-300">
                        <Users className="w-6 h-6" />
                      </div>
                      <span className="relative z-10">Contact Us</span>
                    </div>
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                  </a>
                  
                  {/* Floating elements around button */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-orange-400 rounded-full animate-bounce opacity-60"></div>
                  <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-red-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s'}}></div>
                </div>
                
                {/* Get Involved Button */}
                <div className="group relative">
                  <a href="/get-involved" className="relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 overflow-hidden border-2 border-red-400/30">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {/* Icon with animation */}
                    <div className="relative flex items-center">
                      <div className="mr-3 group-hover:scale-110 transition-transform duration-300">
                        <Heart className="w-6 h-6" />
                      </div>
                      <span className="relative z-10">Get Involved</span>
                    </div>
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                  </a>
                  
                  {/* Floating elements around button */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full animate-bounce opacity-60"></div>
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-orange-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s'}}></div>
                </div>
              </div>
              
              {/* Additional decorative elements */}
              <div className="mt-16 flex justify-center items-center space-x-6 animate-fade-in-up delay-1000">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-500 font-medium">Passionate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-orange-500 rounded-full animate-pulse delay-200"></div>
                  <span className="text-sm text-gray-500 font-medium">Dedicated</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse delay-400"></div>
                  <span className="text-sm text-gray-500 font-medium">Committed</span>
                </div>
              </div>
           </div>
         </div>
       </section>
    </>
  );
};

export default LeadershipPage; 