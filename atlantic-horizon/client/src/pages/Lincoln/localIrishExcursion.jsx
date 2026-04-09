import React from 'react';
import { COLORS } from '../../colors';

export default function LocalIrishExcursion() {
   const journeys = [
      { t: "Cliffs Helicopter Tour", d: "Private landing on the Skellig Islands.", img: "cliffs_of_moher.png" },
      { t: "Vintage Chauffeur", d: "The Ring of Kerry in our heritage Land Rover fleet.", img: "Main.png" },
      { t: "Private Yacht Charter", d: "Explore hidden Atlantic coves with our onboard chef.", img: "yacth.png" }
   ];

   return (
      <div className="bg-[#faf9f6] min-h-screen font-lato pt-32 pb-20 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
               <span style={{ color: COLORS.amber }} className="uppercase tracking-[0.6em] text-[11px] font-black block mb-4">Lincoln's Curated Travels</span>
               <h1 className="font-cinzel text-4xl md:text-5xl lg:text-7xl text-manorGreen uppercase tracking-widest leading-tight">Bespoke Expeditions</h1>
            </div>

            {/* EXCURSION GRID */}
            <div className="grid md:grid-cols-3 gap-12 mb-40">
               {journeys.map((j, i) => (
                  <div key={i} className="group cursor-pointer">
                     <div className="h-[400px] md:h-[500px] overflow-hidden mb-8 relative drop-shadow-2xl">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-700 z-10"></div>
                        <img
                           src={`/images/Lincoln/Local/${j.img}`}
                           className={`w-full h-full transition-transform duration-[3000ms] ease-out group-hover:scale-[1.15] ${j.img === 'cliffs_of_moher.png' ? 'object-cover object-[15%_center]' : 'object-cover'}`}
                           alt={j.t}
                        />
                        <div className="absolute inset-x-6 bottom-6 h-[1px] bg-white/30 z-20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-1000"></div>
                     </div>
                     <h4 className="font-cinzel text-2xl text-[#242820] mb-3 group-hover:text-amber-800 transition-colors duration-500">{j.t}</h4>
                     <p className="text-xs text-[#5a6254] uppercase tracking-widest leading-relaxed font-light">{j.d}</p>
                  </div>
               ))}
            </div>

            {/* THE ESTATE WARDROBE SECTION (Dark Theme) */}
            <div className="mt-24 bg-[#1a1d17] text-white rounded-sm overflow-hidden relative drop-shadow-2xl">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[100px] pointer-events-none"></div>

               <div className="grid lg:grid-cols-2">
                  <div className="p-10 md:p-16 lg:p-24 flex flex-col justify-center relative z-10">
                     <div className="flex items-center gap-4 text-amber-500 font-bold tracking-[0.3em] text-[10px] uppercase mb-8">
                        <span>The Estate Wardrobe</span>
                        <div className="h-[1px] w-12 bg-amber-500/30"></div>
                     </div>

                     <h3 className="font-cinzel text-3xl md:text-4xl lg:text-5xl leading-tight mb-8">
                        Prepared for the <span className="italic font-georgia text-amber-500 px-2 block mt-2">Elements</span>
                     </h3>

                     <p className="text-white/60 text-sm leading-loose font-light mb-12 max-w-md">
                        Leave your heavy gear behind. Lincoln provides complimentary use of iconic Barbour waxed jackets, Hunter wellingtons, and bespoke Irish walking sticks for all your Atlantic and countryside expeditions.
                     </p>

                     <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">
                        <span className="border border-white/10 px-4 py-2 rounded-full">Barbour Outerwear</span>
                        <span className="border border-white/10 px-4 py-2 rounded-full">Hunter Wellingtons</span>
                        <span className="border border-white/10 px-4 py-2 rounded-full">Picnic Hampers</span>
                     </div>
                  </div>

                  <div className="relative h-[400px] lg:h-auto min-h-full">
                     {/* Shadows for text legibility */}
                     <div className="absolute inset-0 bg-gradient-to-r from-[#1a1d17] via-[#1a1d17]/50 to-transparent z-20 hidden lg:block"></div>
                     <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d17] via-[#1a1d17]/50 to-transparent z-20 lg:hidden"></div>

                     {/* Base Layer: Full Color Image */}
                     <img src="/images/Lincoln/Local/all.png" className="absolute inset-0 w-full h-full object-cover object-[30%_center] opacity-80 z-0" alt="The Elements Color" />

                     {/* Top Layer: Grayscale Image with a Gradient Mask (fades left to right) */}
                     <img src="/images/Lincoln/Local/all.png" className="absolute inset-0 w-full h-full object-cover object-[30%_center] grayscale opacity-90 z-10 mix-blend-luminosity" style={{ WebkitMaskImage: 'linear-gradient(to right, black 20%, transparent 80%)', maskImage: 'linear-gradient(to right, black 20%, transparent 80%)' }} alt="The Elements Grayscale" aria-hidden="true" />
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
}