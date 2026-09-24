import React, { useEffect, useState } from 'react';
import { IndianRupee, Printer, Calendar } from 'lucide-react';
import api from '../../api/axios';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';

// Client's own "My Payments" — EMI schedule (month-by-month) + downloadable
// receipt (with company logo). Only shows transactions the client owns.
const MyPayments = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState(null);
  const [emiPlan, setEmiPlan] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/client/my-transactions');
      setTransactions(res.data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const openSchedule = async (tx) => {
    setSelectedTx(tx);
    const res = await api.get(`/client/transactions/${tx.id}/emi`);
    setEmiPlan(res.data.data);
  };

  const openReceipt = async (tx) => {
    const res = await api.get(`/client/transactions/${tx.id}/receipt`);
    setReceipt(res.data.data);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Payments</h1>
        <p className="text-gray-500 text-sm">Track how much you've paid, what's pending, and your monthly EMI schedule</p>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Plot</th>
              <th className="text-left px-4 py-3">Total</th>
              <th className="text-left px-4 py-3">Paid</th>
              <th className="text-left px-4 py-3">Pending</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-10 text-gray-400">No deals yet</td></tr>
            ) : (
              transactions.map((tx) => {
                const pending = parseFloat(tx.amount) - parseFloat(tx.paid_amount || 0);
                return (
                  <tr key={tx.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{tx.plot?.title}</td>
                    <td className="px-4 py-3 font-semibold text-navy">₹{Number(tx.amount).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-emerald-600">₹{Number(tx.paid_amount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-red-500">₹{pending.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3"><Badge status={tx.payment_status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openSchedule(tx)} className="p-1.5 text-navy hover:bg-blue-50 rounded-lg" title="EMI Schedule">
                          <Calendar size={16} />
                        </button>
                        <button onClick={() => openReceipt(tx)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Download Receipt">
                          <IndianRupee size={16} />
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

      {/* EMI Schedule Modal */}
      <Modal title="EMI Schedule" isOpen={!!selectedTx} onClose={() => { setSelectedTx(null); setEmiPlan(null); }}>
        {!emiPlan ? (
          <p className="text-sm text-gray-400 text-center py-6">No EMI plan has been set for this deal yet.</p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center bg-gray-50 rounded-lg p-3">
              <div><p className="text-xs text-gray-400">Down Payment</p><p className="font-bold text-navy">₹{Number(emiPlan.down_payment).toLocaleString('en-IN')}</p></div>
              <div><p className="text-xs text-gray-400">Monthly EMI</p><p className="font-bold text-navy">₹{Number(emiPlan.monthly_amount).toLocaleString('en-IN')}</p></div>
              <div><p className="text-xs text-gray-400">Duration</p><p className="font-bold text-navy">{emiPlan.num_months} months</p></div>
            </div>
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {emiPlan.installments?.sort((a, b) => a.month_number - b.month_number).map((inst) => (
                <div key={inst.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                  <span className="text-gray-600">Month {inst.month_number} — Due {new Date(inst.due_date).toLocaleDateString('en-IN')}</span>
                  <span className="font-medium">₹{Number(inst.amount).toLocaleString('en-IN')}</span>
                  <Badge status={inst.status} />
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Receipt Modal (with company logo, print/PDF) */}
      <Modal title="Payment Receipt" isOpen={!!receipt} onClose={() => setReceipt(null)} size="lg">
        {receipt && (
          <div>
            <div className="space-y-6 text-sm">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  {receipt.companySettings?.company_logo_url && (
                    <img src={receipt.companySettings.company_logo_url} alt="logo" className="w-12 h-12 object-contain" />
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-navy">{receipt.companySettings?.company_name || 'DEVOJAS REALTORS'}</h2>
                    <p className="text-gray-400 text-xs">Payment Receipt</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-semibold">#RCPT-{String(receipt.id).padStart(5, '0')}</p>
                  <p className="text-gray-400 text-xs">{new Date(receipt.deal_date || receipt.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase">Client Details</p>
                  <p className="font-medium">{receipt.buyer?.name}</p>
                  <p className="text-gray-500 text-xs">{receipt.buyer?.phone}</p>
                  {receipt.buyer?.pan_number && <p className="text-gray-500 text-xs">PAN: {receipt.buyer.pan_number}</p>}
                  {receipt.buyer?.aadhar_number && <p className="text-gray-500 text-xs">Aadhar: {receipt.buyer.aadhar_number}</p>}
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase">Plot Details</p>
                  <p className="font-medium">{receipt.plot?.title}</p>
                  <p className="text-gray-500 text-xs">{receipt.plot?.location}</p>
                  <p className="text-gray-500 text-xs">{receipt.plot?.size_sqft} sqft</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 border-y py-3 text-center">
                <div><p className="text-xs text-gray-400">Total</p><p className="font-bold text-navy">₹{Number(receipt.amount).toLocaleString('en-IN')}</p></div>
                <div><p className="text-xs text-gray-400">Paid</p><p className="font-bold text-emerald-600">₹{Number(receipt.paid_amount).toLocaleString('en-IN')}</p></div>
                <div><p className="text-xs text-gray-400">Pending</p><p className="font-bold text-red-500">₹{Number(receipt.pending_amount).toLocaleString('en-IN')}</p></div>
              </div>

              {receipt.payments?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-2">Cash Payment History</p>
                  <div className="space-y-1">
                    {receipt.payments.map((p) => (
                      <div key={p.id} className="flex justify-between text-gray-600">
                        <span>{new Date(p.paid_on).toLocaleDateString('en-IN')} {p.note ? `— ${p.note}` : ''}</span>
                        <span>₹{Number(p.amount).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {receipt.emiPlan?.installments?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-2">EMI Schedule</p>
                  <div className="space-y-1">
                    {receipt.emiPlan.installments.sort((a, b) => a.month_number - b.month_number).map((inst) => (
                      <div key={inst.id} className="flex justify-between text-gray-600">
                        <span>Month {inst.month_number} — {new Date(inst.due_date).toLocaleDateString('en-IN')}</span>
                        <span>₹{Number(inst.amount).toLocaleString('en-IN')} ({inst.status})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-400 text-center pt-4 border-t">
                This is a system-generated receipt from {receipt.companySettings?.company_name || 'DEVOJAS REALTORS'}.
              </p>
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

export default MyPayments;
