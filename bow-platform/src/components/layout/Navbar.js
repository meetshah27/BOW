import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, LogOut, UserCircle, Calendar, Shield } from 'lucide-react';
import api from '../../config/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [logoUrl, setLogoUrl] = useState('');

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Leadership', href: '/leadership' },
    { name: 'Events', href: '/events' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Get Involved', href: '/get-involved' },
    { name: 'Stories', href: '/stories' },
    { name: 'Contact', href: '/contact' },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/beatsofwa/',
      icon: () => (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="url(#ig-gradient)"/>
          <defs>
            <linearGradient id="ig-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop stop-color="#f58529"/>
              <stop offset="0.5" stop-color="#dd2a7b"/>
              <stop offset="1" stop-color="#515bd4"/>
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="2"/>
          <circle cx="18" cy="6" r="1" fill="#fff"/>
        </svg>
      )
    },
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

  const isActive = (path) => location.pathname === path;

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
    
    // Refresh logo every 30 seconds to catch updates
    const logoRefreshInterval = setInterval(fetchLogo, 30000);
    
    return () => clearInterval(logoRefreshInterval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1 -ml-12">
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
            <span className="text-xl font-bold text-gray-900">Beats of Washington</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {/* Donation Button - positioned after Contact */}
            <Link
              to="/donate"
              className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors duration-200"
            >
              Donate
            </Link>
          </div>

          {/* Desktop Social Media & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Social Media Links */}
            <div className="flex items-center space-x-3 mr-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-600 transition-colors duration-200`}
                  title={social.name}
                >
                  {social.icon()}
                </a>
              ))}
            </div>

            {/* If user is logged in, show profile dropdown */}
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((open) => !open)}
                  className="flex items-center space-x-2 focus:outline-none group"
                >
                  {currentUser.photoURL ? (
                    <>
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || currentUser.email}
                        className="w-8 h-8 rounded-full object-cover border-2 border-primary-600"
                        onError={(e) => {
                          console.error('Failed to load image:', currentUser.photoURL);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center border-2 border-primary-600" style={{display: 'none'}}>
                        <span className="text-primary-700 font-bold">
                          {(currentUser.displayName && currentUser.displayName[0]) ||
                           (currentUser.firstName && currentUser.firstName[0]) ||
                           (currentUser.email && currentUser.email[0]) ||
                           "?"}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center border-2 border-primary-600">
                      <span className="text-primary-700 font-bold">
                        {(currentUser.displayName && currentUser.displayName[0]) ||
                         (currentUser.firstName && currentUser.firstName[0]) ||
                         (currentUser.email && currentUser.email[0]) ||
                         "?"}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                    {currentUser.displayName || 
                     (currentUser.firstName && currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : null) ||
                     currentUser.firstName ||
                     currentUser.email}
                  </span>
                  <svg className="w-4 h-4 ml-1 text-gray-400 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-semibold text-gray-900">
                        {currentUser.displayName || 
                         (currentUser.firstName && currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : null) ||
                         currentUser.firstName ||
                         currentUser.email}
                      </div>
                      <div className="text-xs text-gray-500">{currentUser.email}</div>
                    </div>
                    <button
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
                      onClick={() => { navigate('/member/profile'); setDropdownOpen(false); }}
                    >
                      <UserCircle className="w-4 h-4 mr-2" /> Profile
                    </button>
                    <button
                      className="w-full flex items-center px-4 py-4 text-sm text-gray-700 hover:bg-primary-50"
                      onClick={() => { navigate('/member/events'); setDropdownOpen(false); }}
                    >
                      <Calendar className="w-4 h-4 mr-2" /> Events Registered
                    </button>
                    
                    {currentUser && currentUser.role === 'admin' && (
                      <button
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
                        onClick={() => { navigate('/admin'); setDropdownOpen(false); }}
                      >
                        <Shield className="w-4 h-4 mr-2" /> Beats of Washington
                      </button>
                    )}
                    <button
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 mt-2"
                      onClick={() => { signOut(); setDropdownOpen(false); }}
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn-outline text-sm py-2 px-4">
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Donation Button */}
              <Link
                to="/donate"
                className="block mx-3 my-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-md text-center transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Donate
              </Link>
              
              {/* Mobile Social Media Links */}
              <div className="border-t pt-4 mt-4">
                <div className="px-3 py-2">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Follow Us</span>
                </div>
                <div className="flex space-x-4 px-3 py-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors duration-200`}
                      onClick={() => setIsOpen(false)}
                    >
                      {social.icon()}
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Mobile Auth Section */}
              <div className="border-t pt-4 mt-4">
                {currentUser ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-3 py-2">
                      {currentUser.photoURL ? (
                        <>
                          <img
                            src={currentUser.photoURL}
                            alt={currentUser.displayName || currentUser.email}
                            className="w-8 h-8 rounded-full object-cover border-2 border-primary-600"
                            onError={(e) => {
                              console.error('Failed to load mobile image:', currentUser.photoURL);
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center border-2 border-primary-600" style={{display: 'none'}}>
                            <span className="text-primary-700 font-bold">
                              {(currentUser.displayName && currentUser.displayName[0]) ||
                               (currentUser.firstName && currentUser.firstName[0]) ||
                               (currentUser.email && currentUser.email[0]) ||
                               "?"}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center border-2 border-primary-600">
                          <span className="text-primary-700 font-bold">
                            {(currentUser.displayName && currentUser.displayName[0]) ||
                             (currentUser.firstName && currentUser.firstName[0]) ||
                             (currentUser.email && currentUser.email[0]) ||
                             "?"}
                          </span>
                        </div>
                      )}
                      <span className="text-sm text-gray-700">
                        {currentUser.displayName || 
                         (currentUser.firstName && currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : null) ||
                         currentUser.firstName ||
                         currentUser.email}
                      </span>
                    </div>
                    
                    {currentUser && currentUser.role === 'admin' && (
                      <button
                        className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                        onClick={() => { navigate('/admin'); setIsOpen(false); }}
                      >
                        <Shield className="w-4 h-4 inline mr-2" />
                        Beats of Washington
                      </button>
                    )}
                    <button
                      className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                      onClick={() => { signOut(); setIsOpen(false); }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 