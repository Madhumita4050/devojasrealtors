import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import api from '../api/axios';

const COLORS = ['#1E3A8A', '#F59E0B', '#10B981', '#EF4444'];

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats').then((res) => setStats(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <div className="text-center py-20 text-gray-400">Loading reports...</div>;

  const plotData = [
    { name: 'Available', value: stats.availablePlots },
    { name: 'Sold', value: stats.soldPlots },
    { name: 'Pending', value: stats.pendingPlots }
  ];

  const trendData = (stats.salesTrend || []).map((s) => ({ month: s.month, revenue: parseFloat(s.total) }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
        <p className="text-gray-500 text-sm">Business performance at a glance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Plot Status Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={plotData} dataKey="value" nameKey="name" outerRadius={90} label>
                {plotData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Revenue Trend</h3>
          {trendData.length === 0 ? (
            <p className="text-sm text-gray-400 py-20 text-center">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                <Line type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><p className="text-gray-400">Total Revenue</p><p className="font-bold text-navy text-lg">₹{Number(stats.totalRevenue).toLocaleString('en-IN')}</p></div>
          <div><p className="text-gray-400">Commission Paid</p><p className="font-bold text-gold text-lg">₹{Number(stats.totalCommissionPaid).toLocaleString('en-IN')}</p></div>
          <div><p className="text-gray-400">Net Profit</p><p className="font-bold text-emerald-600 text-lg">₹{Number(stats.netProfit).toLocaleString('en-IN')}</p></div>
          <div><p className="text-gray-400">Open Complaints</p><p className="font-bold text-red-500 text-lg">{stats.pendingComplaints}</p></div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
