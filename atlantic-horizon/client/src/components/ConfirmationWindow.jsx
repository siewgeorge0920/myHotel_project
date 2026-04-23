import React from 'react';
import { COLORS } from '../colors';

/**
 * The Atlantic Horizon - Universal Confirmation & Alert Window
 * Centralized portal for all system-wide prompts (Confirmations, Warnings, Alerts).
 */
export default function ConfirmationWindow({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Confirm Action', 
  cancelText = 'Abort', 
  isAlert = false, 
  isDestructive = false 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="bg-[#1a1d17] border border-amber-600/20 w-full max-w-sm shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden animate-slideUp relative rounded-sm">
        
        {/* Modernist Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-amber-600/60 to-transparent"></div>

        <div className="p-12 text-center">
          {/* Status Icon Wrapper */}
          <div className="mx-auto w-14 h-14 border border-amber-600/30 bg-amber-600/5 rounded-full flex items-center justify-center mb-8 shadow-inner">
            <span className="text-amber-500 text-2xl font-serif">{isDestructive ? '!' : '?'}</span>
          </div>

          <h3 className="text-xl font-serif italic tracking-[0.1em] text-white mb-4 uppercase leading-tight">
            {title}
          </h3>
          
          <p className="text-white/40 text-[10px] uppercase tracking-[0.25em] leading-relaxed mb-10 px-2 font-medium">
            {message}
          </p>

          <div className="flex flex-col gap-4">
            <button 
              type="button"
              onClick={() => {
                onConfirm();
              }}
              className={`w-full py-5 text-[10px] uppercase font-black tracking-[0.4em] transition-all active:scale-[0.97] shadow-2xl ${
                isDestructive 
                  ? 'bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400' 
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {confirmText}
            </button>
            
            {!isAlert && (
              <button 
                type="button"
                onClick={onCancel}
                className="w-full bg-white/[0.03] hover:bg-white/[0.08] text-white/30 border border-white/5 py-4 text-[9px] uppercase tracking-[0.3em] transition-all font-bold"
              >
                {cancelText}
              </button>
            )}
          </div>
        </div>
        
        {/* Subtle Bottom Glow */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none"></div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}
