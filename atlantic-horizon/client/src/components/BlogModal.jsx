import React from "react";

export default function BlogModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      
      <div className="relative w-full max-w-lg bg-[#181818] p-10 shadow-2xl border border-white/5 text-center">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-manorGold hover:text-white transition-colors text-xl font-light leading-none"
          aria-label="Close Blog"
        >
          ✕
        </button>

        <h2 className="text-manorGold text-xl tracking-[0.4em] uppercase mt-2">
          Journal
        </h2>
        
        <div className="w-16 h-[1px] bg-manorGold/60 mx-auto my-6"></div>

        <div className="text-gray-300 text-sm leading-relaxed max-h-[50vh] overflow-y-auto px-2 custom-scrollbar text-left font-light">
          
          {/* Article 1 */}
          <div className="border-b border-white/10 pb-5 mb-5">
            <p className="text-manorGold/60 text-[9px] tracking-[0.2em] uppercase mb-1">October 12 • Culinary</p>
            <h3 className="text-manorGold text-sm tracking-wider uppercase mb-2">Autumn Tasting Menu Unveiled</h3>
            <p className="text-xs opacity-80 mb-3">Our Executive Chef has curated a seasonal menu highlighting the finest local, forged ingredients from the Southwest coast...</p>
            <button className="text-manorGold text-[10px] tracking-widest uppercase hover:text-white transition underline">Read More</button>
          </div>

          {/* Article 2 */}
          <div className="border-b border-white/10 pb-5 mb-5">
            <p className="text-manorGold/60 text-[9px] tracking-[0.2em] uppercase mb-1">September 28 • Wellness</p>
            <h3 className="text-manorGold text-sm tracking-wider uppercase mb-2">New Holistic Spa Treatments</h3>
            <p className="text-xs opacity-80 mb-3">Discover our new range of seaweed-infused restorative therapies designed to align body and mind...</p>
            <button className="text-manorGold text-[10px] tracking-widest uppercase hover:text-white transition underline">Read More</button>
          </div>

          {/* Article 3 */}
          <div className="pb-2">
            <p className="text-manorGold/60 text-[9px] tracking-[0.2em] uppercase mb-1">August 15 • Estate</p>
            <h3 className="text-manorGold text-sm tracking-wider uppercase mb-2">A Guide to the Walled Gardens</h3>
            <p className="text-xs opacity-80 mb-3">Take a virtual stroll through our historic, newly restored 18th-century walled botanical gardens...</p>
            <button className="text-manorGold text-[10px] tracking-widest uppercase hover:text-white transition underline">Read More</button>
          </div>

        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-4 border border-manorGold text-manorGold text-xs tracking-[0.2em] uppercase hover:bg-manorGold hover:text-[#181818] transition-all duration-300 font-semibold"
        >
          Close Journal
        </button>
      </div>
    </div>
  );
}