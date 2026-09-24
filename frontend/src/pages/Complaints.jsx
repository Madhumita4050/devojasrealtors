import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Badge from '../components/Badge';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/complaints/${id}`, { status });
    fetchComplaints();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Support / Complaints</h1>
        <p className="text-gray-500 text-sm">User queries and complaint tickets</p>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Subject</th>
              <th className="text-left px-4 py-3">Message</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : complaints.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-10 text-gray-400">No complaints yet</td></tr>
            ) : (
              complaints.map((c) => (
                <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{c.user?.name}</td>
                  <td className="px-4 py-3">{c.subject}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{c.message}</td>
                  <td className="px-4 py-3"><Badge status={c.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <select value={c.status} onChange={(e) => updateStatus(c.id, e.target.value)} className="input-field text-xs py-1">
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
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

export default Complaints;
