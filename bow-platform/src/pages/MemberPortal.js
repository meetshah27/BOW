import React, { useState, useEffect } from 'react';
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
  CreditCard,
  Trophy,
  TrendingUp,
  Award,
  Gift
} from 'lucide-react';
import api from '../config/api';

// Member Portal Sub-components
const Dashboard = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        let userId = currentUser?.uid || currentUser?.id || '';
        let userEmail = currentUser?.email || '';
        // Fetch registered events
        let eventsRes = await api.get(`/events/user/${userId}/registrations`);
        let eventsData = eventsRes.ok ? await eventsRes.json() : [];
        // Fetch payments/donations
        let paymentsRes = await api.get(`/payment/donations/user/${userId}`);
        let paymentsData = paymentsRes.ok ? await paymentsRes.json() : [];
        // If no payments by userId, try by email
        if (paymentsData.length === 0 && userEmail) {
          let paymentsEmailRes = await api.get(`/payment/donations/user/${userEmail}`);
          paymentsData = paymentsEmailRes.ok ? await paymentsEmailRes.json() : [];
        }
        setEvents(eventsData);
        setPayments(paymentsData);
      } catch (err) {
        setError('Failed to load your data.');
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchData();
  }, [currentUser]);

  // Enhanced Stats with icons and colors
  const memberStats = [
    { 
      label: 'Events Registered', 
      value: events.length,
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100'
    },
    { 
      label: 'Total Donations', 
      value: `$${payments.reduce((sum, p) => sum + (p.amount || 0) / 100, 0).toFixed(2)}`,
      icon: Gift,
      color: 'bg-green-100 text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100'
    },
    { 
      label: 'Member Since', 
      value: currentUser?.createdAt ? new Date(currentUser.createdAt).getFullYear() : '—',
      icon: Trophy,
      color: 'bg-purple-100 text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100'
    },
    { 
      label: 'Community Rank', 
      value: 'Active',
      icon: Star,
      color: 'bg-orange-100 text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Hero Banner */}
      <div className="bg-gradient-to-r from-primary-700 via-blue-600 to-secondary-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-3">
              Welcome back, {currentUser?.displayName || currentUser?.name || 'Member'}! 👋
            </h2>
            <p className="text-primary-100 text-lg">
              You're part of a community of over 2,000 members making a difference through music.
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span className="text-sm">2,000+ Members</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span className="text-sm">Premium Member</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {memberStats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Enhanced Events Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Calendar className="w-6 h-6 mr-3" />
              Registered Events
            </h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : (
              <div className="space-y-4">
                {events.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No registered events yet.</p>
                    <p className="text-sm">Start exploring our upcoming events!</p>
                  </div>
                ) : events.map((event) => (
                  <div key={event.eventId || event.id} className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{event.eventTitle || event.title}</h4>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                          {event.date ? (() => {
                            // Parse the date string manually to avoid timezone issues
                            const [year, month, day] = event.date.split('-').map(Number);
                            const localDate = new Date(year, month - 1, day); // month is 0-indexed
                            return localDate.toLocaleDateString();
                          })() : '-'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-red-500" />
                          {event.location || '-'}
                        </div>
                      </div>
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                        {event.status || 'registered'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6">
              <Link to="/events" className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center">
                <Calendar className="w-5 h-5 mr-2" />
                View All Events
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Payments Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Gift className="w-6 h-6 mr-3" />
              Recent Donations
            </h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : (
              <div className="space-y-4">
                {payments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Gift className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No donations yet.</p>
                    <p className="text-sm">Make your first contribution to our cause!</p>
                  </div>
                ) : payments.slice(0, 5).map((p) => (
                  <div key={p.paymentIntentId} className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-lg">${(p.amount / 100).toFixed(2)}</div>
                        <div className="text-xs text-gray-600 capitalize">{p.status}</div>
                        <div className="text-xs text-gray-500">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</div>
                      </div>
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                        {p.frequency || 'one-time'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6">
              <Link to="/member/payments" className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center">
                <CreditCard className="w-5 h-5 mr-2" />
                View All Donations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyEvents = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError('');
      try {
        let userId = currentUser?.uid || currentUser?.id || '';
        let res = await api.get(`/events/user/${userId}/registrations`);
        let data = res.ok ? await res.json() : [];
        setEvents(data);
      } catch (err) {
        setError('Failed to load your events.');
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchEvents();
  }, [currentUser]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">My Events</h2>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Event History</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? <div>Loading events...</div> : error ? <div className="text-red-500">{error}</div> : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-4">No events found.</td></tr>
                ) : events.map((event) => (
                  <tr key={event.eventId || event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{event.eventTitle || event.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{event.date ? (() => {
                      // Parse the date string manually to avoid timezone issues
                      const [year, month, day] = event.date.split('-').map(Number);
                      const localDate = new Date(year, month - 1, day); // month is 0-indexed
                      return localDate.toLocaleString();
                    })() : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{event.location || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{event.status || 'registered'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
  const { currentUser } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError('');
      try {
        let userId = currentUser?.uid || currentUser?.id || '';
        let res = await api.get(`/payment/donations/user/${userId}`);
        let data = res.ok ? await res.json() : [];
        // If no payments by userId, try by email
        if (data.length === 0 && currentUser?.email) {
          let resEmail = await api.get(`/payment/donations/user/${currentUser.email}`);
          data = resEmail.ok ? await resEmail.json() : [];
        }
        setPayments(data);
      } catch (err) {
        setError('Failed to load your donations.');
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchPayments();
  }, [currentUser]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">My Donations</h2>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Donation History</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? <div>Loading donations...</div> : error ? <div className="text-red-500">{error}</div> : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4">No donations found.</td></tr>
                ) : payments.map((p) => (
                  <tr key={p.paymentIntentId}>
                    <td className="px-6 py-4 whitespace-nowrap">${(p.amount / 100).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{p.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{p.createdAt ? new Date(p.createdAt).toLocaleString() : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{p.frequency || 'one-time'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {p.receiptUrl ? <a href={p.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Download</a> : '-' }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
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
  const { currentUser } = useAuth();
  const [userStats, setUserStats] = useState({ events: 0, donations: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch user stats for sidebar
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!currentUser) return;
      
      try {
        let userId = currentUser?.uid || currentUser?.id || '';
        let userEmail = currentUser?.email || '';
        
        // Fetch events
        let eventsRes = await api.get(`/events/user/${userId}/registrations`);
        let eventsData = eventsRes.ok ? await eventsRes.json() : [];
        
        // Fetch payments
        let paymentsRes = await api.get(`/payment/donations/user/${userId}`);
        let paymentsData = paymentsRes.ok ? await paymentsRes.json() : [];
        
        // If no payments by userId, try by email
        if (paymentsData.length === 0 && userEmail) {
          let paymentsEmailRes = await api.get(`/payment/donations/user/${userEmail}`);
          paymentsData = paymentsEmailRes.ok ? await paymentsEmailRes.json() : [];
        }
        
        const totalAmount = paymentsData.reduce((sum, p) => sum + (p.amount || 0) / 100, 0);
        
        setUserStats({
          events: eventsData.length,
          donations: paymentsData.length,
          totalAmount: totalAmount
        });
      } catch (err) {
        console.error('Failed to fetch user stats:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserStats();
  }, [currentUser]);

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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-secondary-100">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 shadow-xl">
          <div className="container-custom py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Member Portal</h1>
                  <p className="text-primary-100 text-sm">Your personalized dashboard</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <button className="p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                  <Bell className="w-6 h-6" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    {currentUser?.photoURL ? (
                      <img src={currentUser.photoURL} alt="Profile" className="w-10 h-10 rounded-full" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="text-white">
                    <div className="font-medium">{currentUser?.displayName || currentUser?.name || 'Member'}</div>
                    <div className="text-xs text-primary-100">Premium Member</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1">
              <nav className="bg-gradient-to-b from-primary-100 via-white to-secondary-50 rounded-2xl shadow-xl p-6 flex flex-col items-center">
                <div className="w-full space-y-3">
                  {memberNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-6 py-4 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none group
                        ${location.pathname === item.href 
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg transform scale-105' 
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-700 hover:shadow-md'
                        }`}
                    >
                      <item.icon className={`w-5 h-5 mr-3 ${location.pathname === item.href ? 'text-white' : 'text-gray-500 group-hover:text-primary-600'}`} />
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                {/* Quick Stats - Now Dynamic */}
                <div className="w-full mt-8 p-4 bg-white/50 rounded-xl border border-white/20">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h4>
                  {loading ? (
                    <div className="flex justify-center py-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Events</span>
                        <span className="font-medium text-primary-600">{userStats.events}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Donations</span>
                        <span className="font-medium text-green-600">${userStats.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Rank</span>
                        <span className="font-medium text-orange-600">Active</span>
                      </div>
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {/* Enhanced Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white/80 rounded-3xl shadow-2xl p-8 min-h-[60vh] animate-fade-in">
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
      </div>
    </>
  );
};

export default MemberPortal; 