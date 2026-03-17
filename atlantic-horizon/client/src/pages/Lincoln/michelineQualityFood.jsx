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
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-[#1a1d17]"></div>
        <div className="relative z-10 h-full flex flex-col justify-end pb-32 px-12 max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-6">
            <div className="h-[1px] w-12 bg-amber-500"></div>
            <span className="text-amber-500 uppercase tracking-[0.5em] text-xs font-black">The Gastronomy Collection</span>
          </div>
          <h1 className="font-cinzel text-5xl md:text-7xl lg:text-9xl tracking-tighter uppercase leading-[1.1] md:leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white via-white/80 to-amber-500/50 drop-shadow-2xl">Michelin<br />Excellence</h1>
        </div>
      </section>

      {/* SECTION 2: THE CELESTIAL TABLE */}
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-40">
        {/* SECTION 2: THE CELESTIAL TABLE (Editorial Layout) */}
        <div className="flex flex-col lg:flex-row gap-20 relative mb-48">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>

          {/* Sticky Text Column */}
          <div className="lg:w-5/12 relative z-10 lg:sticky lg:top-40 h-fit space-y-12">
            <div className="flex items-center gap-6 mb-8">
              <span className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-bold">Chapter I</span>
              <div className="h-[1px] w-24 bg-amber-500/30"></div>
            </div>

            <h2 className="font-cinzel text-4xl md:text-5xl lg:text-7xl text-white/95 leading-[1.1] tracking-wide">The<br /><span className="text-amber-500 italic font-georgia text-3xl md:text-4xl lg:text-6xl pl-12 -mt-4 block drop-shadow-xl">Celestial Table</span></h2>

            <p className="font-georgia italic text-xl text-white/70 leading-[2] pl-6 border-l pointer-events-none border-amber-500/30">
              "A symphony of Atlantic flavors, where every dish tells the story of the turbulent yet bountiful Irish coastline."
            </p>

            <p className="text-sm text-gray-400 leading-[2.2] font-light">
              Our 2-Michelin-starred restaurant offers a highly curated 12-course tasting journey. Our executive chefs forage daily for wild sea herbs at dawn, collaborating closely with local deep-sea divers to bring the absolute finest, undiscovered catches to your plate.
            </p>

            <div className="pt-8">
              <button className="relative group overflow-hidden flex items-center justify-center border border-amber-600/40 px-14 py-5 text-amber-50 text-[10px] uppercase font-black tracking-[0.3em] transition-all duration-700 bg-transparent hover:border-amber-400 w-max">
                <span className="relative z-10 group-hover:text-black transition-colors duration-500">Request a Table</span>
                <div className="absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-amber-400 to-amber-500 group-hover:h-full transition-all duration-500 ease-in-out"></div>
              </button>
            </div>
          </div>

          {/* Scrolling Image Column */}
          <div className="lg:w-7/12 relative group p-1">
            <div className="absolute inset-0 bg-amber-500/5 blur-2xl group-hover:bg-amber-500/15 transition-all duration-1000"></div>
            <div className="relative overflow-hidden group border border-white/5">
              <img src="/src/assets/images/diningHall.jpg" className="w-full h-80 md:h-[750px] object-cover filter brightness-[0.85] contrast-[1.1] group-hover:brightness-100 group-hover:scale-105 transition-all duration-[2000ms] ease-out" alt="Dining Experience" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-1000"></div>
            </div>
            {/* Decorative floating elements */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 border border-amber-500/10 rounded-full animate-[spin_10s_linear_infinite] pointer-events-none"></div>
            <div className="absolute -top-12 -right-6 text-9xl text-white/5 font-cinzel italic pointer-events-none select-none">M</div>
          </div>
        </div>

        {/* SECTION 3: CONTINENTAL BREAKFAST (Menu Layout) */}
        <div className="mt-32 md:mt-64 flex justify-center w-full mb-32">
          <div className="relative w-full max-w-5xl bg-[#1e221a] p-8 md:p-16 lg:p-24 shadow-2xl overflow-hidden group">
            {/* Elegant borders */}
            <div className="absolute inset-4 border border-x-[0.5px] border-y-[0.5px] border-amber-500/20 pointer-events-none transition-all duration-1000 group-hover:border-amber-500/40"></div>
            <div className="absolute inset-6 border-[0.5px] border-amber-500/10 pointer-events-none"></div>

            <div className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen opacity-50"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <img src="/src/assets/images/food.jpg" alt="Breakfast" className="w-24 h-24 rounded-full object-cover mb-12 border border-amber-500/30 grayscale hover:grayscale-0 transition-all duration-1000 shadow-[0_0_30px_rgba(217,119,6,0.1)]" />

              <h3 className="font-cinzel text-4xl md:text-5xl lg:text-6xl mb-6 text-white/95 leading-tight tracking-wider">Mornings at<br /><span className="italic text-amber-500 font-georgia text-3xl md:text-4xl block mt-2">The Manor</span></h3>

              <div className="flex items-center gap-4 mb-10 w-full justify-center opacity-70">
                <div className="h-[1px] w-12 bg-amber-500 flex-shrink-0"></div>
                <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-amber-500 font-bold whitespace-nowrap">Continental In-Room Service</p>
                <div className="h-[1px] w-12 bg-amber-500 flex-shrink-0"></div>
              </div>

              <p className="text-sm md:text-base text-gray-400/90 leading-[2.2] max-w-2xl mb-16 font-light">
                Wake up to the scent of freshly baked sourdough and house-churned Irish butter. Our signature Continental Breakfast is meticulously served on vintage silver trays, featuring organic honeycomb from our estate beehives and hand-pressed Atlantic apple juice.
              </p>

              {/* Menu Items */}
              <div className="w-full flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-24 gap-y-12 text-xs uppercase tracking-[0.3em] text-white/60">
                  <div className="flex flex-col items-center gap-3 relative group/item cursor-default">
                    <span className="text-amber-500/80 group-hover/item:text-amber-400 group-hover/item:-translate-y-1 transition-all duration-300">✦</span>
                    <span className="group-hover/item:text-white transition-colors duration-500">Artisanal Pastries</span>
                  </div>
                  <div className="flex flex-col items-center gap-3 relative group/item cursor-default">
                    <span className="text-amber-500/80 group-hover/item:text-amber-400 group-hover/item:-translate-y-1 transition-all duration-300">✦</span>
                    <span className="group-hover/item:text-white transition-colors duration-500">Rare Irish Cheeses</span>
                  </div>
                  <div className="flex flex-col items-center gap-3 relative group/item cursor-default">
                    <span className="text-amber-500/80 group-hover/item:text-amber-400 group-hover/item:-translate-y-1 transition-all duration-300">✦</span>
                    <span className="group-hover/item:text-white transition-colors duration-500">Oak-Smoked Salmon</span>
                  </div>
                  <div className="flex flex-col items-center gap-3 relative group/item cursor-default">
                    <span className="text-amber-500/80 group-hover/item:text-amber-400 group-hover/item:-translate-y-1 transition-all duration-300">✦</span>
                    <span className="group-hover/item:text-white transition-colors duration-500">Single-Origin Coffee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: GALLERY (Cinematic Asymmetry) */}
        <div className="mt-32 md:mt-48 relative pb-32">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-amber-900/10 rounded-full blur-[200px] pointer-events-none mix-blend-screen opacity-70"></div>

          <div className="flex flex-col md:flex-row justify-between items-end mb-24 relative z-10">
            <div>
              <div className="flex items-center gap-6 mb-6">
                <span className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-bold">The Visual Palate</span>
                <div className="h-[1px] w-24 bg-amber-500/30"></div>
              </div>
              <h2 className="font-cinzel text-4xl md:text-5xl lg:text-7xl text-white/95 leading-[1.1] tracking-wide">Culinary<br /><span className="text-amber-500 italic font-georgia whitespace-normal md:whitespace-nowrap md:text-6xl lg:pl-12 -mt-2 block drop-shadow-lg">Masterpieces</span></h2>
            </div>
            <p className="text-sm opacity-60 font-light max-w-sm leading-[2.2] md:text-right hidden md:block mt-8 md:mt-0 md:-translate-x-[200px]">
              A curated visual journey through our gastronomy, where Michelin-grade precision meets high art on every plate.
            </p>
          </div>

          {/* Asymmetrical Masonry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 w-full mx-auto">

            <div className="md:col-span-8 relative group overflow-hidden h-80 md:h-[650px] bg-[#1a1d17] cursor-pointer">
              <img src="/src/assets/images/Lincoln/Michelin/Salmon.jpg" alt="Atlantic Harvest" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[3000ms] brightness-[0.85] group-hover:brightness-100 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute bottom-0 left-0 p-8 md:p-12 translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                <p className="text-amber-500 text-[10px] uppercase tracking-[0.4em] font-bold mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">Atlantic Harvest</p>
                <h4 className="font-cinzel text-3xl md:text-4xl text-white opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">Wild Seabass Emulsion</h4>
              </div>
              <div className="absolute inset-x-8 md:inset-x-12 bottom-0 h-[1px] bg-gradient-to-r from-amber-500/50 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-[1000ms] delay-300"></div>
            </div>

            <div className="md:col-span-4 relative group overflow-hidden h-80 md:h-[650px] bg-[#1a1d17] cursor-pointer">
              <img src="/src/assets/images/Lincoln/Michelin/Steak.webp" alt="Estate Garden" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[3000ms] brightness-[0.85] group-hover:brightness-100 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute bottom-0 left-0 p-8 md:p-12 translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                <p className="text-amber-500 text-[10px] uppercase tracking-[0.4em] font-bold mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">Estate Garden</p>
                <h4 className="font-cinzel text-2xl text-white opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">Foraged Roots</h4>
              </div>
              <div className="absolute inset-x-8 md:inset-x-12 bottom-0 h-[1px] bg-gradient-to-r from-amber-500/50 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-[1000ms] delay-300"></div>
            </div>

            <div className="md:col-span-4 relative group overflow-hidden h-80 md:h-[500px] bg-[#1a1d17] cursor-pointer md:mt-8 z-20 shadow-2xl">
              <img src="/src/assets/images/Lincoln/Michelin/Wagyu.webp" alt="Signature wagyu" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[3000ms] brightness-[0.85] group-hover:brightness-100 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute bottom-0 left-0 p-8 md:p-10 translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                <p className="text-amber-500 text-[10px] uppercase tracking-[0.4em] font-bold mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">Signature</p>
                <h4 className="font-cinzel text-2xl text-white opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">Wagyu & Truffle</h4>
              </div>
              <div className="absolute inset-x-8 md:inset-x-10 bottom-0 h-[1px] bg-gradient-to-r from-amber-500/50 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-[1000ms] delay-300"></div>
            </div>

            <div className="md:col-span-8 relative group overflow-hidden h-64 md:h-[500px] bg-[#1a1d17] cursor-pointer md:mt-8">
              <img src="/src/assets/images/Lincoln/Michelin/Dessert.webp" alt="Sweet Finale" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[3000ms] brightness-[0.85] group-hover:brightness-100 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute bottom-0 left-0 p-8 md:p-12 translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                <p className="text-amber-500 text-[10px] uppercase tracking-[0.4em] font-bold mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">Sweet Finale</p>
                <h4 className="font-cinzel text-3xl md:text-4xl text-white opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">Dark Chocolate Sphere</h4>
              </div>
              <div className="absolute inset-x-8 md:inset-x-12 bottom-0 h-[1px] bg-gradient-to-r from-amber-500/50 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-[1000ms] delay-300"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}