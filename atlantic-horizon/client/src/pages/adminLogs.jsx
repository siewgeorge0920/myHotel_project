import React, { useState, useEffect } from 'react';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';

// Optional action-to-color mapping for quick visual scanning in the table.
const ACTION_COLOR = {
  STAFF_CREATED: 'text-green-400',
  STAFF_UPDATED: 'text-amber-400',
  STAFF_DELETED: 'text-red-400',
};

export default function AdminLogs() {
  // Session context for sidebar behavior.
  const user = JSON.parse(localStorage.getItem('user'));
  const isManagerMode = localStorage.getItem('managerMode') === 'true';

  // Audit log data and page status state.
  const [logs, setLogs] = useState([]);
  const [lastRefreshed, setLastRefreshed] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch audit logs and update refresh timestamp.
  const fetchLogs = () => {
    fetch('/api/logs')
      .then(r => r.json())
      .then(data => {
        setLogs(data.data || []);
        setLastRefreshed(new Date().toLocaleTimeString());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Initial fetch + background polling every 10 seconds.
  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManagerMode} />
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto">
        <header className="mb-10 border-b pb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4" style={{ borderColor: COLORS.border }}>
          <div>
            <p className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-black mb-2">Manager Control</p>
            <h1 className="text-4xl font-serif italic">System Audit Log</h1>
            <p className="text-white/30 text-xs mt-2 uppercase tracking-widest">
              Auto-refresh every 10s &nbsp;·&nbsp; Last: {lastRefreshed}
            </p>
          </div>
          <button onClick={fetchLogs}
            className="px-6 py-3 border border-white/20 text-[10px] uppercase font-black tracking-widest hover:bg-white/5 hover:border-white/40 transition-all">
            ↻ Refresh Now
          </button>
        </header>

        {/* Render state: loading, empty state, or populated audit table. */}
        {loading ? (
          <p className="text-white/20 text-xs uppercase tracking-widest animate-pulse">Loading audit records...</p>
        ) : logs.length === 0 ? (
          <div className="p-12 border border-dashed text-center text-white/20 uppercase tracking-widest text-xs" style={{ borderColor: COLORS.border }}>
            No audit records yet.
          </div>
        ) : (
          <div className="border overflow-hidden" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-amber-500 font-black">
                <tr>
                  <th className="p-5">Time</th>
                  <th className="p-5">Action</th>
                  <th className="p-5">Performed By</th>
                  <th className="p-5">Target ID</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: COLORS.border }}>
                {logs.map((log, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-5 text-xs text-white/40 font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-5">
                      <span className={`text-[10px] uppercase font-black tracking-widest ${ACTION_COLOR[log.action] || 'text-white/50'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-5 text-sm font-serif">{log.performedBy}</td>
                    <td className="p-5 font-mono text-xs text-white/30">{log.targetId || '—'}</td>
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