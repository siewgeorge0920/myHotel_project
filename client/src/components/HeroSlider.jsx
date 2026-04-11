import { useEffect, useState } from "react";

// 🌟 Cinematic Slides with Luxury Captions
const SLIDES = [
  {
    src: "/images/main1.webp",
    subtitle: "Heritage Meets Horizon",
    title: "Timeless Royalty"
  },
  {
    src: "/images/main3.jpg",
    subtitle: "Coastal Sanctuary",
    title: "Ocean Whisper Suites"
  },
  {
    src: "/images/room1.jpg",
    subtitle: "Royal comfort",
    title: "Gilded Master Suites"
  },
  {
    src: "/images/diningHall.jpg",
    subtitle: "Culinary Heritage",
    title: "Michelin Coastal Dining"
  },
  {
    src: "/images/hot-spring.jpg",
    subtitle: "Sanctuary for the Soul",
    title: "Award-Winning Wellness"
  }
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % SLIDES.length),
      7000 // Extended to 7s for Ken Burns cinematic effect
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden bg-[#0d0f0b]">
      
      {/* 🎬 Cinematic Keyframes */}
      <style>{`
        @keyframes kenBurns {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .slide-fade-enter { opacity: 0; }
        .slide-fade-active { opacity: 1; }
      `}</style>
      
      {/* Slider Container */}
      <div className="relative w-full h-full">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image with Ken Burns Effect */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[7000ms] linear"
              style={{ 
                backgroundImage: `url(${slide.src})`,
                animation: i === index ? 'kenBurns 8000ms infinite alternate ease-in-out' : 'none'
              }}
            >
              {/* Dark Cinematic Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60" />
              <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40" />
            </div>

            {/* 🌟 LCP Optimization for first slide */}
            {i === 0 && (
              <img 
                src={slide.src} 
                alt="Manor Hero" 
                width="1920"
                height="1080"
                className="hidden" 
                fetchpriority="high" 
              />
            )}

          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-6 z-30">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="group relative flex items-center justify-center p-2"
          >
            <div 
              className={`h-0.5 transition-all duration-500 rounded-full ${
                i === index ? "w-12 bg-amber-500" : "w-6 bg-white/30 group-hover:bg-white/60"
              }`} 
            />
          </button>
        ))}
      </div>
    </section>
  );
}