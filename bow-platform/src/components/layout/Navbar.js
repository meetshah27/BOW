import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLogo } from '../../contexts/LogoContext';
import { Menu, X, LogOut, UserCircle, Calendar, Shield, User } from 'lucide-react';
import api from '../../config/api';
import Avatar from '../common/Avatar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logoUrl } = useLogo();

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

  // Logo is now handled by LogoContext

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
      <div className="w-full px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
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
            <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">
              <span className="inline lg:hidden">BOW</span>
              <span className="hidden lg:inline">Beats of Washington</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-center space-x-6 lg:space-x-8 xl:space-x-10 px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-xs lg:text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
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
              className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors duration-200 whitespace-nowrap"
            >
              Donate
            </Link>
          </div>

          {/* Desktop Social Media & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4 ml-4">
            {/* Social Media Links */}
            <div className="flex items-center space-x-2 lg:space-x-3 mr-2 lg:mr-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-600 hover:text-primary-600 transition-colors duration-200`}
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
                  className="flex items-center space-x-1.5 lg:space-x-2 focus:outline-none group"
                >
                  <Avatar 
                    user={currentUser} 
                    size="sm" 
                    className="bg-primary-100"
                  />
                  <span className="text-xs lg:text-sm font-medium text-gray-900 group-hover:text-primary-600 hidden lg:inline truncate max-w-[180px] xl:max-w-[220px]">
                    {currentUser.displayName || 
                     (currentUser.firstName && currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : null) ||
                     currentUser.firstName ||
                     currentUser.email}
                  </span>
                  <svg className="w-3 h-3 lg:w-4 lg:h-4 ml-0.5 lg:ml-1 text-gray-400 group-hover:text-primary-600 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-up backdrop-blur-sm">
                    {/* User Info Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-5 py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar 
                          user={currentUser} 
                          size="lg" 
                          className="bg-white/20 border-2 border-white/30 ring-2 ring-white/20"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-white text-base truncate">
                            {currentUser.displayName || 
                             (currentUser.firstName && currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : null) ||
                             currentUser.firstName ||
                             currentUser.email?.split('@')[0]}
                          </div>
                          <div className="text-sm text-primary-100 truncate">{currentUser.email}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        className="w-full flex items-center px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-150 group"
                        onClick={() => { navigate('/member'); setDropdownOpen(false); }}
                      >
                        <User className="w-5 h-5 mr-3 text-primary-600 group-hover:text-primary-700" /> 
                        <span>Member Portal</span>
                      </button>
                      <button
                        className="w-full flex items-center px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-150 group"
                        onClick={() => { navigate('/member/events'); setDropdownOpen(false); }}
                      >
                        <Calendar className="w-5 h-5 mr-3 text-primary-600 group-hover:text-primary-700" /> 
                        <span>Events Registered</span>
                      </button>
                      
                      {currentUser && currentUser.role === 'admin' && (
                        <button
                          className="w-full flex items-center px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-150 group border-t border-gray-100 mt-1"
                          onClick={() => { navigate('/admin'); setDropdownOpen(false); }}
                        >
                          <Shield className="w-5 h-5 mr-3 text-primary-600 group-hover:text-primary-700" /> 
                          <span>Admin Portal</span>
                        </button>
                      )}
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button
                        className="w-full flex items-center px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-150 group"
                        onClick={() => { signOut(); setDropdownOpen(false); }}
                      >
                        <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" /> 
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 lg:space-x-4">
                <Link to="/login" className="btn-outline text-xs lg:text-sm py-1.5 lg:py-2 px-3 lg:px-4 whitespace-nowrap">
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600 transition-colors duration-200 p-2 -mr-2"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <div className="relative w-6 h-6">
                <Menu 
                  className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} 
                />
                <X 
                  className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} 
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen 
              ? 'max-h-[2000px] opacity-100' 
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className={`px-3 pt-3 pb-4 space-y-1 bg-white border-t border-gray-200 transform transition-transform duration-300 ${
            isOpen ? 'translate-y-0' : '-translate-y-4'
          }`}>
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-2.5 text-sm sm:text-base font-medium rounded-lg transition-all duration-300 ease-out transform ${
                    isOpen 
                      ? 'translate-x-0 opacity-100' 
                      : '-translate-x-4 opacity-0'
                  } ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-600'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                  style={{
                    transitionDelay: isOpen ? `${index * 30}ms` : '0ms'
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Donation Button */}
              <Link
                to="/donate"
                className={`block mx-3 my-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-3 rounded-lg text-center shadow-md transition-all duration-300 ease-out transform ${
                  isOpen 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-2 opacity-0'
                }`}
                style={{
                  transitionDelay: isOpen ? `${navigation.length * 30 + 50}ms` : '0ms'
                }}
                onClick={() => setIsOpen(false)}
              >
                Donate
              </Link>
              
              {/* Mobile Social Media Links */}
              <div className={`border-t border-gray-200 pt-4 mt-4 transition-all duration-300 ease-out transform ${
                isOpen 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-2 opacity-0'
              }`}
              style={{
                transitionDelay: isOpen ? `${navigation.length * 30 + 100}ms` : '0ms'
              }}>
                <div className="px-4 py-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Follow Us</span>
                </div>
                <div className="flex space-x-4 px-4 py-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-600 transition-all duration-200`}
                      onClick={() => setIsOpen(false)}
                      aria-label={social.name}
                    >
                      {social.icon()}
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Mobile Auth Section */}
              <div className={`border-t border-gray-200 pt-4 mt-4 transition-all duration-300 ease-out transform ${
                isOpen 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-2 opacity-0'
              }`}
              style={{
                transitionDelay: isOpen ? `${navigation.length * 30 + 150}ms` : '0ms'
              }}>
                {currentUser ? (
                  <div className="space-y-2">
                    {/* Mobile User Info Card */}
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg px-4 py-3 mx-3 mb-3 shadow-md">
                      <div className="flex items-center space-x-3">
                        <Avatar 
                          user={currentUser} 
                          size="md" 
                          className="bg-white/20 border-2 border-white/30 ring-2 ring-white/20 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-white text-sm sm:text-base truncate">
                            {currentUser.displayName || 
                             (currentUser.firstName && currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : null) ||
                             currentUser.firstName ||
                             currentUser.email?.split('@')[0]}
                          </div>
                          <div className="text-xs sm:text-sm text-primary-100 truncate">{currentUser.email}</div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      className="w-full flex items-center px-4 py-3 mx-3 text-sm sm:text-base font-medium text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 rounded-lg transition-all duration-150"
                      onClick={() => { navigate('/member'); setIsOpen(false); }}
                    >
                      <User className="w-5 h-5 mr-3 text-primary-600 flex-shrink-0" />
                      <span>Member Portal</span>
                    </button>
                    
                    {currentUser && currentUser.role === 'admin' && (
                      <button
                        className="w-full flex items-center px-4 py-3 mx-3 text-sm sm:text-base font-medium text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 rounded-lg transition-all duration-150"
                        onClick={() => { navigate('/admin'); setIsOpen(false); }}
                      >
                        <Shield className="w-5 h-5 mr-3 text-primary-600 flex-shrink-0" />
                        <span>Admin Portal</span>
                      </button>
                    )}
                    <button
                      className="w-full flex items-center px-4 py-3 mx-3 text-sm sm:text-base font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150 mt-2"
                      onClick={() => { signOut(); setIsOpen(false); }}
                    >
                      <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block px-4 py-3 mx-3 text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-150 text-center border border-gray-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
      </div>
    </nav>
  );
};

export default Navbar; 