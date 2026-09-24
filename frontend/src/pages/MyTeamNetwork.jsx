import React, { useEffect, useState } from 'react';
import { Users, Network, RefreshCw } from 'lucide-react';
import api from '../api/axios';
import NetworkTreeNode from '../components/NetworkTreeNode';

// Admin's full company-wide network tree
const MyTeamNetwork = () => {
  const [tree, setTree] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNetwork = async () => {
    setLoading(true);
    try {
      const res = await api.get('/network/full');
      setTree(res.data.data);
      setTotalCount(res.data.totalCount);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetwork();
  }, []);

  const serial = { current: 1 };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Network size={24} className="text-gold" />
            Full Company Network
          </h1>
          <p className="page-subtitle">Complete referral hierarchy across the entire organization</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchNetwork} className="btn-ghost flex items-center gap-2">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="card bg-gradient-to-r from-navy to-navy-light text-white max-w-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Users size={22} />
        </div>
        <div>
          <p className="text-sm text-blue-100">Total Associates in Network</p>
          <p className="text-2xl font-bold">{totalCount}</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
            <Network size={16} className="text-navy-dark" />
          </div>
          <h3 className="font-bold text-white">Network Tree</h3>
          <span className="ml-2 text-[10px] text-slate-500 bg-[#0d1d47] border border-[#1e2f5a] px-2.5 py-1 rounded-full font-medium">
            Click any node to expand/collapse
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : tree.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0d1d47] border border-[#1e2f5a] flex items-center justify-center mx-auto mb-4">
              <Users size={28} className="text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium">No network yet</p>
            <p className="text-slate-600 text-sm mt-1">Add associates with referrals to build the tree</p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-8">
            <div className="min-w-max p-4">
              <div className="flex justify-center">
                {tree.map((rootNode) => (
                  <NetworkTreeNode key={rootNode.id} node={rootNode} depth={0} serial={serial} isHorizontal={true} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTeamNetwork;
