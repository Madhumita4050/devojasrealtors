import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import Badge from '../../components/Badge';

const emptyForm = { title: '', description: '', location: '', city: '', size_sqft: '', price: '', image_url: '' };

const MyPlots = () => {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState('');

  const fetchPlots = async () => {
    setLoading(true);
    try {
      const res = await api.get('/client/my-plots');
      setPlots(res.data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchPlots();
    // If URL is /client/my-plots/add, auto-open the add modal
    if (window.location.pathname.endsWith('/add')) openAddModal();
  }, []);

  const openAddModal = () => { setEditingPlot(null); setForm(emptyForm); setError(''); setModalOpen(true); };
  const openEditModal = (plot) => {
    setEditingPlot(plot);
    setForm({
      title: plot.title, description: plot.description || '', location: plot.location,
      city: plot.city || '', size_sqft: plot.size_sqft, price: plot.price, image_url: plot.image_url || ''
    });
    setError(''); setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingPlot) await api.put(`/client/plots/${editingPlot.id}`, form);
      else await api.post('/client/plots', form);
      setModalOpen(false);
      fetchPlots();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/client/plots/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchPlots();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Plots</h1>
          <p className="text-gray-500 text-sm">Plots you've listed for sale</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add New Plot
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-gray-400 col-span-full text-center py-10">Loading...</p>
        ) : plots.length === 0 ? (
          <div className="col-span-full text-center py-14 text-gray-400">
            <p className="mb-3">You haven't listed any plots yet.</p>
            <button onClick={openAddModal} className="btn-primary">List Your First Plot</button>
          </div>
        ) : (
          plots.map((p) => (
            <div key={p.id} className="card space-y-3">
              <div>
                <h3 className="font-semibold text-gray-800">{p.title}</h3>
                <p className="text-xs text-gray-400">{p.location}{p.city ? `, ${p.city}` : ''}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{p.size_sqft} sqft</span>
                <span className="font-bold text-navy">₹{Number(p.price).toLocaleString('en-IN')}</span>
              </div>
              <Badge status={p.status} />
              {p.status !== 'sold' && (
                <div className="flex items-center gap-2 pt-2 border-t">
                  <button onClick={() => openEditModal(p)} className="p-2 text-navy hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                  <button onClick={() => setDeleteTarget(p)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <Modal title={editingPlot ? 'Edit Plot' : 'Add New Plot'} isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
              <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Size (sqft)</label>
              <input required type="number" value={form.size_sqft} onChange={(e) => setForm({ ...form, size_sqft: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Price (₹)</label>
              <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Image URL</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" placeholder="https://..." />
          </div>
          <p className="text-xs text-gray-400">Naya plot admin approval ke baad hi marketplace me dikhega.</p>
          <button type="submit" className="btn-primary w-full">{editingPlot ? 'Update Plot' : 'Submit for Approval'}</button>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete this plot?" message={`"${deleteTarget?.title}" will be permanently removed.`} />
    </div>
  );
};

export default MyPlots;
