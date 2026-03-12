import { useEffect, useState } from "react";

// Array of hero background images (slides)
const images = [
  "/src/assets/images/main1.webp",
  "/src/assets/images/main3.jpg",
  "/src/assets/images/room1.jpg",
  "/src/assets/images/diningHall.jpg",
  "/src/assets/images/hot-spring.jpg"
];

export default function HeroSlider() {
  // Track current slide index
  const [index, setIndex] = useState(0);

  // Auto-slide effect (changes slide every 5 seconds)
  useEffect(() => {
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % images.length),
      5000
    );

    // Cleanup interval when component unmounts
    return () => clearInterval(timer);
  }, []);

  return (
    // Hero section container with responsive height and overflow hidden
    <section className="relative w-full h-[56.25vw] max-h-[80vh] overflow-hidden bg-black">
      
      {/* Slider track (horizontal flex container) */}
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{
          // Set total width based on number of slides
          width: `${images.length * 100}%`,
          // Translate to show the current slide
          transform: `translateX(-${index * (100 / images.length)}%)`
        }}
      >
        {images.map((src, i) => (
          // Individual slide
          <div
            key={i}
            className="w-full h-full bg-center bg-no-repeat bg-contain relative"
            style={{ backgroundImage: `url(${src})` }}
          >
            {/* Blurred background layer for cinematic effect */}
            <div
              className="absolute inset-0 bg-cover blur-2xl brightness-50 -z-10"
              style={{ backgroundImage: `url(${src})` }}
            ></div>
          </div>
        ))}
      </div>

      {/* Navigation dots (manual slide selection) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-white scale-125" : "bg-white/40"
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
}