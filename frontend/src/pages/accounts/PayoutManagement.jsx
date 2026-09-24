import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import api from '../../api/axios';

const PayoutManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/accounts/payouts');
      setRequests(res.data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id, action) => {
    await api.put(`/accounts/payouts/${id}`, { action });
    fetchRequests();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Payout Management</h1>
        <p className="text-gray-500 text-sm">Approve or reject associate/client withdrawal requests</p>
      </div>

      <div className="card">
        {loading ? (
          <p className="text-center py-10 text-gray-400">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-center py-10 text-gray-400">No pending payout requests 🎉</p>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                <div>
                  <p className="font-medium text-gray-800">{r.user?.name} <span className="text-xs text-gray-400 capitalize">({r.user?.role})</span></p>
                  <p className="text-xs text-gray-400">{r.user?.email} · {r.user?.phone}</p>
                  <p className="text-sm font-semibold text-navy mt-1">₹{Number(r.amount).toLocaleString('en-IN')} requested</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction(r.id, 'approve')} className="btn-success flex items-center gap-1">
                    <Check size={14} /> Approve
                  </button>
                  <button onClick={() => handleAction(r.id, 'reject')} className="btn-danger flex items-center gap-1">
                    <X size={14} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PayoutManagement;
