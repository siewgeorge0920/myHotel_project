import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagementSidebar from '../components/managementSidebar';
import axios from 'axios';
import { COLORS } from '../colors';

export default function StaffDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  // ====== Manager Mode State ======
  const [isManagerMode, setIsManagerMode] = useState(() => {
    if (user?.role === 'admin' || user?.role === 'manager') return true;
    return localStorage.getItem('managerMode') === 'true';
  });
  const [showManagerPrompt, setShowManagerPrompt] = useState(false);
  const [managerCreds, setManagerCreds] = useState({ username: '', password: '' });
  const [managerError, setManagerError] = useState('');

  const handleManagerSwitch = () => {
    if (isManagerMode) {
      // Toggle off
      setIsManagerMode(false);
      localStorage.setItem('managerMode', 'false');
    } else {
      setShowManagerPrompt(true);
      setManagerError('');
      setManagerCreds({ username: '', password: '' });
    }
  };

  const handleManagerLogin = async () => {
    try {
      const res = await axios.post('/api/login', managerCreds);
      const role = res.data.role;
      if (role === 'admin' || role === 'manager') {
        setIsManagerMode(true);
        localStorage.setItem('managerMode', 'true');
        setShowManagerPrompt(false);
        setManagerError('');
      } else {
        setManagerError('Access Denied. Manager or Admin credentials required.');
      }
    } catch (err) {
      setManagerError(err.response?.data?.message || 'Authentication Failed.');
    }
  };

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManagerMode} />
      
      <main className="flex-1 p-8 lg:p-16">
        {/* Header with Manager Mode Toggle */}
        <header className="mb-12 border-b pb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4" style={{ borderColor: COLORS.border }}>
          <div>
            <p className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-black mb-3">
              {isManagerMode ? '🔐 Manager Console' : 'Staff Console'}
            </p>
            <h1 className="text-4xl font-serif italic tracking-wide">
              Welcome, {user?.name || 'Sanctuary Member'}
            </h1>
          </div>

          {/* === MANAGER MODE SWITCH === */}
          {user?.role === 'staff' && (
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 self-start sm:self-auto">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-black">Mode</p>
                <p className={`text-xs font-bold uppercase tracking-widest ${isManagerMode ? 'text-amber-400' : 'text-white/60'}`}>
                  {isManagerMode ? 'Manager' : 'Staff'}
                </p>
              </div>
              <button
                onClick={handleManagerSwitch}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                  isManagerMode ? 'bg-amber-600' : 'bg-white/20'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                  isManagerMode ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          )}
        </header>

        {/* === MANAGER MODE CREDENTIAL PROMPT === */}
        {showManagerPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1e2219] border border-amber-600/40 shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
              <div className="flex justify-between items-center px-8 py-5 border-b border-white/10">
                <div>
                  <p className="text-amber-500 text-[10px] uppercase tracking-[0.4em] font-black">Security Check</p>
                  <h3 className="font-cinzel text-lg uppercase tracking-widest text-white">
                    {user?.role === 'admin' ? 'Admin Access' : 'Manager Access'}
                  </h3>
                </div>
                <button onClick={() => setShowManagerPrompt(false)} className="w-8 h-8 flex items-center justify-center border border-white/20 text-white/40 hover:text-white hover:border-white transition-all">✕</button>
              </div>

              <div className="p-8 space-y-5">
                {managerError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] p-3 text-center uppercase tracking-widest">
                    {managerError}
                  </div>
                )}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">Username</label>
                  <input
                    type="text"
                    value={managerCreds.username}
                    onChange={(e) => setManagerCreds({ ...managerCreds, username: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-amber-500 outline-none transition-all"
                    placeholder="Enter manager username"
                    onKeyDown={(e) => e.key === 'Enter' && handleManagerLogin()}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">Password</label>
                  <input
                    type="password"
                    value={managerCreds.password}
                    onChange={(e) => setManagerCreds({ ...managerCreds, password: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-amber-500 outline-none transition-all"
                    placeholder="••••••••"
                    onKeyDown={(e) => e.key === 'Enter' && handleManagerLogin()}
                  />
                </div>
                <button
                  onClick={handleManagerLogin}
                  className="w-full bg-amber-600 hover:bg-amber-700 py-4 text-[11px] font-black uppercase tracking-[0.4em] transition-all"
                >
                  Verify &amp; Unlock
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === STAFF CARDS (Basic) === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-10 border" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
            <h3 className="text-xl font-serif mb-4 italic">Booking Management</h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">Manage guest reservations, check-ins, and booking status across all wings.</p>
            <a href="/bookings" className="inline-block py-3 px-8 text-[10px] uppercase font-black tracking-widest border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white transition-all">
              Manage Bookings
            </a>
          </div>

          <div className="p-10 border" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
            <h3 className="text-xl font-serif mb-4 italic">Arrival Calendar</h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">View upcoming reservations and sanctuary occupancy levels.</p>
            <a href="/calendar" className="inline-block py-3 px-8 text-[10px] uppercase font-black tracking-widest border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white transition-all">
              View Calendar
            </a>
          </div>

          {/* === MANAGER-ONLY CARDS === */}
          {isManagerMode && (
            <>
                <div className="p-10 border border-amber-600/30" style={{ backgroundColor: '#1e2219' }}>
                <h3 className="text-xl font-serif mb-4 italic text-amber-400">Staff Management</h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">Manage staff accounts, assign roles, and monitor activity.</p>
                <a href="/adminIam" className="inline-block py-3 px-8 text-[10px] uppercase font-black tracking-widest border border-amber-600 text-amber-500 hover:bg-amber-600 hover:text-white transition-all">
                  Manage Staff
                </a>
              </div>

              <div className="p-10 border border-amber-600/30" style={{ backgroundColor: '#1e2219' }}>
                <h3 className="text-xl font-serif mb-4 italic text-amber-400">System Audit Logs</h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">Review system activity, login history, and audit trails.</p>
                <a href="/adminLogs" className="inline-block py-3 px-8 text-[10px] uppercase font-black tracking-widest border border-amber-600 text-amber-500 hover:bg-amber-600 hover:text-white transition-all">
                  View Logs
                </a>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}