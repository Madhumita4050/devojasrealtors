export default function PrivacyPolicy() {
  return (
    <div className="page-shell pt-24 min-h-screen text-gray-800 pb-16">
      {/* Header Banner */}
      <section className="page-hero text-white py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-brand-navy/80 z-0" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <span className="section-kicker !text-white !bg-white/10 mb-3">
            Data Privacy
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">Privacy Policy</h1>
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
              1. Information We Collect
            </h2>
            <p className="text-sm text-gray-600">
              When you visit our website, submit callback requests, or enquire about residential plots in Devojas City, we collect personal contact information that you voluntarily provide to us. This information includes:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
              <li>Full Name</li>
              <li>Mobile Number / Phone Number</li>
              <li>Preferred Plot Location / Site Visit Schedule Preferences</li>
              <li>Budget and Plot Size Interest</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-navy font-serif mb-3 border-b border-gray-100 pb-2">
              2. How We Use Your Information
            </h2>
            <p className="text-sm text-gray-600">
              The data collected is strictly utilized to process your enquiries, coordinate complimentary site visits to Kaithi (Varanasi), and provide callback services from our sales executives. We do not distribute, sell, or rent your personal contact information to third-party marketing networks.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-navy font-serif mb-3 border-b border-gray-100 pb-2">
              3. No Mobile Application Tracking
            </h2>
            <p className="text-sm text-gray-600">
              Devojas Realtors Pvt. Ltd. operates exclusively via this official website. We do not distribute or support any APK packages or iOS applications for tracking user details. Any mobile permissions are completely bypassed, and your privacy remains protected inside standard browser boundaries.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-navy font-serif mb-3 border-b border-gray-100 pb-2">
              4. Data Protection & Authority
            </h2>
            <p className="text-sm text-gray-600">
              We implement industry-standard secure socket layers (SSL) and database security measures at our server environment. All administrative files are managed at our corporate office under the direct supervision of Managing Director <strong>Piyush Kumar Singh</strong>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-navy font-serif mb-3 border-b border-gray-100 pb-2">
              5. Contact Information
            </h2>
            <p className="text-sm text-gray-600">
              For any concerns regarding your personal data or if you wish to request the deletion of your submitted contact forms, please contact us:
            </p>
            <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl text-xs space-y-1 text-gray-700 mt-3">
              <p><strong>Devojas Realtors Pvt. Ltd.</strong></p>
              <p>Corporate Office: B29, VDA Colony, Badalalpur, Chandmari, Varanasi - 221002, India</p>
              <p>Managing Director: Piyush Kumar Singh</p>
              <p>Email: devojasrealtors@gmail.com</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
