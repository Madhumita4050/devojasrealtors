import React, { useEffect, useState, useCallback } from 'react';
import {
  IndianRupee, Plus, Edit2, Trash2, Eye, X, AlertCircle, ChevronRight,
  Calculator, User, Calendar, FileText, TrendingUp, Printer
} from 'lucide-react';
import api from '../../api/axios';

const INR = (v) => `₹${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const emptyForm = {
  associate_id: '',
  payment_date: new Date().toISOString().split('T')[0],
  self_business: '',
  team_business: '',
  slab_percent: '',
  tds_percent: '5',
  processing_percent: '2',
  notes: ''
};

const printStatement = (s) => {
  const win = window.open('', '_blank', 'width=900,height=700');
  win.document.write(`<!DOCTYPE html>
<html>
<head>
<title>Payout Statement — ${s.associate?.name || ''}</title>
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
  ${s.notes ? `<p style="font-size:11px;color:#555;margin-bottom:16px;"><strong>Notes:</strong> ${s.notes}</p>` : ''}

  <div class="sig-area">
    <div class="sig-box">
      <div class="sig-line"></div>
      <div class="sig-label">Associate Signature<br/>${s.associate?.name || ''}</div>
    </div>
    <div class="sig-box">
      <div class="sig-line"></div>
      <div class="sig-label">Accounts Department<br/>Devojas Realtors</div>
    </div>
    <div class="sig-box">
      <div class="sig-line"></div>
      <div class="sig-label">Authorised Signature<br/>Director</div>
    </div>
  </div>

  <div class="footer">Devojas Realtors — This is a computer-generated payout statement. For queries contact accounts@devojasrealtors.in</div>
