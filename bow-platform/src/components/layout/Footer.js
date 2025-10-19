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
        <svg viewBox="0 0 24 24" fill="#1877F3" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="#1877F3"/>
          <path d="M16.5 8.5h-2a.5.5 0 0 0-.5.5v2h2.5l-.5 2H14v6h-2v-6h-2v-2h2v-1.5A2.5 2.5 0 0 1 14.5 7h2v1.5z" fill="#fff"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/beatsofwa/',
      icon: () => (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
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
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
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
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt="BOW Logo" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-lg">B</span>
                )}
              </div>
              <span className="text-xl font-bold">Beats of Washington</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering communities through music, culture, and connection. 
              Serving over 50,000 community members across Washington State.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">9256 225th Way NE, WA 98053</span>
              </div>
                             <div className="flex items-center space-x-3">
                 <Phone className="w-5 h-5 text-primary-400" />
                 <span className="text-gray-300">206 369-9576</span>
               </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">beatsofredmond@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Organization Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Organization</h3>
            <ul className="space-y-3">
              {footerLinks.organization.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Programs</h3>
            <ul className="space-y-3">
              {footerLinks.programs.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Support Us</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 font-medium">Follow us:</span>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-all duration-200"
                    aria-label={`Follow us on ${social.name}`}
                    title={`Follow us on ${social.name}`}
                  >
                    {social.icon()}
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 font-medium">Stay updated:</span>
              <form onSubmit={handleNewsletterSubscribe} className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={isSubscribing}
                />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-r-lg transition-colors duration-200"
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
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <span>&copy; {currentYear} Beats of Washington. All rights reserved.</span>
              <span>•</span>
              <span>501(c)(3) Non-Profit Organization</span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-primary-400 transition-colors duration-200">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-primary-400 transition-colors duration-200">
                Terms of Service
              </Link>
              <span>•</span>
              <Link to="/legal" className="hover:text-primary-400 transition-colors duration-200">
                Legal Notices
              </Link>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>in Washington</span>
              </span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="text-gray-500 text-sm">Website developed by <a href="https://www.linkedin.com/in/gaurav-khandekar-943743169" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-300 hover:underline transition-colors">Gaurav Khandekar</a> and <a href="https://www.linkedin.com/in/meet-deepak-shah-06164437a/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-300 hover:underline transition-colors">Meet Shah</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 