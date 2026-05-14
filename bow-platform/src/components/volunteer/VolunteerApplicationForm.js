import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Award,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';


const VolunteerApplicationForm = ({ opportunity, onClose, onSuccess, logoUrl }) => {
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    applicantName: currentUser ? (currentUser.displayName || currentUser.email || '') : '',
    applicantEmail: currentUser ? (currentUser.email || '') : '',
    applicantPhone: currentUser ? (currentUser.phone || '') : '', // Remove fallback, let user enter it
    applicantAge: '',
    applicantAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    availability: {
      weekdays: false,
      weekends: false,
      evenings: false,
      flexible: false
    },
    experience: '',
    skills: '',
    motivation: '',
    timeCommitment: '',
    references: [
      { name: '', relationship: '', phone: '', email: '' }
    ],
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    backgroundCheckConsent: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Update form data when currentUser changes
  useEffect(() => {
    console.log('useEffect triggered - currentUser:', currentUser);
    if (currentUser) {
      console.log('Setting form data for logged-in user:', {
        displayName: currentUser.displayName,
        email: currentUser.email,
        phone: currentUser.phone,
        phoneType: typeof currentUser.phone,
        phoneTruthy: !!currentUser.phone
      });
      setFormData(prev => {
        const newData = {
          ...prev,
          applicantName: currentUser.displayName || currentUser.email || '',
          applicantEmail: currentUser.email || '',
          applicantPhone: currentUser.phone || '' // Provide a fallback for phone
        };
        console.log('Updated form data:', newData);
        return newData;
      });
    }
  }, [currentUser]);

  // Initialize form data when component mounts
  useEffect(() => {
    console.log('Component mounted - currentUser:', currentUser);
    if (currentUser) {
      console.log('Current user details:', {
        displayName: currentUser.displayName,
        email: currentUser.email,
        phone: currentUser.phone,
        fullObject: currentUser
      });
      console.log('Initializing form data on mount');
      setFormData(prev => ({
        ...prev,
        applicantName: currentUser.displayName || currentUser.email || '',
        applicantEmail: currentUser.email || '',
        applicantPhone: currentUser.phone || '' // Provide a fallback for phone
      }));
    }
  }, []); // Empty dependency array - runs only on mount

  const timeCommitmentOptions = [
    '2-4 hours/week',
    '4-8 hours/week', 
    '8+ hours/week',
    'Flexible'
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAvailabilityChange = (type) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [type]: !prev.availability[type]
      }
    }));
  };

  const handleReferenceChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.map((ref, i) => 
        i === index ? { ...ref, [field]: value } : ref
      )
    }));
  };

  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      references: [...prev.references, { name: '', relationship: '', phone: '', email: '' }]
    }));
  };

  const removeReference = (index) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.applicantName && formData.applicantEmail && formData.applicantPhone && formData.applicantAge && formData.timeCommitment;
      case 2:
        return formData.backgroundCheckConsent;
      default:
        return true;
    }
  };

  const nextStep = () => {
    console.log('Validating step:', currentStep);
    console.log('Current form data:', formData);
    console.log('Current user:', currentUser);
    
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setError('');
    } else {
      console.log('Validation failed for step:', currentStep);
      console.log('Form data validation:', {
        applicantName: !!formData.applicantName,
        applicantEmail: !!formData.applicantEmail,
        applicantPhone: !!formData.applicantPhone,
        applicantAge: !!formData.applicantAge
      });
      setError('Please fill in all required fields before continuing.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      console.log('Submitting volunteer application for opportunity:', opportunity);
      console.log('Form data:', formData);
      
      const requestData = {
        opportunityId: opportunity.opportunityId || opportunity.id,
        opportunityTitle: opportunity.title,
        opportunityCategory: opportunity.category,
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      };
      
      console.log('Request data being sent:', requestData);
      
      const response = await api.post('/volunteers/apply', requestData);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setSuccess(true);
        if (onSuccess) {
          onSuccess(data);
        }
      } else {
        setError(data.error || `Failed to submit application. Status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error submitting volunteer application:', err);
      setError(`Network error: ${err.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="bg-white rounded-xl sm:rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md mx-auto">
                     <div className="text-center">
             {logoUrl ? (
               <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-600 rounded-full flex items-center justify-center overflow-hidden mx-auto mb-3 sm:mb-4">
                 <img 
                   src={logoUrl} 
                   alt="BOW Logo" 
                   className="w-full h-full object-cover"
                 />
               </div>
             ) : (
               <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-3 sm:mb-4" />
             )}
             <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
               Application Submitted!
             </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
              Thank you for your interest in volunteering with BOW.
            </p>
            <button
              onClick={onClose}
              className="btn-primary w-full text-sm sm:text-base py-2.5 sm:py-3"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] overflow-y-auto p-2 sm:p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
       <div className="bg-white rounded-xl sm:rounded-lg shadow-xl p-4 sm:p-5 md:p-6 w-full max-w-lg mx-auto my-4 sm:my-8 relative max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                 <div className="flex justify-between items-start mb-4 sm:mb-6 sticky top-0 bg-white pb-2 border-b border-gray-200 z-10">
           <div className="flex-1 min-w-0 pr-3">
           <h2 className="text-lg sm:text-xl font-bold text-gray-900">
             Volunteer Application
           </h2>
             <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
               Applying for: <span className="font-medium text-primary-600">{opportunity.title}</span>
             </p>
           </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-200 text-xl sm:text-2xl font-bold"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

                 {/* Progress Bar */}
         <div className="mb-4 sm:mb-6">
           <div className="flex justify-between mb-2 gap-1 sm:gap-2">
            {[1, 2].map(step => (
              <div
                key={step}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0 ${
                  step <= currentStep
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 gap-1">
            <span className="text-center flex-1 truncate">Personal Info</span>
            <span className="text-center flex-1 truncate">Consent</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start sm:items-center">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
            <span className="text-xs sm:text-sm text-red-700 break-words">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Information */}
                     {currentStep === 1 && (
             <div className="space-y-3 sm:space-y-4">
               <div>
                 <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                  Personal Information
                </h3>
                {currentUser && (
                  <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-green-800">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium break-words">Logged in as: {currentUser.displayName || currentUser.email}</span>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.applicantName}
                      onChange={(e) => handleInputChange('applicantName', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        currentUser ? 'border-gray-200 bg-gray-50 text-gray-600' : 'border-gray-300'
                      }`}
                      required
                      readOnly={!!currentUser}
                      disabled={!!currentUser}
                    />
                    {currentUser && (
                      <p className="text-xs text-gray-500 mt-1">Pre-filled from your account</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.applicantEmail}
                      onChange={(e) => handleInputChange('applicantEmail', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        currentUser ? 'border-gray-200 bg-gray-50 text-gray-600' : 'border-gray-300'
                      }`}
                      required
                      readOnly={!!currentUser}
                      disabled={!!currentUser}
                    />
                    {currentUser && (
                      <p className="text-xs text-gray-500 mt-1">Pre-filled from your account</p>
                    )}
                  </div>
                                     <div>
                     <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                       Phone *
                     </label>
                                           <input
                        type="tel"
                        value={formData.applicantPhone}
                        onChange={(e) => handleInputChange('applicantPhone', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                        placeholder="Phone number"
                      />
                     {currentUser && (
                       <p className="text-xs text-gray-500 mt-1">Please provide your phone number</p>
                     )}
                   </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Age *
                    </label>
                    <input
                      type="number"
                      min="16"
                      value={formData.applicantAge}
                      onChange={(e) => handleInputChange('applicantAge', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="mt-3 sm:mt-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Address
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={formData.applicantAddress.street}
                      onChange={(e) => handleInputChange('applicantAddress.street', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.applicantAddress.city}
                      onChange={(e) => handleInputChange('applicantAddress.city', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={formData.applicantAddress.state}
                      onChange={(e) => handleInputChange('applicantAddress.state', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={formData.applicantAddress.zipCode}
                      onChange={(e) => handleInputChange('applicantAddress.zipCode', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-3 sm:mt-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Time Commitment *
                  </label>
                  <select
                    value={formData.timeCommitment}
                    onChange={(e) => handleInputChange('timeCommitment', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select time commitment</option>
                    {timeCommitmentOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}





          {/* Step 2: Consent */}
           {currentStep === 2 && (
             <div className="space-y-3 sm:space-y-4">
               <div>
                 <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                   Consent & Agreement
                 </h3>
                 
                 <div className="space-y-3 sm:space-y-4">
                   <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                     <h4 className="font-medium text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">Volunteer Agreement</h4>
                     <ul className="text-xs sm:text-sm text-gray-600 space-y-1.5 sm:space-y-2">
                       <li>• I understand this is a volunteer position with no monetary compensation</li>
                       <li>• I agree to represent BOW professionally and follow all policies</li>
                       <li>• I will provide advance notice if I cannot fulfill my commitments</li>
                       <li>• I understand that BOW reserves the right to terminate my volunteer status</li>
                       <li>• I give permission for BOW to use photos/videos of me for promotional purposes</li>
                     </ul>
                   </div>

                   <div className="flex items-start">
                     <input
                       type="checkbox"
                       checked={formData.backgroundCheckConsent}
                       onChange={(e) => handleInputChange('backgroundCheckConsent', e.target.checked)}
                       className="mt-1 mr-2 sm:mr-3 w-4 h-4 flex-shrink-0"
                       required
                     />
                     <div className="min-w-0">
                       <label className="text-xs sm:text-sm font-medium text-gray-700 block">
                         Background Check Consent *
                       </label>
                       <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                         I consent to a background check as required for this volunteer position. 
                         This is for the safety and security of our community members.
                       </p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           )}

                     {/* Navigation Buttons */}
           <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 pt-4 border-t border-gray-200">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-outline flex-1 sm:flex-none"
                >
                  Previous
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="btn-outline flex-1 sm:flex-none text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
              >
                Cancel
              </button>
            </div>
            
            {currentStep < 2 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary w-full sm:w-auto sm:ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full sm:w-auto sm:ml-auto flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VolunteerApplicationForm; 