import React, { useEffect, useState } from 'react';
import { IndianRupee, Eye, X, Printer, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../../api/axios';

const INR = (v) => `₹${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const printStatement = (s) => {
  const win = window.open('', '_blank', 'width=900,height=700');
  win.document.write(`<!DOCTYPE html>
<html>
<head>
<title>Payout Statement</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Roboto', sans-serif; background: #fff; color: #222; }
  .page { width: 794px; margin: 0 auto; padding: 32px; }
  .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #1e3a8a; padding-bottom: 16px; margin-bottom: 20px; }
  .company h1 { font-size: 22px; font-weight: 900; color: #1e3a8a; }
  .company p { font-size: 10px; color: #555; }
  .title { text-align: right; }
  .title h2 { font-size: 18px; font-weight: 800; color: #1e3a8a; }
  .title p { font-size: 11px; color: #888; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; background: #f8faff; border: 1px solid #dbeafe; border-radius: 8px; padding: 16px; }
  .info-item label { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
  .info-item p { font-size: 13px; font-weight: 700; color: #1e293b; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  th { background: #1e3a8a; color: #fff; font-size: 11px; padding: 8px 12px; text-align: left; }
  td { padding: 9px 12px; font-size: 12px; border-bottom: 1px solid #e2e8f0; }
  tr:nth-child(even) td { background: #f8faff; }
  .highlight td { background: #dbeafe !important; font-weight: 700; }
  .net-row td { background: #1e3a8a !important; color: #fff; font-weight: 900; font-size: 14px; }
  .label-col { color: #64748b; }
  .amount-col { text-align: right; font-weight: 600; }
  .sig-area { display: flex; justify-content: space-between; margin-top: 40px; }
  .sig-box { text-align: center; }
  .sig-line { width: 200px; border-top: 1.5px solid #333; margin: 0 auto 6px; }
  .sig-label { font-size: 11px; color: #555; }
  .footer { margin-top: 24px; text-align: center; font-size: 9px; color: #999; border-top: 1px solid #eee; padding-top: 8px; }
  @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="company">
      <img src="${window.location.origin}/logo.png" style="height:60px;object-fit:contain;" onerror="this.style.display='none'" />
      <h1>DEVOJAS REALTORS</h1>
      <p>Transforming Dreams into Reality</p>
    </div>
    <div class="title">
      <h2>PAYOUT STATEMENT</h2>
      <p>Payment Date: ${s.payment_date ? new Date(s.payment_date).toLocaleDateString('en-IN') : '—'}</p>
      <p>Generated: ${new Date().toLocaleString('en-IN')}</p>
    </div>
  </div>
  <div class="info-grid">
    <div class="info-item"><label>Associate Name</label><p>${s.associate?.name || '—'}</p></div>
    <div class="info-item"><label>Associate ID</label><p>${s.associate?.login_id || '—'}</p></div>
    <div class="info-item"><label>Mobile</label><p>${s.associate?.phone || '—'}</p></div>
    <div class="info-item"><label>Slab</label><p>Slab ${s.slab?.slab_number || '—'} @ ${s.slab_percent}%</p></div>
  </div>
  <table>
    <thead><tr><th>#</th><th>Description</th><th style="text-align:right">Amount (₹)</th></tr></thead>
    <tbody>
      <tr><td>1</td><td class="label-col">Self Business</td><td class="amount-col">${Number(s.self_business||0).toLocaleString('en-IN')}</td></tr>
      <tr><td>2</td><td class="label-col">Team Business</td><td class="amount-col">${Number(s.team_business||0).toLocaleString('en-IN')}</td></tr>
      <tr class="highlight"><td>3</td><td><strong>Total Business</strong></td><td class="amount-col"><strong>${Number(s.total_business||0).toLocaleString('en-IN')}</strong></td></tr>
      <tr><td>4</td><td class="label-col">Self Deposit (${s.slab_percent}% of Self Business)</td><td class="amount-col">${Number(s.self_deposit||0).toLocaleString('en-IN')}</td></tr>
      <tr><td>5</td><td class="label-col">Team Deposit (${s.slab_percent}% of Team Business)</td><td class="amount-col">${Number(s.team_deposit||0).toLocaleString('en-IN')}</td></tr>
      <tr class="highlight"><td>6</td><td><strong>Total Amount (Commission)</strong></td><td class="amount-col"><strong>${Number(s.total_amount||0).toLocaleString('en-IN')}</strong></td></tr>
      <tr><td>7</td><td class="label-col">TDS Deduction (${s.tds_percent}%)</td><td class="amount-col" style="color:#dc2626">- ${Number(s.tds_amount||0).toLocaleString('en-IN')}</td></tr>
      <tr><td>8</td><td class="label-col">Processing Fee (${s.processing_percent}%)</td><td class="amount-col" style="color:#dc2626">- ${Number(s.processing_amount||0).toLocaleString('en-IN')}</td></tr>
      <tr class="net-row"><td colspan="2">NET PAYABLE AMOUNT</td><td style="text-align:right">₹${Number(s.net_payable||0).toLocaleString('en-IN')}</td></tr>
    </tbody>
  </table>
  ${s.reward_amount > 0 ? `<p style="font-size:11px;color:#065f46;background:#d1fae5;padding:8px 12px;border-radius:6px;margin-bottom:16px;"><strong>🎁 Slab Reward Bonus:</strong> ₹${Number(s.reward_amount).toLocaleString('en-IN')}</p>` : ''}
  <div class="sig-area">
    <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Associate Signature<br/>${s.associate?.name || ''}</div></div>
    <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Accounts Department<br/>Devojas Realtors</div></div>
    <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Authorised Signature<br/>Director</div></div>
  </div>
  <div class="footer">Devojas Realtors — This is a computer-generated payout statement.</div>
</div>
<script>window.onload = () => window.print();</script>
</body></html>`);
  win.document.close();
};

const MyPayoutStatements = () => {
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewStmt, setViewStmt] = useState(null);

  useEffect(() => {
    api.get('/payout-statements')
      .then(r => setStatements(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Summary stats
  const totalNetPayable = statements.reduce((s, r) => s + parseFloat(r.net_payable || 0), 0);
  const totalBusiness = statements.reduce((s, r) => s + parseFloat(r.total_business || 0), 0);
  const totalTds = statements.reduce((s, r) => s + parseFloat(r.tds_amount || 0), 0);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-title flex items-center gap-2">
          <IndianRupee size={24} className="text-blue-600" />
          My Payout Statements
        </h1>
        <p className="page-subtitle">Your commission payouts generated by the accounts department</p>
      </div>

      {/* Summary Cards */}
      {!loading && statements.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <TrendingUp size={22} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Business</p>
              <p className="text-xl font-black text-slate-800">{INR(totalBusiness)}</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <ArrowUpRight size={22} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Net Received</p>
              <p className="text-xl font-black text-emerald-700">{INR(totalNetPayable)}</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
              <ArrowDownRight size={22} className="text-red-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total TDS Deducted</p>
              <p className="text-xl font-black text-red-600">{INR(totalTds)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-x-auto p-0 border border-slate-200">
        <table className="data-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Payment Date</th>
              <th>Total Business</th>
              <th>Self Deposit</th>
              <th>Team Deposit</th>
              <th>Total Amount</th>
              <th>TDS</th>
              <th>Processing</th>
              <th>Net Payable</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" className="text-center py-12 text-slate-400">Loading...</td></tr>
            ) : statements.length === 0 ? (
              <tr><td colSpan="10" className="text-center py-12 text-slate-400">No payout statements yet. The accounts department will add them when processed.</td></tr>
            ) : statements.map((s, i) => (
              <tr key={s.id}>
                <td className="text-slate-500 font-mono text-sm">{i + 1}</td>
                <td className="text-slate-700">{s.payment_date ? new Date(s.payment_date).toLocaleDateString('en-IN') : '—'}</td>
                <td className="font-bold text-slate-800">{INR(s.total_business)}</td>
                <td className="text-emerald-700 font-semibold">{INR(s.self_deposit)}</td>
                <td className="text-sky-700 font-semibold">{INR(s.team_deposit)}</td>
                <td className="font-bold text-slate-800">{INR(s.total_amount)}</td>
                <td className="text-red-600">{INR(s.tds_amount)}</td>
                <td className="text-orange-600">{INR(s.processing_amount)}</td>
                <td>
                  <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">{INR(s.net_payable)}</span>
                </td>
                <td>
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setViewStmt(s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl" title="View Details">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => printStatement(s)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl" title="Print">
                      <Printer size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          {!loading && statements.length > 0 && (
            <tfoot>
              <tr className="bg-blue-50 font-bold">
                <td colSpan="2" className="px-4 py-3 text-blue-800 font-bold">TOTAL</td>
                <td className="px-4 py-3 text-slate-800">{INR(totalBusiness)}</td>
                <td className="px-4 py-3 text-emerald-700">{INR(statements.reduce((s,r)=>s+parseFloat(r.self_deposit||0),0))}</td>
                <td className="px-4 py-3 text-sky-700">{INR(statements.reduce((s,r)=>s+parseFloat(r.team_deposit||0),0))}</td>
                <td className="px-4 py-3 text-slate-800">{INR(statements.reduce((s,r)=>s+parseFloat(r.total_amount||0),0))}</td>
                <td className="px-4 py-3 text-red-600">{INR(totalTds)}</td>
                <td className="px-4 py-3 text-orange-600">{INR(statements.reduce((s,r)=>s+parseFloat(r.processing_amount||0),0))}</td>
                <td className="px-4 py-3 text-blue-800 text-base font-black">{INR(totalNetPayable)}</td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* View Modal */}
      {viewStmt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setViewStmt(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 to-blue-900">
              <h2 className="text-white font-bold text-lg">Payout Details</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => printStatement(viewStmt)} className="bg-white/20 hover:bg-white/30 text-white rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5">
                  <Printer size={14} /> Print
                </button>
                <button onClick={() => setViewStmt(null)} className="text-white/80 hover:text-white"><X size={20} /></button>
              </div>
            </div>
            <div className="overflow-y-auto p-5 space-y-3">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-slate-500 text-xs">Payment Date</p>
                <p className="font-bold text-blue-900">{viewStmt.payment_date ? new Date(viewStmt.payment_date).toLocaleDateString('en-IN') : '—'}</p>
                <p className="text-slate-400 text-xs mt-1">Slab {viewStmt.slab?.slab_number || '—'} @ {viewStmt.slab_percent}%</p>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y">
                {[
                  ['Self Business', INR(viewStmt.self_business)],
                  ['Team Business', INR(viewStmt.team_business)],
                  ['Total Business', INR(viewStmt.total_business), 'highlight'],
                  ['Self Deposit', INR(viewStmt.self_deposit)],
                  ['Team Deposit', INR(viewStmt.team_deposit)],
                  ['Total Amount', INR(viewStmt.total_amount), 'highlight'],
                  [`TDS (${viewStmt.tds_percent}%)`, `- ${INR(viewStmt.tds_amount)}`, 'danger'],
                  [`Processing (${viewStmt.processing_percent}%)`, `- ${INR(viewStmt.processing_amount)}`, 'danger'],
                ].map(([label, value, type]) => (
                  <div key={label} className={`flex justify-between px-4 py-2.5 text-sm ${type === 'highlight' ? 'bg-blue-50 font-bold' : type === 'danger' ? 'bg-red-50' : ''}`}>
                    <span className="text-slate-500">{label}</span>
                    <span className={type === 'danger' ? 'text-red-600 font-semibold' : type === 'highlight' ? 'text-blue-800 font-bold' : 'font-semibold text-slate-800'}>{value}</span>
                  </div>
                ))}
                <div className="bg-blue-700 px-4 py-3 flex justify-between">
                  <span className="text-blue-100 font-bold">NET PAYABLE</span>
                  <span className="text-white font-black text-lg">{INR(viewStmt.net_payable)}</span>
                </div>
              </div>
              {viewStmt.reward_amount > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex justify-between text-sm">
                  <span className="text-emerald-700 font-medium">🎁 Slab Reward Bonus</span>
                  <span className="font-bold text-emerald-700">{INR(viewStmt.reward_amount)}</span>
                </div>
              )}
              {viewStmt.notes && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600">
                  <strong>Notes:</strong> {viewStmt.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPayoutStatements;
