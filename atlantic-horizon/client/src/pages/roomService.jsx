import React, { useState, useEffect } from 'react';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';

export default function RoomService() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isManagerMode = localStorage.getItem('managerMode') === 'true';
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = () => {
    fetch('http://localhost:5000/api/room-services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const updateCleaningStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/room-services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cleaningStatus: status, managedBy: user?.name })
      });
      fetchServices();
    } catch (e) {
      console.error(e);
    }
  };

  const createTracking = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await fetch('http://localhost:5000/api/room-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName: fd.get('department'),
          roomNumber: fd.get('roomNumber'),
          cleaningStatus: 'Dirty'
        })
      });
      e.target.reset();
      fetchServices();
    } catch (e) {}
  };

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManagerMode} />
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto">
        <header className="mb-10 border-b pb-8 flex flex-col sm:flex-row sm:items-end justify-between" style={{ borderColor: COLORS.border }}>
          <div>
            <p className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-black mb-2">Staff Operation</p>
            <h1 className="text-4xl font-serif italic">Housekeeping &amp; Services</h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create form */}
          <div className="p-6 border h-fit" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
            <h3 className="font-serif text-xl text-amber-500 mb-6">Register Room</h3>
            <form onSubmit={createTracking} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2">Department</label>
                <select name="department" className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-amber-500 outline-none">
                  <option value="Superior Lodge">Superior Lodge</option>
                  <option value="Premium Residence">Premium Residence</option>
                  <option value="Ultimate Estate">Ultimate Estate</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2">Room Identifier (e.g. 101, A)</label>
                <input name="roomNumber" required className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-amber-500 outline-none" />
              </div>
              <button className="w-full bg-white/10 hover:bg-white/20 text-[10px] uppercase tracking-widest font-black py-3 border border-white/20 transition-all">
                Add Room Tracking
              </button>
            </form>
          </div>

          {/* Service List */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? <p className="animate-pulse text-white/30 text-xs">Loading rooms...</p> : services.map(srv => (
              <div key={srv._id} className="p-5 border flex items-center justify-between" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
                <div>
                  <h4 className="text-lg font-serif">Room: {srv.roomNumber} <span className="text-xs text-white/40 ml-2 font-sans">({srv.roomName})</span></h4>
                  <div className="mt-2 flex items-center gap-3">
                    <span className={`text-[9px] uppercase font-black px-2 py-1 tracking-widest border border-current ${
                      srv.cleaningStatus === 'Clean' ? 'text-green-400' : srv.cleaningStatus === 'Dirty' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {srv.cleaningStatus}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {srv.cleaningStatus !== 'Clean' && (
                    <button onClick={() => updateCleaningStatus(srv._id, 'Clean')} className="px-4 py-2 text-[10px] uppercase font-black text-green-400 border border-green-500/30 hover:bg-green-500/10">Mark Clean</button>
                  )}
                  {srv.cleaningStatus !== 'In Service' && (
                    <button onClick={() => updateCleaningStatus(srv._id, 'In Service')} className="px-4 py-2 text-[10px] uppercase font-black text-blue-400 border border-blue-500/30 hover:bg-blue-500/10">In Service</button>
                  )}
                  {srv.cleaningStatus !== 'Dirty' && (
                    <button onClick={() => updateCleaningStatus(srv._id, 'Dirty')} className="px-4 py-2 text-[10px] uppercase font-black text-red-400 border border-red-500/30 hover:bg-red-500/10">Mark Dirty</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
