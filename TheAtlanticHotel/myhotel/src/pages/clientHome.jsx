import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ClientHome() {
  const [rooms, setRooms] = useState([]);
  const [email, setEmail] = useState('');

  // 保留你的 Backend Logic: 拿房间 Data
  useEffect(() => {
    fetch('http://localhost:5000/api/rooms')
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error(err));
  }, []);

  // Derrick 的 Newsletter 功能
  const handleSubscribe = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/newsletter', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
    });
    const data = await res.json();
    alert(data.message);
    setEmail('');
  };

  return (
    <div className="bg-white">
      
      {/* 1. Hero Slider (Derrick Design) */}
      <div className="relative h-screen bg-cover bg-center flex items-center justify-center" style={{backgroundImage: "url('/images/main1.webp')"}}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white px-4 flex flex-col items-center">
          <p className="tracking-[0.3em] text-sm uppercase mb-4 font-semibold text-amber-400">Welcome To</p>
          <h1 className="text-6xl md:text-8xl font-serif mb-6 leading-tight drop-shadow-2xl">The Atlantic Horizon</h1>
          <p className="text-lg md:text-2xl font-light max-w-2xl text-gray-200">Experience unparalleled coastal luxury and Irish hospitality.</p>
        </div>
      </div>

      {/* 2. Introduction Section (Derrick Design) */}
      <div className="py-24 max-w-4xl mx-auto text-center px-6">
        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">A Sanctuary By The Sea</h2>
        <p className="text-gray-600 leading-relaxed mb-8">
          Nestled along the rugged cliffs of the Wild Atlantic Way, our manor offers a perfect blend of historic charm and modern indulgence. From our Michelin-starred dining to our exclusive spa, every moment is crafted to perfection.
        </p>
        <img src="/images/design.jpg" alt="Hotel Interior" className="w-full h-[400px] object-cover rounded-sm shadow-xl" />
      </div>

      {/* 3. Dynamic Rooms (你的 Data Tool) */}
      <div id="rooms" className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-gray-900 mb-3">Featured Suites</h2>
            <div className="h-0.5 w-24 bg-amber-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {rooms.map((room) => (
              <div key={room._id} className="bg-white group cursor-pointer border border-gray-100">
                <div className="overflow-hidden h-72">
                  <img src={room.imageUrl} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-serif text-gray-900 mb-2">{room.name}</h3>
                  <p className="text-amber-600 font-semibold tracking-widest text-sm mb-4">RM {room.pricePerNight} / NIGHT</p>
                  <p className="text-gray-500 text-sm line-clamp-2">{room.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Experiences (Derrick Design) */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="h-[500px] bg-cover bg-center" style={{backgroundImage: "url('/images/diningHall.jpg')"}}></div>
        <div className="flex flex-col justify-center items-start p-16 md:p-24 bg-hotel-dark text-white">
          <p className="text-amber-400 tracking-widest text-sm mb-4 uppercase">Culinary Excellence</p>
          <h2 className="text-4xl font-serif mb-6">Michelin Quality Dining</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">Savor the finest local ingredients prepared by our world-renowned chefs. A gastronomic journey awaits you.</p>
          <button className="border border-white px-8 py-3 hover:bg-white hover:text-black transition-colors uppercase text-xs tracking-wider">Discover More</button>
        </div>
      </div>

      {/* 5. Newsletter (Derrick Design) */}
      <div className="py-24 bg-amber-50 text-center px-6">
        <h2 className="text-2xl font-serif text-gray-900 mb-4">Stay Connected</h2>
        <p className="text-gray-600 mb-8">Subscribe to our newsletter for exclusive offers and updates.</p>
        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-2">
          <input type="email" placeholder="Your Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="flex-1 p-4 border border-gray-300 outline-none focus:border-amber-500" />
          <button type="submit" className="bg-gray-900 text-white px-8 py-4 font-semibold hover:bg-black transition-colors uppercase tracking-wider text-xs">Subscribe</button>
        </form>
      </div>

    </div>
  );
}