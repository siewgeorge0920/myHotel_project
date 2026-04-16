import React, { useState } from 'react';
import axios from 'axios';
import { COLORS } from '../colors';

export default function SelfCheckIn() {
  // Stages: 'search', 'view', 'success'
  const [stage, setStage] = useState('search');
  const [formData, setFormData] = useState({ bookingId: '', email: '' });
  const [booking, setBooking] = useState(null);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isLoading, setIsLoading] = useState(false);

  const flash = (msg, type = 'error') => {
    setStatus({ type, msg });
    if (type === 'error') setTimeout(() => setStatus({ type: '', msg: '' }), 5000);
  };

  // Stage 1: Lookup Booking
  const handleLookup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      const res = await axios.post('/api/v3/bookings/manage-lookup', formData);
      setBooking(res.data.data.booking);
      setStage('view');
    } catch (err) {
      flash(err.response?.data?.message || 'We couldn\'t find your reservation. Please check your details.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Stage 2: Perform Check-In
  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post('/api/v3/bookings/self-check-in', formData);
      setBooking(res.data.data.booking);
      setStage('success');
      flash('Check-in successful! Welcome to the Manor.', 'success');
    } catch (err) {
      flash(err.response?.data?.message || 'Check-in failed. Please see reception.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#1a1d17]">
      <div className="max-w-xl w-full p-8 md:p-12 border shadow-2xl relative overflow-hidden animate-fadeIn" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-600/5 blur-3xl" />

        <div className="text-center mb-10 relative z-10">
          <p className="text-amber-500 text-[9px] uppercase tracking-[0.4em] font-black mb-2">Guest Portal</p>
          <h2 className="font-CINZEL text-3xl tracking-wide mb-2 text-white uppercase">
            {stage === 'search' ? 'Manage Booking' : (stage === 'view' ? 'Reservation Details' : 'Welcome Home')}
          </h2>
          <div className="w-12 h-[1px] bg-amber-600/30 mx-auto mt-4" />
        </div>

        {status.msg && (
          <div className={`mb-8 p-4 text-center border text-[10px] leading-relaxed uppercase tracking-widest font-black animate-slideUp z-10 relative ${
            status.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {status.msg}
          </div>
        )}

        {/* --- STAGE 1: SEARCH --- */}
        {stage === 'search' && (
          <form onSubmit={handleLookup} className="space-y-6 relative z-10">
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-amber-500 font-bold mb-2">Booking ID / Reference</label>
              <input 
                type="text" 
                value={formData.bookingId}
                className="w-full bg-white/5 border border-white/10 px-4 py-4 text-white focus:border-amber-500 outline-none transition-all placeholder:text-white/20 uppercase font-mono tracking-widest"
                onChange={(e) => setFormData({ ...formData, bookingId: e.target.value.toUpperCase() })}
                placeholder="ATL-XXXXXX"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase tracking-widest text-amber-500 font-bold mb-2">Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                className="w-full bg-white/5 border border-white/10 px-4 py-4 text-white focus:border-amber-500 outline-none transition-all placeholder:text-white/20"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="guest@example.com"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-4 bg-amber-600 hover:bg-amber-500 text-white py-4 text-[11px] uppercase font-black tracking-[0.3em] transition-all hover:shadow-[0_0_20px_rgba(217,119,6,0.2)]"
            >
              {isLoading ? 'Searching Records...' : 'Find Reservation'}
            </button>
          </form>
        )}

        {/* --- STAGE 2: VIEW DETAILS --- */}
        {stage === 'view' && booking && (
          <div className="space-y-8 relative z-10 animate-fadeIn">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 border-b border-white/10 pb-8">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Guest Name</p>
                <p className="text-xl font-serif italic text-white uppercase tracking-wide">{booking.guest_name}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Booking ID</p>
                <p className="text-xl font-mono text-amber-500 font-bold">{booking.booking_id.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Contact Phone</p>
                <p className="text-xl font-sans text-white uppercase tracking-wider">{booking.guest_phone || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-white/5 p-8 border border-white/5">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-amber-500 font-bold mb-2">Accommodation</p>
                  <p className="text-2xl text-white font-CINZEL uppercase tracking-widest leading-snug">{booking.room_type}</p>
                  <p className="text-[10px] text-white/30 uppercase mt-2 tracking-[0.3em] font-bold">{booking.nights || 1} Nights Stay</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Total Bill</p>
                  <p className="text-4xl font-serif text-white mb-2">€{booking.total_amount}</p>
                  <span className={`text-[10px] uppercase font-black px-4 py-1.5 rounded-full border ${booking.payment_status === 'Paid' ? 'border-green-500/40 text-green-400 bg-green-500/10' : 'border-amber-500/40 text-amber-400 bg-amber-500/10'}`}>
                    {booking.payment_status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#1a1d17] p-5 border border-white/5">
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Check-In</p>
                  <p className="text-lg text-white font-bold tracking-wider">{new Date(booking.check_in).toLocaleDateString()}</p>
                  <p className="text-[10px] text-amber-500 uppercase mt-2 font-black tracking-widest">From 15:00</p>
                </div>
                <div className="bg-[#1a1d17] p-5 border border-white/5">
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Check-Out</p>
                  <p className="text-lg text-white font-bold tracking-wider">{new Date(booking.check_out).toLocaleDateString()}</p>
                  <p className="text-[10px] text-amber-500 uppercase mt-2 font-black tracking-widest">Until 11:00</p>
                </div>
              </div>

              {booking.notes && (
                <div className="mt-8 pt-6 border-t border-white/5">
                  <p className="text-[10px] uppercase tracking-widest text-amber-500 font-black mb-2">Special Notes</p>
                  <p className="text-sm italic text-white/50 leading-relaxed font-serif uppercase tracking-wide">{booking.notes}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {booking.status === 'CheckedIn' ? (
                <div className="text-center p-6 border border-amber-600/30 bg-amber-600/5">
                  <p className="text-3xl font-serif text-white">Room {booking.assigned_room}</p>
                </div>
              ) : (
                <>
                  <button 
                    onClick={handleCheckIn}
                    disabled={isLoading}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 text-[11px] uppercase font-black tracking-[0.3em] transition-all"
                  >
                    {isLoading ? 'Processing Arrival...' : 'Complete Self Check-In'}
                  </button>
                  <button 
                    onClick={() => setStage('search')}
                    className="w-full text-white/30 text-[9px] uppercase tracking-[0.2em] hover:text-white transition-all underline underline-offset-4"
                  >
                    Not your booking? Search again
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* --- STAGE 3: SUCCESS --- */}
        {stage === 'success' && booking && (
          <div className="text-center space-y-8 animate-fadeIn py-4 relative z-10">
            <div className="w-20 h-20 border border-amber-600/20 bg-amber-600/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(217,119,6,0.1)]">
              <span className="text-amber-500 text-3xl font-serif">✓</span>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-white/40 uppercase tracking-[0.2em]">Sanctuary Assignment</p>
              <p className="text-5xl font-CINZEL text-white tracking-widest">ROOM {booking.assigned_room}</p>
            </div>

            <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-widest max-w-[280px] mx-auto">
              Your digital key has been activated. Please proceed to your room. Our staff is available if you need further assistance.
            </p>

            <button 
              onClick={() => window.location.href = '/'}
              className="w-full border border-white/10 hover:border-amber-500/50 text-white/50 hover:text-amber-500 py-4 text-[10px] uppercase font-bold tracking-[0.3em] transition-all"
            >
              Return to Website
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
