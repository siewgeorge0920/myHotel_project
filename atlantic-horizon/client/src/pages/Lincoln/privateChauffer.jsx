import React from 'react';
import { COLORS } from '../../colors';

export default function PrivateChauffer() {
  return (
    <div className="pt-40 pb-20 bg-[#1a1d17] text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h1 className="font-cinzel text-5xl tracking-widest">PRIVATE CHAUFFEUR</h1>
            <p className="text-sm opacity-60 leading-loose">
              Tour the Ring of Kerry or the Wild Atlantic Way in absolute comfort. Our fleet of vintage Land Rovers and modern luxury sedans are at your command, driven by local guides who know every hidden secret of the coast.
            </p>
            <ul className="text-[11px] uppercase tracking-widest text-amber-500 space-y-3 font-bold">
              <li>✦ Airport Transfers (Dublin/Shannon)</li>
              <li>✦ Full-Day Coastal Exploration</li>
              <li>✦ Nightly Dinner Transfers</li>
            </ul>
            <button className="border border-white/20 px-10 py-4 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">Book Your Driver</button>
          </div>
          <img src="/src/assets/images/main3.jpg" className="rounded-sm grayscale hover:grayscale-0 transition-all duration-1000" alt="Chauffeur" />
        </div>
      </div>
    </div>
  );
}