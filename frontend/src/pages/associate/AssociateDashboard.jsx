import React, { useEffect, useState } from 'react';
import {
  Users, Handshake, IndianRupee, Wallet, Copy, Check,
  User as UserIcon, Phone, Mail, Clock, MapPin, CreditCard,
  Hash, BadgeCheck, Calendar, TrendingUp, Network, Star, ChevronRight
} from 'lucide-react';
import api from '../../api/axios';

const maskAadhar = (a) => (a ? `XXXX XXXX ${String(a).slice(-4)}` : '—');
const maskPan = (p) => (p ? `${p.slice(0, 2)}XXXXX${p.slice(-2)}` : '—');
const fmt = (v) => `₹${Number(v || 0).toLocaleString('en-IN')}`;
const fmtCompact = (v) => `₹${Number(v || 0).toLocaleString('en-IN', { notation: 'compact', maximumFractionDigits: 1 })}`;

const StatCard = ({ title, value, icon: Icon, gradient, sub }) => (
  <div className="stat-card relative overflow-hidden">
    <div className={`absolute inset-0 opacity-10 ${gradient}`} />
    <div className="relative">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gradient} opacity-80`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-xs text-slate-400 font-medium">{title}</p>
      {sub && <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value, accent }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-[#1a2a4a] last:border-0">
    <div className="w-7 h-7 rounded-lg bg-[#0d1d47] flex items-center justify-center shrink-0 mt-0.5">
      <Icon size={13} className={accent || 'text-slate-400'} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-slate-200 mt-0.5">{value || '—'}</p>
    </div>
  </div>
);

const AssociateDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await api.get('/associate/dashboard-stats');
      setStats(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const copyReferral = () => {
    navigator.clipboard.writeText(stats.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Loading dashboard...</p>
      </div>
    </div>
  );

  const profile = stats.profile || {};

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome, {profile.name?.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">Your associate dashboard — live business overview</p>
        </div>
        {profile.login_id && (
          <div className="flex items-center gap-2 bg-gold/10 border border-gold/20 px-4 py-2 rounded-xl">
            <BadgeCheck size={16} className="text-gold" />
            <span className="text-gold font-bold text-sm">{profile.login_id}</span>
          </div>
        )}
      </div>

      {/* Business Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Team Members"
          value={stats.totalTeamCount || stats.myTeamCount || 0}
          icon={Users}
          gradient="bg-gradient-to-br from-blue-600 to-blue-800"
          sub={`${stats.myTeamCount || 0} direct`}
        />
        <StatCard
          title="Self Business"
          value={fmtCompact(stats.selfBusiness)}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-gold to-gold-dark"
          sub="Personal deals"
        />
        <StatCard
          title="Team Business"
          value={fmtCompact(stats.teamBusiness)}
          icon={Network}
          gradient="bg-gradient-to-br from-emerald-600 to-emerald-800"
          sub="Downline volume"
        />
        <StatCard
          title="Total Business"
          value={fmtCompact(stats.totalBusiness)}
          icon={IndianRupee}
          gradient="bg-gradient-to-br from-purple-600 to-purple-800"
          sub="Self + Team"
        />
      </div>

      {/* Wallet + Commission Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Wallet Balance" value={fmt(stats.walletBalance)} icon={Wallet} gradient="bg-gradient-to-br from-cyan-600 to-cyan-800" />
        <StatCard title="Total Commission Earned" value={fmt(stats.totalCommissionEarned)} icon={Handshake} gradient="bg-gradient-to-br from-amber-600 to-amber-800" />
        <StatCard title="Total Deals" value={stats.totalDeals || 0} icon={Star} gradient="bg-gradient-to-br from-rose-600 to-rose-800" sub="Deals I was part of" />
      </div>

      {/* Profile Card + Referral Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Profile Details — left 2/3 */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-navy-light to-navy-muted flex items-center justify-center">
              <UserIcon size={16} className="text-white" />
            </div>
            <h3 className="font-bold text-white text-base">My Profile</h3>
            {profile.kyc_status === 'approved' && (
              <span className="ml-auto badge-approved">✓ Approved</span>
            )}
            {profile.kyc_status === 'pending' && (
              <span className="ml-auto badge-pending">⏳ Pending</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <div>
              <InfoRow icon={Hash} label="Associate ID" value={profile.login_id} accent="text-gold" />
              <InfoRow icon={UserIcon} label="Full Name" value={profile.name} accent="text-blue-400" />
              <InfoRow icon={Phone} label="Phone" value={profile.phone} accent="text-green-400" />
              <InfoRow icon={Mail} label="Email" value={profile.email || 'Not provided'} accent="text-purple-400" />
            </div>
            <div>
              <InfoRow icon={CreditCard} label="PAN Number" value={maskPan(profile.pan_number)} accent="text-orange-400" />
              <InfoRow icon={Hash} label="Aadhar Number" value={maskAadhar(profile.aadhar_number)} accent="text-rose-400" />
              <InfoRow icon={Calendar} label="Date of Joining" value={profile.member_since ? new Date(profile.member_since).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'} accent="text-teal-400" />
              <InfoRow icon={Clock} label="Last Login" value={profile.last_login_at ? new Date(profile.last_login_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'} accent="text-cyan-400" />
            </div>
          </div>

          {profile.address && (
            <div className="mt-2 border-t border-[#1a2a4a] pt-3 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#0d1d47] flex items-center justify-center shrink-0">
                <MapPin size={13} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Address</p>
                <p className="text-sm font-semibold text-slate-200 mt-0.5">{profile.address}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right column: Referral + Sponsor */}
        <div className="space-y-4">
          {/* Referral Code */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #0f2557 0%, #162040 100%)' }}>
            <p className="text-[10px] text-gold/70 font-bold uppercase tracking-widest mb-2">Your Referral Code</p>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl font-bold tracking-wider text-white">{stats.referralCode}</span>
              <button onClick={copyReferral} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all active:scale-95">
                {copied ? <Check size={15} className="text-green-400" /> : <Copy size={15} className="text-white" />}
              </button>
            </div>
            <div className="bg-white/5 rounded-xl px-3 py-2">
              <p className="text-[10px] text-slate-400">Commission Rate</p>
              <p className="text-lg font-bold text-gold">{profile.referral_commission_percent ?? 5}%</p>
            </div>
            <p className="text-[10px] text-slate-500 mt-3">Share this code with clients & associates to earn commission from their deals.</p>
          </div>

          {/* Sponsored By */}
          {stats.sponsoredBy && (
            <div className="card">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">Sponsored By</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/30 to-gold-dark/30 border border-gold/20 flex items-center justify-center text-base font-bold text-gold">
                  {stats.sponsoredBy.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{stats.sponsoredBy.name}</p>
                  <p className="text-xs text-gold">{stats.sponsoredBy.login_id}</p>
                  <p className="text-[10px] text-slate-500">{stats.sponsoredBy.phone}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssociateDashboard;
