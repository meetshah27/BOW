import React, { useState, useEffect } from 'react';
import { Settings, ToggleLeft, ToggleRight, Save, AlertCircle } from 'lucide-react';
import api from '../../config/api';
import toast from 'react-hot-toast';

const SettingsManagement = () => {
  const [settings, setSettings] = useState({
    membershipApplicationEnabled: true,
    vendorApplicationEnabled: true,
    performerApplicationEnabled: true,
    campaignProgressBarEnabled: true,
    campaignTitle: 'Help us raise $5,000 for new instruments!',
    campaignDescription: 'Every donation brings us closer to providing quality music education and new instruments to youth in our community.',
    campaignGoal: 5000,
    campaignRaised: 3250,
    lastUpdated: null,
    updatedBy: 'system'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      } else {
        console.error('Failed to fetch settings');
        toast.error('Failed to load settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateMembershipApplicationSetting = async (enabled) => {
    try {
      setSaving(true);
      const response = await api.put('/settings/membership-application', {
        enabled,
        updatedBy: 'admin'
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({
          ...prev,
          membershipApplicationEnabled: enabled,
          lastUpdated: data.settings.lastUpdated,
          updatedBy: data.settings.updatedBy
        }));
        toast.success(`Membership applications ${enabled ? 'enabled' : 'disabled'} successfully`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update setting');
      }
    } catch (error) {
      console.error('Error updating membership application setting:', error);
      toast.error('Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  const updateVendorApplicationSetting = async (enabled) => {
    try {
      setSaving(true);
      const response = await api.put('/settings/vendor-application', {
        enabled,
        updatedBy: 'admin'
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({
          ...prev,
          vendorApplicationEnabled: enabled,
          lastUpdated: data.settings.lastUpdated,
          updatedBy: data.settings.updatedBy
        }));
        toast.success(`Vendor applications ${enabled ? 'enabled' : 'disabled'} successfully`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update setting');
      }
    } catch (error) {
      console.error('Error updating vendor application setting:', error);
      toast.error('Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  const updatePerformerApplicationSetting = async (enabled) => {
    try {
      setSaving(true);
      const response = await api.put('/settings/performer-application', {
        enabled,
        updatedBy: 'admin'
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({
          ...prev,
          performerApplicationEnabled: enabled,
          lastUpdated: data.settings.lastUpdated,
          updatedBy: data.settings.updatedBy
        }));
        toast.success(`Performer applications ${enabled ? 'enabled' : 'disabled'} successfully`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update setting');
      }
    } catch (error) {
      console.error('Error updating performer application setting:', error);
      toast.error('Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  const updateCampaignProgressBarSetting = async (updates) => {
    try {
      setSaving(true);
      const payload = { ...updates, updatedBy: 'admin' };
      const response = await api.put('/settings/campaign-progress-bar', payload);

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({
          ...prev,
          ...updates,
          lastUpdated: data.settings.lastUpdated,
          updatedBy: data.settings.updatedBy
        }));
        toast.success(`Campaign Progress Bar settings updated successfully`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update setting');
      }
    } catch (error) {
      console.error('Error updating campaign progress bar setting:', error);
      toast.error('Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Application Settings
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage application settings and feature toggles
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Membership Application Toggle */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Membership Applications
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Control whether new membership applications are accepted. When disabled, 
                  the "Apply for Membership" button will be hidden and replaced with a 
                  message indicating applications are temporarily closed.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span>
                    Last updated: {settings.lastUpdated ? 
                      new Date(settings.lastUpdated).toLocaleString() : 
                      'Never'
                    } by {settings.updatedBy}
                  </span>
                </div>
              </div>
              <div className="ml-6">
                <button
                  onClick={() => updateMembershipApplicationSetting(!settings.membershipApplicationEnabled)}
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    settings.membershipApplicationEnabled
                      ? 'bg-primary-600'
                      : 'bg-gray-200'
                  } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.membershipApplicationEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-white rounded border">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  settings.membershipApplicationEnabled ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-900">
                  {settings.membershipApplicationEnabled ? 
                    'Membership applications are currently ENABLED' : 
                    'Membership applications are currently DISABLED'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Vendor Application Toggle */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Vendor Applications
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Control whether new vendor applications are accepted. When disabled,
                  the "Apply Now" button will be hidden and replaced with a message indicating applications are temporarily closed.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span>
                    Last updated: {settings.lastUpdated ?
                      new Date(settings.lastUpdated).toLocaleString() :
                      'Never'
                    } by {settings.updatedBy}
                  </span>
                </div>
              </div>
              <div className="ml-6">
                <button
                  onClick={() => updateVendorApplicationSetting(!settings.vendorApplicationEnabled)}
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    settings.vendorApplicationEnabled
                      ? 'bg-primary-600'
                      : 'bg-gray-200'
                  } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.vendorApplicationEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-white rounded border">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  settings.vendorApplicationEnabled ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-900">
                  {settings.vendorApplicationEnabled ?
                    'Vendor applications are currently ENABLED' :
                    'Vendor applications are currently DISABLED'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Performer Application Toggle */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Performer Applications
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Control whether new performer applications are accepted. When disabled,
                  the "Apply Now" button will be hidden and replaced with a message indicating applications are temporarily closed.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span>
                    Last updated: {settings.lastUpdated ?
                      new Date(settings.lastUpdated).toLocaleString() :
                      'Never'
                    } by {settings.updatedBy}
                  </span>
                </div>
              </div>
              <div className="ml-6">
                <button
                  onClick={() => updatePerformerApplicationSetting(!settings.performerApplicationEnabled)}
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    settings.performerApplicationEnabled
                      ? 'bg-primary-600'
                      : 'bg-gray-200'
                  } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.performerApplicationEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-white rounded border">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  settings.performerApplicationEnabled ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-900">
                  {settings.performerApplicationEnabled ?
                    'Performer applications are currently ENABLED' :
                    'Performer applications are currently DISABLED'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Campaign Progress Bar Toggle */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Campaign Progress Bar
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Control whether the Campaign Progress Bar is displayed on the homepage. When disabled, the thermometer goal tracker will be hidden.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span>
                    Last updated: {settings.lastUpdated ?
                      new Date(settings.lastUpdated).toLocaleString() :
                      'Never'
                    } by {settings.updatedBy}
                  </span>
                </div>
              </div>
              <div className="ml-6 flex items-center gap-4">
                <button
                  onClick={() => updateCampaignProgressBarSetting({ enabled: !settings.campaignProgressBarEnabled })}
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    settings.campaignProgressBarEnabled !== false // Default to true
                      ? 'bg-primary-600'
                      : 'bg-gray-200'
                  } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.campaignProgressBarEnabled !== false ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {settings.campaignProgressBarEnabled !== false && (
              <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
                  <input
                    type="text"
                    value={settings.campaignTitle || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, campaignTitle: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g. Help us raise $5,000 for new instruments!"
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Description</label>
                  <textarea
                    value={settings.campaignDescription || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, campaignDescription: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows="2"
                    placeholder="Brief description of the campaign goal..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Goal Amount ($)</label>
                  <input
                    type="number"
                    value={settings.campaignGoal || 0}
                    onChange={(e) => setSettings(prev => ({ ...prev, campaignGoal: Number(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Raised Amount ($)</label>
                  <input
                    type="number"
                    value={settings.campaignRaised || 0}
                    onChange={(e) => setSettings(prev => ({ ...prev, campaignRaised: Number(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 flex justify-end mt-2">
                  <button
                    onClick={() => updateCampaignProgressBarSetting({
                      title: settings.campaignTitle,
                      description: settings.campaignDescription,
                      goal: settings.campaignGoal,
                      raised: settings.campaignRaised
                    })}
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Content
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;
