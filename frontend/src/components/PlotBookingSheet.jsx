import React, { useRef } from 'react';
import { Download, Printer, X, Building2 } from 'lucide-react';
import api from '../api/axios';

const PlotBookingSheet = ({ transaction, companySettings, onClose }) => {
  const printRef = useRef(null);

  if (!transaction) return null;

  const plot = transaction.plot || {};
  const buyer = transaction.buyer || {};
  const emiPlan = transaction.emiPlan || null;

  const totalAmount = parseFloat(transaction.amount || plot.price || 0);
  const paidAmount = parseFloat(transaction.paid_amount || 0);
  const pendingAmount = totalAmount - paidAmount;
  const ratePerSqft = plot.size_sqft ? Math.round(totalAmount / plot.size_sqft) : '-';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await api.get(`/client/transactions/${transaction.id}/pdf`, {
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Plot-Booking-${plot.plot_number || transaction.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('PDF download error:', err);
      // Fallback to window.print()
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-auto shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Action Header (Hidden in Print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Building2 className="text-sky-400" size={22} />
            <h3 className="font-bold text-lg">Plot Price & Booking Details Sheet</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition"
            >
              <Printer size={16} /> Print / Save as PDF
            </button>
            <button
              onClick={handleDownloadPdf}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition"
            >
              <Download size={16} /> Download PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Sheet Body */}
        <div className="p-4 sm:p-8 overflow-y-auto max-h-[85vh] print:max-h-none print:p-0 print:overflow-visible">
          {/* Main Sheet Container with Royal Blue Border */}
          <div
            ref={printRef}
            className="border-4 border-[#1E40AF] p-5 sm:p-7 bg-white text-slate-900 text-sm font-sans space-y-4 print:border-4 print:p-6"
            style={{ minHeight: '900px' }}
          >
            {/* Top Company Branding */}
            <div className="bg-[#1E3A8A] text-white p-4 rounded-lg flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase">
                  {companySettings?.company_name || 'DEVOJAS REALTORS'}
                </h1>
                <p className="text-xs text-sky-200 font-medium">
                  {companySettings?.tagline || 'Your Trusted Real Estate Development Partner'}
                </p>
                {companySettings?.company_address && (
                  <p className="text-[11px] text-slate-300 mt-0.5">{companySettings.company_address}</p>
                )}
              </div>
              <div className="text-right text-xs space-y-0.5 hidden sm:block">
                {companySettings?.company_phone && <p>Tel: {companySettings.company_phone}</p>}
                {companySettings?.company_email && <p>Email: {companySettings.company_email}</p>}
                {companySettings?.company_rera && <p className="font-bold text-sky-300">RERA: {companySettings.company_rera}</p>}
              </div>
            </div>

            {/* 1. PLOT PRICE DETAILS BANNER */}
            <div className="space-y-3">
              <div className="bg-[#1E3A8A] text-white px-4 py-2 font-black text-sm tracking-wider uppercase rounded-md shadow-sm">
                PLOT PRICE DETAILS
              </div>

              <div className="space-y-2.5 px-2 text-[13px] sm:text-[14px]">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-bold text-slate-800">Project Name:</span>
                  <span className="font-semibold text-blue-900 border-b-2 border-slate-300 flex-1 min-w-[200px] pb-0.5">
                    {plot.title || 'Devojas City Extension'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">Plot Size:</span>
                    <span className="border-2 border-[#1E40AF] px-3 py-1 font-bold text-blue-900 rounded bg-blue-50/50">
                      {plot.size_sqft || '---'} Sq.ft.
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">Sector No.:</span>
                    <span className="border-2 border-[#1E40AF] px-4 py-1 font-bold text-blue-900 rounded bg-blue-50/50">
                      {plot.block || plot.sector || 'A'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">Plot No.:</span>
                    <span className="border-2 border-[#1E40AF] px-4 py-1 font-bold text-blue-900 rounded bg-blue-50/50">
                      {plot.plot_number || plot.id || '---'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-baseline gap-2 pt-1">
                  <span className="font-bold text-slate-800">Rate :</span>
                  <span className="border-b-2 border-slate-300 px-3 font-semibold text-blue-900 pb-0.5">
                    Rs. {ratePerSqft}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Per Sq.ft. (for Latest Rate @ always confirm at Head Office)</span>
                </div>

                <div className="flex flex-wrap items-baseline gap-2 pt-1">
                  <span className="font-bold text-slate-800">Basic Plot Price Rs.</span>
                  <span className="border-b-2 border-slate-300 px-4 font-extrabold text-blue-900 text-base pb-0.5">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-8 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">Corner</span>
                    <span className="border-2 border-[#1E40AF] px-3 py-0.5 font-bold rounded bg-blue-50/40">
                      {plot.is_corner ? '10' : '0'} %
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">Park Facing</span>
                    <span className="border-2 border-[#1E40AF] px-3 py-0.5 font-bold rounded bg-blue-50/40">
                      {plot.facing === 'park' ? '10' : '0'} %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PAYMENT PLAN OPTION BANNER */}
            <div className="space-y-3 pt-2">
              <div className="bg-[#1E3A8A] text-white px-4 py-2 font-black text-sm tracking-wider uppercase rounded-md shadow-sm">
                PAYMENT PLAN OPTION
              </div>

              <div className="space-y-2.5 px-2 text-[13px] sm:text-[14px]">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-bold text-slate-800">A. 100% Plot Amount (Full Plot Amount)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-800">Total Plot Price Rs.</span>
                    <span className="border-b-2 border-slate-300 font-extrabold text-blue-900 text-base px-3 pb-0.5">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-bold text-slate-800">B. Payment Mode:</span>
                  <span className="border-b-2 border-slate-300 px-3 font-semibold text-blue-900 pb-0.5 flex-1 max-w-sm">
                    {emiPlan ? 'Down Payment + Monthly EMI' : (transaction.payment_mode || 'Bank Transfer / RTGS / Online')}
                  </span>
                </div>

                <div className="space-y-2 pt-1 bg-blue-50/30 p-3 rounded-lg border border-blue-100">
                  <span className="font-bold text-blue-900">C. Down Payment Plan (EMI)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">EMI Duration:</span>
                      <span className="border-2 border-[#1E40AF] px-3 py-0.5 font-bold text-blue-900 rounded bg-white">
                        {emiPlan?.num_months ? `${emiPlan.num_months} Months` : '---'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">Down Payment Amt. Rs.:</span>
                      <span className="border-b-2 border-slate-300 font-bold text-blue-900 px-2 flex-1 pb-0.5">
                        ₹{(emiPlan?.down_payment ? Number(emiPlan.down_payment) : paidAmount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-2 pt-1">
                    <span className="font-semibold text-slate-800">Monthly EMI Installment:</span>
                    <span className="border-b-2 border-slate-300 font-bold text-blue-900 px-3 pb-0.5">
                      {emiPlan?.monthly_amount ? `₹${Number(emiPlan.monthly_amount).toLocaleString('en-IN')} / month` : '---'}
                    </span>
                    <span className="text-xs text-slate-500 font-medium ml-2">
                      (Pending Balance: ₹{pendingAmount.toLocaleString('en-IN')})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. NOTE / TERMS & CONDITIONS */}
            <div className="space-y-2 pt-1">
              <div className="bg-slate-100 border border-slate-200 p-3.5 rounded-lg text-[11px] sm:text-[12px] text-slate-600 space-y-1 leading-relaxed">
                <p className="font-bold text-slate-900 mb-1">Note & Terms of Booking:</p>
                <p>• Date of Booking refers to when application for booking is submitted to the developer.</p>
                <p>• Service Tax / GST as applicable shall be paid extra in accordance with law.</p>
                <p>• Other charges (if any) shall be payable by customer as per terms and conditions of booking.</p>
                <p>• Booking amt. 25%-50% but adjustable when plot purchase at any location once. Valid for One Plot.</p>
                <p>• Preferential Location Charges applied as applicable.</p>
                <p>• If down payment plan opted and EMI is not paid timely, then an additional charges will be applied or plot may be cancelled if certain no. of EMI is pending continuously.</p>
                <p>• For more information & latest terms & conditions for the same, please always contact or visit to our Head Office.</p>
              </div>
            </div>

            {/* 4. APPLICANT SIGNATURE BLOCK */}
            <div className="border border-slate-200 rounded-lg p-4 space-y-2 text-[13px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-800">Name of Applicant:</span>
                    <span className="border-b-2 border-slate-300 font-semibold text-blue-900 flex-1 pb-0.5">
                      {buyer.name || '---'}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-800">Date:</span>
                    <span className="border-b-2 border-slate-300 font-semibold text-blue-900 flex-1 pb-0.5">
                      {new Date(transaction.deal_date || transaction.createdAt || Date.now()).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-800">Place:</span>
                    <span className="border-b-2 border-slate-300 font-semibold text-blue-900 flex-1 pb-0.5">
                      {companySettings?.company_address ? companySettings.company_address.split(',')[0] : 'Head Office'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-end items-end sm:pr-6 pt-4 sm:pt-0">
                  <div className="w-56 border-b-2 border-slate-800 mb-1"></div>
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    Signature of the Applicant
                  </span>
                </div>
              </div>
            </div>

            {/* 5. FOR OFFICE USE ONLY BANNER */}
            <div className="border border-[#1E40AF] rounded-lg overflow-hidden">
              <div className="bg-[#1E3A8A] text-white px-4 py-1.5 font-black text-xs sm:text-sm tracking-wider uppercase">
                FOR OFFICE USE ONLY
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-800">Name of Applicant:</span>
                    <span className="border-b-2 border-slate-300 font-semibold text-blue-900 flex-1 pb-0.5">
                      {buyer.name || '---'}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-800">Date:</span>
                    <span className="border-b-2 border-slate-300 font-semibold text-blue-900 flex-1 pb-0.5">
                      {new Date(transaction.deal_date || transaction.createdAt || Date.now()).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-800">Place:</span>
                    <span className="border-b-2 border-slate-300 font-semibold text-blue-900 flex-1 pb-0.5">
                      Devojas Head Office
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-end items-end sm:pr-6 pt-4 sm:pt-0">
                  <div className="w-56 border-b-2 border-slate-800 mb-1"></div>
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    Authorised Signature
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PlotBookingSheet;
