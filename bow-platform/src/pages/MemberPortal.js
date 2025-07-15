import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
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
  Camera,
  CreditCard
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
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setEditMode(false);
    }, 1200);
  };

  return (
    <>
      <Helmet>
        <title>My Profile - Beats of Washington</title>
      </Helmet>
      <div className="max-w-xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
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
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
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
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
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
                        onClick={(e) => {
                          e.preventDefault();
                          setProfile({
                            ...profile,
                            interests: profile.interests.filter((_, i) => i !== index)
                          });
                        }}
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
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200 flex items-center justify-center">
                    {currentUser?.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-300" />
                    )}
                  </div>
                  <button className="btn-outline mt-4 w-full max-w-xs mx-auto flex items-center justify-center">
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

          <div className="flex gap-4 justify-end">
            {editMode ? (
              <>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setEditMode(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn-primary"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            )}
            <button
              type="button"
              className="btn-outline"
              onClick={() => navigate('/member')}
            >
              Go to Dashboard
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

const SettingsPage = () => {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    events: true,
    newsletter: true
  });
  const [deleting, setDeleting] = React.useState(false);

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const handleSave = (e) => {
    e.preventDefault();
    // Placeholder: Add save logic here
    alert("Settings saved (not implemented)");
  };
  const handleDeleteAccount = () => {
    setDeleting(true);
    // Placeholder: Add delete logic here
    setTimeout(() => {
      setDeleting(false);
      alert("Account deletion not implemented.");
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Change Password</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="input-field"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="input-field"
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h3>
          <div className="space-y-3">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleNotificationChange(key)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn-primary">Save Changes</button>
        </div>
      </form>
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-red-700 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-600 mb-4">Deleting your account is irreversible. All your data will be lost.</p>
        <button
          className="btn-outline border-red-600 text-red-700 hover:bg-red-50"
          onClick={handleDeleteAccount}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete My Account"}
        </button>
      </div>
    </div>
  );
};

const MyPayments = () => {
  // Example data; replace with real fetch logic later
  const [payments, setPayments] = React.useState([
    { id: 1, date: '2024-06-01', amount: 50, event: 'Summer Music Festival 2024', type: 'Donation' },
    { id: 2, date: '2024-05-15', amount: 25, event: 'Community Drum Circle', type: 'Ticket' },
    { id: 3, date: '2024-04-10', amount: 100, event: 'Annual Gala', type: 'Donation' },
    { id: 4, date: '2024-03-20', amount: 40, event: 'Youth Music Workshop', type: 'Ticket' },
  ]);
  const [filters, setFilters] = React.useState({ date: '', amount: '', event: '' });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDownloadReceipt = (payment) => {
    const receipt = `Beats of Washington Payment Receipt\n\nPayment ID: ${payment.id}\nDate: ${payment.date}\nAmount: $${payment.amount}\nEvent: ${payment.event}\nType: ${payment.type}\n\nThank you for your support!`;
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BOW_Receipt_${payment.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredPayments = payments.filter((p) => {
    const dateMatch = filters.date ? p.date.includes(filters.date) : true;
    const amountMatch = filters.amount ? p.amount.toString().includes(filters.amount) : true;
    const eventMatch = filters.event ? p.event.toLowerCase().includes(filters.event.toLowerCase()) : true;
    return dateMatch && amountMatch && eventMatch;
  });

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">My Payments / Donation History</h2>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={filters.amount}
              onChange={handleFilterChange}
              className="input-field"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
            <input
              type="text"
              name="event"
              value={filters.event}
              onChange={handleFilterChange}
              className="input-field"
              placeholder="Search event..."
            />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Download</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">No payments found.</td>
              </tr>
            ) : (
              filteredPayments.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{p.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${p.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{p.event}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{p.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="btn-outline text-xs" onClick={() => handleDownloadReceipt(p)}>
                      Download Receipt
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SupportHelpCenter = () => {
  const [form, setForm] = React.useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const faqs = [
    {
      q: 'How do I reset my password?',
      a: 'Go to Settings > Change Password. If you forgot your password, use the Forgot Password link on the login page.'
    },
    {
      q: 'How do I register for an event?',
      a: 'Visit the Events page and click on the event you want to register for.'
    },
    {
      q: 'How do I request a refund?',
      a: 'Contact support using the form below with your event and payment details.'
    },
    {
      q: 'Why can\'t I log in?',
      a: 'Check your email and password. If you forgot your password, use the reset option. If you still have issues, contact support.'
    },
    {
      q: 'How do I update my profile?',
      a: 'Go to the Profile section in the Member Portal to update your information.'
    }
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Support / Help Center</h2>
      {/* FAQ Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
        <ul className="space-y-4">
          {faqs.map((faq, idx) => (
            <li key={idx}>
              <details className="group">
                <summary className="cursor-pointer font-medium text-primary-700 group-open:text-primary-900">
                  {faq.q}
                </summary>
                <div className="mt-2 text-gray-700 text-sm">{faq.a}</div>
              </details>
            </li>
          ))}
        </ul>
      </div>
      {/* Contact Support Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Contact Support</h3>
        {submitted ? (
          <div className="text-green-700 font-medium">Thank you! Your message has been sent.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="input-field"
                rows={4}
                required
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        )}
      </div>
      {/* Chatbot Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Chat with Us</h3>
        <div className="text-gray-600">Chatbot coming soon! For now, please use the contact form above for support.</div>
      </div>
    </div>
  );
};

const MemberPortal = () => {
  const location = useLocation();
  const memberNavigation = [
    { name: 'Dashboard', href: '/member', icon: User },
    { name: 'My Events', href: '/member/events', icon: Calendar },
    { name: 'My Payments', href: '/member/payments', icon: CreditCard },
    { name: 'Support', href: '/member/support', icon: Heart },
    { name: 'Profile', href: '/member/profile', icon: Settings },
    { name: 'Settings', href: '/member/settings', icon: Settings },
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
                  {memberNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`flex items-center px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none
                          ${location.pathname === item.href ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'}`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
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
                <Route path="/payments" element={<MyPayments />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/support" element={<SupportHelpCenter />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberPortal; 