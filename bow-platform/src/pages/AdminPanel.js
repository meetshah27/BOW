import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/common/FileUpload';
import ImagePlaceholder from '../components/common/ImagePlaceholder';
import api from '../config/api';
import PaymentReceipt from '../components/PaymentReceipt';

import { 
  Users, 
  Calendar, 
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
  TrendingUp,
  Upload,
  CheckCircle,
  XCircle,
  ClipboardList,
  UserPlus,
  Ticket,
  Clock,
  X,
  Mail,
  Star
} from 'lucide-react';
import VolunteerManagement from '../components/admin/VolunteerManagement';
import VolunteerOpportunityManager from '../components/admin/VolunteerOpportunityManager';
import StoriesManagement from '../components/admin/StoriesManagement';
import NewsletterManagement from '../components/admin/NewsletterManagement';
import HeroManagement from '../components/admin/HeroManagement';
import MissionMediaManagement from '../components/admin/MissionMediaManagement';
import FounderMediaManagement from '../components/admin/FounderMediaManagement';
import LeaderManagement from '../components/admin/LeaderManagement';
import AboutPageManagement from '../components/admin/AboutPageManagement';
import FounderContentManagement from '../components/admin/FounderContentManagement';
import { getFutureDateString, formatDate, parseDateString } from '../utils/dateUtils';

// Helper function to fix timezone issues with dates
// This prevents the common issue where selecting "5 Sep" shows as "4 Sep" due to timezone conversion
const fixDateTimezone = (dateString) => {
  if (!dateString) return dateString;
  
  // Create a date object in local timezone to preserve the exact date selected
  const [year, month, day] = dateString.split('-').map(Number);
  const localDate = new Date(year, month - 1, day); // month is 0-indexed
  return localDate.toISOString().split('T')[0]; // Convert back to YYYY-MM-DD
};

// Helper function to format time for display
const formatTimeForDisplay = (timeString) => {
  if (!timeString) return '—';
  
  // If it's already in a readable format (contains AM/PM), return as is
  if (timeString.includes('AM') || timeString.includes('PM')) {
    return timeString;
  }
  
  // If it's in HH:MM format, convert to 12-hour format
  if (/^\d{1,2}:\d{2}$/.test(timeString)) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  }
  
  return timeString;
};

// SimpleModal component for modals
function SimpleModal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', zIndex: 1000, left: 0, top: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.4)'
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: 8, maxWidth: 500, margin: '5% auto', padding: 24, position: 'relative'
      }} onClick={e => e.stopPropagation()}>
        <button style={{
          position: 'absolute', top: 8, right: 8, fontWeight: 'bold', fontSize: 18
        }} onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}

