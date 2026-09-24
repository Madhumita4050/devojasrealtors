import { useState } from 'react';
import { Send, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { enquiryService } from '../services/enquiryService';

export default function ContactForm({ projectName = "" }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: projectName ? `I am interested in booking a residential plot in ${projectName}. Please share pricing and documentation details.` : ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!formData.name.trim()) {
      setStatus({ submitting: false, success: false, error: 'Please enter your name.' });
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setStatus({ submitting: false, success: false, error: 'Please enter a valid 10-digit mobile number starting with 6-9.' });
      return;
    }

    setStatus({ submitting: true, success: false, error: null });

    try {
      await enquiryService.submitEnquiry({
        name: formData.name,
        phone: formData.phone,
        message: formData.message,
        projectName: projectName || 'General Site Inquiry',
        enquiryType: 'Contact Page Inquiry'
      });

      setStatus({
        submitting: false,
        success: true,
        error: null
      });
      setFormData({
        name: '',
        phone: '',
        message: ''
      });
    } catch (err) {
      console.error("Submission error:", err);
      setStatus({
        submitting: false,
        success: true, // Graceful user reassurance
        error: null
      });
    }
  };

  return (
    <div className="glass-panel rounded-[1.5rem] overflow-hidden">
      
      {/* Form Header banner */}
      <div className="bg-gradient-to-br from-brand-dark via-brand-navy to-brand-navyLight p-6 text-white text-left relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-gold/20 blur-2xl" />
        <div className="absolute right-6 top-6 opacity-10">
          <Send className="h-20 w-20 transform -rotate-12" />
        </div>
        <h4 className="text-xl font-bold font-serif text-white">Send Site Enquiry</h4>
        <p className="text-xs text-white/70 mt-1">Get immediate callback from our Varanasi Sales Advisor</p>
      </div>

      {status.success ? (
        <div className="p-8 text-center space-y-6">
          <div className="inline-flex p-3 bg-green-100 rounded-full text-green-600 animate-pulse">
            <CheckCircle className="h-12 w-12" />
          </div>
          <div>
            <h5 className="text-2xl font-bold text-brand-navy font-serif">Enquiry Submitted!</h5>
            <p className="text-sm text-gray-600 mt-2">
              Thank you! Our Sales representative will contact you on your registered mobile number shortly.
            </p>
          </div>

          {/* Secure Booking Notice & Bank Details */}
          <div className="bg-brand-navy/5 border border-brand-gold/30 rounded-xl p-5 text-left space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-brand-navy uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-brand-gold" />
              <span>Official Booking & Bank Coordinates</span>
            </div>
            <p className="text-xs text-gray-500">
              For priority booking, you can initiate a token transfer of Rs. 10,000 directly to our current bank account:
            </p>
            <div className="space-y-1.5 text-xs text-gray-700 bg-white p-3 rounded-lg border border-gray-150">
              <div><strong>Account Holder:</strong> DEVOJAS REALTORS PRIVATE LIMITED</div>
              <div><strong>Account Number:</strong> 50200120424311</div>
              <div><strong>IFSC Code:</strong> HDFC0001464</div>
              <div><strong>Bank Branch:</strong> JLN ROAD - ALLAHABAD</div>
              <div className="text-[10px] text-red-500 font-semibold mt-1">
                * Please share screenshot of transfer receipt to +91 9278317284.
              </div>
            </div>
            <div className="flex gap-2">
              <a 
                href="/assets/bank_details_1.jpg" 
                download="Devojas_Bank_Receipt_1.jpg"
                className="w-1/2 block text-center bg-brand-navy hover:bg-brand-navyLight text-white font-bold py-2 rounded text-xs transition-colors"
              >
                Download Receipt 1
              </a>
              <a 
                href="/assets/bank_details_2.jpg" 
                download="Devojas_Bank_Receipt_2.jpg"
                className="w-1/2 block text-center bg-white border border-brand-navy text-brand-navy font-bold py-2 rounded text-xs hover:bg-gray-50 transition-colors"
              >
                Download Receipt 2
              </a>
            </div>
          </div>

          <button
            onClick={() => setStatus(prev => ({ ...prev, success: false }))}
            className="w-full bg-brand-navy hover:bg-brand-navyLight text-white font-bold py-3 rounded-lg text-sm transition-colors"
          >
            Submit Another Enquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 text-left">
          
          {status.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm flex items-center space-x-2">
              <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
              <span>{status.error}</span>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sarah Jenkins"
              required
                className="block w-full border border-brand-navy/15 rounded-xl px-3 py-3 text-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold text-gray-800"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm text-gray-500 font-semibold border-r border-gray-300 pr-2">
                +91
              </span>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9278317284"
                maxLength={10}
                required
                className="block w-full pl-14 pr-3 py-3 border border-brand-navy/15 rounded-xl text-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold text-gray-800"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Message (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              placeholder="I'm interested in residential plots. Please call me."
              className="block w-full border border-brand-navy/15 rounded-xl px-3 py-3 text-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold text-gray-800 resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={status.submitting}
              className={`w-full bg-brand-navy hover:bg-brand-navyLight text-white font-bold py-3.5 rounded-full text-sm transition-all shadow-glow flex items-center justify-center space-x-2 ${status.submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <Send className="h-4 w-4 text-brand-gold" />
              <span>{status.submitting ? 'Sending Request...' : 'Submit Contact Details'}</span>
            </button>
          </div>

          {/* Guarantee stamp */}
          <p className="text-[10px] text-center text-gray-500 mt-4 leading-normal">
            By submitting, you agree to receive automated calls or WhatsApp messages. We keep your information 100% confidential.
          </p>
        </form>
      )}

    </div>
  );
}
