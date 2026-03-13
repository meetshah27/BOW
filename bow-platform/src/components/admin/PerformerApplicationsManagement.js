import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle, Clock, Eye, Loader, Mic, Search, Trash2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../config/api';

const PerformerApplicationsManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/performer-applications/applications');
      if (!res.ok) throw new Error('Failed to fetch performer applications');
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Error fetching performer applications:', err);
      setError('Failed to load performer applications');
      toast.error('Failed to load performer applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (app.applicantName || '').toLowerCase().includes(q) ||
        (app.applicantEmail || '').toLowerCase().includes(q) ||
        (app.actName || '').toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [applications, statusFilter, searchTerm]);

  const getStatusBadge = (status) => {
    const map = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' },
    };
    const cfg = map[status] || map.pending;
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {cfg.label}
      </span>
    );
  };

  const updateStatus = async (application, status) => {
    try {
      setUpdatingStatus(true);
      const reviewNotes =
        status === 'rejected'
          ? window.prompt('Reason for rejection:') || ''
          : 'Application approved by admin';

      const res = await api.put(`/performer-applications/applications/${application.id}/status`, {
        applicantEmail: application.applicantEmail,
        status,
        reviewNotes,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      setApplications((prev) =>
        prev.map((a) =>
          a.id === application.id && a.applicantEmail === application.applicantEmail
            ? { ...a, status, reviewNotes, reviewDate: new Date().toISOString() }
            : a
        )
      );
      toast.success(`Application ${status}`);
      setShowDetailsModal(false);
      setSelectedApplication(null);
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const deleteApplication = async (application) => {
    if (!window.confirm('Delete this application? This cannot be undone.')) return;
    try {
      const res = await api.delete(
        `/performer-applications/applications/${application.id}?applicantEmail=${encodeURIComponent(application.applicantEmail)}`
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      setApplications((prev) =>
        prev.filter((a) => !(a.id === application.id && a.applicantEmail === application.applicantEmail))
      );
      toast.success('Application deleted');
    } catch (err) {
      console.error('Error deleting application:', err);
      toast.error('Failed to delete application');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Loading performer applications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performer Applications</h2>
          <p className="text-gray-600 mt-1">Review and approve/reject performer applications</p>
        </div>
        <button onClick={fetchApplications} className="btn-secondary mt-4 sm:mt-0" type="button">
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, email, act..."
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-80"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Act
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Mic className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No performer applications found</p>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={`${app.applicantEmail}:${app.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{app.applicantName}</div>
                      <div className="text-sm text-gray-500">{app.applicantEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{app.actName || '—'}</div>
                      <div className="text-sm text-gray-500">{app.performanceType || '—'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(app.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedApplication(app);
                            setShowDetailsModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteApplication(app)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Application Details</h3>
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Applicant</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>
                      <strong>Name:</strong> {selectedApplication.applicantName}
                    </div>
                    <div>
                      <strong>Email:</strong> {selectedApplication.applicantEmail}
                    </div>
                    <div>
                      <strong>Phone:</strong> {selectedApplication.applicantPhone || '—'}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Act</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>
                      <strong>Act:</strong> {selectedApplication.actName || '—'}
                    </div>
                    <div>
                      <strong>Type:</strong> {selectedApplication.performanceType || '—'}
                    </div>
                    <div>
                      <strong>Genre:</strong> {selectedApplication.genre || '—'}
                    </div>
                    <div>
                      <strong>Website:</strong> {selectedApplication.website || '—'}
                    </div>
                    <div>
                      <strong>Social:</strong> {selectedApplication.socialLinks || '—'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Details</h4>
                <div className="text-sm text-gray-700 space-y-2">
                  <div>
                    <strong>Experience:</strong>
                    <div className="mt-1 whitespace-pre-wrap">{selectedApplication.experience || '—'}</div>
                  </div>
                  <div>
                    <strong>Availability:</strong>
                    <div className="mt-1 whitespace-pre-wrap">{selectedApplication.availabilityNotes || '—'}</div>
                  </div>
                  <div>
                    <strong>Notes:</strong>
                    <div className="mt-1 whitespace-pre-wrap">{selectedApplication.notes || '—'}</div>
                  </div>
                  <div>
                    <strong>Status:</strong> {getStatusBadge(selectedApplication.status)}
                  </div>
                </div>
              </div>

              {selectedApplication.status === 'pending' && (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    className="btn-primary flex items-center justify-center"
                    disabled={updatingStatus}
                    onClick={() => updateStatus(selectedApplication, 'approved')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </button>
                  <button
                    type="button"
                    className="btn-outline flex items-center justify-center border-red-300 text-red-700 hover:bg-red-50"
                    disabled={updatingStatus}
                    onClick={() => updateStatus(selectedApplication, 'rejected')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformerApplicationsManagement;

