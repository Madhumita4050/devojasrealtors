export default function TermsConditions() {
  return (
    <div className="page-shell pt-24 min-h-screen text-gray-800 pb-16">
      {/* Header Banner */}
      <section className="page-hero text-white py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-brand-navy/80 z-0" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <span className="section-kicker !text-white !bg-white/10 mb-3">
            Legal Agreement
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">Terms & Conditions</h1>
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
              1. Acceptance of Terms
            </h2>
            <p className="text-sm text-gray-600">
              Welcome to Devojas Realtors. By accessing, browsing, or using our website, you agree to comply with and be bound by the following Terms & Conditions. These terms govern our relationship with you regarding our website and services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-navy font-serif mb-3 border-b border-gray-100 pb-2">
              2. Scope of Services
            </h2>
            <p className="text-sm text-gray-600">
              Devojas Realtors Pvt. Ltd. is a registered real estate firm specializing in residential plotting layout developments in Varanasi. We provide information regarding plots available for purchase in Devojas City, Bhandaha Kalan (Kaithi), Varanasi-Ghazipur Road.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-navy font-serif mb-3 border-b border-gray-100 pb-2">
              3. Accuracy of Information
            </h2>
            <p className="text-sm text-gray-600">
              While we endeavor to keep the website information up-to-date and correct, all layout maps, specifications, plot locations, sizes, and pricing details are for informational purposes. Final rates and block distributions will be legally binding only as agreed in the written booking forms and registered sale deeds.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-navy font-serif mb-3 border-b border-gray-100 pb-2">
              4. Plot Bookings & Legality
            </h2>
            <p className="text-sm text-gray-600">
              All properties offered are subject to title check and availability. Any booking request submitted online is processed at our corporate head office in VDA Colony, Badalalpur, Varanasi, under the oversight of our legal compliance cell and our Managing Director, <strong>Piyush Kumar Singh</strong>. The registry of property is subject to full stamp duty payment and immediate mutation as per government revenue norms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-navy font-serif mb-3 border-b border-gray-100 pb-2">
              5. Governing Law
            </h2>
            <p className="text-sm text-gray-600">
              Any dispute arising out of or in connection with the use of our website or property bookings through our channel shall be subject to the exclusive jurisdiction of the competent courts in Varanasi, Uttar Pradesh, India.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-navy font-serif mb-3 border-b border-gray-100 pb-2">
              6. Contact Details & Head Office
            </h2>
            <p className="text-sm text-gray-600">
              If you have any questions or require clarifications regarding these terms, please visit our corporate office at:
            </p>
            <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl text-xs space-y-1 text-gray-700 mt-3">
              <p><strong>Devojas Realtors Pvt. Ltd.</strong></p>
              <p>Address: B29, VDA Colony, Badalalpur, Chandmari, Varanasi - 221002, India</p>
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
