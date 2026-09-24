import React, { useEffect, useState } from 'react';
import { IndianRupee, Percent, TrendingUp, CreditCard, Send, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api/axios';
import StatCard from '../../components/StatCard';

const AccountsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/accounts/dashboard-stats');
      setStats(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 20000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading dashboard...</div>;

  const trendData = (stats.revenueTrend || []).map((s) => ({ month: s.month, revenue: parseFloat(s.total) }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Financial Dashboard</h1>
        <p className="text-gray-500 text-sm">Live overview of revenue, commissions and payouts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Revenue" value={`₹${Number(stats.totalRevenue).toLocaleString('en-IN')}`} icon={IndianRupee} color="green" />
        <StatCard title="Commission Paid" value={`₹${Number(stats.totalCommissionPaid).toLocaleString('en-IN')}`} icon={Percent} color="gold" />
        <StatCard title="Net Profit" value={`₹${Number(stats.netProfit).toLocaleString('en-IN')}`} icon={TrendingUp} color="navy" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Unpaid Transactions" value={stats.unpaidTransactions} icon={CreditCard} color="red" subtitle="Needs verification" />
        <StatCard title="Pending Payouts" value={stats.pendingPayouts} icon={Send} color="gold" subtitle={`₹${Number(stats.pendingPayoutAmount).toLocaleString('en-IN')} total`} />
        <StatCard title="Total Wallet Balance" value={`₹${Number(stats.totalWalletBalance).toLocaleString('en-IN')}`} icon={Wallet} color="navy" subtitle="Across all users" />
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Revenue Trend (Monthly)</h3>
        {trendData.length === 0 ? (
          <p className="text-sm text-gray-400 py-10 text-center">No completed transactions yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
              <Bar dataKey="revenue" fill="#1E3A8A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AccountsDashboard;
