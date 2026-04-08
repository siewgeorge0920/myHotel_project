import React, { useState, useEffect } from 'react';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';
import CustomModal from '../components/CustomModal';
import AdminRoomPackageCreator from './AdminRoomPackageCreator'; 
import UnitSelectionModal from '../components/UnitSelectionModal'; 

export default function RoomPackage() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isManagerMode = localStorage.getItem('managerMode') === 'true';

  // State Management
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreator, setShowCreator] = useState(false); 
  const [editingRoom, setEditingRoom] = useState(null); 
  const [selectedDept, setSelectedDept] = useState('All'); 
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: null });
  const [bulkModal, setBulkModal] = useState({ isOpen: false, roomType: '', department: '' });
  const [msg, setMsg] = useState(null);
  
  const DEPARTMENTS = ['All', 'Private Lodge', 'Private Residences & Villas', 'Ultimate Exclusivity'];

  // Fetch the luxury packages from DB
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const [resRooms, resUnits] = await Promise.all([
        fetch('http://localhost:5000/api/rooms'),
        fetch('http://localhost:5000/api/physical-rooms')
      ]);
      const dataRooms = await resRooms.json();
      const dataUnits = await resUnits.json();
      
      const combinedRooms = dataRooms.map(r => ({
        ...r,
        physicalUnits: dataUnits.filter(u => u.roomType === r.name).map(u => u.roomName)
      }));
      setRooms(combinedRooms);
    } catch (error) {
      console.error("Failed to fetch luxury packages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleEdit = (room) => {
    setEditingRoom(room);
    setShowCreator(true);
    // Scroll to the top where the creator form is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Notification System
  const flash = (text, isErr = false) => {
    setMsg({ text, isErr });
    setTimeout(() => setMsg(null), 3000);
  };

  // Delete Handlers
  const requestDelete = (id, name) => {
    setDeleteModal({ isOpen: true, id, name });
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${deleteModal.id}`, { method: 'DELETE' });
      if (res.ok) {
        flash('Luxury Package deleted successfully ✅');
        fetchRooms();
      } else {
        flash('Failed to delete package ❌', true);
      }
    } catch (e) {
      flash('Server connection error ❌', true);
    }
    setDeleteModal({ isOpen: false, id: null, name: null });
  };

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManagerMode} />
      
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto">
        <header className="mb-10 border-b pb-8" style={{ borderColor: COLORS.border }}>
          <h1 className="text-4xl font-serif text-amber-500 mb-2">Luxury Package Management</h1>
          <p className="text-white/50 tracking-wide">Configure property tiers, physical units, and exclusive services.</p>
        </header>

        {msg && (
          <div className={`p-4 mb-6 rounded ${msg.isErr ? 'bg-red-900/50 text-red-200 border border-red-500' : 'bg-green-900/50 text-green-200 border border-green-500'}`}>
            {msg.text}
          </div>
        )}

        {/* 🌟 LUXURY PACKAGE CREATOR TOGGLE */}
        <div className="mb-12">
          <button 
            onClick={() => {
              if (editingRoom) {
                setEditingRoom(null);
                setShowCreator(false);
              } else {
                setShowCreator(!showCreator);
              }
            }}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded transition duration-200 shadow-lg uppercase tracking-wider text-xs"
          >
            {editingRoom ? 'Editing Package...' : (showCreator ? 'Cancel Creation ✕' : '+ Create New Luxury Package')}
          </button>
          
          {showCreator && (
            <div className="mt-6 transition-all duration-300 ease-in-out">
              <AdminRoomPackageCreator 
                editData={editingRoom}
                onCancel={() => {
                  setEditingRoom(null);
                  setShowCreator(false);
                }}
                onPackageCreated={() => {
                  setShowCreator(false); // Hide the card automatically
                  setEditingRoom(null);
                  fetchRooms(); // Refresh the data list
                  flash(editingRoom ? 'Luxury Package updated successfully ✅' : 'New Luxury Package deployed to the server ✅');
                }} 
              />
            </div>
          )}
        </div>

        {/* 🌟 LUXURY PACKAGE INVENTORY LIST */}
        <div>
          <h2 className="text-2xl font-serif text-amber-500 mb-6">Current Inventory</h2>
          
          {/* 🔍 Department Filter Bar (Minimalist) */}
          <div className="mb-8 flex gap-8 border-b border-white/5 pb-2 overflow-x-auto scrollbar-hide">
            {DEPARTMENTS.map(dept => (
              <button 
                key={dept} 
                onClick={() => setSelectedDept(dept)}
                className={`whitespace-nowrap pb-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${selectedDept === dept ? 'text-amber-500' : 'text-white/30 hover:text-white/60'}`}
              >
                {dept}
                {selectedDept === dept && (
                  <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {loading && !rooms.length ? (
              <p className="text-white/50 animate-pulse text-xs uppercase tracking-widest text-center py-12">Loading luxury packages...</p>
            ) : rooms.filter(r => selectedDept === 'All' || r.department === selectedDept).length === 0 ? (
              <div className="p-12 border border-dashed border-white/10 text-center rounded-lg bg-white/5">
                <p className="text-white/30 italic text-sm tracking-wide">No packages found in "{selectedDept}" department.</p>
              </div>
            ) : (
              rooms
                .filter(r => selectedDept === 'All' || r.department === selectedDept)
                .map(room => (
                  <div key={room._id} className="relative border p-6 flex flex-col md:flex-row gap-6 hover:border-amber-500/50 transition-colors shadow-sm" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
                    
                    {/* 👑 Vertical Department Strip */}
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-600"></div>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h3 className="text-xl font-serif text-amber-500">{room.name}</h3>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">{room.department}</span>
                      </div>
                      
                      <p className="text-xs text-white/50 uppercase tracking-[0.2em] mb-4">
                        {room.bedType} • {room.layout}
                      </p>

                      <div className="flex flex-wrap gap-6 mb-4">
                        <div>
                          <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Price / Night</p>
                          <p className="text-base font-bold text-white">€{room.pricePerNight}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Capacity</p>
                          <p className="text-sm text-white font-medium">{room.maxGuests} Guests</p>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1 flex items-center gap-2">
                            Physical Units
                            <button 
                              onClick={() => setBulkModal({ isOpen: true, roomType: room.name, department: room.department })}
                              className="text-amber-500 hover:text-amber-400 font-bold"
                            >
                              Edit ↗
                            </button>
                          </p>
                          {(!room.physicalUnits || room.physicalUnits.length === 0) ? (
                            <p className="text-[10px] text-white/20 italic">No units registered.</p>
                          ) : (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {room.physicalUnits.map((u, i) => (
                                <a 
                                  key={i} 
                                  href={`/physicalRooms?select=${encodeURIComponent(u)}`}
                                  className="text-[9px] bg-white/5 px-2 py-0.5 rounded font-mono border border-white/10 text-white/60 hover:border-amber-500/50 hover:text-amber-500 transition-all cursor-pointer"
                                >
                                  {u}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {room.services && room.services.length > 0 ? (
                          room.services.map((service, idx) => (
                            <span key={idx} className="text-[8px] bg-amber-600/10 border border-amber-600/20 text-amber-500/80 px-2 py-0.5 rounded uppercase tracking-tighter">
                              {service}
                            </span>
                          ))
                        ) : (
                          <span className="text-[8px] text-white/20 italic">No special services attached</span>
                        )}
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-between md:justify-center items-end gap-3 min-w-[120px] md:border-l md:border-white/5 md:pl-6" style={{ borderColor: COLORS.border }}>
                      <span className={`text-[9px] uppercase tracking-widest font-black px-2 py-1 border ${room.isAvailable ? 'border-green-500/40 text-green-400' : 'border-red-500/40 text-red-400'}`}>
                        {room.isAvailable ? '✓ Active' : '✗ Inactive'}
                      </span>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => handleEdit(room)} 
                          className="text-[9px] uppercase font-black tracking-widest text-blue-500/60 hover:text-blue-400 transition-colors"
                        >
                          Edit
                        </button>
                        <button onClick={() => requestDelete(room._id, room.name)} className="text-[9px] uppercase font-black tracking-widest text-red-500/60 hover:text-red-400 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </main>
      
      {/* Security Check Modal */}
      <CustomModal 
        isOpen={deleteModal.isOpen}
        title="Delete Luxury Package"
        message={`Are you sure you want to permanently delete "${deleteModal.name}"? This will remove all associated physical houses from the database. This action cannot be undone.`}
        isAlert={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, name: null })}
        confirmText="Yes, Delete Package"
        cancelText="Cancel"
      />

      <UnitSelectionModal 
        isOpen={bulkModal.isOpen}
        onClose={() => setBulkModal({ ...bulkModal, isOpen: false })}
        roomType={bulkModal.roomType}
        department={bulkModal.department}
        onComplete={(resMsg) => {
          flash(resMsg);
          fetchRooms();
        }}
      />
    </div>
  );
}