// src/pages/Home.jsx
import React from 'react';

// Import the components that make up your homepage
import HeroSlider from '../components/HeroSlider';
import Introduction from '../components/Introduction';
import ExperienceSection from '../components/ExperienceSection';
import Newsletter from '../components/Newsletter';

export default function Home() {
  return (
    <main id="top">
      {/* These will stack exactly as they did before */}
      <HeroSlider />
      <Introduction />
      <ExperienceSection />
      <Newsletter />
    </main>
  );
}