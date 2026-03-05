import React, { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { format, addDays } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import './datepicker-custom.css';
import { useNavigate } from 'react-router-dom';

export default function QuickBook() {
  const [dateRange, setDateRange] = useState([new Date(), addDays(new Date(), 1)]);
  const [startDate, endDate] = dateRange;
  const [guests, setGuests] = useState('2 Adults');
  const [roomType, setRoomType] = useState('Main Manor Suite');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  // --- 关键修复：让整个区域变成 Trigger ---
  // 在你的 DualBoxTrigger 里面稍微改一下文字样式
const DualBoxTrigger = forwardRef(({ onClick }, ref) => (
  <div 
    ref={ref}
    onClick={onClick}
    className="flex-[1.5] grid grid-cols-2 cursor-pointer group"
  >
    {/* Check-In Box */}
    <div className="p-6 hover:bg-white/5 transition-all duration-300 border-r border-white/10 relative">
      <label className="block text-[10px] uppercase tracking-[0.2em] text-amber-500 font-bold mb-3">
        Check-In
      </label>
      <div className="text-white text-2xl font-serif tracking-widest italic">
        {startDate ? format(startDate, 'dd / MM / yyyy') : "Select Date"}
      </div>
      <span className="absolute bottom-4 right-6 text-white/20 group-hover:text-amber-400 transition-colors"></span>
    </div>

    {/* Check-Out Box */}
    <div className="p-6 hover:bg-white/5 transition-all duration-300 border-r border-white/10 relative">
      <label className="block text-[10px] uppercase tracking-[0.2em] text-amber-500 font-bold mb-3">
        Check-Out
      </label>
      <div className="text-white text-2xl font-serif tracking-widest italic">
        {endDate ? format(endDate, 'dd / MM / yyyy') : "Select Date"}
      </div>
    </div>
  </div>
));


// 2. 修改这个 Function
  const handleCheckAvailability = () => {
    // 把数据包好，传去 /calendar 页面
    navigate('/calendar', { 
      state: { 
        startDate: startDate.toISOString(), 
        endDate: endDate ? endDate.toISOString() : null,
        guests,
        roomType
      } 
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-40">
      <div className="-mt-16 md:-mt-24 bg-[#343a2f] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-b-4 border-amber-600">
        <div className="flex flex-col lg:flex-row items-stretch">
          
          {/* --- Date Selection (Linked & Fixed Trigger) --- */}
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            minDate={new Date()}
            monthsShown={2}
            customInput={<DualBoxTrigger />} // 整个双格子都是 trigger
            popperClassName="premium-datepicker"
          />

          {/* --- Guest & Room Selection (直观版 Dropdown) --- */}
          <div className="flex-1 grid grid-cols-2">
            {/* Guests */}
            <div className="relative border-r border-white/10 group">
              <div 
                className="p-6 hover:bg-white/5 cursor-pointer h-full transition-colors"
                onClick={() => setActiveDropdown(activeDropdown === 'guests' ? null : 'guests')}
              >
                <label className="block text-[10px] uppercase tracking-[0.2em] text-amber-500 font-bold mb-3">Guests</label>
                <div className="text-white text-sm font-medium flex justify-between items-center tracking-widest">
                  {guests}
                  <span className={`text-[8px] transition-transform duration-300 ${activeDropdown === 'guests' ? 'rotate-180' : ''}`}>▼</span>
                </div>
              </div>
              {activeDropdown === 'guests' && (
                <div className="absolute top-full left-0 w-full bg-[#242820] border border-white/10 z-50 shadow-2xl animate-fadeIn">
                  {['1 Adult', '2 Adults', '2 Adults, 1 Child', 'Family Suite'].map(opt => (
                    <div 
                      key={opt}
                      className="p-4 text-white text-[10px] uppercase tracking-widest hover:bg-amber-600 cursor-pointer transition-colors"
                      onClick={() => { setGuests(opt); setActiveDropdown(null); }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Room Type */}
            <div className="relative group">
              <div 
                className="p-6 hover:bg-white/5 cursor-pointer h-full transition-colors"
                onClick={() => setActiveDropdown(activeDropdown === 'room' ? null : 'room')}
              >
                <label className="block text-[10px] uppercase tracking-[0.2em] text-amber-500 font-bold mb-3">Accommodation</label>
                <div className="text-white text-sm font-medium flex justify-between items-center tracking-widest">
                  {roomType}
                  <span className={`text-[8px] transition-transform duration-300 ${activeDropdown === 'room' ? 'rotate-180' : ''}`}>▼</span>
                </div>
              </div>
              {activeDropdown === 'room' && (
                <div className="absolute top-full left-0 w-full bg-[#242820] border border-white/10 z-50 shadow-2xl animate-fadeIn">
                  {['Main Manor Suite', 'Private Lodge', 'Luxury Villa', 'Exclusive Residence'].map(opt => (
                    <div 
                      key={opt}
                      className="p-4 text-white text-[10px] uppercase tracking-widest hover:bg-amber-600 cursor-pointer transition-colors"
                      onClick={() => { setRoomType(opt); setActiveDropdown(null); }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button onClick={handleCheckAvailability} className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-10 lg:py-0 uppercase text-[11px] font-black tracking-[0.4em] transition-all flex items-center justify-center group overflow-hidden relative ">
            <span className="relative z-10">Check Availability</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      </div>
      
      {/* Click Outside to Close */}
      {activeDropdown && <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)}></div>}
    </section>
  );
}