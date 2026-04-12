import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagementSidebar from '../components/managementSidebar';
import axios from 'axios';
import { COLORS } from '../colors';

export default function StaffDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  // Manager Mode State 
  const [isManagerMode, setIsManagerMode] = useState(() => {
    if (user?.role === 'admin' || user?.role === 'manager') return true;
    return localStorage.getItem('managerMode') === 'true';
  });
  const [showManagerPrompt, setShowManagerPrompt] = useState(false);
  const [managerCreds, setManagerCreds] = useState({ username: '', password: '' });
  const [managerError, setManagerError] = useState('');

  const handleManagerSwitch = () => {
    if (isManagerMode) {
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
      // 🚀 Migration to Secure V3 Auth Endpoint
      const res = await axios.post('/api/v3/auth/login', managerCreds);
      const { role } = res.data;
      if (role === 'admin' || role === 'manager') {
        setIsManagerMode(true);
        localStorage.setItem('managerMode', 'true');
        setShowManagerPrompt(false);
        setManagerError('');
      } else {
        setManagerError('Access Denied. Manager or Admin credentials required.');
      }
    } catch (err) {
      setManagerError(err.response?.data?.error || 'V3 Authentication Failed.');
    }
  };

  return (
    <div className="flex min-h-screen text-white font-sans selection:bg-amber-500/30" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManagerMode} />
      
      <main className="flex-1 p-8 lg:p-20 overflow-x-hidden">
        {/* V3 HEADER SECTION */}
        <header className="mb-20 border-b pb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              <p className="text-amber-500 uppercase tracking-[0.6em] text-[10px] font-black">
                {isManagerMode ? '🔐 Operational Secure Tier (V3)' : 'Sanctuary Operational Tier'}
              </p>
            </div>
            <h1 className="text-5xl lg:text-7xl font-serif italic tracking-tight leading-none text-white/90">
              Peace be with you, <span className="text-white">{user?.name?.split(' ')[0] || 'Member'}</span>.
            </h1>
            <div className="flex items-center gap-6 pt-2">
              <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-medium">Environment: <span className="text-white/40">V3.0-Arise</span></p>
              <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-medium">Architecture: <span className="text-white/40 italic">CSM (Modular)</span></p>
              <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-medium">Role: <span className="text-amber-500/60">{user?.role}</span></p>
            </div>
          </div>

          {/* MANAGER MODE SWITCH MODERNIZE */}
          {(user?.role === 'staff' || user?.role === 'admin') && (
            <div className="group flex items-center gap-6 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] px-8 py-5 transition-all duration-500 backdrop-blur-md">
              <div className="text-right">
                <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-black mb-1">Authorization</p>
                <p className={`text-xs font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isManagerMode ? 'text-amber-400' : 'text-white/40'}`}>
                  {isManagerMode ? 'Manager Tier 3' : 'Standard View'}
                </p>
              </div>
              <button
                onClick={handleManagerSwitch}
                className={`relative w-14 h-7 rounded-full transition-all duration-500 focus:outline-none ring-1 ring-white/10 ${
                  isManagerMode ? 'bg-amber-600 shadow-[0_0_15px_rgba(180,83,9,0.3)]' : 'bg-white/10'
                }`}
              >
                <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-xl transition-all duration-500 ease-out transform ${
                  isManagerMode ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>
          )}
        </header>

        {/* MODERN GRID SYSTEM (Asymmetrical / Command Center) */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* PRIMARY MODULE: BOOKING CONTROL */}
          <div className="col-span-12 lg:col-span-8 group relative overflow-hidden backdrop-blur-xl border border-white/[0.05] transition-all duration-700 hover:border-amber-500/30" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
             <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:opacity-10 transition-opacity text-9xl italic font-serif">A</div>
             <div className="p-12 h-full flex flex-col justify-between relative z-10">
                <div>
                   <div className="flex items-center gap-4 mb-8">
                      <span className="w-10 h-px bg-amber-500/40" />
                      <span className="text-[10px] uppercase tracking-[0.5em] text-amber-500 font-black">Centralized Logic 3.0</span>
                   </div>
                   <h3 className="text-3xl font-serif mb-6 italic text-white/80">Sanctuary Booking Management</h3>
                   <p className="text-white/40 text-sm max-w-xl leading-relaxed font-light">
                      The heart of the Manor. Integrated availability engine tracks parity across all suites in real-time. Manage confirmed guests, handle check-ins, and orchestrate the sanctuary lifecycle.
                   </p>
                </div>
                <div className="mt-12">
                   <a href="/bookings" className="inline-flex items-center gap-6 py-4 px-10 text-[10px] uppercase font-black tracking-[0.4em] bg-white/5 border border-white/10 hover:border-amber-500 hover:bg-amber-500 transition-all text-white group-hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)]">
                      <span>Enter Interface</span>
                      <span className="text-lg leading-none">→</span>
                   </a>
                </div>
             </div>
          </div>

          {/* SECONDARY MODULE: CALENDAR */}
          <div className="col-span-12 lg:col-span-4 p-12 backdrop-blur-xl border border-white/[0.05]" style={{ backgroundColor: COLORS.bgSurface }}>
             <div className="mb-10 w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-xl">📅</div>
             <h3 className="text-2xl font-serif mb-4 italic text-white/80">Visual Roadmap</h3>
             <p className="text-white/30 text-xs leading-relaxed mb-10 font-light italic">
                A 360° temporal view of arrivals and occupancy trends across all Manor segments.
             </p>
             <a href="/calendar" className="text-[10px] uppercase font-black tracking-[0.3em] text-amber-500 hover:text-white transition-colors flex items-center gap-3">
                <span>View Arrivals</span>
                <span>◹</span>
             </a>
          </div>

          {/* THIRD MODULE: F&B CONTROL */}
          <div className="col-span-12 lg:col-span-6 p-12 border border-white/[0.05] group hover:bg-white/[0.01] transition-colors" style={{ backgroundColor: COLORS.bgSurface }}>
             <div className="flex justify-between items-start mb-10">
                <span className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-black">Subsystem 02</span>
                <span className="text-white/10 text-4xl italic font-serif">F&B</span>
             </div>
             <h3 className="text-2xl font-serif mb-4 italic text-white/80">Epicurean & Folio Charges</h3>
             <p className="text-white/40 text-xs mb-10 leading-relaxed font-light">
                Manage dynamic room service orders and bridge the gap between Gastronomy and Guest Folio charging.
             </p>
             <a href="/roomService" className="inline-block py-4 px-8 text-[10px] uppercase font-black tracking-[0.4em] border border-white/10 hover:border-amber-500 text-white/60 hover:text-amber-500 transition-all">
                Launch Sanctuary Operations
             </a>
          </div>

          {/* FOURTH MODULE: IOT KEYCARD */}
          <div className="col-span-12 lg:col-span-6 p-12 border border-white/[0.05] group hover:bg-white/[0.01] transition-colors" style={{ backgroundColor: COLORS.bgSurface }}>
             <div className="flex justify-between items-start mb-10">
                <span className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-black">Subsystem 03</span>
                <span className="text-white/10 text-4xl italic font-serif">IoT</span>
             </div>
             <h3 className="text-2xl font-serif mb-4 italic text-white/80">Digital Key Access Nodes</h3>
             <p className="text-white/40 text-xs mb-10 leading-relaxed font-light">
                Sync physical lock hardware with the CSM core. Generate secure time-bound session tokens for guests.
             </p>
             <a href="/physicalRooms" className="inline-block py-4 px-8 text-[10px] uppercase font-black tracking-[0.4em] border border-white/10 hover:border-amber-500 text-white/60 hover:text-amber-500 transition-all">
                Administer IoT Suite
             </a>
          </div>

          {/* MANAGER ONLY TIERING */}
          {isManagerMode && (
            <div className="col-span-12 grid grid-cols-12 gap-8 pt-8 mt-12 border-t border-white/5">
               <div className="col-span-12 mb-4">
                  <h3 className="text-[10px] uppercase tracking-[0.6em] text-amber-500 font-black flex items-center gap-4">
                     <span className="w-8 h-px bg-amber-500/40" />
                     Manager Security Infrastructure
                  </h3>
               </div>
               
               {user?.role?.toLowerCase() === 'admin' && (
                  <div className="col-span-12 lg:col-span-4 p-10 border border-amber-500/10" style={{ backgroundColor: 'rgba(245,158,11,0.01)' }}>
                     <h4 className="text-lg font-serif mb-4 italic text-amber-400">System Nucleus</h4>
                     <p className="text-white/30 text-[11px] mb-8 leading-relaxed font-light italic">Configure core environment variables, SMTP, and encryption seeds.</p>
                     <a href="/adminSettings" className="text-[10px] uppercase font-black tracking-[0.4em] text-amber-500 border-b border-amber-500/20 pb-1 hover:border-amber-500 transition-all inline-block">
                        Access Kernel
                     </a>
                  </div>
               )}

               <div className="col-span-12 lg:col-span-4 p-10 border border-white/5">
                  <h4 className="text-lg font-serif mb-4 italic text-white/80">Staff IAM</h4>
                  <p className="text-white/30 text-[11px] mb-8 leading-relaxed font-light italic">Orchestrate RBAC hierarchies and manage authentication credentials.</p>
                  <a href="/adminIam" className="text-[10px] uppercase font-black tracking-[0.4em] text-white/60 hover:text-white transition-all">
                     Govern Identities
                  </a>
               </div>

               <div className="col-span-12 lg:col-span-4 p-10 border border-white/5">
                  <h4 className="text-lg font-serif mb-4 italic text-white/80">Audit Repository</h4>
                  <p className="text-white/30 text-[11px] mb-8 leading-relaxed font-light italic">Comprehensive forensic trail of all V3 system operations and logins.</p>
                  <a href="/adminLogs" className="text-[10px] uppercase font-black tracking-[0.4em] text-white/60 hover:text-white transition-all">
                     Parse History
                  </a>
               </div>
            </div>
          )}
        </div>

        {/* FOOTER SYSTEM STATUS */}
        <footer className="mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-white/30">V3 Core Engine: Stable</span>
             </div>
             <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-white/10 rounded-full" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-white/30">Encryption: RSA-256</span>
             </div>
          </div>
          <p className="text-[9px] uppercase tracking-[0.5em] text-white/20 font-medium">The Atlantic Horizon Manor &copy; 2026</p>
        </footer>

        {/* MODAL: MANAGER PROMPT (V3 THEME) */}
        {showManagerPrompt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl">
            <div className="bg-[#121411] border border-amber-600/30 shadow-[0_30px_100px_rgba(0,0,0,0.8)] w-full max-w-md mx-4 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-50" />
              <div className="flex justify-between items-center px-10 py-8 border-b border-white/5">
                <div>
                  <p className="text-amber-500 text-[9px] uppercase tracking-[0.6em] font-black mb-1">Authorization Required</p>
                  <h3 className="font-serif text-2xl italic tracking-wide text-white/90">
                    Verify Secure Identity
                  </h3>
                </div>
                <button onClick={() => setShowManagerPrompt(false)} className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/30 hover:text-white hover:border-amber-500/50 transition-all rounded-full self-start">✕</button>
              </div>

              <div className="p-10 space-y-8">
                {managerError && (
                  <div className="bg-red-500/5 border border-red-500/20 text-red-400 text-[10px] p-4 text-center uppercase tracking-[0.4em] font-black">
                    {managerError}
                  </div>
                )}
                <div className="space-y-3">
                  <label className="block text-[9px] uppercase tracking-[0.5em] text-amber-500 font-black">Username Identifier</label>
                  <input
                    type="text"
                    value={managerCreds.username}
                    onChange={(e) => setManagerCreds({ ...managerCreds, username: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.08] px-6 py-4 text-white focus:border-amber-500/50 outline-none transition-all placeholder:text-white/10 text-sm"
                    placeholder="E.g. administrator_01"
                    onKeyDown={(e) => e.key === 'Enter' && handleManagerLogin()}
                    autoFocus
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[9px] uppercase tracking-[0.5em] text-amber-500 font-black">Master Password</label>
                  <input
                    type="password"
                    value={managerCreds.password}
                    onChange={(e) => setManagerCreds({ ...managerCreds, password: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.08] px-6 py-4 text-white focus:border-amber-500/50 outline-none transition-all placeholder:text-white/10 text-sm"
                    placeholder="••••••••"
                    onKeyDown={(e) => e.key === 'Enter' && handleManagerLogin()}
                  />
                </div>
                <button
                  onClick={handleManagerLogin}
                  className="w-full bg-amber-600 hover:bg-amber-500 py-5 text-[10px] font-black uppercase tracking-[0.6em] transition-all shadow-[0_10px_30px_rgba(180,83,9,0.2)] active:scale-95"
                >
                  Confirm V3 Identity
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}