import React from 'react';
import { COLORS } from '../../colors';

export default function PrivateResidences() {
  const clubImgs = [
    '/src/assets/images/RoomTypes/premium/livingRoom.jpg',
    '/src/assets/images/RoomTypes/premium/view.webp',
    '/src/assets/images/RoomTypes/premium/view2.jfif',
    '/src/assets/images/RoomTypes/premium/view3.webp',
    '/src/assets/images/RoomTypes/premium/view4.avif',
    '/src/assets/images/RoomTypes/premium/balcony.avif',
    '/src/assets/images/RoomTypes/premium/view.webp',
    '/src/assets/images/RoomTypes/premium/bathtub.jpg',
    '/src/assets/images/RoomTypes/premium/bed.jpg'
  ];

  return (
    <div className="bg-[#1a1d17] text-white min-h-screen">
      {/* SECTION 1: SPLIT HERO */}
      <section className="relative h-screen flex flex-col md:flex-row">
        <div className="flex-1 relative overflow-hidden group">
          <img src={clubImgs[0]} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-110" alt="Living" />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute bottom-10 left-10 z-10">
            <h1 className="font-cinzel text-6xl tracking-tighter mb-4">THE RESIDENCES</h1>
            <p className="text-manorGold uppercase tracking-[0.4em] text-xs">Palatial Grandeur</p>
          </div>
        </div>
        <div className="flex-1 relative overflow-hidden group">
          <img src={clubImgs[1]} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-110" alt="Aerial" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-40">
        {/* SECTION 2: THE SCALE */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-32 border-b border-white/10 pb-20">
          <div className="max-w-xl">
             <h2 className="font-cinzel text-5xl mb-6">Designed For Legacies</h2>
             <p className="text-sm opacity-50 leading-loose italic font-georgia">"A space where multi-generational families find home, and heads of state find peace."</p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-right">
             <div>
                <p className="font-cinzel text-2xl text-manorGold italic">850m²</p>
                <p className="text-[9px] uppercase tracking-widest opacity-40">Average Plot Size</p>
             </div>
             <div>
                <p className="font-cinzel text-2xl text-manorGold italic">24/7</p>
                <p className="text-[9px] uppercase tracking-widest opacity-40">Butler Attention</p>
             </div>
          </div>
        </div>

        {/* SECTION 3: MASONRY GALLERY (Effect: Floating Grid) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-40">
          <img src={clubImgs[2]} className="w-full h-[600px] object-cover rounded col-span-2 row-span-2 shadow-2xl" alt="View 1" />
          <img src={clubImgs[3]} className="w-full h-[300px] object-cover rounded shadow-lg" alt="View 2" />
          <img src={clubImgs[4]} className="w-full h-[300px] object-cover rounded shadow-lg" alt="View 3" />
          <img src={clubImgs[5]} className="w-full h-[300px] object-cover rounded shadow-lg" alt="View 4" />
          <img src={clubImgs[6]} className="w-full h-[300px] object-cover rounded shadow-lg" alt="View 5" />
        </div>

        {/* SECTION 4: THE MASTER SUITE */}
        <div className="grid lg:grid-cols-2 gap-24 items-center mb-40">
          <div className="space-y-10">
            <h3 className="font-cinzel text-4xl">Royal Restorative Suites</h3>
            <p className="text-sm opacity-60 leading-loose">
              Every villa features at least three master suites with walk-in dressing rooms, private balconies, and marble-clad bathrooms. We stock your private larder with the finest Irish delicacies before your arrival.
            </p>
            <div className="flex gap-4">
              <img src={clubImgs[8]} className="w-1/2 rounded shadow-2xl" alt="Bed" />
              <img src={clubImgs[7]} className="w-1/2 rounded shadow-2xl" alt="Bath" />
            </div>
          </div>
          <div className="bg-white/5 p-16 border border-white/10 rounded">
             <h4 className="font-cinzel text-xl mb-6 text-manorGold">The Butler Protocol</h4>
             <ul className="space-y-6">
                {[
                  "In-Villa Check-in & Orientation",
                  "24/7 Dedicated Butler Service",
                  "Private Chef for In-Villa Dining",
                  "Secured & Anonymous Access Paths"
                ].map(item => (
                  <li key={item} className="flex gap-4 items-center text-[11px] uppercase tracking-widest border-b border-white/5 pb-4 opacity-70">
                    <span className="text-manorGold">✦</span> {item}
                  </li>
                ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}