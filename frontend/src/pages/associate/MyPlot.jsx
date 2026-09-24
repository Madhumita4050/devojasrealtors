import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import api from '../../api/axios';
import Badge from '../../components/Badge';

const MyPlot = () => {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/associate/my-plots')
      .then((res) => setPlots(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Plot</h1>
        <p className="text-gray-500 text-sm">Plots involved in deals you've facilitated</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-gray-400 col-span-full text-center py-10">Loading...</p>
        ) : plots.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center py-10">No plots linked to your deals yet</p>
        ) : (
          plots.map((p) => (
            <div key={p.transaction_id} className="card space-y-3">
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="w-full h-36 object-cover rounded-lg bg-gray-100" onError={(e) => e.target.style.display = 'none'} />
              ) : (
                <div className="w-full h-36 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-sm">No Image</div>
              )}
              <h3 className="font-semibold text-gray-800">{p.title}</h3>
              <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={12} /> {p.location}</p>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-gray-500">Deal Amount</span>
                <span className="font-bold text-navy">₹{Number(p.deal_amount).toLocaleString('en-IN')}</span>
              </div>
              <Badge status={p.deal_status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyPlot;
