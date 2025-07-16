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
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-4">People Stories</h1>
      <p className="text-center text-lg mb-10 max-w-2xl mx-auto">
        Discover the inspiring journeys of individuals whose lives have been touched by Beats of Washington. Each story reflects the impact of our community and the power of coming together.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {stories.map((story) => (
          <div key={story.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
            <img
              src={story.photo}
              alt={story.name}
              className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-indigo-100"
            />
            <h2 className="text-xl font-semibold mb-2">{story.name}</h2>
            <p className="italic text-gray-600 mb-4 text-center">"{story.quote}"</p>
            <button className="text-indigo-600 hover:underline text-sm">Read More</button>
              </div>
            ))}
          </div>
        </div>
  );
};

export default PeopleStoriesPage; 