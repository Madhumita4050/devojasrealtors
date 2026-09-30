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
    name: '', phone: '', address: '', project: '', property: '',
    paymentType: 'Booking', amount: '', paymentMode: 'Cash', txNo: '', particulars: ''
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
    setManualForm({ 
      name: '', phone: '', address: '', project: '', property: '',
      paymentType: 'Booking', amount: '', paymentMode: 'Cash', txNo: '', particulars: '' 
    });
  };

  const printManualReceipt = (form) => {
    const win = window.open('', '_blank', 'width=900,height=1100');
    const receiptNo = `REC-${Math.floor(10000 + Math.random() * 90000)}`;
    const date = new Date().toLocaleDateString('en-IN');
    const time = new Date().toLocaleTimeString('en-IN');
    
    // Receipt Template for Customer / Office Copy
    const getReceiptHTML = (copyType) => `
      <div class="receipt-card">
        <div class="copy-badge">${copyType}</div>
        <div class="company-header">
          <img src="${window.location.origin}/logo.png" class="company-logo" alt="Logo" onerror="this.style.display='none'" />
          <div class="company-info">
            <h1>DEVOJAS REALTORS</h1>
            <p>123, Real Estate Avenue, Business Park, Varanasi, UP</p>
            <p>Phone: +91 9999000000 | Email: info@devojasrealtors.in</p>
          </div>
        </div>
        
        <div class="meta-row">
          <div class="meta-item"><span>Receipt No:</span> <strong>${receiptNo}</strong></div>
          <div class="meta-item"><span>Date:</span> <strong>${date} ${time}</strong></div>
        </div>

        <div class="grid-2">
          <div class="box">
            <div class="box-title">Customer Information</div>
            <div class="box-content">
              <div class="row"><div class="label">Name:</div><div class="val">${form.name}</div></div>
              <div class="row"><div class="label">Mobile:</div><div class="val">${form.phone}</div></div>
              <div class="row"><div class="label">Address:</div><div class="val">${form.address || '—'}</div></div>
            </div>
          </div>
          <div class="box">
            <div class="box-title">Property Information</div>
            <div class="box-content">
              <div class="row"><div class="label">Project:</div><div class="val">${form.project || '—'}</div></div>
              <div class="row"><div class="label">Property / Unit:</div><div class="val">${form.property || '—'}</div></div>
              <div class="row"><div class="label">Payment Type:</div><div class="val">${form.paymentType}</div></div>
            </div>
          </div>
        </div>
        
        <div class="payment-section">
          <div class="payment-title">Payment Details</div>
          <div class="payment-content">
            <div class="pay-row">
              <div class="pay-label">Payment Mode</div>
              <div class="pay-val">${form.paymentMode} ${form.txNo ? `(Ref: ${form.txNo})` : ''}</div>
            </div>
            <div class="pay-row">
              <div class="pay-label">Particulars / Note</div>
              <div class="pay-val" style="font-weight:500;">${form.particulars || '—'}</div>
            </div>
            <div class="pay-row amount-row">
              <div class="pay-label">Total Amount Received</div>
              <div class="pay-val text-blue">₹ ${Number(form.amount).toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
            </div>
          </div>
        </div>
        
        <div class="amount-words">
          <strong>Amount in Words:</strong> Rupees ${Number(form.amount).toLocaleString('en-IN')} Only.
        </div>
        
        <div class="sig-area">
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-text">Customer Signature</div>
          </div>
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-text">Cashier / Accounts</div>
          </div>
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-text">Authorised Signatory</div>
          </div>
        </div>
        <div class="footer-note">* Subject to realization of cheque / online transfer. This is a computer generated receipt.</div>
      </div>
    `;

    win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Advanced Receipt — ${form.name}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #e2e8f0; color: #1e293b; font-size: 11px; padding: 20px; display: flex; flex-direction: column; gap: 20px; align-items: center; }
  
  .receipt-card { width: 794px; background: #fff; padding: 30px 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); position: relative; border-top: 6px solid #1e3a8a; }
  .copy-badge { position: absolute; top: 15px; right: 40px; border: 1px solid #1e3a8a; color: #1e3a8a; font-size: 10px; font-weight: 700; padding: 4px 12px; letter-spacing: 1px; text-transform: uppercase; border-radius: 20px; }
  
  .company-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 15px; }
  .company-logo { height: 50px; object-fit: contain; }
  .company-info h1 { font-size: 22px; font-weight: 800; color: #1e3a8a; letter-spacing: 0.5px; }
  .company-info p { font-size: 10px; color: #64748b; margin-top: 2px; }
  
  .meta-row { display: flex; justify-content: space-between; background: #f8fafc; padding: 10px 15px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #e2e8f0; }
  .meta-item { font-size: 11px; color: #475569; }
  .meta-item strong { color: #0f172a; font-size: 12px; margin-left: 4px; }
  
  .grid-2 { display: flex; gap: 20px; margin-bottom: 20px; }
  .box { flex: 1; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; }
  .box-title { background: #f1f5f9; color: #334155; font-weight: 700; padding: 8px 12px; font-size: 11px; border-bottom: 1px solid #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px; }
  .box-content { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
  .row { display: flex; align-items: baseline; }
  .label { font-size: 10px; color: #64748b; font-weight: 600; width: 100px; text-transform: uppercase; }
  .val { flex: 1; font-weight: 600; font-size: 12px; color: #0f172a; border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px; }
  
  .payment-section { border: 1px solid #1e3a8a; border-radius: 6px; overflow: hidden; margin-bottom: 15px; }
  .payment-title { background: #1e3a8a; color: #fff; font-weight: 600; padding: 8px 15px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
  .payment-content { padding: 0 15px; background: #fff; }
  .pay-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
  .pay-row:last-child { border-bottom: none; }
  .pay-label { color: #475569; font-weight: 500; font-size: 12px; }
  .pay-val { font-weight: 700; color: #0f172a; font-size: 13px; text-align: right; }
  .amount-row { border-top: 2px dashed #cbd5e1 !important; padding-top: 15px; margin-top: 5px; }
  .amount-row .pay-label { font-size: 14px; font-weight: 700; color: #0f172a; }
  .text-blue { color: #1e3a8a !important; font-size: 20px !important; }
  
  .amount-words { background: #eff6ff; padding: 10px 15px; border-radius: 4px; border: 1px dashed #bfdbfe; font-size: 11px; color: #1e3a8a; margin-bottom: 40px; }
  
  .sig-area { display: flex; justify-content: space-between; padding: 0 10px; margin-bottom: 20px; }
  .sig-box { text-align: center; width: 160px; }
  .sig-line { border-bottom: 1px solid #475569; height: 30px; margin-bottom: 8px; }
  .sig-text { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; }
  
  .footer-note { text-align: center; font-size: 9px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
  
  @media print {
    body { background: #fff; padding: 0; display: block; }
    .receipt-card { width: 100%; box-shadow: none; border-top: none; padding: 20px; page-break-after: always; }
    .receipt-card:last-child { page-break-after: auto; }
  }
</style>
</head>
<body>
  ${getReceiptHTML('Office Copy')}
  ${getReceiptHTML('Customer Copy')}
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
      <Modal title="Generate Advanced Receipt" isOpen={showManualForm} onClose={() => setShowManualForm(false)}>
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <input required type="text" className="input-field" value={manualForm.name} onChange={e => setManualForm({...manualForm, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No *</label>
              <input required type="text" className="input-field" value={manualForm.phone} onChange={e => setManualForm({...manualForm, phone: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input type="text" className="input-field" value={manualForm.address} onChange={e => setManualForm({...manualForm, address: e.target.value})} />
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <h4 className="text-sm font-bold text-navy mb-3">Property Information</h4>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input type="text" className="input-field" placeholder="e.g. Devojas City" value={manualForm.project} onChange={e => setManualForm({...manualForm, project: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property / Unit</label>
                <input type="text" className="input-field" placeholder="e.g. Plot No. 12" value={manualForm.property} onChange={e => setManualForm({...manualForm, property: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type *</label>
                <select className="input-field" value={manualForm.paymentType} onChange={e => setManualForm({...manualForm, paymentType: e.target.value})}>
                  <option>Booking</option>
                  <option>Installment (EMI)</option>
                  <option>Maintenance</option>
                  <option>Registration</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Particulars / Note</label>
                <input type="text" className="input-field" placeholder="Optional details..." value={manualForm.particulars} onChange={e => setManualForm({...manualForm, particulars: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <h4 className="text-sm font-bold text-navy mb-3">Payment Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode *</label>
                <select className="input-field" value={manualForm.paymentMode} onChange={e => setManualForm({...manualForm, paymentMode: e.target.value})}>
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Bank Transfer (NEFT/RTGS)</option>
                  <option>Cheque</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Txn / Cheque No</label>
                <input type="text" className="input-field" placeholder="If applicable" value={manualForm.txNo} onChange={e => setManualForm({...manualForm, txNo: e.target.value})} />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received (₹) *</label>
              <input required type="number" className="input-field text-lg font-bold text-blue-700" value={manualForm.amount} onChange={e => setManualForm({...manualForm, amount: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
            <Printer size={18} /> Generate Advanced Receipt
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Invoices;
