import React from 'react';
import { COLORS } from '../../colors';

export default function UltimateExclusivity() {
  const superiorImgs = [
    '/images/RoomTypes/ultimate/view.avif',
    '/images/RoomTypes/ultimate/view2.jpg',
    '/images/RoomTypes/ultimate/view3.jpg',
    '/images/RoomTypes/ultimate/bed.avif',
    '/images/RoomTypes/ultimate/view4.jpg',
    '/images/RoomTypes/ultimate/view5.jpg',
    '/images/RoomTypes/ultimate/bathroom.jpg',
    '/images/RoomTypes/ultimate/livingRoom.jpg',
    '/images/RoomTypes/ultimate/view6.avif'
  ];

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      {/* SECTION 1: MINIMALIST VIDEO HERO */}
      <section className="relative h-[80vh] bg-manorGreen flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        <img src={superiorImgs[0]} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Exclusivity Hero" />
        <div className="relative z-10 space-y-8">
          <h1 className="font-cinzel text-6xl md:text-8xl text-white tracking-[0.3em] uppercase">BEYOND<br/>EXPERIENCE</h1>
          <div className="h-px w-32 bg-manorGold mx-auto mt-10"></div>
          <p className="text-white/40 uppercase tracking-[0.5em] text-[10px]">Membership & Discretion</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-40">
        {/* SECTION 2: THE DETAIL GALLERY (Effect: Zig-Zag Layout) */}
        <div className="space-y-40">
           {/* Row 1 */}
           <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8 order-2 lg:order-1">
                 <h2 className="font-cinzel text-5xl text-manorGreen">Uncompromising Standards</h2>
                 <p className="text-sm text-gray-500 leading-loose">Even our base-tier experiences are defined by the exceptional. We provide private helipad access and secure gated entry for all guests who value absolute anonymity.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 order-1 lg:order-2">
                 <img src={superiorImgs[1]} className="w-full h-80 object-cover rounded shadow-xl" alt="View 1" />
                 <img src={superiorImgs[2]} className="w-full h-80 object-cover rounded shadow-xl mt-12" alt="View 2" />
              </div>
           </div>

           {/* Row 2 (Centered Content) */}
           <div className="bg-white p-20 shadow-2xl rounded-sm text-center space-y-12">
              <h3 className="font-cinzel text-3xl tracking-widest text-manorGreen">THE REFINEMENT SUITE</h3>
              <div className="grid md:grid-cols-3 gap-6">
                 <img src={superiorImgs[3]} className="w-full h-64 object-cover rounded transition-all duration-700 shadow-md" alt="Bed" />
                 <img src={superiorImgs[8]} className="w-full h-64 object-cover rounded transition-all duration-700 shadow-md" alt="Living" />
                 <img src={superiorImgs[6]} className="w-full h-64 object-cover rounded transition-all duration-700 shadow-md" alt="Bath" />
              </div>
              <p className="max-w-2xl mx-auto text-xs opacity-50 uppercase tracking-widest italic">"Every detail curated by the Manor Shadow Team – for those whose lives require absolute precision."</p>
           </div>

           {/* Row 3 */}
           <div className="grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8 flex gap-4">
                 <img src={superiorImgs[4]} className="w-1/2 h-96 object-cover rounded shadow-xl" alt="Detail 1" />
                 <img src={superiorImgs[5]} className="w-1/2 h-96 object-cover rounded shadow-xl mt-10" alt="Detail 2" />
              </div>
              <div className="lg:col-span-4 space-y-8">
                 <h4 className="font-cinzel text-2xl uppercase tracking-widest border-b border-gray-100 pb-4">The Private Balcony</h4>
                 <p className="text-sm text-gray-400 italic font-georgia leading-loose">"Dine overlooking the rugged horizon as the first light hits the manor grounds."</p>
                 <img src={superiorImgs[7]} className="w-full h-48 object-cover rounded shadow-lg" alt="Balcony" />
              </div>
           </div>
        </div>
      </div>

      {/* FOOTER CTA */}
      <section className="bg-manorGreen text-white py-40 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto px-6">
           <h3 className="font-cinzel text-4xl mb-12 tracking-widest">DISCRETION IS OUR CURRENCY</h3>
           <p className="text-xs opacity-40 uppercase tracking-[0.3em] mb-12 leading-loose">Connect with our Estates Director for a private consultation regarding extended stays or corporate retreats.</p>
           <button style={{ backgroundColor: COLORS.amber }} className="px-20 py-5 text-white text-[11px] uppercase tracking-[0.5em] font-black shadow-2xl hover:scale-110 transition-all">Connect Privately</button>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/images/Logo.png')] bg-no-repeat bg-center bg-contain"></div>
      </section>
    </div>
  );
}