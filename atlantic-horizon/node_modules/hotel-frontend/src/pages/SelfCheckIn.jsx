import React, { useState } from 'react';
import axios from 'axios';
import { COLORS } from '../colors';

export default function SelfCheckIn() {
  const [formData, setFormData] = useState({ bookingId: '', email: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      const res = await axios.post('http://localhost:5000/api/bookings/self-check-in', formData);
      setStatus({ type: 'success', msg: `Welcome! ${res.data.message}` });
    } catch (err) {
      setStatus({ 
        type: 'error', 
        msg: err.response?.data?.message || 'Check-in failed. Please verify your details or ask reception for help.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#1a1d17]">
      <div className="max-w-md w-full p-12 border shadow-2xl relative overflow-hidden animate-fadeIn" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
        
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-600/5 blur-3xl" />

        <div className="text-center mb-10 relative z-10">
          <p className="text-amber-500 text-[9px] uppercase tracking-[0.4em] font-black mb-2">Guest Portal</p>
          <h2 className="font-serif italic text-3xl tracking-wide mb-2">Self Check-In</h2>
          <p className="text-white/40 text-[10px] uppercase tracking-widest leading-relaxed">
            Please enter your reservation details to complete your arrival process.
          </p>
        </div>

        {status.msg && (
          <div className={`mb-8 p-4 text-center border text-[11px] leading-relaxed uppercase tracking-widest font-black animate-slideUp z-10 relative ${
            status.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {status.msg}
          </div>
        )}

        <form onSubmit={handleCheckIn} className="space-y-6 relative z-10">
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-amber-500 font-bold mb-2">Booking Reference Number</label>
            <input 
              type="text" 
              value={formData.bookingId}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-amber-500 outline-none transition-all placeholder:text-white/20 uppercase"
              onChange={(e) => setFormData({ ...formData, bookingId: e.target.value.toUpperCase() })}
              placeholder="e.g. BKG-1A2B3C"
              required
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-widest text-amber-500 font-bold mb-2">Email Address</label>
            <input 
              type="email" 
              value={formData.email}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-amber-500 outline-none transition-all placeholder:text-white/20"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="guest@example.com"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading || status.type === 'success'}
            className="w-full mt-4 bg-amber-600 hover:bg-amber-500 text-white py-4 text-[10px] uppercase font-bold tracking-[0.2em] transition-all disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : (status.type === 'success' ? 'Checked In' : 'Complete Check-In')}
          </button>
        </form>

        <div className="mt-8 text-center relative z-10">
           <p className="text-[10px] text-white/30 truncate">For immediate assistance, dial 0.</p>
        </div>
      </div>
    </div>
  );
}
