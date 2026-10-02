import React, { useEffect, useState } from 'react';
import { FileText, Plus, Edit2, Trash2, Eye, CheckCircle, XCircle, Clock, Download, X, AlertCircle, ChevronRight, Printer } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  project_name: '', plot_size: '', sector_no: '', plot_no: '',
  rate_per_sqft: '1500', basic_plot_price: '', corner_percent: '', park_facing_percent: '',
  plot_length: '', plot_width: '', check_no: '', upi_id: '', bank_name: '', month: '', referred_id: '',
  payment_plan_type: 'full', total_plot_price: '', payment_mode: '',
  emi_duration_months: '', down_payment_amt: '',
  applicant_name: '', applicant_phone: '', applicant_date: '', applicant_place: ''
};

const statusColor = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-red-100 text-red-800 border-red-200'
};

const StatusIcon = ({ status }) => {
  if (status === 'approved') return <CheckCircle size={14} />;
  if (status === 'rejected') return <XCircle size={14} />;
  return <Clock size={14} />;
};

// ──────────────────────────────────────────────────────────
// PDF PRINT TEMPLATE — Matching the orange/white format
// ──────────────────────────────────────────────────────────
const printPDF = (form) => {
  const win = window.open('', '_blank', 'width=900,height=1100');
  const applicantDate = form.applicant_date ? new Date(form.applicant_date).toLocaleDateString('en-IN') : '___________';

  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Booking Form — ${form.applicant_name || 'Applicant'}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Roboto', Arial, sans-serif; background: #fff; color: #222; font-size: 12px; }
  .page { width: 794px; min-height: 1123px; margin: 0 auto; padding: 28px 32px; background: #fff; position: relative; }

  /* ── Header ── */
  .company-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #1e3a8a; padding-bottom: 14px; margin-bottom: 18px; }
  .company-logo { height: 64px; object-fit: contain; }
  .company-info { text-align: right; }
  .company-info h1 { font-size: 22px; font-weight: 900; color: #1e3a8a; letter-spacing: 0.5px; }
  .company-info p { font-size: 10px; color: #555; margin-top: 2px; }

  /* ── Section header ── */
  .section-title { background: #1e3a8a; color: #fff; font-size: 13px; font-weight: 800; padding: 7px 14px; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 0; }

  /* ── Grid tables ── */
  .form-section { border: 1.5px solid #1e3a8a; margin-bottom: 14px; }
  .form-row { display: flex; align-items: center; border-bottom: 1px solid #bfdbfe; padding: 6px 12px; gap: 8px; flex-wrap: wrap; }
  .form-row:last-child { border-bottom: none; }
  .label { font-size: 11px; color: #555; font-weight: 500; white-space: nowrap; min-width: 130px; }
  .value { font-size: 11.5px; font-weight: 700; color: #222; flex: 1; border-bottom: 1.5px solid #333; min-width: 80px; padding-bottom: 1px; }
  .value-light { font-size: 11px; color: #555; border-bottom: 1.5px dotted #aaa; flex: 1; padding-bottom: 1px; }
  .unit { font-size: 10px; color: #888; margin-left: 4px; }

  /* ── Multi-col row ── */
  .multi-col { display: flex; gap: 0; }
  .col-group { display: flex; align-items: center; gap: 6px; flex: 1; padding: 6px 12px; border-right: 1px solid #bfdbfe; }
  .col-group:last-child { border-right: none; }

  /* ── Note box ── */
  .note-box { background: #eff6ff; border: 1.5px solid #1e3a8a; padding: 8px 12px; margin-bottom: 14px; }
  .note-box p { font-size: 9.5px; color: #555; line-height: 1.5; margin-bottom: 2px; }
  .note-box strong { color: #1e3a8a; }

  /* ── Signature area ── */
  .sig-area { display: flex; flex-direction: column; gap: 14px; margin-bottom: 14px; padding: 10px 16px; }
  .sig-row { display: flex; align-items: flex-end; gap: 8px; }
  .sig-label { font-size: 11px; color: #444; min-width: 100px; font-weight: 500; }
  .sig-line { flex: 1; border-bottom: 1.5px solid #333; margin-bottom: 2px; }
  .sig-box-right { margin-left: auto; text-align: right; font-size: 11px; font-weight: 700; color: #333; }

  /* ── Office use ── */
  .office-section { border: 2.5px solid #1e3a8a; }
  .office-inner { padding: 10px 14px; display: flex; flex-direction: column; gap: 10px; }

  /* ── Footer ── */
  .footer { margin-top: 18px; text-align: center; font-size: 9px; color: #999; border-top: 1px solid #eee; padding-top: 8px; }
  .badge { display: inline-block; background: #1e3a8a; color: #fff; font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 4px; margin-bottom: 10px; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { width: 100%; padding: 16px 18px; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- Company Header -->
  <div class="company-header">
    <img src="${window.location.origin}/logo.png" class="company-logo" alt="Logo" onerror="this.style.display='none'" />
    <div class="company-info">
      <h1>DEVOJAS REALTORS</h1>
      <p>Transforming Dreams into Reality</p>
      <p style="margin-top:4px;font-size:9px;color:#e05a00;">BOOKING APPLICATION FORM</p>
    </div>
  </div>

  <!-- Status Badge -->
  <div style="text-align:center;margin-bottom:14px;">
    <span class="badge">STATUS: ${(form.status || 'PENDING').toUpperCase()}</span>
    ${form.associate?.name ? `<p style="font-size:10px;color:#888;">Submitted by Associate: <strong>${form.associate.name} (${form.associate.login_id || ''})</strong></p>` : ''}
  </div>

  <!-- SECTION 1: PLOT PRICE DETAILS -->
  <div class="form-section">
    <div class="section-title">PLOT PRICE DETAILS</div>

    <div class="form-row">
      <span class="label">Project Name</span>
      <span class="value">${form.project_name || ''}</span>
    </div>

    <div class="multi-col">
      <div class="col-group">
        <span class="label">Plot Dimensions</span>
        <span class="value">${form.plot_length || ''} x ${form.plot_width || ''}</span>
      </div>
      <div class="col-group">
        <span class="label">Plot Size</span>
        <span class="value">${form.plot_size || ''}</span>
        <span class="unit">Sq.ft.</span>
      </div>
      <div class="col-group">
        <span class="label">Sector No.</span>
        <span class="value">${form.sector_no || ''}</span>
      </div>
      <div class="col-group">
        <span class="label">Plot No.</span>
        <span class="value">${form.plot_no || ''}</span>
      </div>
    </div>

    <div class="form-row">
      <span class="label">Rate</span>
      <span class="value">₹${form.rate_per_sqft || ''}</span>
      <span class="unit">Per Sq.ft. (for Latest Rate @ always confirm at Head Office)</span>
    </div>

    <div class="form-row">
      <span class="label">Basic Plot Price Rs.</span>
      <span class="value">₹${form.basic_plot_price || ''}</span>
    </div>

    <div class="multi-col">
      <div class="col-group">
        <span class="label">Corner</span>
        <span class="value">${form.corner_percent || '0'}</span>
        <span class="unit">%</span>
      </div>
      <div class="col-group">
        <span class="label">Park Facing</span>
        <span class="value">${form.park_facing_percent || '0'}</span>
        <span class="unit">%</span>
      </div>
    </div>
  </div>

  <div class="form-section">
    <div class="section-title">OTHER DETAILS</div>
    <div class="multi-col">
      <div class="col-group">
        <span class="label">Bank Name</span>
        <span class="value">${form.bank_name || '—'}</span>
      </div>
      <div class="col-group">
        <span class="label">Check No</span>
        <span class="value">${form.check_no || '—'}</span>
      </div>
    </div>
    <div class="multi-col">
      <div class="col-group">
        <span class="label">UPI ID</span>
        <span class="value">${form.upi_id || '—'}</span>
      </div>
      <div class="col-group">
        <span class="label">Month</span>
        <span class="value">${form.month || '—'}</span>
      </div>
      <div class="col-group">
        <span class="label">Referred ID</span>
        <span class="value">${form.referred_id || '—'}</span>
      </div>
    </div>
  </div>
  <!-- SECTION 2: PAYMENT PLAN OPTION -->
  <div class="form-section">
    <div class="section-title">PAYMENT PLAN OPTION</div>

    <div class="form-row">
      <span class="label" style="font-weight:700;">A. 100% Plot Amount (Full Plot Amount)</span>
      <span style="flex:1;"></span>
      <span class="label">Total Plot Price Rs.</span>
      <span class="value">₹${form.total_plot_price || ''}</span>
    </div>

    <div class="form-row">
      <span class="label" style="font-weight:700;">B. Payment Mode</span>
      <span class="value">${form.payment_mode || ''}</span>
    </div>

    <div class="form-row">
      <span class="label" style="font-weight:700;">C. Down Payment Plan (EMI)</span>
    </div>

    <div class="multi-col">
      <div class="col-group">
        <span class="label">EMI Duration</span>
        <span class="value">${form.emi_duration_months || '—'}</span>
        <span class="unit">Months</span>
      </div>
      <div class="col-group">
        <span class="label">Down Payment Amt. Rs.</span>
        <span class="value">${form.down_payment_amt ? '₹' + form.down_payment_amt : '—'}</span>
      </div>
    </div>
  </div>

  <!-- NOTE BOX -->
  <div class="note-box">
    <p><strong>Note:</strong></p>
    <p>Date of Booking refers to when application for booking is submitted to the developer.</p>
    <p>Service Tax as applicable shall be paid extra in accordance with law</p>
    <p>Other charges (if any) shall be payable by customer as per terms and conditions of booking</p>
    <p>Booking amt. 25%-50% but adjustable when plot purchase at any location once. Valid for One Plot.</p>
    <p>Preferential Location Charges applied.</p>
    <p>If down payment plan opted and EMI is not paid timely, then an additional charges will be applied or plot, ay be cancelled it certain no. of EMI is pending continuously</p>
    <p>For more information &amp; latest terms &amp; conditions for the same, please always contact or visit to our Head Office.</p>
  </div>

  <!-- APPLICANT SIGNATURE -->
  <div class="sig-area" style="border:1.5px solid #bfdbfe;margin-bottom:14px;">
    <div class="sig-row">
      <span class="sig-label">Name of Applicant</span>
      <span class="sig-line">&nbsp;${form.applicant_name || ''}</span>
    </div>
    <div class="sig-row">
      <span class="sig-label">Date</span>
      <span class="sig-line">&nbsp;${applicantDate}</span>
    </div>
    <div class="sig-row">
      <span class="sig-label">Place</span>
      <span class="sig-line">&nbsp;${form.applicant_place || ''}</span>
      <div class="sig-box-right">Signature of the Applicant</div>
    </div>
  </div>

  <!-- FOR OFFICE USE ONLY -->
  <div class="office-section">
    <div class="section-title">FOR OFFICE USE ONLY</div>
    <div class="office-inner">
      <div class="sig-row">
        <span class="sig-label">Name of Applicant</span>
        <span class="sig-line">&nbsp;${form.applicant_name || ''}</span>
      </div>
      <div class="sig-row">
        <span class="sig-label">Date</span>
        <span class="sig-line">&nbsp;${form.approved_at ? new Date(form.approved_at).toLocaleDateString('en-IN') : (form.status === 'approved' ? applicantDate : '')}</span>
      </div>
      <div class="sig-row">
        <span class="sig-label">Place</span>
        <span class="sig-line"></span>
        <div class="sig-box-right">Authorised Signature</div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <p>Devojas Realtors &mdash; Head Office | This is a computer-generated form and requires authorised signature to be valid.</p>
    <p style="margin-top:3px;">Generated on: ${new Date().toLocaleString('en-IN')}</p>
  </div>

</div>
<script>window.onload = function(){ window.print(); }</script>
</body>
</html>`);
  win.document.close();
};

// ──────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────
const BookingForms = ({ isAdmin = false }) => {
  const { user } = useAuth();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [viewForm, setViewForm] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (form.plot_length && form.plot_width) {
      const size = Number(form.plot_length) * Number(form.plot_width);
      const rate = Number(form.rate_per_sqft) || 1500;
      const basic = size * rate;
      const corner = Number(form.corner_percent) || 0;
      const total = basic + (basic * corner / 100);
      
      if (form.plot_size !== size || form.basic_plot_price !== basic || form.total_plot_price !== total) {
        setForm(prev => ({ ...prev, plot_size: size, basic_plot_price: basic, total_plot_price: total }));
      }
    }
  }, [form.plot_length, form.plot_width, form.rate_per_sqft, form.corner_percent]);

  const fetchForms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/booking-forms');
      setForms(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchForms(); }, []);

  const openAdd = () => {
    setEditingForm(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (f) => {
    setEditingForm(f);
    setForm({
      project_name: f.project_name || '',
      plot_size: f.plot_size || '',
      sector_no: f.sector_no || '',
      plot_no: f.plot_no || '',
      rate_per_sqft: f.rate_per_sqft || '',
      basic_plot_price: f.basic_plot_price || '',
      corner_percent: f.corner_percent || '',
      park_facing_percent: f.park_facing_percent || '',
      plot_length: f.plot_length || '',
      plot_width: f.plot_width || '',
      check_no: f.check_no || '',
      upi_id: f.upi_id || '',
      bank_name: f.bank_name || '',
      month: f.month || '',
      referred_id: f.referred_id || '',
      payment_plan_type: f.payment_plan_type || 'full',
      total_plot_price: f.total_plot_price || '',
      payment_mode: f.payment_mode || '',
      emi_duration_months: f.emi_duration_months || '',
      down_payment_amt: f.down_payment_amt || '',
      applicant_name: f.applicant_name || '',
      applicant_phone: f.applicant_phone || '',
      applicant_date: f.applicant_date || '',
      applicant_place: f.applicant_place || ''
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (editingForm) {
        await api.put(`/booking-forms/${editingForm.id}`, form);
      } else {
        await api.post('/booking-forms', form);
      }
      setModalOpen(false);
      fetchForms();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking form?')) return;
    try {
      await api.delete(`/booking-forms/${id}`);
      fetchForms();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    let rejection_reason = '';
    if (status === 'rejected') {
      rejection_reason = window.prompt('Enter rejection reason:');
      if (rejection_reason === null) return;
    }
    try {
      await api.put(`/booking-forms/${id}/status`, { status, rejection_reason });
      fetchForms();
      if (viewForm) {
        const res = await api.get(`/booking-forms/${id}`);
        setViewForm(res.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const f = (v) => v !== undefined && v !== null && v !== '' ? v : '—';

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <FileText size={24} className="text-orange-500" />
            Booking Forms
          </h1>
          <p className="page-subtitle">
            {isAdmin ? 'Review and approve booking forms submitted by associates' : 'Submit and manage client plot booking forms'}
          </p>
        </div>
        <div>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> New Booking Form
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto p-0 border border-slate-200">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Applicant</th>
              <th>Project / Plot</th>
              <th>Total Price</th>
              <th>Payment Mode</th>
              {isAdmin && <th>Associate</th>}
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="text-center py-12 text-slate-400">Loading...</td></tr>
            ) : forms.length === 0 ? (
              <tr><td colSpan="8" className="text-center py-12 text-slate-400">No booking forms found</td></tr>
            ) : forms.map((bf, i) => (
              <tr key={bf.id}>
                <td className="text-slate-500 text-sm">{i + 1}</td>
                <td>
                  <div className="font-semibold text-slate-800">{bf.applicant_name || '—'}</div>
                  <div className="text-xs text-slate-400">{bf.applicant_phone || ''}</div>
                </td>
                <td>
                  <div className="font-medium text-slate-800">{bf.project_name || '—'}</div>
                  <div className="text-xs text-slate-400">Sector {bf.sector_no || '—'} / Plot {bf.plot_no || '—'} · {bf.plot_size || '—'} sqft</div>
                </td>
                <td className="font-bold text-slate-800">₹{Number(bf.total_plot_price || 0).toLocaleString('en-IN')}</td>
                <td className="text-slate-600">{bf.payment_mode || '—'}</td>
                {isAdmin && (
                  <td className="text-slate-600 text-sm">{bf.associate?.name || '—'}<br/><span className="text-xs text-slate-400">{bf.associate?.login_id || ''}</span></td>
                )}
                <td>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${statusColor[bf.status] || statusColor.pending}`}>
                    <StatusIcon status={bf.status} /> {bf.status}
                  </span>
                </td>
                <td>
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setViewForm(bf)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl" title="View">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => printPDF(bf)} className="p-2 text-orange-500 hover:bg-orange-50 rounded-xl" title="Print PDF">
                      <Printer size={16} />
                    </button>
                    {isAdmin && bf.status === 'pending' && (
                      <>
                        <button onClick={() => openEdit(bf)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleStatusUpdate(bf.id, 'approved')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl" title="Approve">
                          <CheckCircle size={16} />
                        </button>
                        <button onClick={() => handleStatusUpdate(bf.id, 'rejected')} className="p-2 text-red-500 hover:bg-red-50 rounded-xl" title="Reject">
                          <XCircle size={16} />
                        </button>
                        <button onClick={() => handleDelete(bf.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                    {!isAdmin && bf.status === 'pending' && (
                      <>
                        <button onClick={() => openEdit(bf)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(bf.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                    {isAdmin && (
                      <button onClick={() => handleDelete(bf.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    )}
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
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-orange-500">
              <h2 className="text-white font-bold text-lg">{editingForm ? 'Edit Booking Form' : 'New Booking Form'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-6 space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                  <AlertCircle size={15} /> {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* PLOT PRICE DETAILS */}
                <div>
                  <div className="bg-orange-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-t-lg">Plot Price Details</div>
                  <div className="border border-orange-200 rounded-b-lg p-4 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Project Name *</label>
                      <input required value={form.project_name} onChange={e => setForm({...form, project_name: e.target.value})} className="input-field" placeholder="e.g. Devojas Green Valley Phase 2" />
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Plot Length *</label>
                        <input required type="number" value={form.plot_length} onChange={e => setForm({...form, plot_length: e.target.value})} className="input-field" placeholder="e.g. 40" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Plot Width *</label>
                        <input required type="number" value={form.plot_width} onChange={e => setForm({...form, plot_width: e.target.value})} className="input-field" placeholder="e.g. 40" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Plot Size (Sq.ft.)</label>
                        <input readOnly value={form.plot_size} className="input-field bg-slate-100" placeholder="Auto calculated" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Sector No. *</label>
                        <input required value={form.sector_no} onChange={e => setForm({...form, sector_no: e.target.value})} className="input-field" placeholder="e.g. A" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Plot No. *</label>
                        <input required value={form.plot_no} onChange={e => setForm({...form, plot_no: e.target.value})} className="input-field" placeholder="e.g. 42" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Rate per Sq.ft. (₹) *</label>
                        <input required type="number" value={form.rate_per_sqft} onChange={e => setForm({...form, rate_per_sqft: e.target.value})} className="input-field" placeholder="e.g. 1500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Basic Plot Price (₹) *</label>
                        <input required type="number" value={form.basic_plot_price} onChange={e => setForm({...form, basic_plot_price: e.target.value})} className="input-field" placeholder="e.g. 1800000" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Corner (%)</label>
                        <input type="number" step="0.01" value={form.corner_percent} onChange={e => setForm({...form, corner_percent: e.target.value})} className="input-field" placeholder="0" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Park Facing (%)</label>
                        <input type="number" step="0.01" value={form.park_facing_percent} onChange={e => setForm({...form, park_facing_percent: e.target.value})} className="input-field" placeholder="0" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* PAYMENT PLAN */}
                <div>
                  <div className="bg-orange-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-t-lg">Payment Plan Option</div>
                  <div className="border border-orange-200 rounded-b-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Plan Type *</label>
                        <select value={form.payment_plan_type} onChange={e => setForm({...form, payment_plan_type: e.target.value})} className="input-field">
                          <option value="full">100% Full Payment</option>
                          <option value="emi">Down Payment + EMI</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Total Plot Price (₹) *</label>
                        <input required type="number" value={form.total_plot_price} onChange={e => setForm({...form, total_plot_price: e.target.value})} className="input-field" placeholder="e.g. 1980000" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Payment Mode *</label>
                      <select required value={form.payment_mode} onChange={e => setForm({...form, payment_mode: e.target.value})} className="input-field">
                        <option value="">Select Payment Mode</option>
                        <option value="Cash">Cash</option>
                        <option value="Cheque">Cheque</option>
                        <option value="NEFT / RTGS">NEFT / RTGS</option>
                        <option value="UPI">UPI</option>
                        <option value="Demand Draft">Demand Draft</option>
                      </select>
                    </div>
                    {form.payment_plan_type === 'emi' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">EMI Duration (Months)</label>
                          <input type="number" value={form.emi_duration_months} onChange={e => setForm({...form, emi_duration_months: e.target.value})} className="input-field" placeholder="e.g. 24" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Down Payment Amount (₹)</label>
                          <input type="number" value={form.down_payment_amt} onChange={e => setForm({...form, down_payment_amt: e.target.value})} className="input-field" placeholder="e.g. 500000" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* OTHER DETAILS */}
                <div>
                  <div className="bg-orange-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-t-lg">Other Details</div>
                  <div className="border border-orange-200 rounded-b-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Bank Name</label>
                        <input value={form.bank_name} onChange={e => setForm({...form, bank_name: e.target.value})} className="input-field" placeholder="Bank Name" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Check No</label>
                        <input value={form.check_no} onChange={e => setForm({...form, check_no: e.target.value})} className="input-field" placeholder="Check No" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">UPI ID</label>
                        <input value={form.upi_id} onChange={e => setForm({...form, upi_id: e.target.value})} className="input-field" placeholder="UPI ID" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Month</label>
                        <input value={form.month} onChange={e => setForm({...form, month: e.target.value})} className="input-field" placeholder="Month" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Referred ID</label>
                        <input value={form.referred_id} onChange={e => setForm({...form, referred_id: e.target.value})} className="input-field" placeholder="Referred ID" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* APPLICANT DETAILS */}
                <div>
                  <div className="bg-orange-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-t-lg">Applicant Details</div>
                  <div className="border border-orange-200 rounded-b-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Name of Applicant *</label>
                        <input required value={form.applicant_name} onChange={e => setForm({...form, applicant_name: e.target.value})} className="input-field" placeholder="Full name" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Applicant Phone *</label>
                        <input required value={form.applicant_phone} onChange={e => setForm({...form, applicant_phone: e.target.value})} className="input-field" placeholder="10-digit mobile" maxLength={10} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Date of Booking *</label>
                        <input required type="date" value={form.applicant_date} onChange={e => setForm({...form, applicant_date: e.target.value})} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Place *</label>
                        <input required value={form.applicant_place} onChange={e => setForm({...form, applicant_place: e.target.value})} className="input-field" placeholder="City / Town" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                    {submitting ? 'Submitting...' : (editingForm ? 'Update Form' : 'Submit Form')}
                    {!submitting && <ChevronRight size={16} />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setViewForm(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 max-h-[92vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-orange-500">
              <h2 className="text-white font-bold text-lg">Booking Form Details</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => printPDF(viewForm)} className="bg-white/20 hover:bg-white/30 text-white rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5">
                  <Printer size={14} /> Print PDF
                </button>
                <button onClick={() => setViewForm(null)} className="text-white/80 hover:text-white"><X size={20} /></button>
              </div>
            </div>
            <div className="overflow-y-auto p-5 space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold border ${statusColor[viewForm.status] || statusColor.pending}`}>
                  <StatusIcon status={viewForm.status} /> {viewForm.status?.toUpperCase()}
                </span>
                {isAdmin && viewForm.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleStatusUpdate(viewForm.id, 'approved')} className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-4 py-1.5 rounded-lg flex items-center gap-1">
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button onClick={() => handleStatusUpdate(viewForm.id, 'rejected')} className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-4 py-1.5 rounded-lg flex items-center gap-1">
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                )}
              </div>

              {/* Details Grid */}
              {[
                { section: 'Plot Price Details', fields: [
                  ['Project Name', viewForm.project_name],
                  ['Plot Size', `${viewForm.plot_size || '—'} Sq.ft.`],
                  ['Sector No.', viewForm.sector_no],
                  ['Plot No.', viewForm.plot_no],
                  ['Rate per Sq.ft.', viewForm.rate_per_sqft ? `₹${viewForm.rate_per_sqft}` : '—'],
                  ['Basic Plot Price', viewForm.basic_plot_price ? `₹${Number(viewForm.basic_plot_price).toLocaleString('en-IN')}` : '—'],
                  ['Corner %', viewForm.corner_percent ? `${viewForm.corner_percent}%` : '0%'],
                  ['Park Facing %', viewForm.park_facing_percent ? `${viewForm.park_facing_percent}%` : '0%'],
                ]},
                { section: 'Payment Plan', fields: [
                  ['Plan Type', viewForm.payment_plan_type === 'emi' ? 'Down Payment + EMI' : '100% Full Payment'],
                  ['Total Plot Price', viewForm.total_plot_price ? `₹${Number(viewForm.total_plot_price).toLocaleString('en-IN')}` : '—'],
                  ['Payment Mode', viewForm.payment_mode],
                  ['Bank Name', viewForm.bank_name],
                  ['Check No', viewForm.check_no],
                  ['UPI ID', viewForm.upi_id],
                  ['Month', viewForm.month],
                  ['Referred ID', viewForm.referred_id],
                  ['Plot Dimensions', `${viewForm.plot_length || '—'} x ${viewForm.plot_width || '—'}`],
                  ['EMI Duration', viewForm.emi_duration_months ? `${viewForm.emi_duration_months} Months` : '—'],
                  ['Down Payment', viewForm.down_payment_amt ? `₹${Number(viewForm.down_payment_amt).toLocaleString('en-IN')}` : '—'],
                ]},
                { section: 'Applicant Details', fields: [
                  ['Name', viewForm.applicant_name],
                  ['Phone', viewForm.applicant_phone],
                  ['Date', viewForm.applicant_date ? new Date(viewForm.applicant_date).toLocaleDateString('en-IN') : '—'],
                  ['Place', viewForm.applicant_place],
                ]},
              ].map(({ section, fields }) => (
                <div key={section}>
                  <div className="bg-orange-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-t-md">{section}</div>
                  <div className="border border-orange-200 rounded-b-md divide-y divide-orange-50">
                    {fields.map(([label, value]) => (
                      <div key={label} className="flex px-3 py-2 text-sm">
                        <span className="text-slate-500 w-36 shrink-0">{label}</span>
                        <span className="font-semibold text-slate-800">{value || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {viewForm.rejection_reason && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                  <strong>Rejection Reason:</strong> {viewForm.rejection_reason}
                </div>
              )}

              {isAdmin && viewForm.associate && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm">
                  <span className="text-slate-500">Submitted by: </span>
                  <span className="font-semibold text-slate-800">{viewForm.associate.name} ({viewForm.associate.login_id})</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForms;
