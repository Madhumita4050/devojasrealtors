import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Percent, Wallet, Search, User, Bell,
  Headphones, LogOut, Building2, Home, Trophy, Network, ChevronRight,
  IndianRupee, TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/associate', end: true },
  { title: 'Team Network', icon: Network, path: '/associate/team' },
  { title: 'My Plot', icon: Home, path: '/associate/my-plot' },
  { title: 'My Reward', icon: Trophy, path: '/associate/my-reward' },
  { title: 'Commission History', icon: Percent, path: '/associate/commissions' },
  { title: 'Wallet & Withdraw', icon: Wallet, path: '/associate/wallet' },
  { title: 'Browse Plots', icon: Search, path: '/associate/plots' },
  { title: 'My Profile & KYC', icon: User, path: '/associate/profile' },
  { title: 'Notifications', icon: Bell, path: '/associate/notifications' },
  { title: 'Support', icon: Headphones, path: '/associate/support' },
];

const AssociateSidebar = ({ collapsed }) => {
  const { logout, user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/associate/dashboard-stats')
      .then(r => setStats(r.data.data))
      .catch(() => {});
  }, []);

  const fmt = (v) => v ? `₹${Number(v).toLocaleString('en-IN', { notation: 'compact', maximumFractionDigits: 1 })}` : '₹0';

  return (
    <aside
      className={`fixed top-0 left-0 h-screen flex flex-col z-40 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[280px]'}`}
      style={{ background: 'linear-gradient(180deg, #080f2b 0%, #0a1628 50%, #060d22 100%)' }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80" />

      {/* Logo */}
      <div className={`flex items-center gap-3 border-b shrink-0 ${collapsed ? 'px-3 py-4 justify-center' : 'px-5 py-4'}`} style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full blur-lg opacity-40" style={{ background: '#D4AF37' }} />
          <img
            src="/logo.png"
            alt="Devojas Realtors"
            className="relative w-11 h-11 rounded-full object-cover ring-2"
            style={{ ringColor: 'rgba(212,175,55,0.6)' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
        {!collapsed && (
          <div className="overflow-hidden leading-tight">
            <p className="font-black text-white text-sm tracking-widest uppercase" style={{ fontFamily: 'serif' }}>DEVOJAS</p>
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#D4AF37' }}>REALTORS Pvt. Ltd.</p>
            <p className="text-[9px] mt-0.5 font-semibold" style={{ color: 'rgba(148,163,184,0.7)' }}>Associate Panel</p>
          </div>
        )}
      </div>

      {/* Associate Profile Chip */}
      {!collapsed && user && (
        <div className="mx-3 mt-3 px-3.5 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-sky-400 font-bold tracking-wider">{user.login_id || 'Associate'}</p>
          </div>
        </div>
      )}

      {/* Quick Stats Panel */}
      {!collapsed && stats && (
        <div className="mx-3 mt-3 rounded-xl border border-[#1e2f5a] bg-[#0d1d47]/60 overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-[#1e2f5a]">
            <div className="p-2.5 text-center">
              <p className="text-[10px] text-slate-500 font-medium">Team</p>
              <p className="text-base font-bold text-white">{stats.totalTeamCount || stats.myTeamCount || 0}</p>
            </div>
            <div className="p-2.5 text-center">
              <p className="text-[10px] text-slate-500 font-medium">Self Biz</p>
              <p className="text-sm font-bold text-gold">{fmt(stats.selfBusiness)}</p>
            </div>
          </div>
          <div className="border-t border-[#1e2f5a] grid grid-cols-2 divide-x divide-[#1e2f5a]">
            <div className="p-2.5 text-center">
              <p className="text-[10px] text-slate-500 font-medium">Team Biz</p>
              <p className="text-sm font-bold text-emerald-400">{fmt(stats.teamBusiness)}</p>
            </div>
            <div className="p-2.5 text-center">
              <p className="text-[10px] text-slate-500 font-medium">Total Biz</p>
              <p className="text-sm font-bold text-blue-400">{fmt(stats.totalBusiness)}</p>
            </div>
          </div>
          {stats.sponsoredBy && (
            <div className="border-t border-[#1e2f5a] px-3 py-2 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <ChevronRight size={10} className="text-gold" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[9px] text-slate-500">Sponsored by</p>
                <p className="text-[10px] font-semibold text-slate-300 truncate">{stats.sponsoredBy.name}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-0.5">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            end={item.end}
            className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
          >
            <item.icon size={17} />
            {!collapsed && item.title}
            {!collapsed && item.title === 'Notifications' && stats?.unreadNotifications > 0 && (
              <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {stats.unreadNotifications}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/[0.06]">
        <button onClick={logout} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 font-medium">
          <LogOut size={17} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
};

export default AssociateSidebar;
