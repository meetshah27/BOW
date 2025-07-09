import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Calendar, 
  Heart, 
  Settings, 
  Bell,
  MapPin,
  Clock,
  Users,
  Star,
  Download,
  Edit,
  Camera
} from 'lucide-react';

// Member Portal Sub-components
const Dashboard = () => {
  const { currentUser } = useAuth();
  
  const upcomingEvents = [
    {
      id: 1,
      title: "Summer Music Festival 2024",
      date: "2024-07-15",
      time: "12:00 PM - 10:00 PM",
      location: "Seattle Center",
      status: "registered"
    },
    {
      id: 2,
      title: "Community Drum Circle",
      date: "2024-06-22",
      time: "6:00 PM - 8:00 PM",
      location: "Gas Works Park",
      status: "registered"
    }
  ];

  const recentActivity = [
    { action: 'Registered for Summer Music Festival', date: '2024-01-15' },
    { action: 'Attended Youth Music Workshop', date: '2024-01-10' },
    { action: 'Updated profile information', date: '2024-01-08' },
    { action: 'Joined Community Drum Circle', date: '2024-01-05' }
  ];

  const memberStats = [
    { label: 'Events Attended', value: '12' },
    { label: 'Volunteer Hours', value: '24' },
    { label: 'Community Points', value: '1,250' },
    { label: 'Member Since', value: '2023' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {currentUser?.displayName || 'Member'}!
        </h2>
        <p className="text-primary-100">
          You're part of a community of over 2,000 members making a difference through music.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {memberStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {event.date} at {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {event.location}
                    </div>
                  </div>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/events" className="btn-outline w-full justify-center">
                View All Events
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyEvents = () => {
  const [events] = useState([
    {
      id: 1,
      title: "Summer Music Festival 2024",
      date: "2024-07-15",
      time: "12:00 PM - 10:00 PM",
      location: "Seattle Center",
      status: "registered",
      category: "Festival"
    },
    {
      id: 2,
      title: "Community Drum Circle",
      date: "2024-06-22",
      time: "6:00 PM - 8:00 PM",
      location: "Gas Works Park",
      status: "registered",
      category: "Workshop"
    },
    {
      id: 3,
      title: "Youth Music Workshop",
      date: "2024-06-29",
      time: "10:00 AM - 2:00 PM",
      location: "Community Center",
      status: "attended",
      category: "Education"
    }
  ]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">My Events</h2>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Event History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-500">{event.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.date}</div>
                    <div className="text-sm text-gray-500">{event.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      event.status === 'registered' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="btn-outline text-sm py-1 px-3">
                        View Details
                      </button>
                      {event.status === 'registered' && (
                        <button className="text-red-600 hover:text-red-900 text-sm py-1 px-3 border border-red-600 rounded hover:bg-red-50 transition-colors duration-200">
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({
    firstName: currentUser?.displayName?.split(' ')[0] || '',
    lastName: currentUser?.displayName?.split(' ').slice(1).join(' ') || '',
    email: currentUser?.email || '',
    phone: '',
    bio: 'Passionate about music and community building.',
    interests: ['Jazz', 'Community Events', 'Volunteering'],
    notifications: {
      email: true,
      sms: false,
      events: true,
      newsletter: true
    }
  });

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="input-field bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="input-field"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                rows={4}
                className="input-field resize-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                >
                  {interest}
                  <button
                    onClick={() => setProfile({
                      ...profile, 
                      interests: profile.interests.filter((_, i) => i !== index)
                    })}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Add new interest..."
                className="input-field"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    setProfile({
                      ...profile,
                      interests: [...profile.interests, e.target.value.trim()]
                    });
                    e.target.value = '';
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Profile Photo & Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-full h-full p-8 text-gray-400" />
                )}
              </div>
              <button className="btn-outline">
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-3">
              {Object.entries(profile.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setProfile({
                      ...profile,
                      notifications: {
                        ...profile.notifications,
                        [key]: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="btn-primary">
          <Edit className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

const MemberPortal = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/member/')[1] || 'dashboard';

  const navigation = [
    { name: 'Dashboard', href: '/member', icon: User },
    { name: 'My Events', href: '/member/events', icon: Calendar },
    { name: 'Profile', href: '/member/profile', icon: User },
    { name: 'Settings', href: '/member/settings', icon: Settings }
  ];

  return (
    <>
      <Helmet>
        <title>Member Portal - Beats of Washington</title>
        <meta name="description" content="Access your personalized member dashboard, manage events, and update your profile." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="container-custom py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Member Portal</h1>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <Bell className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">Member</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="bg-white rounded-lg shadow p-4">
                <ul className="space-y-2">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          currentPath === item.href.split('/member/')[1] || 
                          (currentPath === 'dashboard' && item.href === '/member')
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className="w-4 h-4 mr-3" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/events" element={<MyEvents />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<div>Settings Page</div>} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberPortal; 