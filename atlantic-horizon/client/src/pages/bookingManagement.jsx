import React, { useState, useEffect } from 'react';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';
import axios from 'axios';

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('today');

  const user = JSON.parse(localStorage.getItem('user')) || { role: 'staff' };
  const isAdmin = user.role === 'admin';
  const isManager = user.role === 'manager';
  const canEdit = isAdmin || isManager;
  const canDelete = isAdmin;

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    room_type: 'Private Lodge',
    check_in: '',
    check_out: '',
    total_amount: 0,
    status: 'Confirmed'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v3/bookings');
      setBookings(res.data.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleReceptionCheckIn = async (id) => {
    if (window.confirm("Perform manual check-in for this resident?")) {
      try {
        await axios.put(`/api/v3/bookings/${id}/status`, { status: 'CheckedIn' });
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || err.response?.data?.error || "Check-in failed");
      }
    }
  };

  const handleReceptionCheckOut = async (id) => {
    if (window.confirm("Complete check-out and settle folio?")) {
      try {
        await axios.put(`/api/v3/bookings/${id}/status`, { status: 'CheckedOut' });
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || err.response?.data?.error || "Check-out failed");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("CRITICAL: Delete this booking from the system?")) {
      try {
        await axios.delete(`/api/v3/bookings/${id}`);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.error || "Delete failed");
      }
    }
  };

  const openForm = (booking = null) => {
    if (booking) {
      setEditingId(booking._id);
      setFormData({
        guest_name: booking.guest_name,
        guest_email: booking.guest_email,
        room_type: booking.room_type,
        check_in: booking.check_in ? new Date(booking.check_in).toISOString().split('T')[0] : '',
        check_out: booking.check_out ? new Date(booking.check_out).toISOString().split('T')[0] : '',
        total_amount: booking.total_amount || 0,
        status: booking.status
      });
    } else {
      setEditingId(null);
      setFormData({
        guest_name: '',
        guest_email: '',
        room_type: 'Private Lodge',
        check_in: '',
        check_out: '',
        total_amount: 0,
        status: 'Confirmed'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/v3/bookings/${editingId}`, formData);
      } else {
        await axios.post('/api/v3/bookings/admin-create', {
          ...formData,
          booking_id: `BKG-${Math.floor(Math.random() * 900000 + 100000)}` // fallback
        });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Operation failed.");
    }
  };
  const getFilteredBookings = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return bookings.filter(b => {
      const bIn = new Date(b.check_in);
      const bOut = new Date(b.check_out);
      const bookingInDate = new Date(bIn.getFullYear(), bIn.getMonth(), bIn.getDate());
      const bookingOutDate = new Date(bOut.getFullYear(), bOut.getMonth(), bOut.getDate());

      if (activeFilter === 'today') {
        // Today's arrivals OR currently checked in
        return (bookingInDate.getTime() === today.getTime() && b.status !== 'CheckedOut' && b.status !== 'Cancelled') || b.status === 'CheckedIn';
      }
      if (activeFilter === 'upcoming') {
        // Future arrivals (not today, not history)
        return bookingInDate.getTime() > today.getTime() && b.status !== 'CheckedIn' && b.status !== 'CheckedOut' && b.status !== 'Cancelled';
      }
      if (activeFilter === 'history') {
        // Anyone who already left OR was cancelled
        return bookingOutDate.getTime() < today.getTime() || b.status === 'CheckedOut' || b.status === 'Cancelled';
      }
      return true;
    });
  };

  const filteredBookings = getFilteredBookings();
  return (
    <div className="flex min-h-screen text-white" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} />
      <main className="flex-1 p-12 relative overflow-hidden">
        <header className="mb-8 flex justify-between items-end relative z-10">
          <div>
            <h1 className="text-4xl font-serif italic mb-2">Manor Fleet Control</h1>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-black">Central Bookings Registry (CRUD)</p>
          </div>
          {(isAdmin || isManager) && (
            <button 
              onClick={() => openForm()}
              className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg"
            >
              + New Booking
            </button>
          )}
        </header>

        {/* Filter Bar */}
        <div className="flex gap-4 mb-8">
          {[
            { id: 'upcoming', label: 'Upcoming Arrivals' },
            { id: 'today', label: 'Today\'s Roster' },
            { id: 'history', label: 'History (Before)' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                activeFilter === f.id 
                  ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-600/20' 
                  : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/30'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-white/40 text-sm tracking-widest animate-pulse">Loading fleet data...</p>
        ) : (
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden relative z-10 backdrop-blur-sm">
            <table className="w-full text-left">
              <thead className="text-[10px] uppercase tracking-widest text-white/40 bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="p-6">Resident</th>
                  <th className="p-6">Department/Tier</th>
                  <th className="p-6">Dates</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {filteredBookings.map(b => (
                  <tr key={b._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span 
                          onClick={() => (canEdit && b.status !== 'CheckedOut') && openForm(b)}
                          className={`font-bold text-white/90 ${canEdit && b.status !== 'CheckedOut' ? 'cursor-pointer hover:text-amber-500 hover:underline decoration-amber-500/30 underline-offset-4' : ''}`}
                        >
                          {b.guest_name}
                        </span>
                        
                        {activeFilter === 'upcoming' ? (
                          <div className="flex flex-col mt-2 gap-1">
                             <p className="text-[10px] text-white/40 flex items-center gap-1">
                               <span>📧</span> {b.guest_email}
                             </p>
                             <p className="text-[10px] text-white/40 flex items-center gap-1">
                               <span>📱</span> {b.guest_phone || 'No phone record'}
                             </p>
                          </div>
                        ) : (
                          <p className="text-[10px] text-white/40 font-mono mt-1">{b.booking_id || b._id}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-white/60">{b.room_type}</p>
                      {activeFilter === 'upcoming' && (
                        <span className={`mt-2 inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                          b.payment_status === 'Paid' ? 'border-green-500/20 text-green-500/60 bg-green-500/5' : 'border-red-500/20 text-red-500/60 bg-red-500/5'
                        }`}>
                          {b.payment_status === 'Paid' ? 'Full Paid' : 'Not Paid'}
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-xs text-white/50">
                       <p>In: {new Date(b.check_in).toLocaleDateString()}</p>
                       <p>Out: {new Date(b.check_out).toLocaleDateString()}</p>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        b.status === 'CheckedIn' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 
                        b.status === 'CheckedOut' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                        b.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                        'bg-white/5 text-white/60 border-white/10'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-6 flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                      
                      {b.status === 'Confirmed' && (
                        <button onClick={() => handleReceptionCheckIn(b._id)} className="bg-green-600/80 hover:bg-green-500 text-white px-3 py-2 rounded text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-500/10">
                          Check-In
                        </button>
                      )}
                      
                      {b.status === 'CheckedIn' && (
                        <button onClick={() => handleReceptionCheckOut(b._id)} className="bg-amber-600/80 hover:bg-amber-500 text-white px-3 py-2 rounded text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/10">
                          Check-Out
                        </button>
                      )}

                      {canDelete && activeFilter !== 'history' && (
                        <button onClick={() => handleDelete(b._id)} className="text-red-500/40 hover:text-red-400 text-[10px] font-black uppercase tracking-widest px-2">Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-white/30 italic">No bookings found in this roster.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* CRUD Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1a1d17] border border-white/10 p-8 rounded-3xl w-full max-w-xl">
              <h2 className="text-3xl font-serif italic text-amber-500 mb-6 border-b border-white/10 pb-4">
                {editingId ? "Modify Manifest" : "New Manifest Entry"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">Guest Name</label>
                    <input type="text" required value={formData.guest_name} onChange={e => setFormData({...formData, guest_name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-amber-500 outline-none rounded" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">Guest Email</label>
                    <input type="email" required value={formData.guest_email} onChange={e => setFormData({...formData, guest_email: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-amber-500 outline-none rounded" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">Department / Tier</label>
                  <select value={formData.room_type} onChange={e => setFormData({...formData, room_type: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-amber-500 outline-none rounded text-white appearance-none">
                    <option value="Private Lodge">Private Lodge</option>
                    <option value="Private Residences & Villas">Private Residences & Villas</option>
                    <option value="Ultimate Exclusivity">Ultimate Exclusivity</option>
                  </select>
                </div>

                {!editingId && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">Check-In Date</label>
                      <input type="date" required value={formData.check_in} onChange={e => setFormData({...formData, check_in: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-amber-500 outline-none rounded min-w-[150px]" style={{ colorScheme: 'dark' }} />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">Check-Out Date</label>
                      <input type="date" required value={formData.check_out} onChange={e => setFormData({...formData, check_out: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-amber-500 outline-none rounded min-w-[150px]" style={{ colorScheme: 'dark' }} />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">Total Amount (€)</label>
                    <input type="number" required value={formData.total_amount} onChange={e => setFormData({...formData, total_amount: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-amber-500 outline-none rounded" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-amber-500 outline-none rounded text-white appearance-none">
                      <option value="Confirmed">Confirmed</option>
                      <option value="CheckedIn">Checked In</option>
                      <option value="CheckedOut">Checked Out</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                 <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-xs uppercase font-bold text-white/50 hover:text-white transition-colors">
                    Cancel
                  </button>
                  {formData.status !== 'CheckedOut' ? (
                    <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-amber-500/20">
                      Save Manifest
                    </button>
                  ) : (
                    <div className="bg-white/5 px-6 py-3 rounded-full text-[9px] font-black uppercase text-white/20 border border-white/10">
                      🔒 Past Stay Locked
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}