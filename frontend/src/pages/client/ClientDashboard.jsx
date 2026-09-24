import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home, CheckCircle, ShoppingBag, TrendingUp, IndianRupee,
  Plus, Search, AlertCircle, FileText, Download, Printer,
  Calendar, ChevronRight, ShieldCheck
} from 'lucide-react';
import api from '../../api/axios';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import PlotBookingSheet from '../../components/PlotBookingSheet';

const ClientDashboard = () => {
  const [stats, setStats] = useState(null);
  const [purchasedPlots, setPurchasedPlots] = useState([]);
  const [companySettings, setCompanySettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [activeBookingTx, setActiveBookingTx] = useState(null);
  const [activeEmiPlan, setActiveEmiPlan] = useState(null);
  const [activeReceipt, setActiveReceipt] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, txRes, settingsRes] = await Promise.all([
        api.get('/client/dashboard-stats'),
        api.get('/client/my-transactions?type=purchases'),
        api.get('/settings').catch(() => ({ data: { data: null } }))
      ]);

      setStats(statsRes.data.data);
      setCompanySettings(settingsRes.data?.data || null);

      // Only include purchase transactions (where client is buyer)
      const allTx = txRes.data?.data || [];
      setPurchasedPlots(allTx);
    } catch (err) {
      console.error('Error fetching client dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 20000);
    return () => clearInterval(interval);
  }, []);

  const openEmiSchedule = async (tx) => {
    try {
      const res = await api.get(`/client/transactions/${tx.id}/emi`);
      setActiveEmiPlan({ tx, plan: res.data.data });
    } catch (err) {
      console.error(err);
    }
  };

  const openReceipt = async (tx) => {
    try {
      const res = await api.get(`/client/transactions/${tx.id}/receipt`);
      setActiveReceipt(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-24 text-slate-400 text-base">Loading client portal...</div>;
  }

  // Financial aggregates across all purchased plots
  const totalPurchasedValue = purchasedPlots.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);
  const totalPaidAmount = purchasedPlots.reduce((sum, tx) => sum + parseFloat(tx.paid_amount || 0), 0);
  const totalPendingAmount = Math.max(0, totalPurchasedValue - totalPaidAmount);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Client Dashboard</h1>
          <p className="page-subtitle">Welcome back! Track your purchased plots, paid amounts, EMIs, and download documents</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/client/browse" className="btn-primary flex items-center gap-2">
            <Search size={18} /> Browse Marketplace
          </Link>
          <Link to="/client/my-plots/add" className="btn-secondary flex items-center gap-2">
            <Plus size={18} /> List a Plot
          </Link>
        </div>
      </div>

      {/* Pending Payment Alert if any */}
      {totalPendingAmount > 0 && (
        <div className="card bg-gradient-to-r from-blue-50 via-sky-50 to-white border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-base">Active Plot Payment Balance</p>
              <p className="text-sm text-slate-600 mt-0.5">
                Total balance pending across your deals is <span className="font-extrabold text-blue-800">₹{totalPendingAmount.toLocaleString('en-IN')}</span>. You can view month-by-month EMI schedules below.
              </p>
            </div>
          </div>
          <Link to="/client/payments" className="btn-primary text-sm shrink-0">
            View EMI Schedule →
          </Link>
        </div>
      )}

      {/* 1. Core Financial Stat Cards (Requested by User) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Plot Value"
          value={`₹${totalPurchasedValue.toLocaleString('en-IN')}`}
          icon={IndianRupee}
          color="navy"
          subtitle={`${purchasedPlots.length} plot(s) purchased`}
        />
        <StatCard
          title="Total Amount Sent / Paid"
          value={`₹${totalPaidAmount.toLocaleString('en-IN')}`}
          icon={CheckCircle}
          color="green"
          subtitle="Cleared payments"
        />
        <StatCard
          title="Remaining Pending Amount"
          value={`₹${totalPendingAmount.toLocaleString('en-IN')}`}
          icon={AlertCircle}
          color="red"
          subtitle="Balance to clear"
        />
        <StatCard
          title="Purchased Plots"
          value={purchasedPlots.length}
          icon={Home}
          color="blue"
          subtitle="Active investments"
        />
      </div>

      {/* 2. My Purchased Plots & Booking Sheets (Main Feature) */}
      <div className="card border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">My Purchased Plots & Booking Forms</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Click <span className="font-semibold text-blue-700">"Download Booking Sheet"</span> to generate official plot price & booking PDF with payment options
            </p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
            {purchasedPlots.length} Plots Owned
          </span>
        </div>

        {purchasedPlots.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ShoppingBag size={28} />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">No Plots Purchased Yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-4">
              Explore available plots in prime locations, verify pricing details, and secure your property with an easy EMI down payment plan.
            </p>
            <Link to="/client/browse" className="btn-primary">
              <Search size={16} /> Browse Available Plots
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {purchasedPlots.map((tx) => {
              const plot = tx.plot || {};
              const plotPrice = parseFloat(tx.amount || plot.price || 0);
              const paid = parseFloat(tx.paid_amount || 0);
              const pending = Math.max(0, plotPrice - paid);
              const pctPaid = plotPrice > 0 ? Math.min(100, Math.round((paid / plotPrice) * 100)) : 0;

              return (
                <div
                  key={tx.id}
                  className="border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all bg-white"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Plot Info */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="font-extrabold text-slate-900 text-lg">
                          {plot.title || `Plot #${plot.plot_number || tx.id}`}
                        </h3>
                        <Badge status={tx.payment_status} />
                        {plot.block && (
                          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded font-bold">
                            Sector {plot.block}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs sm:text-sm text-slate-500 font-medium">
                        <span>Plot No: <strong className="text-slate-800">{plot.plot_number || tx.plot_id}</strong></span>
                        <span>Size: <strong className="text-slate-800">{plot.size_sqft ? `${plot.size_sqft} Sq.ft.` : 'N/A'}</strong></span>
                        <span>Location: <strong className="text-slate-800">{plot.location || 'Township'}</strong></span>
                        <span>Booking Date: <strong className="text-slate-800">{new Date(tx.deal_date || tx.createdAt).toLocaleDateString('en-IN')}</strong></span>
                      </div>

                      {/* Payment Progress Bar */}
                      <div className="pt-2 max-w-md">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-600">Payment Progress: {pctPaid}%</span>
                          <span className="text-slate-500">₹{paid.toLocaleString('en-IN')} of ₹{plotPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full transition-all duration-500"
                            style={{ width: `${pctPaid}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Financial Summary & Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0">
                      <div className="text-left lg:text-right">
                        <p className="text-xs text-slate-400 font-semibold uppercase">Pending Balance</p>
                        <p className="text-xl font-extrabold text-blue-700">₹{pending.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-emerald-600 font-medium">₹{paid.toLocaleString('en-IN')} Paid</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Download Official Booking / Price Sheet */}
                        <button
                          onClick={() => setActiveBookingTx(tx)}
                          className="btn-primary text-xs sm:text-sm py-2 px-3.5 flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                          title="Open official Plot Price Details & Booking Form"
                        >
                          <FileText size={16} /> Booking Sheet (PDF)
                        </button>

                        <button
                          onClick={() => openEmiSchedule(tx)}
                          className="btn-secondary text-xs sm:text-sm py-2 px-3 flex items-center gap-1.5"
                          title="View monthly EMI breakdown"
                        >
                          <Calendar size={16} /> EMI Schedule
                        </button>

                        <button
                          onClick={() => openReceipt(tx)}
                          className="btn-secondary text-xs sm:text-sm py-2 px-3 flex items-center gap-1.5"
                          title="Download Payment Receipt"
                        >
                          <Download size={16} /> Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Secondary Stats & Helpful Resources */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Plots Listed by Me" value={stats?.totalMyPlots || 0} icon={Home} color="navy" subtitle={`${stats?.pendingMyPlots || 0} pending admin review`} />
        <StatCard title="Plots Sold by Me" value={stats?.soldMyPlots || 0} icon={CheckCircle} color="green" subtitle="Completed sales" />
        <StatCard title="Total Earned (Sales)" value={`₹${Number(stats?.totalEarned || 0).toLocaleString('en-IN')}`} icon={TrendingUp} color="green" subtitle="From sold properties" />
      </div>

      {/* Booking Sheet Modal (Exact Replica from Uploaded Form in Royal Blue) */}
      {activeBookingTx && (
        <PlotBookingSheet
          transaction={activeBookingTx}
          companySettings={companySettings}
          onClose={() => setActiveBookingTx(null)}
        />
      )}

      {/* EMI Schedule Modal */}
      <Modal
        title="Monthly EMI Payment Schedule"
        isOpen={!!activeEmiPlan}
        onClose={() => setActiveEmiPlan(null)}
      >
        {!activeEmiPlan?.plan ? (
          <div className="text-center py-8 text-slate-500">
            <p className="font-semibold text-slate-700">No EMI plan registered for this deal.</p>
            <p className="text-xs text-slate-400 mt-1">This plot purchase was paid upfront or under custom agreement.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center bg-blue-50/60 border border-blue-100 rounded-xl p-4">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Down Payment</p>
                <p className="text-lg font-bold text-blue-900 mt-0.5">₹{Number(activeEmiPlan.plan.down_payment).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Monthly EMI</p>
                <p className="text-lg font-bold text-blue-900 mt-0.5">₹{Number(activeEmiPlan.plan.monthly_amount).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Duration</p>
                <p className="text-lg font-bold text-blue-900 mt-0.5">{activeEmiPlan.plan.num_months} Months</p>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {(activeEmiPlan.plan.installments || []).map((inst, idx) => (
                <div key={inst.id || idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white text-sm">
                  <div>
                    <p className="font-bold text-slate-900">Installment #{inst.installment_number || idx + 1}</p>
                    <p className="text-xs text-slate-400">Due: {inst.due_date ? new Date(inst.due_date).toLocaleDateString('en-IN') : 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-700">₹{Number(inst.amount).toLocaleString('en-IN')}</p>
                    <Badge status={inst.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Payment Receipt Modal */}
      <Modal
        title="Payment Receipt"
        isOpen={!!activeReceipt}
        onClose={() => setActiveReceipt(null)}
      >
        {activeReceipt && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Transaction ID:</span><span className="font-bold font-mono">TXN-{activeReceipt.id}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Plot:</span><span className="font-bold">{activeReceipt.plot?.title}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Total Plot Price:</span><span className="font-bold">₹{Number(activeReceipt.amount).toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Amount Paid:</span><span className="font-bold text-emerald-600">₹{Number(activeReceipt.paid_amount || 0).toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Pending Balance:</span><span className="font-bold text-blue-700">₹{Number(activeReceipt.pending_amount || 0).toLocaleString('en-IN')}</span></div>
            </div>
            <button
              onClick={() => window.print()}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Printer size={16} /> Print Receipt
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ClientDashboard;
