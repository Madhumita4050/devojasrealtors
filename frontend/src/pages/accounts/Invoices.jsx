import React, { useEffect, useState } from 'react';
import { Eye, Printer, Plus } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const Invoices = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: '', phone: '', address: '', particulars: '', amount: '', paymentMode: 'Cash'
  });

  useEffect(() => {
    api.get('/accounts/invoices')
      .then((res) => setTransactions(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const viewInvoice = async (id) => {
    const res = await api.get(`/accounts/invoices/${id}`);
    setSelected(res.data.data);
  };

  const handlePrint = () => window.print();

  const handleManualSubmit = (e) => {
    e.preventDefault();
    printManualReceipt(manualForm);
    setShowManualForm(false);
    setManualForm({ name: '', phone: '', address: '', particulars: '', amount: '', paymentMode: 'Cash' });
  };

  const printManualReceipt = (form) => {
    const win = window.open('', '_blank', 'width=900,height=600');
    win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Receipt — ${form.name}</title>
<style>
  body { font-family: Arial, sans-serif; margin: 0; padding: 40px; color: #1e293b; }
  .receipt-box { border: 2px solid #1e3a8a; padding: 30px; border-radius: 8px; max-width: 800px; margin: auto; }
  .header { display: flex; justify-content: space-between; border-bottom: 2px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 20px; }
  .logo-text { font-size: 24px; font-weight: 900; color: #1e3a8a; letter-spacing: 2px; }
  .title { background: #1e3a8a; color: white; padding: 4px 16px; font-weight: bold; font-size: 18px; letter-spacing: 2px; border-radius: 4px; }
  .grid { display: flex; justify-content: space-between; margin-bottom: 30px; }
  .box { flex: 1; }
  .box h3 { font-size: 12px; color: #64748b; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 8px; }
  .row { display: flex; margin-bottom: 4px; font-size: 14px; }
  .row span:first-child { width: 100px; color: #64748b; }
  .row span:last-child { font-weight: 600; }
  .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
  .table th { background: #f8fafc; text-align: left; padding: 10px; border: 1px solid #e2e8f0; font-size: 13px; color: #475569; }
  .table td { padding: 10px; border: 1px solid #e2e8f0; font-size: 14px; font-weight: bold; }
  .footer { display: flex; justify-content: space-between; margin-top: 60px; text-align: center; }
  .sig-line { border-top: 1px solid #94a3b8; padding-top: 8px; font-size: 12px; font-weight: bold; width: 200px; }
  @media print { body { padding: 0; } .receipt-box { border: none; } }
</style>
</head>
<body>
  <div class="receipt-box">
    <div class="header">
      <div>
        <div class="logo-text">DEVOJAS REALTORS</div>
        <div style="font-size:11px; color:#64748b; margin-top:4px;">123, Real Estate Avenue, Varanasi</div>
      </div>
      <div style="text-align: right;">
        <div class="title">RECEIPT</div>
        <div style="margin-top:8px; font-size:13px;">Date: <strong>${new Date().toLocaleDateString('en-IN')}</strong></div>
      </div>
    </div>

    <div class="grid">
      <div class="box" style="margin-right:40px;">
        <h3>Received From</h3>
        <div class="row"><span>Name:</span> <span>${form.name}</span></div>
        <div class="row"><span>Phone:</span> <span>${form.phone}</span></div>
        <div class="row"><span>Address:</span> <span>${form.address || '—'}</span></div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Particulars / Description</th>
          <th>Payment Mode</th>
          <th style="text-align: right;">Amount (INR)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${form.particulars}</td>
          <td>${form.paymentMode}</td>
          <td style="text-align: right; color:#1e3a8a;">₹ ${Number(form.amount).toLocaleString('en-IN')}</td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      <div class="sig-line">Prepared By (Accounts)</div>
      <div class="sig-line">Authorised Signatory</div>
      <div class="sig-line">Customer Signature</div>
    </div>
  </div>
  <script>window.onload = function(){ window.print(); }</script>
</body>
</html>`);
    win.document.close();
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Invoices & Receipts</h1>
          <p className="text-gray-500 text-sm">Generate and view invoices for completed deals</p>
        </div>
        <button onClick={() => setShowManualForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Custom Receipt
        </button>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Invoice ID</th>
              <th className="text-left px-4 py-3">Plot</th>
              <th className="text-left px-4 py-3">Buyer</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-right px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-10 text-gray-400">No completed deals yet</td></tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-gray-500">#INV-{String(tx.id).padStart(5, '0')}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{tx.plot?.title}</td>
                  <td className="px-4 py-3 text-gray-500">{tx.buyer?.name}</td>
                  <td className="px-4 py-3 font-semibold text-navy">₹{Number(tx.amount).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(tx.deal_date || tx.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => viewInvoice(tx.id)} className="p-1.5 text-navy hover:bg-blue-50 rounded-lg">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Printable Invoice Modal */}
      <Modal title="Invoice Preview" isOpen={!!selected} onClose={() => setSelected(null)} size="lg">
        {selected && (
          <div>
            <div id="invoice-print-area" className="space-y-6 text-sm">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-navy">DEVOJAS REALTORS</h2>
                  <p className="text-gray-400 text-xs">Official Invoice</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-semibold">#INV-{String(selected.id).padStart(5, '0')}</p>
                  <p className="text-gray-400 text-xs">{new Date(selected.deal_date || selected.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase">Buyer</p>
                  <p className="font-medium">{selected.buyer?.name}</p>
                  <p className="text-gray-500 text-xs">{selected.buyer?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase">Seller</p>
                  <p className="font-medium">{selected.seller?.name}</p>
                  <p className="text-gray-500 text-xs">{selected.seller?.email}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase mb-1">Property</p>
                <p className="font-semibold text-gray-800">{selected.plot?.title}</p>
                <p className="text-gray-500 text-xs">{selected.plot?.location}</p>
              </div>

              <div className="flex items-center justify-between border-y py-3">
                <span className="text-gray-600">Deal Amount</span>
                <span className="text-xl font-bold text-navy">₹{Number(selected.amount).toLocaleString('en-IN')}</span>
              </div>

              {selected.commissions?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-2">Commission Breakdown</p>
                  <div className="space-y-1">
                    {selected.commissions.map((c) => (
                      <div key={c.id} className="flex justify-between text-gray-600">
                        <span className="capitalize">{c.earner?.name} ({c.role_level.replace('_', ' ')})</span>
                        <span>₹{Number(c.amount).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-400 text-center pt-4 border-t">This is a system-generated invoice from DEVOJAS REALTORS.</p>
            </div>

            <button onClick={handlePrint} className="btn-primary w-full mt-6 flex items-center justify-center gap-2 print:hidden">
              <Printer size={16} /> Print / Save as PDF
            </button>
          </div>
        )}
      </Modal>

      {/* Manual Custom Receipt Modal */}
      <Modal title="Generate Custom Receipt" isOpen={showManualForm} onClose={() => setShowManualForm(false)}>
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <input required type="text" className="input-field" value={manualForm.name} onChange={e => setManualForm({...manualForm, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input required type="text" className="input-field" value={manualForm.phone} onChange={e => setManualForm({...manualForm, phone: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input type="text" className="input-field" value={manualForm.address} onChange={e => setManualForm({...manualForm, address: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Particulars / Property Details *</label>
            <input required type="text" className="input-field" placeholder="e.g. Advance booking for Plot 12" value={manualForm.particulars} onChange={e => setManualForm({...manualForm, particulars: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received (₹) *</label>
              <input required type="number" className="input-field" value={manualForm.amount} onChange={e => setManualForm({...manualForm, amount: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
              <select className="input-field" value={manualForm.paymentMode} onChange={e => setManualForm({...manualForm, paymentMode: e.target.value})}>
                <option>Cash</option>
                <option>Bank Transfer (NEFT/RTGS)</option>
                <option>UPI</option>
                <option>Cheque</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
            <Printer size={18} /> Generate & Print PDF
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Invoices;
