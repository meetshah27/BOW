import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Users,
  Clock,
  MapPin,
  Tag,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../config/api';

const VolunteerOpportunityManager = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [togglingOpportunities, setTogglingOpportunities] = useState(new Set());
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    timeCommitment: '',
    description: '',
    requirements: [''],
    benefits: [''],
    maxVolunteers: ''
  });

  const categories = [
    'Events',
    'Education', 
    'Outreach',
    'Technical',
    'Music',
    'Administrative',
    'Logistics',
    'Marketing',
    'Fundraising',
    'Other'
  ];

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await api.get('/volunteer-opportunities/opportunities');
      if (response.ok) {
        const data = await response.json();
        setOpportunities(data.opportunities);
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast.error('Failed to load volunteer opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      location: '',
      timeCommitment: '',
      description: '',
      requirements: [''],
      benefits: [''],
      maxVolunteers: ''
    });
    setEditingOpportunity(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.category || !formData.location || !formData.timeCommitment || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Filter out empty requirements and benefits
    const cleanData = {
      ...formData,
      requirements: formData.requirements.filter(req => req.trim() !== ''),
      benefits: formData.benefits.filter(benefit => benefit.trim() !== ''),
      maxVolunteers: formData.maxVolunteers ? parseInt(formData.maxVolunteers) : null
    };

    try {
      let response;
      if (editingOpportunity) {
        response = await api.put(`/volunteer-opportunities/opportunities/${editingOpportunity.opportunityId}`, cleanData);
      } else {
        response = await api.post('/volunteer-opportunities/opportunities', cleanData);
      }

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message, {
          duration: 3000,
          icon: editingOpportunity ? '✏️' : '➕'
        });
        resetForm();
        fetchOpportunities();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save opportunity', {
          duration: 4000,
          icon: '❌'
        });
      }
    } catch (error) {
      console.error('Error saving opportunity:', error);
      toast.error('Failed to save opportunity');
    }
  };

  const handleEdit = (opportunity) => {
    setEditingOpportunity(opportunity);
    setFormData({
      title: opportunity.title,
      category: opportunity.category,
      location: opportunity.location,
      timeCommitment: opportunity.timeCommitment,
      description: opportunity.description,
      requirements: opportunity.requirements.length > 0 ? opportunity.requirements : [''],
      benefits: opportunity.benefits.length > 0 ? opportunity.benefits : [''],
      maxVolunteers: opportunity.maxVolunteers ? opportunity.maxVolunteers.toString() : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (opportunityId) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) {
      return;
    }

    try {
      const loadingToast = toast.loading('Deleting opportunity...');
      
      const response = await api.delete(`/volunteer-opportunities/opportunities/${opportunityId}`);

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success('Opportunity deleted successfully', {
          duration: 3000,
          icon: '🗑️'
        });
        fetchOpportunities();
      } else {
        const error = await response.json();
        toast.dismiss(loadingToast);
        toast.error(error.message || 'Failed to delete opportunity', {
          duration: 4000,
          icon: '❌'
        });
      }
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      toast.error('Network error. Please try again.', {
        duration: 4000,
        icon: '🌐'
      });
    }
  };

  const handleToggleActive = async (opportunityId) => {
    try {
      // Add to toggling set
      setTogglingOpportunities(prev => new Set(prev).add(opportunityId));
      
      // Show loading toast
      const loadingToast = toast.loading('Updating opportunity status...');
      
      const response = await api.put(`/volunteer-opportunities/opportunities/${opportunityId}/toggle`);

      if (response.ok) {
        const data = await response.json();
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success(data.message, {
          duration: 3000,
          icon: '✅'
        });
        fetchOpportunities();
      } else {
        const error = await response.json();
        // Dismiss loading toast and show error
        toast.dismiss(loadingToast);
        toast.error(error.message || 'Failed to toggle opportunity status', {
          duration: 4000,
          icon: '❌'
        });
      }
    } catch (error) {
      console.error('Error toggling opportunity status:', error);
      toast.error('Network error. Please try again.', {
        duration: 4000,
        icon: '🌐'
      });
    } finally {
      // Remove from toggling set
      setTogglingOpportunities(prev => {
        const newSet = new Set(prev);
        newSet.delete(opportunityId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Volunteer Opportunities</h2>
          <p className="text-gray-600">Manage volunteer opportunities that appear on the Get Involved page</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Opportunity</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {editingOpportunity ? 'Edit Opportunity' : 'Add New Opportunity'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., LED Light Setup Coordinator"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Seattle Area"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Commitment *
                </label>
                <input
                  type="text"
                  name="timeCommitment"
                  value={formData.timeCommitment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 2-4 hours per event"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Volunteers (Optional)
                </label>
                <input
                  type="number"
                  name="maxVolunteers"
                  value={formData.maxVolunteers}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Describe the volunteer opportunity..."
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Experience with LED systems"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('requirements', index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('requirements')}
                className="text-primary-600 hover:text-primary-800 text-sm"
              >
                + Add Requirement
              </button>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits
              </label>
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Learn technical skills"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('benefits', index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('benefits')}
                className="text-primary-600 hover:text-primary-800 text-sm"
              >
                + Add Benefit
              </button>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingOpportunity ? 'Update' : 'Create'} Opportunity</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Opportunities List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Current Opportunities ({opportunities.length})
          </h3>
        </div>
        
        {opportunities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No volunteer opportunities created yet.</p>
            <p className="text-sm">Click "Add Opportunity" to create your first one.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {opportunities.map((opportunity) => (
              <div key={opportunity.opportunityId} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {opportunity.title}
                      </h4>
                                             <span className={`px-2 py-1 text-xs rounded-full ${
                         opportunity.isActive === 'true'
                           ? 'bg-green-100 text-green-800' 
                           : 'bg-gray-100 text-gray-800'
                       }`}>
                         {opportunity.isActive === 'true' ? 'Active' : 'Inactive'}
                       </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Tag className="w-4 h-4" />
                        <span>{opportunity.category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{opportunity.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{opportunity.timeCommitment}</span>
                      </div>
                      {opportunity.maxVolunteers && (
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{opportunity.currentVolunteers || 0}/{opportunity.maxVolunteers}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-3">{opportunity.description}</p>
                    
                    <div className="text-xs text-gray-500">
                      Created: {new Date(opportunity.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                                         <button
                       onClick={() => handleToggleActive(opportunity.opportunityId)}
                       disabled={togglingOpportunities.has(opportunity.opportunityId)}
                       className={`p-2 transition-colors ${
                         togglingOpportunities.has(opportunity.opportunityId)
                           ? 'text-gray-400 cursor-not-allowed'
                           : 'text-gray-600 hover:text-gray-800'
                       }`}
                       title={opportunity.isActive === 'true' ? 'Deactivate' : 'Activate'}
                     >
                       {togglingOpportunities.has(opportunity.opportunityId) ? (
                         <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                       ) : (
                         opportunity.isActive === 'true' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />
                       )}
                     </button>
                    <button
                      onClick={() => handleEdit(opportunity)}
                      className="p-2 text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(opportunity.opportunityId)}
                      className="p-2 text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerOpportunityManager; 