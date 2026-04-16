import React from 'react';
//this would be used in the future when we have a Custom section
export default function ConfirmationDelete({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', isAlert = false, isDestructive = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1a1d17] border border-amber-600/20 w-full max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-slideUp relative">
        
        {/* Subtle Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-600/40 to-transparent"></div>

        <div className="p-10 text-center">
          <div className="mx-auto w-12 h-12 border border-amber-600/20 bg-amber-600/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <span className="text-amber-500 text-xl font-serif">!</span>
          </div>

          <h3 className="text-xl font-serif italic tracking-widest text-white mb-3 uppercase">{title}</h3>
          <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] leading-relaxed mb-8 px-4">{message}</p>

          <div className="flex flex-col gap-3">
            <button 
              type="button"
              onClick={onConfirm}
              className={`w-full ${isDestructive ? 'bg-red-900/40 hover:bg-red-800/60 border border-red-500/30' : 'bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-900/20'} text-white py-4 text-[10px] uppercase font-black tracking-[0.3em] transition-all active:scale-[0.98]`}
            >
              {confirmText}
            </button>
            {!isAlert && (
              <button 
                type="button"
                onClick={onCancel}
                className="w-full bg-white/5 hover:bg-white/10 text-white/40 border border-white/5 py-3 text-[9px] uppercase tracking-[0.2em] transition-all"
              >
                {cancelText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
