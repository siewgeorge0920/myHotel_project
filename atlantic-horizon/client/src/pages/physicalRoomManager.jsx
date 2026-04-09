import React, { useState, useEffect } from 'react';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';
import UnitSelectionModal from '../components/UnitSelectionModal';

export default function PhysicalRoomManager() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isManagerMode = localStorage.getItem('managerMode') === 'true';

  const [rooms, setRooms] = useState([]);
  const [physicalRooms, setPhysicalRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [selectedDeptForm, setSelectedDeptForm] = useState('Private Lodge');
  const [unitId, setUnitId] = useState('');
  
  // Filter & Selection State
  const [selectedDept, setSelectedDept] = useState('All');
  const [highlightedUnit, setHighlightedUnit] = useState(null);
  const DEPARTMENTS = ['All', 'Private Lodge', 'Private Residences & Villas', 'Ultimate Exclusivity'];

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [bulkModal, setBulkModal] = useState({ isOpen: false, roomType: '', department: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resRooms, resUnits] = await Promise.all([
        fetch('/api/rooms'),
        fetch('/api/physical-rooms')
      ]);
      const dataRooms = await resRooms.json();
      const dataUnits = await resUnits.json();
      
      setRooms(dataRooms);
      setPhysicalRooms(dataUnits);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadAndParams = async () => {
      await fetchData();
      
      // Parse URL Params for Linking
      const params = new URLSearchParams(window.location.search);
      const linkType = params.get('linkType'); // e.g. "Home"
      const selectUnit = params.get('select'); // e.g. "PL-101"

      if (linkType) {
        // Find room ID based on name and pre-select it
        // Note: we need to wait for rooms to be fetched first
      }
      
      if (selectUnit) {
        setHighlightedUnit(selectUnit);
        // If we know the unit, we can also auto-switch the department filter
      }
    };
    
    loadAndParams();
  }, []);

  // Update selection/filter when rooms/physicalRooms are loaded or params change
  useEffect(() => {
    if (loading) return;
    const params = new URLSearchParams(window.location.search);
    const linkType = params.get('linkType');
    const selectUnit = params.get('select');

    if (linkType) {
      const room = rooms.find(r => r.name === linkType);
      if (room) {
        setSelectedRoomId(room._id);
        setSelectedDept(room.department);
      }
    }

    if (selectUnit) {
      const unit = physicalRooms.find(u => u.roomName === selectUnit);
      if (unit) {
        setSelectedDept(unit.department);
        // Scroll to unit
        setTimeout(() => {
          const el = document.getElementById(`unit-${selectUnit}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
      }
    }
  }, [loading, rooms, physicalRooms]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!unitId) return;

    let department = selectedDeptForm;
    let roomTypeName = null;

    if (selectedRoomId) {
      const room = rooms.find(r => r._id === selectedRoomId);
      if (room) {
        department = room.department;
        roomTypeName = room.name;
      }
    }

    try {
      const res = await fetch('/api/physical-rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department,
          roomType: roomTypeName,
          roomName: unitId.toUpperCase()
        })
      });
      const data = await res.json();
      if (res.ok) {
        setUnitId('');
        fetchData();
      } else {
        alert(data.message || 'Error creating unit');
      }
    } catch (error) {
      alert('Server error');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Permanently delete this physical unit?")) return;
    try {
      await fetch(`/api/physical-rooms/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditSubmit = async (id) => {
    if(!editName) return;
    try {
      const res = await fetch(`/api/physical-rooms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName: editName })
      });
      if(res.ok) {
        setEditingId(null);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.message || 'Error updating unit');
      }
    } catch (error) {
       alert('Server error');
    }
  };

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManagerMode} />
      
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto">
        <header className="mb-10 border-b pb-8" style={{ borderColor: COLORS.border }}>
          <p className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-black mb-2">Admin Control</p>
          <h1 className="text-4xl font-serif italic">Physical Room Units</h1>
          <p className="text-white/40 text-xs mt-2 uppercase tracking-widest">Create and manage explicit physical units (e.g., PL-101) associated with Room Types.</p>
        </header>
        
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="p-6 h-fit border" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
            <h3 className="text-amber-500 font-serif text-xl mb-6">Provision New Unit</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">1. Select Department (Manor Wing)</label>
                <select 
                  required
                  value={selectedDeptForm} 
                  onChange={e => setSelectedDeptForm(e.target.value)}
                  className="w-full bg-white/5 border p-3 text-sm focus:border-amber-500 outline-none"
                  style={{ borderColor: COLORS.border }}
                >
                  {DEPARTMENTS.filter(d => d !== 'All').map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">2. Link to Package (Optional)</label>
                <select 
                  value={selectedRoomId} 
                  onChange={e => setSelectedRoomId(e.target.value)}
                  className="w-full bg-white/5 border p-3 text-sm focus:border-amber-500 outline-none"
                  style={{ borderColor: COLORS.border }}
                >
                  <option value="">-- No Package (Unassigned) --</option>
                  {rooms.filter(r => r.department === selectedDeptForm).map(r => (
                    <option key={r._id} value={r._id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">3. Enter Physical Unit ID</label>
                <input 
                  required
                  value={unitId}
                  onChange={e => setUnitId(e.target.value)}
                  placeholder="e.g. LODGE-101"
                  className="w-full bg-white/5 border uppercase p-3 text-sm focus:border-amber-500 outline-none"
                  style={{ borderColor: COLORS.border }}
                />
              </div>

              <button type="submit" disabled={loading} className="w-full mt-4 bg-amber-600 hover:bg-amber-500 text-white font-black text-[10px] uppercase tracking-[0.2em] py-3 transition-colors">
                Register Physical Unit
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
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

             {loading ? <p className="animate-pulse text-xs text-white/40 uppercase tracking-widest">Syncing Inventory...</p> : (
               <div className="space-y-6">
                 {/* Group by Department -> Room Type */}
                 {DEPARTMENTS.filter(d => d !== 'All').filter(d => selectedDept === 'All' || d === selectedDept).map(dept => (
                   <div key={dept} className="mb-8">
                     <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/50 border-b pb-2 mb-4" style={{ borderColor: COLORS.border }}>{dept}</h2>
                     <div className="grid sm:grid-cols-2 gap-4">
                       {physicalRooms.filter(pr => pr.department === dept).map(unit => (
                         <div 
                           key={unit._id} 
                           id={`unit-${unit.roomName}`}
                           className={`p-4 border flex items-center justify-between transition-all duration-1000 ${highlightedUnit === unit.roomName ? 'border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.3)] ring-1 ring-amber-500' : ''}`} 
                           style={{ backgroundColor: COLORS.bgSurface, borderColor: highlightedUnit === unit.roomName ? '#f59e0b' : COLORS.border }}
                         >
                           {editingId === unit._id ? (
                             <div className="flex w-full items-center gap-3">
                               <input 
                                 value={editName} 
                                 onChange={e => setEditName(e.target.value)} 
                                 className="bg-white/5 border border-amber-500 text-sm px-2 py-1 text-white uppercase outline-none w-full" 
                                 autoFocus 
                               />
                               <button onClick={() => handleEditSubmit(unit._id)} className="text-[10px] text-green-500 hover:text-green-400 uppercase tracking-widest font-black">Save</button>
                               <button onClick={() => setEditingId(null)} className="text-[10px] text-white/50 hover:text-white/80 uppercase tracking-widest font-black">Cancel</button>
                             </div>
                           ) : (
                             <div className="flex w-full items-center justify-between">
                               <div>
                                 <p className="font-serif text-lg text-amber-500">{unit.roomName}</p>
                                 <p className="text-[9px] uppercase tracking-widest text-white/40 mt-1">
                                   {unit.roomType ? unit.roomType : <span className="text-red-500/60 italic font-bold">Unassigned</span>}
                                 </p>
                               </div>
                               <div className="flex gap-2">
                                 <button onClick={() => { setEditingId(unit._id); setEditName(unit.roomName); }} className="text-[10px] text-blue-500 hover:text-blue-400 uppercase tracking-widest font-black transition-colors px-2">Edit</button>
                                 <button onClick={() => handleDelete(unit._id)} className="text-[10px] text-red-500 hover:text-red-400 uppercase tracking-widest font-black transition-colors px-2">Delete</button>
                               </div>
                             </div>
                           )}
                         </div>
                       ))}
                     </div>
                     {physicalRooms.filter(pr => pr.department === dept).length === 0 && <p className="text-xs text-white/20">No units provisioned here yet.</p>}
                   </div>
                 ))}
                 {physicalRooms.length === 0 && <p className="text-white/40 text-sm italic py-8 text-center border border-dashed" style={{ borderColor: COLORS.border }}>No physical units registered.</p>}
               </div>
             )}
          </div>
          
        </div>
      </main>

      <UnitSelectionModal 
        isOpen={bulkModal.isOpen}
        onClose={() => setBulkModal({ ...bulkModal, isOpen: false })}
        roomType={bulkModal.roomType}
        department={bulkModal.department}
        onComplete={(resMsg) => {
          fetchData();
        }}
      />
    </div>
  );
}
