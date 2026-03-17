import React from 'react';
import { COLORS } from '../../colors';

export default function ContinentalBreakfast() {
  return (
    <div className="pt-40 pb-20 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="flex-1">
            <img src="/src/assets/images/food.jpg" className="w-full h-[600px] object-cover shadow-2xl" alt="Breakfast" />
          </div>
          <div className="flex-1 space-y-8 flex flex-col justify-center">
            <span style={{ color: COLORS.amber }} className="uppercase tracking-[0.5em] text-[11px] font-black">Sunrise Gastronomy</span>
            <h1 className="font-cinzel text-5xl text-[#343a2f]">Continental Breakfast</h1>
            <p className="text-sm text-gray-500 leading-loose italic">
              Lincoln's morning selection features sourdough baked at dawn, house-churned butter, and organic honeycomb from our very own estate beehives. 
              Served in your sanctuary or the garden terrace.
            </p>
            <div className="border-t border-gray-100 pt-6">
              <p className="text-[10px] uppercase font-bold tracking-widest text-amber-700">Complimentary for All Manor Guests</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}