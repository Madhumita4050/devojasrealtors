import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, ShieldCheck, ShieldAlert } from 'lucide-react';
import api from '../../api/axios';

const PlotDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plot, setPlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enquirySent, setEnquirySent] = useState(false);

  useEffect(() => {
    api.get(`/client/plots/${id}`)
      .then((res) => setPlot(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  const sendEnquiry = async () => {
    // Simple enquiry = raises a support complaint tagged with plot info,
    // admin will see it and connect buyer with seller.
    await api.post('/client/complaints', {
      subject: `Enquiry for plot: ${plot.title}`,
      message: `I'm interested in plot "${plot.title}" (ID: ${plot.id}) located at ${plot.location}. Please connect me with the seller.`
    });
    setEnquirySent(true);
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (!plot) return <div className="text-center py-20 text-gray-400">Plot not found</div>;

  return (
    <div className="space-y-5 max-w-3xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
        <ArrowLeft size={16} /> Back to Browse
      </button>

      <div className="card space-y-4">
        {plot.image_url ? (
          <img src={plot.image_url} alt={plot.title} className="w-full h-64 object-cover rounded-xl bg-gray-100" onError={(e) => e.target.style.display = 'none'} />
        ) : (
          <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-300">No Image Available</div>
        )}

        <div>
          <h1 className="text-2xl font-bold text-gray-800">{plot.title}</h1>
          <p className="text-gray-500 flex items-center gap-1 mt-1"><MapPin size={14} /> {plot.location}{plot.city ? `, ${plot.city}` : ''}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y">
          <div><p className="text-xs text-gray-400">Price</p><p className="text-xl font-bold text-navy">₹{Number(plot.price).toLocaleString('en-IN')}</p></div>
          <div><p className="text-xs text-gray-400">Size</p><p className="text-xl font-bold text-gray-800">{plot.size_sqft} sqft</p></div>
        </div>

        {plot.description && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
            <p className="text-sm text-gray-500">{plot.description}</p>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Seller: {plot.owner?.name}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              {plot.owner?.verified ? (
                <><ShieldCheck size={13} className="text-emerald-500" /> KYC Verified Seller</>
              ) : (
                <><ShieldAlert size={13} className="text-amber-500" /> KYC Not Verified Yet</>
              )}
            </p>
          </div>
        </div>

        {enquirySent ? (
          <div className="bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded-lg text-center">
            ✅ Enquiry sent! Our team will connect you with the seller shortly.
          </div>
        ) : (
          <button onClick={sendEnquiry} className="btn-primary w-full py-3">I'm Interested — Send Enquiry</button>
        )}
      </div>
    </div>
  );
};

export default PlotDetail;