// Admin Sub-components
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: null,
    activeEvents: null,
    monthlyDonations: null,
    volunteerHours: null,
    totalLeaders: null,
    activeLeaders: null,
    loading: true,
    error: null
  });
  const [logoUrl, setLogoUrl] = useState('');

  // Fetch logo from about page content
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await api.get('/about-page');
        if (response.ok) {
          const data = await response.json();
          if (data.logo) {
            setLogoUrl(data.logo);
          }
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
    
    fetchLogo();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total members
        const usersRes = await api.user.get('/users/stats/overview');
        const usersData = usersRes.ok ? await usersRes.json() : {};
        // Fetch active events
        const eventsRes = await api.get('/events');
        const eventsData = eventsRes.ok ? await eventsRes.json() : [];
        // Fetch monthly donations
        const donationsRes = await api.get('/payment/donations/stats');
        const donationsData = donationsRes.ok ? await donationsRes.json() : {};
        // Fetch volunteer hours (use totalApplications as proxy)
        const volunteersRes = await api.get('/volunteers/stats');
        const volunteersData = volunteersRes.ok ? await volunteersRes.json() : {};
        // Fetch leaders stats
        const leadersRes = await api.get('/leaders/stats/overview');
        const leadersData = leadersRes.ok ? await leadersRes.json() : {};

        setStats({
          totalMembers: usersData.totalUsers ?? 0,
          activeEvents: Array.isArray(eventsData) ? eventsData.filter(e => e.isActive).length : 0,
          monthlyDonations: donationsData.monthlyStats && donationsData.monthlyStats[0] ? (donationsData.monthlyStats[0].amount / 100) : 0,
          volunteerHours: volunteersData.totalApplications ?? 0,
          totalLeaders: leadersData.totalLeaders ?? 0,
          activeLeaders: leadersData.activeCount ?? 0,
          loading: false,
          error: null
        });
      } catch (err) {
        setStats(s => ({ ...s, loading: false, error: 'Failed to load dashboard stats.' }));
      }
    };
    fetchStats();
  }, []);

  // Enhanced stat cards with icons and color backgrounds
  const statCards = [
    {
      title: 'Total Members',
      value: stats.loading ? '...' : stats.totalMembers,
      icon: Users,
      color: 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700',
      iconBg: 'bg-blue-200'
    },
    {
      title: 'Active Events',
      value: stats.loading ? '...' : stats.activeEvents,
      icon: Calendar,
      color: 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700',
      iconBg: 'bg-orange-200'
    },
    {
      title: 'Monthly Donations',
      value: stats.loading ? '...' : `$${stats.monthlyDonations?.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`,
      icon: CreditCard,
      color: 'bg-gradient-to-br from-green-100 to-green-200 text-green-700',
      iconBg: 'bg-green-200'
    },
    {
      title: 'Volunteer Hours',
      value: stats.loading ? '...' : stats.volunteerHours,
      icon: Users,
      color: 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700',
      iconBg: 'bg-purple-200'
    },
    {
      title: 'Total Leaders',
      value: stats.loading ? '...' : stats.totalLeaders,
      icon: Users,
      color: 'bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700',
      iconBg: 'bg-indigo-200'
    },
    {
      title: 'Active Leaders',
      value: stats.loading ? '...' : stats.activeLeaders,
      icon: Users,
      color: 'bg-gradient-to-br from-teal-100 to-teal-200 text-teal-700',
      iconBg: 'bg-teal-200'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary-700 via-orange-500 to-secondary-600 rounded-2xl p-8 text-white shadow-xl mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center">
            <Settings className="w-8 h-8 mr-3 text-white/80" />
            Admin Dashboard
          </h2>
          <p className="text-primary-100 text-lg">Welcome, Admin! Manage your platform with ease.</p>
        </div>
        <div className="hidden md:block">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="BOW Logo" 
                className="w-full h-full object-cover"
              />
            ) : (
            <Users className="w-12 h-12 text-white" />
            )}
          </div>
        </div>
      </div>
      {stats.error && <div className="text-red-600 font-semibold">{stats.error}</div>}
      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm font-medium">{stat.title}</div>
          </div>
        ))}
      </div>
      {/* Recent Activity (unchanged) */}
      <div className="bg-white/80 rounded-2xl shadow-xl p-6 mt-8">
        <div className="space-y-4">
          {/* You can update this section to show real activity if desired */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">founders</p>
              <p className="text-sm text-gray-600">Anand Sane and Deepali sane</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filter, setFilter] = useState({ status: 'all', live: 'all', category: 'all' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    longDescription: '',
    date: '',
    time: '18:00',
    location: '',
    address: '',
    category: 'Festival',
    capacity: 0,
    price: 0,
    organizer: '',
    contactPhone: '',
    contactEmail: '',
    contactWebsite: '',
    image: '',
    featured: false,
    tags: []
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterDropdownRef = React.useRef();
  const navigate = useNavigate();
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    }
    if (showFilterDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showFilterDropdown]);

  // Get unique categories from events
  const uniqueCategories = Array.from(new Set(events.map(e => e.category))).filter(Boolean);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      console.log('Fetched events:', data);
      // Debug: Check time fields
      data.forEach((event, index) => {
        console.log(`Event ${index + 1} (${event.title}): time = "${event.time}"`);
      });
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const createPlaceholderEvent = async () => {
    try {
      const placeholderEvent = {
        title: "Sample Event - Edit Me",
        description: "This is a placeholder event. Please edit the details to create your actual event.",
        longDescription: "This is a sample event created as a placeholder. You can edit all the details including the title, description, date, location, and other information to match your actual event requirements.\n\nTo customize this event:\n• Change the title to your event name\n• Update the description with your event details\n• Set the correct date and time\n• Add the actual location and address\n• Update contact information\n• Add relevant tags\n• Upload a proper event image",
        date: getFutureDateString(7), // 7 days from now
        time: "18:00",
        location: "Sample Location",
        address: "123 Sample Street, Seattle, WA 98101",
        category: "Festival",
        image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        capacity: 100,
        price: 0,
        organizer: "Beats of Washington",
        contact: { 
          phone: "(206) 555-0123", 
          email: "events@beatsofwashington.org", 
          website: "https://beatsofwashington.org" 
        },
        tags: ["Sample", "Placeholder"],
        featured: false,
        isLive: false,
        isActive: true,
        registeredCount: 0
      };

      const response = await api.post('/events', placeholderEvent);
      
      if (!response.ok) throw new Error('Failed to create placeholder event');
      const created = await response.json();
      setEvents([...events, created]);
      setShowCreateModal(false);
      toast.success('Placeholder event created successfully! You can now edit it.');
    } catch (err) {
      toast.error('Error creating placeholder event: ' + err.message);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      // Debug: Log the time value being sent
      console.log('Creating event with time:', newEvent.time);
      
      // Use uploaded image URL if available, otherwise use default
      const imageUrl = uploadedImage ? uploadedImage.fileUrl : 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
      
      // Fix timezone issue: Ensure the selected date is preserved exactly as chosen
      const eventDate = fixDateTimezone(newEvent.date);
      if (newEvent.date) {
        console.log('Date fix - Original:', newEvent.date, 'Fixed:', eventDate);
        console.log('This ensures the exact date you selected is preserved regardless of timezone');
      }
      
      const response = await api.post('/events', {
        title: newEvent.title,
        description: newEvent.description,
        longDescription: newEvent.description, // Use description as longDescription for simplicity
        date: eventDate,
        time: newEvent.time,
        location: newEvent.location,
        address: newEvent.location, // Use location as address for simplicity
        category: newEvent.category,
        image: imageUrl,
        capacity: newEvent.capacity,
        price: newEvent.price,
        organizer: newEvent.organizer || 'Beats of Washington',
        contact: { 
          phone: '(206) 555-0123', 
          email: 'events@beatsofwashington.org', 
          website: 'https://beatsofwashington.org' 
        },
        tags: ['Event'],
        featured: newEvent.featured,
        isLive: newEvent.isLive,
        isActive: true,
        registeredCount: 0
      });
      console.log('Response:', response);
      if (!response.ok) throw new Error('Failed to create event');
      const created = await response.json();
      console.log('Created event:', created);
      console.log('Event time field:', created.time);
      setEvents([...events, created]);
      setShowCreateModal(false);
      toast.success('Event created successfully!');
      setNewEvent({
        title: '',
        description: '',
        longDescription: '',
        date: '',
        time: '18:00',
        location: '',
        address: '',
        category: 'Festival',
        capacity: 0,
        price: 0,
        organizer: '',
        contactPhone: '',
        contactEmail: '',
        contactWebsite: '',
        image: '',
        featured: false,
        tags: []
      });
      setUploadedImage(null);
    } catch (err) {
      toast.error('Error creating event: ' + err.message);
    }
  };

  const handleView = (event) => {
    setSelectedEvent(event);
    setShowViewModal(true);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const handleDelete = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedEvent) return;
    try {
      const response = await api.delete(`/events/${selectedEvent.id}`);
      if (!response.ok) throw new Error('Failed to delete event');
      await fetchEvents();
      setShowDeleteModal(false);
      setSelectedEvent(null);
      toast.success('Event deleted successfully!');
    } catch (err) {
      alert('Error deleting event: ' + err.message);
    }
  };

  const handleEditSave = async (updatedEvent) => {
    try {
      console.log('handleEditSave called with:', updatedEvent);
      console.log('Event ID for update:', updatedEvent.id);
      console.log('Event _id for update:', updatedEvent._id);
      
      if (!updatedEvent.id) {
        throw new Error('Event ID is missing. Cannot update event.');
      }
      
      const response = await api.put(`/events/${updatedEvent.id}`, updatedEvent);
      if (!response.ok) throw new Error('Failed to update event');
      await fetchEvents();
      setShowEditModal(false);
      setSelectedEvent(null);
      toast.success('Event updated successfully!');
    } catch (err) {
      console.error('Error in handleEditSave:', err);
      alert('Error updating event: ' + err.message);
    }
  };

  const handleViewRegistrations = async (event) => {
    setSelectedEvent(event);
    setShowRegistrationsModal(true);
    setLoadingRegistrations(true);
    try {
      const response = await api.get(`/events/${event._id}/registrations`);
      if (!response.ok) throw new Error('Failed to fetch registrations');
      const data = await response.json();
      console.log('Registrations data received:', data);
      console.log('Sample registration:', data[0]);
      setRegistrations(data);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setRegistrations([]);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const statusMatch = filter.status === 'all' || (filter.status === 'active' ? event.isActive : !event.isActive);
    const liveMatch = filter.live === 'all' || (filter.live === 'live' ? event.isLive : !event.isLive);
    const categoryMatch = filter.category === 'all' || event.category === filter.category;
    return statusMatch && liveMatch && categoryMatch;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
        <div className="flex gap-2">
          <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium px-5 py-2 rounded-xl shadow hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </button>
          <button className="bg-gradient-to-r from-red-500 to-orange-600 text-white font-medium px-5 py-2 rounded-xl shadow hover:from-red-600 hover:to-orange-700 transition-all duration-200 flex items-center" onClick={async () => {
            if (window.confirm('Are you sure you want to delete ALL events? This action cannot be undone.')) {
              try {
                const response = await api.delete('/events/all');
                if (!response.ok) throw new Error('Failed to delete all events');
                await fetchEvents();
                toast.success('All events deleted successfully!');
              } catch (err) {
                toast.error('Error deleting all events: ' + err.message);
              }
            }
          }}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete All
          </button>
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg px-4 py-2 inline-block">Create New Event</h3>
            
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input type="text" className="w-full border rounded px-3 py-2" required value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select className="w-full border rounded px-3 py-2" value={newEvent.category} onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}>
                    <option value="Festival">Festival</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Concert">Concert</option>
                    <option value="Community">Community Event</option>
                    <option value="Youth">Youth Program</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea className="w-full border rounded px-3 py-2" rows="2" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date *</label>
                  <input type="date" className="w-full border rounded px-3 py-2" required value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                   {newEvent.date && (
                     <div className="text-xs text-gray-500 mt-1">
                       Selected date: {(() => {
                         // Parse the date string manually to avoid timezone issues
                         const [year, month, day] = newEvent.date.split('-').map(Number);
                         const localDate = new Date(year, month - 1, day); // month is 0-indexed
                         return localDate.toLocaleDateString('en-US', { 
                           weekday: 'long', 
                           year: 'numeric', 
                           month: 'long', 
                           day: 'numeric' 
                         });
                       })()}
                       <br />
                       <span className="text-blue-600">✓ This exact date will be saved (no timezone issues)</span>
                     </div>
                   )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input 
                    type="time" 
                    className="w-full border rounded px-3 py-2" 
                    value={newEvent.time || ''} 
                    onChange={e => {
                      console.log('Time input changed:', e.target.value);
                      setNewEvent({ ...newEvent, time: e.target.value });
                    }}
                  />
                  {newEvent.time && (
                    <div className="text-xs text-gray-500 mt-1">
                      Selected time: {formatTimeForDisplay(newEvent.time)}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    <button 
                      type="button" 
                      onClick={() => setNewEvent({ ...newEvent, time: '18:00' })}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Set to 6:00 PM
                    </button>
                    <span className="ml-2 text-gray-500">
                      Raw value: "{newEvent.time}"
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Location *</label>
                  <input type="text" className="w-full border rounded px-3 py-2" required value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Capacity *</label>
                  <input type="number" className="w-full border rounded px-3 py-2" required min={1} value={newEvent.capacity} onChange={e => setNewEvent({ ...newEvent, capacity: Number(e.target.value) })} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($, 0 for Free)</label>
                  <input type="number" className="w-full border rounded px-3 py-2" required min={0} value={newEvent.price} onChange={e => setNewEvent({ ...newEvent, price: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Organizer</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={newEvent.organizer} onChange={e => setNewEvent({ ...newEvent, organizer: e.target.value })} />
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input type="checkbox" id="featured" className="mr-2" checked={newEvent.featured} onChange={e => setNewEvent({ ...newEvent, featured: e.target.checked })} />
                  <label htmlFor="featured" className="text-sm font-medium">Featured Event</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="isLive" className="mr-2" checked={newEvent.isLive} onChange={e => setNewEvent({ ...newEvent, isLive: e.target.checked })} />
                  <label htmlFor="isLive" className="text-sm font-medium">Event Live (Allow Registration)</label>
                </div>
              </div>
              
              {/* Event Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Event Image</label>
                {!uploadedImage && (
                  <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center text-gray-600">
                      <div className="w-16 h-12 bg-gray-200 rounded border flex items-center justify-center mr-3">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">No image selected</p>
                        <p className="text-xs text-gray-500">Upload an image below to use for this event</p>
                      </div>
                    </div>
                  </div>
                )}
                <FileUpload
                  onUpload={(fileData) => setUploadedImage(fileData)}
                  onRemove={() => setUploadedImage(null)}
                  folder="events"
                  accept="image/*"
                  multiple={false}
                  maxFiles={1}
                  showPreview={true}
                  className="mb-4"
                />
                {uploadedImage && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-green-800">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Image uploaded successfully!</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadedImage(null)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove Image
                      </button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={uploadedImage.fileUrl} 
                        alt="Uploaded preview" 
                        className="w-20 h-16 object-cover rounded border"
                      />
                      <div>
                        <p className="text-xs text-green-600">This image will be used for the event.</p>
                        <p className="text-xs text-gray-500 mt-1">{uploadedImage.originalName}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 pt-4 border-t">
                <button type="button" className="btn-outline flex-1" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary flex-1">Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">All Events</h3>
            <div className="flex space-x-2">
              <div className="relative">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50" onClick={() => setShowFilterDropdown(v => !v)}>
                  <Filter className="w-4 h-4" />
                </button>
                {showFilterDropdown && (
                  <div ref={filterDropdownRef} className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                    <div className="mb-3">
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                      <select className="w-full border rounded px-2 py-1" value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Live</label>
                      <select className="w-full border rounded px-2 py-1" value={filter.live} onChange={e => setFilter(f => ({ ...f, live: e.target.value }))}>
                        <option value="all">All</option>
                        <option value="live">Live</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
                      <select className="w-full border rounded px-2 py-1" value={filter.category} onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}>
                        <option value="all">All</option>
                        {uniqueCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <button className="w-full mt-2 bg-primary-600 text-white py-1 rounded" onClick={() => setShowFilterDropdown(false)}>Apply</button>
                  </div>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Live</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap max-w-xs">
                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    {/* Show description with ellipsis and tooltip for long text */}
                    <div
                      className="text-xs text-gray-600 mt-1 overflow-hidden text-ellipsis"
                      style={{
                        maxWidth: '220px',
                        maxHeight: '3.6em', // ~3 lines
                        whiteSpace: 'normal',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                      title={event.description}
                    >
                      {event.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {(() => {
                        // Parse the date string manually to avoid timezone issues
                        const [year, month, day] = event.date.split('-').map(Number);
                        const localDate = new Date(year, month - 1, day); // month is 0-indexed
                        return localDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                        });
                      })()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatTimeForDisplay(event.time)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {event.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      event.isLive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event.isLive ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.registeredCount || 0}/{event.capacity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.price === 0 ? 'Free' : `$${event.price}`}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {/* View Event Details */}
                      <button className="text-primary-600 hover:text-primary-900" onClick={() => handleView(event)}><Eye className="w-4 h-4" /></button>
                      {/* Edit Event */}
                      <button className="text-blue-600 hover:text-blue-900" onClick={() => handleEdit(event)}><Edit className="w-4 h-4" /></button>
                      {/* Delete Event */}
                      <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(event)}><Trash2 className="w-4 h-4" /></button>
                      {/* View Registrations */}
                      <button className="text-green-600 hover:text-green-900" onClick={() => handleViewRegistrations(event)} title="View Registrations"> <Users className="w-4 h-4" /> </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SimpleModal open={showViewModal} onClose={() => setShowViewModal(false)}>
        {selectedEvent && (
          <div>
            <h2 style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 12 }}>Event Details</h2>
            <div><b>Title:</b> {selectedEvent.title}</div>
            <div><b>Date:</b> {(() => {
              // Parse the date string manually to avoid timezone issues
              const [year, month, day] = selectedEvent.date.split('-').map(Number);
              const localDate = new Date(year, month - 1, day); // month is 0-indexed
              return localDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              });
            })()}</div>
            <div><b>Time:</b> {formatTimeForDisplay(selectedEvent.time)}</div>
            <div><b>Location:</b> {selectedEvent.location}</div>
            <div><b>Description:</b> {selectedEvent.description}</div>
            <div><b>Category:</b> {selectedEvent.category}</div>
            <div><b>Capacity:</b> {selectedEvent.capacity}</div>
            <div><b>Price:</b> {selectedEvent.price}</div>
            <div><b>Status:</b> {selectedEvent.isActive ? 'Active' : 'Inactive'}</div>
            <div><b>Live:</b> {selectedEvent.isLive ? 'Live' : 'Draft'}</div>
          </div>
        )}
      </SimpleModal>

      <SimpleModal open={showEditModal} onClose={() => setShowEditModal(false)}>
        {selectedEvent && (
          <EditEventForm event={selectedEvent} onSave={handleEditSave} onCancel={() => setShowEditModal(false)} />
        )}
      </SimpleModal>

      <SimpleModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div>
          <h2 style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 12 }}>Delete Event</h2>
          <p>Are you sure you want to delete this event?</p>
          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <button onClick={confirmDelete} style={{ background: '#dc2626', color: 'white', padding: '8px 16px', borderRadius: 4 }}>Delete</button>
            <button onClick={() => setShowDeleteModal(false)} style={{ background: '#e5e7eb', color: '#111', padding: '8px 16px', borderRadius: 4 }}>Cancel</button>
          </div>
        </div>
      </SimpleModal>

      <SimpleModal open={showRegistrationsModal} onClose={() => setShowRegistrationsModal(false)}>
        <div>
          <h2 style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 12 }}>Registrations for {selectedEvent?.title}</h2>
                    {loadingRegistrations ? (
            <div>Loading...</div>
          ) : (
            <div style={{ maxHeight: 350, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Name</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Email</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Ticket #</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Payment</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>No registrations found for this event.</td></tr>
                  ) : (
                    registrations.map(r => (
                      <tr key={r._id}>
                        <td style={{ padding: 8, border: '1px solid #eee' }}>{r.userName || r.name || '-'}</td>
                        <td style={{ padding: 8, border: '1px solid #eee' }}>{r.userEmail || '-'}</td>
                        <td style={{ padding: 8, border: '1px solid #eee' }}>{r.ticketNumber || '-'}</td>
                                              <td style={{ padding: 8, border: '1px solid #eee', minWidth: '200px' }}>
                        {r.paymentAmount > 0 ? (
                          <div>
                            <div style={{ fontWeight: 'bold', color: '#059669' }}>${r.paymentAmount}</div>
                            {r.paymentIntentId && (
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                Receipt: {r.paymentIntentId.slice(-8)}
                              </div>
                            )}
                            {r.paymentStatus === 'completed' && (
                              <span style={{ 
                                background: '#dcfce7', 
                                color: '#166534', 
                                padding: '2px 6px', 
                                borderRadius: '4px', 
                                fontSize: '11px',
                                fontWeight: 'bold'
                              }}>
                                ✓ Paid
                              </span>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: '#6b7280', fontStyle: 'italic' }}>Free Event</span>
                        )}
                        {/* PaymentReceipt Component */}
                        <div style={{ marginTop: '8px', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                          <PaymentReceipt
                            paymentAmount={r.paymentAmount || 0}
                            paymentStatus={r.paymentStatus || 'none'}
                            paymentIntentId={r.paymentIntentId}
                            paymentDate={r.paymentDate}
                            isPaidEvent={r.paymentAmount > 0}
                            showDetails={true}
                          />
                        </div>
                      </td>
                        <td style={{ padding: 8, border: '1px solid #eee' }}>{r.registrationDate ? new Date(r.registrationDate).toLocaleString() : '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </SimpleModal>
    </div>
  );
};

function EditEventForm({ event, onSave, onCancel }) {
  const [form, setForm] = React.useState({ ...event });
  const [saving, setSaving] = React.useState(false);
  const [uploadedImage, setUploadedImage] = React.useState(null);
  
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    
    // Fix timezone issue: Ensure the selected date is preserved exactly as chosen
    const fixedDate = fixDateTimezone(form.date);
    
    // Use uploaded image URL if available, otherwise keep existing image
    const updatedForm = {
      ...form,
      date: fixedDate,
      image: uploadedImage ? uploadedImage.fileUrl : form.image
    };
    
    // Ensure we have the correct ID field for the update
    if (updatedForm._id && !updatedForm.id) {
      updatedForm.id = updatedForm._id;
    }
    
    if (form.date !== fixedDate) {
      console.log('Edit form date fix - Original:', form.date, 'Fixed:', fixedDate);
    }
    
    console.log('Submitting updated form:', updatedForm);
    console.log('Form ID field:', updatedForm.id);
    console.log('Form _id field:', updatedForm._id);
    
    await onSave(updatedForm);
    setSaving(false);
  };
  return (
    <form onSubmit={handleSubmit} style={{ maxHeight: 400, overflowY: 'auto' }}>
      <h2 style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 12 }}>Edit Event</h2>
      <div style={{ marginBottom: 8 }}>
        <label>Title:<br /><input name="title" value={form.title} onChange={handleChange} style={{ width: '100%' }} /></label>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Date:<br /><input name="date" type="date" value={form.date ? form.date.slice(0,10) : ''} onChange={handleChange} style={{ width: '100%' }} /></label>
           {form.date && (
             <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
               Selected date: {(() => {
                 // Parse the date string manually to avoid timezone issues
                 const dateStr = form.date.slice(0, 10); // Ensure we only get YYYY-MM-DD
                 const [year, month, day] = dateStr.split('-').map(Number);
                 const localDate = new Date(year, month - 1, day); // month is 0-indexed
                 return localDate.toLocaleDateString('en-US', { 
                   weekday: 'long', 
                   year: 'numeric', 
                   month: 'long', 
                   day: 'numeric' 
                 });
               })()}
             </div>
           )}
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Time:<br /><input name="time" value={form.time} onChange={handleChange} style={{ width: '100%' }} /></label>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Location:<br /><input name="location" value={form.location} onChange={handleChange} style={{ width: '100%' }} /></label>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Description:<br /><textarea name="description" value={form.description} onChange={handleChange} style={{ width: '100%', minHeight: '120px', resize: 'vertical' }} rows="6" /></label>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Category:<br /><input name="category" value={form.category} onChange={handleChange} style={{ width: '100%' }} /></label>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Capacity:<br /><input name="capacity" type="number" value={form.capacity} onChange={handleChange} style={{ width: '100%' }} /></label>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Price:<br /><input name="price" type="number" value={form.price} onChange={handleChange} style={{ width: '100%' }} /></label>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Status: <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} /> Active</label>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Live: <input name="isLive" type="checkbox" checked={form.isLive} onChange={handleChange} /> Event Live</label>
      </div>
      
      {/* Event Image Upload */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Event Image</label>
        <div style={{ marginBottom: 8 }}>
          {form.image ? (
            <div style={{ marginBottom: 8, position: 'relative', display: 'inline-block' }}>
              <img src={form.image} alt="Current event image" style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: 4 }} />
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, image: '' }))}
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  background: '#dc2626',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  zIndex: 10
                }}
                title="Remove current image"
                onMouseOver={(e) => {
                  e.target.style.background = '#b91c1c';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#dc2626';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                ×
              </button>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Current image</p>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, image: '' }))}
                  style={{
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '10px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#b91c1c'}
                  onMouseOut={(e) => e.target.style.background = '#dc2626'}
                >
                  DELETE IMAGE
                </button>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: 8, padding: 8, backgroundColor: '#f9fafb', border: '1px solid #d1d5db', borderRadius: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                <div style={{ width: '64px', height: '48px', backgroundColor: '#e5e7eb', border: '1px solid #d1d5db', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <span style={{ fontSize: '10px', color: '#6b7280' }}>No Image</span>
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', margin: 0 }}>No image set</p>
                  <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>Upload an image below to add one</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <FileUpload
          onUpload={(fileData) => setUploadedImage(fileData)}
          onRemove={() => setUploadedImage(null)}
          folder="events"
          accept="image/*"
          multiple={false}
          maxFiles={1}
          showPreview={true}
        />
        {uploadedImage && (
          <div style={{ marginTop: 8, padding: 8, backgroundColor: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', color: '#0c4a6e' }}>
                <CheckCircle style={{ width: 16, height: 16, marginRight: 8 }} />
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>New image uploaded!</span>
              </div>
              <button
                type="button"
                onClick={() => setUploadedImage(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X style={{ width: 14, height: 14, marginRight: 4 }} />
                Remove
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#0c4a6e', marginTop: 4 }}>This image will replace the current one.</p>
          </div>
        )}
      </div>
      
      {/* Save and Cancel Buttons */}
      <div style={{
        display: 'flex', gap: 16, justifyContent: 'flex-end', marginTop: 24, paddingTop: 16, borderTop: '2px solid #e5e7eb'
      }}>
        <button type="submit" disabled={saving} style={{ background: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: 6, fontWeight: 'bold', fontSize: '14px' }}>{saving ? 'Saving...' : 'Save'}</button>
        <button type="button" onClick={onCancel} style={{ background: '#e5e7eb', color: '#111', padding: '12px 24px', borderRadius: 6, fontWeight: 'bold', fontSize: '14px' }}>Cancel</button>
      </div>
    </form>
  );
}

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
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [mediaData, setMediaData] = useState({
    title: '',
    description: '',
    album: ''
  });
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    album: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('all');

  // Fetch gallery items
  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/gallery');
      if (!response.ok) throw new Error('Failed to fetch gallery items');
      const data = await response.json();
      setGalleryItems(data);
    } catch (err) {
      toast.error('Error fetching gallery items: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Get unique albums for filtering
  const albums = ['all', ...new Set(galleryItems.map(item => item.album).filter(Boolean))];

  // Filter items based on search and album
  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.album?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAlbum = selectedAlbum === 'all' || item.album === selectedAlbum;
    return matchesSearch && matchesAlbum;
  });

  const handleMediaUpload = (fileData) => {
    setUploadedMedia(prev => [...prev, fileData]);
  };

  const handleMediaRemove = (fileData) => {
    setUploadedMedia(prev => prev.filter(f => f.fileName !== fileData.fileName));
  };

  const handleSaveGallery = async () => {
    try {
      if (selectedItem && uploadedMedia.length > 0) {
        // Replacing existing item
        const media = uploadedMedia[0]; // Take first uploaded file
        const response = await api.put(`/gallery/${selectedItem.id}`, {
          title: mediaData.title || selectedItem.title,
          description: mediaData.description || selectedItem.description,
          album: mediaData.album || selectedItem.album,
          imageUrl: media.fileUrl,
          type: media.mimetype.startsWith('image/') ? 'image' : 'video'
        });

        if (!response.ok) throw new Error('Failed to update gallery item');
        toast.success('Gallery item updated successfully!');
      } else {
        // Creating new items
        for (const media of uploadedMedia) {
          const response = await api.post('/gallery', {
            title: mediaData.title || media.originalName,
            description: mediaData.description || '',
            album: mediaData.album || 'General',
            imageUrl: media.fileUrl,
            type: media.mimetype.startsWith('image/') ? 'image' : 'video'
          });

          if (!response.ok) throw new Error('Failed to save media data');
        }
        toast.success('Gallery media saved successfully!');
      }
      
      setShowUploadModal(false);
      setUploadedMedia([]);
      setMediaData({ title: '', description: '', album: '' });
      setSelectedItem(null);
      fetchGalleryItems(); // Refresh the list
    } catch (err) {
      toast.error('Error saving gallery media: ' + err.message);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditData({
      title: item.title || '',
      description: item.description || '',
      album: item.album || ''
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await api.put(`/gallery/${selectedItem.id}`, editData);
      if (!response.ok) throw new Error('Failed to update gallery item');
      
      toast.success('Gallery item updated successfully!');
      setShowEditModal(false);
      setSelectedItem(null);
      setEditData({ title: '', description: '', album: '' });
      fetchGalleryItems(); // Refresh the list
    } catch (err) {
      toast.error('Error updating gallery item: ' + err.message);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"? This will permanently remove the item and its media from S3.`)) {
      try {
        const response = await api.delete(`/gallery/${item.id}`);
        if (!response.ok) throw new Error('Failed to delete gallery item');
        
        toast.success('Gallery item deleted successfully from database and S3!');
        fetchGalleryItems(); // Refresh the list
      } catch (err) {
        toast.error('Error deleting gallery item: ' + err.message);
      }
    }
  };

  const handleRemoveImage = async (item) => {
    if (window.confirm(`Are you sure you want to remove the image from "${item.title}"? This will delete the media file from S3.`)) {
      try {
        const response = await api.put(`/gallery/${item.id}`, {
          ...item,
          imageUrl: null
        });
        if (!response.ok) throw new Error('Failed to remove image');
        
        toast.success('Image removed successfully from S3!');
        fetchGalleryItems(); // Refresh the list
      } catch (err) {
        toast.error('Error removing image: ' + err.message);
      }
    }
  };

  const handleReplaceImage = (item) => {
    setSelectedItem(item);
    setEditData({
      title: item.title || '',
      description: item.description || '',
      album: item.album || ''
    });
    setShowUploadModal(true);
  };

  const formatDateLocal = (dateString) => {
    return formatDate(dateString, 'short');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gallery Manager</h2>
        <button className="btn-primary" onClick={() => setShowUploadModal(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Media
        </button>
      </div>

      {/* Search and Filter */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search gallery items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <select
            value={selectedAlbum}
            onChange={(e) => setSelectedAlbum(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {albums.map(album => (
              <option key={album} value={album}>
                {album === 'all' ? 'All Albums' : album}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gallery Items Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading gallery items...</p>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <ImagePlaceholder
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                  showActions={true}
                  onRemove={() => handleRemoveImage(item)}
                  onReplace={() => handleReplaceImage(item)}
                >
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {item.imageUrl?.includes('.mp4') || item.imageUrl?.includes('.mov') || item.imageUrl?.includes('.avi') ? 'Video' : 'Image'}
                  </div>
                </ImagePlaceholder>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-2">
                    {item.title || 'Untitled'}
                  </h3>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {item.description || 'No description'}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {item.album || 'General'}
                  </span>
                  <span>{formatDateLocal(item.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredItems.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Gallery Items Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedAlbum !== 'all'
                ? 'No items match your current filters.'
                : 'No images or videos have been uploaded to the gallery yet.'
              }
            </p>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="btn-primary"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload First Item
            </button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg px-4 py-2 inline-block">
              {selectedItem ? 'Replace Gallery Media' : 'Upload Gallery Media'}
            </h3>
            
            <div className="space-y-6">
              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Upload Media Files</label>
                <FileUpload
                  onUpload={handleMediaUpload}
                  onRemove={handleMediaRemove}
                  folder="gallery"
                  accept="image/*,video/*"
                  multiple={true}
                  maxFiles={10}
                  showPreview={true}
                />
              </div>

              {/* Media Details */}
              {uploadedMedia.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Media Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title (for all media)</label>
                      <input 
                        type="text" 
                        className="w-full border rounded px-3 py-2" 
                        value={mediaData.title} 
                        onChange={e => setMediaData({ ...mediaData, title: e.target.value })} 
                        placeholder="Enter title for uploaded media"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Album</label>
                      <input 
                        type="text" 
                        className="w-full border rounded px-3 py-2" 
                        value={mediaData.album} 
                        onChange={e => setMediaData({ ...mediaData, album: e.target.value })} 
                        placeholder="Enter album name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description (for all media)</label>
                    <textarea 
                      className="w-full border rounded px-3 py-2" 
                      rows="3"
                      value={mediaData.description} 
                      onChange={e => setMediaData({ ...mediaData, description: e.target.value })} 
                      placeholder="Enter description for uploaded media"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3 pt-4 border-t">
                <button type="button" className="btn-outline flex-1" onClick={() => {
                  setShowUploadModal(false);
                  setUploadedMedia([]);
                  setMediaData({ title: '', description: '', album: '' });
                  setSelectedItem(null);
                }}>Cancel</button>
                <button 
                  type="button" 
                  className="btn-primary flex-1" 
                  onClick={handleSaveGallery}
                  disabled={uploadedMedia.length === 0}
                >
                  {selectedItem ? 'Replace Media' : `Save to Gallery (${uploadedMedia.length} files)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg px-4 py-2 inline-block">Edit Gallery Item</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full border rounded px-3 py-2" 
                  value={editData.title} 
                  onChange={e => setEditData({ ...editData, title: e.target.value })} 
                  placeholder="Enter title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Album</label>
                <input 
                  type="text" 
                  className="w-full border rounded px-3 py-2" 
                  value={editData.album} 
                  onChange={e => setEditData({ ...editData, album: e.target.value })} 
                  placeholder="Enter album name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="w-full border rounded px-3 py-2" 
                  rows="3"
                  value={editData.description} 
                  onChange={e => setEditData({ ...editData, description: e.target.value })} 
                  placeholder="Enter description"
                />
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium mb-1">Preview</label>
                <div className="border rounded p-3 bg-gray-50">
                  <ImagePlaceholder
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className="w-full h-32 object-cover rounded mb-2"
                    placeholderClassName="w-full h-32 bg-gray-100 flex items-center justify-center rounded mb-2"
                  />
                  <p className="text-sm text-gray-600">
                    <strong>Current URL:</strong> {selectedItem.imageUrl || 'No image'}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4 border-t">
                <button type="button" className="btn-outline flex-1" onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                  setEditData({ title: '', description: '', album: '' });
                }}>Cancel</button>
                <button 
                  type="button" 
                  className="btn-primary flex-1" 
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchDonations();
    fetchStats();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await api.get('/payment/donations?limit=100');
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
      const response = await api.get('/payment/donations/stats');
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

  const exportDonations = async () => {
    if (exporting) return;
    
    setExporting(true);
    try {
      // Fetch all donations for export (not just the limited view)
      const response = await api.get('/payment/donations?limit=1000');
      if (response.ok) {
        const data = await response.json();
        const allDonations = data.donations || donations;
        
        const csvContent = [
          ['Donor Name', 'Donor Email', 'Amount ($)', 'Status', 'Date', 'Transaction ID'],
          ...allDonations.map(donation => [
            donation.donorName || 'Anonymous',
            donation.donorEmail || 'N/A',
            (donation.amount / 100).toFixed(2),
            donation.status,
            new Date(donation.createdAt).toLocaleDateString(),
            donation.paymentIntentId || 'N/A'
          ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast.success('Donations report exported successfully!');
      } else {
        toast.error('Failed to fetch donations for export');
      }
    } catch (error) {
      console.error('Error exporting donations:', error);
      toast.error('Failed to export donations report');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Donations & Payment Logs</h2>
        <button 
          onClick={exportDonations}
          disabled={exporting}
          className="btn-outline"
        >
          {exporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </>
          )}
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

const RegistrationManagement = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ event: 'all', status: 'all', date: 'all' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedRegistrations, setSelectedRegistrations] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchRegistrations();
    fetchEvents();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events/registrations');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched registrations:', data);
        setRegistrations(data);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched events:', data);
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleCheckIn = async (registration) => {
    try {
      const response = await api.put(`/events/registrations/${registration.eventId}/${registration.userId}/checkin`, { checkedIn: true, checkInTime: new Date() });

      if (response.ok) {
        toast.success('Check-in successful!');
        fetchRegistrations(); // Refresh the list
        setShowCheckInModal(false);
      } else {
        toast.error('Check-in failed');
      }
    } catch (error) {
      console.error('Error checking in:', error);
      toast.error('Check-in failed');
    }
  };

  const handleStatusUpdate = async (registrationId, newStatus) => {
    try {
      const response = await api.put(`/events/registrations/${registrationId}/status`, { status: newStatus });

      if (response.ok) {
        toast.success('Status updated successfully!');
        fetchRegistrations(); // Refresh the list
      } else {
        toast.error('Status update failed');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Status update failed');
    }
  };

  // Bulk delete functionality
  const handleSelectRegistration = (registration) => {
    const key = `${registration.eventId}-${registration.userId}`;
    setSelectedRegistrations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRegistrations(new Set());
      setSelectAll(false);
    } else {
      const allKeys = filteredRegistrations.map(reg => `${reg.eventId}-${reg.userId}`);
      setSelectedRegistrations(new Set(allKeys));
      setSelectAll(true);
    }
  };

  const deleteRegistration = async (registration) => {
    if (!window.confirm(`Are you sure you want to delete the registration for ${registration.userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await api.delete(`/events/registrations/${registration.eventId}/${registration.userId}`);

      if (response.ok) {
        toast.success('Registration deleted successfully!');
        fetchRegistrations(); // Refresh the list
      } else {
        toast.error('Failed to delete registration');
      }
    } catch (error) {
      console.error('Error deleting registration:', error);
      toast.error('Error deleting registration');
    }
  };

  const bulkDeleteRegistrations = async () => {
    if (selectedRegistrations.size === 0) {
      toast.error('Please select at least one registration to delete.');
      return;
    }

    const selectedRegs = filteredRegistrations.filter(reg => 
      selectedRegistrations.has(`${reg.eventId}-${reg.userId}`)
    );

    const confirmMessage = selectedRegs.length === 1 
      ? `Are you sure you want to delete the registration for ${selectedRegs[0].userName}?`
      : `Are you sure you want to delete ${selectedRegs.length} registrations? This action cannot be undone.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      // Delete registrations one by one
      const deletePromises = selectedRegs.map(async (reg) => {
        const response = await api.delete(`/events/registrations/${reg.eventId}/${reg.userId}`);
        return { reg, success: response.ok };
      });

      const results = await Promise.all(deletePromises);
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      // Show success message
      if (successful.length > 0) {
        toast.success(`Successfully deleted ${successful.length} registration(s)!`);
        fetchRegistrations(); // Refresh the list
      }

      // Show error message for failed deletions
      if (failed.length > 0) {
        toast.error(`Failed to delete ${failed.length} registration(s). Please try again.`);
      }

      // Clear selections
      setSelectedRegistrations(new Set());
      setSelectAll(false);
      
    } catch (error) {
      console.error('Error bulk deleting registrations:', error);
      toast.error('Error deleting registrations. Please try again.');
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    // Event filter
    if (filter.event !== 'all' && reg.eventTitle !== filter.event) {
      console.log(`Filtering out registration ${reg.ticketNumber}: eventTitle "${reg.eventTitle}" doesn't match filter "${filter.event}"`);
      return false;
    }
    // Status filter
    if (filter.status !== 'all' && reg.status !== filter.status) {
      console.log(`Filtering out registration ${reg.ticketNumber}: status "${reg.status}" doesn't match filter "${filter.status}"`);
      return false;
    }
    // Payment filter
    if (filter.payment === 'paid' && (!reg.paymentAmount || reg.paymentAmount === 0)) {
      console.log(`Filtering out registration ${reg.ticketNumber}: not a paid event`);
      return false;
    }
    if (filter.payment === 'free' && (reg.paymentAmount && reg.paymentAmount > 0)) {
      console.log(`Filtering out registration ${reg.ticketNumber}: not a free event`);
      return false;
    }
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (reg.userName && reg.userName.toLowerCase().includes(searchLower)) ||
        (reg.userEmail && reg.userEmail.toLowerCase().includes(searchLower)) ||
        (reg.ticketNumber && reg.ticketNumber.toLowerCase().includes(searchLower)) ||
        (reg.eventTitle && reg.eventTitle.toLowerCase().includes(searchLower));
      if (!matchesSearch) {
        console.log(`Filtering out registration ${reg.ticketNumber}: doesn't match search term "${searchTerm}"`);
        return false;
      }
    }
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportRegistrations = () => {
    const csvContent = [
      ['Ticket Number', 'Event', 'Name', 'Email', 'Phone', 'Status', 'Payment Receipt', 'Registration Date', 'Check-in Status'],
      ...filteredRegistrations.map(reg => [
        reg.ticketNumber,
        reg.eventTitle || 'N/A',
        reg.userName,
        reg.userEmail,
        reg.phone,
        reg.status,
        reg.paymentAmount > 0 ? `$${reg.paymentAmount} - ${reg.paymentStatus}` : 'Free Event',
        new Date(reg.registrationDate).toLocaleDateString(),
        reg.checkedIn ? 'Checked In' : 'Not Checked In'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadPaymentReceipt = (registration) => {
    if (!registration.paymentAmount || registration.paymentAmount === 0) {
      return; // No receipt for free events
    }

    // Create a professional receipt content
    const receiptContent = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                              PAYMENT RECEIPT                                ║
╚══════════════════════════════════════════════════════════════════════════════╝

Event Details:
═══════════════
Event Name:     ${registration.eventTitle || 'N/A'}
Event Date:     ${registration.registrationDate ? new Date(registration.registrationDate).toLocaleDateString() : 'N/A'}

Attendee Information:
══════════════════════
Name:           ${registration.userName}
Email:          ${registration.userEmail}
Phone:          ${registration.phone || 'N/A'}
Ticket Number:  ${registration.ticketNumber}

Payment Information:
════════════════════
Amount:         $${registration.paymentAmount}
Status:         ${registration.paymentStatus || 'N/A'}
Payment Method: ${registration.paymentMethod || 'Card'}
Receipt ID:     ${registration.paymentIntentId || 'N/A'}
Payment Date:   ${registration.paymentDate ? new Date(registration.paymentDate).toLocaleDateString() : 'N/A'}

Registration Details:
════════════════════
Registration Date: ${new Date(registration.registrationDate).toLocaleDateString()}
Status:            ${registration.status}
Check-in Status:   ${registration.checkedIn ? 'Checked In' : 'Not Checked In'}

══════════════════════════════════════════════════════════════════════════════
Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
This receipt serves as proof of payment for the above event registration.
    `.trim();

    // Create and download the receipt
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${registration.ticketNumber}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">Registration Management</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Registration Management</h2>
          <div className="flex space-x-2">
            {/* Bulk Delete Button */}
            {selectedRegistrations.size > 0 && (
              <button
                onClick={bulkDeleteRegistrations}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white font-medium px-5 py-2 rounded-xl shadow hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Selected ({selectedRegistrations.size})</span>
              </button>
            )}
            <button 
              onClick={exportRegistrations}
              className="btn-outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Registrations</p>
              <p className="text-2xl font-bold text-gray-900">{registrations.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">
                {registrations.filter(r => r.status === 'confirmed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Checked In</p>
              <p className="text-2xl font-bold text-blue-600">
                {registrations.filter(r => r.checkedIn).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {registrations.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid Events</p>
              <p className="text-2xl font-bold text-green-600">
                ${registrations.filter(r => r.paymentAmount > 0).reduce((sum, r) => sum + (r.paymentAmount || 0), 0).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {registrations.filter(r => r.paymentAmount > 0).length} paid • {registrations.filter(r => !r.paymentAmount || r.paymentAmount === 0).length} free
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, ticket number, or event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event</label>
            <select
              value={filter.event}
              onChange={(e) => setFilter({...filter, event: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-[200px]"
            >
              <option value="all">All Events</option>
              {events.map(event => (
                <option key={event._id || event.id} value={event.title}>{event.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({...filter, status: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment</label>
            <select
              value={filter.payment || 'all'}
              onChange={(e) => setFilter({...filter, payment: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid Events</option>
              <option value="free">Free Events</option>
            </select>
          </div>

          <div>
            <button
              onClick={() => {
                setFilter({ event: 'all', status: 'all', date: 'all', payment: 'all' });
                setSearchTerm('');
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Registrations ({filteredRegistrations.length} of {registrations.length})
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {filteredRegistrations.filter(r => r.paymentAmount > 0).length} paid events • 
                {filteredRegistrations.filter(r => !r.paymentAmount || r.paymentAmount === 0).length} free events • 
                Total Revenue: ${filteredRegistrations.filter(r => r.paymentAmount > 0).reduce((sum, r) => sum + (r.paymentAmount || 0), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Receipt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations.map((registration) => (
                <tr 
                  key={`${registration.eventId}-${registration.userId}`} 
                  className={`hover:bg-gray-50 ${
                    selectedRegistrations.has(`${registration.eventId}-${registration.userId}`) 
                      ? 'bg-blue-50 border-l-4 border-blue-500' 
                      : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRegistrations.has(`${registration.eventId}-${registration.userId}`)}
                      onChange={() => handleSelectRegistration(registration)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{registration.ticketNumber}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(registration.registrationDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{registration.eventTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{registration.userName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{registration.userEmail}</div>
                    <div className="text-sm text-gray-500">{registration.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(registration.status)}`}>
                      {registration.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {registration.paymentAmount > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">${registration.paymentAmount}</span>
                          <button
                            onClick={() => downloadPaymentReceipt(registration)}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 hover:text-blue-800 transition-colors duration-200"
                            title="Download Payment Receipt"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Receipt
                          </button>
                        </div>
                        {registration.paymentStatus === 'completed' && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            ✓ Paid
                          </span>
                        )}
                        {registration.paymentStatus === 'pending' && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            ⏳ Pending
                          </span>
                        )}
                        {registration.paymentIntentId && (
                          <div className="text-xs text-gray-500">
                            Receipt ID: {registration.paymentIntentId.slice(-8)}
                          </div>
                        )}
                        {registration.paymentDate && (
                          <div className="text-xs text-gray-500">
                            Paid: {new Date(registration.paymentDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Free Event
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {registration.checkedIn ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Checked In
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Not Checked In
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRegistration(registration);
                          setShowDetailsModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {!registration.checkedIn && (
                        <button
                          onClick={() => {
                            setSelectedRegistration(registration);
                            setShowCheckInModal(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                          title="Check In"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteRegistration(registration)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Registration"
                      >
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

      {/* Registration Details Modal */}
      <SimpleModal open={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
        {selectedRegistration && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Registration Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ticket Number</label>
                <p className="text-sm text-gray-900">{selectedRegistration.ticketNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Event</label>
                <p className="text-sm text-gray-900">{selectedRegistration.eventTitle}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Attendee</label>
                <p className="text-sm text-gray-900">{selectedRegistration.userName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{selectedRegistration.userEmail}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="text-sm text-gray-900">{selectedRegistration.phone}</p>
              </div>
              {selectedRegistration.dietaryRestrictions && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dietary Restrictions</label>
                  <p className="text-sm text-gray-900">{selectedRegistration.dietaryRestrictions}</p>
                </div>
              )}
              {selectedRegistration.specialRequests && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Special Requests</label>
                  <p className="text-sm text-gray-900">{selectedRegistration.specialRequests}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={selectedRegistration.status}
                  onChange={(e) => handleStatusUpdate(selectedRegistration._id, e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  deleteRegistration(selectedRegistration);
                }}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                Delete Registration
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </SimpleModal>

      {/* Check-in Modal */}
      <SimpleModal open={showCheckInModal} onClose={() => setShowCheckInModal(false)}>
        {selectedRegistration && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Check-in Attendee</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ticket Number</label>
                <p className="text-sm text-gray-900">{selectedRegistration.ticketNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Attendee</label>
                <p className="text-sm text-gray-900">{selectedRegistration.userName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Event</label>
                <p className="text-sm text-gray-900">{selectedRegistration.eventTitle}</p>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => handleCheckIn(selectedRegistration)}
                  className="btn-primary"
                >
                  Confirm Check-in
                </button>
                <button
                  onClick={() => setShowCheckInModal(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </SimpleModal>
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
  const [activeSection, setActiveSection] = useState('dashboard');

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Hero', href: '/admin/hero', icon: Image },
    { name: 'Mission Media', href: '/admin/mission-media', icon: FileText },
    { name: 'Founder Media', href: '/admin/founder-media', icon: Star },
    { name: 'About Page', href: '/admin/about-page', icon: FileText },
    { name: 'Founder Content', href: '/admin/founder-content', icon: Users },
    { name: 'Leaders', href: '/admin/leaders', icon: Users },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Registrations', href: '/admin/registrations', icon: ClipboardList },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Volunteers', href: '/admin/volunteers', icon: Users },
    { name: 'Volunteer Opportunities', href: '/admin/volunteer-opportunities', icon: Users },
    { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
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
      case 'hero':
        return <HeroManagement />;
      case 'mission media':
        return <MissionMediaManagement />;
      case 'founder media':
        return <FounderMediaManagement />;
      case 'about page':
        return <AboutPageManagement />;
      case 'founder content':
        return <FounderContentManagement />;
      case 'leaders':
        return <LeaderManagement />;
      case 'users':
        return <UserManagement />;
      case 'volunteers':
        return <VolunteerManagement />;
      case 'volunteer opportunities':
        return <VolunteerOpportunityManager />;
      case 'newsletter':
        return <NewsletterManagement />;
      case 'events':
        return <EventManagement />;
      case 'registrations':
        return <RegistrationManagement />;
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

      <div className="flex min-h-screen bg-gradient-to-br from-primary-50 via-orange-50 to-secondary-100">
        {/* Enhanced Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-primary-100 via-white to-secondary-50 shadow-lg flex flex-col rounded-r-3xl">
          <div className="h-20 flex items-center justify-center border-b">
            <span className="text-2xl font-bold text-primary-700">Admin Portal</span>
          </div>
          <nav className="flex-1 py-6">
            <ul className="space-y-2">
              {navigation.map((section) => (
                <li key={section.name}>
                  <button
                    className={`w-full flex items-center px-6 py-4 text-left rounded-xl transition-all duration-200 font-medium text-gray-700 focus:outline-none group
                      ${activeSection === section.name.toLowerCase() 
                        ? 'bg-gradient-to-r from-primary-600 to-orange-500 text-white shadow-lg transform scale-105' 
                        : 'hover:bg-gradient-to-r hover:from-primary-50 hover:to-orange-50 hover:text-primary-700 hover:shadow-md'
                      }`}
                    onClick={() => setActiveSection(section.name.toLowerCase())}
                  >
                    <section.icon className={`w-5 h-5 mr-3 ${activeSection === section.name.toLowerCase() ? 'text-white' : 'text-gray-500 group-hover:text-primary-600'}`} />
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
        {/* Enhanced Main Content */}
        <main className="flex-1 p-8">
          <div className="bg-white/80 rounded-3xl shadow-2xl p-8 min-h-[60vh] animate-fade-in">
            {renderSection()}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminPanel; 