import React from 'react';
import { Link } from 'react-router-dom';
import { COLORS } from '../colors';

export default function Footer() {
  return (
    <footer className="py-20 border-t" style={{ backgroundColor: COLORS.bgDeep, borderColor: COLORS.border }}>
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 text-gray-400">
        <div className="md:col-span-2">
          <h2 className="text-white font-serif text-2xl mb-6 italic">The Atlantic Horizon</h2>
          <p className="text-xs uppercase tracking-widest leading-relaxed max-w-sm">
            Providing unparalleled luxury and Irish hospitality along the rugged Wild Atlantic Way since 1924.
          </p>
        </div>
        
        {/* Legal & T&C */}
        <div className="space-y-4">
          <p className="text-white text-[10px] uppercase tracking-[0.3em] font-black mb-4">Legal</p>
          <Link to="/tc" className="block text-[10px] uppercase tracking-widest hover:text-amber-500 transition-colors">Terms & Conditions</Link>
          <Link to="/privacy" className="block text-[10px] uppercase tracking-widest hover:text-amber-500 transition-colors">Privacy Policy</Link>
        </div>

        {/* 🌟 隐藏的 Staff Login */}
        <div className="space-y-4">
          <p className="text-white text-[10px] uppercase tracking-[0.3em] font-black mb-4">Internal</p>
          <Link to="/login" className="inline-block text-[10px] uppercase tracking-widest text-gray-600 hover:text-amber-500 transition-colors">
            Staff Portal 🔒
          </Link>
        </div>
      </div>
      
      <div className="mt-20 text-center text-[9px] uppercase tracking-[0.5em] text-gray-700">
        © 2026 Atlantic Horizon Manor. All Rights Reserved.
      </div>
    </footer>
  );
}