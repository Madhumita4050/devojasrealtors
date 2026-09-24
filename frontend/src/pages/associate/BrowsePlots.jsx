import React, { useEffect, useState } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import api from '../../api/axios';

const BrowsePlots = () => {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');

  const fetchPlots = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (city) params.city = city;
      const res = await api.get('/associate/plots', { params });
      setPlots(res.data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchPlots(); }, [search, city]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Browse Plots</h1>
        <p className="text-gray-500 text-sm">Available plots you can recommend to your clients</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or location..." className="input-field pl-9" />
        </div>
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Filter by city..." className="input-field max-w-xs" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-gray-400 col-span-full text-center py-10">Loading...</p>
        ) : plots.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center py-10">No plots available right now</p>
        ) : (
          plots.map((p) => (
            <div key={p.id} className="card space-y-3">
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="w-full h-36 object-cover rounded-lg bg-gray-100" onError={(e) => e.target.style.display = 'none'} />
              ) : (
                <div className="w-full h-36 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-sm">No Image</div>
              )}
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-800">{p.title}</h3>
                {p.is_featured && <Star size={16} className="text-gold fill-gold shrink-0" />}
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={12} /> {p.location}{p.city ? `, ${p.city}` : ''}</p>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-gray-500">{p.size_sqft} sqft</span>
                <span className="font-bold text-navy">₹{Number(p.price).toLocaleString('en-IN')}</span>
              </div>
              <p className="text-xs text-gray-400">Owner: {p.owner?.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BrowsePlots;
