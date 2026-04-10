

export default function Introduction() {
  return (
    // Introduction section with centered layout and luxury color palette
    <section className="bg-[#fdfcf9] text-center py-24 px-6 text-manorGreen">
      <div className="max-w-3xl mx-auto">

        {/* Hotel crest / logo */}
        <div className="mb-8">
          <img
            src="/images/Logo.png"
            alt="Atlantic Horizon Crest"
            className="h-24 w-auto mx-auto opacity-80"
          />
        </div>

        {/* Main hotel name (large serif-style display) */}
        <h1 className="font-courier text-4xl md:text-5xl tracking-[4px] font-normal mb-2 uppercase">
          The Atlantic Horizon Manor
        </h1>

        {/* Tagline / location descriptor */}
        <h2 className="font-courier text-2xl md:text-3xl text-manorTan mb-10 font-normal">
          Royal Elegance on Ireland&apos;s Southwest Coast
        </h2>

        {/* Descriptive paragraphs about the hotel experience */}
        <div className="space-y-6 text-lg md:text-xl text-gray-600 leading-relaxed font-courier">
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

      </div>
    </section>
  );
}
