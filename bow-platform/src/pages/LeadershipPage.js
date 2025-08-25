import React, { useState } from 'react';
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

const volunteerStory = `Our volunteers are the heartbeat of Beats of Washington. They bring energy, skills, and commitment, driving our mission forward with every action they take. Whether they are working directly with the community, supporting events, or lending their expertise behind the scenes, our volunteers make a significant impact. Discover the stories of these incredible individuals and learn why they choose to be part of the Beats of Washington family, contributing to our shared vision of a brighter future.`;

const leadershipTeam = [
  {
    name: 'Amit Bonde',
    position: 'Volunteer',
    roles: ['Dhol-Tasha Performer'],
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: volunteerStory
  },
  {
    name: 'Chaitalee Karale',
    position: 'Volunteer',
    roles: ['Dhol-Tasha Performer'],
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: volunteerStory
  },
  {
    name: 'Kedar Pathak',
    position: 'Volunteer',
    roles: ['Dhol-Tasha Performer', 'Dance Performer', 'Event Coordinator'],
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: volunteerStory
  },
  {
    name: 'Kunal Dhavale',
    position: 'Volunteer',
    roles: ['Dhol-Tasha Performer'],
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: volunteerStory
  },
  {
    name: 'Priyanka Pokale',
    position: 'Volunteer',
    roles: ['Dhol-Tasha Performer'],
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: volunteerStory
  },
  {
    name: 'Rasika Dhumal',
    position: 'Volunteer',
    roles: ['Dhol-Tasha Performer', 'Event Coordinator'],
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: volunteerStory
  },
  {
    name: 'Sailatha Sarode',
    position: 'Volunteer',
    roles: ['Event Coordinator'],
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: volunteerStory
  },
  {
    name: 'Sandeep Sarode',
    position: 'Volunteer',
    roles: ['Dhol-Tasha Performer'],
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: volunteerStory
  },
  {
    name: 'Sharvari Magar',
    position: 'Volunteer',
    roles: ['Dhol-Tasha Performer'],
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: volunteerStory
  },
  {
    name: 'Smita Kadam',
    position: 'Volunteer',
    roles: ['Dhol-Tasha Performer'],
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: volunteerStory
  },
  {
    name: 'Sujit Magar',
    position: 'Volunteer',
    roles: ['Dhol-Tasha Performer'],
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: volunteerStory
  },
  {
    name: 'Venuka Bonde',
    position: 'Volunteer',
    roles: ['Dhol-Tasha Performer', 'Dance Performer', 'Event Coordinator'],
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: volunteerStory
  },
  {
    name: 'Vinay Pawar',
    position: 'Volunteer',
    roles: ['Dhol-Tasha Performer'],
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: volunteerStory
  }
];

const LeadershipPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState(null);

  const openModal = (leader) => {
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
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
        
        <div className="container-custom section-padding relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Meet Our Leadership Team
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed">
              Discover the dedicated individuals who lead Beats of Washington and make our community events possible.
            </p>
          </div>
        </div>
      </section>

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

            {/* Enhanced info box */}
            <div className="bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/50 rounded-3xl p-10 shadow-2xl border border-blue-100/50 backdrop-blur-sm transform hover:scale-105 transition-all duration-700 hover:shadow-3xl relative overflow-hidden">
              {/* Decorative corner elements */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-br-3xl opacity-20"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-400 to-pink-500 rounded-bl-3xl opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-indigo-400 to-blue-500 rounded-tr-3xl opacity-20"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-pink-400 to-purple-500 rounded-tl-3xl opacity-20"></div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full animate-shimmer"></div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  ✨ Why They Are Part of Beats of Washington ✨
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
                  Our leaders are <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-semibold">passionate about making a difference</span>. 
                  They are dedicated to the mission of Beats of Washington and are inspired by the 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold"> impact we create in the community</span>. 
                  Their involvement is not just professional but deeply personal, fueled by a 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold">shared vision of a better future</span>.
                </p>
                
                {/* Additional decorative elements */}
                <div className="flex justify-center items-center mt-8 space-x-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse delay-100"></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-indigo-500 rounded-full animate-pulse delay-200"></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Grid */}
      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadershipTeam.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative">
                  <img
                    src={member.photo}
                    alt={`${member.name} - ${member.position}`}
                    className="w-full h-64 object-cover"
                  />
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
                  <button className="w-full btn-outline text-sm py-2" onClick={() => openModal(member)}>
                    More Info
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
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
              <img
                src={selectedLeader.photo}
                alt={selectedLeader.name}
                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-primary-100"
              />
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
              <p className="text-gray-700 text-center leading-relaxed mt-2">
                {selectedLeader.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="bg-white py-20">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Join Our Team
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Interested in becoming part of our leadership team? We're always looking for passionate individuals 
            who want to make a difference in our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="btn-primary text-lg px-8 py-4">
              <Users className="w-5 h-5 mr-2" />
              Contact Us
            </a>
            <a href="/get-involved" className="btn-outline text-lg px-8 py-4">
              <Heart className="w-5 h-5 mr-2" />
              Get Involved
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default LeadershipPage; 