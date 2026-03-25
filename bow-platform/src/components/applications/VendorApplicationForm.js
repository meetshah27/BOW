import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Loader, Mail, Phone, Store, User, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';

const VendorApplicationForm = ({ logoUrl, onClose }) => {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    applicantName: currentUser ? (currentUser.displayName || currentUser.email || '') : '',
    applicantEmail: currentUser ? currentUser.email || '' : '',
    applicantPhone: currentUser ? currentUser.phone || '' : '',
    businessName: '',
    businessType: '',
    website: '',
    socialLinks: '',
    productsDescription: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    setFormData((prev) => ({
      ...prev,
      applicantName: currentUser.displayName || currentUser.email || '',
      applicantEmail: currentUser.email || '',
      applicantPhone: currentUser.phone || '',
    }));
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.applicantName?.trim()) return 'Please enter your name';
    if (!formData.applicantEmail?.trim()) return 'Please enter your email';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.applicantEmail)) return 'Please enter a valid email address';
    if (!formData.businessName?.trim()) return 'Please enter your business name';
    if (!formData.productsDescription?.trim()) return 'Please describe what you sell';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/vendor-applications/applications', formData);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to submit vendor application');
      setSuccess(true);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit vendor application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 overflow-y-auto overscroll-y-contain"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full p-6 sm:p-8 text-center max-h-[min(100dvh,640px)] sm:max-h-none overflow-y-auto shadow-2xl sm:shadow-xl">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="BOW Logo" className="w-full h-full object-cover" />
            ) : (
              <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Thanks for applying as a vendor. Our team will review your application and reach out soon.
          </p>
          <button onClick={onClose} className="btn-primary w-full">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 overflow-y-auto overscroll-y-contain"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-2xl sm:mx-auto rounded-t-2xl sm:rounded-2xl shadow-2xl sm:shadow-xl flex flex-col max-h-[min(100dvh,920px)] sm:max-h-[90vh] min-h-0 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] sm:pb-0">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-start sm:items-center justify-between shrink-0 bg-white">
          <div className="flex items-center flex-1 min-w-0 pr-3">
            {logoUrl && (
              <img
                src={logoUrl}
                alt="BOW Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 object-cover flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Vendor Application</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2 sm:line-clamp-none">
                Apply to participate as a vendor at BOW events
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            aria-label="Close modal"
            type="button"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 overflow-y-auto min-h-0 overscroll-y-contain">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-start">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <h4 className="text-red-800 font-medium text-sm sm:text-base">Error</h4>
                <p className="text-red-700 text-xs sm:text-sm mt-1 break-words">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base text-gray-700">
                <User className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                Name *
              </label>
              <input
                type="text"
                name="applicantName"
                value={formData.applicantName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base text-gray-700">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                Email *
              </label>
              <input
                type="email"
                name="applicantEmail"
                value={formData.applicantEmail}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base text-gray-700">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                Phone
              </label>
              <input
                type="tel"
                name="applicantPhone"
                value={formData.applicantPhone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base text-gray-700">
                <Store className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base text-gray-700">Business Type</label>
              <input
                type="text"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                placeholder="Food / Craft / Services / etc."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base text-gray-700">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1 text-sm sm:text-base text-gray-700">Social Links</label>
            <input
              type="text"
              name="socialLinks"
              value={formData.socialLinks}
              onChange={handleChange}
              placeholder="Instagram / Facebook / YouTube links"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-sm sm:text-base text-gray-700">
              What will you sell? *
            </label>
            <textarea
              name="productsDescription"
              value={formData.productsDescription}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-sm sm:text-base text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full justify-center py-3 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                Submitting...
              </span>
            ) : (
              'Submit Vendor Application'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorApplicationForm;

