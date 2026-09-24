import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, FileText, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-brand-dark text-white pt-16 pb-8 border-t-4 border-brand-gold">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(215,164,59,0.20),transparent_28rem),radial-gradient(circle_at_80%_35%,rgba(30,91,71,0.40),transparent_30rem)]" />
      <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Links & Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Company Brief */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-0.5 rounded">
                <img src="/assets/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
              </div>
              <div>
                <span className="font-bold text-base tracking-wide font-serif">DEVOJAS REALTORS</span>
                <span className="block text-[10px] text-brand-gold uppercase tracking-wider font-semibold">Plots Specialist</span>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              We specialize in offering high-return, verified residential plots in prime locations. Buy your dream plot in Devojas City today and secure your future.
            </p>
            <div className="flex items-center space-x-2 text-brand-gold font-semibold text-sm">
              <ShieldCheck className="h-4 w-4" />
              <span>RERA Approved Projects</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-brand-gold font-bold uppercase tracking-wider text-sm mb-6 pb-2 border-b border-white/10">
              Quick Links
            </h5>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-white/70 hover:text-brand-gold transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/about" className="text-white/70 hover:text-brand-gold transition-colors">About Company</Link>
              </li>
              <li>
                <Link to="/projects" className="text-white/70 hover:text-brand-gold transition-colors">Residential Projects</Link>
              </li>
              <li>
                <Link to="/location" className="text-white/70 hover:text-brand-gold transition-colors">Location Highlights</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-white/70 hover:text-brand-gold transition-colors">Photo Gallery</Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/70 hover:text-brand-gold transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Key Resources */}
          <div>
            <h5 className="text-brand-gold font-bold uppercase tracking-wider text-sm mb-6 pb-2 border-b border-white/10">
              Downloads & Docs
            </h5>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="/assets/devojas_city_layout.pdf" 
                  download="Devojas_City_Layout.pdf"
                  className="flex items-center space-x-2 text-white/70 hover:text-brand-gold transition-colors"
                >
                  <FileText className="h-4 w-4 text-brand-gold" />
                  <span>Download Layout Plan (PDF)</span>
                </a>
              </li>
              <li>
                <a 
                  href="/assets/bank_details_1.jpg" 
                  download="Devojas_HDFC_Details.jpg"
                  className="flex items-center space-x-2 text-white/70 hover:text-brand-gold transition-colors"
                >
                  <FileText className="h-4 w-4 text-brand-gold" />
                  <span>Bank Account details 1 (JPG)</span>
                </a>
              </li>
              <li>
                <a 
                  href="/assets/bank_details_2.jpg" 
                  download="Devojas_Bank_Receipt.jpg"
                  className="flex items-center space-x-2 text-white/70 hover:text-brand-gold transition-colors"
                >
                  <FileText className="h-4 w-4 text-brand-gold" />
                  <span>Bank Account details 2 (JPG)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h5 className="text-brand-gold font-bold uppercase tracking-wider text-sm mb-6 pb-2 border-b border-white/10">
              Corporate Office
            </h5>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <span>B29, VDA Colony, Badalalpur, Chandmari, Varanasi - 221002, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-brand-gold shrink-0" />
                <a href="tel:9278317284" className="hover:text-brand-gold transition-colors">+91 9278317284</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-brand-gold shrink-0" />
                <a href="mailto:devojasrealtors@gmail.com" className="hover:text-brand-gold transition-colors">devojasrealtors@gmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower copyright & policy bar */}
        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-white/50 space-y-4 md:space-y-0">
          <div>
            <p>© {currentYear} Devojas Realtors Pvt. Ltd. All rights reserved.</p>
            <p className="flex items-center mt-1 text-[11px] text-white/40">
              Designed for premium residential plotting &middot; Varanasi &nbsp;
              <Heart className="h-3 w-3 text-brand-gold fill-current" />
            </p>
          </div>
          
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-semibold text-white/60">
            <Link to="/terms-and-conditions" className="hover:text-brand-gold transition-colors">Terms & Conditions</Link>
            <span>&middot;</span>
            <Link to="/privacy-policy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link>
            <span>&middot;</span>
            <Link to="/refund-cancellation-policy" className="hover:text-brand-gold transition-colors">Refund/Cancellation Policy</Link>
            <span>&middot;</span>
            <Link to="/cookies-policy" className="hover:text-brand-gold transition-colors">Cookies Policy</Link>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
