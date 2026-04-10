import React, { useState, useEffect } from 'react';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';

export default function RoomCapacity() {
  // Session context used by sidebar to show role-based navigation.
  const user = JSON.parse(localStorage.getItem('user'));
  const isManagerMode = localStorage.getItem('managerMode') === 'true';

  // Room list and loading state for the capacity dashboard.
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all room definitions with current capacity values.
  const fetchRooms = () => {
    fetch('http://localhost:5000/api/rooms')
      .then(res => res.json())
      .then(data => {
        setRooms(data);
        setLoading(false);
      });
  };

  // Initial load on first render.
  useEffect(() => {
    fetchRooms();
  }, []);

  // Persist one room's capacity change, then refresh list.
  const updateCapacity = async (id, newCapacity) => {
    try {
      await fetch(`http://localhost:5000/api/rooms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capacity: newCapacity })
      });
      fetchRooms();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManagerMode} />
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto">
        <header className="mb-10 border-b pb-8" style={{ borderColor: COLORS.border }}>
          <p className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-black mb-2">Admin Control</p>
          <h1 className="text-4xl font-serif italic">Department Capacity</h1>
          <p className="text-white/30 text-xs mt-2 uppercase tracking-widest">
            Manage the total room counts available for each department.
          </p>
        </header>

        {/* Render state: loading text or capacity cards grid. */}
        {loading ? (
          <p className="text-white/20 text-xs uppercase tracking-widest animate-pulse">Loading rooms...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {rooms.map(room => (
              <div key={room._id} className="p-6 border flex flex-col justify-between" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
                <div>
                  <h3 className="text-xl font-serif text-amber-500">{room.name}</h3>
                  <p className="text-xs text-white/50 uppercase tracking-widest mt-1 mb-4">{room.category}</p>
                </div>
                
                <div className="space-y-4 border-t pt-4" style={{ borderColor: COLORS.border }}>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2">Total Capacity</label>
                    {/* Stepper controls to decrease/increase capacity. */}
                    <div className="flex items-center gap-4">
                      <button onClick={() => updateCapacity(room._id, Math.max(1, (room.capacity || 1) - 1))} className="w-8 h-8 border border-white/20 hover:bg-white/10">-</button>
                      <span className="text-2xl font-serif">{room.capacity || 1}</span>
                      <button onClick={() => updateCapacity(room._id, (room.capacity || 1) + 1)} className="w-8 h-8 border border-white/20 hover:bg-white/10">+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
