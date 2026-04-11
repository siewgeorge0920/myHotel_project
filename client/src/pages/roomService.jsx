import React, { useState, useEffect } from 'react';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';

export default function RoomService() {
  // Session context used by sidebar navigation.
  const user = JSON.parse(localStorage.getItem('user'));
  const isManagerMode = localStorage.getItem('managerMode') === 'true';

  // Physical unit service list and loading state.
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all physical units with their current cleaning status.
  const fetchServices = () => {
    fetch('/api/physical-rooms')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      });
  };

  // Initial load on first render.
  useEffect(() => {
    fetchServices();
  }, []);

  // Update one unit's cleaning status and refresh list.
  const updateCleaningStatus = async (id, status) => {
    try {
      await fetch(`/api/physical-rooms/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchServices();
    } catch (e) {
      console.error(e);
    }
  };

  // Group headings derived from unique department names.
  const departments = Array.from(new Set(services.map(s => s.department)));

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManagerMode} />
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto">
        <header className="mb-10 border-b pb-8 flex flex-col sm:flex-row sm:items-end justify-between" style={{ borderColor: COLORS.border }}>
          <div>
            <p className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-black mb-2">Staff Operation</p>
            <h1 className="text-4xl font-serif italic">Housekeeping Dashboard</h1>
            <p className="text-white/40 text-xs mt-2 uppercase tracking-widest">Live unit cleaning status and maintenance.</p>
          </div>
        </header>

        {loading ? <p className="animate-pulse text-white/30 text-xs tracking-widest uppercase">Loading units...</p> : (
          <div className="space-y-12">
            {departments.map(dept => (
               <div key={dept}>
                 <h2 className="text-xl font-serif text-amber-500 mb-6 border-b pb-2 inline-block" style={{ borderColor: COLORS.border }}>{dept}</h2>
                 <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                   {services.filter(s => s.department === dept).map(srv => {
                     // Cleaning status to badge style mapping.
                     let statusColor = 'text-white/40';
                     if(srv.cleaningStatus === 'Clean') statusColor = 'text-green-400 bg-green-400/10 border-green-400/30';
                     if(srv.cleaningStatus === 'Dirty') statusColor = 'text-red-400 bg-red-400/10 border-red-400/30';
                     if(srv.cleaningStatus === 'In Service') statusColor = 'text-blue-400 bg-blue-400/10 border-blue-400/30';
                     if(srv.cleaningStatus === 'Maintenance') statusColor = 'text-amber-400 bg-amber-400/10 border-amber-400/30';

                     return (
                       <div key={srv._id} className="p-5 border flex flex-col justify-between h-40" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
                         <div className="flex justify-between items-start">
                           <div>
                             <h4 className="text-2xl font-serif">{srv.roomName}</h4>
                             <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mt-1">{srv.roomType}</p>
                           </div>
                           <span className={`text-[9px] uppercase font-black px-2 py-1 tracking-widest border ${statusColor}`}>
                             {srv.cleaningStatus}
                           </span>
                         </div>

                         {/* Show only valid next actions (hide current status action). */}
                         <div className="flex gap-2 flex-wrap mt-4">
                           {srv.cleaningStatus !== 'Clean' && (
                             <button onClick={() => updateCleaningStatus(srv._id, 'Clean')} className="px-3 py-1.5 text-[9px] uppercase font-black text-green-400 border border-white/10 hover:border-green-500/30 hover:bg-green-500/10">Mark Clean</button>
                           )}
                           {srv.cleaningStatus !== 'In Service' && (
                             <button onClick={() => updateCleaningStatus(srv._id, 'In Service')} className="px-3 py-1.5 text-[9px] uppercase font-black text-blue-400 border border-white/10 hover:border-blue-500/30 hover:bg-blue-500/10">In Service</button>
                           )}
                           {srv.cleaningStatus !== 'Dirty' && (
                             <button onClick={() => updateCleaningStatus(srv._id, 'Dirty')} className="px-3 py-1.5 text-[9px] uppercase font-black text-red-400 border border-white/10 hover:border-red-500/30 hover:bg-red-500/10">Mark Dirty</button>
                           )}
                           {srv.cleaningStatus !== 'Maintenance' && (
                             <button onClick={() => updateCleaningStatus(srv._id, 'Maintenance')} className="px-3 py-1.5 text-[9px] uppercase font-black text-amber-400 border border-white/10 hover:border-amber-500/30 hover:bg-amber-500/10">Maintenance 🛠️</button>
                           )}
                         </div>
                       </div>
                     )
                   })}
                 </div>
               </div>
            ))}

            {/* Empty state when no physical units exist in the system yet. */}
            {services.length === 0 && (
              <div className="p-10 border border-dashed text-center text-white/30 uppercase tracking-widest text-xs" style={{ borderColor: COLORS.border }}>
                No physical unit numbers have been assigned or created yet.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
