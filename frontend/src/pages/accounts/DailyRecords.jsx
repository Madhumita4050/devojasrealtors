import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, IndianRupee, ArrowDownCircle, ArrowUpCircle, Printer } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const DailyRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: null, title: '', description: '', type: 'income', amount: '', record_date: new Date().toISOString().split('T')[0]
  });

  const fetchRecords = async () => {
    try {
      const res = await api.get('/daily-records');
      setRecords(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const openModal = (record = null) => {
    if (record) {
      setFormData({
        id: record.id,
        title: record.title,
        description: record.description,
        type: record.type,
        amount: record.amount,
        record_date: record.record_date
      });
      setIsEdit(true);
    } else {
      setFormData({
        id: null, title: '', description: '', type: 'income', amount: '', record_date: new Date().toISOString().split('T')[0]
      });
      setIsEdit(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/daily-records/${formData.id}`, formData);
      } else {
        await api.post('/daily-records', formData);
      }
      setIsModalOpen(false);
      fetchRecords();
    } catch (error) {
      alert('Error saving record: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.delete(`/daily-records/${id}`);
      fetchRecords();
    } catch (error) {
      alert('Error deleting record: ' + (error.response?.data?.message || error.message));
    }
  };

  const printReceipt = (record) => {
    const win = window.open('', '_blank', 'width=900,height=1100');
    const receiptNo = `DR-${String(record.id).padStart(5, '0')}`;
    const date = new Date(record.record_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const generatedAt = new Date().toLocaleString('en-IN');
    const isIncome = record.type === 'income';
    const typeColor = isIncome ? '#059669' : '#dc2626';
    const typeBg = isIncome ? '#f0fdf4' : '#fef2f2';
    const typeLabel = isIncome ? 'INCOME' : 'EXPENSE';

    const copyHtml = (copyType) => `
      <div class="receipt-card">
        <div class="copy-badge">${copyType}</div>
        <div class="header">
          <img src="${window.location.origin}/logo.png" class="logo" alt="Logo" onerror="this.style.display='none'" />
          <div class="company-info">
            <h1>DEVOJAS REALTORS</h1>
            <p>123, Real Estate Avenue, Business Park, Varanasi, UP</p>
            <p>Phone: +91 9999000000 &nbsp;|&nbsp; Email: info@devojasrealtors.in</p>
          </div>
        </div>
        <div class="banner">DAILY RECORD RECEIPT</div>
        <div class="meta-row">
          <div class="meta-item"><span>Receipt No:</span> <strong>${receiptNo}</strong></div>
          <div class="meta-item"><span>Record Date:</span> <strong>${date}</strong></div>
          <div class="meta-item"><span>Generated:</span> <strong>${generatedAt}</strong></div>
        </div>
        <div class="type-badge" style="background:${typeBg}; border-color:${typeColor}; color:${typeColor};">
          ${isIncome ? '&#8595;' : '&#8593;'} ${typeLabel}
        </div>
        <div class="detail-section">
          <div class="detail-title">Transaction Details</div>
          <div class="detail-content">
            <div class="detail-row"><div class="d-label">Title / Narration</div><div class="d-val">${record.title}</div></div>
            ${record.description ? `<div class="detail-row"><div class="d-label">Description</div><div class="d-val">${record.description}</div></div>` : ''}
            <div class="detail-row"><div class="d-label">Record Type</div><div class="d-val" style="color:${typeColor};font-weight:700;">${typeLabel}</div></div>
            <div class="detail-row"><div class="d-label">Recorded By</div><div class="d-val">${record.creator?.name || 'Accounts Department'}</div></div>
          </div>
        </div>
        <div class="amount-box" style="border-color:${typeColor};">
          <div class="amount-label">Total Amount</div>
          <div class="amount-value" style="color:${typeColor};">&#8377; ${Number(record.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="sig-area">
          <div class="sig-box"><div class="sig-line"></div><div class="sig-text">Prepared By</div></div>
          <div class="sig-box"><div class="sig-line"></div><div class="sig-text">Verified By</div></div>
          <div class="sig-box"><div class="sig-line"></div><div class="sig-text">Authorised Signatory</div></div>
        </div>
        <div class="footer-note">This is a computer-generated receipt from Devojas Realtors. Valid only with authorised signature.</div>
      </div>
    `;

    win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Daily Record Receipt — ${receiptNo}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #e2e8f0; color: #1e293b; font-size: 12px; padding: 20px; display: flex; flex-direction: column; gap: 20px; align-items: center; }
  .receipt-card { width: 794px; background: #fff; padding: 32px 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); position: relative; border-top: 6px solid #1e3a8a; }
  .copy-badge { position: absolute; top: 14px; right: 40px; border: 1px solid #1e3a8a; color: #1e3a8a; font-size: 9px; font-weight: 700; padding: 3px 12px; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 20px; }
  .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 16px; }
  .logo { height: 52px; object-fit: contain; }
  .company-info { text-align: right; }
  .company-info h1 { font-size: 22px; font-weight: 800; color: #1e3a8a; }
  .company-info p { font-size: 10px; color: #64748b; margin-top: 3px; }
  .banner { text-align: center; background: #1e3a8a; color: #fff; font-size: 14px; font-weight: 800; padding: 9px 0; letter-spacing: 3px; margin-bottom: 18px; border-radius: 3px; }
  .meta-row { display: flex; justify-content: space-between; background: #f8fafc; padding: 10px 16px; border-radius: 6px; margin-bottom: 18px; border: 1px solid #e2e8f0; }
  .meta-item { font-size: 11px; color: #475569; }
  .meta-item strong { color: #0f172a; margin-left: 4px; }
  .type-badge { display: inline-block; padding: 6px 20px; border-radius: 30px; border: 1.5px solid; font-size: 13px; font-weight: 700; letter-spacing: 1px; margin-bottom: 20px; }
  .detail-section { border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; margin-bottom: 22px; }
  .detail-title { background: #f1f5f9; color: #334155; font-weight: 700; padding: 9px 14px; font-size: 11px; border-bottom: 1px solid #cbd5e1; text-transform: uppercase; }
  .detail-row { display: flex; align-items: baseline; padding: 10px 16px; border-bottom: 1px solid #f8fafc; }
  .detail-row:last-child { border-bottom: none; }
  .d-label { font-size: 11px; color: #64748b; font-weight: 600; width: 160px; text-transform: uppercase; }
  .d-val { flex: 1; font-weight: 600; font-size: 13px; color: #0f172a; }
  .amount-box { border: 2px solid; border-radius: 6px; padding: 18px 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 50px; background: #f8fafc; }
  .amount-label { font-size: 16px; font-weight: 700; color: #0f172a; }
  .amount-value { font-size: 28px; font-weight: 800; }
  .sig-area { display: flex; justify-content: space-between; padding: 0 10px; margin-bottom: 20px; }
  .sig-box { text-align: center; width: 170px; }
  .sig-line { border-bottom: 1px solid #475569; height: 32px; margin-bottom: 8px; }
  .sig-text { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
  .footer-note { text-align: center; font-size: 9px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
  @media print {
    body { background: #fff; padding: 0; display: block; }
    .receipt-card { width: 100%; box-shadow: none; padding: 20px; page-break-after: always; }
    .receipt-card:last-child { page-break-after: auto; }
  }
</style>
</head>
<body>
  ${copyHtml('Office Copy')}
  ${copyHtml('Record Copy')}
  <script>window.onload = function(){ window.print(); }</script>
</body>
</html>`);
    win.document.close();
  };

  // Summary totals
  const totalIncome = records.filter(r => r.type === 'income').reduce((s, r) => s + Number(r.amount), 0);
  const totalExpense = records.filter(r => r.type === 'expense').reduce((s, r) => s + Number(r.amount), 0);

  return (
    <div className="p-6 h-screen overflow-y-auto bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Daily Records</h1>
            <p className="text-gray-500 text-sm">Manage daily income and expenses</p>
          </div>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> New Record
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 uppercase font-semibold">Total Income</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">₹ {totalIncome.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 uppercase font-semibold">Total Expense</p>
            <p className="text-xl font-bold text-red-500 mt-1">₹ {totalExpense.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 uppercase font-semibold">Net Balance</p>
            <p className={`text-xl font-bold mt-1 ${totalIncome - totalExpense >= 0 ? 'text-blue-700' : 'text-red-600'}`}>
              ₹ {(totalIncome - totalExpense).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Created By</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6 flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      {new Date(record.record_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-800">{record.title}</p>
                      {record.description && <p className="text-xs text-gray-500 truncate w-48">{record.description}</p>}
                    </td>
                    <td className="py-4 px-6">
                      {record.type === 'income' ? (
                        <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-medium w-max">
                          <ArrowDownCircle size={12} /> Income
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium w-max">
                          <ArrowUpCircle size={12} /> Expense
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      <span className={record.type === 'income' ? 'text-emerald-700' : 'text-red-600'}>
                        ₹ {Number(record.amount).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-xs">
                      {record.creator?.name || '—'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => printReceipt(record)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                          title="Print Receipt"
                        >
                          <Printer size={16} />
                        </button>
                        <button onClick={() => openModal(record)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(record.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">No records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <Modal
          title={isEdit ? 'Edit Record' : 'New Record'}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Office supplies, Booking advance"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  className="input-field"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  className="input-field"
                  value={formData.record_date}
                  onChange={(e) => setFormData({ ...formData, record_date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="input-field pl-9"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                className="input-field h-24"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add any extra details..."
              ></textarea>
            </div>

            <button type="submit" className="btn-primary w-full mt-4">
              {isEdit ? 'Update Record' : 'Save Record'}
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default DailyRecords;
