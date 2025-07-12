import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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
  Clock
} from 'lucide-react';
import VolunteerManagement from '../components/admin/VolunteerManagement';

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
      const response = await fetch('http://localhost:3000/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
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
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
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

      const response = await fetch('http://localhost:3000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(placeholderEvent)
      });
      
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
      const response = await fetch('http://localhost:3000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newEvent.title,
          description: newEvent.description,
          longDescription: newEvent.description, // Use description as longDescription for simplicity
          date: newEvent.date,
          time: newEvent.time,
          location: newEvent.location,
          address: newEvent.location, // Use location as address for simplicity
          category: newEvent.category,
          image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
        })
      });
      console.log(response);
      if (!response.ok) throw new Error('Failed to create event');
      const created = await response.json();
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
      const response = await fetch(`http://localhost:3000/api/events/${selectedEvent._id}`, {
        method: 'DELETE',
      });
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
      const response = await fetch(`http://localhost:3000/api/events/${updatedEvent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      });
      if (!response.ok) throw new Error('Failed to update event');
      await fetchEvents();
      setShowEditModal(false);
      setSelectedEvent(null);
      toast.success('Event updated successfully!');
    } catch (err) {
      alert('Error updating event: ' + err.message);
    }
  };

  const handleViewRegistrations = async (event) => {
    setSelectedEvent(event);
    setShowRegistrationsModal(true);
    setLoadingRegistrations(true);
    try {
      const response = await fetch(`http://localhost:3000/api/events/${event._id}/registrations`);
      if (!response.ok) throw new Error('Failed to fetch registrations');
      const data = await response.json();
      setRegistrations(data);
    } catch (err) {
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
        <div>
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </button>
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6">Create New Event</h3>
            
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
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input type="time" className="w-full border rounded px-3 py-2" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} />
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
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
                      <button className="text-primary-600 hover:text-primary-900" onClick={() => navigate(`/events/${event._id}`)}><Eye className="w-4 h-4" /></button>
                      <button className="text-blue-600 hover:text-blue-900" onClick={() => handleEdit(event)}><Edit className="w-4 h-4" /></button>
                      <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(event)}><Trash2 className="w-4 h-4" /></button>
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
            <div><b>Date:</b> {new Date(selectedEvent.date).toLocaleDateString()}</div>
            <div><b>Time:</b> {selectedEvent.time}</div>
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
          ) : registrations.length === 0 ? (
            <div>No registrations found for this event.</div>
          ) : (
            <div style={{ maxHeight: 350, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Name</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Email</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Ticket #</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Fee</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map(r => (
                    <tr key={r._id}>
                      <td style={{ padding: 8, border: '1px solid #eee' }}>{r.userName || r.name || '-'}</td>
                      <td style={{ padding: 8, border: '1px solid #eee' }}>{r.userEmail || '-'}</td>
                      <td style={{ padding: 8, border: '1px solid #eee' }}>{r.ticketNumber || '-'}</td>
                      <td style={{ padding: 8, border: '1px solid #eee' }}>{selectedEvent?.price ? `$${selectedEvent.price}` : 'Free'}</td>
                      <td style={{ padding: 8, border: '1px solid #eee' }}>{r.registrationDate ? new Date(r.registrationDate).toLocaleString() : '-'}</td>
                    </tr>
                  ))}
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
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };
  return (
    <form onSubmit={handleSubmit} style={{ maxHeight: 400, overflowY: 'auto', paddingBottom: 48, position: 'relative' }}>
      <h2 style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 12 }}>Edit Event</h2>
      <div style={{ marginBottom: 8 }}>
        <label>Title:<br /><input name="title" value={form.title} onChange={handleChange} style={{ width: '100%' }} /></label>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Date:<br /><input name="date" type="date" value={form.date ? form.date.slice(0,10) : ''} onChange={handleChange} style={{ width: '100%' }} /></label>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Time:<br /><input name="time" value={form.time} onChange={handleChange} style={{ width: '100%' }} /></label>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Location:<br /><input name="location" value={form.location} onChange={handleChange} style={{ width: '100%' }} /></label>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Description:<br /><textarea name="description" value={form.description} onChange={handleChange} style={{ width: '100%' }} /></label>
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
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, background: '#fff', padding: 16, display: 'flex', gap: 12, borderTop: '1px solid #eee', justifyContent: 'flex-end'
      }}>
        <button type="submit" disabled={saving} style={{ background: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: 4 }}>{saving ? 'Saving...' : 'Save'}</button>
        <button type="button" onClick={onCancel} style={{ background: '#e5e7eb', color: '#111', padding: '8px 16px', borderRadius: 4 }}>Cancel</button>
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
  const [albums] = useState([
    { id: 1, name: 'Diwali 2024', count: 45, date: '2024-11-15' },
    { id: 2, name: 'Youth Fest', count: 32, date: '2024-10-20' },
    { id: 3, name: 'Community Drum Circle', count: 28, date: '2024-09-15' }
  ]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('photo');
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    album: '',
    file: null
  });

  const handleFileUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('file', uploadData.file);
      formData.append('title', uploadData.title);
      formData.append('description', uploadData.description);
      formData.append('album', uploadData.album);
      formData.append('type', uploadType);

      const response = await fetch('http://localhost:3000/api/gallery/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      
      alert('Media uploaded successfully!');
      setShowUploadModal(false);
      setUploadData({ title: '', description: '', album: '', file: null });
    } catch (err) {
      alert('Error uploading media: ' + err.message);
    }
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-6">Upload Media</h3>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Media Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="uploadType"
                      value="photo"
                      checked={uploadType === 'photo'}
                      onChange={(e) => setUploadType(e.target.value)}
                      className="mr-2"
                    />
                    Photo
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="uploadType"
                      value="video"
                      checked={uploadType === 'video'}
                      onChange={(e) => setUploadType(e.target.value)}
                      className="mr-2"
                    />
                    Video
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full border rounded px-3 py-2" 
                  required 
                  value={uploadData.title} 
                  onChange={e => setUploadData({ ...uploadData, title: e.target.value })} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="w-full border rounded px-3 py-2" 
                  rows="3"
                  value={uploadData.description} 
                  onChange={e => setUploadData({ ...uploadData, description: e.target.value })} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Album</label>
                <input 
                  type="text" 
                  className="w-full border rounded px-3 py-2" 
                  value={uploadData.album} 
                  onChange={e => setUploadData({ ...uploadData, album: e.target.value })} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">File</label>
                <input 
                  type="file" 
                  className="w-full border rounded px-3 py-2" 
                  required
                  accept={uploadType === 'photo' ? 'image/*' : 'video/*'}
                  onChange={e => setUploadData({ ...uploadData, file: e.target.files[0] })} 
                />
                <p className="text-xs text-gray-500 mt-1">
                  {uploadType === 'photo' ? 'Supported: JPG, PNG, GIF (max 10MB)' : 'Supported: MP4, MOV, AVI (max 100MB)'}
                </p>
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button type="button" className="btn-outline flex-1" onClick={() => setShowUploadModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary flex-1">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}

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

const RegistrationManagement = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ event: 'all', status: 'all', date: 'all' });
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchRegistrations();
    fetchEvents();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/events/registrations');
      if (response.ok) {
        const data = await response.json();
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
      const response = await fetch('http://localhost:3000/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleCheckIn = async (registrationId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/events/registrations/${registrationId}/checkin`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkedIn: true, checkInTime: new Date() })
      });

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
      const response = await fetch(`http://localhost:3000/api/events/registrations/${registrationId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

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

  const filteredRegistrations = registrations.filter(reg => {
    if (filter.event !== 'all' && reg.eventTitle !== filter.event) return false;
    if (filter.status !== 'all' && reg.status !== filter.status) return false;
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
      ['Ticket Number', 'Event', 'Name', 'Email', 'Phone', 'Status', 'Registration Date', 'Check-in Status'],
      ...filteredRegistrations.map(reg => [
        reg.ticketNumber,
        reg.eventTitle || 'N/A',
        reg.userName,
        reg.userEmail,
        reg.phone,
        reg.status,
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Registration Management</h2>
        <div className="flex space-x-2">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event</label>
            <select
              value={filter.event}
              onChange={(e) => setFilter({...filter, event: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Events</option>
              {events.map(event => (
                <option key={event._id} value={event.title}>{event.title}</option>
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
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
                  Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations.map((registration) => (
                <tr key={registration._id} className="hover:bg-gray-50">
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
                        >
                          <UserCheck className="w-4 h-4" />
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
                  onClick={() => handleCheckIn(selectedRegistration._id)}
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
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Registrations', href: '/admin/registrations', icon: ClipboardList },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Volunteers', href: '/admin/volunteers', icon: Users },
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
      case 'volunteers':
        return <VolunteerManagement />;
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