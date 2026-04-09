import { useEffect, useState } from "react";

const images = [
  "/images/main1.webp",
  "/images/main3.jpg",
  "/images/room1.jpg",
  "/images/diningHall.jpg",
  "/images/hot-spring.jpg"
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000); // 6 seconds for a slow, luxurious pace
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[65vh] md:h-[85vh] overflow-hidden bg-[#0a0a09]">
      {images.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
        >
          {/* Background image with Ken Burns slow zoom effect */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${src})`,
              transform: i === index ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 10s ease-out'
            }}
          />
        </div>
      ))}

      {/* Cinematic Vignette Overlay (darkens edges so text pops) */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#0a0a09] via-transparent to-black/50" />
      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />

      {/* Elegant Line Indicators */}
      <div className="absolute bottom-20 md:bottom-28 left-1/2 -translate-x-1/2 flex gap-3 md:gap-4 z-30">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`transition-all duration-700 rounded-full h-[2px] ${i === index
                ? "w-8 md:w-12 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
                : "w-3 md:w-4 bg-white/40 hover:bg-white/70 hover:w-6"
              }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Subtle gold separator at the very bottom */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent z-30" />
    </section>
  );
}