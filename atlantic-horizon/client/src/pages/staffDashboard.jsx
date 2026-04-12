import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';

export default function StaffDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  // Redirect if not logged in or token missing
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const isManager = user.role === 'manager' || user.role === 'admin';
  const isAdmin = user.role === 'admin';

  return (
    <div className="flex min-h-screen text-white font-sans selection:bg-amber-500/30" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManager} />
      
      <main className="flex-1 p-8 lg:p-20 overflow-x-hidden relative">
        {/* Background decorative glow - Strictly preserving bgDeep */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/[0.01] rounded-full blur-[100px] pointer-events-none" />

        {/* HEADER SECTION */}
        <header className="mb-20 border-b pb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8 relative z-10" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)] ${isAdmin ? 'bg-red-500 shadow-red-500' : isManager ? 'bg-amber-500 shadow-amber-500' : 'bg-blue-400 shadow-blue-400'}`} />
              <p className="text-amber-500 uppercase tracking-[0.6em] text-[10px] font-black opacity-80">
                {isAdmin ? '🔴 KERNEL ACCESS LEVEL' : isManager ? '🔐 TIER-3 MANAGEMENT' : '🔵 STANDARD OPERATIONS'}
              </p>
            </div>
            <h1 className="text-5xl lg:text-7xl font-serif italic tracking-tight leading-none text-white/90">
              Peace be with you, <span className="text-white">{user?.name?.split(' ')[0] || 'Member'}</span>.
            </h1>
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-medium">Environment: <span className="text-white/40">V3.0-Arise</span></p>
              <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-medium">Clearance: <span className="text-amber-500/60 font-bold">{user?.role}</span></p>
            </div>
          </div>
        </header>

        {/* MODERN GRID SYSTEM (Frosted Glass Theme) */}
        <div className="grid grid-cols-12 gap-8 relative z-10">
          
          {/* COMMON MODULES (Available to ALL ROLES) */}
          <div className="col-span-12 mb-2">
             <h3 className="text-[10px] uppercase tracking-[0.6em] text-white/40 font-black flex items-center gap-4">
                <span className="w-8 h-px bg-white/10" />
                Sanctuary Core Operations
             </h3>
          </div>

          <div className="col-span-12 lg:col-span-8 group relative overflow-hidden backdrop-blur-2xl bg-white/[0.02] border border-white/5 rounded-2xl transition-all duration-700 hover:border-amber-500/30 hover:bg-white/[0.04]">
             <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:opacity-10 transition-opacity text-9xl italic font-serif">A</div>
             <div className="p-10 h-full flex flex-col justify-between relative z-10">
                <div>
                   <div className="flex items-center gap-4 mb-8">
                      <span className="w-6 h-px bg-amber-500/60" />
                      <span className="text-[10px] uppercase tracking-[0.5em] text-amber-500 font-black">Booking Engine</span>
                   </div>
                   <h3 className="text-3xl font-serif mb-4 italic text-white/90">Manor Fleet Control</h3>
                   <p className="text-white/40 text-sm max-w-xl leading-relaxed font-light">
                      The primary interface for orchestrating guest sanctuary lifecycles, physical assignments, and inventory synchronization across the V3 matrix.
                   </p>
                </div>
                <div className="mt-12">
                   <a href="/bookings" className="inline-flex items-center gap-6 py-4 px-10 text-[10px] uppercase font-black tracking-[0.4em] bg-white/5 border border-white/10 hover:border-amber-500 hover:bg-amber-600/90 hover:text-white transition-all rounded-full text-white shadow-xl">
                      <span>Enter Interface</span>
                      <span className="text-lg leading-none">→</span>
                   </a>
                </div>
             </div>
          </div>

          <div className="col-span-12 lg:col-span-4 p-10 backdrop-blur-2xl bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all duration-500 group">
             <div className="mb-8 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shadow-lg transition-transform group-hover:scale-110">📅</div>
             <h3 className="text-2xl font-serif mb-4 italic text-white/90">Visual Roadmap</h3>
             <p className="text-white/30 text-xs leading-relaxed mb-10 font-light italic">
                A 360° temporal view of arrivals and occupancy trends across all sanctuary tiers.
             </p>
             <a href="/calendar" className="text-[10px] uppercase font-black tracking-[0.3em] text-amber-500 hover:text-white transition-colors flex items-center gap-3">
                <span>View Arrivals</span>
                <span>◹</span>
             </a>
          </div>

          {/* MANAGER + ADMIN MODULES */}
          {isManager && (
            <>
              <div className="col-span-12 mt-8 mb-2">
                 <h3 className="text-[10px] uppercase tracking-[0.6em] text-amber-500/60 font-black flex items-center gap-4">
                    <span className="w-8 h-px bg-amber-500/20" />
                    Tier-3 Infrastructure
                 </h3>
              </div>

              <div className="col-span-12 lg:col-span-4 p-10 backdrop-blur-2xl bg-white/[0.01] border border-white/5 rounded-2xl group hover:bg-white/[0.03] transition-all">
                 <div className="flex justify-between items-start mb-8">
                    <span className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-black">Subsystem 02</span>
                    <span className="text-white/10 text-3xl italic font-serif group-hover:text-amber-500/30 transition-colors">F&B</span>
                 </div>
                 <h3 className="text-xl font-serif mb-4 italic text-white/90">Epicurean Flow</h3>
                 <p className="text-white/30 text-xs mb-10 leading-relaxed font-light">Bridge the gap between Gastronomy and Guest Folio charging systems.</p>
                 <a href="/roomService" className="inline-block py-3 px-6 rounded-full text-[9px] uppercase font-black tracking-[0.3em] bg-white/5 border border-white/10 hover:border-amber-500 text-white/60 hover:text-amber-500 transition-all shadow-md">
                    Launch F&B
                 </a>
              </div>

              <div className="col-span-12 lg:col-span-4 p-10 backdrop-blur-2xl bg-white/[0.01] border border-white/5 rounded-2xl group hover:bg-white/[0.03] transition-all">
                 <div className="flex justify-between items-start mb-8">
                    <span className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-black">Subsystem 03</span>
                    <span className="text-white/10 text-3xl italic font-serif group-hover:text-amber-500/30 transition-colors">IoT</span>
                 </div>
                 <h3 className="text-xl font-serif mb-4 italic text-white/90">Physical Inventory</h3>
                 <p className="text-white/30 text-xs mb-10 leading-relaxed font-light">Administer physical suite hardware, IoT keycards, and digital lock nodes.</p>
                 <a href="/physicalRooms" className="inline-block py-3 px-6 rounded-full text-[9px] uppercase font-black tracking-[0.3em] bg-white/5 border border-white/10 hover:border-amber-500 text-white/60 hover:text-amber-500 transition-all shadow-md">
                    Administer IoT
                 </a>
              </div>

              <div className="col-span-12 lg:col-span-4 p-10 backdrop-blur-2xl bg-white/[0.01] border border-white/5 rounded-2xl group hover:bg-white/[0.03] transition-all">
                 <div className="flex justify-between items-start mb-8">
                    <span className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-black">Subsystem 04</span>
                    <span className="text-white/10 text-3xl italic font-serif group-hover:text-amber-500/30 transition-colors">IAM</span>
                 </div>
                 <h3 className="text-xl font-serif mb-4 italic text-white/90">Identity Governance</h3>
                 <p className="text-white/30 text-xs mb-10 leading-relaxed font-light">Orchestrate RBAC hierarchies and manage authentication credential flows.</p>
                 <a href="/adminIam" className="inline-block py-3 px-6 rounded-full text-[9px] uppercase font-black tracking-[0.3em] bg-white/5 border border-white/10 hover:border-white text-white/40 hover:text-white transition-all shadow-md">
                    Govern Identities
                 </a>
              </div>
              
              <div className="col-span-12 p-10 backdrop-blur-xl bg-white/[0.01] border border-white/5 rounded-2xl group hover:bg-white/[0.02] transition-all flex items-center justify-between flex-wrap gap-6">
                 <div>
                    <h3 className="text-xl font-serif mb-2 italic text-white/90">Audit History Repository</h3>
                    <p className="text-white/30 text-xs leading-relaxed font-light">Comprehensive forensic trail of all V3 core system operations and login telemetry.</p>
                 </div>
                 <a href="/adminLogs" className="inline-block py-3 px-8 rounded-full text-[10px] uppercase font-black tracking-[0.4em] bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all shadow-xl">
                    Parse History
                 </a>
              </div>
            </>
          )}

          {/* ADMIN STRICT MODULES */}
          {isAdmin && (
            <>
              <div className="col-span-12 mt-8 mb-2">
                 <h3 className="text-[10px] uppercase tracking-[0.6em] text-red-500/60 font-black flex items-center gap-4">
                    <span className="w-8 h-px bg-red-500/20" />
                    Kernel Operations
                 </h3>
              </div>

              <div className="col-span-12 p-10 backdrop-blur-3xl bg-red-900/[0.02] border border-red-500/10 rounded-2xl">
                 <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                     <div>
                        <h4 className="text-2xl font-serif mb-4 italic text-red-400/80">System Nucleus</h4>
                        <p className="text-red-100/20 text-xs leading-relaxed font-light max-w-xl italic">
                          Modify core environment variables, SMTP protocols, and master encryption seeds. Proceed with absolute authorization.
                        </p>
                     </div>
                     <a href="/adminSettings" className="flex items-center justify-center py-4 px-10 text-[10px] uppercase font-black tracking-[0.4em] text-red-100/50 bg-red-900/10 border border-red-500/20 hover:bg-red-600 hover:text-white transition-all rounded-full shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                        Access Kernel
                     </a>
                 </div>
              </div>
            </>
          )}
        </div>

        {/* FOOTER SYSTEM STATUS */}
        <footer className="mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
          <div className="flex items-center gap-8 flex-wrap">
             <div className="flex items-center gap-3 bg-white/[0.01] px-4 py-2 rounded-full border border-white/5">
                <span className="w-2 h-2 bg-green-500/60 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-white/20">V3 Core: Stable</span>
             </div>
             <div className="flex items-center gap-3 bg-white/[0.01] px-4 py-2 rounded-full border border-white/5">
                <span className="w-2 h-2 bg-blue-400/40 rounded-full" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-white/20">RSA-256 Active</span>
             </div>
             <div className="flex items-center gap-3 bg-white/[0.01] px-4 py-2 rounded-full border border-white/5">
                <span className="w-1.5 h-1.5 bg-amber-500/40 rounded-full" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-white/20">Session: Active</span>
             </div>
          </div>
          <p className="text-[9px] uppercase tracking-[0.5em] text-white/10 font-bold tracking-widest">The Atlantic Horizon Manor &copy; 2026</p>
        </footer>
      </main>
    </div>
  );
}