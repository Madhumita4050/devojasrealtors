import ImageGallery from '../components/ImageGallery';
import { Camera, Download, ShieldCheck } from 'lucide-react';

export default function Gallery() {
  return (
    <div className="page-shell pt-24 space-y-12 pb-16">
      
      {/* Title banner */}
      <section className="page-hero py-20">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/80 via-brand-navy/80 to-brand-gold/25" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="section-kicker !text-white !bg-white/10">
            Project Media
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif">Site Photo Gallery</h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto">
            Take a visual tour of Devojas City. View high-resolution layout survey blueprints and actual photographs from the project location.
          </p>
        </div>
      </section>

      {/* Main Gallery grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Intro Banner */}
        <div className="glass-panel p-6 rounded-[1.5rem] mb-10 flex flex-col md:flex-row items-center justify-between text-left">
          <div className="space-y-1 mb-4 md:mb-0">
            <h3 className="font-serif font-bold text-brand-navy text-lg flex items-center space-x-2">
              <Camera className="h-5 w-5 text-brand-gold" />
              <span>Devojas City Blueprint & Layouts</span>
            </h3>
            <p className="text-xs text-gray-500">Click on any image thumbnail to expand the view, inspect allocations, or download layout plan assets.</p>
          </div>
          
          <a
            href="/assets/devojas_city_layout.pdf"
            download="Devojas_City_Township_Plan.pdf"
            className="flex items-center space-x-2 bg-brand-navy hover:bg-brand-navyLight text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md transition-colors"
          >
            <Download className="h-4 w-4 text-brand-gold" />
            <span>Download All Layout Plans (PDF)</span>
          </a>
        </div>

        {/* The Reusable Gallery Grid */}
        <ImageGallery />

      </section>

      {/* RERA and Construction Guidelines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-navy text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navyLight to-brand-navy opacity-95" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex p-3 bg-brand-gold/15 rounded-full text-brand-gold mb-2">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-brand-gold">Genuine On-Site Photographs</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Every site photo in this gallery represents actual field progress at Bhandaha Kalan Kaithi. We refresh media files regularly to mirror roads layout progress and electric post allocations.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
