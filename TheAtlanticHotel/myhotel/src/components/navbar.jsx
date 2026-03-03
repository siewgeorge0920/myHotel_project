import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // 🌟 1. 叫 useLocation 保镖出来

export default function Navbar() {
  const [logo, setLogo] = useState('');
  const [showBottomNav, setShowBottomNav] = useState(false);
  
  // 🌟 2. 拿到现在的网页路径 (e.g. "/michelin-food")
  const location = useLocation(); 

  useEffect(() => {
    fetch('http://localhost:5000/api/settings/logo')
      .then(res => res.json())
      .then(data => setLogo(data.logoUrl))
      .catch(err => console.error(err));
  }, []);

  // 🌟 3. 我们写一个 function 来 Check 当前的 URL 是属于哪一个 Group 的
  const isGroupActive = (paths) => {
    return paths.some(path => location.pathname.includes(path));
  };

  return (
    <div className="sticky top-0 z-50 shadow-xl">
      {/* 🟢 TOP NAV (Logo & Buttons) */}
      <nav className="bg-gray-900 text-white py-3 px-8 flex justify-between items-center relative z-20">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          {logo ? (
             <img src={"images/Logo.png"} alt="Hotel Logo" className="h-12 w-auto object-contain bg-white rounded p-1" />
          ) : (
             <span className="font-bold text-xl font-serif text-amber-400">THE ATLANTIC HORIZON</span>
          )}
        </Link>
        
        <div className="flex space-x-4 items-center">
          <button className="border border-white text-white px-4 py-1.5 rounded hover:bg-white hover:text-gray-900 transition-colors text-xs font-semibold uppercase tracking-wider hidden sm:block">
            Check your Booking
          </button>
          <Link to="/login" className="border border-white text-white px-4 py-1.5 rounded hover:bg-white hover:text-gray-900 transition-colors text-xs font-semibold uppercase tracking-wider hidden sm:block">
            Staff Login
          </Link>
          
          <button 
            onClick={() => setShowBottomNav(!showBottomNav)} 
            className={`p-1.5 rounded transition-colors ${showBottomNav ? 'bg-amber-500 text-black' : 'bg-white text-gray-900 hover:bg-gray-200'}`}
          >
            {showBottomNav ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
          </button>
        </div>
      </nav>

      {/* 🟢 BOTTOM NAV */}
      {showBottomNav && (
        <nav className="bg-black text-white py-0 border-t border-gray-700 shadow-2xl absolute w-full left-0 z-10 transition-all duration-300 origin-top">
          <div className="flex flex-col md:flex-row justify-center divide-y md:divide-y-0 md:divide-x divide-gray-700">
            
            {/* 🍽️ Menu 1: Experience and Dining */}
            <div className="group relative">
              {/* 🌟 4. 如果现在的网址有下面这些字，字就变 text-amber-500！ */}
              <button className={`w-full px-6 py-4 text-sm transition-colors text-center ${
                isGroupActive(['/michelin', '/breakfast', '/excursion', '/chauffeur', '/honeymoon']) 
                  ? 'text-amber-500 font-bold' // 👈 Active 时的颜色 (你的截图要求)
                  : 'text-white hover:text-amber-400'
              }`}>
                Experience and Dining
              </button>
              <div className="md:absolute hidden group-hover:block bg-white text-black w-full md:min-w-full shadow-lg border-t-2 border-amber-500 z-50">
                <Link to="/michelin" className="block px-4 py-3 text-xs hover:bg-gray-100 border-b border-gray-100">Michelin Quality Food</Link>
                <Link to="/breakfast" className="block px-4 py-3 text-xs hover:bg-gray-100 border-b border-gray-100">Continental Breakfast</Link>
                <Link to="/excursion" className="block px-4 py-3 text-xs hover:bg-gray-100 border-b border-gray-100">Local Irish Excursion</Link>
                <Link to="/chauffeur" className="block px-4 py-3 text-xs hover:bg-gray-100 border-b border-gray-100">Private Chauffeur</Link>
                <Link to="/honeymoon" className="block px-4 py-3 text-xs hover:bg-gray-100">Honeymoon Package</Link>
              </div>
            </div>

            {/* 💆‍♀️ Menu 2: The Spa & Wellness */}
            <div className="group relative">
              <button className={`w-full px-6 py-4 text-sm transition-colors text-center ${
                isGroupActive(['/sauna', '/jacuzzi', '/massage']) 
                  ? 'text-amber-500 font-bold' 
                  : 'text-white hover:text-amber-400'
              }`}>
                The Spa & Wellness
              </button>
              <div className="md:absolute hidden group-hover:block bg-white text-black w-full md:min-w-full shadow-lg border-t-2 border-amber-500 z-50">
                <Link to="/sauna" className="block px-4 py-3 text-xs hover:bg-gray-100 border-b border-gray-100">Sauna & Facial</Link>
                <Link to="/jacuzzi" className="block px-4 py-3 text-xs hover:bg-gray-100 border-b border-gray-100">Private Exclusive (Jacuzzi)</Link>
                <Link to="/massage" className="block px-4 py-3 text-xs hover:bg-gray-100">Massage (Thai / Hot Stone)</Link>
              </div>
            </div>

            {/* 🏝️ Menu 3: All Inclusive Resort */}
            <div className="group relative">
              <button className={`w-full px-6 py-4 text-sm transition-colors text-center ${
                isGroupActive(['/lodges', '/villas', '/exclusivity']) 
                  ? 'text-amber-500 font-bold' 
                  : 'text-white hover:text-amber-400'
              }`}>
                All Inclusive Resort
              </button>
              <div className="md:absolute hidden group-hover:block bg-white text-black w-full md:min-w-[150%] shadow-lg border-t-2 border-amber-500 z-50">
                <Link to="/lodges" className="block px-4 py-3 text-xs hover:bg-gray-100 border-b border-gray-100">Private Lodges</Link>
                <Link to="/villas" className="block px-4 py-3 text-xs hover:bg-gray-100 border-b border-gray-100">Private Residences & Villas</Link>
                <Link to="/exclusivity" className="block px-4 py-3 text-xs hover:bg-gray-100">Ultimate Exclusivity</Link>
              </div>
            </div>

          </div>
        </nav>
      )}
    </div>
  );
}