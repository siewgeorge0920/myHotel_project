import React from "react";
// this would be used in the future if we have a Privacy Policy Section
export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#181818] p-10 shadow-2xl border border-white/5 text-center">
        
        {/* Close Button (X) */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-manorGold hover:text-white transition-colors text-xl font-light leading-none"
          aria-label="Close Privacy Policy"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-manorGold text-xl tracking-[0.4em] uppercase mt-2">
          Privacy Policy
        </h2>
        
        {/* Gold Divider Line */}
        <div className="w-16 h-[1px] bg-manorGold/60 mx-auto my-6"></div>

        {/* Scrollable Content Area */}
        <div className="text-gray-300 text-sm leading-relaxed max-h-[50vh] overflow-y-auto px-2 custom-scrollbar text-left space-y-4 font-light">
          <p>
            Welcome to The Atlantic Horizon Manor. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
          </p>
          
          <h3 className="text-manorGold text-xs tracking-widest uppercase mt-6 mb-2">1. The data we collect</h3>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows: Identity Data, Contact Data, and Usage Data.
          </p>

          <h3 className="text-manorGold text-xs tracking-widest uppercase mt-6 mb-2">2. How we use your data</h3>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to manage your booking, process payments, and improve our services to ensure you receive a flawless and tailored experience.
          </p>
        </div>

        {/* Bottom Button */}
        <button
          onClick={onClose}
          className="w-full mt-10 py-4 border border-manorGold text-manorGold text-xs tracking-[0.2em] uppercase hover:bg-manorGold hover:text-[#181818] transition-all duration-300 font-semibold"
        >
          Acknowledge & Close
        </button>
      </div>
    </div>
  );
}