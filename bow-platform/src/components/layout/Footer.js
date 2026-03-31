import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../config/api';


const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  const footerLinks = {
    organization: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Mission', href: '/about' },
      { name: 'Our Founders', href: '/about' },
      { name: 'Leadership', href: '/leadership' },
      { name: 'Contact', href: '/contact' },
    ],
    programs: [
      { name: 'Events', href: '/events' },
      { name: 'Gallery', href: '/gallery' },
      { name: 'Get Involved', href: '/get-involved' },
      { name: 'Stories', href: '/stories' },
    ],
    support: [
      { name: 'Donate', href: '/donate' },
      { name: 'Volunteer', href: '/get-involved' },
      { name: 'Become a Member', href: '/get-involved' },
      { name: 'Partner With Us', href: '/contact' },
    ],
  };

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/BeatsOfRedmond/',
      icon: () => (
        <svg viewBox="0 0 24 24" fill="#1877F3" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="#1877F3"/>
          <path d="M16.5 8.5h-2a.5.5 0 0 0-.5.5v2h2.5l-.5 2H14v6h-2v-6h-2v-2h2v-1.5A2.5 2.5 0 0 1 14.5 7h2v1.5z" fill="#fff"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/beatsofwa/',
      icon: () => (
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="url(#ig-gradient)"/>
          <defs>
            <linearGradient id="ig-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f58529"/>
              <stop offset="0.5" stopColor="#dd2a7b"/>
              <stop offset="1" stopColor="#515bd4"/>
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="2"/>
          <circle cx="18" cy="6" r="1" fill="#fff"/>
        </svg>
      )
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/c/BeatsOfRedmond',
      icon: () => (
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="#FF0000"/>
          <polygon points="10,8 16,12 10,16" fill="#fff"/>
        </svg>
      )
    }
  ];

  // Fetch logo from about page content
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await api.get('/about-page');
        if (response.ok) {
          const data = await response.json();
          if (data.logo) {
            setLogoUrl(data.logo);
          }
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
    
    fetchLogo();
  }, []);

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);
    
    try {
      const response = await api.post('/newsletter/subscribe', { email: email.trim() });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Successfully subscribed to newsletter!');
        setEmail('');
      } else {
        toast.error(data.message || 'Failed to subscribe to newsletter');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Failed to subscribe. Please try again later.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container-custom px-4 sm:px-6 py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          {/* Organization Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4 sm:mb-5 md:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt="BOW Logo" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-base sm:text-lg">B</span>
                )}
              </div>
              <span className="text-lg sm:text-xl font-bold break-words">Beats of Washington</span>
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-5 md:mb-6 leading-relaxed break-words">
              Empowering communities through music, culture, and connection. 
              Serving over 50,000 community members across Washington State.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-start sm:items-center space-x-2 sm:space-x-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span className="text-xs sm:text-sm text-gray-300 break-words">9256 225th Way NE, WA 98053</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-300 break-words">206 369-9576</span>
              </div>
              <div className="flex items-start sm:items-center space-x-2 sm:space-x-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span className="text-xs sm:text-sm text-gray-300 break-all">beatsofredmond@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Organization Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5 md:mb-6 break-words">Organization</h3>
            <ul className="space-y-2 sm:space-y-2.5 md:space-y-3">
              {footerLinks.organization.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-xs sm:text-sm text-gray-300 hover:text-primary-400 transition-colors duration-200 break-words"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5 md:mb-6 break-words">Programs</h3>
            <ul className="space-y-2 sm:space-y-2.5 md:space-y-3">
              {footerLinks.programs.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-xs sm:text-sm text-gray-300 hover:text-primary-400 transition-colors duration-200 break-words"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5 md:mb-6 break-words">Support Us</h3>
            <ul className="space-y-2 sm:space-y-2.5 md:space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-xs sm:text-sm text-gray-300 hover:text-primary-400 transition-colors duration-200 break-words"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="border-t border-gray-800 mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-7 md:pt-8">
          <div className="flex flex-col space-y-6 sm:space-y-6 md:space-y-0 md:flex-row md:justify-between md:items-center">
            {/* Social Media */}
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
              <span className="text-sm sm:text-base text-gray-300 font-medium flex-shrink-0 text-center sm:text-left">Follow us:</span>
              <div className="flex space-x-3 justify-center sm:justify-start">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-all duration-200 flex-shrink-0"
                    aria-label={`Follow us on ${social.name}`}
                    title={`Follow us on ${social.name}`}
                  >
                    <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                      {social.icon()}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div id="newsletter-signup" className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4 w-full sm:w-auto">
              <span className="text-sm sm:text-base text-gray-300 font-medium flex-shrink-0 text-center sm:text-left">Stay updated:</span>
              <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-2.5 sm:gap-0 w-full sm:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:w-auto flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg sm:rounded-l-lg sm:rounded-r-none text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-0"
                  disabled={isSubscribing}
                />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-2 text-sm sm:text-base bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-r-lg sm:rounded-l-none transition-colors duration-200 whitespace-nowrap"
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container-custom px-4 sm:px-6 py-5 sm:py-6">
          <div className="flex flex-col space-y-5 sm:space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
            {/* Copyright Section */}
            <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-2 text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              <span className="break-words">&copy; {currentYear} Beats of Washington. All rights reserved.</span>
              <span className="hidden sm:inline text-gray-500">•</span>
              <span className="break-words">501(c)(3) Non-Profit Organization</span>
            </div>
            
            {/* Links Section */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2.5 sm:space-y-0 sm:space-x-3 md:space-x-4 text-xs sm:text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-primary-400 transition-colors duration-200 break-words text-center sm:text-left">
                Privacy Policy
              </Link>
              <span className="hidden sm:inline text-gray-500">•</span>
              <Link to="/terms" className="hover:text-primary-400 transition-colors duration-200 break-words text-center sm:text-left">
                Terms of Service
              </Link>
              <span className="hidden sm:inline text-gray-500">•</span>
              <Link to="/legal" className="hover:text-primary-400 transition-colors duration-200 break-words text-center sm:text-left">
                Legal Notices
              </Link>
              <span className="hidden sm:inline text-gray-500">•</span>
              <span className="flex items-center justify-center sm:justify-start space-x-1 break-words">
                <span>Made with</span>
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
                <span>in Washington</span>
              </span>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 md:mt-5 text-center">
            <span className="text-gray-500 text-xs sm:text-sm break-words px-2 block">
              Website developed by{' '}
              <a
                href="https://www.instagram.com/gauravkhandekar_/?igsh=bm1zNjVpYThvOW5h&utm_source=qr#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
              >
                Gaurav Khandekar
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 