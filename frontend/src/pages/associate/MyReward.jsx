import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import api from '../../api/axios';

const MyReward = () => {
  const [rewards, setRewards] = useState([]);
  const [totalRewards, setTotalRewards] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/associate/my-rewards')
      .then((res) => { setRewards(res.data.data); setTotalRewards(res.data.totalRewards); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Reward</h1>
        <p className="text-gray-500 text-sm">One-time milestone rewards — earned only when you personally close a sale and level up a slab</p>
      </div>

      <div className="card bg-gradient-to-r from-gold to-gold-light text-white max-w-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Trophy size={22} />
        </div>
        <div>
          <p className="text-sm text-amber-50">Total Rewards Earned</p>
          <p className="text-2xl font-bold">₹{Number(totalRewards).toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Slab Reached</th>
              <th className="text-left px-4 py-3">Reward Amount</th>
              <th className="text-left px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : rewards.length === 0 ? (
              <tr><td colSpan="3" className="text-center py-10 text-gray-400">
                No rewards yet — rewards only trigger when YOU personally sell a plot and cross into a new slab (not from downline earnings)
              </td></tr>
            ) : (
              rewards.map((r) => (
                <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">Slab {r.slab?.slab_number}</td>
                  <td className="px-4 py-3 font-semibold text-gold">₹{Number(r.reward_amount).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyReward;
