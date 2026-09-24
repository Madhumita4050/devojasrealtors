import React, { useEffect, useState } from 'react';
import { Eye, Printer } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const Invoices = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

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

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Invoices & Receipts</h1>
        <p className="text-gray-500 text-sm">Generate and view invoices for completed deals</p>
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
    </div>
  );
};

export default Invoices;
