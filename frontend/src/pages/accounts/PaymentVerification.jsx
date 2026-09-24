import React, { useEffect, useState } from 'react';
import { CheckCircle, RotateCcw } from 'lucide-react';
import api from '../../api/axios';
import Badge from '../../components/Badge';

const PaymentVerification = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('unpaid');

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = filter ? { payment_status: filter } : {};
      const res = await api.get('/accounts/payments', { params });
      setTransactions(res.data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [filter]);

  const updateStatus = async (id, payment_status) => {
    await api.put(`/accounts/payments/${id}`, { payment_status });
    fetchData();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Payment Verification</h1>
        <p className="text-gray-500 text-sm">Verify and mark transaction payments</p>
      </div>

      <div className="flex gap-2">
        {['unpaid', 'paid', 'refunded'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-navy text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Plot</th>
              <th className="text-left px-4 py-3">Buyer</th>
              <th className="text-left px-4 py-3">Seller</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Payment Status</th>
              <th className="text-right px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-10 text-gray-400">No transactions found</td></tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{tx.plot?.title}</td>
                  <td className="px-4 py-3 text-gray-500">{tx.buyer?.name}</td>
                  <td className="px-4 py-3 text-gray-500">{tx.seller?.name}</td>
                  <td className="px-4 py-3 font-semibold text-navy">₹{Number(tx.amount).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3"><Badge status={tx.payment_status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {tx.payment_status !== 'paid' && (
                        <button onClick={() => updateStatus(tx.id, 'paid')} className="btn-success flex items-center gap-1">
                          <CheckCircle size={14} /> Mark Paid
                        </button>
                      )}
                      {tx.payment_status === 'paid' && (
                        <button onClick={() => updateStatus(tx.id, 'refunded')} className="btn-danger flex items-center gap-1">
                          <RotateCcw size={14} /> Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentVerification;
