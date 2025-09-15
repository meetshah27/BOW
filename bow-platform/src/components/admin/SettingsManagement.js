import React, { useState, useEffect } from 'react';
import { Settings, ToggleLeft, ToggleRight, Save, AlertCircle } from 'lucide-react';
import api from '../../config/api';
import toast from 'react-hot-toast';

const SettingsManagement = () => {
  const [settings, setSettings] = useState({
    membershipApplicationEnabled: true,
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

          {/* Additional Settings Placeholder */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Additional Settings
            </h3>
            <p className="text-sm text-gray-600">
              More application settings will be added here in future updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;
