import React from "react";
// this wouyld be used in the future if we have a Parking Section
export default function ParkingModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      
      <div className="relative w-full max-w-lg bg-[#181818] p-10 shadow-2xl border border-white/5 text-center">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-manorGold hover:text-white transition-colors text-xl font-light leading-none"
          aria-label="Close Parking Information"
        >
          ✕
        </button>

        <h2 className="text-manorGold text-xl tracking-[0.4em] uppercase mt-2">
          Parking
        </h2>
        
        <div className="w-16 h-[1px] bg-manorGold/60 mx-auto my-6"></div>

        <div className="text-gray-300 text-sm leading-relaxed max-h-[50vh] overflow-y-auto px-2 custom-scrollbar text-left font-light space-y-6">
          
          <div>
            <h3 className="text-manorGold text-xs tracking-widest uppercase mb-2">Complimentary Valet</h3>
            <p className="text-xs opacity-80">
              Arrive at the main entrance, and our valet team will seamlessly handle your vehicle. This service is complimentary for all overnight guests and visitors to our dining rooms.
            </p>
          </div>

          <div>
            <h3 className="text-manorGold text-xs tracking-widest uppercase mb-2">Secure Self-Parking</h3>
            <p className="text-xs opacity-80">
              For guests who prefer to self-park, a secure, beautifully landscaped, and brightly lit private lot is located just beyond the west wing of the estate. 
            </p>
          </div>

          <div>
            <h3 className="text-manorGold text-xs tracking-widest uppercase mb-2">EV Charging Stations</h3>
            <p className="text-xs opacity-80">
              We offer six dedicated electric vehicle charging points (including Tesla destination chargers) available on a complimentary, first-come, first-served basis. 
            </p>
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