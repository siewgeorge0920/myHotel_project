import React from 'react';

const Sauna = () => {
  return (
    <div className="bg-[#fcfaf8] flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full">
        
        {/* Page Title & Intro */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[#313e33] mb-4 uppercase tracking-widest">
            The Sauna Experience
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Step into a sanctuary of warmth and tranquility. Our traditional wood-fired saunas are designed to purify the body, relax the mind, and melt away the stresses of the outside world. Experience the ultimate detoxification at The Atlantic Horizon Manor.
          </p>
        </div>

        {/* Image Placeholder */}
        <div className="w-full h-80 md:h-[500px] bg-gray-200 mb-16 overflow-hidden flex items-center justify-center">
          <span className="text-gray-500 italic">Luxury Sauna Image Goes Here</span>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-[#313e33]">
          {/* Health Benefits */}
          <div>
            <h2 className="text-2xl font-serif mb-4 uppercase tracking-wide border-b border-[#cca77b] pb-2 inline-block">
              Holistic Benefits
            </h2>
            <ul className="space-y-3 mt-4 text-gray-700 font-light">
              <li className="flex items-start">
                <span className="text-[#cca77b] mr-2">✦</span> Improves cardiovascular circulation
              </li>
              <li className="flex items-start">
                <span className="text-[#cca77b] mr-2">✦</span> Relieves deep muscle tension and soreness
              </li>
              <li className="flex items-start">
                <span className="text-[#cca77b] mr-2">✦</span> Promotes deep, restorative sleep
              </li>
              <li className="flex items-start">
                <span className="text-[#cca77b] mr-2">✦</span> Cleanses and rejuvenates the skin
              </li>
            </ul>
          </div>

          {/* Practical Information */}
          <div>
            <h2 className="text-2xl font-serif mb-4 uppercase tracking-wide border-b border-[#cca77b] pb-2 inline-block">
              Session Details
            </h2>
            <div className="mt-4 space-y-4 text-gray-700 font-light">
              <p>
                <strong className="font-medium text-[#313e33]">Duration:</strong> 45 - 60 Minutes
              </p>
              <p>
                <strong className="font-medium text-[#313e33]">Amenities:</strong> Complimentary plush spa robes, infused water, and warm towels provided upon entry.
              </p>
              <p>
                <strong className="font-medium text-[#313e33]">Reservations:</strong> We recommend booking at least 2 hours in advance to ensure the sauna is prepared to your preferred temperature.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Sauna;