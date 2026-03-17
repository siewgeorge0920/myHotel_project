import React, { useState, useEffect } from 'react';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';
import CustomModal from '../components/CustomModal';

const EMPTY_ROOM = { name: '', pricePerNight: '', category: 'Resort', description: '', imageUrl: '', isAvailable: true };

export default function RoomManagement() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isManagerMode = localStorage.getItem('managerMode') === 'true';
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(EMPTY_ROOM);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchRooms = async () => {
    const res = await fetch('http://localhost:5000/api/rooms');
    const data = await res.json();
    setRooms(data);
  };

  useEffect(() => { fetchRooms(); }, []);

  const flash = (text, isErr = false) => {
    setMsg({ text, isErr });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = editId ? `http://localhost:5000/api/rooms/${editId}` : 'http://localhost:5000/api/rooms';
    const method = editId ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, pricePerNight: Number(form.pricePerNight) })
      });
      if (!res.ok) throw new Error('Failed');
      flash(editId ? '✅ Room updated' : '✅ Room created');
      setForm(EMPTY_ROOM);
      setEditId(null);
      fetchRooms();
    } catch {
      flash('❌ Error occurred', true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (room) => {
    setForm({ name: room.name, pricePerNight: room.pricePerNight, category: room.category, description: room.description, imageUrl: room.imageUrl || '', isAvailable: room.isAvailable });
    setEditId(room._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: null });

  const requestDelete = (id, name) => {
    setDeleteModal({ isOpen: true, id, name });
  };

  const confirmDelete = async () => {
    const { id } = deleteModal;
    setDeleteModal({ isOpen: false, id: null, name: null });
    await fetch(`http://localhost:5000/api/rooms/${id}`, { method: 'DELETE' });
    flash('🗑️ Room deleted');
    fetchRooms();
  };

  const CATEGORIES = ['Resort', 'Private Lodge', 'Villa'];
  const FIELDS = [
    { key: 'name', label: 'Room Name', type: 'text', placeholder: 'e.g. Cliffside Ocean Suite', required: true },
    { key: 'pricePerNight', label: 'Price / Night (€)', type: 'number', placeholder: '450', required: true },
    { key: 'imageUrl', label: 'Image URL', type: 'text', placeholder: 'https://...' },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description...' },
  ];

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManagerMode} />
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto">
        <header className="mb-10 border-b pb-8" style={{ borderColor: COLORS.border }}>
          <p className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-black mb-2">Admin Control</p>
          <h1 className="text-4xl font-serif italic">Room Management</h1>
          <p className="text-white/30 text-sm mt-1">{rooms.length} rooms in database</p>
        </header>

        {msg && (
          <div className={`mb-6 px-6 py-4 text-sm font-bold uppercase tracking-widest border ${msg.isErr ? 'border-red-500/40 bg-red-500/10 text-red-400' : 'border-amber-500/40 bg-amber-500/10 text-amber-400'}`}>
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Form */}
          <div className="p-8 border" style={{ backgroundColor: COLORS.bgSurface, borderColor: editId ? COLORS.amber : COLORS.border }}>
            <h2 className="text-lg font-serif italic mb-6">{editId ? '✏️ Editing Room' : '+ Create New Room'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {FIELDS.map(f => (
                <div key={f.key}>
                  <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-1">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      rows={3}
                      className="w-full bg-white/5 border p-3 text-sm outline-none focus:border-amber-500 transition-colors resize-none"
                      style={{ borderColor: COLORS.border }}
                    />
                  ) : (
                    <input
                      type={f.type}
                      value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      required={f.required}
                      className="w-full bg-white/5 border p-3 text-sm outline-none focus:border-amber-500 transition-colors"
                      style={{ borderColor: COLORS.border }}
                    />
                  )}
                </div>
              ))}

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-white/5 border p-3 text-sm outline-none focus:border-amber-500 transition-colors"
                  style={{ borderColor: COLORS.border }}>
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#242820]">{c}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">Available</label>
                <button type="button" onClick={() => setForm({ ...form, isAvailable: !form.isAvailable })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.isAvailable ? 'bg-amber-600' : 'bg-white/20'}`}>
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.isAvailable ? 'left-7' : 'left-1'}`} />
                </button>
                <span className="text-xs text-white/50">{form.isAvailable ? 'Yes' : 'No'}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} style={{ backgroundColor: COLORS.amber }}
                  className="flex-1 py-3 uppercase text-[10px] font-black tracking-widest hover:brightness-110 disabled:opacity-50">
                  {loading ? 'Saving...' : (editId ? 'Save Changes' : 'Create Room')}
                </button>
                {editId && (
                  <button type="button" onClick={() => { setForm(EMPTY_ROOM); setEditId(null); }}
                    className="px-4 border border-white/20 text-[10px] uppercase font-black hover:bg-white/5">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Rooms Grid */}
          <div className="xl:col-span-2 space-y-4">
            {rooms.length === 0 ? (
              <div className="p-12 border border-dashed text-center text-white/20 uppercase tracking-widest text-xs" style={{ borderColor: COLORS.border }}>
                No rooms yet. Create your first room →
              </div>
            ) : (
              rooms.map(room => (
                <div key={room._id} className="flex gap-4 p-5 border hover:border-white/20 transition-all" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
                  {room.imageUrl && (
                    <img src={room.imageUrl} alt={room.name} className="w-24 h-20 object-cover flex-shrink-0"
                      onError={e => { e.target.style.display = 'none'; }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-lg">{room.name}</h3>
                        <p className="text-[10px] uppercase tracking-widest text-amber-500 mt-0.5">{room.category}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-2xl font-serif italic text-amber-400">€{room.pricePerNight}</p>
                        <p className="text-[9px] text-white/30 uppercase">/night</p>
                      </div>
                    </div>
                    {room.description && <p className="text-xs text-white/40 mt-2 truncate">{room.description}</p>}
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-[9px] uppercase tracking-widest font-black px-2 py-1 border ${room.isAvailable ? 'border-green-500/40 text-green-400' : 'border-red-500/40 text-red-400'}`}>
                        {room.isAvailable ? '✓ Available' : '✗ Unavailable'}
                      </span>
                      <div className="flex gap-4">
                        <button onClick={() => handleEdit(room)} className="text-[10px] uppercase font-black tracking-widest text-amber-500 hover:text-amber-300">Edit</button>
                        <button onClick={() => requestDelete(room._id, room.name)} className="text-[10px] uppercase font-black tracking-widest text-red-500/60 hover:text-red-400">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      
      <CustomModal 
        isOpen={deleteModal.isOpen}
        title="Delete Room"
        message={`Are you sure you want to permanently delete "${deleteModal.name}"? This cannot be undone.`}
        isAlert={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, name: null })}
        confirmText="Yes, Delete Room"
        cancelText="Cancel"
      />
    </div>
  );
}
