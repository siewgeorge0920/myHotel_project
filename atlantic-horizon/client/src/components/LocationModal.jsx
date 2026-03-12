import React from "react";

export default function LocationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      
      <div className="relative w-full max-w-lg bg-[#181818] p-10 shadow-2xl border border-white/5 text-center">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-manorGold hover:text-white transition-colors text-xl font-light leading-none"
          aria-label="Close Location Information"
        >
          ✕
        </button>

        <h2 className="text-manorGold text-xl tracking-[0.4em] uppercase mt-2">
          Location
        </h2>
        
        <div className="w-16 h-[1px] bg-manorGold/60 mx-auto my-6"></div>

        <div className="text-gray-300 text-sm leading-relaxed max-h-[50vh] overflow-y-auto px-2 custom-scrollbar text-center font-light space-y-6">
          
          <div>
            <h3 className="text-manorGold text-xs tracking-widest uppercase mb-2">The Estate</h3>
            <p className="text-xs opacity-80 leading-loose">
              The Atlantic Horizon Manor<br />
              Wild Atlantic Way<br />
              Southwest Ireland
            </p>
          </div>

          <div>
            <h3 className="text-manorGold text-xs tracking-widest uppercase mb-2">Arriving by Air</h3>
            <p className="text-xs opacity-80">
              We are located approximately 45 minutes from Kerry Airport and 90 minutes from Cork Airport. Private helicopter transfers can be arranged directly to our estate helipad upon request.
            </p>
          </div>

          <div>
            <h3 className="text-manorGold text-xs tracking-widest uppercase mb-2">Chauffeur Services</h3>
            <p className="text-xs opacity-80">
              Allow us to arrange a seamless journey. Our private chauffeur fleet is available to collect guests from any major airport or train station in the region.
            </p>
          </div>

        </div>

        {/* Buttons: One for Google Maps, one to Close */}
        <div className="mt-8 space-y-3">
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full py-4 bg-manorGold text-[#181818] text-xs tracking-[0.2em] uppercase hover:bg-white transition-all duration-300 font-semibold"
          >
            Get Directions
          </a>
          <button
            onClick={onClose}
            className="w-full py-4 border border-manorGold text-manorGold text-xs tracking-[0.2em] uppercase hover:bg-manorGold hover:text-[#181818] transition-all duration-300 font-semibold"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}