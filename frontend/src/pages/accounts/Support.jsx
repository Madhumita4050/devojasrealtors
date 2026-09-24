import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Badge from '../../components/Badge';

const Support = () => {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ subject: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/accounts/complaints');
      setComplaints(res.data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/accounts/complaints', form);
      setForm({ subject: '', message: '' });
      setMsg('Query submitted to Admin!');
      fetchComplaints();
      setTimeout(() => setMsg(''), 4000);
    } finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Support</h1>
        <p className="text-gray-500 text-sm">Raise a finance-related query to Admin</p>
      </div>

      <div className="card max-w-xl">
        <h3 className="font-semibold text-gray-800 mb-4">Raise a New Query</h3>
        {msg && <div className="bg-emerald-50 text-emerald-600 text-sm px-3 py-2 rounded-lg mb-4">{msg}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Subject</label>
            <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Message</label>
            <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field" rows={4} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
            {submitting ? 'Submitting...' : 'Submit Query'}
          </button>
        </form>
      </div>

      <div className="card overflow-x-auto p-0">
        <div className="px-5 py-4 border-b"><h3 className="font-semibold text-gray-800">My Queries History</h3></div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Subject</th>
              <th className="text-left px-4 py-3">Message</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : complaints.length === 0 ? (
              <tr><td colSpan="3" className="text-center py-10 text-gray-400">No queries raised yet</td></tr>
            ) : (
              complaints.map((c) => (
                <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{c.subject}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{c.message}</td>
                  <td className="px-4 py-3"><Badge status={c.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Support;
