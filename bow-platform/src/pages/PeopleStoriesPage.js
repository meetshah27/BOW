import React from "react";
import { Heart, Users, Star, Music } from "lucide-react";
import "../App.css";

const stories = [
  {
    id: 1,
    name: "Aarav Patel",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "BOW helped me find my voice and confidence through volunteering.",
    fullStory: "Aarav's full story goes here..."
  },
  {
    id: 2,
    name: "Priya Sharma",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "The events at BOW brought my family closer to the community.",
    fullStory: "Priya's full story goes here..."
  },
  {
    id: 3,
    name: "Rohan Singh",
    photo: "https://randomuser.me/api/portraits/men/65.jpg",
    quote: "I discovered lifelong friends and mentors at BOW.",
    fullStory: "Rohan's full story goes here..."
  },
  {
    id: 4,
    name: "Ananya Desai",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    quote: "BOW's support changed the course of my education.",
    fullStory: "Ananya's full story goes here..."
  }
];

const PeopleStoriesPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white overflow-hidden py-12 mb-8 shadow-lg">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-white to-purple-200 rounded-full blur-3xl floating-bg"></div>
          <div className="absolute bottom-20 left-20 w-56 h-56 bg-gradient-to-r from-purple-200 to-white rounded-full blur-2xl floating-bg" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-white to-pink-200 rounded-full blur-3xl floating-bg opacity-30" style={{animationDelay: '4s'}}></div>
        </div>
        
        {/* Floating story elements */}
        <div className="absolute top-10 left-10 text-white/20 animate-float-slow">
          <Heart className="w-8 h-8" />
        </div>
        <div className="absolute top-20 right-32 text-white/20 animate-float-slow-reverse">
          <Users className="w-6 h-6" />
        </div>
        <div className="absolute bottom-20 left-32 text-white/20 animate-float-slow">
          <Star className="w-7 h-7" />
        </div>
        <div className="absolute bottom-32 right-10 text-white/20 animate-float-slow-reverse">
          <Music className="w-6 h-6" />
        </div>
        
        <div className="container-custom relative z-10 flex flex-col items-center justify-center text-center">
          {/* Welcome badge */}
          <div className="mb-6 animate-fade-in">
            <span className="inline-block bg-white/10 backdrop-blur-sm text-white text-xs font-semibold px-6 py-3 rounded-full tracking-widest uppercase shadow-lg border border-white/20">
              📖 Inspiring Stories 📖
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 drop-shadow-lg animate-fade-in-up text-glow-hero">People Stories</h1>
          
          <p className="text-base md:text-lg max-w-2xl mx-auto mb-6 font-medium drop-shadow text-gray-100 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            Discover the inspiring journeys of individuals whose lives have been touched by Beats of Washington. Each story reflects the impact of our community and the power of coming together.
          </p>
          
          {/* Interactive elements */}
          <div className="flex justify-center space-x-4 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Heart className="w-5 h-5 text-red-300" />
              <span className="text-sm font-medium">Journeys</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Users className="w-5 h-5 text-blue-300" />
              <span className="text-sm font-medium">Community</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-medium">Impact</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="container-custom pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {stories.map((story, idx) => (
            <div
              key={story.id}
              className="group bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl border border-orange-100 opacity-0 animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'forwards' }}
            >
              <img
                src={story.photo}
                alt={story.name}
                className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-orange-200 shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <h2 className="text-xl font-bold mb-2 text-primary-700 text-center">{story.name}</h2>
              <p className="italic text-gray-700 mb-4 text-center">"{story.quote}"</p>
              <button className="px-6 py-2 rounded-full font-semibold shadow hover:shadow-lg transition-all text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm mt-auto">
                Read More
              </button>
            </div>
          ))}
        </div>
      </section>
      <style>{`
        @keyframes fade-in {
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default PeopleStoriesPage; 