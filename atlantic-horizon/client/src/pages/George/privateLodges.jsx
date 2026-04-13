import React from 'react';
import { COLORS } from '../../colors';

export default function PrivateLodges() {
  const deluxeImages = [
    '/images/RoomTypes/Superior(Entry(King Bed(Double)))/balcony.jpg',
    '/images/RoomTypes/Superior(Entry(King Bed(Double)))/view.png',
    '/images/RoomTypes/Superior(Entry(King Bed(Double)))/view2.webp',
    '/images/RoomTypes/Superior(Entry(King Bed(Double)))/bed.avif',
    '/images/RoomTypes/Superior(Entry(King Bed(Double)))/livingRoom.jpg',
    '/images/RoomTypes/Superior(Entry(King Bed(Double)))/bathroom.jpg',
    '/images/RoomTypes/Superior(Entry(King Bed(Double)))/VIEW4.jpg',
    '/images/RoomTypes/Superior(Entry(King Bed(Double)))/view5.jpg'
  ];

  return (
    <div className="bg-[#faf9f6] min-h-screen font-lato">
      {/* Effect 1: Parallax-style Hero */}
      <section className="relative h-screen w-full overflow-hidden">
        <img src={deluxeImages[0]} className="absolute inset-0 w-full h-full object-cover scale-110" alt="Hero" />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <span className="text-manorGold uppercase tracking-[0.8em] text-[10px] mb-6 animate-pulse font-bold">Nature's Own Sanctuary</span>
          <h1 className="font-cinzel text-6xl md:text-9xl text-white mb-8 tracking-tighter uppercase drop-shadow-2xl">Private Lodges</h1>
          <div className="h-px w-40 bg-manorGold/50 mb-10"></div>
          <p className="max-w-2xl text-white/90 font-georgia italic text-xl leading-relaxed">
            "Experience the raw beauty of the Atlantic from your private limestone sanctuary."
          </p>
        </div>
      </section>

      {/* SECTION 2: THE ARCHITECTURE */}
      <section className="max-w-7xl mx-auto px-6 py-40">
        <div className="grid lg:grid-cols-2 gap-24 items-center mb-40">
          <div className="space-y-10 group">
            <h2 className="font-cinzel text-5xl text-manorGreen">Built Into The Landscape</h2>
            <p className="text-sm text-gray-500 leading-loose">
              Our lodges are designed to be invisible from a distance, burrowed into the limestone cliffs. Every window is a frame, capturing the raw, unedited beauty of the Wild Atlantic weather.
            </p>
            {/* Effect 2: Image Hover Scale */}
            <div className="overflow-hidden rounded-sm shadow-2xl">
              <img src={deluxeImages[1]} className="w-full h-80 object-cover transition-transform duration-1000 group-hover:scale-110" alt="View 1" />
            </div>
          </div>
          <div className="relative">
            <img src={deluxeImages[2]} className="rounded-sm shadow-2xl w-full h-[600px] object-cover" alt="View 2" />
            <div className="absolute -bottom-10 -right-10 bg-manorGreen p-12 text-white hidden md:block shadow-2xl">
              <p className="font-cinzel text-3xl text-manorGold mb-2">100%</p>
              <p className="text-[10px] uppercase tracking-widest opacity-60">Sustainable Materials</p>
            </div>
          </div>
        </div>

        {/* Effect 3: Scrolling Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
          <div className="space-y-8">
            <img src={deluxeImages[3]} className="w-full h-[400px] object-cover rounded shadow-lg hover:shadow-2xl transition-all" alt="Bed" />
            <h4 className="font-cinzel text-lg">Serene Slumber</h4>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Hand-carved Irish Oak Furniture</p>
          </div>
          <div className="space-y-8 pt-20">
            <img src={deluxeImages[4]} className="w-full h-[400px] object-cover rounded shadow-lg hover:shadow-2xl transition-all" alt="Living" />
            <h4 className="font-cinzel text-lg">Fireside Evenings</h4>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Log-burning Stone Hearth</p>
          </div>
          <div className="space-y-8">
            <img src={deluxeImages[7]} className="w-full h-[400px] object-cover rounded shadow-lg hover:shadow-2xl transition-all" alt="Detail" />
            <h4 className="font-cinzel text-lg">Atlantic Tides</h4>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Panoramic Cliff-side Windows</p>
          </div>
        </div>

      </section>


        {/* SECTION 4: THE SPA EXPERIENCE */}
        <div className="bg-[#343a2f] text-white p-20 rounded-sm grid md:grid-cols-2 gap-20 items-center mb-40">
          <div className="grid grid-cols-2 gap-4">
             <img src={deluxeImages[5]} className="w-full h-64 object-cover rounded-sm transition-all duration-700" alt="Bath 1" />
             <img src={deluxeImages[6]} className="w-full h-64 object-cover rounded-sm transition-all duration-700" alt="Bath 2" />
          </div>
          <div className="space-y-8">
            <h3 className="font-cinzel text-3xl tracking-widest">Private Thermal Sanctuary</h3>
            <p className="text-sm opacity-60 leading-loose italic font-georgia">
              "Every lodge features an oversized soaking tub that faces the Atlantic, allowing you to witness the storm while cocooned in warmth."
            </p>
            <button className="border border-manorGold text-manorGold px-10 py-4 text-[10px] uppercase tracking-[0.3em] hover:bg-manorGold hover:text-white transition-all">Request In-Lodge Spa</button>
          </div>
        </div>
      </div>

  );
}