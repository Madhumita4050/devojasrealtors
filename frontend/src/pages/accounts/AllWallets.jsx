import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import api from '../../api/axios';

const AllWallets = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/accounts/wallets')
      .then((res) => setWallets(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = wallets.filter((w) =>
    w.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    w.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalBalance = wallets.reduce((sum, w) => sum + parseFloat(w.balance), 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">All Wallets Overview</h1>
        <p className="text-gray-500 text-sm">Audit view of every user's wallet balance</p>
      </div>

      <div className="card bg-gradient-to-r from-navy to-navy-light text-white max-w-sm">
        <p className="text-sm text-blue-100">Total Balance Across Platform</p>
        <p className="text-2xl font-bold">₹{totalBalance.toLocaleString('en-IN')}</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="input-field pl-9" />
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Balance</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-10 text-gray-400">No wallets found</td></tr>
            ) : (
              filtered.map((w) => (
                <tr key={w.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{w.user?.name}</td>
                  <td className="px-4 py-3 capitalize text-gray-500">{w.user?.role}</td>
                  <td className="px-4 py-3 text-gray-500">{w.user?.email}</td>
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

export default AllWallets;
