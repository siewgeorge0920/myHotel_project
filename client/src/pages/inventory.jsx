import React, { useState, useEffect } from 'react';
import { COLORS } from '../colors';
import ManagementSidebar from '../components/managementSidebar';
import LuxuryLoader from '../components/luxuryLoader';
import CustomModal from '../components/CustomModal';

export default function Inventory() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => { setRooms(data); setLoading(false); });
  }, []);

  const isAdmin = user?.role === 'admin';

  const [alertObj, setAlertObj] = useState({ isOpen: false, text: '' });
  const showAlert = (text) => setAlertObj({ isOpen: true, text });

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: COLORS.bgDeep }}>
      {/* Left sidebar navigation for Admin and Staff */}
      <ManagementSidebar user={user} />
      
      <main className="flex-1 p-16 text-white">
        {loading && <LuxuryLoader message="Syncing Sanctuary Data..." />}
        
        <header className="flex justify-between items-end mb-12 border-b pb-8" style={{ borderColor: COLORS.border }}>
          <div>
            <h1 className="text-4xl font-serif italic mb-2">Inventory Control</h1>
            <p style={{ color: COLORS.gold }} className="text-[10px] uppercase tracking-[0.4em]">Live Room Availability</p>
          </div>
          <button style={{ backgroundColor: COLORS.amber }} className="px-8 py-3 text-[10px] uppercase font-black tracking-widest hover:brightness-110 transition-all">
            + Create New Room
          </button>
        </header>

        <div className="grid gap-4">
          {rooms.map(room => (
            <div key={room._id} className="p-6 flex justify-between items-center group" style={{ backgroundColor: COLORS.bgSurface, border: `1px solid ${COLORS.border}` }}>
              <div>
                <h3 className="text-xl font-serif tracking-widest">{room.name}</h3>
                <p className="text-[10px] uppercase tracking-widest mt-1 text-gray-500">Price: RM {room.pricePerNight}</p>
              </div>
              
              <div className="flex items-center space-x-8">
                <button className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Edit</button>
                
                {/* Core permission logic */}
                {isAdmin ? (
                  <button className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-400 font-bold" onClick={() => showAlert('Permanently Deleting...')}>
                    Delete
                  </button>
                ) : (
                  <button 
                    className="text-[10px] uppercase tracking-widest text-amber-500 border border-amber-500/30 px-3 py-1 hover:bg-amber-500/10" 
                    onClick={() => showAlert('Request to delete "' + room.name + '" has been sent to Admin for approval. 👑')}
                  >
                    Request Deletion
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <CustomModal 
        isOpen={alertObj.isOpen}
        title="Admin Alert"
        message={alertObj.text}
        isAlert={true}
        onConfirm={() => setAlertObj({ isOpen: false, text: '' })}
        confirmText="Acknowledge"
      />
    </div>
  );
}