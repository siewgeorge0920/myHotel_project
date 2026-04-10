import React, { useState, useEffect } from 'react';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';

export default function AdminCalendar() {
  // Session/user context for sidebar role rendering.
  const user = JSON.parse(localStorage.getItem('user'));
  const isManagerMode = localStorage.getItem('managerMode') === 'true';

  // Calendar data sources.
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [physicalRooms, setPhysicalRooms] = useState([]);

  // Load booking records and physical-unit inventory in parallel on first render.
  useEffect(() => {
    Promise.all([
      fetch('/api/bookings'),
      fetch('/api/physical-rooms')
    ])
      .then(([resB, resP]) => Promise.all([resB.json(), resP.json()]))
      .then(([dataB, dataP]) => {
        setBookings(dataB);
        setPhysicalRooms(dataP);
        setLoading(false);
      });
  }, []);

  // Normalize "today" to midnight for consistent date-only comparisons.
  const today = new Date();
  today.setHours(0,0,0,0);

  // Build a rolling 14-day window (today + next 13 days).
  const days = Array.from({length: 14}).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManagerMode} />
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto">
        <header className="mb-10 border-b pb-8 flex flex-col sm:flex-row sm:items-end justify-between" style={{ borderColor: COLORS.border }}>
          <div>
            <p className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-black mb-2">Manager Control</p>
            <h1 className="text-4xl font-serif italic">14-Day Booking Horizon</h1>
            <p className="text-white/40 text-xs mt-2 uppercase tracking-widest">Live Schedule for All Operations</p>
          </div>
        </header>
        
        {loading ? <p className="animate-pulse text-white/30 text-xs tracking-widest">Loading calendar data...</p> : (
          <div className="overflow-x-auto w-full border" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
            <div className="min-w-[1000px]">
              {/* Header row for day labels across the 14-day horizon. */}
              <div className="flex border-b" style={{ borderColor: COLORS.border }}>
                <div className="w-48 p-4 font-serif text-amber-500 border-r" style={{ borderColor: COLORS.border }}>Room / Department</div>
                {days.map((d, i) => (
                  <div key={i} className={`flex-1 p-2 text-center text-[10px] uppercase font-black tracking-widest border-r ${
                    d.getTime() === today.getTime() ? 'bg-amber-500/10 text-amber-400' : 'text-white/40'
                  }`} style={{ borderColor: COLORS.border }}>
                    {d.toLocaleDateString('en-US', { weekday: 'short' })}<br/>
                    <span className="text-lg">{d.getDate()}</span>
                  </div>
                ))}
              </div>

              {/* Body rows: one row per physical unit, one cell per day. */}
              {physicalRooms.map(unit => (
                <div key={unit._id} className="flex border-b hover:bg-white/[0.02]" style={{ borderColor: COLORS.border }}>
                   <div className="w-48 p-4 border-r" style={{ borderColor: COLORS.border }}>
                     <p className="font-serif text-[13px] text-amber-500 font-bold">{unit.roomName}</p>
                     <p className="text-[10px] uppercase text-white/50 tracking-widest">{unit.department} - {unit.roomType}</p>
                   </div>
                   {days.map((d, i) => {
                      // Find bookings that overlap this unit and day.
                      const dayBookings = bookings.filter(b => {
                        // Booking must be assigned to this exact physical unit.
                        if (b.assignedUnit !== unit.roomName) return false;

                        // Occupancy spans check-in day (inclusive) to check-out day (exclusive).
                        const start = new Date(b.checkInDate).setHours(0,0,0,0);
                        const end = new Date(b.checkOutDate).setHours(0,0,0,0);
                        return d.getTime() >= start && d.getTime() < end; 
                      });
                      return (
                        <div key={i} className="flex-1 p-1 border-r flex flex-col gap-1 min-h-[60px]" style={{ borderColor: COLORS.border }}>
                          {dayBookings.map((b, idx) => (
                            <div key={idx} className={`p-1 text-[8px] uppercase tracking-widest truncate border ${
                              b.bookingStatus === 'CheckedIn' ? 'bg-green-500/10 border-green-500/40 text-green-400' :
                              b.bookingStatus === 'Confirmed' ? 'bg-amber-600/10 border-amber-600/40 text-amber-400' :
                              'bg-white/5 border-white/20 text-white/40'
                            }`}>
                              <span className="font-bold">{b.bookingId}</span> ({b.bookingStatus})
                              {b.clientId && (
                                <div className="mt-0.5 text-[7px] text-white/80 lowercase capitalize-first">
                                  {b.clientId.firstName} {b.clientId.lastName}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )
                   })}
                </div>
              ))}

              {/* Empty-state guidance when no physical units are configured yet. */}
              {physicalRooms.length === 0 && (
                <div className="p-8 text-center text-xs uppercase tracking-widest text-white/30 border-b" style={{ borderColor: COLORS.border }}>
                  No Physical Units Registered Yet. Please register units under Admin Control.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
