import ContactForm from '../components/ContactForm';
import { MapPin, Phone, Mail, Clock, CreditCard, ShieldCheck, Map } from 'lucide-react';

export default function Contact() {
  return (
    <div className="page-shell pt-24 space-y-16 pb-16">
      
      {/* Title banner */}
      <section className="page-hero py-20">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/80 via-brand-navy/80 to-brand-gold/25" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="section-kicker !text-white !bg-white/10">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif">Contact Us</h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto">
            Reach out to our corporate office at VDA Colony or submit an enquiry to schedule a guided site tour of Devojas City.
          </p>
        </div>
      </section>

      {/* Row 1: Balanced Main Grid containing Office Info & Enquiry Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Office Info card (Takes 6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between glass-panel rounded-[1.5rem] p-6 sm:p-8 space-y-6 text-left">
            <div>
              <h3 className="text-2xl font-bold text-brand-navy font-serif">Office Information</h3>
              <p className="text-xs text-gray-500 mt-1">Visit our sales department or connect via official phone/email lines.</p>
            </div>
            
            <div className="space-y-6 text-sm text-gray-700 py-4">
              <div className="flex items-start space-x-4">
                <div className="bg-brand-navy/5 p-3 rounded-xl border border-brand-navy/10 shrink-0">
                  <MapPin className="h-6 w-6 text-brand-gold" />
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider">Corporate Address</span>
                  <strong className="text-brand-navy text-sm block mt-1">
                    B29, VDA Colony, Badalalpur, Chandmari, Varanasi - 221002
                  </strong>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-brand-navy/5 p-3 rounded-xl border border-brand-navy/10 shrink-0">
                  <Phone className="h-6 w-6 text-brand-gold" />
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider">Phone Lines</span>
                  <a href="tel:9278317284" className="text-brand-navy font-bold text-base block mt-1 hover:underline">
                    +91 9278317284
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-brand-navy/5 p-3 rounded-xl border border-brand-navy/10 shrink-0">
                  <Mail className="h-6 w-6 text-brand-gold" />
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider">Email Support</span>
                  <a href="mailto:devojasrealtors@gmail.com" className="text-brand-navy font-semibold text-sm block mt-1 hover:underline">
                    devojasrealtors@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-brand-navy/5 p-3 rounded-xl border border-brand-navy/10 shrink-0">
                  <Clock className="h-6 w-6 text-brand-gold" />
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider">Business Hours</span>
                  <span className="text-brand-navy font-semibold block mt-1">
                    10:00 AM to 06:30 PM (Sunday Open for Site Visits)
                  </span>
                </div>
              </div>
            </div>

            {/* Verification highlights tag */}
            <div className="bg-brand-gold/10 border border-brand-gold/30 p-4 rounded-xl flex items-center space-x-3">
              <ShieldCheck className="h-5 w-5 text-brand-navy" />
              <span className="text-xs text-brand-navy font-semibold">Verified Corporate Headquarters &middot; Varanasi VDA Colony</span>
            </div>
          </div>

          {/* Contact Enquiry Form Column (Takes 6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <ContactForm />
          </div>

        </div>
      </section>

      {/* Row 2: Full-Width Verified Bank Account Details */}
      <section className="bg-gray-50 py-16 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-2">
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider bg-brand-navy text-white px-3.5 py-1 rounded-full">
              Booking Transfers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-serif">Verified Corporate Banking</h2>
            <p className="text-xs text-gray-500">Secure down payments and priority allocations using our RTGS coordinates.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-xl">
            
            {/* Left Column: Coordinates details (Takes 7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xl font-bold text-brand-navy font-serif flex items-center space-x-2">
                <CreditCard className="h-5.5 w-5.5 text-brand-gold" />
                <span>Verified Bank Account Coordinates</span>
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Make token bookings or registry mutation fees transfers directly to Devojas Realtors Pvt. Ltd. current account coordinates. Always obtain a valid print receipt from our VDA Colony branch.
              </p>

              <div className="border border-gray-150 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-brand-navy p-4 text-white flex justify-between items-center text-xs font-semibold">
                  <span>HDFC BANK CURRENT ACCOUNT</span>
                  <span className="text-brand-gold font-bold">IFSC Certified</span>
                </div>
                
                <div className="p-5 space-y-3 text-xs text-gray-700 bg-gray-50">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-400">Account Holder Name:</span>
                    <span className="font-bold text-brand-navy">DEVOJAS REALTORS PRIVATE LIMITED</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-400">Account Number:</span>
                    <span className="font-mono font-bold text-brand-navy text-sm">50200120424311</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-400">IFSC Code:</span>
                    <span className="font-mono font-bold text-brand-navy">HDFC0001464</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bank Branch:</span>
                    <span className="font-bold text-brand-navy">JLN ROAD - ALLAHABAD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Receipt card maps (Takes 5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block border-b border-gray-100 pb-1">
                Official Account Layout Cards
              </span>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[9px] text-gray-400 font-bold block">Layout Card (1)</span>
                  <a 
                    href="/assets/bank_details_1.jpg" 
                    target="_blank" 
                    rel="noreferrer"
                    className="block rounded-lg overflow-hidden border border-gray-200 shadow hover:scale-102 transition-transform duration-200"
                  >
                    <img src="/assets/bank_details_1.jpg" alt="Devojas Realtors HDFC Bank details card layout" className="w-full h-auto object-cover" />
                  </a>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] text-gray-400 font-bold block">Layout Card (2)</span>
                  <a 
                    href="/assets/bank_details_2.jpg" 
                    target="_blank" 
                    rel="noreferrer"
                    className="block rounded-lg overflow-hidden border border-gray-200 shadow hover:scale-102 transition-transform duration-200"
                  >
                    <img src="/assets/bank_details_2.jpg" alt="Devojas Realtors Bank Coordinates screenshot layout" className="w-full h-auto object-cover" />
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <a 
                  href="/assets/bank_details_1.jpg"
                  download="Devojas_Bank_Coordinates.jpg"
                  className="w-full text-center block bg-brand-navy hover:bg-brand-navyLight text-white font-bold py-2.5 rounded-lg text-xs transition-colors"
                >
                  Download Bank Coordinates Card
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Row 3: Corporate Office Location Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-xl text-left">
          
          <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Map className="h-5 w-5 text-brand-gold" />
              <h3 className="font-serif font-bold text-lg">Corporate Head Office Location</h3>
            </div>
            <span className="text-xs text-brand-gold font-semibold">VDA Colony, Varanasi</span>
          </div>

          <div className="h-[400px] w-full bg-gray-100 relative">
            <iframe 
              title="Devojas Realtors Corporate Office location map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3605.2974415849842!2d82.97334797611099!3d25.36136127760565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2db3db12ba81%3A0xcad031e4e69b0eb2!2sVDA%20Colony%2C%20Badalalpur%2C%20Lamhi%2C%20Varanasi%2C%20Uttar%20Pradesh%20221003!5e0!3m2!1sen!2sin!4v1724248882194!5m2!1sen!2sin" 
              className="w-full h-full border-none"
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          
        </div>
      </section>

    </div>
  );
}
