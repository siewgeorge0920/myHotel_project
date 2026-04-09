import React, { useState, useEffect } from 'react';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';
import CustomModal from '../components/CustomModal';

const STATUS_COLORS = {
  Confirmed: 'text-green-400 border-green-500/40',
  Cancelled: 'text-red-400 border-red-500/40',
  CheckedIn: 'text-amber-400 border-amber-500/40',
  CheckedOut: 'text-blue-400 border-blue-500/40',
  Pending: 'text-white/40 border-white/20',
};

const PAYMENT_COLORS = {
  Paid: 'text-green-400',
  Pending: 'text-amber-400',
  Failed: 'text-red-400',
  Refunded: 'text-blue-400',
};

export default function BookingManagement() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isManagerMode = localStorage.getItem('managerMode') === 'true';
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  // Manual payment modal
  const [payModal, setPayModal] = useState(null); // { booking }
  const [payEmail, setPayEmail] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const [checkInModal, setCheckInModal] = useState(null);
  const [checkOutModal, setCheckOutModal] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [assignedUnit, setAssignedUnit] = useState('');
  const [walkInModal, setWalkInModal] = useState(false);
  const [walkInForm, setWalkInForm] = useState({ guestFirstName: '', guestLastName: '', guestEmail: '', roomName: '', price: 0, checkIn: '', checkOut: '', expectedCheckInTime: '14:00', expectedCheckOutTime: '12:00', assignedUnit: '' });

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(data);
    } catch { } finally { setLoading(false); }
  };

  const fetchRooms = async () => {
    try {
      const [resRooms, resUnits] = await Promise.all([
        fetch('/api/rooms'),
        fetch('/api/physical-rooms')
      ]);
      const dataRooms = await resRooms.json();
      const dataUnits = await resUnits.json();
      // Attach units to rooms to keep UI logic simple
      const combinedRooms = dataRooms.map(r => ({
        ...r,
        unitNumbers: dataUnits.filter(u => u.roomType === r.name).map(u => u.roomName)
      }));
      setRooms(combinedRooms);
    } catch { }
  };

  useEffect(() => { fetchBookings(); fetchRooms(); }, []);

  const flash = (text, isErr = false) => {
    setMsg({ text, isErr });
    setTimeout(() => setMsg(null), 4000);
  };

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, bookingId: null });

  const updateStatus = async (id, status) => {
    await fetch(`/api/bookings/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    flash(`✅ Status updated to ${status}`);
    fetchBookings();
  };
  
  const handleCheckIn = async () => {
    if(!assignedUnit) return flash('❌ Physical unit number required.', true);
    await fetch(`/api/bookings/${checkInModal._id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CheckedIn', assignedUnit })
    });
    flash(`✅ Checked In to Unit ${assignedUnit}`);
    setCheckInModal(null);
    setAssignedUnit('');
    fetchBookings();
  };

  const submitWalkIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...walkInForm, isWalkIn: true, paymentStatus: 'Paid' })
      });
      if(res.ok) {
         flash('✅ Walk-in Checked In Successfully');
         setWalkInModal(false);
         fetchBookings();
      } else {
         flash('❌ Failed to process Walk-in', true);
      }
    } catch(err) { flash('❌ Server Error', true); }
    setLoading(false);
  };
  
  const checkTimeStatus = (b) => {
    if(!b.checkInDate || !b.checkOutDate) return null;
    const now = new Date();
    if(b.bookingStatus === 'Confirmed' && b.expectedCheckInTime) {
      const expected = new Date(b.checkInDate);
      const [h,m] = b.expectedCheckInTime.split(':');
      expected.setHours(h, m, 0);
      if (now > expected) return <span className="text-amber-500 font-bold ml-3 text-[10px] uppercase animate-pulse border border-amber-500 px-1 py-0.5">⚠️ Late Arrival</span>;
    }
    if(b.bookingStatus === 'CheckedIn' && b.expectedCheckOutTime) {
      const expected = new Date(b.checkOutDate);
      const [h,m] = b.expectedCheckOutTime.split(':');
      expected.setHours(h, m, 0);
      if (now > expected) return <span className="text-red-500 font-black ml-3 text-[10px] uppercase animate-pulse border border-red-500 bg-red-500/10 px-1 py-0.5">🚨 Overstay</span>;
    }
    return null;
  }

  const requestDelete = (id, bookingId) => {
    setDeleteModal({ isOpen: true, id, bookingId });
  };

  const confirmDelete = async () => {
    const { id } = deleteModal;
    setDeleteModal({ isOpen: false, id: null, bookingId: null });
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    flash('🗑️ Booking removed');
    fetchBookings();
  };

  // Generate Stripe payment link and open it (or copy it)
  const resendPaymentLink = async (b) => {
    setPayLoading(true);
    try {
      const nights = b.checkInDate && b.checkOutDate
        ? Math.max(Math.ceil((new Date(b.checkOutDate) - new Date(b.checkInDate)) / 86400000), 1)
        : 1;
      const res = await fetch('/api/resend-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: b.bookingId,
          roomName: b.roomName,
          amount: b.price || 0,
          guestEmail: payEmail || undefined,
          nights
        })
      });
      const data = await res.json();
      if (data.url) {
        navigator.clipboard?.writeText(data.url).then(() => {
          flash('✅ Payment link copied to clipboard! Share with client.');
        }).catch(() => {
          flash(`✅ Payment link generated! Open: ${data.url.slice(0, 60)}...`);
        });
        window.open(data.url, '_blank'); // also open in new tab so staff can process
      } else {
        flash('❌ Failed to generate payment link', true);
      }
      setPayModal(null);
      setPayEmail('');
    } catch (e) {
      flash('❌ Server error — check if server is running', true);
    } finally {
      setPayLoading(false);
    }
  };

  const allStatuses = ['Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled', 'Pending'];
  
  const filtered = bookings.filter(b => {
    const matchFilter = filter === 'all' || b.bookingStatus === filter;
    const matchSearch = !search || 
      b.bookingId?.toLowerCase().includes(search.toLowerCase()) ||
      b.roomName?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManagerMode} />
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto">
        <header className="mb-10 border-b pb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4" style={{ borderColor: COLORS.border }}>
          <div>
            <p className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-black mb-2">Manager Control</p>
            <h1 className="text-4xl font-serif italic">Booking Management</h1>
            <p className="text-white/30 text-sm mt-1">{filtered.length} of {bookings.length} records</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setWalkInModal(true)} className="bg-amber-600 hover:bg-amber-500 text-[10px] uppercase tracking-widest font-black px-4 py-2 flex items-center transition-all">
              + Walk-In
            </button>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search booking / room..."
              className="bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-amber-500 w-48"
            />
          </div>
        </header>

        {msg && (
          <div className={`mb-6 px-6 py-3 text-xs font-bold uppercase tracking-widest border ${msg.isErr ? 'border-red-500/40 bg-red-500/10 text-red-400' : 'border-amber-500/40 bg-amber-500/10 text-amber-400'}`}>
            {msg.text}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', ...allStatuses].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-black border transition-all ${filter === s ? 'border-amber-600 text-amber-500 bg-amber-600/10' : 'border-white/10 text-white/30 hover:border-white/30'}`}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-white/30 text-xs uppercase tracking-widest animate-pulse">Loading bookings...</p>
        ) : filtered.length === 0 ? (
          <div className="p-12 border border-dashed text-center text-white/20 uppercase tracking-widest text-xs" style={{ borderColor: COLORS.border }}>
            No bookings found.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(b => (
              <div key={b._id} className="p-5 border hover:border-white/20 transition-all" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-amber-500 text-sm font-bold">{b.bookingId}</span>
                      <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 border ${STATUS_COLORS[b.bookingStatus] || 'text-white/40 border-white/20'}`}>
                        {b.bookingStatus}
                      </span>
                      <span className={`text-[10px] font-bold ${PAYMENT_COLORS[b.paymentStatus] || 'text-white/40'}`}>
                        💳 {b.paymentStatus}
                      </span>
                    </div>
                    <p className="text-lg font-serif mt-1">
                      {b.department && <span className="text-xs uppercase tracking-widest text-white/50 mr-2">{b.department} -</span>}
                      {b.roomName} 
                      {b.assignedUnit && <span className="text-xs bg-white/10 px-2 py-0.5 ml-3 font-mono font-bold">{b.assignedUnit}</span>}
                      {checkTimeStatus(b)}
                    </p>
                    {b.clientId && (
                      <p className="text-sm text-white/70 mt-1">
                        Guest: <span className="font-bold text-amber-500">{b.clientId.firstName} {b.clientId.lastName}</span> 
                        <span className="mx-2 opacity-50">•</span> {b.clientId.email} 
                        <span className="mx-2 opacity-50">•</span> {b.clientId.phone}
                      </p>
                    )}
                    <div className="flex gap-4 mt-2 text-xs text-white/40 flex-wrap">
                      <span>In: {b.checkInDate ? new Date(b.checkInDate).toLocaleDateString() : '—'} {b.expectedCheckInTime && `(${b.expectedCheckInTime})`}</span>
                      <span>Out: {b.checkOutDate ? new Date(b.checkOutDate).toLocaleDateString() : '—'} {b.expectedCheckOutTime && `(${b.expectedCheckOutTime})`}</span>
                      {b.price > 0 && <span className="text-amber-400 font-bold">€{b.price}</span>}
                      {b.managedBy && <span>Staff: {b.managedBy}</span>}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 flex-shrink-0">
                    {b.bookingStatus === 'Confirmed' && (
                      <button onClick={() => setCheckInModal(b)}
                        className="px-3 py-1.5 text-[9px] uppercase font-black border border-amber-500/40 text-amber-500 hover:bg-amber-500/10">
                        ✓ Assign & Check In
                      </button>
                    )}
                    {b.bookingStatus === 'CheckedIn' && (
                      <button onClick={() => setCheckOutModal(b)}
                        className="px-3 py-1.5 text-[9px] uppercase font-black border border-blue-500/40 text-blue-400 hover:bg-blue-500/10">
                        ⤴ Check Out
                      </button>
                    )}

                    {/* Payment: Resend link OR Process here */}
                    {b.paymentStatus === 'Pending' && (
                      <button onClick={() => { setPayModal(b); setPayEmail(''); }}
                        className="px-3 py-1.5 text-[9px] uppercase font-black border border-green-500/40 text-green-400 hover:bg-green-500/10">
                        💳 Payment
                      </button>
                    )}

                    {b.bookingStatus !== 'Cancelled' && (
                      <button onClick={() => updateStatus(b._id, 'Cancelled')}
                        className="px-3 py-1.5 text-[9px] uppercase font-black border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40">
                        ✕ Cancel
                      </button>
                    )}
                    <button onClick={() => deleteBooking(b._id, b.bookingId)}
                      className="px-3 py-1.5 text-[9px] uppercase font-black border border-white/10 text-white/30 hover:text-red-400 hover:border-red-500/30">
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Check Out Modal */}
      {checkOutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm p-8 border" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.amber }}>
            <h3 className="font-serif text-xl italic mb-4">Confirm Check-Out</h3>
            <p className="text-white/60 text-sm mb-6">Are you sure you want to Check-Out '{checkOutModal.clientId?.firstName}'? This will automatically lock the booking and notify Housekeeping to clean Unit <strong className="text-amber-500">{checkOutModal.assignedUnit || 'Unknown'}</strong>.</p>
            <div className="flex gap-2">
              <button onClick={() => { updateStatus(checkOutModal._id, 'CheckedOut'); setCheckOutModal(null); }} className="flex-1 bg-amber-600 font-black text-[10px] uppercase py-3 hover:bg-amber-500">Confirm Check-Out</button>
              <button onClick={() => setCheckOutModal(null)} className="flex-1 border border-white/20 font-black text-[10px] uppercase py-3 hover:bg-white/5">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Check In Modal */}
      {checkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm p-8 border" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.amber }}>
            <h3 className="font-serif text-xl italic mb-4">Assign Unit & Check In</h3>
            <p className="text-white/60 text-xs tracking-widest uppercase mb-4 border border-white/10 p-2 text-center bg-white/5">
              <span className="text-[9px] block text-amber-500 mb-1">Department & Room Type</span>
              {checkInModal.department || 'Unknown'} <br/> {checkInModal.roomName}
            </p>
            <div className="mb-4">
              <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-1">Select Room Name (Unit No.)</label>
              <select value={assignedUnit} onChange={e => setAssignedUnit(e.target.value)}
                className="w-full bg-white/5 border px-3 py-2 text-sm outline-none focus:border-amber-500 uppercase"
                style={{ borderColor: COLORS.border }}>
                <option value="">-- Select specific unit --</option>
                {(() => {
                  const matchedRoom = rooms.find(r => r.name === checkInModal.roomName);
                  if (matchedRoom && matchedRoom.unitNumbers && matchedRoom.unitNumbers.length > 0) {
                    return matchedRoom.unitNumbers.map(u => <option key={u} value={u}>{u}</option>);
                  }
                  return <option disabled>No physical units provisioned.</option>;
                })()}
              </select>
              <input type="text" value={assignedUnit} onChange={e => setAssignedUnit(e.target.value)}
                placeholder="e.g. ULTIMATE-10A"
                className="w-full bg-white/5 border px-3 py-2 text-sm outline-none focus:border-amber-500 uppercase"
                style={{ borderColor: COLORS.border }} />
            </div>
            <div className="flex gap-2">
              <button onClick={handleCheckIn} className="flex-1 bg-amber-600 font-black text-[10px] uppercase py-3 hover:bg-amber-500">Confirm</button>
              <button onClick={() => setCheckInModal(null)} className="flex-1 border border-white/20 font-black text-[10px] uppercase py-3 hover:bg-white/5">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Walk In Modal */}
      {walkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <form onSubmit={submitWalkIn} className="w-full max-w-2xl p-8 border my-auto shadow-2xl" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.amber }}>
            <h3 className="font-serif text-2xl italic mb-6 text-amber-500">Walk-In Registration</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className="block text-xs text-white/50 mb-1">First Name</label><input required className="w-full bg-white/5 border border-white/10 p-2 text-sm" value={walkInForm.guestFirstName} onChange={e => setWalkInForm({...walkInForm, guestFirstName: e.target.value})} /></div>
              <div><label className="block text-xs text-white/50 mb-1">Last Name</label><input required className="w-full bg-white/5 border border-white/10 p-2 text-sm" value={walkInForm.guestLastName} onChange={e => setWalkInForm({...walkInForm, guestLastName: e.target.value})} /></div>
              <div><label className="block text-xs text-white/50 mb-1">Email</label><input type="email" required className="w-full bg-white/5 border border-white/10 p-2 text-sm" value={walkInForm.guestEmail} onChange={e => setWalkInForm({...walkInForm, guestEmail: e.target.value})} /></div>
              <div><label className="block text-xs text-white/50 mb-1">Total Price (€)</label><input type="number" required className="w-full bg-white/5 border border-white/10 p-2 text-sm" value={walkInForm.price} onChange={e => setWalkInForm({...walkInForm, price: e.target.value})} /></div>
              <div>
                <label className="block text-xs text-white/50 mb-1">Department & Room Type</label>
                <select required className="w-full bg-white/5 border border-white/10 p-2 text-sm" value={walkInForm.roomName} onChange={e => {
                  const r = rooms.find(room => room.name === e.target.value);
                  setWalkInForm({...walkInForm, roomName: e.target.value, department: r?.department || ''});
                }}>
                  <option value="">-- Select Category --</option>
                  {rooms.map(r => <option key={r._id} value={r.name}>[{r.department}] {r.name} (€{r.pricePerNight})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">Assigned Unit</label>
                <select required className="w-full bg-white/5 border border-white/10 p-2 text-sm uppercase" value={walkInForm.assignedUnit} onChange={e => setWalkInForm({...walkInForm, assignedUnit: e.target.value})}>
                  <option value="">-- Select Unit --</option>
                  {(() => {
                    const matchedRoom = rooms.find(r => r.name === walkInForm.roomName);
                    if (matchedRoom && matchedRoom.unitNumbers) {
                      return matchedRoom.unitNumbers.map(u => <option key={u} value={u}>{u}</option>);
                    }
                    return null;
                  })()}
                </select>
                <input placeholder="Or type manually (E.g. UE-01)" className="w-full mt-2 bg-white/5 border border-white/10 p-2 text-sm uppercase" value={walkInForm.assignedUnit} onChange={e => setWalkInForm({...walkInForm, assignedUnit: e.target.value})} />
              </div>
              <div><label className="block text-xs text-white/50 mb-1">Custom ETA (Time)</label><input type="time" className="w-full bg-white/5 border border-white/10 p-2 text-sm" value={walkInForm.expectedCheckInTime} onChange={e => setWalkInForm({...walkInForm, expectedCheckInTime: e.target.value})} /></div>
              <div><label className="block text-xs text-white/50 mb-1">Custom Checkout (Time)</label><input type="time" className="w-full bg-white/5 border border-white/10 p-2 text-sm" value={walkInForm.expectedCheckOutTime} onChange={e => setWalkInForm({...walkInForm, expectedCheckOutTime: e.target.value})} /></div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div><label className="block text-xs text-white/50 mb-1">Check-in Date</label><input type="date" required className="w-full bg-white/5 border border-white/10 p-2 text-sm" value={walkInForm.checkIn} onChange={e => setWalkInForm({...walkInForm, checkIn: e.target.value})} /></div>
              <div><label className="block text-xs text-white/50 mb-1">Check-out Date</label><input type="date" required className="w-full bg-white/5 border border-white/10 p-2 text-sm" value={walkInForm.checkOut} onChange={e => setWalkInForm({...walkInForm, checkOut: e.target.value})} /></div>
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="px-6 py-3 bg-amber-600 font-bold text-[10px] uppercase tracking-widest">{loading ? 'Processing...' : 'Register & Check In'}</button>
              <button type="button" onClick={() => setWalkInModal(false)} className="px-6 py-3 border border-white/20 font-bold text-[10px] uppercase tracking-widest">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Payment Modal */}
      {payModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-8 border" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.amber }}>
            <h3 className="font-serif text-xl italic mb-1">Process Payment</h3>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-6">{payModal.bookingId} — {payModal.roomName}</p>
            <p className="text-3xl font-serif text-amber-400 mb-6">€{payModal.price || 0}</p>

            <div className="mb-4">
              <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-1">Client Email (optional — for Stripe receipt)</label>
              <input type="email" value={payEmail} onChange={e => setPayEmail(e.target.value)}
                placeholder="guest@email.com"
                className="w-full bg-white/5 border px-3 py-2 text-sm outline-none focus:border-amber-500"
                style={{ borderColor: COLORS.border }} />
            </div>

            <div className="space-y-3">
              <button onClick={() => resendPaymentLink(payModal)} disabled={payLoading} style={{ backgroundColor: COLORS.amber }}
                className="w-full py-3 text-[11px] uppercase font-black tracking-widest hover:brightness-110 disabled:opacity-50">
                {payLoading ? 'Generating...' : '🔗 Generate & Open Payment Link'}
              </button>
              <p className="text-[10px] text-white/30 text-center">Link opens in new tab for staff to process, and gets copied to clipboard to share with client.</p>
              <button onClick={() => setPayModal(null)} className="w-full py-2 border border-white/10 text-[10px] uppercase font-black text-white/30 hover:bg-white/5">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <CustomModal 
        isOpen={deleteModal.isOpen}
        title="Delete Booking"
        message={`Are you absolutely sure you want to permanently remove booking ${deleteModal.bookingId}? This action cannot be undone.`}
        isAlert={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, bookingId: null })}
        confirmText="Yes, Remove Booking"
        cancelText="Cancel"
      />
    </div>
  );
}
