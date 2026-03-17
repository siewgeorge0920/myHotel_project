import React, { useState } from 'react';

const GiftCard = ({ onClose }) => {
  // State to track form inputs
  const [selectedAmount, setSelectedAmount] = useState('€1000');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');

  const handlePurchase = (e) => {
    e.preventDefault();
    console.log(`Purchasing ${selectedAmount} gift card for ${recipientName} (${recipientEmail})`);
    onClose(); 
  };

  return (
    // Dark overlay with cinematic blur effect (keeps it as a modal)
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
      
      {/* Gift Card Form Container (Your exact new styling) */}
      <div className="relative z-10 w-full max-w-md bg-zinc-900/95 border border-manorGold/20 p-8 md:p-12 shadow-2xl">
        
        {/* Close button (Calls onClose instead of React Router Link) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-6 text-manorGold/60 hover:text-manorGold transition-colors text-3xl font-light"
          aria-label="Close"
        >
          &times; 
        </button>

        {/* Form Header Section */}
        <div className="text-center mb-10">
          <h2 className="text-manorGold text-3xl font-serif tracking-[0.3em] uppercase mb-2">
            Gift Card
          </h2>
          {/* Decorative divider line */}
          <div className="h-px w-10 bg-manorGold mx-auto"></div>
        </div>

        {/* Gift Card Form */}
        <form onSubmit={handlePurchase} className="space-y-6">

          {/* Recipient Name Input */}
          <input 
            type="text" 
            required
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="RECIPIENT NAME" 
            className="w-full bg-transparent border-b border-manorGold/30 py-3 text-white text-[10px] tracking-widest focus:outline-none focus:border-manorGold transition-colors placeholder:text-gray-600"
          />

          {/* Recipient Email Input */}
          <input 
            type="email" 
            required
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="RECIPIENT EMAIL" 
            className="w-full bg-transparent border-b border-manorGold/30 py-3 text-white text-[10px] tracking-widest focus:outline-none focus:border-manorGold transition-colors placeholder:text-gray-600"
          />

          {/* Gift Amount Selection Section */}
          <div className="pt-4">

            {/* Section Title */}
            <p className="text-manorGold text-[10px] tracking-[0.2em] mb-4 uppercase text-center font-medium">
              Select Amount
            </p>

            {/* Amount Options Grid */}
            <div className="grid grid-cols-3 gap-3">
              {['€1000', '€2000', '€5000'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSelectedAmount(val)} // Update selected amount
                  className={`
                    py-2 text-xs transition-all duration-300 border
                    ${selectedAmount === val 
                      // Active state styling with glowing shadow
                      ? 'bg-manorGold text-black border-manorGold shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105' 
                      // Default state styling
                      : 'border-manorGold/40 text-white hover:border-manorGold/80'
                    }
                  `}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>          

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full mt-10 border border-manorGold text-manorGold py-4 text-[10px] uppercase tracking-[0.4em] transition-all duration-500 hover:bg-manorGold hover:text-white"
          >
            Purchase Invitation
          </button>

        </form>
      </div>
    </div>
  );
};

export default GiftCard;