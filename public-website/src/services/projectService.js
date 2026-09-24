import { apiClient } from './api';
import { projectsData } from '../projectsData';

/**
 * Project & Plot Inventory Service
 * ---------------------------------------------------------------
 * UPDATED to connect to the DEVOJAS REALTORS backend (single-location
 * township — no "multiple projects" concept on the backend, so we
 * fetch the live flat plot list and merge it into the same rich
 * "project" shape the components already expect (marketing copy like
 * name/tagline/landmarks/features stays as local content; only the
 * live plot INVENTORY — status, price, etc. — comes from the backend).
 *
 * IMPORTANT: No component was changed. PlotInventory.jsx, ProjectCard.jsx,
 * etc. all still receive the exact same shape they did before —
 * { id, name, plots: [...], stats: {...}, ...marketing fields }.
 * ---------------------------------------------------------------
 */

// Backend gives lowercase enum values — map to what the UI expects
const STATUS_MAP = {
  available: 'Available',
  sold: 'Sold',
  under_negotiation: 'Booked',
  // fallback: leave any unexpected value capitalized as-is
};

const formatPrice = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '';
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lacs`;
  return `₹${num.toLocaleString('en-IN')}`;
};

// Convert one backend Plot row into the shape PlotInventory.jsx expects
const mapBackendPlot = (p) => ({
  id: p.id,
  plotNo: p.plot_number || p.id,
  block: p.block || 'Main Block',
  size: p.size_sqft ? `${p.size_sqft} SF` : '',
  dimensions: p.dimensions || '—',
  facing: p.facing || '—',
  roadWidth: p.road_width || '—',
  price: formatPrice(p.price),
  status: STATUS_MAP[p.status] || p.status,
  isCorner: !!p.is_corner,
  title: p.title,
  location: p.location,
  image_url: p.image_url
});

export const projectService = {
  // 1. Fetch All Projects — single-location business, so this returns
  //    one synthesized "project" wrapping the live backend plot inventory
  async getProjects() {
    const res = await apiClient('/public/plots');
    if (res.success && res.data?.data) {
      const livePlots = res.data.data.map(mapBackendPlot);
      const merged = { ...projectsData[0], plots: livePlots, stats: projectService.calculateStats(livePlots) };
      return { data: [merged], isLive: true };
    }
    return { data: projectsData, isLive: false };
  },

  // 2. Fetch Single Project with detailed plots (same merge logic)
  async getProjectById(projectId) {
    const res = await apiClient('/public/plots');
    if (res.success && res.data?.data) {
      const livePlots = res.data.data.map(mapBackendPlot);
      const merged = { ...projectsData[0], plots: livePlots, stats: projectService.calculateStats(livePlots) };
      return { data: merged, isLive: true };
    }
    const local = projectsData.find(p => p.id === projectId) || projectsData[0];
    return { data: local, isLive: false };
  },

  // 3. Fetch Plot Inventory & Live Statistics
  async getPlotInventory(projectId) {
    const res = await apiClient('/public/plots');
    if (res.success && res.data?.data) {
      const plots = res.data.data.map(mapBackendPlot);
      const stats = projectService.calculateStats(plots);
      return { plots, stats, isLive: true };
    }

    // Local Fallback (backend not configured/unreachable yet)
    const localProj = projectsData.find(p => p.id === projectId) || projectsData[0];
    const plots = localProj.plots || [];
    const stats = localProj.stats || projectService.calculateStats(plots);
    return { plots, stats, isLive: false };
  },

  // Helper to dynamically calculate stats from live plots
  calculateStats(plots = []) {
    const total = plots.length;
    const available = plots.filter(p => p.status === 'Available').length;
    const sold = plots.filter(p => p.status === 'Sold').length;
    const booked = plots.filter(p => p.status === 'Booked').length;

    return {
      totalPlots: total,
      availablePlots: available,
      soldPlots: sold,
      bookedPlots: booked,
      soldPercentage: total > 0 ? Math.round(((sold + booked) / total) * 100) : 0
    };
  }
};
