import React from 'react';
import HeroSlider from '../components/HeroSlider';
import QuickBook from '../components/QuickBook'; 
import Introduction from '../components/Introduction';
import ExperienceSection from '../components/ExperienceSection';
import Newsletter from '../components/Newsletter';

export default function Home() {
  return (
    <main id="top" className="relative bg-[#0d0f0b]">
      <HeroSlider />

      {/* Booking Bar 会根据 QuickBook 内部的 margin 自动定位 */}
      <QuickBook />

      <Introduction />
      <ExperienceSection />
      
      {/* 🌟 这里的 Staff Login Link 已经删掉，搬去 Footer 了 */}

      <Newsletter />
    </main>
  );
}