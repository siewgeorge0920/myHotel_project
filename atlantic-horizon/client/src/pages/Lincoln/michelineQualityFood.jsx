import React from 'react';
import { COLORS } from '../../colors';

export default function MichelineQualityFood() {
  return (
    <div className="bg-[#1a1d17] min-h-screen text-white font-lato">
      {/* 🎬 VIDEO HERO */}
      <section className="relative h-screen w-full overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
          <source src="/src/assets/videos/chef-cooking.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#1a1d17]"></div>
        <div className="relative z-10 h-full flex flex-col justify-end pb-32 px-12 max-w-7xl mx-auto">
           <span className="text-amber-500 uppercase tracking-[0.5em] text-[10px] font-black mb-4">The Gastronomy Collection</span>
           <h1 className="font-cinzel text-7xl md:text-9xl tracking-tighter uppercase leading-none">Michelin<br/>Excellence</h1>
        </div>
      </section>

      {/* SECTION 2: THE CELESTIAL TABLE */}
      <div className="max-w-7xl mx-auto px-6 py-40">
        <div className="grid lg:grid-cols-2 gap-24 items-center mb-48">
          <div className="space-y-10">
            <h2 className="font-cinzel text-5xl text-amber-500">The Celestial Table</h2>
            <p className="font-georgia italic text-xl opacity-80 leading-relaxed">
              "A symphony of Atlantic flavors, where every dish tells the story of the Irish coastline."
            </p>
            <p className="text-sm opacity-60 leading-loose">
              Our 2-Michelin-starred restaurant offers a 12-course tasting journey. Our chefs forage daily for wild sea herbs and collaborate with local deep-sea divers to bring the freshest catch to your plate.
            </p>
            <button style={{ backgroundColor: COLORS.amber }} className="px-12 py-4 text-white text-[10px] uppercase font-black tracking-widest hover:brightness-110 transition-all">Request a Table</button>
          </div>
          <div className="relative group overflow-hidden shadow-2xl">
             <img src="/src/assets/images/diningHall.jpg" className="w-full h-[600px] object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-[3000ms] group-hover:scale-110" alt="Dining" />
          </div>
        </div>

        {/* SECTION 3: CONTINENTAL BREAKFAST (LONG CONTENT) */}
        <div className="bg-white/5 p-20 rounded-sm border border-white/5 relative overflow-hidden">
           <div className="relative z-10 grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                 <h3 className="font-cinzel text-3xl mb-6">Mornings at<br/>The Manor</h3>
                 <p className="text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-4 italic">Continental In-Room Service</p>
              </div>
              <div className="lg:col-span-8">
                 <p className="text-sm opacity-50 leading-loose mb-10">
                    Wake up to the scent of freshly baked sourdough and house-churned Irish butter. Our signature Continental Breakfast is served on vintage silver trays, featuring organic honeycomb from our estate beehives and hand-pressed Atlantic apple juice.
                 </p>
                 <div className="grid grid-cols-2 gap-8 text-[11px] uppercase tracking-widest opacity-80">
                    <div className="flex items-center gap-4 border-l border-amber-600/30 pl-4">✦ Artisanal Pastries</div>
                    <div className="flex items-center gap-4 border-l border-amber-600/30 pl-4">✦ Rare Irish Cheeses</div>
                    <div className="flex items-center gap-4 border-l border-amber-600/30 pl-4">✦ Smoked Salmon</div>
                    <div className="flex items-center gap-4 border-l border-amber-600/30 pl-4">✦ Single-Origin Coffee</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}