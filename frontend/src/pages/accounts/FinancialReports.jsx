import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../../api/axios';

const FinancialReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/accounts/reports')
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <div className="text-center py-20 text-gray-400">Loading reports...</div>;

  const revenueData = (data.revenueTrend || []).map((r) => ({ month: r.month, Revenue: parseFloat(r.revenue) }));
  const commissionData = (data.commissionTrend || []).map((c) => ({ month: c.month, Commission: parseFloat(c.commission) }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Financial Reports</h1>
        <p className="text-gray-500 text-sm">Revenue, commission trends and top earners</p>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Monthly Revenue</h3>
        {revenueData.length === 0 ? (
          <p className="text-sm text-gray-400 py-10 text-center">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
              <Bar dataKey="Revenue" fill="#1E3A8A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Monthly Commission Payout</h3>
        {commissionData.length === 0 ? (
          <p className="text-sm text-gray-400 py-10 text-center">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={commissionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
              <Bar dataKey="Commission" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Top 5 Earners</h3>
        {(!data.topEarners || data.topEarners.length === 0) ? (
          <p className="text-sm text-gray-400 py-6 text-center">No commission data yet</p>
        ) : (
          <div className="space-y-2">
            {data.topEarners.map((e, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5">
                <span className="text-gray-700 font-medium">#{i + 1} {e.earner?.name || 'Unknown'}</span>
                <span className="font-bold text-navy">₹{Number(e.dataValues?.total || e.total).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialReports;
