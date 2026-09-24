import { useState } from 'react';
import { MapPin, Compass, Grid, ArrowRight, Download, Landmark, ZoomIn, FileText, X, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PlotInventory from './PlotInventory';

export default function ProjectCard({ project, onSelectPlotForEnquiry }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showPlotInventory, setShowPlotInventory] = useState(false);
  
  if (!project) return null;

  const {
    name,
    location,
    tagline,
    description,
    sizes = [],
    roads = [],
    landmarks = [],
    imageUrl,
    pdfUrl,
    reraApproved,
    stats = { totalPlots: 0, soldPlots: 0, bookedPlots: 0, availablePlots: 0 },
    plots = []
  } = project;

  // Real calculation if stats not passed
  const totalPlotsCount = stats.totalPlots || plots.length || 0;
  const availablePlotsCount = stats.availablePlots || plots.filter(p => p.status === 'Available').length || 0;
  const soldPlotsCount = stats.soldPlots || plots.filter(p => p.status === 'Sold').length || 0;
  const bookedPlotsCount = stats.bookedPlots || plots.filter(p => p.status === 'Booked').length || 0;
  const soldPercentage = totalPlotsCount > 0 ? Math.round(((soldPlotsCount + bookedPlotsCount) / totalPlotsCount) * 100) : 0;

  const handleEnquiryRedirect = (plot = null) => {
    if (onSelectPlotForEnquiry) {
      onSelectPlotForEnquiry(project, plot);
    } else {
      const query = plot ? `?project=${encodeURIComponent(name)}&plot=${plot.plotNo}&size=${encodeURIComponent(plot.size)}` : `?project=${encodeURIComponent(name)}`;
      navigate(`/contact${query}`);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="glass-panel rounded-[2rem] overflow-hidden transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 group text-left">
        
        {/* Left Side: Visual Header / Image Container */}
        <div 
          className="lg:col-span-5 relative min-h-[300px] sm:min-h-[380px] lg:min-h-full overflow-hidden shrink-0 cursor-pointer bg-brand-navy flex flex-col justify-between" 
          onClick={() => setShowModal(true)}
        >
          <img 
            src={imageUrl} 
            alt={`${name} site layout plan`} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 absolute inset-0"
            loading="lazy"
          />
          
          {/* Quick Action Overlay */}
          <div className="absolute inset-0 bg-brand-dark/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 z-20">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
              className="bg-brand-gold text-brand-navy p-3.5 rounded-full shadow-xl hover:scale-110 transition-transform cursor-pointer"
              title="Preview Layout Map"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <a 
              href={imageUrl}
              download={`${name}_Layout_Map.png`}
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-brand-navy p-3.5 rounded-full shadow-xl hover:scale-110 transition-transform cursor-pointer"
              title="Download Map Image (HD)"
            >
              <Download className="h-5 w-5 text-brand-gold" />
            </a>
          </div>

          {/* RERA Badge & Immediate Registry Tag */}
          <div className="relative top-4 left-4 flex flex-col gap-2 z-10 self-start">
            {reraApproved && (
              <span className="bg-green-600 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-md shadow-md backdrop-blur-sm">
                RERA Compliant
              </span>
            )}
            <span className="bg-brand-navy/90 text-brand-gold font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-md shadow-md border border-brand-gold/30 backdrop-blur-sm">
              Immediate Registry
            </span>
          </div>

          {/* Live Inventory Snapshot Box */}
          <div className="relative z-10 m-4 p-4 rounded-2xl bg-white/12 backdrop-blur-md border border-white/20 text-white text-xs shadow-xl">
            <div className="flex items-center justify-between text-[11px] font-bold mb-1">
              <span className="text-emerald-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> {availablePlotsCount} Plots Available
              </span>
              <span className="text-gray-300">{soldPercentage}% Sold</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-400 to-brand-gold h-full rounded-full" style={{ width: `${100 - soldPercentage}%` }}></div>
            </div>
          </div>
        </div>

        {/* Right Side: Card Body Content */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-white/72">
          <div className="space-y-4">
            
            {/* Project Title & Tagline */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-brand-gold uppercase tracking-wider">
                  <Compass className="h-4 w-4" />
                  <span>Premium Residential Township</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-serif mt-1">{name}</h3>
                <p className="text-xs text-gray-500 italic mt-0.5">{tagline}</p>
              </div>

              <div className="bg-brand-gold/15 border border-brand-gold/30 px-3 py-2 rounded-xl text-right">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Registry Status</span>
                <span className="text-xs font-extrabold text-emerald-700">Instant Khatauni Mutation</span>
              </div>
            </div>

            {/* Location details */}
            <div className="flex items-start space-x-2 text-xs sm:text-sm text-gray-700 bg-brand-navy/5 p-3 rounded-xl border border-brand-navy/10">
              <MapPin className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
              <span className="font-medium leading-snug">{location}</span>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {description}
            </p>

            {/* Key Specifications (Grid) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              
              {/* Sizes */}
              <div className="bg-white p-3 rounded-xl border border-brand-navy/10 space-y-1 shadow-sm">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Available Plot Sizes
                </span>
                <div className="flex items-center space-x-2 text-gray-800">
                  <Grid className="h-4 w-4 text-brand-gold shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-brand-navy">{sizes.join(' & ')}</span>
                </div>
              </div>

              {/* Roads */}
              <div className="bg-brand-gold/15 p-3 rounded-xl border border-brand-gold/25 space-y-1 shadow-sm">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Road Infrastructure
                </span>
                <div className="flex items-center space-x-2 text-gray-800">
                  <div className="h-4 w-4 flex items-center justify-center font-bold text-[10px] text-brand-gold border border-brand-gold rounded-full shrink-0">R</div>
                  <span className="text-xs sm:text-sm font-bold text-brand-navy">{roads.join(' / ')}</span>
                </div>
              </div>

            </div>

            {/* Landmarks section */}
            <div className="bg-white/80 p-3.5 rounded-xl space-y-2 border border-brand-navy/10">
              <div className="flex items-center space-x-2 text-xs font-bold text-brand-navy uppercase tracking-wider">
                <Landmark className="h-4 w-4 text-brand-gold" />
                <span>Nearby Strategic Landmarks</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-600">
                {landmarks.map((landmark, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-gold shrink-0" />
                    <span className="font-semibold text-gray-800">{landmark.name}:</span>
                    <span className="text-gray-500 text-[11px]"> {landmark.distance}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Interactive Plot Availability Expand Button & Action Row */}
          <div className="pt-4 border-t border-gray-150 space-y-3">
            
            {/* Toggle Plot Matrix */}
            <button
              onClick={() => setShowPlotInventory(!showPlotInventory)}
              className="w-full flex items-center justify-between bg-gradient-to-r from-brand-navy to-brand-navyLight hover:from-slate-900 hover:to-brand-navy text-white px-4 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <span className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-brand-gold" />
                <span>{showPlotInventory ? 'Hide Live Plot Inventory' : `Check Live Plot Availability (${availablePlotsCount} Plots Available)`}</span>
              </span>
              <span className="flex items-center space-x-1 text-brand-gold">
                <span>{showPlotInventory ? 'Collapse' : 'View Plot Map'}</span>
                {showPlotInventory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </span>
            </button>

            {/* Action buttons footer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <a
                href={imageUrl}
                download={`${name}_Layout_Map.png`}
                className="flex items-center justify-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-brand-navy font-bold py-2.5 px-3 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                title="Download High-Resolution Map PNG"
              >
                <Download className="h-4 w-4 text-brand-gold" />
                <span>Download Map (HD)</span>
              </a>

              <a
                href={pdfUrl}
                download={`${name}_Layout_Blueprint.pdf`}
                className="flex items-center justify-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-brand-navy font-semibold py-2.5 px-3 rounded-xl text-xs transition-colors cursor-pointer"
                title="Download Layout PDF Plan"
              >
                <FileText className="h-4 w-4 text-brand-gold" />
                <span>Download PDF</span>
              </a>
              
              <button
                onClick={() => handleEnquiryRedirect()}
                className="flex items-center justify-center space-x-2 bg-brand-gold hover:bg-brand-goldLight text-brand-navy font-bold py-2.5 px-4 rounded-xl text-xs transition-all hover:shadow shadow-md transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Enquire & Book</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Expanded Interactive Plot Inventory Matrix */}
      {showPlotInventory && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <PlotInventory 
            project={project} 
            onSelectPlotForEnquiry={(proj, plot) => handleEnquiryRedirect(plot)} 
          />
        </div>
      )}

      {/* Quick Map Preview Lightbox Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <button 
            onClick={() => setShowModal(false)}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="h-6 w-6" />
          </button>

          <div 
            className="max-w-4xl w-full flex flex-col space-y-4 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-black/40 p-2 rounded-2xl border border-white/10 max-h-[75vh] flex justify-center shadow-2xl">
              <img 
                src={imageUrl} 
                alt={`${name} layout plan`} 
                className="max-w-full max-h-[70vh] object-contain rounded-xl"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div>
                <h3 className="text-xl font-bold font-serif">{name} - Official Layout Map</h3>
                <p className="text-xs text-white/70">Topographic plot survey & sector allocation plan</p>
              </div>
              <div className="flex space-x-3">
                <a
                  href={imageUrl}
                  download={`${name}_Layout_Map.png`}
                  className="inline-flex items-center space-x-2 bg-brand-gold text-brand-navy font-bold px-4 py-2.5 rounded-lg text-xs hover:bg-brand-goldLight transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Map Image</span>
                </a>
                <a
                  href={pdfUrl}
                  download={`${name}_Plan.pdf`}
                  className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-lg text-xs transition-colors"
                >
                  <FileText className="h-4 w-4 text-brand-gold" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
