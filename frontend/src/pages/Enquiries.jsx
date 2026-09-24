import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Badge from '../components/Badge';

// Shows callback/enquiry requests submitted from the public marketing website
const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/enquiries');
      setEnquiries(res.data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchEnquiries(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/enquiries/${id}`, { status });
    fetchEnquiries();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Website Enquiries</h1>
        <p className="text-gray-500 text-sm">Callback requests submitted from the public marketing website</p>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Location</th>
              <th className="text-left px-4 py-3">Budget</th>
              <th className="text-left px-4 py-3">Plot Size</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : enquiries.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-10 text-gray-400">No website enquiries yet</td></tr>
            ) : (
              enquiries.map((e) => (
                <tr key={e.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{e.name}</td>
                  <td className="px-4 py-3 text-gray-500">{e.phone}</td>
                  <td className="px-4 py-3 text-gray-500">{e.preferred_location || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{e.budget || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{e.plot_size || '—'}</td>
                  <td className="px-4 py-3"><Badge status={e.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <select value={e.status} onChange={(ev) => updateStatus(e.id, ev.target.value)} className="input-field text-xs py-1">
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Enquiries;
