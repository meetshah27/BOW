import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  Star,
  ArrowRight,
  CheckCircle,
  Music,
  Award,
  Mail,
  Phone
} from 'lucide-react';

const GetInvolvedPage = () => {
  const [activeTab, setActiveTab] = useState('volunteer');

  const volunteerOpportunities = [
    {
      id: 1,
      title: "Event Coordinator",
      category: "Events",
      location: "Seattle Area",
      timeCommitment: "4-8 hours per event",
      description: "Help plan and coordinate community events, from small workshops to large festivals.",
      requirements: [
        "Strong organizational skills",
        "Experience with event planning preferred",
        "Available on weekends",
        "Passion for community building"
      ],
      benefits: [
        "Gain event management experience",
        "Network with community leaders",
        "Free access to BOW events",
        "Recognition and appreciation"
      ]
    },
    {
      id: 2,
      title: "Music Workshop Assistant",
      category: "Education",
      location: "Various Locations",
      timeCommitment: "2-4 hours per week",
      description: "Support music education programs for youth and adults in our community.",
      requirements: [
        "Basic music knowledge",
        "Patience working with diverse groups",
        "Background check required",
        "Reliable transportation"
      ],
      benefits: [
        "Teaching experience",
        "Music education training",
        "Work with inspiring youth",
        "Flexible scheduling"
      ]
    },
    {
      id: 3,
      title: "Community Outreach Specialist",
      category: "Outreach",
      location: "Washington State",
      timeCommitment: "3-6 hours per week",
      description: "Help spread the word about BOW programs and build partnerships with local organizations.",
      requirements: [
        "Excellent communication skills",
        "Knowledge of local community",
        "Social media experience",
        "Self-motivated"
      ],
      benefits: [
        "Networking opportunities",
        "Marketing experience",
        "Community connections",
        "Professional development"
      ]
    },
    {
      id: 4,
      title: "Technical Support",
      category: "Technical",
      location: "Remote/Seattle",
      timeCommitment: "2-5 hours per week",
      description: "Provide technical support for our website, social media, and digital platforms.",
      requirements: [
        "Basic web development skills",
        "Social media management",
        "Problem-solving abilities",
        "Reliable internet connection"
      ],
      benefits: [
        "Tech experience",
        "Portfolio building",
        "Remote work opportunity",
        "Skill development"
      ]
    }
  ];

  const membershipLevels = [
    {
      name: "Community Member",
      price: "Free",
      description: "Basic membership with access to events and newsletters",
      benefits: [
        "Access to all public events",
        "Monthly newsletter",
        "Community updates",
        "Event discounts"
      ]
    },
    {
      name: "Supporting Member",
      price: "$25/month",
      description: "Enhanced membership with additional benefits and support",
      benefits: [
        "All Community Member benefits",
        "Early event registration",
        "Exclusive member events",
        "Behind-the-scenes content",
        "Member recognition"
      ]
    },
    {
      name: "Patron Member",
      price: "$50/month",
      description: "Premium membership with maximum benefits and impact",
      benefits: [
        "All Supporting Member benefits",
        "VIP event access",
        "Personal thank you calls",
        "Annual impact report",
        "Naming opportunities"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Event Coordinator Volunteer",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      content: "Volunteering with BOW has been one of the most rewarding experiences of my life. I've met amazing people and helped create meaningful community connections through music.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Supporting Member",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      content: "Being a BOW member has given me a sense of belonging and purpose. The events are incredible, and I love being part of such a vibrant community.",
      rating: 5
    },
    {
      name: "Maria Rodriguez",
      role: "Workshop Assistant",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      content: "Teaching music to kids through BOW has been incredibly fulfilling. Seeing their faces light up when they learn something new is priceless.",
      rating: 5
    }
  ];

  const stats = [
    { number: "500+", label: "Active Volunteers", icon: Users },
    { number: "2,000+", label: "Members", icon: Heart },
    { number: "200+", label: "Events Annually", icon: Calendar },
    { number: "15", label: "Years of Service", icon: Award }
  ];

  return (
    <>
      <Helmet>
        <title>Get Involved - Beats of Washington</title>
        <meta name="description" content="Join Beats of Washington as a volunteer or member. Make a difference in your community through music, events, and cultural programs." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-20">
        <div className="container-custom text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Get Involved
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Join our community of volunteers and members making a difference 
            through music, culture, and connection.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-12 h-12 text-primary-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How You Can Help
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you want to volunteer your time or become a member, 
              there are many ways to get involved with BOW.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setActiveTab('volunteer')}
                className={`btn-toggle ${
                  activeTab === 'volunteer'
                    ? 'btn-toggle-active'
                    : 'btn-toggle-inactive'
                }`}
              >
                <Users className="w-5 h-5 inline mr-2" />
                Volunteer
              </button>
              <button
                onClick={() => setActiveTab('member')}
                className={`btn-toggle ${
                  activeTab === 'member'
                    ? 'btn-toggle-active'
                    : 'btn-toggle-inactive'
                }`}
              >
                <Heart className="w-5 h-5 inline mr-2" />
                Become a Member
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-6xl mx-auto">
            {activeTab === 'volunteer' && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Volunteer Opportunities
                  </h3>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Join our dedicated team of volunteers and make a real impact in your community. 
                    We have opportunities for all skill levels and interests.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {volunteerOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="bg-white rounded-xl shadow-lg p-8">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-xl font-semibold text-gray-900">
                          {opportunity.title}
                        </h4>
                        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                          {opportunity.category}
                        </span>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {opportunity.location}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {opportunity.timeCommitment}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {opportunity.description}
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-3">Requirements:</h5>
                          <ul className="space-y-2">
                            {opportunity.requirements.map((req, index) => (
                              <li key={index} className="flex items-start text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-3">Benefits:</h5>
                          <ul className="space-y-2">
                            {opportunity.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start text-sm text-gray-600">
                                <Star className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Link
                          to="/contact"
                          className="btn-primary w-full justify-center"
                        >
                          Apply Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'member' && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Membership Levels
                  </h3>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Choose the membership level that's right for you and enjoy exclusive benefits 
                    while supporting our mission.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {membershipLevels.map((level, index) => (
                    <div
                      key={index}
                      className={`bg-white rounded-xl shadow-lg p-8 ${
                        index === 1 ? 'ring-2 ring-primary-600 relative' : ''
                      }`}
                    >
                      {index === 1 && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                            Most Popular
                          </span>
                        </div>
                      )}
                      
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">
                        {level.name}
                      </h4>
                      <div className="text-3xl font-bold text-primary-600 mb-2">
                        {level.price}
                      </div>
                      <p className="text-gray-600 mb-6">
                        {level.description}
                      </p>
                      
                      <ul className="space-y-3 mb-8">
                        {level.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Link
                        to="/contact"
                        className={`w-full ${index === 1 ? 'btn-primary' : 'btn-outline'}`}
                      >
                        Join Now
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Volunteers & Members Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from the amazing people who make our community vibrant and diverse.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Have questions about volunteering or membership? We'd love to hear from you 
            and help you find the perfect way to get involved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="mailto:volunteer@beatsofwashington.org" className="btn-primary text-lg px-8 py-4">
              <Mail className="w-5 h-5 mr-2" />
              Email Us
            </a>
            <a href="tel:+12065550123" className="btn-outline text-lg px-8 py-4">
              <Phone className="w-5 h-5 mr-2" />
              Call Us
            </a>
          </div>
          
          <p className="text-gray-600">
            Or visit our <a href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">contact page</a> for more ways to reach us.
          </p>
        </div>
      </section>
    </>
  );
};

export default GetInvolvedPage; 