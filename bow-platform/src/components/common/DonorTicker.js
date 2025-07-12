import React, { useState, useEffect } from 'react';
import { Heart, Award, Star } from 'lucide-react';

const DonorTicker = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock donor data - in real app, this would come from API
  const mockDonors = [
    { name: "Sarah Johnson", amount: 500, tier: "Champion", photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
    { name: "Michael Chen", amount: 250, tier: "Supporter", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
    { name: "Maria Rodriguez", amount: 1000, tier: "Patron", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
    { name: "David Thompson", amount: 750, tier: "Champion", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
    { name: "Lisa Wang", amount: 300, tier: "Supporter", photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
    { name: "Robert Kim", amount: 1200, tier: "Patron", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
    { name: "Jennifer Lee", amount: 400, tier: "Supporter", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
    { name: "Thomas Brown", amount: 800, tier: "Champion", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
    { name: "Amanda Davis", amount: 600, tier: "Champion", photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
    { name: "Christopher Wilson", amount: 1500, tier: "Patron", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
    { name: "Emily Garcia", amount: 350, tier: "Supporter", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
    { name: "Daniel Martinez", amount: 900, tier: "Champion", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
    { name: "Jessica Taylor", amount: 450, tier: "Supporter", photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
    { name: "Matthew Anderson", amount: 1100, tier: "Patron", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
    { name: "Nicole White", amount: 650, tier: "Champion", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDonors(mockDonors);
      setLoading(false);
    }, 1000);
  }, []);

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'Patron':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'Champion':
        return <Award className="w-4 h-4 text-blue-500" />;
      case 'Supporter':
        return <Heart className="w-4 h-4 text-red-500" />;
      default:
        return <Heart className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Patron':
        return 'text-yellow-600 bg-yellow-100';
      case 'Champion':
        return 'text-blue-600 bg-blue-100';
      case 'Supporter':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3">
        <div className="container-custom">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
            <span className="text-sm">Loading donor information...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 overflow-hidden">
      <div className="relative">
        {/* Scrolling container */}
        <div className="flex animate-scroll whitespace-nowrap">
          {/* First set of donors */}
          {donors.map((donor, index) => (
            <div
              key={`first-${index}`}
              className="flex items-center mx-8 min-w-max"
            >
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mr-4">
                <img
                  src={donor.photo}
                  alt={donor.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white/20 mr-3"
                />
                {getTierIcon(donor.tier)}
                <span className="ml-2 font-medium">{donor.name}</span>
                <span className="ml-2 text-sm opacity-90">${donor.amount}</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getTierColor(donor.tier)}`}>
                  {donor.tier}
                </span>
              </div>
            </div>
          ))}
          
          {/* Duplicate set for seamless loop */}
          {donors.map((donor, index) => (
            <div
              key={`second-${index}`}
              className="flex items-center mx-8 min-w-max"
            >
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mr-4">
                <img
                  src={donor.photo}
                  alt={donor.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white/20 mr-3"
                />
                {getTierIcon(donor.tier)}
                <span className="ml-2 font-medium">{donor.name}</span>
                <span className="ml-2 text-sm opacity-90">${donor.amount}</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getTierColor(donor.tier)}`}>
                  {donor.tier}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonorTicker; 