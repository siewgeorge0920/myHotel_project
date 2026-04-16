import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';

export default function InventoryManagement() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('All');
  
  const [formData, setFormData] = useState({
    room_name: '',
    department: 'Private Lodge',
    room_type_category: 'Standard Lodge (King)',
    current_status: 'Ready'
  });
  
  const [error, setError] = useState(null);

  const fetchRooms = async (initial = false) => {
    try {
      // Initial load shows full-page loading state; background refresh does not.
      if (initial) setLoading(true);
      const res = await axios.get('/api/v3/physical-rooms');
      setRooms(res.data);
    } catch (err) {
      setError('Failed to fetch inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Bootstrap inventory dataset when page mounts.
    fetchRooms(true);
  }, []);

  const handleOpenCreate = () => {
    // Reset form for provision flow.
    setIsEditing(false);
    setFormData({ room_name: '', department: 'Private Lodge', room_type_category: 'Standard Lodge (King)', current_status: 'Ready' });
    setShowModal(true);
  };

  const handleOpenEdit = (room) => {
    // Pre-fill form with selected unit values for reconfiguration.
    setIsEditing(true);
    setEditingId(room._id);
    setFormData({
      room_name: room.room_name,
      department: room.department,
      room_type_category: room.room_type_category,
      current_status: room.current_status
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      // Same modal submit handles create and edit depending on mode.
      if (isEditing) {
        await axios.put(`/api/v3/physical-rooms/${editingId}`, formData);
      } else {
        await axios.post('/api/v3/physical-rooms', formData);
      }
      setShowModal(false);
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.error || 'Operation failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sanctify decommission? This unit will be removed from the Manor's core registry.")) return;
    try {
      await axios.delete(`/api/v3/physical-rooms/${id}`);
      fetchRooms();
    } catch (err) {
      alert('Deactivation failed.');
    }
  };

  const updateQuickStatus = async (id, status) => {
    // Lightweight status transition from the table view.
    try {
      await axios.put(`/api/v3/physical-rooms/${id}`, { current_status: status });
      fetchRooms();
    } catch (err) {
      alert('Status update failed.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ready': return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5';
      case 'Occupied': return 'text-amber-400 border-amber-400/20 bg-amber-400/5';
      case 'Maintenance': return 'text-red-400 border-red-400/20 bg-red-400/5';
      case 'Cleaning': return 'text-sky-400 border-sky-400/20 bg-sky-400/5';
      default: return 'text-white/20 border-white/10';
    }
  };

  const departments = ['All', 'Private Lodge', 'Private Residence', 'Ultimate Exclusivity'];

  const filteredRooms = rooms.filter(r => filter === 'All' || r.department === filter);

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar isManagerMode={true} user={JSON.parse(localStorage.getItem('user'))} />
      
      <main className="flex-1 p-8 lg:p-20 overflow-x-hidden">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <h1 className="text-5xl font-serif italic text-white/90">Room Inventory</h1>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="bg-amber-600 hover:bg-amber-500 text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-2xl"
          >
            Deploy New Unit
          </button>
        </header>

        {/* --- FILTER SYSTEM --- */}
        <div className="flex gap-2 mb-10 border-b border-white/5 pb-1 flex-wrap">
          {departments.map(dept => (
            <button 
              key={dept}
              onClick={() => setFilter(dept)}
              className={`px-6 py-4 text-[9px] uppercase tracking-[0.5em] font-black transition-all relative ${filter === dept ? 'text-amber-500' : 'text-white/20 hover:text-white/40'}`}
            >
              {dept}
              {filter === dept && <span className="absolute bottom-0 left-0 w-full h-px bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,1)]" />}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20 animate-pulse text-amber-500/50 uppercase tracking-[0.5em] text-xs">Synchronizing Buffer...</div>
        ) : (
          <div className="bg-white/[0.01] border border-white/5 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[9px] uppercase tracking-[0.6em] text-white/20 font-black">
                <tr>
                  <th className="p-8">Unit Identifier</th>
                  <th className="p-8">Department</th>
                  <th className="p-8">Product Class</th>
                  <th className="p-8">Current Status</th>
                  <th className="p-8 text-right">Sanctuary Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRooms.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-20 text-center opacity-20 italic font-serif">No units mapped in this segment.</td>
                  </tr>
                )}
                {filteredRooms.map(room => (
                  <tr key={room._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="p-8">
                       <p className="text-xl font-serif italic text-white/80">{room.room_name}</p>
                    </td>
                    <td className="p-8">
                       <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium">{room.department}</span>
                    </td>
                    <td className="p-8">
                       <span className="text-[10px] uppercase tracking-widest text-white/40 font-black">{room.room_type_category}</span>
                    </td>
                    <td className="p-8">
                       <div className="flex items-center gap-4">
                          <span className={`px-3 py-1.5 border text-[9px] font-black uppercase tracking-widest transition-all ${getStatusColor(room.current_status)}`}>
                            {room.current_status}
                          </span>
                       </div>
                    </td>
                    <td className="p-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => handleOpenEdit(room)} className="px-4 py-2 border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/10 text-white/20 hover:text-amber-500 transition-all text-[8px] uppercase font-black tracking-widest">Edit</button>
                          <button onClick={() => handleDelete(room._id)} className="px-4 py-2 border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 text-white/10 hover:text-red-400 transition-all text-[8px] uppercase font-black tracking-widest">Del</button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Deploy/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
             <div className="bg-[#121411] border border-amber-600/30 w-full max-w-lg shadow-2xl relative">
                <div className="p-10 border-b border-white/5 flex justify-between items-center">
                  <h3 className="font-serif text-2xl italic">{isEditing ? 'Reconfigure Unit' : 'Provision New Physical Unit'}</h3>
                  <button onClick={() => setShowModal(false)} className="text-white/20 hover:text-white">✕</button>
                </div>
                <div className="p-10 space-y-8">
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.5em] text-amber-500 font-black">Unit Identifier (Name)</label>
                    <input 
                      placeholder="e.g. Lodge 101"
                      className="w-full bg-white/[0.03] border border-white/10 p-5 text-xs outline-none focus:border-amber-500/50"
                      value={formData.room_name}
                      onChange={e => setFormData({...formData, room_name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.5em] text-amber-500 font-black">Department</label>
                      <select 
                        className="w-full bg-white/[0.03] border border-white/10 p-5 text-[10px] outline-none appearance-none"
                        value={formData.department}
                        onChange={e => {
                          const dept = e.target.value;
                          const defaultTypes = { 
                            'Private Lodge': 'Standard Lodge (King)', 
                            'Private Residence': 'Atlantic Private Estate', 
                            'Ultimate Exclusivity': 'The Sovereign Mansion' 
                          };
                          setFormData({...formData, department: dept, room_type_category: defaultTypes[dept]});
                        }}
                      >
                        <option>Private Lodge</option>
                        <option>Private Residence</option>
                        <option>Ultimate Exclusivity</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.5em] text-amber-500 font-black">Specific Room Type</label>
                      <select 
                        className="w-full bg-white/[0.03] border border-white/10 p-5 text-[10px] outline-none appearance-none"
                        value={formData.room_type_category}
                        onChange={e => setFormData({...formData, room_type_category: e.target.value})}
                      >
                        {formData.department === 'Private Lodge' && (
                          <>
                            <option>Standard Lodge (King)</option>
                            <option>Deluxe Lodge (Double)</option>
                          </>
                        )}
                        {formData.department === 'Private Residence' && (
                          <option>Atlantic Private Estate</option>
                        )}
                        {formData.department === 'Ultimate Exclusivity' && (
                          <option>The Sovereign Mansion</option>
                        )}
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={handleSubmit}
                    className="w-full bg-amber-600 py-6 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-amber-500 transition-all shadow-xl"
                  >
                    {isEditing ? 'Save Reconfiguration' : 'Confirm Deployment'}
                  </button>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
