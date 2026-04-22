import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';

/**
 * RECEPTION & FRONT DESK OPERATIONS
 * Simple, action-oriented dashboard for daily operations.
 */
export default function StaffDashboard() {
  const user = useMemo(() => JSON.parse(localStorage.getItem('user')), []);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ upcoming: 0, expectedArrivals: 0, pendingDepartures: 0 });

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats', {
        credentials: 'include' // Crucial for sending HttpOnly session cookies
      });
      const data = await res.json();
      
      if (data.success && data.data) {
        setStats(data.data);
      } else {
        console.warn("[Dashboard] Stats sync returned non-success:", data);
      }
    } catch (err) {
      console.error("[Dashboard] Stats synchronization failed:", err);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchStats();
      const interval = setInterval(fetchStats, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [user, navigate]);

  if (!user) return null;

  const userRole = user?.role?.toLowerCase() || 'staff';
  const isManager = userRole === 'manager' || userRole === 'admin';

  return (
    <div className="flex min-h-screen text-white font-sans selection:bg-amber-500/30" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManager} />
      
      <main className="flex-1 p-6 lg:p-12 overflow-x-hidden relative">
        {/* Background Atmosphere */}
        <div className="absolute top-0 right-0 w-[60%] h-[40%] bg-amber-600/5 rounded-full blur-[150px] pointer-events-none" />

        {/* 1. TOP HEADER */}
        <header className="mb-12 relative z-10">
          <h1 className="text-4xl font-serif italic text-white/90">Front Desk & Reception</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-amber-500/60 mt-2 font-black">
            Operator: {user?.name} | Role: {user?.role}
          </p>
        </header>

        {/* 2. CORE OPERATIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 max-w-5xl">
          
          {/* Action 1: Bookings & Reservations */}
          <ActionCard 
            title="Bookings & Reservations" 
            icon=""
            desc="Manage all reservations, view guest lists, and create new manual bookings."
            primaryBtn="Manage Bookings"
            onPrimaryClick={() => navigate('/bookings')}
            bgGradient="from-blue-900/20 to-transparent border-blue-500/20 hover:border-blue-500/50"
            btnColor="bg-blue-600 hover:bg-blue-500"
          />



          {/* Action 4: Room Management */}
          <ActionCard 
            title="Room Management" 
            icon=""
            desc="Manage room status, cleanliness, and maintenance logs for the sanctuary."
            primaryBtn="Open Management"
            onPrimaryClick={() => navigate('/roomManagement')}
            bgGradient="from-purple-900/20 to-transparent border-purple-500/20 hover:border-purple-500/50"
            btnColor="bg-purple-600 hover:bg-purple-500"
          />

        </div>

        {/* Quick Stats - Simple daily figures */}
        <div className="mt-12 max-w-5xl relative z-10">
           <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 font-black">Overall</h4>
           <div className="grid grid-cols-3 gap-6">
              <StatCard 
                label="Pending" 
                value={stats.upcoming} 
                onClick={() => navigate('/bookings', { state: { filter: 'pending' } })}
              />
              <StatCard 
                label="Check-In" 
                value={stats.expectedArrivals} 
                onClick={() => navigate('/bookings', { state: { filter: 'checkin' } })}
              />
              <StatCard 
                label="Check-Out" 
                value={stats.pendingDepartures} 
                onClick={() => navigate('/bookings', { state: { filter: 'checkout' } })}
              />
           </div>
        </div>

      </main>
    </div>
  );
}

// Sub-components for cleaner code
function ActionCard({ title, icon, desc, primaryBtn, onPrimaryClick, bgGradient, btnColor }) {
  return (
    <div className={`p-8 rounded-3xl bg-gradient-to-br ${bgGradient} border backdrop-blur-xl transition-all group flex flex-col justify-between min-h-[220px]`}>
      <div>
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">{icon}</div>
        <h3 className="text-2xl font-serif italic mb-2 text-white/90">{title}</h3>
        <p className="text-xs text-white/40 leading-relaxed max-w-sm mb-6">{desc}</p>
      </div>
      <button 
        onClick={onPrimaryClick}
        className={`w-full py-3 rounded-full text-[10px] uppercase font-black tracking-widest text-white shadow-lg transition-colors ${btnColor}`}
      >
        {primaryBtn}
      </button>
    </div>
  );
}

function StatCard({ label, value, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-amber-500/30 transition-all text-left w-full group"
    >
      <h4 className="text-3xl font-light mb-1 group-hover:text-amber-500 transition-colors">{value}</h4>
      <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-semibold">{label}</p>
    </button>
  );
}