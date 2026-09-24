import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CreditCard, Send, FileText, BarChart3, Wallet, Download, Headphones, LogOut, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/accounts' },
  { title: 'Payment Verification', icon: CreditCard, path: '/accounts/payments' },
  { title: 'Payout Management', icon: Send, path: '/accounts/payouts' },
  { title: 'Invoices & Receipts', icon: FileText, path: '/accounts/invoices' },
  { title: 'Financial Reports', icon: BarChart3, path: '/accounts/reports' },
  { title: 'All Wallets', icon: Wallet, path: '/accounts/wallets' },
  { title: 'Export Data', icon: Download, path: '/accounts/export' },
  { title: 'Support', icon: Headphones, path: '/accounts/support' },
];

const AccountsSidebar = ({ collapsed }) => {
  const { logout } = useAuth();

  return (
    <aside className={`fixed top-0 left-0 h-screen bg-navy text-white flex flex-col z-40 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[280px]'}`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 border-b shrink-0 ${collapsed ? 'px-3 py-4 justify-center' : 'px-5 py-4'} justify-center`} style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
        <div className="relative shrink-0 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Devojas Realtors"
            className="relative w-auto h-auto max-w-[120px] max-h-[68px] object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            end={item.path === '/accounts'}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold shadow-md shadow-blue-500/30' : 'hover:bg-navy-light/60 text-slate-300 hover:text-white'
              }`
            }
          >
            <item.icon size={19} />
            {!collapsed && <span className="font-medium text-sm sm:text-base">{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-navy-light/40">
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-red-500/80 transition-colors">
          <LogOut size={18} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
};

export default AccountsSidebar;
