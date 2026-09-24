import React from 'react';
import { X, UserCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ImpersonationBanner = () => {
  const { user } = useAuth();
  
  // We need to detect if this is an impersonation session.
  // We can either check a localStorage flag or the token itself if we decode it, 
  // or a query param.
  // The simplest is to check if there is an impersonation_token in the URL or localStorage.
  const isImpersonating = !!localStorage.getItem('impersonation_token');

  if (!isImpersonating || !user) return null;

  const exitImpersonation = () => {
    localStorage.removeItem('impersonation_token');
    window.close(); // Close the tab
    // Fallback if tab can't be closed
    window.location.href = '/'; 
  };

  return (
    <div className="bg-amber-500 text-white px-4 py-2 flex items-center justify-between shadow-md z-50 relative">
      <div className="flex items-center gap-2">
        <UserCircle2 size={20} />
        <span className="font-medium text-sm">
          Viewing as <strong>{user.name}</strong> — Admin Mode
        </span>
      </div>
      <button 
        onClick={exitImpersonation}
        className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition-colors font-medium"
      >
        <X size={16} />
        Exit Admin Mode
      </button>
    </div>
  );
};

export default ImpersonationBanner;
