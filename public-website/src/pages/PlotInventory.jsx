import { useState, useEffect, useMemo } from 'react';
import { MapPin, Grid2x2, IndianRupee, RefreshCw, CheckCircle, XCircle, Layers, ArrowRight, Filter, X, Home, LayoutGrid, BadgeCheck, Clock } from 'lucide-react';

const BASE_API = import.meta.env.VITE_API_BASE_URL || '';

const statusConfig = {
  available: {
    label: 'Available',
    icon: CheckCircle,
    cardBorder: 'border-emerald-400/60',
    cardBg: '',
    badge: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    dot: 'bg-emerald-500 animate-pulse',
  },
  sold: {
    label: 'Booked / Sold',
    icon: XCircle,
    cardBorder: 'border-red-400/40',
    cardBg: 'opacity-80',
    badge: 'bg-red-100 text-red-700 border border-red-300',
    dot: 'bg-red-400',
  },
};

function PlotCard({ plot }) {
  const cfg = statusConfig[plot.status] || statusConfig.available;

  return (
    <div
      className={`relative bg-white rounded-2xl border-2 ${cfg.cardBorder} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group ${cfg.cardBg}`}
    >
      {/* Status strip */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${plot.status === 'available' ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-red-400 to-rose-400'}`} />

      {/* Corner badge */}
      {plot.is_corner && (
        <div className="absolute top-3 right-3 bg-amber-400 text-white text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full shadow">
          Corner
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <h3 className="font-extrabold text-brand-navy text-base leading-snug font-serif">{plot.title}</h3>
            {(plot.block || plot.plot_number) && (
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                {plot.block && <span>{plot.block}</span>}
                {plot.block && plot.plot_number && <span className="mx-1">·</span>}
                {plot.plot_number && <span>Plot #{plot.plot_number}</span>}
              </p>
            )}
          </div>
          <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3 h-3" /> Size
            </span>
            <span className="text-sm font-bold text-brand-navy">
              {plot.dimensions || `${plot.size_sqft} sq.ft`}
            </span>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <IndianRupee className="w-3 h-3" /> Price
            </span>
            <span className="text-sm font-bold text-emerald-700">
              ₹{Number(plot.price).toLocaleString('en-IN')}
            </span>
          </div>

          {plot.facing && (
            <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Home className="w-3 h-3" /> Facing
              </span>
              <span className="text-sm font-semibold text-brand-navy">{plot.facing}</span>
            </div>
          )}

          {plot.road_width && (
            <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Grid2x2 className="w-3 h-3" /> Road Width
              </span>
              <span className="text-sm font-semibold text-brand-navy">{plot.road_width}</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-start gap-1.5 text-xs text-gray-500">
          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-brand-gold" />
          <span className="line-clamp-1">{plot.location}{plot.city ? `, ${plot.city}` : ''}</span>
        </div>

        {plot.description && (
          <p className="text-[11px] text-gray-400 mt-2 line-clamp-2">{plot.description}</p>
        )}
      </div>

      {plot.status === 'available' && (
        <div className="px-5 pb-5">
          <a
            href="/contact"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-brand-gold to-amber-400 hover:from-amber-400 hover:to-brand-gold text-brand-navy font-extrabold py-2.5 rounded-xl text-xs transition-all shadow-sm active:scale-95"
          >
            <span>Enquire About This Plot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}

export default function PlotInventory() {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchPlots = async () => {
    setLoading(true);
    try {
      // BASE_API is already "http://localhost:5000/api" — just append /plots/public
      const url = `${BASE_API.replace(/\/+$/, '')}/plots/public`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setPlots(json.data || []);
        setIsLive(true);
      } else {
        setIsLive(false);
      }
    } catch (err) {
      console.error('Plot fetch error:', err);
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchPlots(); }, []);

  const filtered = useMemo(() => {
    let list = [...plots];
    if (statusFilter !== 'all') list = list.filter(p => p.status === statusFilter);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(p =>
        p.title?.toLowerCase().includes(s) ||
        p.location?.toLowerCase().includes(s) ||
        p.block?.toLowerCase().includes(s) ||
        p.plot_number?.toLowerCase().includes(s)
      );
    }
    return list;
  }, [statusFilter, search, plots]);

  const available = plots.filter(p => p.status === 'available').length;
  const sold = plots.filter(p => p.status === 'sold').length;

  return (
    <div className="page-shell pt-24 pb-20">

      {/* ── Hero ── */}
      <section className="page-hero py-20">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/80 via-brand-navy/80 to-brand-gold/25" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="section-kicker !text-white !bg-white/10">Live Plot Inventory</span>
            {isLive && (
              <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Data
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif">
            Plot Availability — Devojas Realtors
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto">
            Real-time plot status updated directly by our admin. Browse all available and booked plots across our townships in Varanasi.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-navy/10 flex items-center justify-center shrink-0">
              <LayoutGrid className="w-6 h-6 text-brand-navy" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Plots</p>
              <p className="text-2xl font-extrabold text-brand-navy">{plots.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <BadgeCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Available</p>
              <p className="text-2xl font-extrabold text-emerald-700">{available}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-red-500 font-semibold uppercase tracking-wider">Booked / Sold</p>
              <p className="text-2xl font-extrabold text-red-600">{sold}</p>
            </div>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-navy uppercase tracking-wider shrink-0">
              <Filter className="w-4 h-4 text-brand-gold" />
              Filter Plots
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <input
                type="text"
                placeholder="Search by title, location, block..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status tabs */}
            <div className="flex gap-2">
              {[['all', 'All'], ['available', '✅ Available'], ['sold', '🔴 Booked']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setStatusFilter(val)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === val
                      ? 'bg-brand-navy text-white shadow'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-navy hover:text-brand-navy'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              onClick={fetchPlots}
              className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand-navy"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Sync Live
            </button>
          </div>
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-brand-gold" />
            <p className="text-sm text-gray-400 font-semibold">Loading live plot inventory...</p>
          </div>
        ) : !isLive ? (
          <div className="py-24 text-center bg-white rounded-2xl border border-gray-200 space-y-3">
            <p className="text-gray-500 font-semibold">Backend not connected.</p>
            <p className="text-xs text-gray-400">Please configure <code className="bg-gray-100 px-1 rounded">VITE_API_BASE_URL</code> in your .env file.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-2xl border border-gray-200 space-y-4">
            <p className="text-gray-600 text-lg font-semibold">No plots found matching your filters.</p>
            <button
              onClick={() => { setStatusFilter('all'); setSearch(''); }}
              className="bg-brand-navy text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow hover:bg-brand-navyLight transition-colors"
            >
              Show All Plots
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(plot => <PlotCard key={plot.id} plot={plot} />)}
          </div>
        )}

        {/* ── Legend ── */}
        <div className="bg-brand-navy/5 border border-brand-gold/15 rounded-2xl p-5 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-navy">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse inline-block" />
            Available — Open for booking
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-navy">
            <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
            Booked / Sold — Already taken
          </div>
          <p className="text-[10px] text-gray-400 ml-auto">
            Plot status updated in real-time by Devojas Realtors admin.
          </p>
        </div>
      </div>
    </div>
  );
}
