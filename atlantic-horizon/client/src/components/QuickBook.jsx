import React, { useState, forwardRef, useRef, useEffect } from 'react';
import DatePickerModule from 'react-datepicker';
import { format, addDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import './datepicker-custom.css';

// VITE INTEROP: Handle cases where react-datepicker is an object with a .default property
const DatePicker = DatePickerModule.default || DatePickerModule;

/**
 * CounterRow: Manages independent guest category increments
 */
function CounterRow({ label, subLabel, type, value, onUpdate }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 w-full">
      <div className="flex-1 text-left">
        <p className="text-white text-[10px] font-bold uppercase tracking-widest leading-none">{label}</p>
        <p className="text-[9px] text-amber-500/50 uppercase tracking-widest mt-1">{subLabel}</p>
      </div>
      <div className="flex items-center gap-3">
        <button 
          type="button" 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUpdate(type, 'minus'); }}
          className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-amber-500 hover:border-amber-500 transition-all text-xs"
        >-</button>
        <span className="text-white font-cinzel text-sm min-w-[20px] text-center">{value}</span>
        <button 
          type="button" 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUpdate(type, 'add'); }}
          className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-amber-500 hover:border-amber-500 transition-all text-xs"
        >+</button>
      </div>
    </div>
  );
}

/**
 * CustomDateInput: The visual trigger for the DatePicker
 * Passes ref and onClick from DatePicker to our custom layout
 */
const CustomDateInput = forwardRef(({ value, onClick, startDate, endDate }, ref) => (
  <button 
    ref={ref} 
    onClick={onClick} 
    type="button"
    className="flex-1 flex items-center justify-center cursor-pointer group px-4 py-2 w-full md:w-auto hover:bg-white/[0.02] rounded-xl transition-all border-none outline-none appearance-none"
  >
    <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 md:flex-none">
      <label className="block text-[8px] uppercase tracking-[0.3em] text-amber-600 font-bold mb-1 pointer-events-none">Check-In</label>
      <div className="text-white/90 text-sm md:text-base font-cinzel tracking-wider group-hover:text-white transition-colors">
        {startDate instanceof Date ? format(startDate, 'dd MMM yyyy') : "Stay Start"}
      </div>
    </div>
    <div className="mx-6 text-amber-600/30 font-light text-xl pointer-events-none">―</div>
    <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 md:flex-none">
      <label className="block text-[8px] uppercase tracking-[0.3em] text-amber-600 font-bold mb-1 pointer-events-none">Check-Out</label>
      <div className="text-white/90 text-sm md:text-base font-cinzel tracking-wider group-hover:text-white transition-colors">
        {endDate instanceof Date ? format(endDate, 'dd MMM yyyy') : "Stay End"}
      </div>
    </div>
  </button>
));

export default function QuickBook() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  // States
  const [dateRange, setDateRange] = useState([new Date(), addDays(new Date(), 1)]);
  const [startDate, endDate] = dateRange;
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [guests, setGuests] = useState({ adults: 2, seniors: 0, infants: 0 });

  // Handle outside clicks for guest dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsGuestOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateCount = (type, operation) => {
    setGuests(prev => {
      const newValue = operation === 'add' ? prev[type] + 1 : prev[type] - 1;
      const min = (type === 'adults') ? 1 : 0;
      if (newValue < min || newValue > 30) return prev;
      return { ...prev, [type]: newValue };
    });
  };

  const totalGuests = guests.adults + guests.seniors + guests.infants;

  const handleCheckAvailability = () => {
    if (!startDate || !endDate) return;
    navigate('/calendar', {
      state: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        guestDetails: guests,
        totalGuests
      }
    });
  };

  // Type Guard for Rendering
  if (typeof DatePicker !== 'function' && typeof DatePicker !== 'object') {
     return <div className="text-white text-xs text-center p-4">Component initialization error. Check console.</div>;
  }

  return (
    <section className="relative z-40 -mt-12 md:-mt-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#0f110c]/90 backdrop-blur-3xl border border-white/10 md:rounded-full rounded-3xl p-2 md:p-3 shadow-[0_30px_60px_rgba(0,0,0,0.9)] flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full overflow-visible">
          
          {/* Calendar Picker Section */}
          <div className="flex-1 w-full md:w-auto flex justify-center text-center">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              // Passing CustomDateInput as a COMPONENT reference or properly handled element
              customInput={<CustomDateInput startDate={startDate} endDate={endDate} />}
              minDate={new Date()}
            />
          </div>

          <div className="w-full h-px md:w-px md:h-10 bg-white/10 md:mx-4" />

          {/* Guest Selector Section */}
          <div 
            className="relative px-6 py-2 cursor-pointer group flex flex-col items-center md:items-start w-full md:w-auto" 
            ref={dropdownRef} 
            onClick={() => setIsGuestOpen(!isGuestOpen)}
          >
            <p className="block text-[8px] uppercase tracking-[0.3em] text-amber-600 font-bold mb-1 pointer-events-none">Travelers</p>
            <div className="text-white/90 text-sm md:text-base font-cinzel tracking-wider flex items-center justify-center gap-2 group-hover:text-white transition-colors">
              <span>{totalGuests} <span className="opacity-50 ml-1 text-[10px] font-sans">Total</span></span>
              <span className={`text-[8px] text-amber-500 transition-transform duration-300 ${isGuestOpen ? 'rotate-180' : ''}`}>▼</span>
            </div>

            {isGuestOpen && (
              <div className="absolute top-full right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 mt-6 w-[320px] p-8 bg-[#0a0c08] backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.95)] z-[100] animate-fadeIn">
                <div className="space-y-4">
                  <CounterRow label="Adults" subLabel="Ages 18+" type="adults" value={guests.adults} onUpdate={updateCount} />
                  <CounterRow label="Seniors" subLabel="Ages 65+" type="seniors" value={guests.seniors} onUpdate={updateCount} />
                  <CounterRow label="Infants" subLabel="Under 2" type="infants" value={guests.infants} onUpdate={updateCount} />
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleCheckAvailability}
            className="w-full md:w-auto bg-amber-600 text-white md:rounded-full rounded-2xl px-12 py-4 md:py-4 text-[11px] uppercase tracking-[0.4em] font-black transition-all hover:bg-amber-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(217,119,6,0.3)] md:ml-2 mt-2 md:mt-0"
          >
            Book Now
          </button>
        </div>
      </div>
    </section>
  );
}