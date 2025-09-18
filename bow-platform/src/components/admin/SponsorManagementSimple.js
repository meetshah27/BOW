import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  X, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Save,
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../config/api';

const SponsorManagementSimple = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    website: '',
    description: '',
    isActive: 'true'
  });

  // Fetch sponsors
  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/sponsors/admin');
      if (response.ok) {
        const data = await response.json();
        setSponsors(data);
      } else {
        throw new Error('Failed to fetch sponsors');
      }
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      toast.error('Failed to fetch sponsors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create sponsor
  const handleCreate = async (e) => {
    e.preventDefault();
    console.log('🔍 Creating sponsor with data:', formData);
    
    if (!formData.name || !formData.logoUrl) {
      toast.error('Name and logo URL are required');
      return;
    }

    setSaving(true);
    try {
      const response = await api.post('/sponsors', formData);
      if (response.ok) {
        const newSponsor = await response.json();
        setSponsors(prev => [newSponsor, ...prev]);
        setShowCreateModal(false);
        resetForm();
        toast.success('Sponsor created successfully!');
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to create sponsor: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('Error creating sponsor:', error);
      toast.error(`Failed to create sponsor: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Update sponsor
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.logoUrl) {
      toast.error('Name and logo URL are required');
      return;
    }

    setSaving(true);
    try {
      const response = await api.put(`/sponsors/${selectedSponsor.id}`, formData);
      if (response.ok) {
        const updatedSponsor = await response.json();
        setSponsors(prev => prev.map(sponsor => 
          sponsor.id === selectedSponsor.id ? updatedSponsor : sponsor
        ));
        setShowEditModal(false);
        setSelectedSponsor(null);
        resetForm();
        toast.success('Sponsor updated successfully!');
      } else {
        throw new Error('Failed to update sponsor');
      }
    } catch (error) {
      console.error('Error updating sponsor:', error);
      toast.error('Failed to update sponsor');
    } finally {
      setSaving(false);
    }
  };

  // Delete sponsor
  const handleDelete = async () => {
    setSaving(true);
    try {
      const response = await api.delete(`/sponsors/${selectedSponsor.id}`);
      if (response.ok) {
        setSponsors(prev => prev.filter(sponsor => sponsor.id !== selectedSponsor.id));
        setShowDeleteModal(false);
        setSelectedSponsor(null);
        toast.success('Sponsor deleted successfully!');
      } else {
        throw new Error('Failed to delete sponsor');
      }
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      toast.error('Failed to delete sponsor');
    } finally {
      setSaving(false);
    }
  };

  // Toggle sponsor status
  const handleToggleStatus = async (sponsor) => {
    try {
      const newStatus = sponsor.isActive === 'true' ? 'false' : 'true';
      const response = await api.patch(`/sponsors/${sponsor.id}/toggle`, {
        isActive: newStatus
      });
      
      if (response.ok) {
        const updatedSponsor = await response.json();
        setSponsors(prev => prev.map(s => 
          s.id === sponsor.id ? updatedSponsor : s
        ));
        toast.success(`Sponsor ${newStatus === 'true' ? 'activated' : 'deactivated'} successfully!`);
      } else {
        throw new Error('Failed to toggle sponsor status');
      }
    } catch (error) {
      console.error('Error toggling sponsor status:', error);
      toast.error('Failed to toggle sponsor status');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      logoUrl: '',
      website: '',
      description: '',
      isActive: 'true'
    });
  };

  // Open edit modal
  const openEditModal = (sponsor) => {
    setSelectedSponsor(sponsor);
    setFormData({
      name: sponsor.name,
      logoUrl: sponsor.logoUrl,
      website: sponsor.website,
      description: sponsor.description || '',
      isActive: sponsor.isActive
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (sponsor) => {
    setSelectedSponsor(sponsor);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading sponsors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sponsor Management</h2>
          <p className="text-gray-600">Manage sponsors and their logos for the home page</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium px-4 py-2 rounded-lg shadow hover:from-primary-600 hover:to-primary-700 transition-all duration-200 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Sponsor
        </button>
      </div>

      {/* Sponsors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsors.map((sponsor) => (
          <div key={sponsor.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              {/* Logo Preview */}
              <div className="flex items-center justify-center h-24 mb-4 bg-gray-50 rounded-lg">
                {sponsor.logoUrl ? (
                  <img
                    src={sponsor.logoUrl}
                    alt={`${sponsor.name} logo`}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">No logo</div>
                )}
              </div>

              {/* Sponsor Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 truncate">{sponsor.name}</h3>
                {sponsor.website && sponsor.website !== '#' && (
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Visit Website
                  </a>
                )}
                {sponsor.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">{sponsor.description}</p>
                )}
              </div>

              {/* Status Badge */}
              <div className="mt-4 flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                  sponsor.isActive === 'true' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {sponsor.isActive === 'true' ? 'Active' : 'Inactive'}
                </span>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleStatus(sponsor)}
                    className={`p-2 rounded-lg transition-colors ${
                      sponsor.isActive === 'true'
                        ? 'text-orange-600 hover:bg-orange-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={sponsor.isActive === 'true' ? 'Deactivate' : 'Activate'}
                  >
                    {sponsor.isActive === 'true' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEditModal(sponsor)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(sponsor)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sponsors.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sponsors yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first sponsor</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add Sponsor
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Sponsor</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sponsor Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter sponsor name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL *
                  </label>
                  <input
                    type="url"
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://example.com/logo.png"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste the URL of your sponsor logo here
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Optional description"
                  />
                </div>

                {/* Debug info */}
                <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs">
                  <div><strong>Debug Info:</strong></div>
                  <div>Name: {formData.name || 'Empty'}</div>
                  <div>LogoUrl: {formData.logoUrl || 'Empty'}</div>
                  <div>Saving: {saving ? 'Yes' : 'No'}</div>
                  <div>Button Disabled: {saving || !formData.name || !formData.logoUrl ? 'Yes' : 'No'}</div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !formData.name || !formData.logoUrl}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {saving ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Sponsor
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedSponsor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Delete Sponsor</h3>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete <strong>{selectedSponsor.name}</strong>? 
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedSponsor(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {saving ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsorManagementSimple;
