import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Edit3, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Star,
  Users,
  Heart,
  CheckCircle,
  User
} from 'lucide-react';
import api from '../../config/api';

const FounderContentManagement = () => {
  const [founderContent, setFounderContent] = useState({
    sectionTitle: 'Our Founders',
    sectionSubtitle: 'Meet the visionary leaders who founded Beats of Washington and continue to guide our mission of empowering communities through music.',
    aandSane: {
      name: 'Aand Sane',
      role: 'Board Chair & Co-Founder',
      partnership: 'Partnering with Deepali Sane',
      description: 'Aand Sane & Deepali Sane are the visionary co-founders of Beats of Washington, whose shared passion for community building through music has inspired thousands across Washington State. As Board Chair, Aand continues to lead our organization with dedication and innovative thinking, working closely with Deepali to guide our mission together.',
      traits: ['Visionary Leader', 'Community Builder'],
      avatar: 'A',
      isActive: true
    },
    deepaliSane: {
      name: 'Deepali Sane',
      role: 'Co-Founder & Strategic Director',
      description: 'Deepali Sane brings her strategic vision and cultural expertise to BOW, working alongside Aand to create meaningful community connections through music and cultural exchange.',
      traits: ['Strategic Vision', 'Cultural Expert'],
      isActive: true
    },
    isActive: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchFounderContent();
  }, []);

  const fetchFounderContent = async () => {
    try {
      setLoading(true);
      const response = await api.get('/founder-content/admin');
      if (response.ok) {
        const data = await response.json();
        setFounderContent(data);
      }
    } catch (error) {
      console.error('Error fetching founder content:', error);
      setMessage('Failed to load founder content');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');

      const response = await api.post('/founder-content', founderContent);
      if (response.ok) {
        setMessage('Founder content saved successfully!');
        setMessageType('success');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to save content');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error saving founder content:', error);
      setMessage('Failed to save content');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleFounderChange = (founderType, field, value) => {
    setFounderContent({
      ...founderContent,
      [founderType]: {
        ...founderContent[founderType],
        [field]: value
      }
    });
  };

  const handleTraitChange = (founderType, index, value) => {
    const newTraits = [...founderContent[founderType].traits];
    newTraits[index] = value;
    handleFounderChange(founderType, 'traits', newTraits);
  };

  const addTrait = (founderType) => {
    const newTraits = [...founderContent[founderType].traits, 'New Trait'];
    handleFounderChange(founderType, 'traits', newTraits);
  };

  const removeTrait = (founderType, index) => {
    const newTraits = founderContent[founderType].traits.filter((_, i) => i !== index);
    handleFounderChange(founderType, 'traits', newTraits);
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Star className="w-8 h-8 mr-3 text-primary-600" />
                Founder Content Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage the content for the "Our Founders" section on the About page
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  previewMode 
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{previewMode ? 'Hide Preview' : 'Show Preview'}</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg ${
              messageType === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Edit Form */}
          <div className="space-y-6">
            {/* Section Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary-600" />
                Section Header
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={founderContent.sectionTitle}
                    onChange={(e) => setFounderContent({...founderContent, sectionTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Our Founders"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Subtitle
                  </label>
                  <textarea
                    value={founderContent.sectionSubtitle}
                    onChange={(e) => setFounderContent({...founderContent, sectionSubtitle: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Meet the visionary leaders who founded Beats of Washington..."
                  />
                </div>
              </div>
            </div>

            {/* Aand Sane Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-primary-600" />
                Aand Sane Details
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={founderContent.aandSane.name}
                      onChange={(e) => handleFounderChange('aandSane', 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Aand Sane"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={founderContent.aandSane.role}
                      onChange={(e) => handleFounderChange('aandSane', 'role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Board Chair & Co-Founder"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partnership Text
                  </label>
                  <input
                    type="text"
                    value={founderContent.aandSane.partnership}
                    onChange={(e) => handleFounderChange('aandSane', 'partnership', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Partnering with Deepali Sane"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={founderContent.aandSane.description}
                    onChange={(e) => handleFounderChange('aandSane', 'description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Aand Sane & Deepali Sane are the visionary co-founders..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar Letter
                  </label>
                  <input
                    type="text"
                    value={founderContent.aandSane.avatar}
                    onChange={(e) => handleFounderChange('aandSane', 'avatar', e.target.value)}
                    className="w-16 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-lg font-bold"
                    placeholder="A"
                    maxLength={1}
                  />
                </div>

                {/* Traits */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Key Traits
                    </label>
                    <button
                      onClick={() => addTrait('aandSane')}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {founderContent.aandSane.traits.map((trait, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={trait}
                          onChange={(e) => handleTraitChange('aandSane', index, e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                          placeholder="Trait description"
                        />
                        <button
                          onClick={() => removeTrait('aandSane', index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-gray-600">Active Status</span>
                  <button
                    onClick={() => handleFounderChange('aandSane', 'isActive', !founderContent.aandSane.isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      founderContent.aandSane.isActive ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        founderContent.aandSane.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Deepali Sane Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-secondary-600" />
                Deepali Sane Details
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={founderContent.deepaliSane.name}
                      onChange={(e) => handleFounderChange('deepaliSane', 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Deepali Sane"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={founderContent.deepaliSane.role}
                      onChange={(e) => handleFounderChange('deepaliSane', 'role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Co-Founder & Strategic Director"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={founderContent.deepaliSane.description}
                    onChange={(e) => handleFounderChange('deepaliSane', 'description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Deepali Sane brings her strategic vision..."
                  />
                </div>

                {/* Traits */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Key Traits
                    </label>
                    <button
                      onClick={() => addTrait('deepaliSane')}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {founderContent.deepaliSane.traits.map((trait, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={trait}
                          onChange={(e) => handleTraitChange('deepaliSane', index, e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                          placeholder="Trait description"
                        />
                        <button
                          onClick={() => removeTrait('deepaliSane', index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-gray-600">Active Status</span>
                  <button
                    onClick={() => handleFounderChange('deepaliSane', 'isActive', !founderContent.deepaliSane.isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      founderContent.deepaliSane.isActive ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        founderContent.deepaliSane.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Overall Status Toggle */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Section Status</h3>
                  <p className="text-sm text-gray-600">
                    {founderContent.isActive ? 'Active and visible on About page' : 'Hidden from About page'}
                  </p>
                </div>
                <button
                  onClick={() => setFounderContent({...founderContent, isActive: !founderContent.isActive})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    founderContent.isActive ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      founderContent.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          {previewMode && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Preview</h2>
                <div className="prose max-w-none">
                  {/* Section Header Preview */}
                  <div className="text-center mb-16">
                    <div className="inline-block mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Star className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h2 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">
                      {founderContent.sectionTitle}
                    </h2>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                      {founderContent.sectionSubtitle}
                    </p>
                  </div>

                  {/* Founders Preview */}
                  <div className="grid md:grid-cols-2 gap-16">
                    {/* Aand Sane Preview */}
                    {founderContent.aandSane.isActive && (
                      <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"></div>
                        <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-gray-100 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl">
                          <div className="text-center mb-8">
                            <div className="relative mb-6">
                              <div className="w-28 h-28 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto shadow-2xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <span className="text-white font-bold text-3xl">{founderContent.aandSane.avatar}</span>
                              </div>
                              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                                <Star className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                              {founderContent.aandSane.name}
                            </h3>
                            <p className="text-primary-600 font-semibold text-xl mb-6 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                              {founderContent.aandSane.role}
                            </p>
                            <p className="text-secondary-600 font-medium text-lg mb-4">
                              {founderContent.aandSane.partnership}
                            </p>
                          </div>
                          <p className="text-gray-700 leading-relaxed text-center text-lg group-hover:text-gray-800 transition-colors duration-300">
                            {founderContent.aandSane.description}
                          </p>
                          <div className="mt-8 flex justify-center space-x-4">
                            {founderContent.aandSane.traits.map((trait, index) => (
                              <div key={index} className="flex items-center space-x-2 text-primary-600">
                                <CheckCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">{trait}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Deepali Sane Preview */}
                    {founderContent.deepaliSane.isActive && (
                      <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary-400 to-primary-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"></div>
                        <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-gray-100 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl">
                          <div className="text-center mb-8">
                            <div className="relative mb-6">
                              <div className="w-28 h-28 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto shadow-2xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <span className="text-white font-bold text-3xl">D</span>
                              </div>
                              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                                <Star className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-secondary-600 transition-colors duration-300">
                              {founderContent.deepaliSane.name}
                            </h3>
                            <p className="text-secondary-600 font-semibold text-xl mb-6 bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent">
                              {founderContent.deepaliSane.role}
                            </p>
                          </div>
                          <p className="text-gray-700 leading-relaxed text-center text-lg group-hover:text-gray-800 transition-colors duration-300">
                            {founderContent.deepaliSane.description}
                          </p>
                          <div className="mt-8 flex justify-center space-x-4">
                            {founderContent.deepaliSane.traits.map((trait, index) => (
                              <div key={index} className="flex items-center space-x-2 text-secondary-600">
                                <CheckCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">{trait}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FounderContentManagement;
