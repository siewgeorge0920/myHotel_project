import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [logo, setLogo] = useState('/images/Logo.png');
  const [showBottomNav, setShowBottomNav] = useState(false);
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      // 🛡️ 加上安全网：如果读小本本 Crash 了，就自动洗掉旧数据，不要白屏！
      try {
        setCurrentUser(JSON.parse(loggedInUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }

    fetch('http://localhost:5000/api/settings/logo')
      .then(res => res.json())
      .then(data => { if(data.logoUrl) setLogo(data.logoUrl); })
      .catch(err => console.error(err));
  }, []);

  // 🌟 修改：只需要删除 'user' 这个抽屉
  const handleLogout = () => {
    if(window.confirm("Logout now?")) {
      localStorage.removeItem('user'); 
      window.location.href = '/';
    }
  };

  const isGroupActive = (paths) => paths.some(path => location.pathname.includes(path));

  

  return (
    <div className="sticky top-0 z-50 font-sans">
      {/* 🟢 TOP NAV - 跟着 Derrick 的配色 #343a2f */}
      <header className="bg-[#343a2f] text-white px-8 py-3 flex items-center justify-between shadow-md relative z-30">
        
        {/* 左边：Hamburger */}
        <div className="flex items-center flex-1">
          <button 
            onClick={() => setShowBottomNav(!showBottomNav)}
            className="flex items-center space-x-3 group focus:outline-none"
          >
            <div className="flex flex-col space-y-1">
              <span className={`h-0.5 w-5 bg-white transition-all ${showBottomNav ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`h-0.5 w-5 bg-white ${showBottomNav ? 'opacity-0' : ''}`}></span>
              <span className={`h-0.5 w-5 bg-white transition-all ${showBottomNav ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
            <span className="uppercase tracking-[0.2em] text-[10px] font-bold group-hover:text-amber-400 transition-colors">Menu</span>
          </button>
        </div>

        {/* 中间：Logo (已解决闪烁) */}
        <div className="flex justify-center">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <img src={logo} alt="Atlantic Horizon" className="h-14 md:h-16 w-auto object-contain" />
          </Link>
        </div>

        {/* 右边：你的 Tools + 预订按钮 */}
        <div className="flex justify-end items-center space-x-5 flex-1 text-[10px] md:text-xs uppercase tracking-widest font-bold">
          
          {/* 🌟 你的工具：Check Booking */}
          <Link to="/check-booking" className="hidden lg:block text-gray-300 hover:text-amber-400 transition-colors">
            Check Booking
          </Link>

          <Link to="/gift-card" className="hidden xl:block text-gray-300 hover:text-amber-400 transition-colors">
            Gift Card
          </Link>
          
          {/* 🌟 智能显示：有登入就出名字(Link)，没登入出 Login */}
          {currentUser ? (
            <div className="hidden sm:flex items-center space-x-4">
              <Link 
                // 如果是 admin 就去 /admin-iam，不然就去 /calendar
                to={currentUser.role === 'admin' ? '/admin-iam' : '/calendar'} 
                className="text-amber-400 hover:text-amber-300 font-black tracking-widest transition-colors cursor-pointer"
              >
                HI, {currentUser.name}
              </Link>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors font-bold">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:flex text-gray-300 hover:text-amber-400 transition-colors items-center">
              Staff Login <span className="ml-1 text-[10px]">🔒</span>
            </Link>
          )}

          {/* Book Stay Button */}
          <button className="border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-[#343a2f] px-5 py-2.5 transition-all shadow-md">
            Book Stay
          </button>
        </div>
      </header>

      {/* 🔴 BOTTOM NAV - 100% 还原 Derrick 的 Dropdown UI 设计 */}
      <div className={`absolute w-full transition-all duration-500 ease-in-out z-20 ${showBottomNav ? 'top-full opacity-100' : '-top-96 opacity-0'}`}>
        <nav className="bg-[#242820] text-white shadow-2xl border-t border-[#3e4538]">
          <div className="flex flex-col md:flex-row justify-center">
            
            {/* 🍽️ Group 1: Dining */}
            <div className="group relative border-b md:border-b-0 md:border-r border-[#3e4538]">
              <button className={`w-full px-10 py-5 text-[11px] uppercase tracking-[0.2em] transition-all ${
                isGroupActive(['/michelin', '/breakfast']) ? 'text-amber-500 bg-black/20' : 'hover:bg-black/20'
              }`}>
                Experience & Dining
              </button>
              {/* 🌟 这里的 UI 跟着 Derrick 的 CSS 设计：白底、黑字、金线 */}
              <div className="md:absolute hidden group-hover:block bg-[#faf9f6] text-[#242820] w-full md:min-w-[220px] shadow-xl border-t-4 border-amber-500 py-2">
                <Link to="/michelin" className="block px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-gray-100 hover:text-amber-600 transition-colors font-bold">Michelin Quality Food</Link>
                <Link to="/breakfast" className="block px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-gray-100 hover:text-amber-600 transition-colors font-bold border-t border-gray-100">Continental Breakfast</Link>
                <Link to="/loc_Irish" className="block px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-gray-100 hover:text-amber-600 transition-colors font-bold border-t border-gray-100">Local Irish Excursion</Link>
                <Link to="/chauffer" className="block px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-gray-100 hover:text-amber-600 transition-colors font-bold border-t border-gray-100">Private Chauffer</Link>
                <Link to="/honeymoon" className="block px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-gray-100 hover:text-amber-600 transition-colors font-bold border-t border-gray-100">Honeymoon Package</Link>
              </div>
            </div>

            {/* 💆‍♀️ Group 2: Spa */}
            <div className="group relative border-b md:border-b-0 md:border-r border-[#3e4538]">
              <button className={`w-full px-10 py-5 text-[11px] uppercase tracking-[0.2em] transition-all ${
                isGroupActive(['/sauna', '/massage']) ? 'text-amber-500 bg-black/20' : 'hover:bg-black/20'
              }`}>
                Spa & Wellness
              </button>
              <div className="md:absolute hidden group-hover:block bg-[#faf9f6] text-[#242820] w-full md:min-w-[220px] shadow-xl border-t-4 border-amber-500 py-2">
                <Link to="/sauna" className="block px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-gray-100 hover:text-amber-600 font-bold">Sauna</Link>
                <Link to="/facial" className="block px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-gray-100 hover:text-amber-600 font-bold">Facial</Link>
                <Link to="/pr_Exclusive" className="block px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-gray-100 hover:text-amber-600 font-bold">Private Exclusive</Link>
                <Link to="/massage" className="block px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-gray-100 hover:text-amber-600 font-bold border-t border-gray-100">Therapeutic Massage</Link>
              </div>
            </div>

            {/* 🏝️ Group 3: Resort */}
            <div className="group relative">
              <button className={`w-full px-10 py-5 text-[11px] uppercase tracking-[0.2em] transition-all ${
                isGroupActive(['/villas']) ? 'text-amber-500 bg-black/20' : 'hover:bg-black/20'
              }`}>
                All Inclusive Resort
              </button>
              <div className="md:absolute hidden group-hover:block bg-[#faf9f6] text-[#242820] w-full md:min-w-[220px] shadow-xl border-t-4 border-amber-500 py-2">
                <Link to="/lodges" className="block px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-gray-100 hover:text-amber-600 font-bold">Private Lodges</Link>
                <Link to="/villas" className="block px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-gray-100 hover:text-amber-600 font-bold border-t border-gray-100">Luxury Residences</Link>
                <Link to="/ultimate" className="block px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-gray-100 hover:text-amber-600 font-bold border-t border-gray-100">Ultimate Exclusivity</Link>
              </div>
            </div>

          </div>
        </nav>
      </div>
    </div>
  );
}