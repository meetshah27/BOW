import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { fetchAuthSession } from 'aws-amplify/auth';
import api from '../config/api';
import Avatar from '../components/common/Avatar';

const MemberProfile = () => {
  const { userData, loading } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userData) {
      setForm({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      let headers = { 'Content-Type': 'application/json' };
      const { tokens } = await fetchAuthSession();
      const idToken = tokens?.idToken?.toString();
      headers['Authorization'] = `Bearer ${idToken}`;
      const res = await api.user.put(`/users/${userData.uid}`, {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        ...(form.password ? { password: form.password } : {})
      }, { headers });
      if (res.ok) {
        toast.success('Profile updated!');
        setEditMode(false);
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !userData) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>My Profile - Beats of Washington</title>
      </Helmet>
      <div className="max-w-xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>
        
        {/* Profile Avatar */}
        <div className="text-center mb-8">
          <Avatar 
            user={userData} 
            size="2xl" 
            className="bg-primary-100 border-4 border-primary-200 text-primary-700"
            showBorder={false}
          />
          <p className="text-gray-600 mt-2 text-sm">
            {userData?.displayName || `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || userData?.email}
          </p>
        </div>
        
        <form onSubmit={handleSave} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="input-field"
              disabled={!editMode}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="input-field"
              disabled={!editMode}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              className="input-field bg-gray-100"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="input-field"
              disabled={!editMode}
            />
          </div>
          {editMode && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="input-field"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                  autoComplete="new-password"
                />
              </div>
            </>
          )}
          <div className="flex gap-4 justify-end">
            {editMode ? (
              <>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setEditMode(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn-primary"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default MemberProfile; 