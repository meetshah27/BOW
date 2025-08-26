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
  ArrowRight
} from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

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
      value: "contact@beatsofwa.org",
      link: "mailto:contact@beatsofwa.org"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+1 (206) 446 9925",
      link: "tel:+12064469925"
    },
    {
      icon: MapPin,
      title: "Address",
      value: "9256 225th Way NE, WA 98053",
      link: "https://maps.google.com"
    },
    {
      icon: Clock,
      title: "Office Hours",
      value: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM"
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
      email: "contact@beatsofwa.org",
      description: "For general questions about our organization and programs"
    },
    {
      name: "Event Planning",
      email: "contact@beatsofwa.org",
      description: "For questions about hosting or participating in events"
    },
    {
      name: "Volunteer Coordination",
      email: "contact@beatsofwa.org",
      description: "For volunteer opportunities and coordination"
    },
    {
      name: "Media & Press",
      email: "contact@beatsofwa.org",
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
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-white to-teal-200 rounded-full blur-3xl floating-bg"></div>
          <div className="absolute bottom-20 left-20 w-56 h-56 bg-gradient-to-r from-teal-200 to-white rounded-full blur-2xl floating-bg" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-white to-cyan-200 rounded-full blur-3xl floating-bg opacity-30" style={{animationDelay: '4s'}}></div>
        </div>
        
        {/* Floating contact elements */}
        <div className="absolute top-10 left-10 text-white/20 animate-float-slow">
          <MessageCircle className="w-8 h-8" />
        </div>
        <div className="absolute top-20 right-32 text-white/20 animate-float-slow-reverse">
          <Mail className="w-6 h-6" />
        </div>
        <div className="absolute bottom-20 left-32 text-white/20 animate-float-slow">
          <Phone className="w-7 h-7" />
        </div>
        <div className="absolute bottom-32 right-10 text-white/20 animate-float-slow-reverse">
          <MapPin className="w-6 h-6" />
        </div>
        
        <div className="container-custom text-center relative z-10">
          {/* Welcome badge */}
          <div className="mb-6 animate-fade-in">
            <span className="inline-block bg-white/10 backdrop-blur-sm text-white text-xs font-semibold px-6 py-3 rounded-full tracking-widest uppercase shadow-lg border border-white/20">
              💬 Let's Connect 💬
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up text-glow-hero">
            Get in Touch
          </h1>
          
          <p className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            We'd love to hear from you! Whether you have questions, want to volunteer, 
            or are interested in partnering with us, we're here to help.
          </p>
          
          {/* Interactive elements */}
          <div className="mt-8 flex justify-center space-x-4 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <MessageCircle className="w-5 h-5 text-teal-300" />
              <span className="text-sm font-medium">Message</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Phone className="w-5 h-5 text-blue-300" />
              <span className="text-sm font-medium">Call</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Mail className="w-5 h-5 text-cyan-300" />
              <span className="text-sm font-medium">Email</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full blur-3xl floating-bg"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-r from-secondary-200 to-primary-200 rounded-full blur-2xl floating-bg" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-block mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Contact Information
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Reach out to us through any of these channels. We're here to help!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div 
                key={index} 
                className="text-center group transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"></div>
                  <div className="relative flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center shadow-xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2">
                      <info.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                  {info.title}
                </h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200 hover:scale-105 inline-block"
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="text-gray-600">{info.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Departments */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full blur-3xl floating-bg"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-r from-secondary-200 to-primary-200 rounded-full blur-2xl floating-bg" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 transform transition-all duration-500 hover:scale-105 hover:shadow-3xl relative overflow-hidden">
              {/* Form background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full blur-2xl opacity-50"></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Send us a Message
                  </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="input-field transform transition-all duration-300 hover:scale-105 focus:scale-105 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="group">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="input-field transform transition-all duration-300 hover:scale-105 focus:scale-105 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div className="group">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="input-field transform transition-all duration-300 hover:scale-105 focus:scale-105 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="What is this regarding?"
                    />
                  </div>
                  
                  <div className="group">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="input-field resize-none transform transition-all duration-300 hover:scale-105 focus:scale-105 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-lg py-4 px-6 rounded-xl font-semibold transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-secondary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                          Send Message
                        </>
                      )}
                    </div>
                  </button>
                </form>
              </div>
            </div>

            {/* Departments */}
            <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Contact by Department
                </h2>
              </div>
              <p className="text-lg text-gray-600 mb-8">
                For specific inquiries, you can reach out directly to the appropriate department.
              </p>
              
              <div className="space-y-6">
                {departments.map((dept, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-xl group cursor-pointer"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                          {dept.name}
                        </h3>
                        <p className="text-gray-600 mb-3 group-hover:text-gray-700 transition-colors duration-300">
                          {dept.description}
                        </p>
                        <a
                          href={`mailto:${dept.email}`}
                          className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center group-hover:scale-105 transition-all duration-300"
                        >
                          {dept.email}
                          <Mail className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </a>
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <ArrowRight className="w-4 h-4 text-primary-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full blur-3xl floating-bg"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-secondary-200 to-primary-200 rounded-full blur-2xl floating-bg" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container-custom text-center relative z-10">
          <div className="mb-16 animate-fade-in-up">
            <div className="inline-block mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Connect With Us
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Follow us on social media to stay updated on events, community stories, 
              and the latest news from Beats of Washington.
            </p>
          </div>
          
          <div className="flex justify-center space-x-6">
            {socialLinks.map((social, index) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center text-white hover:from-primary-600 hover:to-secondary-700 transform transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:shadow-2xl group relative overflow-hidden"
                aria-label={`Follow us on ${social.name}`}
                title={`Follow us on ${social.name}`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
                <social.icon className="w-8 h-8 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full blur-3xl floating-bg"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-r from-secondary-200 to-primary-200 rounded-full blur-2xl floating-bg" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-block mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Visit Our Office
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stop by our office to learn more about our programs, pick up event materials, 
              or just say hello!
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-3xl border border-gray-100">
            <div className="aspect-w-16 aspect-h-9">
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
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full blur-3xl floating-bg"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-secondary-200 to-primary-200 rounded-full blur-2xl floating-bg" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-block mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about our organization and programs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-xl group cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                  How can I volunteer with BOW?
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  Visit our Get Involved page to learn about volunteer opportunities. 
                  You can also email us at contact@beatsofwa.org for more information.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-xl group cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                  Are your events free to attend?
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  Many of our events are free or low-cost. Check individual event pages 
                  for specific pricing information.
                </p>
              </div>
            </div>
            <div className="space-y-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-xl group cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                  Can I host an event with BOW?
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  Yes! We love partnering with community members. Contact our events team 
                  at contact@beatsofwa.org to discuss your idea.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-xl group cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                  How can I make a donation?
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  You can donate online through our Donate page, or contact us directly 
                  for other donation options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage; 