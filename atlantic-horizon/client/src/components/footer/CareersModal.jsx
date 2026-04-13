import React from "react";

// Removed the isOpen prop and the if(!isOpen) check
export default function CareersModal({ onClose }) {

  return (
    <div 
      // Added onClick to close the modal when clicking the dark background
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      
      {/* Modal Container */}
      <div 
        // Added stopPropagation so clicking inside the modal doesn't close it
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#181818] p-10 shadow-2xl border border-white/5 text-center"
      >
        
        {/* Close Button - leading-none added for perfect centering */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-manorGold hover:text-white transition-colors text-xl font-light leading-none"
          aria-label="Close Careers"
        >
          ✕
        </button>

        {/* Header - Resized to text-xl to match the other windows */}
        <h2 className="text-manorGold text-xl tracking-[0.4em] uppercase mt-2">
          Careers
        </h2>
        
        {/* Divider line - adjusted opacity to match the others */}
        <div className="w-16 h-[1px] bg-manorGold/60 mx-auto my-6"></div>

        {/* Content Area */}
        <div className="text-gray-300 text-sm leading-relaxed max-h-[50vh] overflow-y-auto px-2 custom-scrollbar text-left font-light">
          <p className="mb-6 text-center">
            Join the team at The Atlantic Horizon Manor. We are always looking for passionate individuals dedicated to delivering flawless hospitality.
          </p>
          
          <div className="space-y-4">
            {/* Job Posting 1 */}
            <div className="border border-white/10 p-4 hover:border-manorGold/50 transition">
              <h3 className="text-manorGold text-xs tracking-widest uppercase mb-1">Guest Experience Manager</h3>
              <p className="text-xs opacity-70">Full-time • Competitive Salary</p>
            </div>

            {/* Job Posting 2 */}
            <div className="border border-white/10 p-4 hover:border-manorGold/50 transition">
              <h3 className="text-manorGold text-xs tracking-widest uppercase mb-1">Executive Sous Chef</h3>
              <p className="text-xs opacity-70">Full-time • Culinary Team</p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs opacity-80">
            To apply, please send your CV and cover letter to <br/>
            <a href="mailto:careers@atlantichorizon.ie" className="text-manorGold hover:text-white transition underline mt-2 inline-block">careers@atlantichorizon.ie</a>
          </p>
        </div>

        {/* Bottom Button - added font-semibold */}
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