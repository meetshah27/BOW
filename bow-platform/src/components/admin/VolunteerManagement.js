import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Mail,
  Phone,
  Calendar,
  MapPin,
  Star,
  Filter,
  Search,
  Download,
  Trash2
} from 'lucide-react';
import api from '../../config/api';

const VolunteerManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedApplications, setSelectedApplications] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/volunteers/applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (application, status, notes = '') => {
    try {
      // Use the composite key for DynamoDB
      const key = {
        opportunityId: application.opportunityId,
        applicantEmail: application.applicantEmail
      };
      
      const response = await api.put(`/volunteers/applications/update-status`, { 
        key,
        status, 
        reviewNotes: notes 
      });

      if (response.ok) {
        // Show success message
        const action = status === 'approved' ? 'approved' : 'rejected';
        setSuccessMessage(`Application ${action} successfully!`);
        setShowSuccessMessage(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
          setSuccessMessage('');
        }, 3000);
        
        // Update the application status immediately in the local state
        setApplications(prevApplications => 
          prevApplications.map(app => 
            app.opportunityId === application.opportunityId && 
            app.applicantEmail === application.applicantEmail
              ? { ...app, status: status }
              : app
          )
        );
        
        // Also refresh from server to get any additional updates
        fetchApplications();
      } else {
        console.error('Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const handleStatusUpdate = (application, status) => {
    // Directly update the status without confirmation modal
    updateApplicationStatus(application, status);
  };

  const deleteApplication = async (application) => {
    if (!window.confirm(`Are you sure you want to delete the application from ${application.applicantName}? This action cannot be undone.`)) {
      return;
    }

    try {
      // Use the composite key for DynamoDB
      const key = {
        opportunityId: application.opportunityId,
        applicantEmail: application.applicantEmail
      };
      
      const response = await api.delete(`/volunteers/applications/delete`, { 
        body: JSON.stringify({ key })
      });

      if (response.ok) {
        // Show success message
        setSuccessMessage('Application deleted successfully!');
        setShowSuccessMessage(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
          setSuccessMessage('');
        }, 3000);
        
        // Remove the application from local state
        setApplications(prevApplications => 
          prevApplications.filter(app => 
            !(app.opportunityId === application.opportunityId && 
              app.applicantEmail === application.applicantEmail)
          )
        );
      } else {
        console.error('Failed to delete application');
        alert('Failed to delete application. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Error deleting application. Please try again.');
    }
  };

  // Bulk delete functionality
  const handleSelectApplication = (application) => {
    const key = `${application.opportunityId}-${application.applicantEmail}`;
    setSelectedApplications(prev => {
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
      setSelectedApplications(new Set());
      setSelectAll(false);
    } else {
      const allKeys = filteredApplications.map(app => 
        `${app.opportunityId}-${app.applicantEmail}`
      );
      setSelectedApplications(new Set(allKeys));
      setSelectAll(true);
    }
  };

  const bulkDeleteApplications = async () => {
    if (selectedApplications.size === 0) {
      alert('Please select at least one application to delete.');
      return;
    }

    const selectedApps = filteredApplications.filter(app => 
      selectedApplications.has(`${app.opportunityId}-${app.applicantEmail}`)
    );

    const confirmMessage = selectedApps.length === 1 
      ? `Are you sure you want to delete the application from ${selectedApps[0].applicantName}?`
      : `Are you sure you want to delete ${selectedApps.length} applications? This action cannot be undone.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      // Delete applications one by one
      const deletePromises = selectedApps.map(async (app) => {
        const key = {
          opportunityId: app.opportunityId,
          applicantEmail: app.applicantEmail
        };
        
        const response = await api.delete(`/volunteers/applications/delete`, { 
          body: JSON.stringify({ key })
        });
        
        return { app, success: response.ok };
      });

      const results = await Promise.all(deletePromises);
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      // Show success message
      if (successful.length > 0) {
        setSuccessMessage(`Successfully deleted ${successful.length} application(s)!`);
        setShowSuccessMessage(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
          setSuccessMessage('');
        }, 3000);
        
        // Remove successful deletions from local state
        setApplications(prevApplications => 
          prevApplications.filter(app => 
            !successful.some(result => 
              result.app.opportunityId === app.opportunityId && 
              result.app.applicantEmail === app.applicantEmail
            )
          )
        );
      }

      // Show error message for failed deletions
      if (failed.length > 0) {
        alert(`Failed to delete ${failed.length} application(s). Please try again.`);
      }

      // Clear selections
      setSelectedApplications(new Set());
      setSelectAll(false);
      
    } catch (error) {
      console.error('Error bulk deleting applications:', error);
      alert('Error deleting applications. Please try again.');
    }
  };

  const handleExportCSV = async () => {
    try {
      console.log('🔄 Starting CSV export...');
      const response = await api.get('/volunteers/export-csv');
      
      console.log(`📊 Response status: ${response.status}`);
      console.log(`📊 Response ok: ${response.ok}`);
      
      if (response.ok) {
        const blob = await response.blob();
        console.log(`📄 Blob size: ${blob.size} bytes`);
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `volunteer-applications-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Show success message
        setSuccessMessage('CSV file exported successfully!');
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          setSuccessMessage('');
        }, 3000);
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to export CSV:', response.status, errorText);
        setSuccessMessage(`Failed to export CSV: ${response.status} - ${errorText}`);
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          setSuccessMessage('');
        }, 5000);
      }
    } catch (error) {
      console.error('❌ Error exporting CSV:', error);
      setSuccessMessage(`Network error: ${error.message}`);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage('');
      }, 5000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.opportunityTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}
      
             <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-gray-900">Volunteer Applications</h2>
         <div className="flex items-center space-x-4">
           <div className="text-sm text-gray-600">
             {applications.length} total applications
           </div>
           {/* Bulk Delete Button */}
           {selectedApplications.size > 0 && (
             <button
               onClick={bulkDeleteApplications}
               className="bg-gradient-to-r from-red-500 to-red-600 text-white font-medium px-5 py-2 rounded-xl shadow hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center space-x-2"
             >
               <Trash2 className="w-4 h-4" />
               <span>Delete Selected ({selectedApplications.size})</span>
             </button>
           )}
           {/* CSV Export Button */}
           <button
             onClick={handleExportCSV}
             className="bg-gradient-to-r from-green-500 to-green-600 text-white font-medium px-5 py-2 rounded-xl shadow hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center space-x-2"
           >
             <Download className="w-4 h-4" />
             <span>Export CSV</span>
           </button>
         </div>
       </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, opportunity, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opportunity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr 
                  key={application._id} 
                  className={`hover:bg-gray-50 ${
                    selectedApplications.has(`${application.opportunityId}-${application.applicantEmail}`) 
                      ? 'bg-blue-50 border-l-4 border-blue-500' 
                      : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedApplications.has(`${application.opportunityId}-${application.applicantEmail}`)}
                      onChange={() => handleSelectApplication(application)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {application.applicantName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.applicantEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {application.opportunityTitle}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.opportunityCategory}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(application.applicationDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowDetails(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {application.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(application, 'approved')}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(application, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteApplication(application)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Application"
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

      {/* Application Details Modal */}
      {showDetails && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Application Details
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Applicant Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Applicant Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{selectedApplication.applicantName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{selectedApplication.applicantEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{selectedApplication.applicantPhone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Age</label>
                    <p className="text-gray-900">{selectedApplication.applicantAge}</p>
                  </div>
                  {selectedApplication.applicantAddress && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-gray-900">
                        {selectedApplication.applicantAddress.street}<br />
                        {selectedApplication.applicantAddress.city}, {selectedApplication.applicantAddress.state} {selectedApplication.applicantAddress.zipCode}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Opportunity Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Opportunity Details</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Position</label>
                    <p className="text-gray-900">{selectedApplication.opportunityTitle}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="text-gray-900">{selectedApplication.opportunityCategory}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Time Commitment</label>
                    <p className="text-gray-900">{selectedApplication.timeCommitment}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Application Date</label>
                    <p className="text-gray-900">{formatDate(selectedApplication.applicationDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedApplication.status)}`}>
                      {selectedApplication.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience and Motivation */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Experience & Motivation</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Experience</label>
                  <p className="text-gray-900 mt-1">{selectedApplication.experience}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Motivation</label>
                  <p className="text-gray-900 mt-1">{selectedApplication.motivation}</p>
                </div>
              </div>
            </div>

            {/* Skills and Availability */}
            {selectedApplication.skills && selectedApplication.skills.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.skills.map((skill, index) => (
                    <span key={index} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            {selectedApplication.emergencyContact && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900">
                    <strong>{selectedApplication.emergencyContact.name}</strong><br />
                    {selectedApplication.emergencyContact.relationship}<br />
                    {selectedApplication.emergencyContact.phone}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-3">
              {selectedApplication.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      updateApplicationStatus(selectedApplication, 'approved');
                    }}
                    className="btn-primary"
                  >
                    Approve Application
                  </button>
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      updateApplicationStatus(selectedApplication, 'rejected');
                    }}
                    className="btn-outline text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Reject Application
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setShowDetails(false);
                  deleteApplication(selectedApplication);
                }}
                className="btn-outline text-red-600 border-red-600 hover:bg-red-50"
              >
                Delete Application
              </button>
              <button
                onClick={() => setShowDetails(false)}
                className="btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default VolunteerManagement; 