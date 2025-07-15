import React from 'react';
import { Users, Heart, Calendar, Clock } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

const StatisticsSection = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      number: 8333,
      suffix: '+',
      label: 'Community Members',
      description: 'Active members in our community',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      number: 833,
      suffix: '+',
      label: 'Volunteers',
      description: 'Dedicated volunteers helping our cause',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      number: 33,
      suffix: '+',
      label: 'Events Annually',
      description: 'Community events we organize each year',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      number: 2,
      suffix: '',
      label: 'Years of Service',
      description: 'Serving our community since 2022',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how our community has grown and the impact we've made together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-2xl p-8 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-lg`}
            >
              <div className={`${stat.iconColor} mb-4 flex justify-center`}>
                {stat.icon}
              </div>
              
              <div className="mb-2">
                <AnimatedCounter
                  end={stat.number}
                  duration={2500}
                  delay={index * 200}
                  suffix={stat.suffix}
                  className={`text-4xl font-bold ${stat.color}`}
                  onComplete={() => {
                    // Optional: Add completion callback
                  }}
                />
              </div>
              
              <h3 className={`text-lg font-semibold ${stat.color} mb-2`}>
                {stat.label}
              </h3>
              
              <p className="text-gray-600 text-sm">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional impact section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Join Our Growing Community
            </h3>
            <p className="text-lg opacity-90 mb-6">
              Be part of something bigger. Every member, volunteer, and event contributes to our mission of building a stronger, more connected community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-primary-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Become a Member
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                Volunteer Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection; 