import React from 'react';
import { COLORS } from '../../colors';

export default function LocalIrishExcursion() {
  const journeys = [
    { t: "Cliffs Helicopter Tour", d: "Private landing on the Skellig Islands." },
    { t: "Vintage Chauffeur", d: "The Ring of Kerry in our heritage Land Rover fleet." },
    { t: "Private Yacht Charter", d: "Explore hidden Atlantic coves with our onboard chef." }
  ];

  return (
    <div className="bg-[#faf9f6] min-h-screen font-lato pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
           <span style={{ color: COLORS.amber }} className="uppercase tracking-[0.6em] text-[11px] font-black block mb-4">Lincoln's Curated Travels</span>
           <h1 className="font-cinzel text-5xl md:text-7xl text-manorGreen uppercase tracking-widest">Bespoke Expeditions</h1>
        </div>

        {/* EXCURSION GRID */}
        <div className="grid md:grid-cols-3 gap-12 mb-40">
           {journeys.map((j, i) => (
             <div key={i} className="group cursor-pointer">
                <div className="h-96 overflow-hidden mb-6 relative">
                   <div className="absolute inset-0 bg-manorGreen/20 group-hover:bg-transparent transition-all z-10"></div>
                   <img src={`/src/assets/images/main${i+1}.webp`} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
                </div>
                <h4 className="font-cinzel text-xl text-manorGreen mb-3">{j.t}</h4>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest leading-relaxed">{j.d}</p>
             </div>
           ))}
        </div>

        {/* HONEYMOON SPECIAL SECTION */}
        <div className="bg-manorGreen text-white p-20 rounded-sm relative overflow-hidden">
           <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                 <h3 className="font-cinzel text-4xl">The Honeymoon Package</h3>
                 <p className="font-georgia italic opacity-60 leading-loose">
                    "Celebrate your union where the rugged coast meets eternal luxury. Our exclusive honeymoon suite includes midnight garden picnics and private stargazing sessions."
                 </p>
                 <button className="border border-manorGold text-manorGold px-10 py-3 text-[10px] uppercase tracking-widest hover:bg-manorGold hover:text-white transition-all">View Romantic Inclusions</button>
              </div>
              <img src="/src/assets/images/RoomTypes/Club(VIP Access(Family suite))/view2.jpg" className="rounded shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000" alt="Honeymoon" />
           </div>
        </div>
      </div>
    </div>
  );
}