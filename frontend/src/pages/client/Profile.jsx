import React, { useState } from 'react';
import { User, Lock, ShieldCheck } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/Badge';

const Profile = () => {
  const { user } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [kycUrl, setKycUrl] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/client/profile', profileForm);
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await api.put('/client/change-password', passwordForm);
      setMsg({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Password change failed' });
    }
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/client/kyc', { document_url: kycUrl });
      setMsg({ type: 'success', text: 'KYC submitted for review!' });
      setKycUrl('');
    } catch (err) {
      setMsg({ type: 'error', text: 'KYC submission failed' });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Profile & KYC</h1>
        <p className="text-gray-500 text-sm">Manage your account details and verification</p>
      </div>

      {msg.text && (
        <div className={`text-sm px-4 py-2 rounded-lg ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {msg.text}
        </div>
      )}

      {/* Profile Info */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <User size={20} className="text-navy" />
          <h3 className="font-semibold text-gray-800">Profile Information</h3>
        </div>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
            <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email (cannot be changed)</label>
            <input value={user?.email} disabled className="input-field bg-gray-50 text-gray-400" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
            <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="input-field" />
          </div>
          <button type="submit" className="btn-primary">Update Profile</button>
        </form>
      </div>

      {/* Change Password */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Lock size={20} className="text-navy" />
          <h3 className="font-semibold text-gray-800">Change Password</h3>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Current Password</label>
            <input required type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">New Password</label>
            <input required type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="input-field" />
          </div>
          <button type="submit" className="btn-primary">Change Password</button>
        </form>
      </div>

      {/* KYC */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck size={20} className="text-navy" />
          <h3 className="font-semibold text-gray-800">KYC Verification</h3>
        </div>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-500">Current Status:</span>
          <Badge status={user?.kyc_status || 'not_submitted'} />
        </div>
        <form onSubmit={handleKycSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Document Link (Aadhar/PAN)</label>
            <input required value={kycUrl} onChange={(e) => setKycUrl(e.target.value)} className="input-field" placeholder="Paste document image URL" />
            <p className="text-xs text-gray-400 mt-1">Direct file upload feature coming soon — abhi ke liye document ka link daalo (e.g. Google Drive share link).</p>
          </div>
          <button type="submit" className="btn-gold">Submit for Verification</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
