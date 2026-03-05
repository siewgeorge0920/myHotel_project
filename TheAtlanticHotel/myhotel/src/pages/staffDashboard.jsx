import React from 'react';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';

export default function StaffDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} />
      
      <main className="flex-1 p-16">
        <header className="mb-12 border-b pb-8" style={{ borderColor: COLORS.border }}>
          <p className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-black mb-3">Staff Console</p>
          <h1 className="text-4xl font-serif italic tracking-wide">Welcome, {user?.name || 'Sanctuary Member'}</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-10 border" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
            <h3 className="text-xl font-serif mb-4 italic">Quick Inventory Check</h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">Manage your room allocations and availability for the manor's guests.</p>
            <a href="/inventory" className="inline-block py-3 px-8 text-[10px] uppercase font-black tracking-widest border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white transition-all">
              Manage Rooms
            </a>
          </div>

          <div className="p-10 border" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
            <h3 className="text-xl font-serif mb-4 italic">Arrival Calendar</h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">View upcoming reservations and sanctuary occupancy levels.</p>
            <a href="/calendar" className="inline-block py-3 px-8 text-[10px] uppercase font-black tracking-widest border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white transition-all">
              View Calendar
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}