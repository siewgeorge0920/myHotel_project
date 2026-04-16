import React, { useState, useEffect } from 'react';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';
import axios from 'axios';

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  // Active department tab drives room card filtering.
  const [activeDept, setActiveDept] = useState('Private Lodge');
  const DEPARTMENTS = ['Private Lodge', 'Private Residences & Villas', 'Ultimate Exclusivity'];

  const handleManualAddon = async (room) => {
  // Prompt-based quick charge workflow for concierge-triggered add-ons.
  const serviceName = prompt("Enter service description (e.g., Spa, Extra Towels):");
  const price = prompt("Enter price (€):");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Load physical room registry for the selected department cards.
        const res = await axios.get('/api/v3/physical-rooms');
        setRooms(res.data.data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  

  if (serviceName && price && room.active_booking) {
    try {
      // Logic: Use the room's active_booking to find the ID
      await axios.post(`/api/v3/folio/add-charge`, {
        bookingId: room.active_booking_id, // You'll need to pass this from backend
        description: serviceName,
        amount: price
      });
      alert("Charge added to guest folio!");
    } catch (err) {
      alert("Failed to add charge. Is the room occupied?");
    }
  } else {
    alert("This room is empty! No folio to charge.");
  }
};

  return (
    <div className="flex min-h-screen text-white" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={JSON.parse(localStorage.getItem('user'))} />
      <main className="flex-1 p-12">
        <div className="flex gap-8 mb-12 border-b border-white/5">
          {DEPARTMENTS.map(dept => (
            <button 
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`pb-4 text-[10px] uppercase font-black tracking-widest transition-all ${activeDept === dept ? 'text-amber-500 border-b border-amber-500' : 'text-white/20'}`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {rooms.filter(r => r.department === activeDept).map(room => (
            <div key={room._id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex justify-between mb-4">
                <h3 className="font-serif italic text-xl">{room.room_name}</h3>
                <span className={`w-2 h-2 rounded-full ${room.current_status === 'Ready' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-amber-500'}`} />
              </div>
              <p className="text-[10px] text-white/20 uppercase tracking-widest mb-6">{room.current_status}</p>
              
              <div className="flex flex-col gap-2">
                <button 
                  className="w-full py-2 bg-white/5 border border-white/5 rounded-lg text-[9px] uppercase font-bold hover:bg-amber-500 hover:text-white transition-all"
                  onClick={() => alert(`Manual Add-on triggered for ${room.room_name}`)}
                >
                  ☎️ Concierge Add-on
                </button>
                <button className="w-full py-2 bg-white/5 border border-white/5 rounded-lg text-[9px] uppercase font-bold hover:bg-white/10">
                  Service Request
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}