import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Heart,
  CheckCircle,
  AlertCircle,
  Loader,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';

const MembershipApplicationForm = ({ logoUrl, onClose }) => {
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    applicantName: currentUser ? (currentUser.displayName || currentUser.email || '') : '',
    applicantEmail: currentUser ? (currentUser.email || '') : '',
    applicantPhone: currentUser ? (currentUser.phone || '') : '',
    applicantAge: '',
    applicantGender: '',
    experience: '',
    interest: '',
    socialMediaFollowed: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Update form data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        applicantName: currentUser.displayName || currentUser.email || '',
        applicantEmail: currentUser.email || '',
        applicantPhone: currentUser.phone || ''
      }));
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      'applicantName',
      'applicantEmail', 
      'applicantPhone',
      'applicantAge',
      'experience',
      'interest',
      'socialMediaFollowed'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        return `Please fill in the ${field.replace('applicant', '').toLowerCase()} field`;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.applicantEmail)) {
      return 'Please enter a valid email address';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Submitting membership application:', formData);
      
      const response = await api.post('/memberships/applications', formData);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Membership application submitted successfully:', data);
        setSuccess(true);
        
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit application');
      }
    } catch (err) {
      console.error('Error submitting membership application:', err);
      setError(err.message || 'Failed to submit membership application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="BOW Logo" 
                className="w-full h-full object-cover"
              />
            ) : (
              <CheckCircle className="w-8 h-8 text-white" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in joining BOW! Your membership application has been submitted successfully. 
            Our team will review your application within 2-3 business days.
          </p>
          <button
            onClick={onClose}
            className="btn-primary w-full"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            {logoUrl && (
              <img 
                src={logoUrl} 
                alt="BOW Logo" 
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
            )}
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Apply for Membership</h3>
              <p className="text-gray-600 mt-1">Join BOW and become part of our community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-red-800 font-medium">Error</h4>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                <User className="w-4 h-4 inline mr-1" />
                First Name *
              </label>
              <input 
                type="text" 
                name="applicantName"
                value={formData.applicantName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                required 
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                <Mail className="w-4 h-4 inline mr-1" />
                Email *
              </label>
              <input 
                type="email" 
                name="applicantEmail"
                value={formData.applicantEmail}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                required 
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone *
              </label>
              <input 
                type="tel" 
                name="applicantPhone"
                value={formData.applicantPhone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                required 
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-700">Age *</label>
              <select 
                name="applicantAge"
                value={formData.applicantAge}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                required
              >
                <option value="">Select age range</option>
                <option value="18-25">18-25</option>
                <option value="26-35">26-35</option>
                <option value="36-45">36-45</option>
                <option value="46-55">46-55</option>
                <option value="56+">56+</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Gender</label>
            <select 
              name="applicantGender"
              value={formData.applicantGender}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Experience *</label>
            <select 
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
              required
            >
              <option value="">Any Past experience with Dhol Tasha Pathak?</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Your Interest *</label>
            <select 
              name="interest"
              value={formData.interest}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
              required
            >
              <option value="">Select your interest</option>
              <option value="DHOL">DHOL</option>
              <option value="TASHA">TASHA</option>
              <option value="ZAANJ">ZAANJ</option>
              <option value="LAZIM">LAZIM</option>
              <option value="DHWAJ">DHWAJ</option>
              <option value="Shankhnaad (Bring your Own Shankha)">Shankhnaad (Bring your Own Shankha)</option>
              <option value="BOW BAND">BOW BAND</option>
              <option value="Dance/Flashmob/Garba/Dandiya/">Dance/Flashmob/Garba/Dandiya/</option>
              <option value="VOLUNTEER (Decoration, Event management, PR etc.)">VOLUNTEER (Decoration, Event management, PR etc.)</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Social Media Follow *</label>
            <p className="text-xs mb-2 text-gray-600">
              <strong>Note:</strong> Before you submit this form you must subscribe to our{' '}
              <a 
                href="https://www.youtube.com/@BeatsOfWashington?sub_confirmation=1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary-600 underline hover:text-primary-700"
              >
                YouTube Channel
              </a>{' '}
              and follow us on{' '}
              <a 
                href="https://www.instagram.com/beatsofwa/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary-600 underline hover:text-primary-700"
              >
                Instagram
              </a>{' '}
              and{' '}
              <a 
                href="https://www.facebook.com/BORDTP" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary-600 underline hover:text-primary-700"
              >
                Facebook
              </a>.
            </p>
            <select 
              name="socialMediaFollowed"
              value={formData.socialMediaFollowed}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
              required
            >
              <option value="">Have you followed us?</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary flex-1 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembershipApplicationForm;
