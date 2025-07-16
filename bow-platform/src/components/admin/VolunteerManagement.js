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
  Search
} from 'lucide-react';

const VolunteerManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/volunteers/applications');
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
      
      const response = await fetch(`/api/volunteers/applications/update-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          key,
          status, 
          reviewNotes: notes 
        }),
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
        <div className="text-sm text-gray-600">
          {applications.length} total applications
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
                <tr key={application._id} className="hover:bg-gray-50">
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
                    <button
                      onClick={() => {
                        setSelectedApplication(application);
                        setShowDetails(true);
                      }}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {application.status === 'pending' && (
                      <div className="inline-flex space-x-1">
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
                      </div>
                    )}
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