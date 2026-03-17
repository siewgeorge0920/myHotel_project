import React from 'react';
import { COLORS } from '../../colors';

export default function HoneymoonPackage() {
  return (
    <div className="pt-40 pb-20 bg-[#faf9f6] min-h-screen relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="font-cinzel text-6xl text-[#343a2f] mb-8 uppercase tracking-tighter">Eternal Romance</h1>
        <p className="font-georgia italic text-xl text-gray-500 mb-12">"Celebrate your union where the cliffs meet the sky."</p>
        <img src="/src/assets/images/main1.webp" className="w-full h-[500px] object-cover rounded shadow-2xl mb-12" alt="Honeymoon" />
        <div className="bg-white p-12 shadow-lg border-t-4 border-amber-600">
          <h2 className="font-cinzel text-2xl mb-6 tracking-widest uppercase">The Inclusion List</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left text-sm text-gray-500">
            <p>✦ Rose petal turn-down service</p>
            <p>✦ Private midnight garden picnic</p>
            <p>✦ Complimentary champagne upon arrival</p>
            <p>✦ Couple's spa session by Derrick's team</p>
          </div>
        </div>
      </div>
    </div>
  );
}