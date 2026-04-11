import React, { useState, useEffect } from 'react';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';
import CustomModal from '../components/CustomModal';

// Department tabs shown at the top of the dashboard.
const DEPARTMENTS = ['Private Lodge', 'Private Residences & Villas', 'Ultimate Exclusivity'];

// Booking status badge styles.
const STATUS_COLORS = {
  Confirmed: 'text-green-400 border-green-500/40',
  Cancelled: 'text-red-400 border-red-500/40',
  CheckedIn: 'text-amber-400 border-amber-500/40',
  CheckedOut: 'text-blue-400 border-blue-500/40',
  Pending: 'text-white/40 border-white/20',
};

export default function RoomManagement() {
  // Session context for sidebar role rendering.
  const user = JSON.parse(localStorage.getItem('user'));
  const isManagerMode = localStorage.getItem('managerMode') === 'true';

  // Active department and fetched data state.
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [bookings, setBookings] = useState([]);
  const [physicalRooms, setPhysicalRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Check-in modal context and selected physical unit.
  const [checkInModal, setCheckInModal] = useState(null);
  const [assignedUnit, setAssignedUnit] = useState('');

  // Fetch bookings and physical units in parallel.
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resB, resP] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/physical-rooms')
      ]);
      setBookings(await resB.json());
      setPhysicalRooms(await resP.json());
    } catch { } finally { setLoading(false); }
  };

  // Initial data load on first render.
  useEffect(() => { fetchData(); }, []);

  // Generic status update helper for bookings.
  const updateStatus = async (id, status) => {
    await fetch(`/api/bookings/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };
  
  // Confirm check-in with required physical unit assignment.
  const handleCheckIn = async () => {
    if(!assignedUnit) return alert('Physical unit number required.');
    await fetch(`/api/bookings/${checkInModal._id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CheckedIn', assignedUnit })
    });
    setCheckInModal(null);
    setAssignedUnit('');
    fetchData();
  };

  // Active bookings for current department (excluding completed/cancelled).
  const deptBookings = bookings.filter(b => b.department === department && b.bookingStatus !== 'Cancelled' && b.bookingStatus !== 'CheckedOut');
  // Physical units for current department.
  const deptRooms = physicalRooms.filter(r => r.department === department);

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManagerMode} />
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto">
        <header className="mb-10 border-b pb-8" style={{ borderColor: COLORS.border }}>
          <p className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-black mb-2">Staff Operation</p>
          <h1 className="text-4xl font-serif italic">Front Desk Ops Dashboard</h1>
          <p className="text-white/40 text-xs mt-2 uppercase tracking-widest">Unified booking and physical room command center.</p>
        </header>

        {/* Department switcher tabs */}
        <div className="mb-8 flex gap-4 overflow-x-auto pb-2">
          {DEPARTMENTS.map(dep => (
             <button key={dep} onClick={() => setDepartment(dep)}
               className={`whitespace-nowrap py-3 px-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${department === dep ? 'bg-amber-600 border-amber-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20'}`}>
               {dep}
             </button>
          ))}
        </div>

        {/* Render state: loading text or two operational grids. */}
        {loading ? <p className="animate-pulse text-white/30 text-xs tracking-widest uppercase">Syncing operations...</p> : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            
            {/* Grid 1: Bookings */}
            <div>
              <h2 className="text-2xl font-serif text-amber-500 mb-6 border-b pb-2 inline-block" style={{ borderColor: COLORS.border }}>Upcoming & Active Guests</h2>
              <div className="space-y-4">
                {deptBookings.length === 0 && <p className="text-xs text-white/40 italic p-6 border border-dashed text-center" style={{ borderColor: COLORS.border }}>No active guests for this department.</p>}
                {deptBookings.map(b => (
                  <div key={b._id} className="p-5 border flex flex-col justify-between" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-serif">
                           {b.clientId ? `${b.clientId.firstName} ${b.clientId.lastName}` : b.guestFirstName ? `${b.guestFirstName} ${b.guestLastName}` : 'Unknown Guest'}
                        </h4>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-amber-500 mt-1">{b.roomName}</p>
                        <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">In: {new Date(b.checkInDate).toLocaleDateString()} | Out: {new Date(b.checkOutDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9px] uppercase font-black px-2 py-1 tracking-widest border ${STATUS_COLORS[b.bookingStatus]}`}>{b.bookingStatus}</span>
                        {b.assignedUnit && <p className="text-[10px] mt-2 font-mono bg-white/10 px-2 py-1 border border-white/20 text-center">{b.assignedUnit}</p>}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto border-t pt-4" style={{ borderColor: COLORS.border }}>
                      {b.bookingStatus === 'Confirmed' && (
                        <button onClick={() => setCheckInModal(b)} className="px-3 py-1.5 text-[9px] uppercase font-black bg-amber-600 hover:bg-amber-500 transition-colors">Check-In</button>
                      )}
                      {b.bookingStatus === 'CheckedIn' && (
                        <button onClick={() => updateStatus(b._id, 'CheckedOut')} className="px-3 py-1.5 text-[9px] uppercase font-black border border-white/20 hover:bg-white/10 transition-colors">Check-Out</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid 2: Physical Rooms */}
            <div>
              <h2 className="text-2xl font-serif text-amber-500 mb-6 border-b pb-2 inline-block" style={{ borderColor: COLORS.border }}>Physical Unit Radar</h2>
              <div className="grid grid-cols-2 gap-4">
                {deptRooms.length === 0 && <p className="text-xs text-white/40 italic p-6 border border-dashed text-center col-span-2" style={{ borderColor: COLORS.border }}>No physical units registered.</p>}
                {deptRooms.map(r => {
                  // Map cleaning status to a color badge.
                  let statusColor = 'text-white/40';
                  if(r.cleaningStatus === 'Clean') statusColor = 'text-green-400 border-green-500/30';
                  if(r.cleaningStatus === 'Dirty') statusColor = 'text-red-400 border-red-500/30';
                  if(r.cleaningStatus === 'In Service') statusColor = 'text-blue-400 border-blue-500/30';
                  if(r.cleaningStatus === 'Maintenance') statusColor = 'text-amber-400 border-amber-500/30';
                  
                  // Current checked-in guest occupying this unit, if any.
                  const occupier = bookings.find(b => b.assignedUnit === r.roomName && b.bookingStatus === 'CheckedIn');

                  return (
                    <div key={r._id} className="p-4 border" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-serif font-bold text-white">{r.roomName}</h4>
                        {occupier && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Occupied"></span>}
                      </div>
                      <p className="text-[9px] text-white/40 uppercase tracking-widest truncate">{r.roomType}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className={`text-[8px] uppercase font-black px-1.5 py-0.5 tracking-widest border ${statusColor}`}>{r.cleaningStatus}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
          </div>
        )}
      </main>

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
                {deptRooms.filter(r => r.roomType === checkInModal.roomName).map(u => (
                  <option key={u.roomName} value={u.roomName}>{u.roomName} ({u.cleaningStatus})</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={handleCheckIn} className="flex-1 bg-amber-600 font-black text-[10px] uppercase py-3 hover:bg-amber-500">Confirm</button>
              <button onClick={() => setCheckInModal(null)} className="flex-1 border border-white/20 font-black text-[10px] uppercase py-3 hover:bg-white/5">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}