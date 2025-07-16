import React, { useState } from 'react';
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


const VolunteerApplicationForm = ({ opportunity, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
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
        return formData.applicantName && formData.applicantEmail && formData.applicantPhone && formData.applicantAge;
      case 2:
        return formData.experience && formData.motivation && formData.timeCommitment;
      case 3:
        return formData.emergencyContact.name && formData.emergencyContact.phone;
      case 4:
        return formData.backgroundCheckConsent;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setError('');
    } else {
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
      const response = await fetch('http://localhost:3000/api/volunteers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId: opportunity.id.toString(),
          opportunityTitle: opportunity.title,
          opportunityCategory: opportunity.category,
          ...formData,
          skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        if (onSuccess) {
          onSuccess(data);
        }
      } else {
        setError(data.error || 'Failed to submit application');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-4">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Application Submitted!
            </h3>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in volunteering with BOW. We'll review your application 
              and get back to you within 5-7 business days.
            </p>
            <button
              onClick={onClose}
              className="btn-primary w-full"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl mx-4 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Volunteer Application
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map(step => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Personal Info</span>
            <span>Experience</span>
            <span>Emergency Contact</span>
            <span>Consent</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.applicantName}
                      onChange={(e) => handleInputChange('applicantName', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.applicantEmail}
                      onChange={(e) => handleInputChange('applicantEmail', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.applicantPhone}
                      onChange={(e) => handleInputChange('applicantPhone', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age *
                    </label>
                    <input
                      type="number"
                      min="16"
                      value={formData.applicantAge}
                      onChange={(e) => handleInputChange('applicantAge', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={formData.applicantAddress.street}
                      onChange={(e) => handleInputChange('applicantAddress.street', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.applicantAddress.city}
                      onChange={(e) => handleInputChange('applicantAddress.city', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={formData.applicantAddress.state}
                      onChange={(e) => handleInputChange('applicantAddress.state', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={formData.applicantAddress.zipCode}
                      onChange={(e) => handleInputChange('applicantAddress.zipCode', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Experience and Availability */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Experience & Availability
                </h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relevant Experience *
                  </label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="4"
                    placeholder="Describe your relevant experience, skills, and background..."
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., event planning, music, communication, social media"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Why do you want to volunteer with BOW? *
                  </label>
                  <textarea
                    value={formData.motivation}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="3"
                    placeholder="Tell us about your motivation and what you hope to contribute..."
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Commitment *
                  </label>
                  <select
                    value={formData.timeCommitment}
                    onChange={(e) => handleInputChange('timeCommitment', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select time commitment</option>
                    {timeCommitmentOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(formData.availability).map(([key, value]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handleAvailabilityChange(key)}
                          className="mr-2"
                        />
                        <span className="text-sm capitalize">{key}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Emergency Contact */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Emergency Contact
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact Name *
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact.name}
                      onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relationship *
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">References</h4>
                  {formData.references.map((reference, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-medium">Reference {index + 1}</h5>
                        {formData.references.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeReference(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Name"
                          value={reference.name}
                          onChange={(e) => handleReferenceChange(index, 'name', e.target.value)}
                          className="border border-gray-300 rounded px-3 py-2"
                        />
                        <input
                          type="text"
                          placeholder="Relationship"
                          value={reference.relationship}
                          onChange={(e) => handleReferenceChange(index, 'relationship', e.target.value)}
                          className="border border-gray-300 rounded px-3 py-2"
                        />
                        <input
                          type="tel"
                          placeholder="Phone"
                          value={reference.phone}
                          onChange={(e) => handleReferenceChange(index, 'phone', e.target.value)}
                          className="border border-gray-300 rounded px-3 py-2"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={reference.email}
                          onChange={(e) => handleReferenceChange(index, 'email', e.target.value)}
                          className="border border-gray-300 rounded px-3 py-2"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addReference}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    + Add Another Reference
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Consent */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Consent & Agreement
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={formData.backgroundCheckConsent}
                      onChange={(e) => handleInputChange('backgroundCheckConsent', e.target.checked)}
                      className="mt-1 mr-3"
                      required
                    />
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Background Check Consent *
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        I consent to a background check as required for this volunteer position. 
                        This is for the safety and security of our community members.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Volunteer Agreement</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• I understand this is a volunteer position with no monetary compensation</li>
                      <li>• I agree to represent BOW professionally and follow all policies</li>
                      <li>• I will provide advance notice if I cannot fulfill my commitments</li>
                      <li>• I understand that BOW reserves the right to terminate my volunteer status</li>
                      <li>• I give permission for BOW to use photos/videos of me for promotional purposes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="btn-outline"
              >
                Previous
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary ml-auto flex items-center"
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