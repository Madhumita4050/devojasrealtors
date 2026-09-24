import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Badge from '../../components/Badge';

const MyCommissions = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/associate/commissions')
      .then((res) => setCommissions(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const total = commissions.reduce((sum, c) => sum + parseFloat(c.amount), 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Commission History</h1>
        <p className="text-gray-500 text-sm">All commissions earned from deals you've been part of</p>
      </div>

      <div className="card bg-gradient-to-r from-gold to-gold-light text-white max-w-sm">
        <p className="text-sm text-amber-50">Total Earned (All Time)</p>
        <p className="text-2xl font-bold">₹{total.toLocaleString('en-IN')}</p>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Plot</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">%</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : commissions.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-10 text-gray-400">No commissions earned yet</td></tr>
            ) : (
              commissions.map((c) => (
                <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{c.transaction?.plot?.title || '—'}</td>
                  <td className="px-4 py-3 capitalize text-gray-500">{c.role_level.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-gray-500">{c.percent}%</td>
                  <td className="px-4 py-3 font-semibold text-navy">₹{Number(c.amount).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3"><Badge status={c.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyCommissions;
