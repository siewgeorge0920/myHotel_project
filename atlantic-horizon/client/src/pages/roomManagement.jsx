import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';

export default function SanctuaryOperations() {
  // Staff context and mode flags sourced from local session storage.
  const user = JSON.parse(localStorage.getItem('user'));
  const isManagerMode = localStorage.getItem('managerMode') === 'true';

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (initial = false) => {
    try {
      if (initial) setLoading(true);
      const resUnits = await axios.get('/api/physical-rooms', { withCredentials: true });
      setUnits(resUnits.data.data || []);
    } catch (err) {
      console.error('Data sync failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Keep operations dashboard fresh with periodic polling.
    fetchData(true);
    const interval = setInterval(fetchData, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const updateCleaningStatus = async (id, status) => {
    // Push housekeeping state transition for a physical unit.
    try {
      await axios.put(`/api/physical-rooms/${id}`, { current_status: status }, { withCredentials: true });
      fetchData();
    } catch (err) {
      alert('Status update failed.');
    }
  };

  const departments = Array.from(new Set(units.map(u => u.department)));
  // Department groups drive sectioned housekeeping rendering.

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Ready': return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5';
      case 'Cleaning': return 'text-sky-400 border-sky-400/20 bg-sky-400/5';
      case 'Maintenance': return 'text-red-400 border-red-400/20 bg-red-400/5';
      case 'Occupied': return 'text-amber-400 border-amber-400/20 bg-amber-400/5';
      default: return 'text-white/20 border-white/10';
    }
  };

  const getOrderBadge = (status) => {
    switch (status) {
      case 'Pending': return 'border-red-500/30 text-red-400 bg-red-500/5';
      case 'Preparing': return 'border-amber-500/30 text-amber-400 bg-amber-500/5';
      case 'Delivering': return 'border-sky-500/30 text-sky-400 bg-sky-500/5';
      case 'Completed': return 'border-emerald-500/30 text-emerald-400 bg-emerald-400/5';
      default: return 'border-white/10 text-white/30';
    }
  };

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManagerMode} />
      
      <main className="flex-1 p-8 lg:p-20 overflow-x-hidden">
        <header className="mb-12 border-b border-white/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl font-serif italic text-white/90">Room Management</h1>
          </div>
          
          <div className="flex bg-white/5 p-1">
             {/* Mode Selectors Removed */}
          </div>
        </header>

        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
             <div className="w-10 h-10 border-t border-amber-500 rounded-full animate-spin opacity-40" />
             <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] animate-pulse">Synchronizing Core...</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-700">
            <div className="space-y-16">
              {departments.length === 0 && (
                 <div className="py-32 text-center border border-dashed border-white/10 opacity-30 text-[10px] uppercase tracking-[0.5em]">No physical units deployed in sanctuary.</div>
              )}
              {departments.map(dept => (
                <div key={dept} className="space-y-8">
                  <h2 className="text-xl font-serif text-amber-500 italic border-l-2 border-amber-500 pl-6 uppercase tracking-widest">{dept || "Uncategorized"}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {units.filter(u => u.department === dept).map(unit => {
                      const rName = unit.room_name || unit.roomName;
                      const rType = unit.room_type_category || unit.roomType;
                      const s = unit.current_status;

                      return (
                        <div key={unit._id} className="bg-white/[0.02] border border-white/5 p-8 group hover:border-white/10 transition-all relative overflow-hidden">
                          {s === 'Cleaning' && <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rotate-45 translate-x-12 -translate-y-12 border border-sky-500/20" />}
                          
                          <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                               <h3 className="text-2xl font-serif text-white/80">{rName}</h3>
                               <p className="text-[10px] text-white/20 uppercase tracking-widest mt-2">{rType}</p>
                            </div>
                            <span className={`px-3 py-1.5 border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(s)}`}>
                              {s}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 relative z-10">
                             {s !== 'Ready' && (
                               <button 
                                 onClick={() => updateCleaningStatus(unit._id, 'Ready')}
                                 className="col-span-2 py-3 text-[9px] uppercase tracking-[0.3em] font-black bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all mb-2"
                               >
                                 Mark as Ready
                               </button>
                             )}

                             {s === 'Ready' && (
                               <button 
                                 onClick={() => updateCleaningStatus(unit._id, 'Cleaning')}
                                 className="py-3 text-[9px] uppercase tracking-[0.2em] font-black border border-sky-500/20 hover:border-sky-500/60 text-sky-400/60 hover:text-sky-400 transition-all bg-sky-500/5 flex items-center justify-center gap-2"
                               >
                                 Apply Cleaning
                               </button>
                             )}

                             {(s === 'Ready' || s === 'Cleaning') && (
                               <button 
                                 onClick={() => updateCleaningStatus(unit._id, 'Maintenance')}
                                 className={`py-3 text-[9px] uppercase tracking-[0.2em] font-black border border-red-500/20 hover:border-red-500/60 text-red-400/60 hover:text-red-400 transition-all bg-red-500/5 ${s !== 'Ready' ? 'col-span-1' : 'col-span-1'}`}
                               >
                                 Set Maintenance
                               </button>
                             )}

                             {s === 'Occupied' && (
                               <p className="col-span-2 text-[9px] uppercase text-white/20 italic text-center py-3 border border-dashed border-white/5">
                                 Unit Managed by Front Desk
                               </p>
                             )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
