import React from 'react';
import { COLORS } from '../colors'; // 跟着你的文件路径

export default function LuxuryLoader({ message = "Verifying Identity..." }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden">
        {/* 金色扫描线 */}
        <div 
          className="absolute inset-0 w-1/3 h-full animate-loadingLine"
          style={{ 
            background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
            boxShadow: `0 0 20px ${COLORS.gold}`
          }}
        ></div>
      </div>
      <p className="mt-8 text-[10px] uppercase tracking-[0.6em] font-black italic animate-pulse" style={{ color: COLORS.gold }}>
        {message}
      </p>

      <style>{`
        @keyframes loadingLine {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(350%); }
        }
        .animate-loadingLine { animation: loadingLine 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
}