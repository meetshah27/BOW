import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    organization: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Mission', href: '/about#mission' },
      { name: 'Our Founders', href: '/about#founders' },
      { name: 'Leadership', href: '/about#leadership' },
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
    { name: 'Facebook', href: 'https://www.facebook.com/BeatsOfRedmond/', icon: Facebook },
    { name: 'Instagram', href: 'https://www.instagram.com/beatsofwa/', icon: Instagram },
    { name: 'YouTube', href: 'https://www.youtube.com/c/BeatsOfRedmond', icon: Youtube },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
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
                <span className="text-gray-300">+1 (206) 446 9925</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">contact@beatsofwa.org</span>
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
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 font-medium">Stay updated:</span>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-r-lg transition-colors duration-200">
                  Subscribe
                </button>
              </div>
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
              <span className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>in Washington</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t py-6 mt-12">
        <div className="container-custom text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Beats of Washington. All rights reserved.<br />
          <span className="block mt-2 text-xs text-gray-400">Website developed by <a href="https://www.linkedin.com/in/gaurav-khandekar-943743169" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Gaurav</a> and Meet</span>
        </div>
      </footer>
    </footer>
  );
};

export default Footer; 