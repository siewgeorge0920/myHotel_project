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

      {/* Booking bar is positioned automatically by QuickBook's internal margin settings */}
      <QuickBook />

      <Introduction />
      <ExperienceSection />
      
      {/* The Staff Login link was removed here and moved to the Footer */}

      <Newsletter />
    </main>
  );
}