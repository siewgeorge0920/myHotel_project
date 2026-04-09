import React from 'react';

const HotTub = () => {
  return (
    <div className="font-mono text-[#2c372b]">
      
      {/* --- Main Content Section (Soft Green Background) --- */}
      <div className="bg-[#e2eadc] py-16 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          
          {/* Row 1: Text Left, Image Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
            {/* Text 1 */}
            <div className="order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl mb-6 tracking-wide font-serif">
                Family Hot Tub Retreat
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 font-sans font-light">
                Create unforgettable memories with your loved ones in our spacious, luxury family hot tubs. Designed with both safety and comfort in mind, our temperature-controlled outdoor tubs offer a relaxing, joyous aquatic escape for guests of all ages at The Atlantic Horizon Manor.
              </p>
            </div>

            {/* Image 1 */}
            <img 
              src="/images/Derrick/hottub1.webp" 
              alt="Family Hot Tub Experience" 
              className="order-1 md:order-2 w-full h-72 md:h-[400px] object-cover rounded-sm shadow-md"
            />
          </div>

          {/* Row 2: Image Left, Text Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image 2 */}
            <img 
              src="/images/Derrick/hottub2.jpg" 
              alt="Hot Tub Relaxation and Views" 
              className="w-full h-72 md:h-[400px] object-cover rounded-sm shadow-md"
            />

            {/* Text 2 */}
            <div>
              <h2 className="text-2xl md:text-3xl mb-6 tracking-wide font-serif">
                Bonding & Relaxation
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 mb-4 font-sans font-light">
                Enjoy the gentle, soothing jets while taking in the stunning coastal views together. Our family hot tub areas provide a private, serene environment perfect for reconnecting after a day of exploring the Irish countryside.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 font-sans font-light">
                Complimentary fresh towels, family-friendly refreshments, and cozy robes in all sizes are provided to ensure a seamless and delightful experience for the whole family.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* --- Luxury Booking Form Section --- */}
      <div className="bg-[#fcfaf8] py-24 px-6 sm:px-12 lg:px-24 border-t border-[#e5e0d8]">
        <div className="max-w-3xl mx-auto bg-white p-10 md:p-16 shadow-sm border border-[#f0ebe1]">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-[#2c372b] mb-3">Book Your Family Hot Tub</h2>
            <div className="w-16 h-[1px] bg-[#d2a795] mx-auto"></div>
          </div>

          <form className="space-y-8 text-base font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name */}
              <div className="flex flex-col">
                <label htmlFor="name" className="mb-2 font-serif text-sm text-gray-600">Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  className="px-4 py-3 border border-gray-300 bg-white focus:outline-none focus:border-[#d2a795] focus:ring-1 focus:ring-[#d2a795] transition-all rounded-none"
                  placeholder="e.g. Jane Doe"
                />
              </div>
              {/* Room Number */}
              <div className="flex flex-col">
                <label htmlFor="room" className="mb-2 font-serif text-sm text-gray-600">Room Code *</label>
                <input 
                  type="text" 
                  id="room" 
                  className="px-4 py-3 border border-gray-300 bg-white focus:outline-none focus:border-[#d2a795] focus:ring-1 focus:ring-[#d2a795] transition-all rounded-none"
                  placeholder="e.g. T104"
                />
              </div>
            </div>

            {/* Number of Guests Dropdown */}
            <div className="flex flex-col">
              <label htmlFor="guests" className="mb-2 font-serif text-sm text-gray-600">Number of Guests *</label>
              <select 
                id="guests" 
                className="px-4 py-3 border border-gray-300 bg-white focus:outline-none focus:border-[#d2a795] focus:ring-1 focus:ring-[#d2a795] transition-all rounded-none text-gray-700"
              >
                <option value="2">2 Guests</option>
                <option value="3">3 Guests (Family)</option>
                <option value="4">4 Guests (Family)</option>
                <option value="5">5+ Guests (Large Family Group)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Date */}
              <div className="flex flex-col">
                <label htmlFor="date" className="mb-2 font-serif text-sm text-gray-600">Date *</label>
                <input 
                  type="date" 
                  id="date" 
                  className="px-4 py-3 border border-gray-300 bg-white focus:outline-none focus:border-[#d2a795] focus:ring-1 focus:ring-[#d2a795] transition-all rounded-none text-gray-700"
                />
              </div>
              {/* Time */}
              <div className="flex flex-col">
                <label htmlFor="time" className="mb-2 font-serif text-sm text-gray-600">Preferred Time *</label>
                <input 
                  type="time" 
                  id="time" 
                  className="px-4 py-3 border border-gray-300 bg-white focus:outline-none focus:border-[#d2a795] focus:ring-1 focus:ring-[#d2a795] transition-all rounded-none text-gray-700"
                />
              </div>
            </div>

            <p className="text-sm text-gray-400 font-serif italic text-center mt-8 mb-8">
              * Please let us know at the front desk if you require child-sized robes or specific temperatures.
            </p>

            {/* Submit Button */}
            <div className="text-center mt-4">
              <button 
                type="button" 
                className="w-full md:w-auto bg-[#d2a795] hover:bg-[#c49885] text-[#2c372b] px-16 py-4 uppercase tracking-[0.2em] transition-colors font-medium rounded-none"
              >
                Request Booking
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default HotTub;