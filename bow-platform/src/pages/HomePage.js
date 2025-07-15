import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Calendar, 
  Users, 
  Heart, 
  Music, 
  ArrowRight, 
  Star,
  MapPin
} from 'lucide-react';


// CountUpNumber component with Intersection Observer
function CountUpNumber({ end, duration = 1.5, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let observer;
    let rafId;
    
    function animate() {
      let startTime = null;
      const startValue = 0;
      const endValue = end;

      function step(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
        
        setCount(currentCount);

        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          setCount(endValue);
          setIsComplete(true);
        }
      }
      
      rafId = requestAnimationFrame(step);
    }
    
    function handleIntersect(entries) {
      if (entries[0].isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        animate();
      }
    }
    
    observer = new window.IntersectionObserver(handleIntersect, { threshold: 0.1 });
    observer.observe(node);
    
    return () => {
      if (observer && node) observer.unobserve(node);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [end, duration, hasAnimated]);

  return (
    <span 
      ref={ref} 
      className={isComplete ? 'count-animate' : ''}
    >
      {count.toLocaleString()}{suffix}
    </span>
  );
}

const HomePage = () => {
  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Summer Music Festival 2024",
      date: "July 15-17, 2024",
      location: "Seattle Center",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Festival",
      featured: true
    },
    {
      id: 2,
      title: "Community Drum Circle",
      date: "June 22, 2024",
      location: "Gas Works Park",
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Workshop"
    },
    {
      id: 3,
      title: "Youth Music Workshop",
      date: "June 29, 2024",
      location: "Community Center",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Education"
    }
  ];

  const stats = [
    {
      label: 'Community Members',
      number: 50000,
      suffix: '+',
      icon: Users
    },
    {
      label: 'Volunteers',
      number: 5000,
      suffix: '+',
      icon: Heart
    },
    {
      label: 'Events Annually',
      number: 25,
      suffix: '+',
      icon: Calendar
    },
    {
      label: 'Years of Service',
      number: 5,
      suffix: '',
      icon: Star
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Community Member",
      content: "BOW has transformed our neighborhood through the power of music. The events bring people together in ways I never imagined possible.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Volunteer",
      content: "Being part of BOW has given me a sense of purpose and community. The impact we make on people's lives is incredible.",
      rating: 5
    },
    {
      name: "Maria Rodriguez",
      role: "Local Artist",
      content: "BOW provides a platform for local artists to showcase their talent and connect with the community. It's been life-changing.",
      rating: 5
    }
  ];

  // Add this after testimonials section, before CTA section
  const sponsors = [
    {
      name: 'Apna Bazar',
      logo: '/sponsors/Apana bazar.png',
      website: '#'
    },
    {
      name: 'Bel Red Best Smiles',
      logo: '/sponsors/Bel Red Best Smiles.png',
      website: '#'
    },
    {
      name: 'Chutneys',
      logo: '/sponsors/Chutneys.jpg',
      website: '#'
    },
    {
      name: 'Dulay Homes',
      logo: '/sponsors/Dulay Homes.png',
      website: '#'
    },
    {
      name: 'Emerald Pacific Capital',
      logo: '/sponsors/Emerald pacific capital.png',
      website: '#'
    },
    {
      name: 'Fusion India',
      logo: '/sponsors/Fusion India.avif',
      website: '#'
    },
    {
      name: 'goEzz',
      logo: '/sponsors/goEzz.png',
      website: '#'
    },
    {
      name: 'Mayuri',
      logo: '/sponsors/mayuri foods.png',
      website: '#'
    },
    {
      name: 'Soul Kitchen',
      logo: '/sponsors/Soul Kitchen.png',
      website: '#'
    },
    {
      name: 'Sukarya USA',
      logo: '/sponsors/Sukarya USA.jpg',
      website: '#'
    },
    {
      name: 'Swapna Kadam',
      logo: '/sponsors/Swapna Kadam.webp',
      website: '#'
    },
    {
      name: 'The Shade Home',
      logo: '/sponsors/THE shade Home.jpg',
      website: '#'
    },
    {
      name: 'VG Force',
      logo: '/sponsors/VG Force.png',
      website: '#'
    },
    {
      name: 'Washington State India Trade Relations Action Committee',
      logo: '/sponsors/Washington State India Trade Relations Action Committee.jpg',
      website: '#'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Beats of Washington - Empowering Communities Through Music</title>
        <meta name="description" content="Beats of Washington (BOW) is a non-profit organization serving over 50,000 community members and 5,000+ volunteers across Washington State through music, culture, and connection." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
        
        <div className="container-custom section-padding relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Empowering Communities
              <span className="block text-secondary-300">Through Music</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed">
              Beats of Washington connects, inspires, and celebrates cultural diversity 
              through music and community events across Washington State since 2019.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events" className="btn-secondary text-lg px-8 py-4">
                <Calendar className="w-5 h-5 mr-2" />
                Find Events
              </Link>
              <Link to="/get-involved" className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600">
                <Users className="w-5 h-5 mr-2" />
                Get Involved
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our community has grown and the impact we've made together
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center stats-card transform transition-all duration-500 hover:scale-105"
              >
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-12 h-12 text-primary-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  <CountUpNumber 
                    end={stat.number} 
                    suffix={stat.suffix || ''} 
                    duration={1.5}
                  />
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          
          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Join Our Growing Community
              </h3>
              <p className="text-lg opacity-90 mb-6">
                Be part of something bigger. Every member, volunteer, and event contributes to our mission of building a stronger, more connected community.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/get-involved" className="bg-white text-primary-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  Become a Member
                </Link>
                <Link to="/volunteer" className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                  Volunteer Today
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Beats of Washington (BOW) is dedicated to fostering community connections 
                through the universal language of music. We believe that music has the 
                power to bridge cultural divides, inspire creativity, and create lasting 
                bonds within our communities.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                As a 501(c)(3) non-profit organization, we serve over 50,000 community 
                members and coordinate 5,000+ volunteers across Washington State, 
                creating inclusive spaces where everyone can participate, learn, and grow.
              </p>
              <Link to="/about" className="btn-primary">
                Learn More About Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt="Community music event"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-primary-600 rounded-2xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="bg-white py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join us for exciting community events, workshops, and performances 
              that bring people together through the power of music.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="card group">
                <div className="relative overflow-hidden rounded-t-xl">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {event.featured && (
                    <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {event.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {event.title}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                  <Link
                    to={`/events/${event.id}`}
                    className="btn-outline w-full"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/events" className="btn-primary">
              View All Events
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from the people who make our community vibrant and diverse.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Slider Section */}
      <section className="bg-white py-12">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Sponsors</h2>
          <div className="overflow-hidden relative">
            <div className="flex gap-8 animate-sponsor-scroll whitespace-nowrap">
              {sponsors.concat(sponsors).map((sponsor, idx) => (
                <div key={idx} className="sponsor-card">
                  <a 
                    href={sponsor.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-32 h-20 flex items-center justify-center"
                  >
                    <img
                      src={sponsor.logo}
                      alt={`${sponsor.name} logo`}
                      className="sponsor-logo"
                      title={sponsor.name}
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">
            Join Our Community Today
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you want to volunteer, attend events, or support our mission, 
            there's a place for you in the Beats of Washington family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/get-involved" className="btn-secondary text-lg px-8 py-4">
              <Users className="w-5 h-5 mr-2" />
              Get Involved
            </Link>
            <Link to="/donate" className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600">
              <Heart className="w-5 h-5 mr-2" />
              Make a Donation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage; 