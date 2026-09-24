import { useState, useEffect } from 'react';
import { X, ZoomIn, Download, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageGallery() {
  const [activeImage, setActiveImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const galleryItems = [
    {
      id: 1,
      title: 'Grand Main Entrance & Gateway Approach',
      description: 'Front facing wide approach concrete roadway leading to the main entrance gateway and campus complex at Devojas City.',
      category: 'Site Photo',
      src: '/assets/gallery_main_gate_approach.jpg',
      downloadable: true,
      downloadName: 'Devojas_City_Main_Entrance.jpg'
    },
    {
      id: 2,
      title: 'Grand Entrance Gate (Central Front View)',
      description: 'Front facade of the grand entry archway gate, wide paved approach driveway and multi-storey institutional building complex.',
      category: 'Site Photo',
      src: '/assets/gallery_entrance_gate_center.jpg',
      downloadable: true,
      downloadName: 'Devojas_City_Entrance_Archway.jpg'
    },
    {
      id: 3,
      title: 'Site Entrance Road & Institutional Campus',
      description: 'Wide road approach with billboard framework structure and prominent institutional buildings at the project entrance.',
      category: 'Site Photo',
      src: '/assets/gallery_site_entrance_view.jpg',
      downloadable: true,
      downloadName: 'Devojas_City_Entrance_Campus.jpg'
    },
    {
      id: 4,
      title: 'NHAI Toll Plaza - Highway Corridor Welcome',
      description: 'National Highways Authority of India (NHAI) Toll Plaza entrance view directly serving the Kaithi-Varanasi expressway corridor.',
      category: 'Highway & Connectivity',
      src: '/assets/gallery_nhai_toll_plaza.jpg',
      downloadable: true,
      downloadName: 'Devojas_City_NHAI_Toll_Plaza.jpg'
    },
    {
      id: 5,
      title: 'NHAI Green Highway Landmark & Toll Approach',
      description: 'Toll approach lane with official NHAI green signboards and broad connecting roads adjacent to the project vicinity.',
      category: 'Highway & Connectivity',
      src: '/assets/gallery_nhai_toll_approach.jpg',
      downloadable: true,
      downloadName: 'Devojas_City_Toll_Approach.jpg'
    },
    {
      id: 6,
      title: 'NHAI Highway Green Signage & Project Turn',
      description: 'Official National Highways Authority of India (NHAI) green landmark board at the project approach turn connecting to Ghazipur-Varanasi Highway.',
      category: 'Highway & Connectivity',
      src: '/assets/gallery_nhai_approach.jpg',
      downloadable: true,
      downloadName: 'Devojas_City_NHAI_Highway_Board.jpg'
    },
    {
      id: 7,
      title: 'Varanasi-Ghazipur Highway Corridor & Connectivity',
      description: 'Wide National Highway corridor providing direct multi-lane high-speed vehicular connectivity towards Varanasi Cantt and Ghazipur.',
      category: 'Highway & Connectivity',
      src: '/assets/gallery_highway_connectivity.jpg',
      downloadable: true,
      downloadName: 'Devojas_City_Highway_Connectivity.jpg'
    },
    {
      id: 8,
      title: 'Ishwar Chand Vidya Public School (Adjacent)',
      description: 'Actual on-site photograph of Ishwar Chand Vidya Public School campus and boundary road situated immediately adjacent to Devojas City.',
      category: 'Nearby Landmark',
      src: '/assets/gallery_ishwar_chand_school.jpg',
      downloadable: true,
      downloadName: 'Devojas_City_Adjacent_ICB_School.jpg'
    },
    {
      id: 9,
      title: 'Devojas City Layout Blueprint Map',
      description: 'Official topographic site survey layout plan showing residential plot allocations (1000 & 1600 SF) and 20, 25, 30, 40 ft wide roads.',
      category: 'Layout Map',
      src: '/assets/layout_plan.png',
      downloadable: true,
      downloadName: 'Devojas_City_Site_Plan.png'
    },
    {
      id: 10,
      title: 'Residential Plot Development Sector',
      description: 'Clean leveled open land plots ready for construction with boundary wall alignments at Devojas City.',
      category: 'Site Photo',
      src: '/assets/plot_site_photo_1.jpg',
      downloadable: true,
      downloadName: 'Devojas_City_Plot_Area.jpg'
    },
    {
      id: 11,
      title: 'Gated Perimeter Boundary Wall',
      description: 'Gated brick wall boundary constructed around the Devojas City residential layout for security and clear demarcations.',
      category: 'Site Photo',
      src: '/assets/plot_site_boundary.jpg',
      downloadable: true,
      downloadName: 'Devojas_City_Boundary_Wall.jpg'
    },
    {
      id: 12,
      title: 'Leveled Site Layout & Boundary Demarcations',
      description: 'Wide-angle view of the leveled plotting sector showing boundary separations and clear plot alignments.',
      category: 'Site Photo',
      src: '/assets/plot_site_wide.jpg',
      downloadable: true,
      downloadName: 'Devojas_City_Leveled_Site.jpg'
    },
    {
      id: 13,
      title: 'Devojas City Sector Overview',
      description: 'Overview showing plot sectors and outer walls boundary demarcations ready for possession.',
      category: 'Site Photo',
      src: '/assets/plot_site_dist.jpg',
      downloadable: true,
      downloadName: 'Devojas_City_Layout_Overview.jpg'
    },
    {
      id: 14,
      title: 'Internal Road Levelling & Engineering Survey',
      description: 'On-site engineering team conducting topographic road mapping and leveling work for internal wide roads.',
      category: 'Site Photo',
      src: '/assets/plot_site_road_survey.jpg',
      downloadable: true,
      downloadName: 'Devojas_City_Road_Survey.jpg'
    },
    {
      id: 15,
      title: 'Ghazipur-Varanasi Highway Approach Road',
      description: 'Direct wide metalled road leading from the Ghazipur-Varanasi Highway straight to the entrance of Devojas City.',
      category: 'Highway & Connectivity',
      src: '/assets/plot_site_highway_view.jpg',
      downloadable: true,
      downloadName: 'Devojas_City_Highway_Access.jpg'
    },
    {
      id: 16,
      title: 'Markandey Mahadev Mandir (Kaithi)',
      description: 'Holy spiritual temple located near the project site at the sacred confluence of Ganga and Gomti rivers (1.5 KM distance).',
      category: 'Nearby Landmark',
      src: 'https://images.unsplash.com/photo-1609137144813-7d722d3e2329?q=80&w=800&auto=format&fit=crop',
      downloadable: false
    }
  ];

  const categories = ['All', 'Site Photo', 'Highway & Connectivity', 'Layout Map', 'Nearby Landmark'];

  const filteredItems = selectedCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  // Close lightbox on escape key & keyboard arrows
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeImage) return;
      if (e.key === 'Escape') setActiveImage(null);
      if (e.key === 'ArrowRight') {
        const currentIndex = filteredItems.findIndex(item => item.id === activeImage.id);
        if (currentIndex < filteredItems.length - 1) {
          setActiveImage(filteredItems[currentIndex + 1]);
        }
      }
      if (e.key === 'ArrowLeft') {
        const currentIndex = filteredItems.findIndex(item => item.id === activeImage.id);
        if (currentIndex > 0) {
          setActiveImage(filteredItems[currentIndex - 1]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage, filteredItems]);

  const activeIndex = activeImage ? filteredItems.findIndex(item => item.id === activeImage.id) : -1;

  return (
    <div className="space-y-8">
      {/* Category filters */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-8">
        {categories.map((cat) => {
          const count = cat === 'All' 
            ? galleryItems.length 
            : galleryItems.filter(i => i.category === cat).length;
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 cursor-pointer shadow-sm ${
                isActive
                  ? 'bg-brand-navy text-white ring-2 ring-brand-gold shadow-md font-bold'
                  : 'bg-white/75 text-gray-700 hover:bg-brand-gold/15 border border-brand-navy/10 hover:text-brand-navy'
              }`}
            >
              {cat === 'All' ? 'All Images' : cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="group lift-card bg-white/85 rounded-[1.5rem] overflow-hidden border border-brand-navy/10 flex flex-col text-left"
          >
            {/* Image Thumbnail */}
            <div 
              className="relative h-60 bg-gray-100 overflow-hidden cursor-pointer" 
              onClick={() => setActiveImage(item)}
            >
              <img 
                src={item.src} 
                alt={item.title} 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-brand-dark/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                <div className="bg-brand-gold text-brand-navy p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
                  <ZoomIn className="h-5 w-5" />
                </div>
                {item.downloadable && (
                  <a 
                    href={item.src}
                    download={item.downloadName}
                    onClick={(e) => e.stopPropagation()}
                    title="Download original photo"
                    className="bg-white text-brand-navy p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <Download className="h-5 w-5 text-brand-gold" />
                  </a>
                )}
              </div>
              <span className="absolute top-3 left-3 bg-brand-navy/90 backdrop-blur-sm text-brand-gold text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-md shadow border border-brand-gold/20">
                {item.category}
              </span>
            </div>

            {/* Description Body */}
            <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-serif font-bold text-brand-navy text-base sm:text-lg leading-snug group-hover:text-brand-gold transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
              
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveImage(item)}
                  className="text-xs font-bold text-brand-navy hover:text-brand-gold transition-colors inline-flex items-center space-x-1 cursor-pointer"
                >
                  <span>View Full Photo</span>
                  <ZoomIn className="h-3.5 w-3.5 ml-1" />
                </button>
                {item.downloadable && (
                  <a 
                    href={item.src}
                    download={item.downloadName}
                    className="inline-flex items-center space-x-1 text-xs text-brand-gold font-bold hover:underline"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 transition-all"
          onClick={() => setActiveImage(null)}
        >
          {/* Close button */}
          <button 
            onClick={() => setActiveImage(null)}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10 cursor-pointer"
            title="Close (Esc)"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Prev button */}
          {activeIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveImage(filteredItems[activeIndex - 1]);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10 hidden sm:flex cursor-pointer"
              title="Previous Photo"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Next button */}
          {activeIndex < filteredItems.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveImage(filteredItems[activeIndex + 1]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10 hidden sm:flex cursor-pointer"
              title="Next Photo"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
          
          <div 
            className="max-w-5xl w-full flex flex-col space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Lightbox Image */}
            <div className="bg-black/60 rounded-2xl overflow-hidden border border-white/10 p-2 flex justify-center max-h-[75vh] shadow-2xl">
              <img 
                src={activeImage.src} 
                alt={activeImage.title} 
                className="max-w-full max-h-[72vh] object-contain rounded-xl"
              />
            </div>
            
            {/* Content description bar */}
            <div className="text-left text-white px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-brand-gold font-extrabold uppercase tracking-wider bg-brand-gold/15 px-2.5 py-0.5 rounded">
                    {activeImage.category}
                  </span>
                  <span className="text-xs text-white/50">
                    ({activeIndex + 1} of {filteredItems.length})
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-serif">{activeImage.title}</h3>
                <p className="text-xs sm:text-sm text-white/70">{activeImage.description}</p>
              </div>
              
              <div className="flex space-x-3 shrink-0">
                {activeImage.downloadable && (
                  <a 
                    href={activeImage.src}
                    download={activeImage.downloadName || 'devojas_city_image.jpg'}
                    className="inline-flex items-center space-x-2 bg-brand-gold text-brand-navy font-bold px-4 py-2.5 rounded-lg text-xs hover:bg-brand-goldLight transition-colors shadow-md"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Original</span>
                  </a>
                )}
                <button
                  onClick={() => setActiveImage(null)}
                  className="bg-white/10 text-white hover:bg-white/20 px-4 py-2.5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
