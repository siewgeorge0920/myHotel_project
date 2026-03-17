import React from "react";

export default function ContactUsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      
      <div className="relative w-full max-w-md bg-[#181818] p-10 shadow-2xl border border-white/5 text-center">
        
        {/* The thin, Gold X button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-manorGold hover:text-white transition-colors text-xl font-light leading-none"
          aria-label="Close Contact"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-manorGold text-xl tracking-[0.4em] uppercase mt-2">
          Contact Us
        </h2>
        
        <div className="w-16 h-[1px] bg-manorGold/60 mx-auto my-6"></div>

        <div className="text-gray-300 text-sm leading-relaxed text-left font-light">
          
          <div className="text-center mb-6 text-xs opacity-70 space-y-1">
            <p>Wild Atlantic Way, Southwest Ireland</p>
            <p>+353 00 000 0000 | info@atlantichorizon.ie</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-manorGold/80 text-[10px] tracking-[0.15em] uppercase mb-1.5">Name</label>
              <input 
                type="text" 
                className="w-full bg-[#111111] border border-white/10 p-3 text-white focus:border-manorGold focus:outline-none transition-colors" 
                placeholder="Your Full Name" 
              />
            </div>
            
            <div>
              <label className="block text-manorGold/80 text-[10px] tracking-[0.15em] uppercase mb-1.5">Email</label>
              <input 
                type="email" 
                className="w-full bg-[#111111] border border-white/10 p-3 text-white focus:border-manorGold focus:outline-none transition-colors" 
                placeholder="your@email.com" 
              />
            </div>
            
            <div>
              <label className="block text-manorGold/80 text-[10px] tracking-[0.15em] uppercase mb-1.5">Message</label>
              <textarea 
                rows="3" 
                className="w-full bg-[#111111] border border-white/10 p-3 text-white focus:border-manorGold focus:outline-none transition-colors resize-none" 
                placeholder="How can we assist you?"
              ></textarea>
            </div>

            <button
              type="submit"
              onClick={onClose} 
              className="w-full mt-2 py-4 bg-manorGold text-[#181818] text-xs tracking-[0.2em] uppercase hover:bg-white transition-all duration-300 font-semibold"
            >
              Send Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}