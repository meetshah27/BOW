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
       <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white overflow-hidden py-12">
         {/* Enhanced background with multiple layers */}
         <div className="absolute inset-0 bg-black opacity-20"></div>
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
         
         {/* Animated background elements */}
         <div className="absolute inset-0 overflow-hidden">
           {/* Floating geometric shapes */}
           <div className="absolute top-12 left-16 w-20 h-20 border-2 border-white/10 rounded-full animate-spin-slow"></div>
           <div className="absolute top-24 right-24 w-16 h-16 border-2 border-white/10 rotate-45 animate-pulse"></div>
           <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-white/10 rounded-full animate-bounce"></div>
           <div className="absolute bottom-12 right-16 w-16 h-16 border-2 border-white/10 rotate-12 animate-pulse"></div>
           
           {/* Gradient orbs */}
           <div className="absolute top-1/3 left-1/3 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float-slow"></div>
           <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-slow-reverse"></div>
           
           {/* Shimmer lines */}
           <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-horizontal"></div>
           <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/30 to-transparent animate-shimmer-vertical"></div>
         </div>
         
         <div className="container-custom relative z-10">
           <div className="max-w-3xl mx-auto text-center">
             {/* Enhanced title with staggered animation */}
             <div className="mb-3 overflow-hidden">
               <h1 className="text-3xl md:text-5xl font-bold leading-tight animate-slide-in-up text-glow-hero">
                 <span className="inline-block animate-slide-in-left" style={{animationDelay: '0.2s'}}>Meet Our</span>
                 <br />
                 <span className="inline-block animate-slide-in-right" style={{animationDelay: '0.4s'}}>Leadership</span>
                 <br />
                 <span className="inline-block animate-slide-in-left" style={{animationDelay: '0.6s'}}>Team</span>
               </h1>
             </div>
             
             {/* Enhanced subtitle with typewriter effect */}
             <div className="mb-4 overflow-hidden">
               <p className="text-base md:text-lg text-gray-100 leading-relaxed animate-fade-in-up delay-800 text-glow-subtitle">
                 Discover the dedicated individuals who lead{' '}
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 font-semibold animate-text-shine">
                   Beats of Washington
                 </span>{' '}
                 and make our community events possible.
               </p>
             </div>
             
             {/* Decorative CTA elements (non-clickable) */}
             <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-in-up delay-1000">
               <div className="group relative px-5 py-2.5 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg text-white font-semibold text-sm transition-all duration-500 overflow-hidden cursor-default">
                 <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                 <span className="relative flex items-center">
                   <Users className="w-3.5 h-3.5 mr-2 transition-transform duration-300" />
                   Explore Team
                 </span>
               </div>
               
               <div className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-500/80 to-purple-500/80 backdrop-blur-sm border-2 border-blue-400/50 rounded-lg text-white font-semibold text-sm transition-all duration-500 overflow-hidden cursor-default">
                 <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                 <span className="relative flex items-center">
                   <Heart className="w-3.5 h-3.5 mr-2 transition-transform duration-300" />
                   Join Us
                 </span>
               </div>
             </div>
             
             {/* Decorative elements at bottom */}
             <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 animate-bounce">
               <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
               <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
               <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
             </div>
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