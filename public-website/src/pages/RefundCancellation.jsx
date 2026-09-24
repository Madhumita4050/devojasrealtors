export default function RefundCancellation() {
  return (
    <div className="page-shell pt-24 min-h-screen text-gray-800 pb-16">
      {/* Header Banner */}
      <section className="page-hero text-white py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-brand-navy/80 z-0" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <span className="section-kicker !text-white !bg-white/10 mb-3">
            Booking Terms
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">Refund & Cancellation Policy</h1>
          <p className="text-xs sm:text-sm text-white/70 mt-2">
            Last Updated: August 2026 | Devojas Realtors Pvt. Ltd.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="glass-panel rounded-[1.5rem] p-6 sm:p-10 space-y-8 text-left leading-relaxed">
          
          <div>
            <h2 className="text-xl font-bold text-brand-navy font-serif mb-3 border-b border-gray-100 pb-2">
              1. Plot Booking & Token Amount
            </h2>
            <p className="text-sm text-gray-600">
              To secure a specific plot layout number within **Devojas City** (Kaithi, Varanasi), a token/booking amount is required. This secures the plot mapping dimensions under the buyer's name for a standard grace period, during which formal sale agreements are executed.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-navy font-serif mb-3 border-b border-gray-100 pb-2">
              2. Cancellation Terms
            </h2>
            <p className="text-sm text-gray-600">
              Buyers have the right to request a booking cancellation within 7 working days from the date of token deposit, provided the stamp duty registry has not yet been processed at the Varanasi registrar office. All cancellation requests must be submitted in writing with original receipts to our VDA Colony corporate office.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-navy font-serif mb-3 border-b border-gray-100 pb-2">
              3. Refund Eligibility & Deductions
            </h2>
            <p className="text-sm text-gray-600">
              Upon approval of the cancellation request by our Managing Director, <strong>Piyush Kumar Singh</strong>, the token booking amount will be processed for refund:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
              <li><strong>Cancellation within 7 days:</strong> 100% refund of the token amount, minus minimal bank/transaction charges.</li>
              <li><strong>Cancellation after 7 days:</strong> The refund will be subject to a 10% administrative deduction fee or adjusted towards another plot layout selection in the township, subject to approval.</li>
              <li><strong>Post-Registry:</strong> Once the stamp registry is signed and legal possession is registered at the Sub-Registrar office, no cancellation or refunds are legally possible.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-navy font-serif mb-3 border-b border-gray-100 pb-2">
              4. Processing Timeline
            </h2>
            <p className="text-sm text-gray-600">
              Eligible refunds are processed via bank transfer or HDFC account clearing within 15 to 20 business days from the approval date of the written cancellation request. Cash refunds are strictly not supported.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-navy font-serif mb-3 border-b border-gray-100 pb-2">
              5. Contact for Refund Requests
            </h2>
            <p className="text-sm text-gray-600">
              For submitting cancellation forms and checking refund status logs, please contact our accounts desk:
            </p>
            <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl text-xs space-y-1 text-gray-700 mt-3">
              <p><strong>Devojas Realtors Pvt. Ltd.</strong></p>
              <p>Corporate Office: B29, VDA Colony, Badalalpur, Chandmari, Varanasi - 221002, India</p>
              <p>Managing Director: Piyush Kumar Singh</p>
              <p>Email: devojasrealtors@gmail.com</p>
              <p>Phone: +91 9278317284</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
