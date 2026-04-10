import React, { useState } from 'react';

// Accept 'isOpen' (boolean) and 'onClose' (function) props passed down from App.jsx
const CookieWindow = ({ isOpen, onClose }) => {
  
  // Local state to manage which checkbox is currently selected.
  // We default 'acceptCookies' to true, as it is the recommended setting.
  const [acceptCookies, setAcceptCookies] = useState(true);
  const [declineCookies, setDeclineCookies] = useState(false);

  // Handler for when the user clicks the "Accept All" option.
  // It ensures the options remain mutually exclusive (you can't select both).
  const handleAcceptToggle = () => {
    setAcceptCookies(true);
    setDeclineCookies(false);
  };

  // Handler for when the user clicks the "Decline" option.
  const handleDeclineToggle = () => {
    setDeclineCookies(true);
    setAcceptCookies(false);
  };

  // Handler for the form submission when the user clicks "Save Preferences"
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default browser behavior of refreshing the page
    console.log("Cookies saved: ", acceptCookies ? "Accepted All" : "Declined Non-Essential");
    
    // Call the onClose function passed from App.jsx to hide the modal
    onClose(); 
  };

  // If isOpen is false, return null. This tells React to render absolutely nothing,
  // effectively hiding the modal from the screen.
  if (!isOpen) return null;

  return (
    // 1. The Overlay: Fixed to the screen (inset-0), sits on top of everything (z-[9999]), 
    // with a dark semi-transparent background and a blur effect (backdrop-blur-sm).
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      
      {/* 2. The Modal Box: A relative container with a dark background, subtle gold border, and shadow. */}
      <div className="relative bg-[#1a1a1a] p-8 md:p-12 w-full max-w-md border border-[#d4af37]/20 shadow-2xl">
        
        {/* Close Button (The 'X' in the top right corner) */}
        <button 
          className="absolute top-4 right-6 text-[#d4af37]/60 hover:text-[#d4af37] text-3xl font-light transition-colors"
          onClick={onClose} 
          aria-label="Close modal"
        >
          &times;
        </button>
        
        {/* Header Section */}
        <div className="text-center mb-8 mt-2">
          <h2 className="text-[#d4af37] text-2xl font-serif tracking-[0.3em] uppercase mb-4">
            COOKIES
          </h2>
          {/* Decorative gold divider line */}
          <div className="h-px w-10 bg-[#d4af37] mx-auto"></div>
        </div>

        {/* The Form: Triggers handleSubmit when the button at the bottom is clicked */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          
          {/* Informational text explaining cookie usage */}
          <p className="text-gray-400 text-xs tracking-wider leading-relaxed text-center font-light">
            Welcome to our site. We use cookies to ensure you receive a flawless and tailored experience. 
            These help us securely maintain site functionality, understand guest interactions, 
            and personalize our offerings to your preferences.
          </p>

          {/* Checkbox Selection Area */}
          <div className="flex flex-col gap-4 pl-4">
            
            {/* Option 1: Accept All Cookies */}
            <div 
              onClick={handleAcceptToggle}
              className="flex items-center gap-4 cursor-pointer group"
            >
              {/* Custom Checkbox UI built with Tailwind (replaces default browser checkbox) */}
              <div className={`w-4 h-4 flex items-center justify-center border transition-all duration-300 ${
                acceptCookies 
                  ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#d4af37]' // Active (Gold)
                  : 'border-gray-500 group-hover:border-gray-400'     // Inactive (Gray)
              }`}>
                {/* Render the checkmark character only if this option is selected */}
                {acceptCookies && <span className="text-[10px]">✓</span>}
              </div>
              <span className="text-gray-300 text-[10px] tracking-[0.15em] uppercase">
                Accept all cookies (Recommended)
              </span>
            </div>

            {/* Option 2: Decline Non-Essential Cookies */}
            <div 
              onClick={handleDeclineToggle}
              className="flex items-center gap-4 cursor-pointer group"
            >
              {/* Custom Checkbox UI built with Tailwind */}
              <div className={`w-4 h-4 flex items-center justify-center border transition-all duration-300 ${
                declineCookies 
                  ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#d4af37]' // Active (Gold)
                  : 'border-gray-500 group-hover:border-gray-400'     // Inactive (Gray)
              }`}>
                {/* Render the checkmark character only if this option is selected */}
                {declineCookies && <span className="text-[10px]">✓</span>}
              </div>
              <span className="text-gray-300 text-[10px] tracking-[0.15em] uppercase">
                Decline non-essential cookies
              </span>
            </div>

          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full mt-4 border border-[#d4af37] text-[#d4af37] py-4 text-[10px] uppercase tracking-[0.4em] transition-all duration-500 hover:bg-[#d4af37] hover:text-black"
          >
            SAVE PREFERENCES
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default CookieWindow;