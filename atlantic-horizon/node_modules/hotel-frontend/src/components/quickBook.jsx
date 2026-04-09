import React, { useState, forwardRef, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { format, addDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import './datepicker-custom.css';

export default function QuickBook() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [dateRange, setDateRange] = useState([new Date(), addDays(new Date(), 1)]);
  const [startDate, endDate] = dateRange;
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [guests, setGuests] = useState({ adults: 2, seniors: 0, infants: 0 });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsGuestOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [alertObj, setAlertObj] = useState({ isOpen: false, text: '' });

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
    if (!startDate || !endDate) {
      setAlertObj({ isOpen: true, text: "Please select your intended arrival and departure dates." });
      return;
    }
    navigate('/calendar', {
      state: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        guestDetails: guests,
        totalGuests
      }
    });
  };

  const CounterRow = ({ label, subLabel, type, value }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-white text-[10px] font-bold uppercase tracking-widest">{label}</p>
        <p className="text-[9px] text-amber-500/50 uppercase tracking-widest">{subLabel}</p>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => updateCount(type, 'minus')}
          className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-amber-500 hover:border-amber-500 transition-all text-xs">-</button>
        <span className="text-white font-cinzel text-sm min-w-[16px] text-center">{value}</span>
        <button onClick={() => updateCount(type, 'add')}
          className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-amber-500 hover:border-amber-500 transition-all text-xs">+</button>
      </div>
    </div>
  );

  const DualBoxTrigger = forwardRef(({ onClick }, ref) => (
    <div ref={ref} onClick={onClick} className="flex-1 flex flex-col md:flex-row items-center justify-center cursor-pointer group px-4 py-2 w-full md:w-auto">

      {/* Check In */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 md:flex-none">
        <label className="block text-[8px] uppercase tracking-[0.3em] text-amber-600 font-bold mb-1 cursor-pointer">Check-In</label>
        <div className="text-white/90 text-sm md:text-base font-cinzel tracking-wider group-hover:text-white transition-colors">
          {startDate ? format(startDate, 'dd MMM yyyy') : "Select Date"}
        </div>
      </div>

      {/* Divider Icon */}
      <div className="mx-6 my-2 md:my-0 text-amber-600/30 font-light text-xl rotate-90 md:rotate-0">―</div>

      {/* Check Out */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 md:flex-none">
        <label className="block text-[8px] uppercase tracking-[0.3em] text-amber-600 font-bold mb-1 cursor-pointer">Check-Out</label>
        <div className="text-white/90 text-sm md:text-base font-cinzel tracking-wider group-hover:text-white transition-colors">
          {endDate ? format(endDate, 'dd MMM yyyy') : "Select Date"}
        </div>
      </div>
    </div>
  ));

  return (
    <section className="relative z-40 -mt-12 md:-mt-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Sleek Floating Pill Container */}
        <div className="bg-[#0f110c]/80 backdrop-blur-2xl border border-white/10 md:rounded-full rounded-3xl p-2 md:p-3 shadow-[0_20px_40px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full">

          {/* Calendar Picker Section */}
          <div className="flex-1 w-full md:w-auto flex justify-center text-center">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              customInput={<DualBoxTrigger />}
              minDate={new Date()}
            />
          </div>

          <div className="w-full h-px md:w-px md:h-10 bg-white/10 md:mx-4" />

          {/* Guest Selector Section */}
          <div className="relative px-4 py-2 cursor-pointer group flex flex-col items-center md:items-start w-full md:w-auto" ref={dropdownRef} onClick={() => setIsGuestOpen(!isGuestOpen)}>
            <label className="block text-[8px] uppercase tracking-[0.3em] text-amber-600 font-bold mb-1 cursor-pointer">Guests</label>
            <div className="text-white/90 text-sm md:text-base font-cinzel tracking-wider flex items-center justify-center gap-2 group-hover:text-white transition-colors">
              <span>{totalGuests} <span className="opacity-50 ml-1 text-[10px] font-sans">Travelers</span></span>
              <span className={`text-[8px] text-amber-500/50 transition-transform duration-300 ${isGuestOpen ? 'rotate-180' : ''}`}>▼</span>
            </div>

            {isGuestOpen && (
              <div className="absolute top-full right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 mt-6 w-[280px] p-6 bg-[#0f110c]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl z-[100] animate-fadeIn">
                <CounterRow label="Adults" subLabel="Ages 18+" type="adults" value={guests.adults} />
                <CounterRow label="Seniors" subLabel="Ages 65+" type="seniors" value={guests.seniors} />
                <CounterRow label="Infants" subLabel="Under 2" type="infants" value={guests.infants} />
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleCheckAvailability}
            className="w-full md:w-auto bg-amber-600 text-white md:rounded-full rounded-2xl px-10 py-4 md:py-4 text-[10px] uppercase tracking-[0.3em] font-black transition-all hover:bg-amber-500 hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] md:ml-2 mt-2 md:mt-0"
          >
            Check Availability
          </button>

        </div>
      </div>
    </section>
  );
}