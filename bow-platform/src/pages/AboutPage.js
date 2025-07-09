import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  Music, 
  Award, 
  ArrowRight,
  Star,
  CheckCircle
} from 'lucide-react';

const AboutPage = () => {
  const leadership = [
    {
      name: "Dr. Sarah Johnson",
      role: "Executive Director",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Dr. Johnson has over 15 years of experience in community development and music education. She holds a PhD in Community Psychology and has dedicated her career to fostering inclusive communities through the arts.",
      email: "sarah.johnson@beatsofwashington.org"
    },
    {
      name: "Michael Chen",
      role: "Program Director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Michael brings 12 years of experience in event planning and community engagement. He specializes in creating accessible music programs for diverse communities.",
      email: "michael.chen@beatsofwashington.org"
    },
    {
      name: "Maria Rodriguez",
      role: "Community Outreach Coordinator",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Maria has been instrumental in building partnerships with local organizations and expanding BOW's reach to underserved communities across Washington State.",
      email: "maria.rodriguez@beatsofwashington.org"
    }
  ];

  const boardMembers = [
    {
      name: "Aand Sane",
      role: "Board Chair",
      organization: "Beats of Washington Founder"
    },
    {
      name: "Deepali Sane",
      role: "Vice Chair",
      organization: "Beats of Washington Founder"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Community First",
      description: "We prioritize the needs and voices of our community members in everything we do."
    },
    {
      icon: Users,
      title: "Inclusivity",
      description: "We create welcoming spaces where everyone feels valued and represented."
    },
    {
      icon: Music,
      title: "Cultural Celebration",
      description: "We honor and celebrate the diverse musical traditions that enrich our community."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain high standards in our programs and services to ensure meaningful impact."
    }
  ];

  const achievements = [
    {
      year: "2023",
      title: "Community Impact Award",
      description: "Recognized by the Washington State Governor's Office for outstanding community service"
    },
    {
      year: "2022",
      title: "Cultural Diversity Grant",
      description: "Received $500,000 grant to expand cultural programming across the state"
    },
    {
      year: "2023",
      title: "50,000 Member Milestone",
      description: "Reached our goal of serving 50,000 community members across Washington"
    },
    {
      year: "2021",
      title: "Virtual Programming Success",
      description: "Successfully pivoted to online programming, reaching 10,000+ participants"
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Beats of Washington</title>
        <meta name="description" content="Learn about Beats of Washington's mission, history, leadership team, and our commitment to empowering communities through music and culture." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About Beats of Washington
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Empowering communities through music, culture, and connection since 2019
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
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
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                As a 501(c)(3) non-profit organization, we serve over 50,000 community 
                members and coordinate 5,000+ volunteers across Washington State, 
                creating inclusive spaces where everyone can participate, learn, and grow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/get-involved" className="btn-primary">
                  Get Involved
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/donate" className="btn-outline">
                  Support Our Mission
                </Link>
              </div>
            </div>
            <div className="relative">
              <video
                src="/our-mission.mp4"
                controls
                className="rounded-2xl shadow-2xl w-full h-80 object-cover bg-black"
                poster="https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              >
                Sorry, your browser does not support embedded videos.
              </video>
              <div className="absolute inset-0 bg-primary-600 rounded-2xl opacity-20 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape our approach to community building.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Story
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From humble beginnings to a statewide movement, here's how BOW has grown 
              and evolved over the years.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Founded in 2019
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Beats of Washington was founded by Aand Sane and Deepali Sane, visionary 
                community leaders who recognized the power of music to bring people together. 
                What started as a small neighborhood drum circle has grown into one of Washington 
                State's most impactful community organizations.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our founders believed that music transcends barriers of language, culture, 
                and background, creating opportunities for genuine connection and understanding 
                between diverse communities.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Today, we continue to honor that vision while adapting to meet the evolving 
                needs of our communities through innovative programming and partnerships.
              </p>
            </div>
            <div className="space-y-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-lg">
                      {achievement.year}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {achievement.title}
                    </h4>
                    <p className="text-gray-600">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section id="leadership" className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Leadership Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated professionals who guide our organization and ensure 
              we fulfill our mission every day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadership.map((leader, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-3">
                    {leader.role}
                  </p>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {leader.bio}
                  </p>
                  <a
                    href={`mailto:${leader.email}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {leader.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section id="founders" className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Founders
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the visionary leaders who founded Beats of Washington and continue 
              to guide our mission of empowering communities through music.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Aand Sane */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">A</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Aand Sane
                </h3>
                <p className="text-primary-600 font-semibold text-lg mb-4">
                  Board Chair & Co-Founder
                </p>
              </div>
              <p className="text-gray-600 leading-relaxed text-center">
                Aand Sane is the visionary founder of Beats of Washington, whose passion 
                for community building through music has inspired thousands across Washington State. 
                As Board Chair, Aand continues to lead our organization with dedication and 
                innovative thinking.
              </p>
            </div>

            {/* Deepali Sane */}
            <div className="bg-gradient-to-br from-secondary-50 to-primary-50 rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">D</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Deepali Sane
                </h3>
                <p className="text-secondary-600 font-semibold text-lg mb-4">
                  Vice Chair & Co-Founder
                </p>
              </div>
              <p className="text-gray-600 leading-relaxed text-center">
                Deepali Sane co-founded Beats of Washington with a deep commitment to 
                fostering cultural connections through music. As Vice Chair, Deepali 
                brings strategic vision and community expertise to ensure our programs 
                continue to serve and inspire diverse communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Board of Directors
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our board provides strategic guidance and ensures we remain accountable 
              to our mission and community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {boardMembers.map((member, index) => (
              <div key={index} className="text-center p-8 bg-white rounded-xl shadow-lg">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-bold text-xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.organization}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 501(c)(3) Status Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              501(c)(3) Non-Profit Status
            </h2>
            <p className="text-xl max-w-3xl mx-auto">
              Beats of Washington is a registered 501(c)(3) non-profit organization, 
              ensuring transparency and accountability in all our operations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Tax Exempt</h3>
              <p className="text-gray-100">
                All donations are tax-deductible to the extent allowed by law.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Transparent</h3>
              <p className="text-gray-100">
                Annual reports and financial statements are publicly available.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Accountable</h3>
              <p className="text-gray-100">
                Governed by a volunteer board of directors from the community.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg mb-6">
              <strong>EIN:</strong> 12-3456789 | <strong>Founded:</strong> 2019
            </p>
            <Link to="/contact" className="btn-secondary">
              Request Financial Information
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you want to volunteer, attend events, or support our work financially, 
            there are many ways to get involved with Beats of Washington.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/get-involved" className="btn-primary text-lg px-8 py-4">
              <Users className="w-5 h-5 mr-2" />
              Get Involved
            </Link>
            <Link to="/donate" className="btn-outline text-lg px-8 py-4">
              <Heart className="w-5 h-5 mr-2" />
              Make a Donation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage; 