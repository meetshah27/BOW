import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  FileText, 
  Image,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  Search,
  CreditCard,
  LayoutDashboard,
  LogOut,
  UserX,
  UserCheck,
  MessageSquare,
  Heart,
  Shield,
  TrendingUp,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

// Admin Sub-components
const Dashboard = () => {
  const stats = [
    { title: 'Total Members', value: '2,847', change: '+12%', icon: Users },
    { title: 'Active Events', value: '23', change: '+5%', icon: Calendar },
    { title: 'Monthly Donations', value: '$12,450', change: '+8%', icon: CreditCard },
    { title: 'Volunteer Hours', value: '1,234', change: '+15%', icon: Users }
  ];

  const recentActivity = [
    { action: 'New member registered', user: 'Sarah Johnson', time: '2 hours ago' },
    { action: 'Event created', user: 'Michael Chen', time: '4 hours ago' },
    { action: 'Donation received', user: 'Anonymous', time: '6 hours ago' },
    { action: 'Volunteer signed up', user: 'Maria Rodriguez', time: '1 day ago' }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              <span className="text-sm text-gray-600"> from last month</span>
            </div>
          </div>
        ))}
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
                  <p className="text-sm text-gray-600">by {activity.user}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const EventManagement = () => {
  const [events] = useState([
    {
      id: 1,
      title: "Summer Music Festival 2024",
      date: "2024-07-15",
      location: "Seattle Center",
      status: "upcoming",
      registered: 3200,
      capacity: 5000
    },
    {
      id: 2,
      title: "Community Drum Circle",
      date: "2024-06-22",
      location: "Gas Works Park",
      status: "upcoming",
      registered: 45,
      capacity: 100
    },
    {
      id: 3,
      title: "Youth Music Workshop",
      date: "2024-06-29",
      location: "Community Center",
      status: "upcoming",
      registered: 32,
      capacity: 50
    }
  ]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
        <button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">All Events</h3>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration
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
                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {event.registered}/{event.capacity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
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

const UserManagement = () => {
  const [users] = useState([
    { uid: '1', displayName: 'John Doe', email: 'john@example.com', role: 'member', isActive: true },
    { uid: '2', displayName: 'Jane Smith', email: 'jane@example.com', role: 'volunteer', isActive: true },
    { uid: '3', displayName: 'Bob Wilson', email: 'bob@example.com', role: 'admin', isActive: true },
    { uid: '4', displayName: 'Alice Brown', email: 'alice@example.com', role: 'member', isActive: false }
  ]);

  const [filter, setFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    return user.role === filter;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User & Volunteer Management</h2>
        <button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
            <div className="flex space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="member">Members</option>
                <option value="volunteer">Volunteers</option>
                <option value="admin">Admins</option>
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.uid} className="border-b last:border-b-0">
                  <td className="px-4 py-2 whitespace-nowrap">{user.displayName || user.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{user.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap capitalize">{user.role}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {user.isActive ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap space-x-2">
                    <button className="text-primary-600 hover:text-primary-900" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-yellow-600 hover:text-yellow-900" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    {user.isActive ? (
                      <button className="text-red-600 hover:text-red-900" title="Deactivate">
                        <UserX className="w-4 h-4" />
                      </button>
                    ) : (
                      <button className="text-green-600 hover:text-green-900" title="Reactivate">
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}
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

const GalleryManager = () => {
  const [albums] = useState([
    { id: 1, name: 'Diwali 2024', count: 45, date: '2024-11-15' },
    { id: 2, name: 'Youth Fest', count: 32, date: '2024-10-20' },
    { id: 3, name: 'Community Drum Circle', count: 28, date: '2024-09-15' }
  ]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gallery Manager</h2>
        <button className="btn-primary">
          <Upload className="w-4 h-4 mr-2" />
          Upload Media
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map(album => (
          <div key={album.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{album.name}</h3>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{album.count} items</p>
            <p className="text-sm text-gray-500">{album.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const StoriesManagement = () => {
  const [stories] = useState([
    { id: 1, title: 'My Journey with BOW', author: 'Sarah Johnson', status: 'pending', date: '2024-01-15' },
    { id: 2, title: 'Community Impact', author: 'Mike Chen', status: 'approved', date: '2024-01-10' },
    { id: 3, title: 'Volunteer Experience', author: 'Maria Rodriguez', status: 'rejected', date: '2024-01-08' }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">People Stories & Submissions</h2>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Story Submissions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stories.map(story => (
                <tr key={story.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{story.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{story.author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(story.status)}`}>
                      {story.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{story.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <XCircle className="w-4 h-4" />
                      </button>
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

const DonationsManagement = () => {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    monthlyStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
    fetchStats();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/payment/donations?limit=10');
      if (response.ok) {
        const data = await response.json();
        setDonations(data.donations);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/payment/donations/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching donation stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Donations & Payment Logs</h2>
        <button className="btn-outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Donations</h3>
          <p className="text-3xl font-bold text-green-600">
            ${loading ? '...' : (stats.totalAmount / 100).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            {loading ? 'Loading...' : `${stats.totalDonations} successful donations`}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">This Month</h3>
          <p className="text-3xl font-bold text-blue-600">
            ${loading ? '...' : (stats.monthlyStats[0]?.amount / 100 || 0).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            {loading ? 'Loading...' : `${stats.monthlyStats[0]?.count || 0} donations this month`}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Donors</h3>
          <p className="text-3xl font-bold text-purple-600">
            {loading ? '...' : stats.totalDonations}
          </p>
          <p className="text-sm text-gray-600">
            {loading ? 'Loading...' : 'Total unique donors'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Donations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    Loading donations...
                  </td>
                </tr>
              ) : donations.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No donations found
                  </td>
                </tr>
              ) : (
                donations.map(donation => (
                  <tr key={donation._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{donation.donorName}</div>
                      <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        ${(donation.amount / 100).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        donation.status === 'succeeded' ? 'bg-green-100 text-green-800' : 
                        donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {donation.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ContentManagement = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Stories</h3>
            <button className="btn-primary text-sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Story
            </button>
          </div>
          <p className="text-gray-600 mb-4">Manage community stories and blog posts</p>
          <div className="text-2xl font-bold text-gray-900">24 Stories</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Gallery</h3>
            <button className="btn-primary text-sm">
              <Plus className="w-4 h-4 mr-1" />
              Upload Media
            </button>
          </div>
          <p className="text-gray-600 mb-4">Manage photos and videos</p>
          <div className="text-2xl font-bold text-gray-900">156 Items</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pages</h3>
            <button className="btn-primary text-sm">
              <Plus className="w-4 h-4 mr-1" />
              Create Page
            </button>
          </div>
          <p className="text-gray-600 mb-4">Manage website pages and content</p>
          <div className="text-2xl font-bold text-gray-900">12 Pages</div>
        </div>
      </div>
    </div>
  );
};

const Analytics = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Website Traffic</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Chart placeholder</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Registrations</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Chart placeholder</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
          <button className="btn-outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
        <p className="text-gray-600">Generate and download reports for events, users, and donations.</p>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/admin/')[1] || 'dashboard';
  const [activeSection, setActiveSection] = useState('dashboard');

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Gallery', href: '/admin/gallery', icon: Image },
    { name: 'Stories', href: '/admin/stories', icon: MessageSquare },
    { name: 'Donations', href: '/admin/donations', icon: CreditCard },
    { name: 'Content', href: '/admin/content', icon: FileText },
    { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
    { name: 'Settings', href: '/admin/settings', icon: Settings }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'events':
        return <EventManagement />;
      case 'gallery':
        return <GalleryManager />;
      case 'stories':
        return <StoriesManagement />;
      case 'donations':
        return <DonationsManagement />;
      case 'content':
        return <ContentManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Portal - Beats of Washington</title>
        <meta name="description" content="Admin panel for managing Beats of Washington events, users, and content." />
      </Helmet>

      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg flex flex-col">
          <div className="h-20 flex items-center justify-center border-b">
            <span className="text-2xl font-bold text-primary-700">Admin Portal</span>
          </div>
          <nav className="flex-1 py-6">
            <ul className="space-y-2">
              {navigation.map((section) => (
                <li key={section.name}>
                  <button
                    className={`w-full flex items-center px-6 py-3 text-left rounded-lg transition-colors duration-200 font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 focus:outline-none ${
                      activeSection === section.name.toLowerCase() ? 'bg-primary-100 text-primary-700' : ''
                    }`}
                    onClick={() => setActiveSection(section.name.toLowerCase())}
                  >
                    <section.icon className="w-5 h-5 mr-3" />
                    {section.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-6 border-t">
            <button className="flex items-center text-gray-500 hover:text-red-600 font-medium">
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8">
          {renderSection()}
        </main>
      </div>
    </>
  );
};

export default AdminPanel; 