</div>
<script>window.onload = () => window.print();</script>
</body></html>`);
  win.document.close();
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────
const PayoutManagement = () => {
  const [statements, setStatements] = useState([]);
  const [associates, setAssociates] = useState([]);
  const [slabs, setSlabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewStmt, setViewStmt] = useState(null);
  const [editingStmt, setEditingStmt] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [calc, setCalc] = useState({});
  const [matchedSlab, setMatchedSlab] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [stmtsRes, assocsRes] = await Promise.all([
        api.get('/payout-statements'),
        api.get('/payout-statements/associates')
      ]);
      setStatements(stmtsRes.data.data);
      setAssociates(assocsRes.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  // Auto-calculate whenever form fields change
  const recalculate = useCallback((f) => {
    const self = parseFloat(f.self_business) || 0;
    const team = parseFloat(f.team_business) || 0;
    const total = self + team;
    const pct = parseFloat(f.slab_percent) || 0;
    const tds = parseFloat(f.tds_percent) || 0;
    const proc = parseFloat(f.processing_percent) || 0;

    const selfDeposit = +(self * pct / 100).toFixed(2);
    const teamDeposit = +(team * pct / 100).toFixed(2);
    const totalAmount = +(selfDeposit + teamDeposit).toFixed(2);
    const tdsAmount = +(totalAmount * tds / 100).toFixed(2);
    const procAmount = +(totalAmount * proc / 100).toFixed(2);
    const netPayable = +(totalAmount - tdsAmount - procAmount).toFixed(2);

    setCalc({ total, selfDeposit, teamDeposit, totalAmount, tdsAmount, procAmount, netPayable });
  }, []);

  // Auto-lookup slab when total business changes
  const lookupSlab = useCallback(async (self, team) => {
    const total = (parseFloat(self) || 0) + (parseFloat(team) || 0);
    if (total <= 0) { setMatchedSlab(null); return; }
    try {
      const res = await api.get(`/payout-statements/slab-lookup?amount=${total}`);
      const slab = res.data.data;
      setMatchedSlab(slab);
      if (slab) {
        setForm(prev => {
          const updated = { ...prev, slab_percent: String(slab.percentage) };
          recalculate(updated);
          return updated;
        });
      }
    } catch (e) { console.error(e); }
  }, [recalculate]);

  const handleFormChange = (key, value) => {
    setForm(prev => {
      const updated = { ...prev, [key]: value };
      recalculate(updated);
      return updated;
    });
    if (key === 'self_business' || key === 'team_business') {
      const self = key === 'self_business' ? value : form.self_business;
      const team = key === 'team_business' ? value : form.team_business;
      lookupSlab(self, team);
    }
  };

  const openAdd = () => {
    setEditingStmt(null);
    setForm(emptyForm);
    setCalc({});
    setMatchedSlab(null);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditingStmt(s);
    const f = {
      associate_id: String(s.associate_id),
      payment_date: s.payment_date || '',
      self_business: String(s.self_business || ''),
      team_business: String(s.team_business || ''),
      slab_percent: String(s.slab_percent || ''),
      tds_percent: String(s.tds_percent || '10'),
      processing_percent: String(s.processing_percent || '2'),
      notes: s.notes || ''
    };
    setForm(f);
    recalculate(f);
    setMatchedSlab(s.slab || null);
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (editingStmt) {
        await api.put(`/payout-statements/${editingStmt.id}`, form);
      } else {
        await api.post('/payout-statements', form);
      }
      setModalOpen(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payout statement?')) return;
    try { await api.delete(`/payout-statements/${id}`); fetchAll(); }
    catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const Field = ({ label, value, highlight, danger }) => (
    <div className={`flex justify-between items-center px-4 py-2.5 text-sm ${highlight ? 'bg-blue-50 font-bold' : danger ? 'bg-red-50' : 'border-b border-slate-100'}`}>
      <span className="text-slate-500">{label}</span>
      <span className={`font-semibold ${danger ? 'text-red-600' : highlight ? 'text-blue-800 text-base' : 'text-slate-800'}`}>{value}</span>
    </div>
  );

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <IndianRupee size={24} className="text-blue-600" />
            Payout Management
          </h1>
          <p className="page-subtitle">Generate payout statements for associates based on their business & slab</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Payout Statement
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto p-0 border border-slate-200">
        <table className="data-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Associate</th>
              <th>Total Business</th>
              <th>Payment Date</th>
              <th>Self Deposit</th>
              <th>Team Deposit</th>
              <th>Total Amount</th>
              <th>TDS</th>
              <th>Net Payable</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" className="text-center py-12 text-slate-400">Loading...</td></tr>
            ) : statements.length === 0 ? (
              <tr><td colSpan="10" className="text-center py-12 text-slate-400">No payout statements yet. Create one using the button above.</td></tr>
            ) : statements.map((s, i) => (
              <tr key={s.id}>
                <td className="text-slate-500 font-mono">{i + 1}</td>
                <td>
                  <div className="font-semibold text-slate-800">{s.associate?.name || '—'}</div>
                  <div className="text-xs text-blue-600 font-mono">{s.associate?.login_id}</div>
                </td>
                <td className="font-bold text-slate-800">{INR(s.total_business)}</td>
                <td className="text-slate-600">{s.payment_date ? new Date(s.payment_date).toLocaleDateString('en-IN') : '—'}</td>
                <td className="text-emerald-700 font-semibold">{INR(s.self_deposit)}</td>
                <td className="text-sky-700 font-semibold">{INR(s.team_deposit)}</td>
                <td className="font-bold text-slate-800">{INR(s.total_amount)}</td>
                <td className="text-red-600 font-semibold">{INR(s.tds_amount)}</td>
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
                    <button onClick={() => openEdit(s)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl z-10 max-h-[95vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 to-blue-900">
              <div className="flex items-center gap-3">
                <Calculator size={20} className="text-white" />
                <h2 className="text-white font-bold text-lg">{editingStmt ? 'Edit Payout Statement' : 'New Payout Statement'}</h2>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-white/80 hover:text-white"><X size={20} /></button>
            </div>

            <div className="overflow-y-auto p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2 mb-4">
                  <AlertCircle size={15} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* LEFT: INPUT FIELDS */}
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                      <p className="text-blue-800 font-bold text-xs uppercase tracking-wider">Associate & Date</p>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Select Associate *</label>
                        <select required value={form.associate_id} onChange={e => handleFormChange('associate_id', e.target.value)} className="input-field">
                          <option value="">— Choose Associate —</option>
                          {associates.map(a => (
                            <option key={a.id} value={a.id}>{a.name} ({a.login_id})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Payment Date *</label>
                        <input required type="date" value={form.payment_date} onChange={e => handleFormChange('payment_date', e.target.value)} className="input-field" />
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
                      <p className="text-emerald-800 font-bold text-xs uppercase tracking-wider">Business Figures</p>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Self Business (₹) *</label>
                        <input required type="number" step="1" min="0" value={form.self_business} onChange={e => handleFormChange('self_business', e.target.value)} className="input-field" placeholder="e.g. 5000000" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Team Business (₹) *</label>
                        <input required type="number" step="1" min="0" value={form.team_business} onChange={e => handleFormChange('team_business', e.target.value)} className="input-field" placeholder="e.g. 10000000" />
                      </div>

                      {/* Slab auto-detect result */}
                      {matchedSlab && (
                        <div className="bg-white border border-emerald-300 rounded-lg px-3 py-2 flex items-center justify-between text-sm">
                          <span className="text-slate-500">Auto-detected Slab:</span>
                          <span className="font-bold text-emerald-700">Slab {matchedSlab.slab_number} — {matchedSlab.percentage}%</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                      <p className="text-amber-800 font-bold text-xs uppercase tracking-wider">Commission & Deductions</p>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Commission % (Slab %)</label>
                        <input type="number" step="0.1" min="0" value={form.slab_percent} onChange={e => handleFormChange('slab_percent', e.target.value)} className="input-field" placeholder="Auto-filled from slab" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">TDS %</label>
                          <input type="number" step="0.1" min="0" value={form.tds_percent} onChange={e => handleFormChange('tds_percent', e.target.value)} className="input-field" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Processing %</label>
                          <input type="number" step="0.1" min="0" value={form.processing_percent} onChange={e => handleFormChange('processing_percent', e.target.value)} className="input-field" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Notes</label>
                        <textarea value={form.notes} onChange={e => handleFormChange('notes', e.target.value)} className="input-field resize-none" rows={2} placeholder="Optional notes..." />
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: LIVE CALCULATION PREVIEW */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden h-fit sticky top-0">
                    <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-3">
                      <p className="text-white font-bold text-sm flex items-center gap-2"><Calculator size={14} /> Live Calculation Preview</p>
                    </div>
                    <div className="divide-y divide-slate-100">
                      <Field label="Self Business" value={INR(parseFloat(form.self_business)||0)} />
                      <Field label="Team Business" value={INR(parseFloat(form.team_business)||0)} />
                      <Field label="Total Business" value={INR(calc.total)} highlight />
                      <div className="px-4 py-2 bg-slate-100">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Commission @ {form.slab_percent || 0}%</p>
                      </div>
                      <Field label="Self Deposit" value={INR(calc.selfDeposit)} />
                      <Field label="Team Deposit" value={INR(calc.teamDeposit)} />
                      <Field label="Total Amount" value={INR(calc.totalAmount)} highlight />
                      <Field label={`TDS (${form.tds_percent}%)`} value={`- ${INR(calc.tdsAmount)}`} danger />
                      <Field label={`Processing (${form.processing_percent}%)`} value={`- ${INR(calc.procAmount)}`} danger />
                      <div className="bg-blue-700 px-4 py-4">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-100 font-bold text-sm">NET PAYABLE</span>
                          <span className="text-white font-black text-xl">{INR(calc.netPayable)}</span>
                        </div>
                      </div>
                      {matchedSlab?.reward_amount > 0 && (
                        <div className="bg-emerald-50 px-4 py-3 flex justify-between text-sm">
                          <span className="text-emerald-700">🎁 Slab Reward Bonus</span>
                          <span className="font-bold text-emerald-700">{INR(matchedSlab.reward_amount)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex-1 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
                    {submitting ? 'Saving...' : (editingStmt ? 'Update Statement' : 'Create Statement')}
                    {!submitting && <ChevronRight size={16} />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
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
                <p className="font-bold text-blue-900 text-base">{viewStmt.associate?.name}</p>
                <p className="text-blue-600 text-sm font-mono">{viewStmt.associate?.login_id} · {viewStmt.associate?.phone}</p>
                <p className="text-slate-500 text-xs mt-1">Payment Date: {viewStmt.payment_date ? new Date(viewStmt.payment_date).toLocaleDateString('en-IN') : '—'}</p>
                <p className="text-slate-400 text-xs">Slab: {viewStmt.slab?.slab_number ? `Slab ${viewStmt.slab.slab_number}` : '—'} @ {viewStmt.slab_percent}%</p>
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

export default PayoutManagement;
