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

  // Modal/Details State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
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
    try {
      const res = await axios.put(`/api/v3/bookings/${id}/reception-checkin`);
      setBookings(prev => prev.map(b => b._id === id ? res.data.data : b));
    } catch (err) {
      console.error("Check-in conflict or system error:", err.response?.data?.error || err.message);
    }
  };

  const handleReceptionCheckOut = async (id) => {
    if (window.confirm("Complete check-out and settle folio?")) {
      try {
        const res = await axios.put(`/api/v3/bookings/${id}/status`, { status: 'CheckedOut' });
        setBookings(prev => prev.map(b => b._id === id ? res.data.data : b));
      } catch (err) {
        alert(err.response?.data?.message || err.response?.data?.error || "Check-out failed");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("CRITICAL: Delete this booking from the system?")) {
      try {
        await axios.delete(`/api/v3/bookings/${id}`);
        setBookings(prev => prev.filter(b => b._id !== id));
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

  const openDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/v3/bookings/${editingId}`, formData);
      } else {
        await axios.post('/api/v3/bookings/admin-create', {
          ...formData,
          booking_id: `BKG-${Math.floor(Math.random() * 900000 + 100000)}` 
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
        return (bookingInDate.getTime() === today.getTime() && b.status !== 'CheckedOut' && b.status !== 'Cancelled') || b.status === 'CheckedIn';
      }
      if (activeFilter === 'upcoming') {
        return bookingInDate.getTime() > today.getTime() && b.status !== 'CheckedIn' && b.status !== 'CheckedOut' && b.status !== 'Cancelled';
      }
      if (activeFilter === 'history') {
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
              <tbody className="text-sm">
              {filteredBookings.map(b => {
                const nights = b.nights || Math.ceil(Math.abs(new Date(b.check_out) - new Date(b.check_in)) / (1000 * 60 * 60 * 24));
                const isCheckedOut = b.status === 'CheckedOut';

                return (
                  <tr key={b._id} className="border-t border-white/5 hover:bg-white/[0.01] transition-colors">
                    <td className="p-6">
                      <button 
                        onClick={() => openDetails(b)}
                        className="font-bold text-white/90 hover:text-amber-500 transition-colors text-left"
                      >
                        {b.guest_name}
                      </button>
                      <p className="text-[10px] text-white/20 font-mono tracking-tighter">{b.booking_id}</p>
                    </td>
                    <td className="p-6 text-white/60 font-light">{b.room_type}</td>
                    <td className="p-6">
                      <p className="text-amber-500 font-mono font-bold">€{b.total_amount}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] px-2 py-0.5 rounded bg-white/5 text-white/40 border border-white/5 uppercase font-black">
                          {nights} {nights === 1 ? 'Night' : 'Nights'}
                        </span>
                        <span className="text-[9px] uppercase text-white/20 tracking-widest font-bold">{b.payment_status}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        b.status === 'CheckedIn' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                        isCheckedOut ? 'bg-white/5 text-white/20 border border-white/5' :
                        'bg-white/5 text-white/30 border border-white/5'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        {b.status === 'Confirmed' && !isAdmin && !isManager && (
                          <button 
                            onClick={() => handleReceptionCheckIn(b._id)}
                            className="bg-white text-black px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-xl"
                          >
                            Check-in
                          </button>
                        )}
                        {b.status === 'CheckedIn' && !isAdmin && !isManager && (
                          <button 
                            onClick={() => handleReceptionCheckOut(b._id)}
                            className="bg-amber-600 text-white px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl"
                          >
                            Checkout
                          </button>
                        )}
                        
                        {/* ONLY SHOW EDIT/DEL IF NOT CHECKED OUT */}
                        {!isCheckedOut && (
                          <>
                            {canEdit && (
                              <button 
                                onClick={() => openForm(b)}
                                className="bg-white/5 text-white/40 hover:text-white px-4 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border border-white/5"
                              >
                                Edit
                              </button>
                            )}
                            {canDelete && (
                              <button 
                                onClick={() => handleDelete(b._id)}
                                className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border border-red-500/20"
                              >
                                Del
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            </table>
          </div>
        )}

        {/* DETAILS MODAL */}
        {isDetailsOpen && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-[#1a1d17] border border-amber-600/30 p-10 rounded-3xl w-full max-w-2xl relative shadow-2xl">
              <button 
                onClick={() => setIsDetailsOpen(false)}
                className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
              >
                ✕ Close
              </button>
              
              <div className="mb-10 border-b border-white/5 pb-6">
                <p className="text-amber-500 uppercase tracking-widest text-[9px] font-black mb-2">Guest Manifest Details</p>
                <h2 className="text-4xl font-serif italic text-white">{selectedBooking.guest_name}</h2>
                <p className="text-xs font-mono text-white/30 uppercase mt-1 tracking-tighter">REF: {selectedBooking.booking_id}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-2">Contact Intelligence</p>
                    <p className="text-sm font-medium">{selectedBooking.guest_email}</p>
                    <p className="text-sm font-light text-white/60">{selectedBooking.guest_phone || "No phone listed"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-2">Department / Tier</p>
                    <p className="text-sm font-serif italic text-amber-100">{selectedBooking.room_type}</p>
                    <p className="text-xs text-white/40 mt-1">Status: {selectedBooking.status}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-2">Itinerary</p>
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded border border-white/5">
                      <div>
                        <p className="text-[10px] uppercase text-white/30">From</p>
                        <p className="text-sm font-mono">{new Date(selectedBooking.check_in).toLocaleDateString()}</p>
                      </div>
                      <div className="h-4 w-[1px] bg-white/10 mx-4"></div>
                      <div>
                        <p className="text-[10px] uppercase text-white/30">Until</p>
                        <p className="text-sm font-mono">{new Date(selectedBooking.check_out).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-2">Financials</p>
                    <p className="text-2xl font-mono text-white">€{selectedBooking.total_amount}</p>
                    <p className={`text-[9px] uppercase font-black px-2 py-1 rounded inline-block mt-2 ${selectedBooking.payment_status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {selectedBooking.payment_status}
                    </p>
                  </div>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="mt-10 p-6 bg-white/[0.03] border border-white/5 rounded italic text-sm text-white/60">
                   "{selectedBooking.notes}"
                </div>
              )}

              <div className="mt-12 flex justify-end">
                <button 
                  onClick={() => setIsDetailsOpen(false)}
                  className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                >
                  Return to Registry
                </button>
              </div>
            </div>
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
                      Past Stay Locked
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