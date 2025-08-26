import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Upload, 
  Save, 
  X,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  UserPlus,
  Image as ImageIcon
} from 'lucide-react';
import api from '../../config/api';
import toast from 'react-hot-toast';

const LeaderManagement = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    roles: '',
    bio: '',
            isActive: 'true',
    order: 0
  });

  // Available positions for dropdown
  const availablePositions = [
    'Board Chair',
    'Vice Chair',
    'Board Member',
    'Executive Director',
    'Program Director',
    'Volunteer Coordinator',
    'Event Coordinator',
    'Volunteer',
    'Member',
    'Founder',
    'Co-Founder'
  ];

  // Available roles for suggestions
  const availableRoles = [
    'Dhol-Tasha Performer',
    'Dance Performer',
    'Event Coordinator',
    'Music Instructor',
    'Community Outreach',
    'Fundraising',
    'Marketing',
    'Administration',
    'Technical Support',
    'Youth Programs',
    'Senior Programs',
    'Cultural Programs'
  ];

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      setLoading(true);
      const response = await api.get('leaders/admin');
      if (response.ok) {
        const data = await response.json();
        setLeaders(data);
      } else {
        throw new Error('Failed to fetch leaders');
      }
    } catch (error) {
      console.error('Error fetching leaders:', error);
      toast.error('Failed to fetch leaders');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLeader = async () => {
    try {
      const leaderData = {
        ...formData,
        roles: formData.roles.split(',').map(role => role.trim()).filter(role => role)
      };

      const response = await api.post('leaders', leaderData);
      if (response.ok) {
        const newLeader = await response.json();
        setLeaders([...leaders, newLeader]);
        setShowCreateModal(false);
        resetForm();
        toast.success('Leader created successfully');
      } else {
        throw new Error('Failed to create leader');
      }
    } catch (error) {
      console.error('Error creating leader:', error);
      toast.error('Failed to create leader');
    }
  };

  const handleUpdateLeader = async () => {
    try {
      const leaderData = {
        ...formData,
        roles: formData.roles.split(',').map(role => role.trim()).filter(role => role)
      };

      const response = await api.put(`leaders/${selectedLeader.id}`, leaderData);
      if (response.ok) {
        const updatedLeader = await response.json();
        setLeaders(leaders.map(leader => 
          leader.id === updatedLeader.id ? updatedLeader : leader
        ));
        setShowEditModal(false);
        setSelectedLeader(null);
        resetForm();
        toast.success('Leader updated successfully');
      } else {
        throw new Error('Failed to update leader');
      }
    } catch (error) {
      console.error('Error updating leader:', error);
      toast.error('Failed to update leader');
    }
  };

  const handleDeleteLeader = async () => {
    try {
      const response = await api.delete(`leaders/${selectedLeader.id}`);
      if (response.ok) {
        setLeaders(leaders.filter(leader => leader.id !== selectedLeader.id));
        setShowDeleteModal(false);
        setSelectedLeader(null);
        toast.success('Leader deleted successfully');
      } else {
        throw new Error('Failed to delete leader');
      }
    } catch (error) {
      console.error('Error deleting leader:', error);
      toast.error('Failed to delete leader');
    }
  };

  const handleImageUpload = async (leaderId, file) => {
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.upload(`leaders/${leaderId}/upload`, formData);
      if (response.ok) {
        const result = await response.json();
        setLeaders(leaders.map(leader => 
          leader.id === leaderId ? result.leader : leader
        ));
        toast.success('Image uploaded successfully');
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleToggleActive = async (leaderId) => {
    try {
      const response = await api.put(`leaders/${leaderId}/toggle-active`);
      if (response.ok) {
        const updatedLeader = await response.json();
        setLeaders(leaders.map(leader => 
          leader.id === updatedLeader.id ? updatedLeader : leader
        ));
        toast.success(`Leader ${updatedLeader.isActive === 'true' ? 'activated' : 'deactivated'}`);
      } else {
        throw new Error('Failed to toggle active status');
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
      toast.error('Failed to toggle active status');
    }
  };

  const handleUpdateOrder = async (leaderId, newOrder) => {
    try {
      const response = await api.put(`leaders/${leaderId}/order`, { order: newOrder });
      if (response.ok) {
        const updatedLeader = await response.json();
        setLeaders(leaders.map(leader => 
          leader.id === updatedLeader.id ? updatedLeader : leader
        ));
        toast.success('Order updated successfully');
      } else {
        throw new Error('Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
    resetForm();
  };

  const openEditModal = (leader) => {
    setSelectedLeader(leader);
    setFormData({
      name: leader.name,
      position: leader.position,
      roles: leader.roles.join(', '),
      bio: leader.bio,
      isActive: leader.isActive,
      order: leader.order
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (leader) => {
    setSelectedLeader(leader);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      roles: '',
      bio: '',
      isActive: 'true',
      order: 0
    });
  };

  const filteredLeaders = leaders.filter(leader => {
    const matchesSearch = leader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         leader.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = filterPosition === 'all' || leader.position === filterPosition;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && leader.isActive === 'true') ||
                         (filterStatus === 'inactive' && leader.isActive === 'false');
    
    return matchesSearch && matchesPosition && matchesStatus;
  });

  const sortedLeaders = [...filteredLeaders].sort((a, b) => a.order - b.order);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leader Management</h2>
          <p className="text-gray-600">Manage your leadership team members</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add Leader
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search leaders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Positions</option>
            {availablePositions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Leaders Grid */}
      <div className="grid gap-6">
        {sortedLeaders.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No leaders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || filterPosition !== 'all' || filterStatus !== 'all' 
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by creating your first leader.'}
            </p>
          </div>
        ) : (
          sortedLeaders.map((leader, index) => (
            <div key={leader.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Leader Image */}
                    <div className="relative">
                      {leader.imageUrl ? (
                        <img
                          src={leader.imageUrl}
                          alt={leader.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Image Upload Button */}
                      <label className="absolute -bottom-1 -right-1 bg-primary-600 text-white rounded-full p-1 cursor-pointer hover:bg-primary-700 transition-colors">
                        <Upload className="w-3 h-3" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              handleImageUpload(leader.id, e.target.files[0]);
                            }
                          }}
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>

                    {/* Leader Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{leader.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          leader.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {leader.isActive === 'true' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-primary-600 font-medium">{leader.position}</p>
                      {leader.roles && leader.roles.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {leader.roles.map((role, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {role}
                            </span>
                          ))}
                        </div>
                      )}
                      {leader.bio && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{leader.bio}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Order Controls */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleUpdateOrder(leader.id, leader.order - 1)}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpdateOrder(leader.id, leader.order + 1)}
                        disabled={index === sortedLeaders.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Status Toggle */}
                    <button
                      onClick={() => handleToggleActive(leader.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        leader.isActive 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                      title={leader.isActive === 'true' ? 'Deactivate' : 'Activate'}
                    >
                                              {leader.isActive === 'true' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(leader)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => openDeleteModal(leader)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Leader Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New Leader</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleCreateLeader(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                  <select
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Position</option>
                    {availablePositions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roles (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.roles}
                    onChange={(e) => setFormData({...formData, roles: e.target.value})}
                    placeholder="e.g., Dhol-Tasha Performer, Event Coordinator"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Available roles: {availableRoles.join(', ')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Brief description of the leader's role and contributions..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active (show on website)
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Create Leader
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Leader Modal */}
      {showEditModal && selectedLeader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Edit Leader</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleUpdateLeader(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                  <select
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Position</option>
                    {availablePositions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roles (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.roles}
                    onChange={(e) => setFormData({...formData, roles: e.target.value})}
                    placeholder="e.g., Dhol-Tasha Performer, Event Coordinator"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Available roles: {availableRoles.join(', ')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Brief description of the leader's role and contributions..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editIsActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="editIsActive" className="ml-2 block text-sm text-gray-900">
                    Active (show on website)
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Update Leader
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedLeader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Delete Leader</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{selectedLeader.name}</strong>? 
                This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteLeader}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderManagement;
