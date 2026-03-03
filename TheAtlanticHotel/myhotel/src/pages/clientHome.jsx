// src/pages/clientHome.jsx
import React, { useState, useEffect } from 'react';

export default function ClientHome() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // 去 Backend 拿房间 data
  useEffect(() => {
    fetch('http://localhost:5000/api/rooms')
      .then(res => res.json())
      .then(data => {
        setRooms(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Alamak, error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* 🌟 升级版 Hero Section */}
      <div 
        className="relative h-[85vh] bg-cover bg-center" 
        // 🚨 这里！换成你真正的风景大图，不要放 Logo！
        style={{backgroundImage: "url('/images/main1.webp')"}} 
      >
        {/* 加深一点黑色的 Filter，让白色的字更 Pop 出来 */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-3 font-semibold drop-shadow-md">
            Welcome to
          </p>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight font-serif text-white drop-shadow-xl">
            Atlantic Horizon
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wide max-w-3xl text-gray-200 drop-shadow-md">
            A New Standard of Coastal Luxury and Private Manor Experience.
          </p>
        </div>
      </div>

      {/* Floating Booking Bar (前台客人用的) - mt-20 浮起来在 Hero 上面 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 mb-24">
        <div className="bg-white rounded-xl shadow-2xl p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
          <div className="flex-1 w-full">
            <label className="block text-xs uppercase tracking-wider font-bold text-gray-600 mb-1.5">Check-in</label>
            <input type="date" className="w-full border border-gray-300 rounded-lg p-3.5 text-gray-700 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none" />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs uppercase tracking-wider font-bold text-gray-600 mb-1.5">Check-out</label>
            <input type="date" className="w-full border border-gray-300 rounded-lg p-3.5 text-gray-700 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none" />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs uppercase tracking-wider font-bold text-gray-600 mb-1.5">Guests</label>
            <select className="w-full border border-gray-300 rounded-lg p-3.5 text-gray-700 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white">
              <option>1 Adult</option>
              <option>2 Adults</option>
              <option>Family (4+)</option>
            </select>
          </div>
          <div className="w-full md:w-auto mt-2 md:mt-0 md:pt-6">
            <button className="w-full md:w-auto bg-gray-900 hover:bg-black text-amber-400 font-bold py-3.5 px-10 rounded-lg shadow-lg transition-all uppercase tracking-wider text-xs">
              Check Availability
            </button>
          </div>
        </div>
      </div>

      {/* Featured Rooms - 对应截图下方 */}
      <div id="rooms" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="text-center mb-16 border-b border-gray-200 pb-10">
          <p className="text-xs uppercase tracking-widest text-amber-600 mb-1 font-semibold">Exquisite Stays</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 font-serif">Featured Suites & Villas</h2>
          <p className="text-gray-600 max-w-xl mx-auto">Discover our curated selection of most popular suites, designed for your ultimate comfort.</p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 font-semibold animate-pulse">Wait a minute, loading rooms... ⏳</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {rooms.map((room) => (
              <div key={room._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-500">
                <div className="h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img src={room.imageUrl} alt={room.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-5">
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">{room.name}</h3>
                    <div className="text-right">
                      <span className="text-xl font-bold text-amber-600">RM {room.pricePerNight}</span>
                      <p className="text-xs text-gray-500">/night</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-8 line-clamp-2 leading-relaxed">{room.description}</p>
                  <button className="w-full bg-white border border-gray-900 text-gray-900 font-semibold py-3 rounded-lg hover:bg-gray-900 hover:text-white transition-colors uppercase tracking-wider text-xs">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}