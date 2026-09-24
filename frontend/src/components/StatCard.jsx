import React from 'react';

const colorMap = {
  navy: 'bg-blue-50 text-blue-700 border border-blue-100',
  gold: 'bg-sky-50 text-sky-600 border border-sky-100',
  blue: 'bg-blue-600 text-white shadow-md shadow-blue-500/20',
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  red: 'bg-rose-50 text-rose-700 border border-rose-100',
};

const StatCard = ({ title, value, icon: Icon, color = 'navy', subtitle }) => {
  return (
    <div className="card flex items-center gap-4.5 p-5 sm:p-6 hover:shadow-md transition-all">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${colorMap[color] || colorMap.navy}`}>
        <Icon size={26} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm sm:text-base font-medium text-slate-500">{title}</p>
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">{value}</p>
        {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatCard;
