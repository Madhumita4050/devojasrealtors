import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Home, Search, Receipt, User, Bell, Headphones, LogOut, Building2, ChevronDown, IndianRupee
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/client' },
  {
    title: 'My Plots', icon: Home, path: '/client/my-plots',
    sub: [
      { title: 'All My Listings', path: '/client/my-plots' },
      { title: 'Add New Plot', path: '/client/my-plots/add' }
    ]
  },
  { title: 'Browse Plots', icon: Search, path: '/client/browse' },
  {
    title: 'My Transactions', icon: Receipt, path: '/client/transactions',
    sub: [
      { title: 'My Purchases', path: '/client/transactions?type=purchases' },
      { title: 'My Sales', path: '/client/transactions?type=sales' }
    ]
  },
  { title: 'My Payments', icon: IndianRupee, path: '/client/payments' },
  { title: 'My Profile & KYC', icon: User, path: '/client/profile' },
  { title: 'Notifications', icon: Bell, path: '/client/notifications' },
  { title: 'Support', icon: Headphones, path: '/client/support' },
];

const ClientSidebar = ({ collapsed }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const { logout, user } = useAuth();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen flex flex-col z-40 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}
      style={{ background: 'linear-gradient(180deg, #080f2b 0%, #0a1628 50%, #060d22 100%)' }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80" />

      {/* Logo */}
      <div className={`flex items-center gap-3 h-18 border-b border-white/[0.08] shrink-0 ${collapsed ? 'px-4 justify-center' : 'px-5 py-4'}`}>
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
            <Building2 size={20} className="text-white" />
          </div>
          <div className="absolute inset-0 rounded-xl bg-blue-500/20 blur-md" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-extrabold text-white text-base leading-tight tracking-wider">DEVOJAS</p>
            <p className="text-xs text-sky-400 font-bold tracking-widest uppercase">Client Portal</p>
          </div>
        )}
      </div>

      {/* User info chip */}
      {!collapsed && user && (
        <div className="mx-3 mt-3 px-3.5 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-sky-400 uppercase tracking-wider font-bold">Client</p>
          </div>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-1">
        {menuItems.map((item) => (
          <div key={item.title}>
            {item.sub ? (
              <>
                <button
                  onClick={() => setOpenMenu(openMenu === item.title ? null : item.title)}
                  className={`sidebar-link w-full justify-between ${openMenu === item.title ? 'text-white bg-white/[0.08]' : ''}`}
                >
                  <span className="flex items-center gap-3">
                    <item.icon size={19} className={openMenu === item.title ? 'text-sky-400' : ''} />
                    {!collapsed && <span className="font-medium text-sm sm:text-base">{item.title}</span>}
                  </span>
                  {!collapsed && (
                    <ChevronDown size={16} className={`transition-transform duration-200 ${openMenu === item.title ? 'rotate-180 text-sky-400' : 'text-slate-500'}`} />
                  )}
                </button>
                {item.sub && openMenu === item.title && !collapsed && (
                  <div className="ml-5 mt-1 mb-1 space-y-1 border-l-2 border-blue-500/30 pl-3">
                    {item.sub.map((s) => (
                      <NavLink
                        key={s.title}
                        to={s.path}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                            isActive ? 'text-sky-300 font-bold bg-blue-900/40' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                          }`
                        }
                      >
                        {s.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.path}
                end={item.path === '/client'}
                className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
              >
                <item.icon size={19} />
                {!collapsed && <span className="text-sm sm:text-base">{item.title}</span>}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/[0.06]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 font-medium"
        >
          <LogOut size={17} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
};

export default ClientSidebar;
