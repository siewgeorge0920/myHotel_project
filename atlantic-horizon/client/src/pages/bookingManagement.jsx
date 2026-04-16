import React, { useState, useEffect } from 'react';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';
import axios from 'axios';
import { 
  CheckCircle, 
  UserCheck, 
  LogOut, 
  Edit, 
  RotateCcw, 
  X, 
  ShieldAlert, 
  Clock, 
  Euro, 
  Server,
  HelpCircle
} from 'lucide-react';

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('today');
  const [availableRooms, setAvailableRooms] = useState([]);

  const user = JSON.parse(localStorage.getItem('user')) || { role: 'staff' };
  const isAdmin = user.role === 'admin';
  const isManager = user.role === 'manager';
  const canEdit = isAdmin || isManager;
  const canDelete = isAdmin;

  // Modals Controller
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  // Extension State
  const [extensionHours, setExtensionHours] = useState(1);

  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    room_type: 'Private Lodge',
    check_in: '',
    check_out: '',
    total_amount: 0,
    status: 'Pending'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v3/bookings');
      setBookings(res.data.data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const res = await axios.get('/api/v3/physical-rooms');
      setAvailableRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  useEffect(() => { 
    fetchData(); 
    fetchAvailableRooms();
  }, []);

  /**
   * 🏗️ State Handlers
   */
  const handleConfirm = async (id, roomName = 'auto') => {
    try {
      await axios.put(`/api/v3/bookings/${id}/confirm`, { assigned_room: roomName });
      setIsConfirmModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Confirmation failed");
    }
  };

  const handleCheckIn = async (id, swapedRoom = null) => {
    try {
      await axios.put(`/api/v3/bookings/${id}/checkin`, { swaped_room: swapedRoom });
      setIsCheckInModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Check-in failed");
    }
  };

  const handleExtend = async (id) => {
    try {
      await axios.put(`/api/v3/bookings/${id}/extend`, { hours: extensionHours });
      setIsCheckoutModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Extension failed");
    }
  };

  const handleCheckoutNow = async (id) => {
    try {
      await axios.put(`/api/v3/bookings/${id}/complete-checkout`);
      setIsCheckoutModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Checkout failed");
    }
  };

  const handleRefund = async (id) => {
    if (window.confirm("CRITICAL: This will trigger a REAL financial refund via Stripe. Proceed?")) {
      try {
        await axios.post(`/api/v3/bookings/${id}/refund`);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.error || "Refund failed");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("CRITICAL: Delete this record?")) {
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
        status: 'Pending'
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
          booking_id: `ATL-${Math.floor(Math.random() * 900000 + 100000)}` 
        });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Operation failed.");
    }
  };

  const getFilteredBookings = () => {
    const today = new Date().toISOString().split('T')[0];
    
    return bookings.filter(b => {
      // Safely ensure date strings for comparison
      const bIn = b.check_in ? new Date(b.check_in).toISOString().split('T')[0] : '';
      const bOut = b.check_out ? new Date(b.check_out).toISOString().split('T')[0] : '';

      if (activeFilter === 'today') return (bIn === today && b.status !== 'CheckedOut') || b.status === 'CheckedIn' || b.status === 'Confirmed';
      if (activeFilter === 'upcoming') return bIn > today && b.status === 'Pending';
      if (activeFilter === 'history') return b.status === 'CheckedOut' || b.status === 'Cancelled';
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
              + Create Booking
            </button>
          )}
        </header>

        <div className="flex gap-4 mb-8">
          {[
            { id: 'upcoming', label: 'Queued Arrivals' },
            { id: 'today', label: 'Sanctuary Roster' },
            { id: 'history', label: 'Archived Stays' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border ${
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
                const s = b.status;

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
                      {b.status === 'CheckedIn' && b.assigned_room && (
                          <div className="mt-2 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                             <span className="text-[10px] font-black text-emerald-500 uppercase">Room {b.assigned_room}</span>
                          </div>
                        )}
                    </td>
                    <td className="p-6 text-white/60 font-light">{b.room_type}</td>
                    <td className="p-6">
                      <p className="text-amber-500 font-mono font-bold">€{b.total_amount + (b.additional_charges || 0)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] px-2 py-0.5 rounded bg-white/5 text-white/40 border border-white/5 uppercase font-black">
                          {nights} {nights === 1 ? 'Night' : 'Nights'}
                        </span>
                        <span className="text-[9px] uppercase text-white/20 tracking-widest font-bold">{b.payment_status}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        s === 'CheckedIn' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                        s === 'Confirmed' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                        s === 'Pending' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                        'bg-white/5 border-white/10 text-white/30'
                      }`}>
                        {s}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                          <button 
                            disabled={s !== 'Pending'}
                            onClick={() => { setSelectedBooking(b); setIsConfirmModalOpen(true); }}
                            className={`p-2.5 rounded-full transition-all ${s === 'Pending' ? 'bg-amber-600 text-white hover:scale-110' : 'bg-white/5 text-white/10'}`}
                            title="Confirm & Assign Room"
                          >
                            <CheckCircle size={16} />
                          </button>

                          <button 
                            disabled={s !== 'Confirmed'}
                            onClick={() => { setSelectedBooking(b); setIsCheckInModalOpen(true); }}
                            className={`p-2.5 rounded-full transition-all ${s === 'Confirmed' ? 'bg-emerald-600 text-white hover:scale-110' : 'bg-white/5 text-white/10'}`}
                            title="Initiate Check-in"
                          >
                            <UserCheck size={16} />
                          </button>

                          <button 
                            disabled={s !== 'CheckedIn'}
                            onClick={() => { setSelectedBooking(b); setIsCheckoutModalOpen(true); }}
                            className={`p-2.5 rounded-full transition-all ${s === 'CheckedIn' ? 'bg-white text-black hover:scale-110' : 'bg-white/5 text-white/10'}`}
                            title="Finalize Checkout"
                          >
                            <LogOut size={16} />
                          </button>

                          <button 
                            disabled={s === 'CheckedOut' || s === 'Cancelled'}
                            onClick={() => openForm(b)}
                            className={`p-2.5 rounded-full transition-all ${(s !== 'CheckedOut' && s !== 'Cancelled') ? 'bg-white/10 text-white/40 hover:text-white border border-white/5' : 'bg-white/5 text-white/5'}`}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>

                          <button 
                            disabled={s !== 'Pending' && s !== 'Confirmed'}
                            onClick={() => handleRefund(b._id)}
                            className={`p-2.5 rounded-full transition-all ${(s === 'Pending' || s === 'Confirmed') ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20' : 'bg-white/5 text-white/5'}`}
                            title="Refund & Cancel"
                          >
                            <RotateCcw size={16} />
                          </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            </table>
          </div>
        )}

        {/* 🟡 CONFIRM MODAL (Room Assignment) */}
        {isConfirmModalOpen && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-6">
            <div className="bg-[#1a1d17] border border-white/10 p-12 rounded-[40px] w-full max-w-2xl shadow-2xl relative">
               <button onClick={() => setIsConfirmModalOpen(false)} className="absolute top-8 right-8 text-white/20 hover:text-white"><X size={24} /></button>
               <h2 className="text-4xl font-serif italic mb-2">Sanctuary Assignment</h2>
               <p className="text-[10px] uppercase tracking-widest text-white/40 mb-10">Select a physical unit for {selectedBooking.guest_name}</p>

               <div className="grid grid-cols-3 gap-4 mb-10 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                  <button 
                    onClick={() => handleConfirm(selectedBooking._id, 'auto')}
                    className="col-span-3 bg-amber-600/20 border border-amber-600/30 p-6 rounded-2xl flex items-center justify-center gap-4 hover:bg-amber-600 hover:text-white transition-all group"
                  >
                    <Server className="group-hover:animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest">Automatic Selection</span>
                  </button>

                  {availableRooms
                    .filter(r => r.room_type_category === selectedBooking.room_type && r.current_status === 'Ready')
                    .map(room => (
                      <button 
                        key={room._id}
                        onClick={() => handleConfirm(selectedBooking._id, room.room_name)}
                        className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-amber-500 hover:bg-amber-500/10 transition-all text-center"
                      >
                        <p className="text-[10px] uppercase text-white/40 font-bold mb-1">Unit</p>
                        <p className="text-xl font-mono text-white">{room.room_name}</p>
                      </button>
                    ))
                  }
               </div>

               <div className="flex justify-center italic text-xs text-white/20">
                  ⚠️ Note: Assigning a room locks the inventory but the guest won't be notified until check-in.
               </div>
            </div>
          </div>
        )}

        {/* 🟢 CHECK-IN MODAL (Swap/Confirm) */}
        {isCheckInModalOpen && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-6">
            <div className="bg-[#1a1d17] border border-white/10 p-12 rounded-[40px] w-full max-w-xl shadow-2xl relative text-center">
               <button onClick={() => setIsCheckInModalOpen(false)} className="absolute top-8 right-8 text-white/20 hover:text-white"><X size={24} /></button>
               
               <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <UserCheck size={48} className="text-emerald-500" />
               </div>

               <h2 className="text-4xl font-serif italic mb-2">Initialize Arrival</h2>
               <p className="text-xs text-white/50 mb-10">Verify assignment for {selectedBooking.guest_name}</p>

               <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-10">
                  <p className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-1">Active Assignment</p>
                  <p className="text-4xl font-mono text-amber-500">Room {selectedBooking.assigned_room}</p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleCheckIn(selectedBooking._id)}
                    className="bg-emerald-600 hover:bg-emerald-500 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-xl"
                  >
                    Confirm Check-in
                  </button>
                  <button 
                    onClick={() => { setIsCheckInModalOpen(false); setIsConfirmModalOpen(true); }}
                    className="bg-white/5 border border-white/10 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:border-white/30"
                  >
                    Switch Room
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* 🔴 CHECKOUT MODAL (Now/Extend) */}
        {isCheckoutModalOpen && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-6">
             <div className="bg-[#1a1d17] border border-white/10 p-12 rounded-[40px] w-full max-w-2xl shadow-2xl relative">
                <button onClick={() => setIsCheckoutModalOpen(false)} className="absolute top-8 right-8 text-white/20 hover:text-white"><X size={24} /></button>
                
                <h2 className="text-4xl font-serif italic mb-2">Finalize Stay</h2>
                <p className="text-xs text-white/40 mb-12">Processing manifest exit for {selectedBooking.guest_name}</p>

                <div className="grid md:grid-cols-2 gap-10 border-t border-white/5 pt-10">
                   <div>
                      <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-white/30 mb-6 flex items-center gap-2">
                        <CheckCircle size={14} /> Immediate Exit
                      </h3>
                      <p className="text-sm text-white/50 mb-8 leading-relaxed">Guest is vacating the sanctuary now. Finalize all records and clear room status.</p>
                      <button 
                        onClick={() => handleCheckoutNow(selectedBooking._id)}
                        className="w-full bg-white text-black py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all"
                      >
                        Checkout Now
                      </button>
                   </div>

                   <div className="border-l border-white/5 pl-10">
                      <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-amber-500 mb-6 flex items-center gap-2">
                        <Clock size={14} /> Sanctuary Extension
                      </h3>
                      <div className="space-y-4 mb-8">
                         <label className="block text-[9px] uppercase tracking-widest text-white/50">Extra Duration (Hours)</label>
                         <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-xl">
                            <button onClick={() => setExtensionHours(Math.max(1, extensionHours-1))} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-xl font-bold">—</button>
                            <span className="flex-1 text-center font-mono text-xl">{extensionHours}h</span>
                            <button onClick={() => setExtensionHours(extensionHours+1)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-xl font-bold">+</button>
                         </div>
                         <div className="flex justify-between items-center bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
                            <p className="text-[9px] uppercase tracking-widest text-amber-500 font-bold">Additional Charge</p>
                            <p className="text-xl font-mono text-amber-500">€{extensionHours * 50}</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => handleExtend(selectedBooking._id)}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-amber-600/20"
                      >
                         <Euro size={16} /> Pay at Lobby & Extend
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* DETAILS MODAL */}
        {isDetailsOpen && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-[#1a1d17] border border-amber-600/30 p-10 rounded-3xl w-full max-w-2xl relative shadow-2xl">
              <button 
                onClick={() => setIsDetailsOpen(false)}
                className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
                title="Return to Registry"
              >
                <X size={24} />
              </button>
              
              <div className="mb-10 border-b border-white/5 pb-6">
                <p className="text-amber-500 uppercase tracking-widest text-[9px] font-black mb-2 flex items-center gap-2">
                   Guest Manifest Details
                </p>
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
                    {selectedBooking.assigned_room && (
                      <p className="text-[11px] font-black text-amber-500 uppercase mt-2">Unit: {selectedBooking.assigned_room}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-2">Itinerary</p>
                    <div className="bg-white/5 p-4 rounded border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[9px] uppercase text-white/30">From</p>
                            <p className="text-xs font-mono">{new Date(selectedBooking.check_in).toLocaleDateString()}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-[9px] uppercase text-white/30">Until</p>
                            <p className="text-xs font-mono">{new Date(selectedBooking.check_out).toLocaleDateString()}</p>
                        </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-2">Financials</p>
                    <div className="flex items-end gap-2">
                      <p className="text-2xl font-mono text-white">€{selectedBooking.total_amount + (selectedBooking.additional_charges || 0)}</p>
                      {selectedBooking.additional_charges > 0 && (
                        <p className="text-xs text-amber-500 font-mono mb-1">+(€{selectedBooking.additional_charges})</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

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
            <div className="bg-[#1a1d17] border border-white/10 p-10 rounded-[30px] w-full max-w-xl shadow-2xl relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-white/20 hover:text-white"
              >
                <X size={20} />
              </button>

              <h2 className="text-3xl font-serif italic text-amber-500 mb-8 border-b border-white/5 pb-4">
                {editingId ? "Modify Manifest" : "New Manifest Entry"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[9px] uppercase font-black tracking-widest text-white/40">Guest Full Name</label>
                    <input type="text" required value={formData.guest_name} onChange={e => setFormData({...formData, guest_name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:border-amber-500 outline-none rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[9px] uppercase font-black tracking-widest text-white/40">Email Protocol</label>
                    <input type="email" required value={formData.guest_email} onChange={e => setFormData({...formData, guest_email: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:border-amber-500 outline-none rounded-xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[9px] uppercase font-black tracking-widest text-white/40">Sanctuary Tier</label>
                  <select value={formData.room_type} onChange={e => setFormData({...formData, room_type: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:border-amber-500 outline-none rounded-xl text-white appearance-none">
                    <option value="Private Lodge">Private Lodge</option>
                    <option value="Private Residences & Villas">Private Residences & Villas</option>
                    <option value="Ultimate Exclusivity">Ultimate Exclusivity</option>
                  </select>
                </div>

                {!editingId && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[9px] uppercase font-black tracking-widest text-white/40">Arrival</label>
                      <input type="date" required value={formData.check_in} onChange={e => setFormData({...formData, check_in: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:border-amber-500 outline-none rounded-xl" style={{ colorScheme: 'dark' }} />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[9px] uppercase font-black tracking-widest text-white/40">Departure</label>
                      <input type="date" required value={formData.check_out} onChange={e => setFormData({...formData, check_out: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:border-amber-500 outline-none rounded-xl" style={{ colorScheme: 'dark' }} />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[9px] uppercase font-black tracking-widest text-white/40">Manifest Total (€)</label>
                    <input type="number" required value={formData.total_amount} onChange={e => setFormData({...formData, total_amount: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:border-amber-500 outline-none rounded-xl font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[9px] uppercase font-black tracking-widest text-white/40">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:border-amber-500 outline-none rounded-xl text-white appearance-none">
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="CheckedIn">Checked In</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-5 pt-8 border-t border-white/5 mt-8">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-[10px] uppercase font-black tracking-widest text-white/20 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-amber-600/20">Commit Records</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}