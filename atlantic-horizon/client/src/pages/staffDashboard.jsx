import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';

/**
 * 🛎️ RECEPTION & FRONT DESK OPERATIONS
 * Simple, action-oriented dashboard for daily operations.
 */
export default function StaffDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const isManager = user.role === 'manager' || user.role === 'admin';

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
            icon="📅"
            desc="Manage all reservations, view guest lists, and create new manual bookings."
            primaryBtn="Manage Bookings"
            onPrimaryClick={() => navigate('/bookings')}
            bgGradient="from-blue-900/20 to-transparent border-blue-500/20 hover:border-blue-500/50"
            btnColor="bg-blue-600 hover:bg-blue-500"
          />

          {/* Action 2: Check-In & Arrivals */}
          <ActionCard 
            title="Reception Check-In" 
            icon="🛎️"
            desc="Process arriving guests. Assign physical rooms or generate IoT Keys."
            primaryBtn="Go to Check-In"
            onPrimaryClick={() => navigate('/bookings')} // Both point to booking management typically, or a specific check-in view if made
            bgGradient="from-green-900/20 to-transparent border-green-500/20 hover:border-green-500/50"
            btnColor="bg-green-600 hover:bg-green-500"
          />

          {/* Action 3: Check-Out & Departures */}
          <ActionCard 
            title="Folio & Check-Out" 
            icon="🚪"
            desc="Settle guest folios, process payments, and complete checkout procedures."
            primaryBtn="Process Check-Out"
            onPrimaryClick={() => navigate('/bookings')}
            bgGradient="from-amber-900/20 to-transparent border-amber-500/20 hover:border-amber-500/50"
            btnColor="bg-amber-600 hover:bg-amber-500"
          />

          {/* Action 4: Room Service */}
          <ActionCard 
            title="Room Service (F&B)" 
            icon="🍽️"
            desc="Manage inbound culinary orders, update order status, and bill to room."
            primaryBtn="F&B Interface"
            onPrimaryClick={() => navigate('/roomService')}
            bgGradient="from-purple-900/20 to-transparent border-purple-500/20 hover:border-purple-500/50"
            btnColor="bg-purple-600 hover:bg-purple-500"
          />

        </div>

        {/* Quick Stats - Simple daily figures */}
        <div className="mt-12 max-w-5xl relative z-10">
           <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 font-black">Daily Overview</h4>
           <div className="grid grid-cols-3 gap-6">
              <StatCard label="Expected Arrivals" value="12" />
              <StatCard label="Pending Departures" value="5" />
              <StatCard label="Active Orders" value="3" />
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

function StatCard({ label, value }) {
  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
      <h4 className="text-3xl font-light mb-1">{value}</h4>
      <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-semibold">{label}</p>
    </div>
  );
}