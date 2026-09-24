import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Shield, Server, Building2, Save, Upload, Loader2,
  Lock, CheckCircle2, AlertCircle, Phone, Mail, MapPin, FileText
} from 'lucide-react';
import api from '../api/axios';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [companySettings, setCompanySettings] = useState({
    company_name: '',
    tagline: '',
    company_logo_url: '',
    company_phone: '',
    company_email: '',
    company_address: '',
    company_gst: '',
    company_rera: ''
  });

  const [savedCompanyMsg, setSavedCompanyMsg] = useState('');
  const [companyError, setCompanyError] = useState('');
  const [savingCompany, setSavingCompany] = useState(false);

  // Logo upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Admin password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data?.data) {
        setCompanySettings((prev) => ({ ...prev, ...res.data.data }));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    setCompanyError('');
    setSavedCompanyMsg('');
    setSavingCompany(true);
    try {
      const res = await api.put('/settings', companySettings);
      setSavedCompanyMsg('Company profile & branding settings saved successfully!');
      if (res.data?.data) {
        setCompanySettings((prev) => ({ ...prev, ...res.data.data }));
      }
      setTimeout(() => setSavedCompanyMsg(''), 4000);
    } catch (err) {
      setCompanyError(err.response?.data?.message || 'Failed to save settings. Please try again.');
    } finally {
      setSavingCompany(false);
    }
  };

  const handleLogoFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCompanySettings((prev) => ({ ...prev, company_logo_url: res.data.url }));
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Logo upload failed. Please try a different image.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMsg('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    setSavingPassword(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordMsg('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordMsg(''), 4000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Could not change password. Check your current password.');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400 text-base">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="page-title">Settings & Configuration</h1>
        <p className="page-subtitle">Manage company identity, contact info on receipts/PDFs, and admin account security</p>
      </div>

      {/* Admin Profile Overview */}
      <div className="card border border-slate-200">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Shield size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Admin Account</h3>
            <p className="text-xs text-slate-500">Currently active session credentials</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-slate-50 p-3.5 rounded-xl">
            <p className="text-xs text-slate-400 font-semibold uppercase">Administrator Name</p>
            <p className="font-bold text-slate-900 text-base mt-0.5">{user?.name || 'Admin'}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl">
            <p className="text-xs text-slate-400 font-semibold uppercase">Email Address</p>
            <p className="font-bold text-slate-900 text-base mt-0.5">{user?.email || 'N/A'}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl">
            <p className="text-xs text-slate-400 font-semibold uppercase">System Role</p>
            <p className="font-bold text-blue-700 text-base capitalize mt-0.5">{user?.role || 'Admin'}</p>
          </div>
        </div>
      </div>

      {/* Company Branding & Details */}
      <div className="card border border-slate-200">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Building2 size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Company Details & Branding</h3>
            <p className="text-xs text-slate-500">Printed on all plot booking sheets, receipts, and customer PDFs</p>
          </div>
        </div>

        {savedCompanyMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
            <CheckCircle2 size={18} /> {savedCompanyMsg}
          </div>
        )}
        {companyError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
            <AlertCircle size={18} /> {companyError}
          </div>
        )}

        <form onSubmit={handleSaveCompany} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Company Legal Name *</label>
              <input
                required
                value={companySettings.company_name || ''}
                onChange={(e) => setCompanySettings({ ...companySettings, company_name: e.target.value })}
                className="input-field"
                placeholder="DEVOJAS REALTORS"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Tagline / Slogan</label>
              <input
                value={companySettings.tagline || ''}
                onChange={(e) => setCompanySettings({ ...companySettings, tagline: e.target.value })}
                className="input-field"
                placeholder="Your Trusted Real Estate Partner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-1.5">
                <Phone size={14} className="text-blue-600" /> Official Phone Number
              </label>
              <input
                value={companySettings.company_phone || ''}
                onChange={(e) => setCompanySettings({ ...companySettings, company_phone: e.target.value })}
                className="input-field"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-1.5">
                <Mail size={14} className="text-blue-600" /> Official Email
              </label>
              <input
                type="email"
                value={companySettings.company_email || ''}
                onChange={(e) => setCompanySettings({ ...companySettings, company_email: e.target.value })}
                className="input-field"
                placeholder="contact@devojasrealtors.com"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-1.5">
              <MapPin size={14} className="text-blue-600" /> Head Office Address
            </label>
            <textarea
              rows={2}
              value={companySettings.company_address || ''}
              onChange={(e) => setCompanySettings({ ...companySettings, company_address: e.target.value })}
              className="input-field"
              placeholder="Suite 101, Business Tower, Main Road, City, State - PIN"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-1.5">
                <FileText size={14} className="text-blue-600" /> GSTIN Number
              </label>
              <input
                value={companySettings.company_gst || ''}
                onChange={(e) => setCompanySettings({ ...companySettings, company_gst: e.target.value })}
                className="input-field"
                placeholder="07AAAAA0000A1Z5"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-1.5">
                <FileText size={14} className="text-blue-600" /> RERA Registration No.
              </label>
              <input
                value={companySettings.company_rera || ''}
                onChange={(e) => setCompanySettings({ ...companySettings, company_rera: e.target.value })}
                className="input-field"
                placeholder="RERA/PRJ/2026/001"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Company Logo</label>
            <div className="flex flex-wrap items-center gap-5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              {companySettings.company_logo_url ? (
                <div className="relative group">
                  <img
                    src={companySettings.company_logo_url}
                    alt="Company Logo"
                    className="w-20 h-20 object-contain bg-white border border-slate-200 rounded-xl p-2 shadow-sm"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-white">
                  <Building2 size={24} />
                  <span className="text-[10px] mt-1 font-medium">No Logo</span>
                </div>
              )}

              <div className="space-y-1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileSelect}
                  className="hidden"
                  id="company-logo-upload"
                />
                <label
                  htmlFor="company-logo-upload"
                  className="btn-primary cursor-pointer text-sm py-2 px-4 inline-flex items-center gap-2"
                >
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  {uploading ? 'Uploading Logo...' : 'Upload New Logo'}
                </label>
                <p className="text-xs text-slate-500">Supports PNG, JPG, SVG, WebP up to 5MB</p>
                {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingCompany}
              className="btn-primary text-base py-2.5 px-6 flex items-center gap-2"
            >
              {savingCompany ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {savingCompany ? 'Saving Settings...' : 'Save Company Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* Admin Password Change */}
      <div className="card border border-slate-200">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Lock size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Change Admin Password</h3>
            <p className="text-xs text-slate-500">Update your security password for panel access</p>
          </div>
        </div>

        {passwordMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
            <CheckCircle2 size={18} /> {passwordMsg}
          </div>
        )}
        {passwordError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
            <AlertCircle size={18} /> {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-xl">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Current Password</label>
            <input
              type="password"
              required
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="input-field"
              placeholder="Enter current password"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">New Password</label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="input-field"
                placeholder="At least 6 characters"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="input-field"
                placeholder="Re-enter new password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="btn-primary text-base py-2.5 px-6 flex items-center gap-2"
          >
            {savingPassword ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
            {savingPassword ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* External System Status */}
      <div className="card border border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-3">
          <Server size={20} className="text-blue-700" />
          <h3 className="font-bold text-slate-900 text-base">API & Integration Engine</h3>
        </div>
        <p className="text-sm text-slate-600 mb-3 leading-relaxed">
          System automatically handles live vs mock gateway modes. When API keys are configured in the server environment, real payment, WhatsApp, and SMS triggers will execute automatically without code modifications.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
            <p className="text-xs text-slate-400 font-bold uppercase">Payment Gateway</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Internal Mock</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
            <p className="text-xs text-slate-400 font-bold uppercase">SMS Gateway</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Simulated OTP</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
            <p className="text-xs text-slate-400 font-bold uppercase">Email Service</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">SMTP Active</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
            <p className="text-xs text-slate-400 font-bold uppercase">KYC Verification</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Admin Review</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
