import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, ShieldCheck, ShieldX, Ban, CheckCircle, LogIn, CheckSquare, XSquare } from 'lucide-react';
import api from '../api/axios';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Badge from '../components/Badge';

const emptyForm = { name: '', email: '', phone: '', password: '', role: 'client', referred_by: '', pan_number: '', aadhar_number: '', referral_commission_percent: '' };

const roleLabels = { client: 'Client', associate: 'Associate', accounts: 'Accounts', admin: 'Admin' };

const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [associates, setAssociates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState('');
  const [createdCreds, setCreatedCreds] = useState(null);

  const currentRole = searchParams.get('role') || '';
  const currentKyc = searchParams.get('kyc_status') || '';
  const currentStatus = searchParams.get('status') || '';

  const activeTab = currentStatus === 'pending_approval' ? 'pending' : (currentKyc ? 'kyc' : (currentRole || 'all'));

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (currentRole) params.role = currentRole;
      if (currentKyc) params.kyc_status = currentKyc;
      if (currentStatus) params.status = currentStatus;
      if (search) params.search = search;
      const res = await api.get('/users', { params });
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssociates = async () => {
    try {
      const res = await api.get('/users', { params: { role: 'associate' } });
      setAssociates(res.data.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchUsers(); }, [currentRole, currentKyc, currentStatus, search]);
  useEffect(() => { fetchAssociates(); }, []);

  const setTab = (tab) => {
    if (tab === 'all') setSearchParams({});
    else if (tab === 'kyc') setSearchParams({ kyc_status: 'pending' });
    else if (tab === 'pending') setSearchParams({ role: 'associate', status: 'pending_approval' });
    else setSearchParams({ role: tab });
  };

  const openAddModal = () => {
    setEditingUser(null);
    // Jis tab se "Add User" click hua ho (Client / Associate / Accounts),
    // us tab ka role form me already filled aa jaye.
    const prefillRole = ['associate', 'client', 'accounts'].includes(currentRole) ? currentRole : 'associate';
    setForm({
      ...emptyForm,
      role: prefillRole,
      referral_commission_percent: prefillRole === 'associate' ? 5 : ''
    });
    setError('');
    setCreatedCreds(null);
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email || '',
      phone: user.phone,
      password: '',
      role: user.role,
      referred_by: user.referred_by || '',
      pan_number: user.pan_number || '',
      aadhar_number: user.aadhar_number || '',
      referral_commission_percent: user.referral_commission_percent || ''
    });
    setError('');
    setModalOpen(true);
  };

  const getAddButtonTitle = () => {
    if (currentRole === 'associate') return 'Add New Associate';
    if (currentRole === 'client') return 'Add New Client';
    if (currentRole === 'accounts') return 'Add Accounts User';
    return 'Add New User';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, form);
        setModalOpen(false);
      } else {
        const res = await api.post('/users', form);
        if (form.role === 'associate') {
          // Password system ne khud generate kiya hai — admin ko yahin dikhado
          setCreatedCreds({
            referral_code: res.data.data.referral_code,
            loginId: res.data.data.email || res.data.data.phone,
            generatedPassword: res.data.generatedPassword,
            emailSent: res.data.emailSent
          });
        } else {
          setModalOpen(false);
        }
      }
      fetchUsers();
      fetchAssociates();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleKyc = async (id, status) => {
    await api.put(`/users/${id}/kyc`, { kyc_status: status });
    fetchUsers();
  };

  const handleApproveAssociate = async (id) => {
    try {
      await api.post(`/users/${id}/approve`);
      fetchUsers();
    } catch (err) { alert(err.response?.data?.message || 'Error approving'); }
  };

  const handleRejectAssociate = async (id) => {
    const reason = window.prompt("Enter rejection reason:");
    if (reason === null) return;
    try {
      await api.post(`/users/${id}/reject`, { rejection_reason: reason });
      fetchUsers();
    } catch (err) { alert(err.response?.data?.message || 'Error rejecting'); }
  };

  const handleImpersonate = async (id) => {
    try {
      const res = await api.post(`/users/${id}/impersonate`);
      const { token } = res.data;
      const impersonationUrl = `${window.location.origin}/associate?impersonation_token=${token}`;
      window.open(impersonationUrl, '_blank');
    } catch (err) { alert(err.response?.data?.message || 'Error impersonating'); }
  };

  const toggleStatus = async (id) => {
    await api.put(`/users/${id}/status`);
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage associates, clients, and accounts users with role-specific access</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> {getAddButtonTitle()}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setTab('all')}
          className={`px-4 py-2 rounded-xl text-sm sm:text-base font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All Users
        </button>
        <button
          onClick={() => setTab('associate')}
          className={`px-4 py-2 rounded-xl text-sm sm:text-base font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'associate'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>All Associates</span>
          {activeTab === 'associate' && <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full font-bold">Active</span>}
        </button>
        <button
          onClick={() => setTab('client')}
          className={`px-4 py-2 rounded-xl text-sm sm:text-base font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'client'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>All Clients</span>
          {activeTab === 'client' && <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full font-bold">Active</span>}
        </button>
        <button
          onClick={() => setTab('accounts')}
          className={`px-4 py-2 rounded-xl text-sm sm:text-base font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'accounts'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>All Accounts</span>
          {activeTab === 'accounts' && <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full font-bold">Active</span>}
        </button>
        <button
          onClick={() => setTab('kyc')}
          className={`px-4 py-2 rounded-xl text-sm sm:text-base font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'kyc'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Pending KYC</span>
        </button>
        <button
          onClick={() => setTab('pending')}
          className={`px-4 py-2 rounded-xl text-sm sm:text-base font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Pending Associates</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, phone or login ID..."
          className="input-field pl-10"
        />
      </div>

      <div className="card overflow-x-auto p-0 border border-slate-200">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name & ID</th>
              <th>Contact Details</th>
              <th>Role</th>
              <th>KYC Status</th>
              <th>Account Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center py-12 text-slate-400 text-base">Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-12 text-slate-400 text-base">No users found in this tab</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="font-bold text-slate-900 text-base">{u.name}</div>
                    {u.login_id && (
                      <span className="inline-block text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 mt-1">
                        {u.login_id}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="text-slate-800 font-medium">{u.email || 'No email'}</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{u.phone}</div>
                    {u.plain_password && (
                      <div className="text-xs font-mono mt-1 text-red-600 bg-red-50 px-1 py-0.5 inline-block rounded border border-red-200" title="Password">
                        Pwd: {u.plain_password}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      u.role === 'associate' ? 'bg-blue-100 text-blue-800' :
                      u.role === 'client' ? 'bg-emerald-100 text-emerald-800' :
                      u.role === 'accounts' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td><Badge status={u.kyc_status} /></td>
                  <td><Badge status={u.status} /></td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      {u.kyc_status === 'pending' && (
                        <>
                          <button onClick={() => handleKyc(u.id, 'approved')} title="Approve KYC" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl">
                            <ShieldCheck size={18} />
                          </button>
                          <button onClick={() => handleKyc(u.id, 'rejected')} title="Reject KYC" className="p-2 text-red-500 hover:bg-red-50 rounded-xl">
                            <ShieldX size={18} />
                          </button>
                        </>
                      )}
                      {u.status === 'pending_approval' && u.role === 'associate' && (
                        <>
                          <button onClick={() => handleApproveAssociate(u.id)} title="Approve Associate" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl">
                            <CheckSquare size={18} />
                          </button>
                          <button onClick={() => handleRejectAssociate(u.id)} title="Reject Associate" className="p-2 text-red-500 hover:bg-red-50 rounded-xl">
                            <XSquare size={18} />
                          </button>
                        </>
                      )}
                      {u.role === 'associate' && u.status === 'active' && (
                        <button onClick={() => handleImpersonate(u.id)} title="Login as Associate" className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl border border-blue-200">
                          <LogIn size={18} />
                        </button>
                      )}
                      <button onClick={() => toggleStatus(u.id)} title={u.status === 'active' ? 'Block user' : 'Unblock user'} className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl">
                        {u.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
                      </button>
                      <button onClick={() => openEditModal(u)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setDeleteTarget(u)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        title={editingUser ? `Edit ${editingUser.name}` : getAddButtonTitle()}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setCreatedCreds(null); }}
      >
        {createdCreds ? (
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto text-emerald-500" size={44} />
            <h3 className="text-xl font-bold text-slate-900">Associate Account Created!</h3>
            <p className="text-sm text-slate-500">
              {createdCreds.emailSent ? 'Login details have also been emailed to the associate.' : 'Email not configured — share these details with the associate manually.'}
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-3 text-base">
              <div className="flex justify-between"><span className="text-slate-500">Associate ID</span><span className="font-bold text-slate-900">{createdCreds.referral_code}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Login ID</span><span className="font-bold text-blue-600">{createdCreds.loginId}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Password</span><span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{createdCreds.generatedPassword}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Commission</span><span className="font-bold text-slate-900">5%</span></div>
            </div>
            <button className="btn-primary w-full text-base py-3" onClick={() => setModalOpen(false)}>Done</button>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-xl border border-red-200 font-medium">{error}</div>}
          
          {/* Pre-filled role indicator banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-blue-900">Selected Role:</span>
            <span className="bg-blue-600 text-white font-bold text-xs uppercase px-3 py-1 rounded-full tracking-wider">
              {roleLabels[form.role] || form.role}
            </span>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Full Name *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Enter full legal name" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Email (optional)</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="Optional for clients, recommended for associate" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Phone Number *</label>
            <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="10-digit mobile number" />
          </div>
          {!editingUser && form.role !== 'associate' && (
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Account Password *</label>
              <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" placeholder="Minimum 6 characters" />
            </div>
          )}
          {!editingUser && form.role === 'associate' && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs px-3.5 py-2.5 rounded-xl font-medium">
              Password will be auto-generated securely by the system and shown on completion.
            </div>
          )}
          {/* Only show role dropdown if we are on the generic All Users tab, otherwise lock it to the active tab's role */}
          {activeTab === 'all' && (
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Role</label>
              <select
                value={form.role}
                onChange={(e) => {
                  const newRole = e.target.value;
                  setForm({
                    ...form,
                    role: newRole,
                    referral_commission_percent: newRole === 'associate' ? (form.referral_commission_percent || 5) : form.referral_commission_percent
                  });
                }}
                className="input-field"
              >
                <option value="associate">Associate</option>
                <option value="client">Client</option>
                <option value="accounts">Accounts</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          {form.role === 'associate' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">PAN Number <span className="text-red-500">*</span></label>
                <input required value={form.pan_number} onChange={(e) => setForm({ ...form, pan_number: e.target.value })} className="input-field" placeholder="ABCDE1234F" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Aadhar Number <span className="text-red-500">*</span></label>
                <input required value={form.aadhar_number} onChange={(e) => setForm({ ...form, aadhar_number: e.target.value })} className="input-field" placeholder="12-digit UIDAI" />
              </div>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Referred By (Associate)</label>
            <select value={form.referred_by} onChange={(e) => setForm({ ...form, referred_by: e.target.value })} className="input-field">
              <option value="">None</option>
              {associates.filter(a => a.id !== editingUser?.id).map((a) => (
                <option key={a.id} value={a.id}>{a.name} ({a.referral_code})</option>
              ))}
            </select>
          </div>
          {(form.referred_by || form.role === 'associate') && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Commission % {form.role === 'associate' ? '(fixed for Associates)' : 'This User Gives To Referrer'}</label>
              <input
                type="number" step="0.1"
                value={form.referral_commission_percent}
                disabled={form.role === 'associate'}
                onChange={(e) => setForm({ ...form, referral_commission_percent: e.target.value })}
                className="input-field disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="e.g. 10"
              />
              <p className="text-xs text-gray-400 mt-1">
                {form.role === 'associate' ? 'Every Associate gets a fixed 5% commission.' : 'Fixed % the referrer earns whenever this user closes a deal — set once here by Admin.'}
              </p>
            </div>
          )}
          <button type="submit" className="btn-primary w-full">{editingUser ? 'Update User' : 'Create User'}</button>
        </form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this user?"
        message={`"${deleteTarget?.name}" will be permanently removed.`}
      />
    </div>
  );
};

export default Users;
