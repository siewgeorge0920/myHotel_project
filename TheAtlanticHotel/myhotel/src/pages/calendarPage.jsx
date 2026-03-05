import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { format, isValid } from 'date-fns';

export default function CalendarPage() {
  const location = useLocation();
  const bookingData = location.state || {}; 

  // 🌟 核心修复：补回丢失的 State 定义
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🛡️ 安全处理日期：防止直接访问 URL 时报错
  const formatDateSafe = (dateStr) => {
    if (!dateStr) return 'TBD';
    const d = new Date(dateStr);
    return isValid(d) ? format(d, 'dd MMM') : 'TBD';
  };

  const displayIn = formatDateSafe(bookingData.startDate);
  const displayOut = formatDateSafe(bookingData.endDate);
  const displayGuests = bookingData.guests || '2 Adults';

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/rooms')
      .then(res => res.json())
      .then(data => {
        setRooms(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        // Fallback data: 防止 Backend 没开时画面还是空的
        setRooms([
          { id: 1, name: 'The Atlantic Manor Suite', price: 1200, image: '/images/room1.jpg', desc: 'King bed with ocean view' },
          { id: 2, name: 'Private Forest Lodge', price: 850, image: '/images/room2.jpg', desc: 'Secluded luxury in nature' },
          { id: 3, name: 'Royal Horizon Villa', price: 2500, image: '/images/room3.jpg', desc: 'Private pool and butler service' }
        ]);
        setLoading(false);
      });
  }, []);


  const handleReserve = async (room) => {
  const payload = {
    room_id: room._id,
    room_name: room.name,
    checkIn: bookingData.startDate,
    checkOut: bookingData.endDate,
    guests: bookingData.guests,
    totalPrice: room.pricePerNight // 暂时拿单价，可以加 logic 算天数
  };

  try {
    const res = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if(res.ok) {
      alert("Reservation Confirmed! Enjoy your stay at Atlantic Horizon.");
    }
  } catch (err) {
    alert("Booking failed, please try again.");
  }
};

  return (
    <div className="bg-[#1a1d17] min-h-screen text-white font-sans">
      {/* 1. Header Summary Section */}
      <div className="pt-32 pb-12 px-6 border-b border-white/10 bg-[#242820]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <p className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-black mb-2 animate-fadeIn">Availability Results</p>
            <h1 className="text-4xl md:text-5xl font-serif italic">Your Private Sanctuary</h1>
          </div>
          
          <div className="flex gap-8 border-l border-white/20 pl-8 hidden md:flex">
            <div>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Check-in / Out</p>
              <p className="text-sm font-medium">{displayIn} - {displayOut} 2026</p> 
            </div>
            <div>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Guests</p>
              <p className="text-sm font-medium">{displayGuests}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Room List Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {rooms.length > 0 ? rooms.map((room, index) => (
              <div 
                key={room.id || room._id}
                className="group flex flex-col lg:flex-row bg-[#242820] overflow-hidden border border-white/5 hover:border-amber-600/50 transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                style={{ animation: `slideUp 0.8s ease-out ${index * 0.2}s both` }}
              >
                <div className="lg:w-2/5 h-64 lg:h-auto overflow-hidden relative">
                  <img 
                    src={room.image || room.imageUrl} 
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>

                <div className="flex-1 p-8 lg:p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl md:text-3xl font-serif tracking-wide">{room.name}</h3>
                      <div className="text-right">
                        <p className="text-amber-500 text-xs uppercase tracking-widest mb-1">From</p>
                        <p className="text-2xl font-serif">RM {room.price || room.pricePerNight}</p>
                        <p className="text-[10px] text-gray-500 uppercase">per night</p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xl">
                      {room.desc || room.description || "Experience ultimate privacy and unparalleled luxury in our masterfully designed space."}
                    </p>
                    <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-8">
                      <span>✦ {room.size || '45sqm'}</span>
                      <span>✦ {room.view || 'Ocean View'}</span>
                      <span>✦ Free WiFi</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center border-t border-white/5 pt-8">
                    <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 hover:border-amber-500 hover:text-amber-500 text-[11px] uppercase tracking-[0.3em] transition-all">
                      View Room Details
                    </button>
                    <button onClick={() => handleReserve(room)} className="w-full sm:w-auto px-12 py-4 bg-amber-600 hover:bg-amber-700 text-white text-[11px] uppercase font-black tracking-[0.3em] transition-all relative overflow-hidden group/btn">
                      <span className="relative z-10">Reserve Now</span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 text-gray-500 uppercase tracking-widest">No rooms available for the selected dates.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}