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
  MessageCircle
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
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-20">
        <div className="container-custom text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            We'd love to hear from you! Whether you have questions, want to volunteer, 
            or are interested in partnering with us, we're here to help.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <info.icon className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {info.title}
                </h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
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
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="What is this regarding?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="input-field resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Departments */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Contact by Department
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                For specific inquiries, you can reach out directly to the appropriate department.
              </p>
              
              <div className="space-y-6">
                {departments.map((dept, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {dept.name}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {dept.description}
                    </p>
                    <a
                      href={`mailto:${dept.email}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {dept.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Connect With Us
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Follow us on social media to stay updated on events, community stories, 
            and the latest news from Beats of Washington.
          </p>
          
          <div className="flex justify-center space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-200"
                aria-label={`Follow us on ${social.name}`}
                title={`Follow us on ${social.name}`}
              >
                <social.icon className="w-8 h-8" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Visit Our Office
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stop by our office to learn more about our programs, pick up event materials, 
              or just say hello!
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
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
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about our organization and programs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How can I volunteer with BOW?
                </h3>
                <p className="text-gray-600">
                  Visit our Get Involved page to learn about volunteer opportunities. 
                  You can also email us at contact@beatsofwa.org for more information.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Are your events free to attend?
                </h3>
                <p className="text-gray-600">
                  Many of our events are free or low-cost. Check individual event pages 
                  for specific pricing information.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I host an event with BOW?
                </h3>
                <p className="text-gray-600">
                  Yes! We love partnering with community members. Contact our events team 
                  at contact@beatsofwa.org to discuss your idea.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How can I make a donation?
                </h3>
                <p className="text-gray-600">
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