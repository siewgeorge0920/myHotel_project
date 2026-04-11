const features = [
  {
    title: "Luxury Accommodations",
    eyebrow: "Private Lodges & Estates",
    text: "Our elegantly appointed rooms and suites offer the perfect blend of comfort and sophistication. Each space is designed with your relaxation in mind, featuring premium amenities and breathtaking Atlantic views.",
    img: "/images/room1.jpg",
    reverse: false
  },
  {
    title: "Culinary Excellence",
    eyebrow: "Michelin-Inspired Dining",
    text: "Indulge in exceptional cuisine crafted by our award-winning chefs. From fine dining to coastal fare, our restaurants celebrate the rich flavors of Ireland's southwest — where land meets sea on every plate.",
    img: "/images/food.jpg",
    reverse: true
  }
];

export default function ExperienceSection() {
  return (
    <section className="py-24 px-6 md:px-[8%]" style={{ background: 'linear-gradient(180deg, #141610 0%, #1a1d17 50%, #0f1109 100%)' }}>

      {/* Section Header */}
      <div className="text-center mb-20">
        <p className="text-amber-500 uppercase tracking-[0.5em] text-[10px] font-black mb-4">The Manor Experience</p>
        <h2 className="font-cinzel text-3xl md:text-4xl text-white/90 uppercase tracking-widest mb-4">A World Apart</h2>
        <div className="flex items-center gap-4 justify-center">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-600/50" />
          <span className="text-amber-600/60 text-xs">✦</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-600/50" />
        </div>
      </div>

      <div className="flex flex-col gap-20 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <div key={i} className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 ${f.reverse ? 'md:flex-row-reverse' : ''}`}>

            {/* Image column */}
            <div className="flex-1 w-full relative group">
              {/* Gold corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-600/60 z-10 -translate-x-2 -translate-y-2" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-600/60 z-10 translate-x-2 translate-y-2" />
              <img
                src={f.img}
                alt={`${f.title} - Exclusive guest experience at The Atlantic Horizon Manor`}
                className="w-full h-[300px] md:h-[400px] object-cover block grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            </div>

            {/* Text column */}
            <div className="flex-1 text-white">
              <p className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-black mb-4">{f.eyebrow}</p>
              <h3 className="font-cinzel text-2xl md:text-3xl text-white/90 uppercase tracking-wider mb-6">{f.title}</h3>
              
              {/* Gold rule */}
              <div className="h-px w-16 bg-amber-600/60 mb-6" />
              
              <p className="text-white/50 text-base md:text-lg leading-relaxed font-light">{f.text}</p>
              
              <button className="mt-8 px-8 py-3 border border-amber-600/40 text-amber-500 text-[10px] uppercase tracking-[0.3em] font-black hover:bg-amber-600/10 hover:border-amber-500 transition-all">
                Explore More
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}