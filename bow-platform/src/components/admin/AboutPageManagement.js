import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Edit3, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Calendar,
  Award,
  Users,
  Music,
  Image
} from 'lucide-react';
import api from '../../config/api';
import FileUpload from '../common/FileUpload';

const AboutPageManagement = () => {
  const [aboutPage, setAboutPage] = useState({
    storyTitle: 'Our Story',
    storySubtitle: 'From humble beginnings to a statewide movement, here\'s how BOW has grown and evolved over the years.',
    foundingYear: '2019',
    foundingTitle: 'Founded in 2019',
    foundingDescription: 'Beats of Washington was founded by Aand Sane and Deepali Sane, visionary community leaders who recognized the power of music to bring people together. What started as a small neighborhood drum circle has grown into one of Washington State\'s most impactful community organizations.',
    founderBelief: 'Our founders believed that music transcends barriers of language, culture, and background, creating opportunities for genuine connection and understanding between diverse communities.',
    todayVision: 'Today, we continue to honor that vision while adapting to meet the evolving needs of our communities through innovative programming and partnerships.',
    achievements: [
      {
        year: '2019',
        title: 'Foundation Established',
        description: 'BOW was founded with a vision of community building through music.'
      },
      {
        year: '2020',
        title: 'First Community Event',
        description: 'Successfully organized our first major community music festival.'
      },
      {
        year: '2021',
        title: 'Statewide Expansion',
        description: 'Extended programs to multiple cities across Washington State.'
      },
      {
        year: '2022',
        title: 'Cultural Partnerships',
        description: 'Formed partnerships with diverse cultural organizations.'
      },
      {
        year: '2023',
        title: 'Digital Innovation',
        description: 'Launched online programs and virtual community events.'
      },
      {
        year: '2024',
        title: 'Community Impact',
        description: 'Reached over 50,000 community members across the state.'
      }
    ],
    isActive: true,
    logo: '' // Added logo field
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchAboutPageContent();
  }, []);

  // Removed the problematic useEffect that was re-fetching and overwriting the logo

  const fetchAboutPageContent = async () => {
    try {
      setLoading(true);
      const response = await api.get('/about-page/admin');
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 Fetched about page data:', data);
        console.log('🔍 Logo field in fetched data:', data.logo);
        
        // Ensure logo field is preserved
        setAboutPage(prev => ({
          ...prev,
          ...data,
          logo: data.logo || prev.logo || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching about page content:', error);
      setMessage('Failed to load about page content');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');
      
      console.log('💾 Saving about page content:', aboutPage);
      console.log('🔍 Logo field being sent:', aboutPage.logo);
      
      // Ensure logo field is included in the save data
      const saveData = {
        ...aboutPage,
        logo: aboutPage.logo || ''
      };
      
      console.log('💾 Final save data:', saveData);

      const response = await api.post('/about-page', saveData);
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Save response:', result);
        
        // Update the local state with the saved data to preserve the logo
        if (result.aboutPage) {
          setAboutPage(prev => ({
            ...prev,
            ...result.aboutPage,
            logo: result.aboutPage.logo || prev.logo || ''
          }));
        }
        
        setMessage('About page content saved successfully!');
        setMessageType('success');
      } else {
        const errorData = await response.json();
        console.error('❌ Save error:', errorData);
        setMessage(errorData.error || 'Failed to save content');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error saving about page content:', error);
      setMessage('Failed to save content');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleAchievementChange = (index, field, value) => {
    const newAchievements = [...aboutPage.achievements];
    newAchievements[index] = { ...newAchievements[index], [field]: value };
    setAboutPage({ ...aboutPage, achievements: newAchievements });
  };

  const addAchievement = () => {
    const newAchievement = {
      year: new Date().getFullYear().toString(),
      title: 'New Achievement',
      description: 'Description of the achievement'
    };
    setAboutPage({
      ...aboutPage,
      achievements: [...aboutPage.achievements, newAchievement]
    });
  };

  const removeAchievement = (index) => {
    const newAchievements = aboutPage.achievements.filter((_, i) => i !== index);
    setAboutPage({ ...aboutPage, achievements: newAchievements });
  };

  const handleLogoUpload = (fileData) => {
    console.log('🖼️ Logo upload successful:', fileData);
    console.log('🔍 Logo URL:', fileData.fileUrl);
    
    setAboutPage(prev => ({
      ...prev,
      logo: fileData.fileUrl
    }));
    
    // Show success message
    setMessage('Logo uploaded successfully!');
    setMessageType('success');
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  const removeLogo = () => {
    setAboutPage(prev => ({
      ...prev,
      logo: ''
    }));
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
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
                <Users className="w-8 h-8 mr-3 text-primary-600" />
                About Page Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage the content for the "Our Story" section on the About page
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
            {/* Logo Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Image className="w-5 h-5 mr-2 text-primary-600" />
                About Page Logo
              </h2>
              
              <div className="space-y-4">
                {aboutPage.logo ? (
                  <div className="text-center">
                    <div className="relative inline-block">
                      <img 
                        src={aboutPage.logo} 
                        alt="About page logo" 
                        className="w-32 h-32 object-cover rounded-full border-4 border-primary-200 shadow-lg"
                      />
                      <button
                        onClick={removeLogo}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        title="Remove logo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Current logo</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto mb-4">
                      <Image className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">No logo uploaded</p>
                  </div>
                )}
                
                <FileUpload
                  onUpload={handleLogoUpload}
                  folder="about"
                  accept="image/*"
                  multiple={false}
                  className="w-full"
                  isLogo={true}
                />
                <p className="text-xs text-gray-500 text-center">
                  Upload a circular logo image. Recommended size: 256x256px or larger.
                </p>
              </div>
            </div>

            {/* Story Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Music className="w-5 h-5 mr-2 text-primary-600" />
                Our Story Section
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Story Title
                  </label>
                  <input
                    type="text"
                    value={aboutPage.storyTitle}
                    onChange={(e) => setAboutPage({...aboutPage, storyTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Our Story"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Story Subtitle
                  </label>
                  <textarea
                    value={aboutPage.storySubtitle}
                    onChange={(e) => setAboutPage({...aboutPage, storySubtitle: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="From humble beginnings to a statewide movement..."
                  />
                </div>
              </div>
            </div>

            {/* Founding Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                Founding History
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Founding Year
                    </label>
                    <input
                      type="text"
                      value={aboutPage.foundingYear}
                      onChange={(e) => setAboutPage({...aboutPage, foundingYear: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="2019"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Founding Title
                    </label>
                    <input
                      type="text"
                      value={aboutPage.foundingTitle}
                      onChange={(e) => setAboutPage({...aboutPage, foundingTitle: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Founded in 2019"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Founding Description
                  </label>
                  <textarea
                    value={aboutPage.foundingDescription}
                    onChange={(e) => setAboutPage({...aboutPage, foundingDescription: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Beats of Washington was founded by..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Founder Belief
                  </label>
                  <textarea
                    value={aboutPage.founderBelief}
                    onChange={(e) => setAboutPage({...aboutPage, founderBelief: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Our founders believed that..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Today's Vision
                  </label>
                  <textarea
                    value={aboutPage.todayVision}
                    onChange={(e) => setAboutPage({...aboutPage, todayVision: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Today, we continue to honor that vision..."
                  />
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-primary-600" />
                  Achievements Timeline
                </h2>
                <button
                  onClick={addAchievement}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {aboutPage.achievements.map((achievement, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Achievement {index + 1}</h4>
                      <button
                        onClick={() => removeAchievement(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
                        <input
                          type="text"
                          value={achievement.year}
                          onChange={(e) => handleAchievementChange(index, 'year', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                          placeholder="2024"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                        <input
                          type="text"
                          value={achievement.title}
                          onChange={(e) => handleAchievementChange(index, 'title', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                          placeholder="Achievement Title"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                      <textarea
                        value={achievement.description}
                        onChange={(e) => handleAchievementChange(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                        placeholder="Description of the achievement..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Toggle */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Page Status</h3>
                  <p className="text-sm text-gray-600">
                    {aboutPage.isActive ? 'Active and visible on About page' : 'Hidden from About page'}
                  </p>
                </div>
                <button
                  onClick={() => setAboutPage({...aboutPage, isActive: !aboutPage.isActive})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    aboutPage.isActive ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      aboutPage.isActive ? 'translate-x-6' : 'translate-x-1'
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
                    {/* Logo Preview */}
                    {aboutPage.logo && (
                      <div className="text-center mb-8">
                        <div className="inline-block">
                          <img 
                            src={aboutPage.logo} 
                            alt="BOW Logo Preview" 
                            className="w-24 h-24 object-cover rounded-full border-4 border-primary-200 shadow-lg mx-auto"
                          />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Logo will appear in the "Transparent" section</p>
                      </div>
                    )}

                    {/* Story Section Preview */}
                  <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                      {aboutPage.storyTitle}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      {aboutPage.storySubtitle}
                    </p>
                  </div>

                  {/* History Section Preview */}
                  <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 mb-8">
                    <div className="border-l-4 border-primary-400 pl-8 bg-white/80 rounded-2xl shadow p-6">
                      <h3 className="text-2xl font-bold text-primary-700 mb-6">
                        {aboutPage.foundingTitle}
                      </h3>
                      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                        {aboutPage.foundingDescription}
                      </p>
                      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                        {aboutPage.founderBelief}
                      </p>
                      <p className="text-lg text-gray-700 leading-relaxed">
                        {aboutPage.todayVision}
                      </p>
                    </div>
                  </div>

                  {/* Achievements Preview */}
                  <div className="space-y-4">
                    {aboutPage.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-4 bg-white rounded-xl shadow-lg p-5 border-l-4 border-primary-200">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-bold text-lg">{achievement.year}</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-primary-700 mb-2">
                            {achievement.title}
                          </h4>
                          <p className="text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
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

export default AboutPageManagement;
