import React, { useState, useEffect } from 'react';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';

// Optional action-to-color mapping for quick visual scanning in the table.
const ACTION_COLOR = {
  STAFF_LOGIN: 'text-green-400',
  STAFF_HIRE: 'text-emerald-400',
  STAFF_UPDATE: 'text-sky-400',
  STAFF_FIRE: 'text-rose-500',
  BOOKING_CREATE: 'text-amber-400',
  BOOKING_UPDATE: 'text-indigo-400',
  BOOKING_DELETE: 'text-red-500',
  GIFT_CARD_ISSUE: 'text-purple-400',
  ROOM_CREATE: 'text-teal-400',
  ROOM_ASSIGN: 'text-orange-400'
};

const TimeLeft = ({ expiry }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const diff = new Date(expiry) - new Date();
      if (diff <= 0) return 'Expired';
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      
      return `${hours}h ${mins}m ${secs}s`;
    };

    const interval = setInterval(() => setTimeLeft(calculateTime()), 1000);
    setTimeLeft(calculateTime());
    return () => clearInterval(interval);
  }, [expiry]);

  return <span>{timeLeft}</span>;
};

export default function AdminLogs() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isManagerMode = localStorage.getItem('managerMode') === 'true';

  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'login'
  const [filter, setFilter] = useState('All');
  const [logs, setLogs] = useState([]);
  const [lastRefreshed, setLastRefreshed] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    setLoading(true);
    const endpoint = activeTab === 'user' ? '/api/logs/actions' : '/api/logs/logins';
    
    fetch(endpoint, {
      headers: { 'Authorization': `Bearer ${user?.token}` },
      credentials: 'include'
    })
      .then(r => r.json())
      .then(data => {
        setLogs(data.data || []);
        setLastRefreshed(new Date().toLocaleTimeString());
        setLoading(false);
      })
      .catch((err) => {
        console.error("Logs fetch failed:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 15000); 
    return () => clearInterval(interval);
  }, [activeTab]);

  const filteredLogs = filter === 'All' ? logs : logs.filter(l => l.action === filter);

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManagerMode} />
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto">
        <header className="mb-10 border-b pb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4" style={{ borderColor: COLORS.border }}>
          <div>
            <p className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-black mb-2">Manager Control</p>
            <h1 className="text-4xl font-serif italic uppercase tracking-tighter">Logs</h1>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveTab('user')}
                  className={`text-[10px] uppercase font-black tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'user' ? 'text-amber-500 border-amber-500' : 'text-white/20 border-transparent hover:text-white/50'}`}
                >
                  User Logs
                </button>
                <button 
                  onClick={() => setActiveTab('login')}
                  className={`text-[10px] uppercase font-black tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'login' ? 'text-amber-500 border-amber-500' : 'text-white/20 border-transparent hover:text-white/50'}`}
                >
                  Login Logs
                </button>
              </div>

              {activeTab === 'user' && (
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-white/5 border border-white/10 text-[9px] uppercase font-black tracking-widest px-3 py-1 outline-none text-white/60 hover:border-white/20"
                >
                  <option value="All">All Actions</option>
                  <option value="BOOKING_CREATE">Bookings</option>
                  <option value="GIFT_CARD_ISSUE">Gift Cards</option>
                  <option value="STAFF_LOGIN">Logins</option>
                  <option value="STAFF_UPDATE">Staff Edits</option>
                  <option value="ROOM_ASSIGN">Room Management</option>
                </select>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="text-white/30 text-[9px] uppercase tracking-widest">
              Last Synced: {lastRefreshed}
            </p>
            <button onClick={fetchLogs}
              className="px-6 py-3 border border-white/10 text-[10px] uppercase font-black tracking-widest hover:bg-white/5 hover:border-white/30 transition-all">
              ↻ Sync Now
            </button>
          </div>
        </header>

        {loading ? (
          <p className="text-white/20 text-xs uppercase tracking-widest animate-pulse">Synchronizing records...</p>
        ) : logs.length === 0 ? (
          <div className="p-12 border border-dashed text-center text-white/20 uppercase tracking-widest text-xs" style={{ borderColor: COLORS.border }}>
            No records found in this sequence.
          </div>
        ) : (
          <div className="border overflow-hidden" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-amber-500 font-black">
                {activeTab === 'user' ? (
                  <tr>
                    <th className="p-5">Timestamp</th>
                    <th className="p-5">Event</th>
                    <th className="p-5">Agent</th>
                    <th className="p-5 text-right">Reference</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="p-5">Joined at</th>
                    <th className="p-5">Staff Identity</th>
                    <th className="p-5">Origin (IP)</th>
                    <th className="p-5 text-right">Expiration</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y" style={{ borderColor: COLORS.border }}>
                {filteredLogs.map((log, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    {activeTab === 'user' ? (
                      <>
                        <td className="p-5 text-[10px] text-white/40 font-mono italic">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          <br/>
                          <span className="opacity-40">{new Date(log.timestamp).toLocaleDateString()}</span>
                        </td>
                        <td className="p-5">
                          <span className={`text-[10px] uppercase font-black tracking-widest ${ACTION_COLOR[log.action] || 'text-white/50'}`}>
                            {log.action?.replace(/_/g, ' ')}
                          </span>
                          <p className="text-[10px] text-white/30 mt-1 italic">{log.details}</p>
                        </td>
                        <td className="p-5 text-sm font-serif">{log.performed_by || 'System'}</td>
                        <td className="p-5 font-mono text-[10px] text-white/30 text-right">{log.target_id || '—'}</td>
                      </>
                    ) : (
                      <>
                        <td className="p-5 text-[10px] text-white/40 font-mono italic">
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          <br/>
                          <span className="opacity-40">{new Date(log.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="p-5">
                          <div className="font-serif text-sm">{log.name}</div>
                          <div className="text-[9px] uppercase tracking-widest text-amber-500/50 font-black mt-1">
                            {log.role}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="text-[10px] text-white/60 font-mono">{log.location?.ip}</div>
                          <div className="text-[9px] text-white/20 uppercase tracking-widest mt-1">
                            {log.location?.city || 'Unknown Location'}
                          </div>
                        </td>
                        <td className="p-5 text-right">
                          <div className="text-[10px] text-white/40 font-mono uppercase tracking-widest">
                            <TimeLeft expiry={log.expires_at} />
                          </div>
                          <div className="text-[8px] text-red-500/40 uppercase font-black mt-1">
                            Auto-Terminating
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}