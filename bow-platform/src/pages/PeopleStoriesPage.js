import React from "react";
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
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white overflow-hidden py-10 mb-8 shadow-lg">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container-custom relative z-10 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-2 drop-shadow-lg">People Stories</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-2 font-medium drop-shadow text-gray-100">
            Discover the inspiring journeys of individuals whose lives have been touched by Beats of Washington. Each story reflects the impact of our community and the power of coming together.
          </p>
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