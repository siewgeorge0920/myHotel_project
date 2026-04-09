import React from "react";

export default function FaqsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      
      <div className="relative w-full max-w-lg bg-[#181818] p-10 shadow-2xl border border-white/5 text-center">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-manorGold hover:text-white transition-colors text-xl font-light leading-none"
          aria-label="Close FAQs"
        >
          ✕
        </button>

        <h2 className="text-manorGold text-xl tracking-[0.4em] uppercase mt-2">
          F A Q s
        </h2>
        
        <div className="w-16 h-[1px] bg-manorGold/60 mx-auto my-6"></div>

        <div className="text-gray-300 text-sm leading-relaxed max-h-[50vh] overflow-y-auto px-2 custom-scrollbar text-left font-light space-y-6">
          
          <div>
            <h3 className="text-manorGold text-xs tracking-widest uppercase mb-2">What are your check-in and check-out times?</h3>
            <p className="text-xs opacity-80">Check-in is from 3:00 PM, and check-out is prior to 11:00 AM. Early check-in and late check-out can be arranged subject to availability.</p>
          </div>

          <div>
            <h3 className="text-manorGold text-xs tracking-widest uppercase mb-2">Are pets allowed at the Manor?</h3>
            <p className="text-xs opacity-80">While we adore animals, to ensure a tranquil environment for all guests, we only accommodate registered service animals.</p>
          </div>

          <div>
            <h3 className="text-manorGold text-xs tracking-widest uppercase mb-2">Is the Spa open to non-residents?</h3>
            <p className="text-xs opacity-80">Our spa facilities are exclusively reserved for guests staying at The Atlantic Horizon to maintain ultimate exclusivity and privacy.</p>
          </div>

          <div>
            <h3 className="text-manorGold text-xs tracking-widest uppercase mb-2">Do you cater to dietary requirements?</h3>
            <p className="text-xs opacity-80">Absolutely. Our culinary team can accommodate all dietary restrictions and allergies. Please inform us prior to your arrival.</p>
          </div>

        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 py-4 border border-manorGold text-manorGold text-xs tracking-[0.2em] uppercase hover:bg-manorGold hover:text-[#181818] transition-all duration-300 font-semibold"
        >
          Close Window
        </button>
      </div>
    </div>
  );
}