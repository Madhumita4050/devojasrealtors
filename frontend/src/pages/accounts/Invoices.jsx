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
    const win = window.open('', '_blank', 'width=900,height=1100');
    win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Official Receipt — ${form.name}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Roboto', Arial, sans-serif; background: #fff; color: #222; font-size: 13px; }
  .page { width: 794px; margin: 0 auto; padding: 40px; background: #fff; position: relative; }
  
  /* ── Header ── */
  .company-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 4px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 25px; }
  .company-logo { height: 75px; object-fit: contain; }
  .company-info { text-align: right; }
  .company-info h1 { font-size: 26px; font-weight: 900; color: #1e3a8a; letter-spacing: 1px; margin-bottom: 4px; }
  .company-info p { font-size: 11px; color: #555; line-height: 1.4; }
  
  .receipt-title { text-align: center; background: #1e3a8a; color: #fff; font-size: 18px; font-weight: 800; padding: 8px 0; letter-spacing: 2px; margin-bottom: 25px; border-radius: 4px; }
  
  /* ── Details Grid ── */
  .grid-2 { display: flex; gap: 20px; margin-bottom: 25px; }
  .box { flex: 1; border: 2px solid #bfdbfe; border-radius: 6px; overflow: hidden; }
  .box-title { background: #eff6ff; color: #1e3a8a; font-weight: 700; padding: 8px 12px; font-size: 12px; border-bottom: 2px solid #bfdbfe; text-transform: uppercase; letter-spacing: 1px; }
  .box-content { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
  .row { display: flex; align-items: flex-end; }
  .label { font-size: 11px; color: #555; font-weight: 600; width: 120px; text-transform: uppercase; }
  .val { flex: 1; font-weight: 700; font-size: 13px; border-bottom: 1px dashed #94a3b8; padding-bottom: 2px; color: #0f172a; }
  
  /* ── Payment Details ── */
  .payment-section { border: 2px solid #1e3a8a; border-radius: 6px; margin-bottom: 25px; overflow: hidden; }
  .payment-title { background: #1e3a8a; color: #fff; font-weight: 700; padding: 8px 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
  .payment-content { padding: 16px; background: #f8fafc; }
  
  .pay-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
  .pay-row:last-child { border-bottom: none; }
  .pay-label { color: #475569; font-weight: 500; }
  .pay-val { font-weight: 800; color: #1e3a8a; font-size: 16px; }
  
  /* ── Signatures ── */
  .sig-area { display: flex; justify-content: space-between; margin-top: 60px; padding: 0 20px; }
  .sig-box { text-align: center; width: 200px; }
  .sig-line { border-bottom: 2px solid #1e293b; height: 40px; margin-bottom: 8px; }
  .sig-text { font-size: 12px; font-weight: 700; color: #334155; text-transform: uppercase; }
  
  /* ── Footer ── */
  .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px; }
  
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { padding: 20px; width: 100%; }
  }
</style>
</head>
<body>
  <div class="page">
    
    <!-- Header -->
    <div class="company-header">
      <img src="${window.location.origin}/logo.png" class="company-logo" alt="Logo" onerror="this.style.display='none'" />
      <div class="company-info">
        <h1>DEVOJAS REALTORS</h1>
        <p>123, Real Estate Avenue, Business Park, Varanasi, UP</p>
        <p>Phone: +91 9999000000 | Email: info@devojasrealtors.in</p>
      </div>
    </div>
    
    <div class="receipt-title">OFFICIAL PAYMENT RECEIPT</div>
    
    <div class="grid-2">
      <!-- Customer Info -->
      <div class="box">
        <div class="box-title">Received From (Customer Details)</div>
        <div class="box-content">
          <div class="row"><div class="label">Name:</div><div class="val">${form.name}</div></div>
          <div class="row"><div class="label">Phone:</div><div class="val">${form.phone}</div></div>
          <div class="row"><div class="label">Address:</div><div class="val">${form.address || '—'}</div></div>
        </div>
      </div>
      
      <!-- Receipt Info -->
      <div class="box">
        <div class="box-title">Receipt Information</div>
        <div class="box-content">
          <div class="row"><div class="label">Receipt No:</div><div class="val">REC-${Math.floor(10000 + Math.random() * 90000)}</div></div>
          <div class="row"><div class="label">Date:</div><div class="val">${new Date().toLocaleDateString('en-IN')}</div></div>
          <div class="row"><div class="label">Generated By:</div><div class="val">Accounts Department</div></div>
        </div>
      </div>
    </div>
    
    <!-- Payment Box -->
    <div class="payment-section">
      <div class="payment-title">Payment Particulars</div>
      <div class="payment-content">
        <div class="pay-row">
          <div class="pay-label">Property Details / Description</div>
          <div class="pay-val" style="font-size:14px;">${form.particulars}</div>
        </div>
        <div class="pay-row">
          <div class="pay-label">Mode of Payment</div>
          <div class="pay-val" style="font-size:14px;">${form.paymentMode}</div>
        </div>
        <div class="pay-row" style="margin-top:10px; padding-top:16px; border-top: 2px dashed #cbd5e1;">
          <div class="pay-label" style="font-size:16px; color:#0f172a; font-weight:700;">Total Amount Received</div>
          <div class="pay-val" style="font-size:22px;">₹ ${Number(form.amount).toLocaleString('en-IN')}</div>
        </div>
      </div>
    </div>
    
    <p style="font-size:11px; color:#64748b; font-style:italic; margin-bottom:40px;">* Sum of Rupees ${Number(form.amount).toLocaleString('en-IN')} only. Subject to realization of cheque/online transfer.</p>
    
    <!-- Signatures -->
    <div class="sig-area">
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-text">Customer Signature</div>
      </div>
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-text">Accounts Department</div>
      </div>
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-text">Authorised Signatory</div>
      </div>
    </div>
    
    <div class="footer">
      This is a computer-generated receipt from Devojas Realtors. Valid only with authorised signature.
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
