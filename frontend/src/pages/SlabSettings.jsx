import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import api from '../api/axios';

const SlabSettings = () => {
  const [slabs, setSlabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchSlabs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/slabs');
      setSlabs(res.data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchSlabs(); }, []);

  const updateField = (id, field, value) => {
    setSlabs(slabs.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const saveSlab = async (slab) => {
    await api.put(`/slabs/${slab.id}`, {
      min_amount: slab.min_amount,
      max_amount: slab.max_amount,
      percentage: slab.percentage,
      reward_amount: slab.reward_amount
    });
    setMsg(`Slab ${slab.slab_number} updated!`);
    setTimeout(() => setMsg(''), 2500);
  };

  const addSlab = async () => {
    const nextNumber = slabs.length > 0 ? Math.max(...slabs.map((s) => s.slab_number)) + 1 : 1;
    const res = await api.post('/slabs', { slab_number: nextNumber, min_amount: 0, max_amount: 0, percentage: 0, reward_amount: 0 });
    setSlabs([...slabs, res.data.data]);
  };

  const deleteSlab = async (id) => {
    await api.delete(`/slabs/${id}`);
    fetchSlabs();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Slab Settings</h1>
        <p className="text-gray-500 text-sm">Business-volume based commission slabs — fully editable, drives automatic commission upgrades</p>
      </div>

      {msg && <div className="bg-emerald-50 text-emerald-600 text-sm px-4 py-2 rounded-lg">{msg}</div>}

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Slab #</th>
              <th className="text-left px-4 py-3">Min Amount (₹)</th>
              <th className="text-left px-4 py-3">Max Amount (₹)</th>
              <th className="text-left px-4 py-3">Percentage (%)</th>
              <th className="text-left px-4 py-3">Reward (₹)</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : (
              slabs.map((slab) => (
                <tr key={slab.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-semibold text-gray-700">Slab {slab.slab_number}</td>
                  <td className="px-4 py-2">
                    <input type="number" value={slab.min_amount} onChange={(e) => updateField(slab.id, 'min_amount', e.target.value)} className="input-field w-32 text-sm" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" value={slab.max_amount} onChange={(e) => updateField(slab.id, 'max_amount', e.target.value)} className="input-field w-32 text-sm" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" step="0.1" value={slab.percentage} onChange={(e) => updateField(slab.id, 'percentage', e.target.value)} className="input-field w-20 text-sm" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" value={slab.reward_amount} onChange={(e) => updateField(slab.id, 'reward_amount', e.target.value)} className="input-field w-28 text-sm" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => saveSlab(slab)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"><Save size={16} /></button>
                      <button onClick={() => deleteSlab(slab.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button onClick={addSlab} className="btn-primary flex items-center gap-2">
        <Plus size={16} /> Add New Slab
      </button>
    </div>
  );
};

export default SlabSettings;
