import React from 'react';

const Sauna = () => {
  return (
    <div className="font-mono text-[#2c372b]">
      
      {/* Main Content Section (Soft Green Background)  */}
      <div className="bg-[#e2eadc] py-16 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          
          {/* Row 1: Image Left, Text Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
            {/* Image 1 */}
            <img 
              src="/images/Derrick/sauna1.jpg" 
              alt="The Sauna Experience" 
              className="w-full h-72 md:h-[400px] object-cover rounded-sm shadow-md"
            />
            
            {/* Text 1 */}
            <div>
              <h2 className="text-2xl md:text-3xl mb-6 tracking-wide font-serif">
                The Sauna Experience
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 font-sans font-light">
                Step into a sanctuary of warmth and tranquility. Our traditional wood-fired saunas are designed to purify the body, relax the mind, and melt away the stresses of the outside world. Experience the ultimate detoxification at The Atlantic Horizon Manor.
              </p>
            </div>
          </div>

          {/* Row 2: Text Left, Image Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text 2 */}
            <div className="order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl mb-6 tracking-wide font-serif">
                Holistic Benefits
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 mb-4 font-sans font-light">
                Improve cardiovascular circulation, relieve deep muscle tension, and promote restorative sleep. A 45 to 60-minute session cleanses and rejuvenates the skin naturally.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 font-sans font-light">
                Complimentary plush spa robes, infused water, and warm towels are provided upon entry to ensure your absolute comfort.
              </p>
            </div>

            {/* Image 2 */}
            <img 
              src="/images/Derrick/sauna2.jpg" 
              alt="Sauna Holistic Benefits" 
              className="order-1 md:order-2 w-full h-72 md:h-[400px] object-cover rounded-sm shadow-md"
            />
          </div>

        </div>
      </div>

      {/* Luxury Booking Form Section  */}
      <div className="bg-[#fcfaf8] py-24 px-6 sm:px-12 lg:px-24 border-t border-[#e5e0d8]">
        <div className="max-w-3xl mx-auto bg-white p-10 md:p-16 shadow-sm border border-[#f0ebe1]">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-[#2c372b] mb-3">Book Your Sauna Session</h2>
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

            {/* Sauna Type Dropdown */}
            <div className="flex flex-col">
              <label htmlFor="sauna-type" className="mb-2 font-serif text-sm text-gray-600">Select Sauna Type *</label>
              <select 
                id="sauna-type" 
                className="px-4 py-3 border border-gray-300 bg-white focus:outline-none focus:border-[#d2a795] focus:ring-1 focus:ring-[#d2a795] transition-all rounded-none text-gray-700"
              >
                <option value="traditional">Traditional Wood-Fired Sauna</option>
                <option value="infrared">Infrared Detox Sauna</option>
                <option value="steam">Aromatherapy Steam Room</option>
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
              * Please book at least 2 hours in advance so we can prepare your sauna to the optimal temperature.
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

export default Sauna;