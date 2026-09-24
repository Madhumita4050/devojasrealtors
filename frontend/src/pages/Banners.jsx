import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import api from '../api/axios';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const emptyForm = { title: '', image_url: '', link_url: '', is_active: true };

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await api.get('/banners');
      setBanners(res.data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchBanners(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (b) => { setEditing(b); setForm(b); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await api.put(`/banners/${editing.id}`, form);
    else await api.post('/banners', form);
    setModalOpen(false);
    fetchBanners();
  };

  const handleDelete = async () => {
    await api.delete(`/banners/${deleteTarget.id}`);
    setDeleteTarget(null);
    fetchBanners();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Content / Banners</h1>
          <p className="text-gray-500 text-sm">Manage homepage banners and offers</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus size={18} /> Add Banner</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <p className="text-gray-400 col-span-full text-center py-10">Loading...</p> :
          banners.length === 0 ? <p className="text-gray-400 col-span-full text-center py-10">No banners yet</p> :
          banners.map((b) => (
            <div key={b.id} className="card space-y-2">
              <img src={b.image_url} alt={b.title} className="w-full h-32 object-cover rounded-lg bg-gray-100" onError={(e) => e.target.style.display = 'none'} />
              <h3 className="font-semibold text-gray-800">{b.title}</h3>
              <span className={`badge ${b.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{b.is_active ? 'Active' : 'Inactive'}</span>
              <div className="flex gap-2 pt-2 border-t">
                <button onClick={() => openEdit(b)} className="p-2 text-navy hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                <button onClick={() => setDeleteTarget(b)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          ))
        }
      </div>

      <Modal title={editing ? 'Edit Banner' : 'Add Banner'} isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" /></div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Image URL</label>
            <input required value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" /></div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Link URL (optional)</label>
            <input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} className="input-field" /></div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active
          </label>
          <button type="submit" className="btn-primary w-full">{editing ? 'Update' : 'Create'} Banner</button>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete this banner?" />
    </div>
  );
};

export default Banners;
