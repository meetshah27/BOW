import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Facebook, 
  Instagram, 
  Youtube,
  MessageCircle,
  Users,
  ArrowRight,
  Heart,
  Sparkles,
  Star,
  Zap,
  Globe,
  Coffee
} from 'lucide-react';
import HeroSection from '../components/common/HeroSection';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  // Fetch logo from about page content
  React.useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch('/api/about-page');
        if (response.ok) {
          const data = await response.json();
          setLogoUrl(data.logo || '');
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
    fetchLogo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      alert('Thank you for your message! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
              value: "beatsofredmond@gmail.com",
      link: "mailto:beatsofredmond@gmail.com",
      iconColor: "text-blue-600",
      bgColor: "from-blue-500 to-blue-600"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "206 369-9576",
      link: "tel:+12063699576",
      iconColor: "text-green-600",
      bgColor: "from-green-500 to-green-600"
    },
    {
      icon: MapPin,
      title: "Address",
      value: "9256 225th Way NE, WA 98053",
      link: "https://maps.google.com",
      iconColor: "text-red-600",
      bgColor: "from-red-500 to-red-600"
    },
    {
      icon: Clock,
      title: "Office Hours",
      value: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM",
      iconColor: "text-purple-600",
      bgColor: "from-purple-500 to-purple-600"
    }
  ];

  const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/BeatsOfRedmond/', icon: Facebook },
    { name: 'Instagram', href: 'https://www.instagram.com/beatsofwa/', icon: Instagram },
    { name: 'YouTube', href: 'https://www.youtube.com/c/BeatsOfRedmond', icon: Youtube }
  ];

  const departments = [
    {
      name: "General Inquiries",
      email: "beatsofredmond@gmail.com",
      description: "For general questions about our organization and programs"
    },
    {
      name: "Event Planning",
      email: "beatsofredmond@gmail.com",
      description: "For questions about hosting or participating in events"
    },
    {
      name: "Volunteer Coordination",
      email: "beatsofredmond@gmail.com",
      description: "For volunteer opportunities and coordination"
    },
    {
      name: "Media & Press",
      email: "beatsofredmond@gmail.com",
      description: "For press inquiries and media partnerships"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - Beats of Washington</title>
        <meta name="description" content="Get in touch with Beats of Washington. We'd love to hear from you about events, volunteering, partnerships, or any questions you may have." />
      </Helmet>

      {/* Hero Section */}
      <HeroSection
        title="Get in Touch"
        description="We'd love to hear from you! Whether you have questions, want to volunteer, or are interested in partnering with us, we're here to help."
        badge="💬 Let's Connect 💬"
        logoUrl={logoUrl}
        showLogo={true}
        floatingElements={[
          { icon: MessageCircle, position: 'top-10 left-10', animation: 'animate-float-slow' },
          { icon: Mail, position: 'top-20 right-32', animation: 'animate-float-slow-reverse' },
          { icon: Phone, position: 'bottom-20 left-32', animation: 'animate-float-slow' },
          { icon: MapPin, position: 'bottom-32 right-10', animation: 'animate-float-slow-reverse' },
          { icon: Heart, position: 'top-32 left-1/3', animation: 'animate-float-slow' },
          { icon: Sparkles, position: 'bottom-10 right-1/3', animation: 'animate-float-slow-reverse' },
          { icon: Star, position: 'top-1/2 left-5', animation: 'animate-float-slow' },
          { icon: Zap, position: 'top-1/3 right-5', animation: 'animate-float-slow-reverse' }
        ]}
        interactiveElements={[
          { icon: MessageCircle, label: 'Message', color: 'text-teal-300' },
          { icon: Phone, label: 'Call', color: 'text-blue-300' },
          { icon: Mail, label: 'Email', color: 'text-cyan-300' },
          { icon: Heart, label: 'Love', color: 'text-pink-300' },
          { icon: Coffee, label: 'Chat', color: 'text-amber-300' }
        ]}
      />

      {/* Contact Information */}
      <section className="py-24 bg-gradient-to-br from-white via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Enhanced background decorative elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full blur-3xl floating-bg animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-r from-secondary-200 to-primary-200 rounded-full blur-2xl floating-bg animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full blur-2xl floating-bg animate-pulse" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full blur-3xl floating-bg animate-pulse" style={{animationDelay: '6s'}}></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-particle particle-1"></div>
          <div className="floating-particle particle-2"></div>
          <div className="floating-particle particle-3"></div>
          <div className="floating-particle particle-4"></div>
          <div className="floating-particle particle-5"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="inline-block mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl transform hover:scale-110 transition-all duration-500">
                <MessageCircle className="w-10 h-10 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white animate-spin" />
              </div>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent animate-text-shine">
              Contact Information
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Reach out to us through any of these channels. We're here to help and excited to connect with you! 
              <span className="inline-block ml-2">✨</span>
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div 
                key={index} 
                className="text-center group transform transition-all duration-700 hover:scale-110 hover:-translate-y-4 relative"
                style={{animationDelay: `${index * 0.15}s`}}
              >
                 {/* Enhanced glow effect */}
                 <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-2xl blur-2xl opacity-30 group-hover:opacity-60 transition-all duration-700 transform scale-110 group-hover:scale-125 animate-pulse"></div>
                
                {/* Card background with gradient */}
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 group-hover:shadow-3xl transition-all duration-700 transform group-hover:rotate-1">
                  {/* Decorative corner elements */}
                  <div className="absolute top-2 right-2 w-4 h-4 bg-gradient-to-r from-primary-300 to-secondary-300 rounded-full opacity-50 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                  <div className="absolute bottom-2 left-2 w-3 h-3 bg-gradient-to-r from-secondary-300 to-primary-300 rounded-full opacity-50 group-hover:opacity-100 transition-all duration-500 animate-pulse" style={{transitionDelay: '0.2s'}}></div>
                  
                  <div className="relative flex justify-center mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${info.bgColor} rounded-2xl flex items-center justify-center shadow-2xl transform transition-all duration-500 scale-110 ${info.title === "Office Hours" ? "" : "rotate-3"} group-hover:scale-125 ${info.title === "Office Hours" ? "group-hover:rotate-3" : "group-hover:rotate-12"} group-hover:shadow-3xl relative overflow-hidden animate-bounce`} style={{animationDuration: '3s', animationDelay: `${index * 0.5}s`}}>
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer"></div>
                      <info.icon className={`w-10 h-10 text-white relative z-10 ${info.title === "Office Hours" ? "animate-spin" : ""}`} style={info.title === "Office Hours" ? {animationDuration: '4s', animationDelay: `${index * 0.3}s`} : {}} />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-500">
                  {info.title}
                </h3>
                  
                  {info.link ? (
                    <a
                      href={info.link}
                      className={`text-gray-600 hover:${info.iconColor} transition-all duration-300 hover:scale-105 inline-block font-medium group/link`}
                    >
                      <span className="group-hover/link:underline decoration-2 underline-offset-4">
                        {info.value}
                      </span>
                    </a>
                  ) : (
                    <p className="text-gray-600 font-medium">{info.value}</p>
                  )}
                  
                  {/* Hover indicator */}
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r ${info.bgColor} group-hover:w-16 transition-all duration-500 rounded-full animate-pulse`} style={{animationDelay: `${index * 0.2}s`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Departments */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Enhanced background decorative elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full blur-3xl floating-bg animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-r from-secondary-200 to-primary-200 rounded-full blur-2xl floating-bg animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-gradient-to-r from-green-200 to-blue-200 rounded-full blur-3xl floating-bg animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-particle particle-1" style={{top: '20%', left: '15%', animationDelay: '1s'}}></div>
          <div className="floating-particle particle-2" style={{top: '60%', right: '20%', animationDelay: '3s'}}></div>
          <div className="floating-particle particle-3" style={{bottom: '30%', left: '25%', animationDelay: '5s'}}></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Enhanced Contact Form */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-white/50 transform transition-all duration-700 hover:scale-105 hover:shadow-3xl relative overflow-hidden group">
              {/* Enhanced form background decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-all duration-500"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-secondary-100 to-primary-100 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-500" style={{transitionDelay: '0.3s'}}></div>
              
              {/* Decorative corner elements */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-primary-300 to-secondary-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-r from-secondary-300 to-primary-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" style={{transitionDelay: '0.5s'}}></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur-lg opacity-30 group-hover:opacity-60 transition-all duration-500"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mr-6 shadow-xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <Send className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    Send us a Message
                  </h2>
                    <p className="text-gray-600 mt-2">We'd love to hear from you! ✨</p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="group relative">
                      <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-3 group-hover:text-primary-600 transition-colors duration-300 flex items-center">
                        <Star className="w-4 h-4 mr-2 text-primary-500" />
                        Full Name *
                      </label>
                      <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 hover:border-primary-300 hover:shadow-lg bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 font-medium"
                        placeholder="Enter your full name"
                      />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                    <div className="group relative">
                      <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3 group-hover:text-primary-600 transition-colors duration-300 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-primary-500" />
                        Email Address *
                      </label>
                      <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 hover:border-primary-300 hover:shadow-lg bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 font-medium"
                        placeholder="Enter your email"
                      />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group relative">
                    <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-3 group-hover:text-primary-600 transition-colors duration-300 flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2 text-primary-500" />
                      Subject *
                    </label>
                    <div className="relative">
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 hover:border-primary-300 hover:shadow-lg bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 font-medium"
                      placeholder="What is this regarding?"
                    />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                  
                  <div className="group relative">
                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-3 group-hover:text-primary-600 transition-colors duration-300 flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2 text-primary-500" />
                      Message *
                    </label>
                    <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 hover:border-primary-300 hover:shadow-lg bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 font-medium resize-none"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 text-white text-xl py-5 px-8 rounded-2xl font-bold transform transition-all duration-500 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group/btn"
                  >
                    {/* Enhanced button background effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-700 via-secondary-700 to-primary-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                    
                    <div className="relative flex items-center justify-center">
                      {loading ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                          <span className="text-lg">Sending your message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-6 h-6 mr-3 group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-transform duration-300" />
                          <span className="text-lg">Send Message</span>
                          <Sparkles className="w-5 h-5 ml-2 group-hover/btn:animate-spin transition-all duration-300" />
                        </>
                      )}
                    </div>
                  </button>
                </form>
              </div>
            </div>

            {/* Enhanced Departments */}
            <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary-400 to-primary-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-2xl flex items-center justify-center mr-6 shadow-xl transform transition-all duration-500 hover:scale-110 hover:rotate-6">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">
                  Contact by Department
                </h2>
                  <p className="text-gray-600 mt-2">Connect with the right team! 🎯</p>
                </div>
              </div>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                For specific inquiries, you can reach out directly to the appropriate department.
                Each team is specialized and ready to help! ✨
              </p>
              
              <div className="space-y-8">
                {departments.map((dept, index) => (
                  <div 
                    key={index} 
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 hover:shadow-2xl group cursor-pointer relative overflow-hidden"
                    style={{animationDelay: `${index * 0.15}s`}}
                  >
                    {/* Enhanced background effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
                    
                    {/* Decorative corner elements */}
                    <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-primary-300 to-secondary-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                    <div className="absolute bottom-3 left-3 w-4 h-4 bg-gradient-to-r from-secondary-300 to-primary-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" style={{transitionDelay: '0.3s'}}></div>
                    
                    <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mr-4 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                              <Users className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                          {dept.name}
                        </h3>
                          </div>
                          <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                          {dept.description}
                        </p>
                        <a
                          href={`mailto:${dept.email}`}
                            className="text-primary-600 hover:text-primary-700 font-bold inline-flex items-center group-hover:scale-105 transition-all duration-300 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-xl"
                        >
                            <Mail className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                          {dept.email}
                        </a>
                      </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12">
                          <ArrowRight className="w-6 h-6 text-primary-600" />
                        </div>
                      </div>
                      
                      {/* Progress indicator */}
                      <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-500 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Social Media */}
      <section className="py-24 bg-gradient-to-br from-white via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Enhanced background decorative elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full blur-3xl floating-bg animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-secondary-200 to-primary-200 rounded-full blur-2xl floating-bg animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full blur-3xl floating-bg animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-particle particle-1" style={{top: '25%', left: '20%', animationDelay: '2s'}}></div>
          <div className="floating-particle particle-2" style={{top: '70%', right: '25%', animationDelay: '4s'}}></div>
          <div className="floating-particle particle-3" style={{bottom: '40%', left: '30%', animationDelay: '6s'}}></div>
          <div className="floating-particle particle-4" style={{top: '50%', right: '15%', animationDelay: '8s'}}></div>
        </div>
        
        <div className="container-custom text-center relative z-10">
          <div className="mb-20 animate-fade-in-up">
            <div className="inline-block mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl transform hover:scale-110 transition-all duration-500">
                <Users className="w-10 h-10 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Heart className="w-3 h-3 text-white animate-bounce" />
              </div>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent animate-text-shine">
              Connect With Us
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Follow us on social media to stay updated on events, community stories, 
              and the latest news from Beats of Washington. Join our vibrant community! 
              <span className="inline-block ml-2">🌟</span>
            </p>
          </div>
          
          <div className="flex justify-center space-x-8">
            {socialLinks.map((social, index) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-24 h-24 bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white hover:from-primary-600 hover:via-secondary-600 hover:to-primary-700 transform transition-all duration-500 hover:scale-125 hover:-translate-y-4 hover:shadow-3xl group relative overflow-hidden"
                aria-label={`Follow us on ${social.name}`}
                title={`Follow us on ${social.name}`}
                style={{animationDelay: `${index * 0.2}s`}}
              >
                {/* Enhanced background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Decorative corner elements */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                <div className="absolute bottom-2 left-2 w-2 h-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" style={{transitionDelay: '0.3s'}}></div>
                
                <social.icon className="w-10 h-10 relative z-10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500" />
                
                {/* Hover indicator */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-white/60 group-hover:w-16 transition-all duration-500 rounded-full"></div>
              </a>
            ))}
          </div>
          
          {/* Additional call to action */}
          <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-primary-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Join Our Global Community</h3>
            </div>
            <p className="text-gray-600 text-lg">
              Be part of our growing family of music lovers, cultural enthusiasts, and community builders. 
              Together, we're creating beautiful memories and lasting connections! 
              <span className="inline-block ml-2">🎵</span>
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Map Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Enhanced background decorative elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full blur-3xl floating-bg animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-r from-secondary-200 to-primary-200 rounded-full blur-2xl floating-bg animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-r from-green-200 to-blue-200 rounded-full blur-3xl floating-bg animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-particle particle-1" style={{top: '30%', left: '25%', animationDelay: '3s'}}></div>
          <div className="floating-particle particle-2" style={{top: '60%', right: '30%', animationDelay: '5s'}}></div>
          <div className="floating-particle particle-3" style={{bottom: '35%', left: '35%', animationDelay: '7s'}}></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-block mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl transform hover:scale-110 transition-all duration-500">
                <MapPin className="w-10 h-10 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white animate-spin" />
              </div>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent animate-text-shine">
              Visit Our Office
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Stop by our office to learn more about our programs, pick up event materials, 
              or just say hello! We'd love to meet you in person! 
              <span className="inline-block ml-2">🏢</span>
            </p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-700 hover:scale-105 hover:shadow-3xl border border-white/50 relative group">
            {/* Decorative corner elements */}
            <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-primary-300 to-secondary-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse z-10"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-r from-secondary-300 to-primary-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse z-10" style={{transitionDelay: '0.3s'}}></div>
            
            <div className="aspect-w-16 aspect-h-9 relative">
              <iframe
                title="Beats of Washington Office Map"
                src="https://www.google.com/maps?q=9256+225th+Way+NE,+WA+98053&output=embed"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-96 border-0"
              ></iframe>
              
              {/* Overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
            
            {/* Map info overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-primary-600 mr-3" />
                <div>
                  <p className="font-bold text-gray-900">Beats of Washington Office</p>
                  <p className="text-gray-600">9256 225th Way NE, WA 98053</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="py-24 bg-gradient-to-br from-white via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Enhanced background decorative elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full blur-3xl floating-bg animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-secondary-200 to-primary-200 rounded-full blur-2xl floating-bg animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-3xl floating-bg animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-particle particle-1" style={{top: '20%', left: '15%', animationDelay: '4s'}}></div>
          <div className="floating-particle particle-2" style={{top: '70%', right: '20%', animationDelay: '6s'}}></div>
          <div className="floating-particle particle-3" style={{bottom: '30%', left: '25%', animationDelay: '8s'}}></div>
          <div className="floating-particle particle-4" style={{top: '40%', right: '30%', animationDelay: '10s'}}></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-block mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl transform hover:scale-110 transition-all duration-500">
                <MessageCircle className="w-10 h-10 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Zap className="w-3 h-3 text-white animate-bounce" />
              </div>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent animate-text-shine">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Find quick answers to common questions about our organization and programs.
              Still have questions? We're here to help! 
              <span className="inline-block ml-2">❓</span>
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="space-y-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 hover:shadow-2xl group cursor-pointer relative overflow-hidden">
                {/* Enhanced background effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
                
                {/* Decorative corner elements */}
                <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-primary-300 to-secondary-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mr-4 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                  How can I volunteer with BOW?
                </h3>
                  </div>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                  Visit our Get Involved page to learn about volunteer opportunities. 
                  You can also email us at beatsofredmond@gmail.com for more information.
                </p>
                  
                  {/* Progress indicator */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 hover:shadow-2xl group cursor-pointer relative overflow-hidden">
                {/* Enhanced background effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
                
                {/* Decorative corner elements */}
                <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-secondary-300 to-primary-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center mr-4 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                  Are your events free to attend?
                </h3>
                  </div>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                  Many of our events are free or low-cost. Check individual event pages 
                  for specific pricing information.
                </p>
                  
                  {/* Progress indicator */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-secondary-500 to-primary-500 group-hover:w-full transition-all duration-500 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 hover:shadow-2xl group cursor-pointer relative overflow-hidden">
                {/* Enhanced background effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
                
                {/* Decorative corner elements */}
                <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-primary-300 to-secondary-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mr-4 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <Coffee className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                  Can I host an event with BOW?
                </h3>
                  </div>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                  Yes! We love partnering with community members. Contact our events team 
                  at beatsofredmond@gmail.com to discuss your idea.
                </p>
                  
                  {/* Progress indicator */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 hover:shadow-2xl group cursor-pointer relative overflow-hidden">
                {/* Enhanced background effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
                
                {/* Decorative corner elements */}
                <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-secondary-300 to-primary-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center mr-4 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                  How can I make a donation?
                </h3>
                  </div>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                  You can donate online through our Donate page, or contact us directly 
                  for other donation options.
                </p>
                  
                  {/* Progress indicator */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-secondary-500 to-primary-500 group-hover:w-full transition-all duration-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage; 