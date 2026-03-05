// src/pages/clientFeatures/ExperiencesAndDining/michelinQualityFood.jsx
import React from 'react';

export default function MichelineQualityFood() {
  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-cover bg-center flex items-center justify-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070')"}}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative text-center text-white">
          <p className="uppercase tracking-[0.3em] text-amber-400 text-sm mb-2">Exquisite Dining</p>
          <h1 className="text-5xl md:text-7xl font-serif">Michelin Quality Experience</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto py-20 px-6 text-center">
        <h2 className="text-3xl font-serif text-gray-900 mb-6 italic">"A journey through taste and tradition."</h2>
        <div className="w-20 h-1 bg-amber-600 mx-auto mb-10"></div>
        <p className="text-gray-600 leading-relaxed text-lg">
          Our world-renowned chefs curate seasonal menus using the finest local Irish ingredients. 
          Each dish is a masterpiece, designed to tantalize your senses and provide an unforgettable gastronomic journey.
        </p>
        
        {/* Menu Preview Button */}
        <button className="mt-12 border-2 border-[#343a2f] text-[#343a2f] px-10 py-4 uppercase tracking-widest text-sm hover:bg-[#343a2f] hover:text-white transition-all">
          View Seasonal Menu
        </button>
      </div>
    </div>
  );
}