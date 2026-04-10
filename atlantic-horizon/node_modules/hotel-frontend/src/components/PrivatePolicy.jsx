import React from 'react';
import { X } from 'lucide-react'; // Or your preferred icon library

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-[#1a1a1a] border border-manorGold/10 p-8 shadow-2xl">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-manorGold/60 hover:text-manorGold transition"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-manorGold text-2xl tracking-[0.2em] uppercase mb-2">
            Privacy Policy
          </h2>
          <div className="w-12 h-[1px] bg-manorGold mx-auto"></div>
        </div>

        {/* Content - Scrollable if long */}
        <div className="text-manorRose/80 text-sm leading-relaxed space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <p>
            Welcome to Atlantic Horizon. Your privacy is of the utmost importance to us. 
            This policy outlines how we collect, use, and protect your personal data.
          </p>
          <h3 className="text-manorGold uppercase tracking-wider text-xs mt-4">Data Collection</h3>
          <p>
            We collect information you provide directly to us when making reservations 
            or signing up for our newsletter.
          </p>
          <h3 className="text-manorGold uppercase tracking-wider text-xs mt-4">Your Rights</h3>
          <p>
            You have the right to access, correct, or delete your personal information 
            at any time by contacting our support team.
          </p>
        </div>

        {/* Footer Button */}
        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full py-4 border border-manorGold text-manorGold text-xs tracking-[0.2em] uppercase hover:bg-manorGold hover:text-black transition-all duration-300"
          >
            Close Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;