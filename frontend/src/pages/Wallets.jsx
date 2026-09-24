import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import api from '../api/axios';

const Wallets = () => {
  const [wallets, setWallets] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [wRes, wdRes] = await Promise.all([
        api.get('/wallets'),
        api.get('/wallets/withdrawals')
      ]);
      setWallets(wRes.data.data);
      setWithdrawals(wdRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleWithdrawal = async (id, action) => {
    await api.put(`/wallets/withdrawals/${id}`, { action });
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Wallet Management</h1>
        <p className="text-gray-500 text-sm">User wallet balances & withdrawal approvals</p>
      </div>

      {/* Pending Withdrawals */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Pending Withdrawal Requests</h3>
        {withdrawals.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No pending withdrawal requests</p>
        ) : (
          <div className="space-y-3">
            {withdrawals.map((w) => (
              <div key={w.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                <div>
                  <p className="font-medium text-gray-800">{w.user?.name}</p>
                  <p className="text-xs text-gray-400">₹{Number(w.amount).toLocaleString('en-IN')} requested</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleWithdrawal(w.id, 'approve')} className="btn-success flex items-center gap-1">
                    <Check size={14} /> Approve
                  </button>
                  <button onClick={() => handleWithdrawal(w.id, 'reject')} className="btn-danger flex items-center gap-1">
                    <X size={14} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Wallets */}
      <div className="card overflow-x-auto p-0">
        <div className="px-5 py-4 border-b"><h3 className="font-semibold text-gray-800">All User Wallets</h3></div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Balance</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : wallets.length === 0 ? (
              <tr><td colSpan="3" className="text-center py-10 text-gray-400">No wallets found</td></tr>
            ) : (
              wallets.map((w) => (
                <tr key={w.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{w.user?.name}</td>
                  <td className="px-4 py-3 capitalize text-gray-500">{w.user?.role}</td>
                  <td className="px-4 py-3 font-semibold text-navy">₹{Number(w.balance).toLocaleString('en-IN')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Wallets;
