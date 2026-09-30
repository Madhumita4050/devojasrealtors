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
      <Modal title="Payment Receipt" isOpen={!!receiptModal} onClose={() => setReceiptModal(null)} size="2xl">
        {receiptModal && (
          <div className="receipt-container bg-white text-gray-800">
            {/* Header Section */}
            <div className="flex justify-between items-start border-b-2 border-navy pb-6 mb-6">
              <div className="flex items-center gap-4">
                {receiptModal.companySettings?.company_logo_url ? (
                  <img src={receiptModal.companySettings.company_logo_url} alt="Company Logo" className="w-16 h-16 object-contain" />
                ) : (
                  <div className="w-16 h-16 bg-navy text-white flex items-center justify-center font-bold text-xl rounded">LOGO</div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-navy uppercase tracking-widest">{receiptModal.companySettings?.company_name || 'DEVOJAS REALTORS'}</h1>
                  <p className="text-xs text-gray-500 mt-1">123, Real Estate Avenue, Business Park, Varanasi, UP</p>
                  <p className="text-xs text-gray-500">Phone: +91 9999000000 | Email: contact@devojas.com</p>
                </div>
              </div>
              <div className="text-right flex flex-col justify-between h-full">
                <div className="bg-navy text-white px-4 py-1 inline-block text-lg font-bold tracking-widest rounded-l-md self-end mb-2">RECEIPT</div>
                <div>
                  <p className="text-sm font-semibold">Receipt No: <span className="text-navy font-mono">REC-2026-{String(receiptModal.id).padStart(4, '0')}</span></p>
                  <p className="text-sm">Date: <span className="font-semibold">{new Date(receiptModal.deal_date || receiptModal.createdAt).toLocaleDateString('en-IN')}</span></p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-6">
              {/* Customer Details */}
              <div>
                <h3 className="text-sm font-bold text-navy border-b border-gray-300 pb-1 mb-3 uppercase tracking-wider">Customer Details</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex"><span className="w-32 text-gray-500">Name:</span> <span className="font-semibold uppercase">{receiptModal.buyer?.name}</span></div>
                  <div className="flex"><span className="w-32 text-gray-500">Client ID:</span> <span className="font-mono">{receiptModal.buyer?.login_id || 'N/A'}</span></div>
                  <div className="flex"><span className="w-32 text-gray-500">Mobile:</span> <span>{receiptModal.buyer?.phone}</span></div>
                  <div className="flex"><span className="w-32 text-gray-500">Email:</span> <span>{receiptModal.buyer?.email || 'N/A'}</span></div>
                  <div className="flex"><span className="w-32 text-gray-500">Address:</span> <span className="truncate">{receiptModal.buyer?.address || 'N/A'}</span></div>
                </div>
              </div>

              {/* Property Details */}
              <div>
                <h3 className="text-sm font-bold text-navy border-b border-gray-300 pb-1 mb-3 uppercase tracking-wider">Property Details</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex"><span className="w-32 text-gray-500">Project / Plot:</span> <span className="font-semibold">{receiptModal.plot?.title}</span></div>
                  <div className="flex"><span className="w-32 text-gray-500">Property Type:</span> <span>{receiptModal.plot?.type || 'Plot'}</span></div>
                  <div className="flex"><span className="w-32 text-gray-500">Location:</span> <span>{receiptModal.plot?.location}</span></div>
                  <div className="flex"><span className="w-32 text-gray-500">Associate:</span> <span>{receiptModal.sellerAssociate?.name || receiptModal.buyerAssociate?.name || '—'}</span></div>
                  <div className="flex"><span className="w-32 text-gray-500">Booking No:</span> <span className="font-mono">BKG-{String(receiptModal.id).padStart(4, '0')}</span></div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <h3 className="text-sm font-bold text-navy border-b border-gray-300 pb-1 mb-3 uppercase tracking-wider">Payment Summary</h3>
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-2 px-4 font-semibold text-gray-700">Particulars</th>
                    <th className="text-right py-2 px-4 font-semibold text-gray-700">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-2 px-4 text-gray-600">Total Property Amount</td>
                    <td className="py-2 px-4 text-right font-medium">₹ {Number(receiptModal.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-gray-600">Previous Amount Paid</td>
                    <td className="py-2 px-4 text-right font-medium">₹ {Number(receiptModal.paid_amount - (receiptModal.payments?.[receiptModal.payments.length-1]?.amount || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="bg-blue-50/50">
                    <td className="py-2 px-4 font-semibold text-navy">This Payment Received</td>
                    <td className="py-2 px-4 text-right font-bold text-navy">₹ {Number(receiptModal.payments?.[receiptModal.payments.length-1]?.amount || receiptModal.paid_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-gray-600">Total Paid Till Date</td>
                    <td className="py-2 px-4 text-right font-medium text-emerald-600">₹ {Number(receiptModal.paid_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="py-2 px-4 font-semibold text-gray-700">Balance Amount</td>
                    <td className="py-2 px-4 text-right font-bold text-red-600">₹ {Number(receiptModal.pending_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-4 pt-12 pb-4 text-center mt-12">
              <div>
                <div className="border-t border-gray-400 w-3/4 mx-auto pt-2">
                  <p className="text-sm font-semibold text-gray-700">Prepared By</p>
                  <p className="text-xs text-gray-500">Accounts Dept.</p>
                </div>
              </div>
              <div>
                <div className="border-t border-gray-400 w-3/4 mx-auto pt-2">
                  <p className="text-sm font-semibold text-gray-700">Authorized Signatory</p>
                  <p className="text-xs text-gray-500">{receiptModal.companySettings?.company_name || 'DEVOJAS REALTORS'}</p>
                </div>
              </div>
              <div>
                <div className="border-t border-gray-400 w-3/4 mx-auto pt-2">
                  <p className="text-sm font-semibold text-gray-700">Customer Signature</p>
                  <p className="text-xs text-gray-500">(Optional)</p>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-gray-400 border-t pt-3 pb-2">
              <p>This is a system generated receipt. Subject to realization of cheque / online transfer.</p>
            </div>

            <style>{`
              @media print {
                body * { visibility: hidden; }
                .receipt-container, .receipt-container * { visibility: visible; }
                .receipt-container { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
                .print\\:hidden { display: none !important; }
              }
            `}</style>
          </div>
        )}
        <div className="p-4 bg-gray-50 border-t flex justify-end print:hidden">
          <button onClick={() => window.print()} className="bg-navy text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-blue-900 transition flex items-center gap-2">
            <Printer size={18} /> Download / Print Receipt
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentsAndReceipts;
