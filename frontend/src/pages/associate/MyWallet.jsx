import React, { useEffect, useState } from 'react';
import { Wallet as WalletIcon, ArrowDownCircle } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const MyWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const res = await api.get('/associate/wallet');
      setWallet(res.data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchWallet(); }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await api.post('/associate/withdraw', { amount });
      setSuccess('Withdrawal request submitted! Admin will review it shortly.');
      setAmount('');
      fetchWallet();
      setTimeout(() => { setModalOpen(false); setSuccess(''); }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Withdrawal request failed');
    }
  };

  const typeLabel = { credit: 'Credit', debit: 'Debit', withdrawal_request: 'Withdrawal Requested', withdrawal_approved: 'Withdrawal Approved', withdrawal_rejected: 'Withdrawal Rejected' };
  const typeColor = { credit: 'text-emerald-600', debit: 'text-red-500', withdrawal_request: 'text-amber-600', withdrawal_approved: 'text-emerald-600', withdrawal_rejected: 'text-red-500' };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading wallet...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Wallet & Withdraw</h1>
          <p className="text-gray-500 text-sm">Your earnings and withdrawal history</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-gold flex items-center gap-2">
          <ArrowDownCircle size={16} /> Request Withdrawal
        </button>
      </div>

      <div className="card bg-gradient-to-r from-navy to-navy-light text-white max-w-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <WalletIcon size={22} />
        </div>
        <div>
          <p className="text-sm text-blue-100">Available Balance</p>
          <p className="text-2xl font-bold">₹{Number(wallet.balance).toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="card overflow-x-auto p-0">
        <div className="px-5 py-4 border-b"><h3 className="font-semibold text-gray-800">Transaction History</h3></div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Description</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {wallet.transactions.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-10 text-gray-400">No wallet activity yet</td></tr>
            ) : (
              wallet.transactions.map((t) => (
                <tr key={t.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{t.description}</td>
                  <td className={`px-4 py-3 font-medium ${typeColor[t.type]}`}>{typeLabel[t.type]}</td>
                  <td className="px-4 py-3 font-semibold text-navy">₹{Number(t.amount).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(t.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal title="Request Withdrawal" isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleWithdraw} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
          {success && <div className="bg-emerald-50 text-emerald-600 text-sm px-3 py-2 rounded-lg">{success}</div>}
          <p className="text-sm text-gray-500">Available Balance: <strong>₹{Number(wallet.balance).toLocaleString('en-IN')}</strong></p>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Amount to Withdraw (₹)</label>
            <input required type="number" max={wallet.balance} value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field" />
          </div>
          <button type="submit" className="btn-primary w-full">Submit Withdrawal Request</button>
        </form>
      </Modal>
    </div>
  );
};

export default MyWallet;
