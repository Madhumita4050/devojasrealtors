export default function CookiesPolicy() {
  return (
    <div className="page-shell pt-24 min-h-screen text-gray-800 pb-16">
      {/* Header Banner */}
      <section className="page-hero text-white py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-brand-navy/80 z-0" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <span className="section-kicker !text-white !bg-white/10 mb-3">
            Preferences & Tracking
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">Cookies Policy</h1>
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
              1. What are Cookies?
            </h2>
            <p className="text-sm text-gray-600">
              Cookies are small text files stored on your computer or mobile device by websites you visit. They are widely used to make websites work more efficiently, improve page load times, and provide analytical data to website administrators.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-navy font-serif mb-3 border-b border-gray-100 pb-2">
              2. How We Use Cookies
            </h2>
            <p className="text-sm text-gray-600">
              Devojas Realtors Pvt. Ltd. uses cookies on our website for:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
              <li><strong>Essential Preferences:</strong> Remembering user input in forms and selectors (e.g. plot size options in the EMI Installment calculator).</li>
              <li><strong>Performance Analytics:</strong> Understanding website traffic logs and page views to enhance layout presentation, loaded via secure browser sessions.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-navy font-serif mb-3 border-b border-gray-100 pb-2">
              3. Third-Party Tracking & Apps
            </h2>
            <p className="text-sm text-gray-600">
              We do not integrate heavy third-party tracking scripts or advertising cookies that follow you across the internet. Our website does not utilize any device fingerprinting or APK/app integrations. All cookie usage is restricted strictly to standard browser sessions.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-navy font-serif mb-3 border-b border-gray-100 pb-2">
              4. Managing Cookies
            </h2>
            <p className="text-sm text-gray-600">
              You can control and manage cookies in your browser settings. You can delete existing cookies and block new ones, though this may disable certain interactive features like the EMI calculator tool or contact submission form memory.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-navy font-serif mb-3 border-b border-gray-100 pb-2">
              5. Queries & Verification
            </h2>
            <p className="text-sm text-gray-600">
              If you have any questions regarding our use of cookies or browser privacy standards, please reach out to our support channel overseen by Managing Director <strong>Piyush Kumar Singh</strong>.
            </p>
            <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl text-xs space-y-1 text-gray-700 mt-3">
              <p><strong>Devojas Realtors Pvt. Ltd.</strong></p>
              <p>Corporate Office: B29, VDA Colony, Badalalpur, Chandmari, Varanasi - 221002, India</p>
              <p>Email: devojasrealtors@gmail.com</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
