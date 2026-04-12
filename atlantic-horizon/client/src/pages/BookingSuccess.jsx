import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingId = location.state?.bookingId || 'ATH-PENDING';

  return (
    <div className="min-h-screen bg-[#1a1d17] flex flex-col items-center justify-center text-white px-6 py-20 relative overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content */}
      <div className="max-w-2xl w-full text-center relative z-10 p-12 bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl animate-fadeIn">
        
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full border border-amber-500/30 flex items-center justify-center bg-amber-500/10">
            <span className="text-5xl text-amber-500">🗝️</span>
          </div>
        </div>

        {/* Headings */}
        <p className="text-[10px] text-amber-500 uppercase tracking-[0.4em] font-black mb-4 animate-slideDown">
          Reservation Confirmed
        </p>
        <h1 className="font-cinzel text-4xl md:text-5xl lg:text-6xl text-white/90 uppercase tracking-widest mb-6 leading-tight">
          THE KEYS ARE YOURS
        </h1>
        
        {/* Booking Reference Number */}
        <div className="bg-black/30 border border-amber-500/20 py-4 px-6 mx-auto inline-block mb-8 rounded-md">
          <p className="text-[9px] uppercase tracking-widest text-amber-500/60 mb-1">Booking Reference Number</p>
          <p className="font-mono text-xl md:text-2xl font-bold tracking-widest text-white/90">{bookingId}</p>
        </div>
        
        {/* Divider */}
        <div className="w-24 border-b border-amber-500/50 mx-auto mb-8" />

        {/* Message */}
        <p className="text-white/60 font-light text-sm md:text-base leading-relaxed max-w-lg mx-auto mb-10 tracking-wide italic">
          A confirmation of your sanctuary has been dispatched to your inbox. 
          We eagerly await your arrival at The Atlantic Horizon Manor. 
        </p>
        
        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-12">
          Note: You may proceed to Self Check-In at any time <br/> using the button in the top right corner.
        </p>

        {/* Action Button */}
        <button 
          onClick={() => navigate('/')} 
          className="border border-white/20 bg-white/5 px-12 py-5 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-amber-600 hover:border-amber-600 hover:text-white hover:shadow-[0_0_20px_rgba(217,119,6,0.5)] transition-all duration-300"
        >
          Return to Manor Grounds
        </button>

      </div>
    </div>
  );
}
