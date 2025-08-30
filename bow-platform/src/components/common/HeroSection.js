import React from 'react';
import { Heart, Users, Music, Star, MessageCircle, Mail, Phone, MapPin, Calendar, Image, Share2 } from 'lucide-react';

const HeroSection = ({ 
  title, 
  subtitle, 
  description, 
  badge, 
  icon, 
  floatingElements = [], 
  interactiveElements = [],
  logoUrl,
  showLogo = true,
  className = "bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700"
}) => {
  // Default floating elements if none provided
  const defaultFloatingElements = floatingElements.length > 0 ? floatingElements : [
    { icon: Heart, position: 'top-10 left-10', animation: 'animate-float-slow' },
    { icon: Music, position: 'top-20 right-32', animation: 'animate-float-slow-reverse' },
    { icon: Users, position: 'bottom-20 left-32', animation: 'animate-float-slow' },
    { icon: Star, position: 'bottom-32 right-10', animation: 'animate-float-slow-reverse' }
  ];

  // Default interactive elements if none provided
  const defaultInteractiveElements = interactiveElements.length > 0 ? interactiveElements : [
    { icon: Heart, label: 'Community', color: 'text-red-300' },
    { icon: Music, label: 'Music', color: 'text-yellow-300' },
    { icon: Users, label: 'Connection', color: 'text-blue-300' }
  ];

  return (
    <section className={`${className} text-white py-12 relative overflow-hidden`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-white to-yellow-200 rounded-full blur-3xl floating-bg"></div>
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-gradient-to-r from-yellow-200 to-white rounded-full blur-2xl floating-bg" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-white to-orange-200 rounded-full blur-3xl floating-bg opacity-30" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Floating elements */}
      {defaultFloatingElements.map((element, index) => (
        <div key={index} className={`absolute ${element.position} text-white/20 ${element.animation}`}>
          <element.icon className="w-8 h-8" />
        </div>
      ))}
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left side - Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Welcome badge */}
            {badge && (
              <div className="mb-6 animate-fade-in">
                <span className="inline-block bg-white/10 backdrop-blur-sm text-white text-xs font-semibold px-6 py-3 rounded-full tracking-widest uppercase shadow-lg border border-white/20">
                  {badge}
                </span>
              </div>
            )}
            
            {/* Icon */}
            {icon && (
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <icon className="w-10 h-10" />
                </div>
              </div>
            )}
            
            <h1 className="text-3xl md:text-5xl font-bold mb-6 font-display tracking-tight animate-fade-in-up text-glow-hero">
              {title}
            </h1>
            
            {subtitle && (
              <p className="text-base md:text-lg max-w-3xl mx-auto lg:mx-0 leading-relaxed text-primary-100 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                {subtitle}
              </p>
            )}
            
            {description && (
              <p className="text-base md:text-lg max-w-3xl mx-auto lg:mx-0 leading-relaxed text-primary-100 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                {description}
              </p>
            )}
            
            {/* Interactive elements */}
            <div className="mt-8 flex justify-center lg:justify-start space-x-4 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              {defaultInteractiveElements.map((element, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <element.icon className={`w-5 h-5 ${element.color}`} />
                  <span className="text-sm font-medium">{element.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right side - Logo */}
          {showLogo && logoUrl && (
            <div className="flex-shrink-0 animate-fade-in-up" style={{animationDelay: '0.9s'}}>
              <div className="w-48 h-48 bg-primary-600 rounded-full flex items-center justify-center overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500">
                <img 
                  src={logoUrl} 
                  alt="BOW Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
