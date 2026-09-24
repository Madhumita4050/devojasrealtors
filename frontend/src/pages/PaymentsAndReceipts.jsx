import React, { useEffect, useState } from 'react';
import { IndianRupee, FileText, Printer, Calendar, Plus } from 'lucide-react';
import api from '../api/axios';
import Modal from '../components/Modal';
import Badge from '../components/Badge';

// Admin/Accounts-facing page: record cash payments against any deal,
// and generate/print a receipt showing company + client + associate + payment status.
const PaymentsAndReceipts = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payModal, setPayModal] = useState(null);
  const [receiptModal, setReceiptModal] = useState(null);
  const [emiModal, setEmiModal] = useState(null);
  const [emiPlan, setEmiPlan] = useState(null);
  const [emiForm, setEmiForm] = useState({ down_payment: '', num_months: '', start_date: '' });
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openReceipt = async (id) => {
    const res = await api.get(`/transactions/${id}/receipt`);
    setReceiptModal(res.data.data);
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    await api.post(`/transactions/${payModal.id}/payments`, { amount, note });
    setPayModal(null);
    setAmount('');
    setNote('');
    fetchData();
  };

  const openEmi = async (tx) => {
    setEmiModal(tx);
    const res = await api.get(`/transactions/${tx.id}/emi`);
    setEmiPlan(res.data.data);
    setEmiForm({ down_payment: '', num_months: '', start_date: new Date().toISOString().split('T')[0] });
  };

  const handleCreateEmi = async (e) => {
    e.preventDefault();
    const res = await api.post(`/transactions/${emiModal.id}/emi`, emiForm);
    setEmiPlan(res.data.data);
    fetchData();
  };

  const handleMarkInstallmentPaid = async (installmentId) => {
    await api.put(`/installments/${installmentId}/pay`);
    const res = await api.get(`/transactions/${emiModal.id}/emi`);
    setEmiPlan(res.data.data);
    fetchData();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Payments & Receipts</h1>
        <p className="text-gray-500 text-sm">Record cash payments against deals and generate downloadable receipts</p>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Plot</th>
              <th className="text-left px-4 py-3">Buyer</th>
              <th className="text-left px-4 py-3">Total Amount</th>
              <th className="text-left px-4 py-3">Paid</th>
              <th className="text-left px-4 py-3">Pending</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-10 text-gray-400">No deals yet</td></tr>
            ) : (
              transactions.map((tx) => {
                const pending = parseFloat(tx.amount) - parseFloat(tx.paid_amount || 0);
                return (
                  <tr key={tx.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{tx.plot?.title}</td>
                    <td className="px-4 py-3 text-gray-500">{tx.buyer?.name}</td>
                    <td className="px-4 py-3 font-semibold text-navy">₹{Number(tx.amount).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-emerald-600">₹{Number(tx.paid_amount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-red-500">₹{pending.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3"><Badge status={tx.payment_status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {pending > 0 && (
                          <button onClick={() => setPayModal(tx)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Record Payment">
                            <IndianRupee size={16} />
                          </button>
                        )}
                        <button onClick={() => openEmi(tx)} className="p-1.5 text-gold hover:bg-amber-50 rounded-lg" title="EMI Plan">
                          <Calendar size={16} />
                        </button>
                        <button onClick={() => openReceipt(tx.id)} className="p-1.5 text-navy hover:bg-blue-50 rounded-lg" title="View Receipt">
                          <FileText size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Record Payment Modal */}
      <Modal title="Record Cash Payment" isOpen={!!payModal} onClose={() => setPayModal(null)}>
        {payModal && (
          <form onSubmit={handleRecordPayment} className="space-y-4">
            <p className="text-sm text-gray-500">
              Pending: <strong>₹{(parseFloat(payModal.amount) - parseFloat(payModal.paid_amount || 0)).toLocaleString('en-IN')}</strong>
            </p>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Amount Received (₹)</label>
              <input required type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Note (optional)</label>
              <input value={note} onChange={(e) => setNote(e.target.value)} className="input-field" placeholder="e.g. cash received in office" />
            </div>
            <button type="submit" className="btn-primary w-full">Record Payment</button>
          </form>
        )}
      </Modal>

      {/* EMI Plan Modal */}
      <Modal title="EMI Plan" isOpen={!!emiModal} onClose={() => { setEmiModal(null); setEmiPlan(null); }}>
        {emiModal && !emiPlan && (
          <form onSubmit={handleCreateEmi} className="space-y-4">
            <p className="text-sm text-gray-500">
              Deal Amount: <strong>₹{Number(emiModal.amount).toLocaleString('en-IN')}</strong> — split the remaining amount into equal monthly installments.
            </p>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Down Payment (₹)</label>
              <input type="number" value={emiForm.down_payment} onChange={(e) => setEmiForm({ ...emiForm, down_payment: e.target.value })} className="input-field" placeholder="0 if none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Number of Months</label>
              <input required type="number" value={emiForm.num_months} onChange={(e) => setEmiForm({ ...emiForm, num_months: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Start Date</label>
              <input required type="date" value={emiForm.start_date} onChange={(e) => setEmiForm({ ...emiForm, start_date: e.target.value })} className="input-field" />
            </div>
            <button type="submit" className="btn-primary w-full">Generate EMI Schedule</button>
          </form>
        )}

        {emiPlan && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center bg-gray-50 rounded-lg p-3">
              <div><p className="text-xs text-gray-400">Down Payment</p><p className="font-bold text-navy">₹{Number(emiPlan.down_payment).toLocaleString('en-IN')}</p></div>
              <div><p className="text-xs text-gray-400">Monthly EMI</p><p className="font-bold text-navy">₹{Number(emiPlan.monthly_amount).toLocaleString('en-IN')}</p></div>
              <div><p className="text-xs text-gray-400">Duration</p><p className="font-bold text-navy">{emiPlan.num_months} months</p></div>
            </div>
            <div className="space-y-1 max-h-72 overflow-y-auto">
              {emiPlan.installments?.sort((a, b) => a.month_number - b.month_number).map((inst) => (
                <div key={inst.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                  <span className="text-gray-600">Month {inst.month_number} — {new Date(inst.due_date).toLocaleDateString('en-IN')}</span>
                  <span className="font-medium">₹{Number(inst.amount).toLocaleString('en-IN')}</span>
                  {inst.status === 'paid' ? (
                    <Badge status="paid" />
                  ) : (
                    <button onClick={() => handleMarkInstallmentPaid(inst.id)} className="text-xs text-emerald-600 hover:underline">Mark Paid</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Receipt Modal */}
      <Modal title="Receipt" isOpen={!!receiptModal} onClose={() => setReceiptModal(null)} size="lg">
        {receiptModal && (
          <div>
            <div className="space-y-6 text-sm">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  {receiptModal.companySettings?.company_logo_url && (
                    <img src={receiptModal.companySettings.company_logo_url} alt="logo" className="w-12 h-12 object-contain" />
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-navy">{receiptModal.companySettings?.company_name || 'DEVOJAS REALTORS'}</h2>
                    <p className="text-gray-400 text-xs">Payment Receipt</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-semibold">#RCPT-{String(receiptModal.id).padStart(5, '0')}</p>
                  <p className="text-gray-400 text-xs">{new Date(receiptModal.deal_date || receiptModal.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase">Buyer</p>
                  <p className="font-medium">{receiptModal.buyer?.name}</p>
                  <p className="text-gray-500 text-xs">{receiptModal.buyer?.phone}</p>
                  {receiptModal.buyer?.pan_number && <p className="text-gray-500 text-xs">PAN: {receiptModal.buyer.pan_number}</p>}
                  {receiptModal.buyer?.aadhar_number && <p className="text-gray-500 text-xs">Aadhar: {receiptModal.buyer.aadhar_number}</p>}
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase">Associate</p>
                  <p className="font-medium">{receiptModal.sellerAssociate?.name || receiptModal.buyerAssociate?.name || '—'}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase mb-1">Property</p>
                <p className="font-semibold text-gray-800">{receiptModal.plot?.title}</p>
                <p className="text-gray-500 text-xs">{receiptModal.plot?.location}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 border-y py-3 text-center">
                <div>
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="font-bold text-navy">₹{Number(receiptModal.amount).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Paid</p>
                  <p className="font-bold text-emerald-600">₹{Number(receiptModal.paid_amount).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Pending</p>
                  <p className="font-bold text-red-500">₹{Number(receiptModal.pending_amount).toLocaleString('en-IN')}</p>
                </div>
              </div>

              {receiptModal.payments?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-2">Payment History</p>
                  <div className="space-y-1">
                    {receiptModal.payments.map((p) => (
                      <div key={p.id} className="flex justify-between text-gray-600">
                        <span>{new Date(p.paid_on).toLocaleDateString('en-IN')} {p.note ? `— ${p.note}` : ''}</span>
                        <span>₹{Number(p.amount).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {receiptModal.emiPlan?.installments?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-2">EMI Schedule</p>
                  <div className="space-y-1">
                    {receiptModal.emiPlan.installments.sort((a, b) => a.month_number - b.month_number).map((inst) => (
                      <div key={inst.id} className="flex justify-between text-gray-600">
                        <span>Month {inst.month_number} — {new Date(inst.due_date).toLocaleDateString('en-IN')}</span>
                        <span>₹{Number(inst.amount).toLocaleString('en-IN')} ({inst.status})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-400 text-center pt-4 border-t">Cash payment receipt — {receiptModal.companySettings?.company_name || 'DEVOJAS REALTORS'}</p>
            </div>
            <button onClick={() => window.print()} className="btn-primary w-full mt-6 flex items-center justify-center gap-2 print:hidden">
              <Printer size={16} /> Print / Save as PDF
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PaymentsAndReceipts;
