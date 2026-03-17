import React from 'react';
import { COLORS } from '../../colors';

export default function ContinentalBreakfast() {
  return (
    <div className="bg-[#faf9f6] min-h-screen text-[#343a2f] font-lato selection:bg-amber-900/20 selection:text-amber-900">

      {/* 🎬 HERO SECTION */}
      <section className="relative h-[85vh] w-full overflow-hidden flex items-end pb-32 pt-40 px-6 md:px-16 lg:px-24">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#e5e1d5]/40 to-transparent"></div>
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-amber-900/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
          <div className="flex justify-center items-center gap-6 mb-10 w-full">
            <div className="h-[1px] w-12 md:w-24 bg-amber-800/40"></div>
            <span className="text-amber-800 uppercase tracking-[0.5em] text-[10px] md:text-xs font-black">Sunrise Gastronomy</span>
            <div className="h-[1px] w-12 md:w-24 bg-amber-800/40"></div>
          </div>

          <h1 className="font-cinzel text-5xl md:text-8xl lg:text-[110px] tracking-tighter uppercase leading-[1.1] md:leading-[0.9] text-[#242820] mb-8 drop-shadow-sm">
            Morning<br /><span className="italic font-georgia text-[#343a2f] md:pr-12">Awakening</span>
          </h1>

          <p className="text-base md:text-lg text-[#5a6254] max-w-2xl leading-loose font-light border-l border-amber-800/20 pl-6 text-left mx-auto">
            Lincoln's morning selection features sourdough baked at dawn, house-churned butter, and organic honeycomb from our very own estate beehives. Served exclusively in your sanctuary or the sun-drenched garden terrace.
          </p>
        </div>
      </section>

      {/* 🖼 THE BREAKFAST COLLECTION (Staggered Sticky Layout) */}
      <section className="py-32 px-6 md:px-16 lg:px-24 relative bg-white">
        <div className="max-w-7xl mx-auto">

          <div className="mb-32 text-center md:text-left flex flex-col md:flex-row justify-between items-end border-b border-[#e5e1d5] pb-12">
            <div>
              <h2 className="font-cinzel text-4xl md:text-6xl text-[#242820] leading-tight">The Artisan<br /><span className="text-amber-800 italic font-georgia drop-shadow-sm ml-8">Selection</span></h2>
            </div>
            <p className="text-sm font-light uppercase tracking-[0.3em] text-[#5a6254] mt-8 md:mt-0">Complimentary for All Manor Guests</p>
          </div>

          <div className="space-y-32 md:space-y-48">

            {/* Item 1: Eggs Benedict */}
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-center group">
              <div className="lg:w-1/2 order-2 lg:order-1 relative h-full">
                <div className="sticky top-40 space-y-8">
                  <div className="flex items-center gap-4 text-amber-800 font-bold tracking-[0.3em] text-[10px] uppercase">
                    <span>No. 01</span>
                    <div className="h-[1px] w-12 bg-amber-800/30"></div>
                  </div>
                  <h3 className="font-cinzel text-4xl md:text-5xl text-[#242820]">Truffle Eggs<br />Benedict</h3>
                  <p className="text-base font-light leading-[2.2] text-[#5a6254]">
                    Two perfectly poached estate eggs resting on lightly toasted artisanal English muffins, generously draped in our signature rich Hollandaise sauce and delicately finished with shaved black summer truffles.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2 order-1 lg:order-2">
                <div className="relative overflow-hidden h-80 md:h-[500px] lg:h-[700px] w-full bg-[#f4f2eb] drop-shadow-2xl">
                  <img src="/src/assets/images/Lincoln/Breakfast/eggs_benedict.jpg" alt="Eggs Benedict" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms] ease-out brightness-[0.95]" />
                  <div className="absolute inset-x-8 bottom-8 h-[1px] bg-white/50"></div>
                  <div className="absolute inset-y-8 left-8 w-[1px] bg-white/50"></div>
                </div>
              </div>
            </div>

            {/* Item 2: Charcuterie */}
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-center group">
              <div className="lg:w-1/2">
                <div className="relative overflow-hidden h-80 md:h-[500px] lg:h-[700px] w-full bg-[#f4f2eb] drop-shadow-2xl">
                  <img src="/src/assets/images/Lincoln/Breakfast/Charcuterie.jpg" alt="Charcuterie Board" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms] ease-out brightness-[0.95]" />
                  <div className="absolute inset-x-8 bottom-8 h-[1px] bg-white/50"></div>
                  <div className="absolute inset-y-8 right-8 w-[1px] bg-white/50"></div>
                </div>
              </div>
              <div className="lg:w-1/2 relative h-full">
                <div className="sticky top-40 space-y-8">
                  <div className="flex items-center gap-4 text-amber-800 font-bold tracking-[0.3em] text-[10px] uppercase">
                    <span>No. 02</span>
                    <div className="h-[1px] w-12 bg-amber-800/30"></div>
                  </div>
                  <h3 className="font-cinzel text-4xl md:text-5xl text-[#242820]">Continental<br />Charcuterie</h3>
                  <p className="text-base font-light leading-[2.2] text-[#5a6254]">
                    An exquisite curation of rare European cured meats, imported triple-crème cheeses, fresh seasonal figs, and crystallized organic honey perfectly arranged for a decadent morning grazing experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Item 3: Coffee */}
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-center group">
              <div className="lg:w-1/2 order-2 lg:order-1 relative h-full">
                <div className="sticky top-40 space-y-8">
                  <div className="flex items-center gap-4 text-amber-800 font-bold tracking-[0.3em] text-[10px] uppercase">
                    <span>No. 03</span>
                    <div className="h-[1px] w-12 bg-amber-800/30"></div>
                  </div>
                  <h3 className="font-cinzel text-4xl md:text-5xl text-[#242820]">Barista<br />Signatures</h3>
                  <p className="text-base font-light leading-[2.2] text-[#5a6254]">
                    Wake up to perfection with our single-origin Ethiopian and Colombian roasts. Crafted by our master barista using artisanal blooming techniques and adorned with intricate latte art.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2 order-1 lg:order-2">
                <div className="relative overflow-hidden h-80 md:h-[500px] lg:h-[700px] w-full bg-[#f4f2eb] drop-shadow-2xl">
                  <img src="/src/assets/images/Lincoln/Breakfast/barista_coffee.png" alt="Barista Coffee" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms] ease-out brightness-[0.95]" />
                  <div className="absolute inset-x-8 top-8 h-[1px] bg-white/50"></div>
                  <div className="absolute inset-y-8 left-8 w-[1px] bg-white/50"></div>
                </div>
              </div>
            </div>

            {/* Item 4: Wood Board */}
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-center group">
              <div className="lg:w-1/2">
                <div className="relative overflow-hidden h-80 md:h-[500px] lg:h-[700px] w-full bg-[#f4f2eb] drop-shadow-2xl">
                  <img src="/src/assets/images/Lincoln/Breakfast/20210716-americaniconswoodbackgroundsquare1WEBSIZE_580x_1.jpg" alt="American Icons" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms] ease-out brightness-[0.95]" />
                  <div className="absolute inset-x-8 top-8 h-[1px] bg-white/50"></div>
                  <div className="absolute inset-y-8 right-8 w-[1px] bg-white/50"></div>
                </div>
              </div>
              <div className="lg:w-1/2 relative h-full">
                <div className="sticky top-40 space-y-8 border-l border-[#e5e1d5] pl-10 md:pl-16">
                  <div className="flex items-center gap-4 text-amber-800 font-bold tracking-[0.3em] text-[10px] uppercase">
                    <span>No. 04</span>
                    <div className="h-[1px] w-12 bg-amber-800/30"></div>
                  </div>
                  <h3 className="font-cinzel text-4xl md:text-5xl text-[#242820]">The Manor's<br />Harvest</h3>
                  <p className="text-base font-light leading-[2.2] text-[#5a6254]">
                    A robust offering showcasing the absolute best of local produce. Featuring thick-cut bacon, roasted heirloom tomatoes, and freshly baked rustic breads presented beautifully on charred oak boards.
                  </p>
                  <div className="pt-8">
                    <button className="relative overflow-hidden group/btn border border-amber-900/30 px-12 py-4 text-[#343a2f] text-xs uppercase font-black tracking-[0.2em] transition-all hover:border-amber-900">
                      <span className="relative z-10 group-hover/btn:text-white transition-colors duration-500">Order to Suite</span>
                      <div className="absolute inset-0 h-full w-0 bg-amber-900 group-hover/btn:w-full transition-all duration-500 ease-out"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}