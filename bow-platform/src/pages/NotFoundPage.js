import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowLeft, Search, Users, Calendar } from 'lucide-react';

const NotFoundPage = () => {
  const quickLinks = [
    {
      title: 'Home',
      description: 'Return to our homepage',
      href: '/',
      icon: Home
    },
    {
      title: 'Events',
      description: 'Browse upcoming events',
      href: '/events',
      icon: Calendar
    },
    {
      title: 'Get Involved',
      description: 'Learn about volunteering',
      href: '/get-involved',
      icon: Users
    },
    {
      title: 'Contact',
      description: 'Get in touch with us',
      href: '/contact',
      icon: Search
    }
  ];

  return (
    <>
      <Helmet>
        <title>Page Not Found - Beats of Washington</title>
        <meta name="description" content="The page you're looking for doesn't exist. Find your way back to Beats of Washington." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary-600 leading-none">
              404
            </h1>
          </div>

          {/* Main Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Sorry, the page you're looking for doesn't exist or has been moved. 
              Let's get you back on track!
            </p>
          </div>

          {/* Quick Links */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="group p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-primary-300"
                >
                  <div className="flex items-center justify-center mb-2">
                    <link.icon className="w-6 h-6 text-primary-600 group-hover:text-primary-700" />
                  </div>
                  <h4 className="font-medium text-gray-900 group-hover:text-primary-600">
                    {link.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {link.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/"
              className="btn-primary w-full justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Homepage
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="btn-outline w-full justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Still can't find what you're looking for?{' '}
              <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
                Contact us
              </Link>{' '}
              and we'll help you out!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage; 