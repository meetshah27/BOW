import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, User, LogOut, Instagram, Facebook, Youtube, UserCircle, Calendar } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout, userRole, userData, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      icon: Instagram,
      color: 'hover:text-pink-600'
    },
    { 
      name: 'Facebook', 
      href: 'https://www.facebook.com/BeatsOfRedmond/', 
      icon: Facebook,
      color: 'hover:text-blue-600'
    },
    { 
      name: 'YouTube', 
      href: 'https://www.youtube.com/c/BeatsOfRedmond', 
      icon: Youtube,
      color: 'hover:text-red-600'
    }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

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
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
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
                  className={`text-gray-600 transition-colors duration-200 ${social.color}`}
                  title={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* If user is logged in, show profile dropdown */}
            {userData ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((open) => !open)}
                  className="flex items-center space-x-2 focus:outline-none group"
                >
                  {userData.photoURL ? (
                    <img
                      src={userData.photoURL}
                      alt={userData.displayName || userData.email}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary-600"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center border-2 border-primary-600">
                      <span className="text-primary-700 font-bold">
                        {(userData.displayName && userData.displayName[0]) ||
                         (userData.email && userData.email[0]) ||
                         "?"}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                    {userData.displayName || userData.email}
                  </span>
                  <svg className="w-4 h-4 ml-1 text-gray-400 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-semibold text-gray-900">{userData.displayName || userData.email}</div>
                      <div className="text-xs text-gray-500">{userData.email}</div>
                    </div>
                    <button
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
                      onClick={() => { navigate('/member/profile'); setDropdownOpen(false); }}
                    >
                      <UserCircle className="w-4 h-4 mr-2" /> Profile
                    </button>
                    <button
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
                      onClick={() => { navigate('/member/events'); setDropdownOpen(false); }}
                    >
                      <Calendar className="w-4 h-4 mr-2" /> Events Registered
                    </button>
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
                <Link to="/donate" className="btn-primary text-sm py-2 px-4">
                  Donate
                </Link>
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
                      className={`flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors duration-200 ${social.color}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <social.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Mobile Auth Section */}
              <div className="border-t pt-4 mt-4">
                {userData ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-3 py-2">
                      {userData.photoURL ? (
                        <img
                          src={userData.photoURL}
                          alt={userData.displayName || userData.email}
                          className="w-8 h-8 rounded-full object-cover border-2 border-primary-600"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center border-2 border-primary-600">
                          <span className="text-primary-700 font-bold">
                            {(userData.displayName && userData.displayName[0]) ||
                             (userData.email && userData.email[0]) ||
                             "?"}
                          </span>
                        </div>
                      )}
                      <span className="text-sm text-gray-700">
                        {userData.displayName || userData.email}
                      </span>
                    </div>
                    
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
                      to="/donate"
                      className="block px-3 py-2 text-base font-medium text-primary-600 hover:bg-primary-50"
                      onClick={() => setIsOpen(false)}
                    >
                      Donate
                    </Link>
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