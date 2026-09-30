import React, { useEffect, useState } from 'react';
import { Users, Network, RefreshCw, Printer } from 'lucide-react';
import api from '../api/axios';
import NetworkTreeNode from '../components/NetworkTreeNode';
import Modal from '../components/Modal';

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

  const [printNode, setPrintNode] = useState(null);

  const flattenTree = (node) => {
    let list = [node];
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        list = list.concat(flattenTree(child));
      });
    }
    return list;
  };

  const handlePrint = (node) => {
    setPrintNode(node);
  };

  const handlePrintWindow = () => {
    window.print();
  };

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
                  <NetworkTreeNode key={rootNode.id} node={rootNode} depth={0} serial={serial} isHorizontal={true} onPrint={handlePrint} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Print Modal */}
      <Modal title="Print Network Records" isOpen={!!printNode} onClose={() => setPrintNode(null)} size="3xl">
        {printNode && (() => {
          const flatList = flattenTree(printNode);
          return (
            <div>
              <div id="print-area" className="text-gray-800 bg-white p-4">
                <div className="text-center mb-6 border-b pb-4">
                  <h2 className="text-2xl font-bold uppercase text-navy">DEVOJAS REALTORS</h2>
                  <p className="text-gray-500 font-semibold mt-1">Associate Downline Report</p>
                </div>
                
                <div className="flex justify-between items-end mb-6 bg-gray-50 p-4 rounded-lg border">
                  <div>
                    <p className="text-sm text-gray-500">Root Associate</p>
                    <p className="text-lg font-bold text-navy uppercase">{printNode.name}</p>
                    <p className="font-mono text-sm">{printNode.login_id} • {printNode.referral_code}</p>
                    <p className="text-sm">Phone: {printNode.phone || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Team Size</p>
                    <p className="text-2xl font-bold text-emerald-600">{flatList.length - 1}</p>
                    <p className="text-xs text-gray-400 mt-1">Date: {new Date().toLocaleDateString('en-IN')}</p>
                  </div>
                </div>

                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-navy text-white">
                    <tr>
                      <th className="py-2 px-3 border border-gray-300">S.No</th>
                      <th className="py-2 px-3 border border-gray-300">Associate Name</th>
                      <th className="py-2 px-3 border border-gray-300">ID / Referral Code</th>
                      <th className="py-2 px-3 border border-gray-300">Phone</th>
                      <th className="py-2 px-3 border border-gray-300">Level (Depth)</th>
                      <th className="py-2 px-3 border border-gray-300">Joined On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flatList.map((item, index) => {
                      // Find depth relative to the printNode
                      // In a deep structure, we might need a better depth tracker, but visually this is fine
                      // For a simple list, we just list them. We can determine depth by adding a depth prop in flattenTree if needed.
                      return (
                        <tr key={item.id} className={index === 0 ? "bg-blue-50 font-semibold" : ""}>
                          <td className="py-2 px-3 border border-gray-300 text-center">{index === 0 ? '-' : index}</td>
                          <td className="py-2 px-3 border border-gray-300 uppercase">{item.name} {index === 0 && "(ROOT)"}</td>
                          <td className="py-2 px-3 border border-gray-300 font-mono text-xs">{item.login_id}<br/>{item.referral_code}</td>
                          <td className="py-2 px-3 border border-gray-300">{item.phone}</td>
                          <td className="py-2 px-3 border border-gray-300">{index === 0 ? '0' : 'Downline'}</td>
                          <td className="py-2 px-3 border border-gray-300">{new Date(item.createdAt).toLocaleDateString('en-IN')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end mt-4 pt-4 border-t print:hidden">
                <button onClick={handlePrintWindow} className="btn-primary flex items-center gap-2">
                  <Printer size={16} /> Print / Save as PDF
                </button>
              </div>

              <style>{`
                @media print {
                  body * { visibility: hidden; }
                  #print-area, #print-area * { visibility: visible; }
                  #print-area { position: absolute; left: 0; top: 0; width: 100%; }
                  .print\\:hidden { display: none !important; }
                }
              `}</style>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

export default MyTeamNetwork;
