import React, { useEffect, useState } from "react";

const slides = [
  {
    src: "/images/main1.webp",
    title: "Celestial Serenity",
    subtitle: "Experience the pinnacle of Irish hospitality"
  },
  {
    src: "/images/main3.jpg",
    title: "Timeless Grandeur",
    subtitle: "A sanctuary where history meets modern luxury"
  },
  {
    src: "/images/room1.jpg",
    title: "Royal Retreatment",
    subtitle: "Bespoke suites designed for the discerning traveler"
  },
  {
    src: "/images/diningHall.jpg",
    title: "Epicurean Voyage",
    subtitle: "Michelin-inspired flavors in a grand setting"
  },
  {
    src: "/images/hot-spring.jpg",
    title: "Emerald Wellness",
    subtitle: "Rejuvenate in our exclusive thermal sanctuaries"
  }
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 8000); // Slower interval for cinematic feel
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[85vh] overflow-hidden bg-[#0c0e0a]">
      {/* Background Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Ken Burns Image */}
          <div
            className={`absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-linear ${
              i === index ? "scale-110" : "scale-100"
            }`}
            style={{ backgroundImage: `url(${slide.src})` }}
          />
          
          {/* Overlay Gradient for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e0a] via-transparent to-black/20" />
          
          {/* Content Overlay */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center text-center px-6 transition-all duration-[2000ms] delay-500 ${
            i === index ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}>
            <p className="text-amber-500 text-[10px] sm:text-xs uppercase tracking-[0.6em] font-black mb-4 drop-shadow-lg">
              The Atlantic Horizon Manor
            </p>
            <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl text-white/95 tracking-[0.1em] uppercase leading-tight mb-6 drop-shadow-2xl italic">
              {slide.title}
            </h1>
            <div className="w-24 h-px bg-amber-500/50 mb-6" />
            <p className="max-w-lg text-white/70 text-xs sm:text-sm uppercase tracking-[0.2em] font-light leading-relaxed drop-shadow-md">
              {slide.subtitle}
            </p>
          </div>
        </div>
      ))}

      {/* Navigation Indicators (Luxury Style) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-6 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="group relative py-4 px-2"
          >
            <div className={`h-[2px] transition-all duration-500 ${
              i === index ? "w-12 bg-amber-500" : "w-6 bg-white/20 group-hover:bg-white/40"
            }`} />
            <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-black transition-opacity duration-500 ${
              i === index ? "opacity-100 text-amber-500" : "opacity-0"
            }`}>
              0{i + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Side Decorative Vignette */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/40 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/40 to-transparent z-20 pointer-events-none" />
    </section>
  );
}