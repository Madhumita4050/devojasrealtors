import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import api from '../api/axios';
import Badge from '../components/Badge';

// Sirf "Associate" hota hai is business me — seller/buyer wala split hata diya
// gaya hai (UI level pe). Backend me dono pairs sync rehte hain taaki kuch
// bhi break na ho.
const roleLevelLabel = (role_level = '') => {
  if (role_level.includes('associate')) return 'Associate';
  if (role_level.includes('referrer')) return 'Referrer / Upline';
  return role_level.replace(/_/g, ' ');
};

const Commissions = () => {
  const [commissions, setCommissions] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [commRes, settingsRes] = await Promise.all([
        api.get('/commissions'),
        api.get('/commissions/settings')
      ]);
      setCommissions(commRes.data.data);
      setSettings(settingsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Ek hi "Associate %" aur "Referrer %" field admin ko dikhta hai —
      // backend me dono (seller_/buyer_) pairs isi value se sync ho jate hain.
      await api.put('/commissions/settings', {
        seller_associate_percent: settings.associate_percent,
        buyer_associate_percent: settings.associate_percent,
        seller_referrer_percent: settings.referrer_percent,
        buyer_referrer_percent: settings.referrer_percent
      });
      setSavedMsg('Payroll settings updated successfully!');
      setTimeout(() => setSavedMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Payroll — Associate Commission</h1>
        <p className="text-gray-500 text-sm">Set the Associate commission % and view payout history</p>
      </div>

      {/* Commission Settings Form */}
      {settings && (
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Commission Settings</h3>
          <p className="text-xs text-gray-400 mb-4">
            Note: Every self-registered Associate gets a fixed 5% commission by default (set at signup).
            The rates below apply to deal-level payouts across your network.
          </p>
          {savedMsg && <div className="bg-emerald-50 text-emerald-600 text-sm px-3 py-2 rounded-lg mb-4">{savedMsg}</div>}
          <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Associate Commission %</label>
              <input type="number" step="0.1"
                value={settings.associate_percent ?? settings.seller_associate_percent ?? 5}
                onChange={(e) => setSettings({ ...settings, associate_percent: e.target.value })}
                className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Referrer / Upline Commission %</label>
              <input type="number" step="0.1"
                value={settings.referrer_percent ?? settings.seller_referrer_percent ?? 1}
                onChange={(e) => setSettings({ ...settings, referrer_percent: e.target.value })}
                className="input-field" />
            </div>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 justify-center sm:col-span-2">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      )}

      {/* Commission History */}
      <div className="card overflow-x-auto p-0">
        <div className="px-5 py-4 border-b"><h3 className="font-semibold text-gray-800">Associate Payout History</h3></div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Associate</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">%</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : commissions.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-10 text-gray-400">No commissions yet</td></tr>
            ) : (
              commissions.map((c) => (
                <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{c.earner?.name}</td>
                  <td className="px-4 py-3 text-gray-500">{roleLevelLabel(c.role_level)}</td>
                  <td className="px-4 py-3 text-gray-500">{c.percent}%</td>
                  <td className="px-4 py-3 font-semibold text-navy">₹{Number(c.amount).toLocaleString('en-IN')}</td>
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

export default Commissions;
