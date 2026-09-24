import React, { useState, useMemo } from 'react';
import { CheckCircle2, ShieldCheck, Filter, Grid, List, Sparkles, Phone, Compass, ArrowUpRight, Lock, Eye } from 'lucide-react';

export default function PlotInventory({ project, onSelectPlotForEnquiry }) {
  const [filterStatus, setFilterStatus] = useState('All'); // 'All' | 'Available' | 'Sold' | 'Booked'
  const [filterBlock, setFilterBlock] = useState('All');
  const [onlyCorners, setOnlyCorners] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [selectedPlot, setSelectedPlot] = useState(null);

  const plots = project?.plots || [];
  
  // Calculate dynamic stats
  const stats = useMemo(() => {
    const total = plots.length;
    const available = plots.filter(p => p.status === 'Available').length;
    const sold = plots.filter(p => p.status === 'Sold').length;
    const booked = plots.filter(p => p.status === 'Booked').length;
    const soldPct = total > 0 ? Math.round(((sold + booked) / total) * 100) : 0;
    return { total, available, sold, booked, soldPct };
  }, [plots]);

  // Unique Blocks for filter
  const blocks = useMemo(() => {
    const list = ['All', ...new Set(plots.map(p => p.block).filter(Boolean))];
    return list;
  }, [plots]);

  // Filtered Plots
  const filteredPlots = useMemo(() => {
    return plots.filter(plot => {
      const matchStatus = filterStatus === 'All' ? true : plot.status === filterStatus;
      const matchBlock = filterBlock === 'All' ? true : plot.block === filterBlock;
      const matchCorner = onlyCorners ? plot.isCorner : true;
      return matchStatus && matchBlock && matchCorner;
    });
  }, [plots, filterStatus, filterBlock, onlyCorners]);

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden text-left mt-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-navy via-brand-navyLight to-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-brand-gold/20 border border-brand-gold/40 px-3 py-1 rounded-full text-brand-gold text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Real-Time Plot Availability Matrix</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif">
              {project?.name} &bull; Live Plot Inventory
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Check real-time plot status, layout dimensions, facing roads, and instant booking availability.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Live Registry Sync</span>
            </span>
          </div>
        </div>

        {/* Live Counters & Progress Bar */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Plots */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <span className="text-[11px] uppercase tracking-wider text-gray-300 font-semibold block">Total Planned</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{stats.total} <span className="text-xs font-normal text-gray-300">Plots</span></div>
          </div>

          {/* Available Plots */}
          <div className="bg-emerald-500/15 backdrop-blur-md rounded-2xl p-4 border border-emerald-400/30">
            <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Available Now
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 mt-1">{stats.available} <span className="text-xs font-normal text-emerald-200">Plots</span></div>
          </div>

          {/* Sold Out */}
          <div className="bg-rose-500/15 backdrop-blur-md rounded-2xl p-4 border border-rose-400/30">
            <span className="text-[11px] uppercase tracking-wider text-rose-300 font-bold block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span> Sold / Registered
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-300 mt-1">{stats.sold} <span className="text-xs font-normal text-rose-200">Plots</span></div>
          </div>

          {/* Booked / In Process */}
          <div className="bg-amber-500/15 backdrop-blur-md rounded-2xl p-4 border border-amber-400/30">
            <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Token Booked
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-1">{stats.booked} <span className="text-xs font-normal text-amber-200">Plots</span></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-gray-300 mb-1.5">
            <span>Project Booking Progress: <strong>{stats.soldPct}% Sold Out</strong></span>
            <span className="text-brand-gold font-bold">{stats.available} Plots Remaining for Booking</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden flex">
            <div 
              className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${stats.soldPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Control Filters Toolbar */}
      <div className="p-5 sm:p-6 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
        
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Status:
          </span>
          {['All', 'Available', 'Sold', 'Booked'].map((status) => {
            const isActive = filterStatus === status;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-navy text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                {status === 'Available' && '🟢 '}
                {status === 'Sold' && '🔴 '}
                {status === 'Booked' && '🟡 '}
                {status}
              </button>
            );
          })}
        </div>

        {/* Block & Corner Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {blocks.length > 2 && (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-gray-500">Block:</span>
              <select
                value={filterBlock}
                onChange={(e) => setFilterBlock(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg text-xs font-bold px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-navy"
              >
                {blocks.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          )}

          <label className="inline-flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold text-gray-700 select-none">
            <input
              type="checkbox"
              checked={onlyCorners}
              onChange={(e) => setOnlyCorners(e.target.checked)}
              className="rounded text-brand-navy focus:ring-brand-navy h-3.5 w-3.5"
            />
            <span>Corner Plots Only</span>
          </label>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-white border border-gray-300 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-brand-navy text-white' : 'text-gray-500 hover:text-gray-900'}`}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md ${viewMode === 'table' ? 'bg-brand-navy text-white' : 'text-gray-500 hover:text-gray-900'}`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Plots Display Area */}
      <div className="p-6 sm:p-8">
        
        {filteredPlots.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <p className="text-base font-bold">No plots match the selected filter.</p>
            <button
              onClick={() => { setFilterStatus('All'); setFilterBlock('All'); setOnlyCorners(false); }}
              className="mt-3 text-xs text-brand-gold hover:underline font-bold"
            >
              Reset all filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPlots.map((plot) => {
              const isAvailable = plot.status === 'Available';
              const isSold = plot.status === 'Sold';
              const isBooked = plot.status === 'Booked';

              return (
                <div
                  key={plot.id}
                  className={`relative rounded-2xl p-4 transition-all duration-300 border flex flex-col justify-between ${
                    isAvailable
                      ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400 hover:shadow-lg hover:-translate-y-1'
                      : isSold
                      ? 'bg-rose-50/30 border-rose-200/80 opacity-80'
                      : 'bg-amber-50/40 border-amber-200'
                  }`}
                >
                  <div>
                    {/* Top Row: Plot Number & Status Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-black text-brand-navy font-serif">
                          Plot #{plot.plotNo}
                        </span>
                        {plot.isCorner && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                            Corner
                          </span>
                        )}
                      </div>

                      {/* Status Tag */}
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        isAvailable
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : isSold
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}>
                        {plot.status}
                      </span>
                    </div>

                    <span className="text-[11px] text-gray-500 font-semibold block mb-3">
                      {plot.block}
                    </span>

                    {/* Plot Specs */}
                    <div className="space-y-1.5 text-xs text-gray-600 bg-white/80 p-3 rounded-xl border border-gray-150 mb-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Size:</span>
                        <strong className="text-brand-navy">{plot.size}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Dimensions:</span>
                        <span>{plot.dimensions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Road Width:</span>
                        <span>{plot.roadWidth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Facing:</span>
                        <span>{plot.facing}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Price & Action CTA */}
                  <div className="pt-2 border-t border-gray-150 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase">Price</span>
                      <span className="text-xs sm:text-sm font-extrabold text-brand-navy">{plot.price}</span>
                    </div>

                    {isAvailable ? (
                      <button
                        onClick={() => onSelectPlotForEnquiry && onSelectPlotForEnquiry(project, plot)}
                        className="inline-flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg shadow transition-all transform active:scale-95"
                      >
                        <Phone className="h-3 w-3" />
                        <span>Enquire</span>
                      </button>
                    ) : isSold ? (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-1 rounded-md">
                        <Lock className="h-3 w-3" />
                        <span>Registered</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-1 rounded-md">
                        <span>Under Token</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        ) : (

          /* TABLE VIEW */
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-brand-navy text-white uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-3.5">Plot No</th>
                  <th className="p-3.5">Block</th>
                  <th className="p-3.5">Size</th>
                  <th className="p-3.5">Dimensions</th>
                  <th className="p-3.5">Facing Road</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredPlots.map((plot) => {
                  const isAvailable = plot.status === 'Available';
                  const isSold = plot.status === 'Sold';
                  return (
                    <tr key={plot.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3.5 font-bold text-brand-navy">
                        #{plot.plotNo} {plot.isCorner && <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded ml-1 font-bold">CORNER</span>}
                      </td>
                      <td className="p-3.5 text-gray-600">{plot.block}</td>
                      <td className="p-3.5 font-semibold text-brand-navy">{plot.size}</td>
                      <td className="p-3.5 text-gray-600">{plot.dimensions}</td>
                      <td className="p-3.5 text-gray-600">{plot.facing} ({plot.roadWidth})</td>
                      <td className="p-3.5 font-bold text-brand-navy">{plot.price}</td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          isAvailable
                            ? 'bg-emerald-100 text-emerald-700'
                            : isSold
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {plot.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {isAvailable ? (
                          <button
                            onClick={() => onSelectPlotForEnquiry && onSelectPlotForEnquiry(project, plot)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded text-xs transition-colors"
                          >
                            Book Enquiry
                          </button>
                        ) : (
                          <span className="text-gray-400 text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Footer info legend */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> <span>Available For Registry</span></span>
          <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> <span>Sold Out (Registry Completed)</span></span>
          <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> <span>Token Received</span></span>
        </div>
        <p className="text-[11px] text-gray-400">
          * Price is subject to final registry charges & PLC corner charges where applicable.
        </p>
      </div>

    </div>
  );
}
