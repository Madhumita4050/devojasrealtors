import React from 'react';

const styles = {
  active: 'bg-emerald-100 text-emerald-700',
  approved: 'bg-emerald-100 text-emerald-700',
  available: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-emerald-100 text-emerald-700',
  credited: 'bg-emerald-100 text-emerald-700',
  paid: 'bg-emerald-100 text-emerald-700',

  pending: 'bg-amber-100 text-amber-700',
  under_negotiation: 'bg-amber-100 text-amber-700',
  not_submitted: 'bg-gray-100 text-gray-600',

  blocked: 'bg-red-100 text-red-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-red-100 text-red-700',
  overdue: 'bg-red-100 text-red-700',
  sold: 'bg-blue-100 text-blue-700',
};

const Badge = ({ status }) => {
  const cls = styles[status] || 'bg-gray-100 text-gray-600';
  return <span className={`badge ${cls} capitalize`}>{status?.replace('_', ' ')}</span>;
};

export default Badge;
