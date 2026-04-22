import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import DatePickerModule from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { COLORS } from '../colors';

const DatePicker = DatePickerModule.default || DatePickerModule;

export default function BookingFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  
  //  States 
  // 0: Category, 1: Selection, 2: Enhance Stay (Add-ons), 3: Details, 4: Payment, 5: Success
  const [bookingStep, setBookingStep] = useState(0); 
  const [category, setCategory] = useState(null); 
  const [selectedItem, setSelectedItem] = useState(null);
  const [addons, setAddons] = useState({ breakfast: false, spa: false, chauffeur: false });
  const [soldOutItems, setSoldOutItems] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const abortControllerRef = useRef(null);

  const bookingData = location.state || {};
  const [checkIn, setCheckIn] = useState(bookingData.startDate ? new Date(bookingData.startDate) : new Date());
  const [checkOut, setCheckOut] = useState(bookingData.endDate ? new Date(bookingData.endDate) : new Date(new Date().setDate(new Date().getDate() + 1)));
  const nights = Math.max(differenceInDays(checkOut, checkIn), 1);
  const [guestDetails, setGuestDetails] = useState(bookingData.guestDetails || { adults: 2, seniors: 0, infants: 0 });
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [tempDateRange, setTempDateRange] = useState([checkIn, checkOut]);
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    requests: ''
  });
  const [bookingError, setBookingError] = useState(null);
  const [giftCardInfo, setGiftCardInfo] = useState({ code: '', balance: 0, applied: false });
  const [gcLoading, setGcLoading] = useState(false);
  const [gcMsg, setGcMsg] = useState('');

  // Helper: advance step AND scroll to top
  const goToStep = (step) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setBookingStep(step);
  };

  // --- Mock Data (Added Facility and Package) ---
  const products = {
    lodge: [
      { 
        name: 'Standard Lodge (King)', price: 450, 
        img: '/images/RoomTypes/Superior(Entry(King Bed(Double)))/view2.webp',
        facilities: ['32m²', 'King Bed', 'City View', 'Rain Shower'],
        packages: ['Free WiFi', 'Non-smoking'],
        rating: 9.0 
      },
      { 
        name: 'Deluxe Lodge (Double)', price: 650, 
        img: '/images/RoomTypes/premium/balcony.avif',
        facilities: ['55m²', 'Double Queen Bed', 'Sea View Balcony', 'Mini Bar'],
        packages: ['Free Breakfast', 'Free Cancellation'],
        rating: 9.4 
      }
    ],
    residence: [
      { 
        name: 'Atlantic Private Estate', price: 2500, 
        img: '/images/RoomTypes/ultimate/view6.avif',
        facilities: ['Private Land', 'Personal Gym', 'Home Cinema', 'Gourmet Kitchen'],
        packages: ['24/7 Butler Service', 'Airport Transfer', 'Daily Housekeeping'],
        rating: 9.9 
      }
    ],
    ultimate: [
      { 
        name: 'The Sovereign Mansion', price: 5500, 
        img: '/images/RoomTypes/ultimate/livingRoom.jpg',
        facilities: ['Private Helipad', 'Infinity Pool', 'Wine Cellar', 'Bulletproof Glass'],
        packages: ['Personal Helicopter Service', 'Michelin Private Chef', 'Elite Security'],
        rating: 10.0 
      }
    ]
  };

  // Calculate total price based on selection, nights, add-ons, and gift card
  const calculateTotal = () => {
    let total = selectedItem ? selectedItem.price * nights : 0;
    
    // Addons calculation
    if (addons.breakfast) {
      const totalGuests = (guestDetails.adults || 0) + (guestDetails.seniors || 0) + (guestDetails.infants || 0);
      total += (25 * nights * totalGuests);
    }
    if (addons.spa) total += 150;
    
    // Apply Gift Card Deduction
    if (giftCardInfo.applied && giftCardInfo.balance) {
      const balance = parseFloat(giftCardInfo.balance);
      console.log(`[DEBUG] Applying Gift Card: Deducting €${balance} from €${total}`);
      total = Math.max(0, total - balance);
    }
    
    return total;
  };

  const handleApplyGiftCard = async () => {
    if (!giftCardInfo.code) return;
    setGcLoading(true);
    setGcMsg('');
    try {
      const res = await fetch('/api/gift-cards/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: giftCardInfo.code })
      });
      const data = await res.json();
      if (res.ok) {
        setGiftCardInfo(p => ({ ...p, balance: data.balance, applied: true }));
        setGcMsg(data.message);
      } else {
        setGcMsg(data.error);
        setGiftCardInfo(p => ({ ...p, applied: false }));
      }
    } catch (e) {
      setGcMsg('System error validating code');
    } finally {
      setGcLoading(false);
    }
  };

  // Check availability whenever category, dates, or step 1 is active. Uses AbortController
  useEffect(() => {
    if (bookingStep === 1) {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;
      
      setIsChecking(true);
      
      fetch('/api/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkIn, checkOut }),
        signal: controller.signal
      })
      .then(res => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then(data => { 
        if (!controller.signal.aborted) {
          setSoldOutItems(data.data?.bookedRooms || []); 
          setIsChecking(false); 
        }
      })
      .catch(err => { 
        if (err.name !== 'AbortError' && !controller.signal.aborted) {
          console.error("Check availability failed", err);
          setIsChecking(false); 
        }
      });
    }
  }, [bookingStep, checkIn.getTime(), checkOut.getTime()]); // Fix infinite loop by tracking timestamp instead of object ref

  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookingSubmit = async () => {
    setBookingError(null);
    setIsSubmitting(true);
    
    try {
      const deptMap = { lodge: 'Private Lodge', residence: 'Private Residence', ultimate: 'Ultimate Exclusivity' };
      const realDepartment = deptMap[category] || category;

      // Step 1: Create the Booking record in our DB (status = Pending)
      const bookingRes = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkIn,
          checkOut,
          department: realDepartment,
          roomName: selectedItem.name,
          guestEmail: guestInfo.email,
          guestFirstName: guestInfo.firstName,
          guestLastName: guestInfo.lastName,
          guestPhone: guestInfo.phone,
          guestAddress: guestInfo.address,
          price: calculateTotal(),
          paymentStatus: calculateTotal() <= 0 ? 'Paid' : 'Unpaid',
          giftCardCode: giftCardInfo.applied ? giftCardInfo.code : null
        })
      });
      
      const bookingData = await bookingRes.json();
      if (!bookingRes.ok) throw new Error(bookingData.message || 'Booking failed');

      // Step 2: Navigate to payment or show success
      if (calculateTotal() <= 0) {
        navigate('/booking-success', { 
          state: { 
            bookingId: bookingData.data.booking_id 
          } 
        });
      } else {
        navigate('/secure-payment', {
          state: {
            bookingId: bookingData.data._id,
            refId: bookingData.data.booking_id,
            selectedRoom: selectedItem,
            totalPrice: calculateTotal(),
            guestInfo: guestInfo,
            nights: nights
          }
        });
      }

    } catch (err) {
      setBookingError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1a1d17] min-h-screen pt-32 pb-20 px-6 text-white font-lato">
      <div className="max-w-6xl mx-auto">

        {/*  Navigation Controls (Top Bar) */}
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
           <button 
             onClick={() => setBookingStep(Math.max(0, bookingStep - 1))}
             disabled={bookingStep === 0 || bookingStep === 5}
             className={`text-[10px] uppercase tracking-[0.3em] font-black flex items-center gap-2 transition-all ${
               bookingStep > 0 && bookingStep < 5 ? 'text-white/40 hover:text-white cursor-pointer' : 'text-white/5 cursor-default'
             }`}
           >
             <span className="text-lg">←</span> Back
           </button>

           <div className="hidden md:flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-[0.4em] text-white/20">Phase</span>
              <span className="text-amber-500 font-serif italic text-lg">{bookingStep + 1} / 5</span>
           </div>

           <button 
             onClick={() => setBookingStep(Math.min(4, bookingStep + 1))}
             disabled={bookingStep >= 4 || (bookingStep === 1 && !selectedItem) || (bookingStep === 3 && (!guestInfo.email || !guestInfo.firstName))}
             className={`text-[10px] uppercase tracking-[0.3em] font-black flex items-center gap-2 transition-all ${
               bookingStep < 4 ? 'text-amber-500/60 hover:text-amber-500 cursor-pointer' : 'text-white/5 cursor-default'
             }`}
           >
             Continue <span className="text-lg">→</span>
           </button>
        </div>

        {/*  Progress Stepper — Icon Slider */}
        <div className="flex items-center justify-between mb-16 px-1">
          {[
            { icon: '', label: 'Service', step: 0 },
            { icon: '', label: 'Selection', step: 1 },
            { icon: '', label: 'Enhance', step: 2 },
            { icon: '', label: 'Details', step: 3 },
            { icon: '', label: 'Payment', step: 4 },
          ].map((s, i, arr) => {
            const isDone = bookingStep > s.step;
            const isActive = bookingStep === s.step;
            const isClickable = bookingStep > s.step; // Only allow jumping back to completed steps

            return (
              <React.Fragment key={s.label}>
                <div 
                  onClick={() => isClickable && setBookingStep(s.step)}
                  className={`flex flex-col items-center gap-1.5 flex-shrink-0 transition-all ${isClickable ? 'cursor-pointer group' : 'cursor-default'}`}
                >
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm transition-all duration-500 ${
                    isDone ? 'bg-amber-600 border-amber-600 text-white group-hover:bg-amber-500 group-hover:scale-110 shadow-[0_0_15px_rgba(217,119,6,0.2)]' :
                    isActive ? 'bg-amber-600/20 border-amber-500 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-110' :
                    'bg-white/5 border-white/15 text-white/30'
                  }`}>
                    {isDone ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : s.icon}
                  </div>
                  <span className={`hidden sm:block text-[9px] uppercase tracking-widest font-black transition-colors ${
                    isDone ? 'text-amber-500/60 group-hover:text-amber-500' : isActive ? 'text-amber-400' : 'text-white/10'
                  }`}>{s.label}</span>
                </div>
                {/* Connector line */}
                {i < arr.length - 1 && (
                  <div className="flex-1 h-[2px] mx-4 relative">
                    <div className="absolute inset-0 bg-white/5" />
                    <div className={`absolute inset-0 bg-amber-600 transition-all duration-700 origin-left ${
                      bookingStep > s.step ? 'scale-x-100' : 'scale-x-0'
                    }`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/*  Inline Edit Panel - Luxury Style */}
        {isEditingDates && (
          <div className="bg-[#1e2219] border border-amber-600/40 shadow-2xl mb-10 animate-fadeIn overflow-hidden">
            {/* Panel Header */}
            <div className="flex justify-between items-center px-10 py-5 border-b border-white/10">
              <div>
                <p className="text-amber-500 text-[10px] uppercase tracking-[0.4em] font-black">Modify Reservation</p>
                <h3 className="font-cinzel text-lg uppercase tracking-widest text-white">Update Your Search</h3>
              </div>
              <button onClick={() => setIsEditingDates(false)} className="w-8 h-8 flex items-center justify-center border border-white/20 text-white/40 hover:text-white hover:border-white transition-all">✕</button>
            </div>

            <div className="grid md:grid-cols-[1fr_1px_1fr] gap-0">
              {/* Left: Calendar */}
              <div className="p-8">
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-black mb-4">Select Dates</p>
                <DatePicker
                  selectsRange={true}
                  startDate={tempDateRange[0]}
                  endDate={tempDateRange[1]}
                  onChange={(update) => setTempDateRange(update)}
                  minDate={new Date()}
                  inline
                  calendarClassName="!bg-transparent"
                />
              </div>

              {/* Divider */}
              <div className="bg-white/10 hidden md:block" />
              
              {/* Right: Guest Selectors */}
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-black mb-6">Number of Guests</p>
                  
                  {/* Counter Row - reusable inline */}
                  {[
                    { key: 'adults',   label: 'Adults',  sub: 'Ages 18+',   min: 1 },
                    { key: 'seniors',  label: 'Seniors', sub: 'Ages 65+',   min: 0 },
                    { key: 'infants',  label: 'Infants', sub: 'Under 2',    min: 0 },
                  ].map(({ key, label, sub, min }) => (
                    <div key={key} className="flex items-center justify-between py-4 border-b border-white/8 last:border-0">
                      <div>
                        <p className="text-white text-xs font-bold uppercase tracking-widest">{label}</p>
                        <p className="text-[10px] text-white/30 uppercase">{sub}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setGuestDetails(p => {
                            const v = p[key] - 1;
                            if (v < min) return p;
                            return { ...p, [key]: v };
                          })}
                          className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-amber-600 hover:border-amber-600 transition-all text-lg font-bold leading-none"
                        >-</button>
                        <span className="text-white font-cinzel text-xl w-6 text-center">{guestDetails[key]}</span>
                        <button
                          onClick={() => setGuestDetails(p => {
                            const v = p[key] + 1;
                            if (v > 20) return p;
                            return { ...p, [key]: v };
                          })}
                          className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-amber-600 hover:border-amber-600 transition-all text-lg font-bold leading-none"
                        >+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mb-4">
                    {guestDetails.adults + guestDetails.seniors + guestDetails.infants} Traveller{guestDetails.adults + guestDetails.seniors + guestDetails.infants > 1 ? 's' : ''} · {tempDateRange[1] ? Math.max(differenceInDays(tempDateRange[1], tempDateRange[0] || new Date()), 1) : '-'} Nights
                  </p>
                  <button
                    onClick={() => {
                      if (tempDateRange[0]) setCheckIn(tempDateRange[0]);
                      if (tempDateRange[1]) setCheckOut(tempDateRange[1]);
                      setIsEditingDates(false);
                      setSoldOutItems([]);
                    }}
                    className="w-full bg-amber-600 hover:bg-amber-700 py-4 text-[11px] font-black uppercase tracking-[0.4em] shadow-xl transition-colors"
                  >
                    Apply &amp; Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* STEP 0: Service Category Selection */}
        {bookingStep === 0 && (
          <div className="animate-pageTransition">
            <h1 className="font-cinzel text-3xl md:text-4xl text-center mb-10 md:mb-16 tracking-[0.2em]">CHOOSE YOUR EXPERIENCE</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { id: 'lodge', title: 'Private Lodge', desc: 'Hotel + Apartment Style', img: '/images/room1.jpg' },
                { id: 'residence', title: 'Private Residence', desc: 'Premium Land & Facilities', img: '/images/RoomTypes/premium/view.webp' },
                { id: 'ultimate', title: 'Ultimate Exclusivity', desc: 'Mansion + Helicopter Service', img: '/images/RoomTypes/ultimate/view.avif' }
              ].map(item => (
                <div key={item.id} onClick={() => { setCategory(item.id); goToStep(1); }}
                  className="group relative h-[280px] md:h-[500px] cursor-pointer overflow-hidden border border-white/10 hover:border-amber-600 transition-all">
                  <img src={item.img} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-[3000ms]" alt={item.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="font-cinzel text-xl md:text-2xl mb-1 uppercase">{item.title}</h3>
                    <p className="text-[10px] text-amber-500 uppercase tracking-widest font-black">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: Room/Facility Selection */}
        {bookingStep === 1 && (
          <div className="animate-pageTransition space-y-10">
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
               <button onClick={() => setBookingStep(0)} className="text-[10px] uppercase text-white/40 hover:text-white transition-colors">← Back to Category</button>
               <div className="text-right">
                  <h2 className="font-cinzel text-3xl uppercase">{category} Accommodations</h2>
                  <div className="flex items-center justify-end gap-3 mt-1">
                     <p className="text-amber-500 text-[10px] font-bold tracking-widest uppercase">{format(checkIn, 'dd MMM')} — {format(checkOut, 'dd MMM')} | {nights} Nights</p>
                     <button 
                        onClick={() => setIsEditingDates(!isEditingDates)} 
                        className={`text-[9px] uppercase border px-2 py-1 transition-colors ${isEditingDates ? 'bg-amber-600 border-amber-600 text-white' : 'border-white/20 text-white/60 hover:text-white hover:border-white'}`}
                     >
                        Edit
                     </button>
                  </div>
               </div>
            </div>

            <div className="grid gap-8">
              {products[category]?.map((item, idx) => {
                const isSoldOut = soldOutItems.includes(item.name);
                return (
                  <div key={idx} className={`flex flex-col lg:flex-row bg-[#242820] border border-white/5 relative overflow-hidden transition-all ${isSoldOut ? 'opacity-40' : 'hover:border-amber-600/30 shadow-2xl'}`}>
                    <div className="lg:w-1/3 h-72 lg:h-auto overflow-hidden">
                       <img src={item.img} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" alt={item.name} />
                       {isSoldOut && <div className="absolute inset-0 bg-black/70 flex items-center justify-center font-black text-red-500 uppercase tracking-[0.5em] -rotate-12 border-4 border-red-500 m-12">Sold Out</div>}
                    </div>
                    <div className="flex-1 p-8 flex flex-col justify-between">
                       <div className="flex justify-between items-start">
                          <div>
                             <h3 className="font-cinzel text-2xl mb-4">{item.name}</h3>
                             <div className="flex flex-wrap gap-2 mb-6">
                                {item.facilities.map(f => <span key={f} className="text-[9px] uppercase tracking-widest bg-white/5 px-2 py-1 border border-white/10 text-white/50">{f}</span>)}
                             </div>
                             <div className="space-y-1">
                                {item.packages.map(p => <div key={p} className="text-[11px] text-green-400 font-bold uppercase tracking-widest flex items-center gap-2"><span>✔</span> {p}</div>)}
                             </div>
                          </div>
                          <div className="text-right">
                             <span className="bg-amber-600 px-2 py-1 text-[10px] font-black">⭐ {item.rating}</span>
                          </div>
                       </div>
                       <div className="flex justify-between items-end pt-8 border-t border-white/5 mt-8">
                          <div>
                             <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Total Stay Price</p>
                             <p className="text-4xl font-georgia italic text-amber-500">
                               €{item.price * nights}
                               <span className="text-lg text-white/40 ml-3 font-lato not-italic tracking-normal">/ {nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                             </p>
                          </div>
                          <button 
                            disabled={isSoldOut || isChecking}
                            onClick={() => { setSelectedItem(item); goToStep(2); }}
                            className={`px-12 py-4 text-[11px] font-black uppercase tracking-[0.3em] ${isSoldOut ? 'bg-gray-700' : 'bg-amber-600 hover:bg-amber-700 shadow-xl'} transition-all`}
                          >
                            {isChecking ? 'Checking...' : 'Reserve Now'}
                          </button>
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: ENHANCE YOUR STAY  */}
        {bookingStep === 2 && (
          <div className="max-w-4xl mx-auto animate-pageTransition">
             <h2 className="font-cinzel text-3xl text-center mb-12">ENHANCE YOUR SANCTUARY</h2>
             <div className="grid md:grid-cols-3 gap-6 mb-16">
                {[
                  { id: 'breakfast', label: 'Manor Breakfast', price: '€25 / Person', img: '/images/food.jpg' },
                  { id: 'spa', label: 'Derrick\'s Spa Ritual', price: '€150 / Session', img: '/images/hot-spring.jpg' },
                  { id: 'chauffer', label: 'Lincoln\'s Chauffeur', price: 'On Request', img: '/images/main3.jpg' }
                ].map(opt => (
                  <div key={opt.id} onClick={() => setAddons(p => ({...p, [opt.id]: !p[opt.id]}))} className={`relative p-6 border transition-all cursor-pointer ${addons[opt.id] ? 'border-amber-600 bg-amber-600/5' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
                     <img src={opt.img} className="w-full h-32 object-cover mb-4" alt={opt.label} />
                     <h4 className="font-cinzel text-lg uppercase mb-2">{opt.label}</h4>
                     <p className="text-xs text-amber-500 font-bold">{opt.price}</p>
                     {addons[opt.id] && <div className="absolute top-4 right-4 text-amber-500 text-xl font-black">SELECTED</div>}
                  </div>
                ))}
             </div>
             <div className="flex flex-row justify-between items-center bg-[#242820] px-8 py-5 gap-4">
                <div>
                   <p className="text-[10px] opacity-40 uppercase tracking-widest mb-0.5">New Estimate</p>
                   <p className="text-2xl font-georgia italic">€{calculateTotal()}</p>
                </div>
                <button 
                   onClick={() => goToStep(3)} 
                   className="flex-shrink-0 bg-amber-600 hover:bg-amber-700 transition-colors px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] shadow-lg"
                >
                   Confirm &amp; Continue
                </button>
             </div>
          </div>
        )}

        {/* STEP 3: GUEST DETAILS  */}
        {bookingStep === 3 && (
          <div className="max-w-xl mx-auto animate-pageTransition">
             <h2 className="font-cinzel text-3xl text-center mb-10">GUEST INFORMATION</h2>
             <div className="space-y-6 bg-white/5 p-12 border border-white/10 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                   <input 
                     value={guestInfo.firstName}
                     onChange={(e) => setGuestInfo({...guestInfo, firstName: e.target.value})}
                     placeholder="FIRST NAME" 
                     className="bg-transparent border-b border-white/20 p-4 text-xs outline-none focus:border-amber-500 transition-all" 
                   />
                   <input 
                     value={guestInfo.lastName}
                     onChange={(e) => setGuestInfo({...guestInfo, lastName: e.target.value})}
                     placeholder="LAST NAME" 
                     className="bg-transparent border-b border-white/20 p-4 text-xs outline-none focus:border-amber-500 transition-all" 
                   />
                </div>
                <input 
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                  type="email"
                  placeholder="EMAIL ADDRESS" 
                  className="w-full bg-transparent border-b border-white/20 p-4 text-xs outline-none focus:border-amber-500 transition-all font-light" 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                   <input 
                     value={guestInfo.phone}
                     onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                     placeholder="PHONE NUMBER" 
                     className="bg-transparent border-b border-white/20 p-4 text-xs outline-none focus:border-amber-500 transition-all font-light" 
                   />
                   <input 
                     value={guestInfo.address}
                     onChange={(e) => setGuestInfo({...guestInfo, address: e.target.value})}
                     placeholder="CONTACT ADDRESS (OPTIONAL)" 
                     className="bg-transparent border-b border-white/20 p-4 text-xs outline-none focus:border-amber-500 transition-all font-light" 
                   />
                </div>
                <textarea 
                  value={guestInfo.requests}
                  onChange={(e) => setGuestInfo({...guestInfo, requests: e.target.value})}
                  placeholder="SPECIAL REQUESTS (OPTIONAL)" 
                  className="w-full bg-transparent border border-white/10 p-4 text-xs h-32 outline-none focus:border-amber-500 transition-all mt-4"
                ></textarea>
                <button 
                  disabled={!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone}
                  onClick={() => goToStep(4)} 
                  className="w-full bg-amber-600 disabled:bg-gray-700 py-5 text-[11px] font-black uppercase tracking-[0.4em] mt-8 transition-colors"
                >
                  Secure Your Dates
                </button>
             </div>
          </div>
        )}

        {/* STEP 4: PAYMENT (Stripe sandbox*/}
        {bookingStep === 4 && (
          <div className="max-w-md mx-auto animate-pageTransition text-center">
             <h2 className="font-cinzel text-2xl mb-12 tracking-widest">FINAL REVIEW</h2>
             
             <div className="bg-[#242820] p-10 mb-8 text-left border-t-4 border-amber-600 space-y-6 shadow-2xl">
                {/* Handwriting Format Layout */}
                <div className="flex justify-between border-b border-white/5 pb-3">
                   <span className="text-[10px] uppercase opacity-40 font-bold tracking-widest">Date</span>
                   <span className="text-xs font-bold">{format(checkIn, 'dd/MM/yyyy')} — {format(checkOut, 'dd/MM/yyyy')}</span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-3">
                   <span className="text-[10px] uppercase opacity-40 font-bold tracking-widest">Travelers</span>
                   <span className="text-xs font-bold uppercase">{guestDetails.adults + guestDetails.seniors + guestDetails.infants} totals</span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-3">
                   <span className="text-[10px] uppercase opacity-40 font-bold tracking-widest">stay</span>
                   <span className="text-xs font-bold uppercase">{category === 'lodge' ? 'private lodge' : category === 'residence' ? 'private residence' : 'ultimate exclusivity'}</span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-3">
                   <span className="text-[10px] uppercase opacity-40 font-bold tracking-widest">Add-ons</span>
                   <span className="text-xs font-bold uppercase">
                     {[addons.breakfast && 'Breakfast', addons.spa && 'Spa'].filter(Boolean).join(', ') || 'None'}
                   </span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-3">
                   <span className="text-[10px] uppercase opacity-40 font-bold tracking-widest">Guest</span>
                   <span className="text-xs font-bold uppercase">{guestInfo.firstName} {guestInfo.lastName}</span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-3">
                   <span className="text-[10px] uppercase opacity-40 font-bold tracking-widest">Email</span>
                   <span className="text-xs font-bold lowercase">{guestInfo.email}</span>
                </div>

                <div className="flex justify-between items-end pt-4">
                   <span className="text-[10px] uppercase font-black text-amber-500 tracking-widest">Total amount</span>
                   <div className="text-right">
                      <span className="text-3xl font-georgia italic text-white">€{calculateTotal()}</span>
                      <span className="text-[10px] text-white/40 ml-2 font-lato not-italic tracking-normal">/ {nights} {nights === 1 ? 'night' : 'nights'}</span>
                   </div>
                </div>
             </div>

             {/* Gift Card Input */}
             <div className="bg-white/5 border border-white/10 p-6 mb-8 text-left rounded-xl">
                <p className="text-[10px] uppercase font-black tracking-widest text-amber-500 mb-3">Gift Card / Promo Code</p>
                <div className="flex gap-2">
                   <input 
                     type="text" 
                     placeholder="ATH-XXXX-XXXX"
                     value={giftCardInfo.code}
                     onChange={(e) => {
                        const val = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                        let formatted = val;
                        if (val.length > 3) {
                          formatted = val.substring(0, 3) + '-' + val.substring(3);
                        }
                        if (val.length > 8) { // 3 + 1 + 4 + 1
                          formatted = formatted.substring(0, 8) + '-' + formatted.substring(8, 12);
                        }
                        setGiftCardInfo({...giftCardInfo, code: formatted.substring(0, 13)});
                      }}
                     className="flex-1 bg-black/20 border border-white/10 px-4 py-3 rounded-lg text-xs outline-none focus:border-amber-500 uppercase tracking-widest font-mono"
                   />
                   <button 
                     onClick={handleApplyGiftCard}
                     type="button"
                     disabled={gcLoading}
                     className="bg-amber-600 hover:bg-amber-700 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg disabled:opacity-50"
                   >
                     {gcLoading ? '...' : giftCardInfo.applied ? 'Applied' : 'Apply'}
                   </button>
                </div>
                {gcMsg && (
                  <p className={`mt-2 text-[10px] uppercase tracking-widest font-black ${giftCardInfo.applied ? 'text-emerald-500' : 'text-red-500'}`}>
                    {gcMsg}
                  </p>
                )}
             </div>

             <button 
                onClick={handleBookingSubmit}
                disabled={isSubmitting}
                className={`w-full ${calculateTotal() <= 0 ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#6772e5] hover:bg-indigo-600'} disabled:opacity-60 disabled:cursor-not-allowed py-5 text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 shadow-2xl transition-all`}
             >
                {isSubmitting ? '↻ Processing...' : calculateTotal() <= 0 ? '✓ Complete Booking Free' : 'Pay Now'}
             </button>
             {bookingError && (
                <div className="mt-6 p-4 border border-red-500/50 bg-red-500/10 text-red-500 text-sm font-bold uppercase tracking-widest">
                   {bookingError}
                </div>
             )}
          </div>
        )}

        {/* STEP 5: SUCCESS  */}
        {bookingStep === 5 && (
          <div className="text-center py-20 animate-fadeIn">
            <div className="text-6xl mb-8"></div>
            <h2 className="font-cinzel text-6xl mb-6">THE KEYS ARE YOURS</h2>
            <p className="opacity-60 italic mb-12 max-w-md mx-auto leading-loose">A confirmation of your sanctuary has been dispatched to your inbox. We await your arrival on {format(checkIn, 'dd MMM')}.</p>
            <button onClick={() => navigate('/')} className="border border-white/20 px-16 py-5 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">Return to Manor Grounds</button>
          </div>
        )}

      </div>
    </div>
  );
}