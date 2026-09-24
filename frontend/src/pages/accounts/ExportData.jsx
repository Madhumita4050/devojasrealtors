import React, { useState } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import api from '../../api/axios';

// Simple CSV generator — no extra library needed
const downloadCSV = (rows, filename) => {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const ExportData = () => {
  const [loading, setLoading] = useState('');

  const exportTransactions = async () => {
    setLoading('transactions');
    try {
      const res = await api.get('/accounts/export/transactions');
      const rows = res.data.data.map((tx) => ({
        ID: tx.id,
        Plot: tx.plot?.title,
        Location: tx.plot?.location,
        Buyer: tx.buyer?.name,
        Seller: tx.seller?.name,
        Amount: tx.amount,
        Status: tx.status,
        PaymentStatus: tx.payment_status,
        Date: new Date(tx.deal_date || tx.createdAt).toLocaleDateString('en-IN')
      }));
      downloadCSV(rows, `transactions_${Date.now()}.csv`);
    } finally { setLoading(''); }
  };

  const exportWallets = async () => {
    setLoading('wallets');
    try {
      const res = await api.get('/accounts/wallets');
      const rows = res.data.data.map((w) => ({
        User: w.user?.name,
        Email: w.user?.email,
        Role: w.user?.role,
        Balance: w.balance
      }));
      downloadCSV(rows, `wallets_${Date.now()}.csv`);
    } finally { setLoading(''); }
  };

  const exportInvoices = async () => {
    setLoading('invoices');
    try {
      const res = await api.get('/accounts/invoices');
      const rows = res.data.data.map((tx) => ({
        InvoiceID: `INV-${String(tx.id).padStart(5, '0')}`,
        Plot: tx.plot?.title,
        Buyer: tx.buyer?.name,
        Seller: tx.seller?.name,
        Amount: tx.amount,
        Date: new Date(tx.deal_date || tx.createdAt).toLocaleDateString('en-IN')
      }));
      downloadCSV(rows, `invoices_${Date.now()}.csv`);
    } finally { setLoading(''); }
  };

  const exportOptions = [
    { key: 'transactions', label: 'All Transactions', desc: 'Complete transaction history with buyer, seller, amount & status', action: exportTransactions },
    { key: 'wallets', label: 'All Wallets', desc: 'Every user\'s current wallet balance', action: exportWallets },
    { key: 'invoices', label: 'Invoices List', desc: 'Summary of all generated invoices', action: exportInvoices },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Export Data</h1>
        <p className="text-gray-500 text-sm">Download data as CSV for accounting software or offline records</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {exportOptions.map((opt) => (
          <div key={opt.key} className="card space-y-3">
            <div className="w-10 h-10 bg-navy/10 text-navy rounded-lg flex items-center justify-center">
              <FileSpreadsheet size={20} />
            </div>
            <h3 className="font-semibold text-gray-800">{opt.label}</h3>
            <p className="text-xs text-gray-400">{opt.desc}</p>
            <button
              onClick={opt.action}
              disabled={loading === opt.key}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Download size={14} /> {loading === opt.key ? 'Exporting...' : 'Download CSV'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExportData;
