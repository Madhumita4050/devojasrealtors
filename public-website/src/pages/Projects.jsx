import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { projectService } from '../services/projectService';
import { Grid, Filter, MapPin, CheckCircle, RefreshCw } from 'lucide-react';

export default function Projects() {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveApi, setIsLiveApi] = useState(false);
  
  // States for filter dropdowns
  const [sizeFilter, setSizeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // Load Projects from Service / Backend API
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data, isLive } = await projectService.getProjects();
      setProjects(data);
      setFilteredProjects(data);
      setIsLiveApi(isLive);
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, []);

  // Read URL query parameters on load or when projects change
  useEffect(() => {
    if (projects.length === 0) return;

    const sizeParam = searchParams.get('size');
    const locParam = searchParams.get('location');

    let current = [...projects];

    if (sizeParam && sizeParam !== 'all') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSizeFilter(sizeParam);
      current = current.filter(p => 
        (p.sizes || []).some(size => size.toLowerCase().includes(sizeParam.toLowerCase()))
      );
    }

    if (locParam && locParam !== 'all') {
      setLocationFilter(locParam);
      current = current.filter(p => 
        (p.location || '').toLowerCase().includes(locParam.toLowerCase())
      );
    }

    setFilteredProjects(current);
  }, [searchParams, projects]);

  // Handle local filter change
  const handleFilterChange = (size, location) => {
    setSizeFilter(size);
    setLocationFilter(location);

    let list = [...projects];

    if (size !== 'all') {
      list = list.filter(p => 
        (p.sizes || []).some(s => s.toLowerCase().includes(size.toLowerCase()))
      );
    }

    if (location !== 'all') {
      list = list.filter(p => 
        (p.location || '').toLowerCase().includes(location.toLowerCase())
      );
    }

    setFilteredProjects(list);
  };

  return (
    <div className="page-shell pt-24 space-y-12 pb-16">
      
      {/* Header section */}
      <section className="page-hero py-20">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/80 via-brand-navy/80 to-brand-gold/25" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          
          <div className="flex items-center justify-center space-x-2">
            <span className="section-kicker !text-white !bg-white/10">
              Verified Residential Townships
            </span>
            {isLiveApi && (
              <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Backend Connected
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif">Residential Plot Projects & Inventory</h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto">
            Browse our list of verified residential townships in Varanasi with live plot availability, road dimensions, and immediate mutation registry.
          </p>
        </div>
      </section>

      {/* Filter panel & scalable grid layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Filters Card */}
        <div className="glass-panel rounded-[1.5rem] p-5 mb-10 text-left">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-brand-navy uppercase tracking-wider">
              <Filter className="h-4 w-4 text-brand-gold" />
              <span>Filter Residential Layouts</span>
            </div>

            <button 
              onClick={fetchProjects} 
              className="text-xs text-gray-500 hover:text-brand-navy flex items-center gap-1 font-semibold"
              title="Refresh inventory"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Sync Live</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            
            {/* Location filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                Layout Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  value={locationFilter}
                  onChange={(e) => handleFilterChange(sizeFilter, e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-1 focus:ring-brand-navy"
                >
                  <option value="all">All Locations (Varanasi)</option>
                  <option value="kaithi">Bhandaha Kalan, Kaithi</option>
                  <option value="umaraha">Umaraha (Swarved Mahamandir)</option>
                </select>
              </div>
            </div>

            {/* Size filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                Plot Dimension / Area
              </label>
              <div className="relative">
                <Grid className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  value={sizeFilter}
                  onChange={(e) => handleFilterChange(e.target.value, locationFilter)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-1 focus:ring-brand-navy"
                >
                  <option value="all">All Sizes (1000, 1200, 1500 & 1600 SF)</option>
                  <option value="1000">1000 Square Feet</option>
                  <option value="1200">1200 Square Feet</option>
                  <option value="1500">1500 Square Feet</option>
                  <option value="1600">1600 Square Feet</option>
                </select>
              </div>
            </div>

            {/* Reset button */}
            <div>
              <button
                onClick={() => handleFilterChange('all', 'all')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-brand-navy font-bold py-2 border border-gray-250 rounded-lg text-sm transition-colors"
              >
                Reset Filters
              </button>
            </div>

          </div>
        </div>

        {/* Vertical Stacked Project Cards (One below the other) */}
        {isLoading ? (
          <div className="py-20 text-center text-gray-400">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-brand-gold" />
            <p className="text-sm font-semibold">Loading live project data...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="flex flex-col gap-10 max-w-6xl mx-auto">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-150 p-12 text-center max-w-xl mx-auto space-y-4">
            <p className="text-gray-600 text-lg">No projects match the selected filter criteria.</p>
            <button
              onClick={() => handleFilterChange('all', 'all')}
              className="bg-brand-navy text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow hover:bg-brand-navyLight transition-colors"
            >
              Show All Projects
            </button>
          </div>
        )}

      </section>

      {/* Development / scalable projects disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-navy/5 border border-brand-gold/15 p-6 rounded-2xl text-left space-y-4">
          <h4 className="font-serif font-bold text-brand-navy text-lg">Future Township Expansions</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            In addition to **Devojas City** and **Devojas Enclave**, Devojas Realtors Pvt. Ltd. is actively surveying new agricultural land patches along the Ghazipur Road and Varanasi Ring Road corridor for future residential conversion. All upcoming projects will feature the same strict adherence to layout road widths (20 to 40 ft), immediate mutation registry, and close proximity to Varanasi highlights.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-semibold text-brand-navy">
            <span className="flex items-center space-x-1.5">
              <CheckCircle className="h-4.5 w-4.5 text-brand-gold" />
              <span>Future Blocks under survey</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle className="h-4.5 w-4.5 text-brand-gold" />
              <span>Investment pooling advisory</span>
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}
