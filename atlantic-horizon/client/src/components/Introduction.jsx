import logo from "/images/Logo.png";

export default function Introduction() {
  return (
    <section className="relative overflow-hidden py-24 px-6" style={{ background: 'linear-gradient(160deg, #0d0f0b 0%, #1a1d17 50%, #141610 100%)' }}>

      {/* Subtle gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />

      {/* Faint decorative pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, #c9a96e 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative max-w-3xl mx-auto text-center text-white">

        {/* Hotel crest */}
        <div className="mb-8">
          <img src={logo} alt="Atlantic Horizon Crest" className="h-20 w-auto mx-auto opacity-60 filter brightness-150" />
        </div>

        {/* Thin gold divider */}
        <div className="flex items-center gap-4 mb-8 justify-center">
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-amber-600/60" />
          <span className="text-amber-600 text-xs">✦</span>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-amber-600/60" />
        </div>

        {/* Main hotel name */}
        <p className="text-amber-500 uppercase tracking-[0.5em] text-[10px] font-black mb-4">Est. Ireland's Southwest Coast</p>
        <h1 className="font-cinzel text-3xl md:text-5xl tracking-[3px] font-normal mb-3 text-white/90 uppercase">
          The Atlantic Horizon Manor
        </h1>

        {/* Tagline */}
        <h2 className="font-serif italic text-xl md:text-2xl text-amber-400/80 mb-12 font-normal">
          Royal Elegance on Ireland's Southwest Coast
        </h2>

        {/* Descriptive paragraphs */}
        <div className="space-y-5 text-base md:text-lg text-white/40 leading-relaxed font-light tracking-wide">
          <p>
            Perched where the rugged beauty of the Southwest of Ireland meets
            the infinite blue, The Atlantic Horizon Manor offers a sanctuary of
            refined luxury and timeless royalty.
          </p>
          <p>
            Experience breathtaking Atlantic views from our historic estate,
            where every room tells a story of elegance. From the crashing waves
            below to the gold-leafed ceilings above, we invite you to immerse
            yourself in a world designed for those who seek the extraordinary.
          </p>
          <p>
            Relax in our award-winning spa, dine on locally-sourced coastal
            delicacies, and discover the warm, regal hospitality that makes
            every stay a part of our heritage.
          </p>
        </div>

        {/* Bottom divider */}
        <div className="flex items-center gap-4 mt-12 justify-center">
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-amber-600/40" />
          <span className="text-amber-600/50 text-xs">✦</span>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-amber-600/40" />
        </div>
      </div>
    </section>
  );
}
