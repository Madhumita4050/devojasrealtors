import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, IndianRupee, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const DailyRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: null, title: '', description: '', type: 'income', amount: '', record_date: new Date().toISOString().split('T')[0]
  });

  const fetchRecords = async () => {
    try {
      const res = await api.get('/daily-records');
      setRecords(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const openModal = (record = null) => {
    if (record) {
      setFormData({
        id: record.id,
        title: record.title,
        description: record.description,
        type: record.type,
        amount: record.amount,
        record_date: record.record_date
      });
      setIsEdit(true);
    } else {
      setFormData({
        id: null, title: '', description: '', type: 'income', amount: '', record_date: new Date().toISOString().split('T')[0]
      });
      setIsEdit(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/daily-records/${formData.id}`, formData);
      } else {
        await api.post('/daily-records', formData);
      }
      setIsModalOpen(false);
      fetchRecords();
    } catch (error) {
      alert('Error saving record: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.delete(`/daily-records/${id}`);
      fetchRecords();
    } catch (error) {
      alert('Error deleting record: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="p-6 h-screen overflow-y-auto bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Daily Records</h1>
            <p className="text-gray-500 text-sm">Manage daily income and expenses</p>
          </div>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> New Record
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Created By</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6 flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      {new Date(record.record_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-800">{record.title}</p>
                      {record.description && <p className="text-xs text-gray-500 truncate w-48">{record.description}</p>}
                    </td>
                    <td className="py-4 px-6">
                      {record.type === 'income' ? (
                        <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-medium w-max">
                          <ArrowDownCircle size={12} /> Income
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium w-max">
                          <ArrowUpCircle size={12} /> Expense
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      ₹ {Number(record.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-xs">
                      {record.creator?.name || '—'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openModal(record)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(record.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">No records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <Modal
          title={isEdit ? 'Edit Record' : 'New Record'}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Office supplies, Booking advance"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  className="input-field"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  className="input-field"
                  value={formData.record_date}
                  onChange={(e) => setFormData({ ...formData, record_date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="input-field pl-9"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                className="input-field h-24"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add any extra details..."
              ></textarea>
            </div>

            <button type="submit" className="btn-primary w-full mt-4">
              {isEdit ? 'Update Record' : 'Save Record'}
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default DailyRecords;
