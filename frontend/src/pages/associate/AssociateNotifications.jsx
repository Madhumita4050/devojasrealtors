import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const AssociateNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/associate/notifications');
      setNotifications(res.data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markRead = async (id) => {
    await api.put(`/associate/notifications/${id}/read`);
    fetchNotifications();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <p className="text-gray-500 text-sm">Updates about your commissions, team and deals</p>
      </div>

      <div className="card p-0 divide-y">
        {loading ? (
          <p className="text-center py-10 text-gray-400">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-center py-10 text-gray-400">No notifications yet</p>
        ) : (
          notifications.map((n) => (
            <div key={n.id} onClick={() => !n.is_read && markRead(n.id)} className={`p-4 cursor-pointer hover:bg-gray-50 ${!n.is_read ? 'bg-blue-50/40' : ''}`}>
              <div className="flex items-start justify-between">
                <p className="font-medium text-gray-800 text-sm">{n.title}</p>
                {!n.is_read && <span className="w-2 h-2 rounded-full bg-navy mt-1.5 shrink-0" />}
              </div>
              <p className="text-sm text-gray-500 mt-1">{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssociateNotifications;
