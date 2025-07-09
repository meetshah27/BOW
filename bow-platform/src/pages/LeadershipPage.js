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
      <section className="bg-white py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Washington Ganesh Festival 2024 Leadership Team
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Discover the individuals who lead Beats of Washington, learn about their roles, and understand their motivations. 
              Each member of our leadership team brings unique skills and experiences, contributing to our collective success.
            </p>
            <div className="bg-primary-50 rounded-xl p-8 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Why They Are Part of Beats of Washington
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our leaders are passionate about making a difference. They are dedicated to the mission of Beats of Washington 
                and are inspired by the impact we create in the community. Their involvement is not just professional but deeply 
                personal, fueled by a shared vision of a better future.
              </p>
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