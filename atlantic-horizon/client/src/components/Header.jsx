import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GiftCard from './GiftCard'; 
// nav bar with dropdowns for desktop and accordion style for mobile, also includes the Gift Card modal trigger
const NAV_ITEMS = [
  {
    label: 'Experience',
    links: [
      { name: 'Michelin Quality Food', path: '/michelineQualityFood' },
      { name: 'Continental Breakfast', path: '/continentalBreakfast' },
      { name: 'Local Irish Excursion', path: '/localIrishExcursion' },
      { name: 'Private Chauffeur', path: '/privateChauffer' },
      { name: 'Honeymoon Package', path: '/honeymoonPackage' },
    ],
  },
  {
    label: 'Spa & Wellness',
    links: [
      { name: 'Sauna', path: '/sauna' },
      { name: 'Facial', path: '/facial' },
      { name: 'Hottub', path: '/hottub' },
      { name: 'Jacuzzi', path: '/jacuzzi' },
      { name: 'Massage', path: '/massage' },
    ],
  },
  {
    label: 'Inclusive Resort',
    links: [
      { name: 'Private Lodges', path: '/lodges' },
      { name: 'Private Residences & Villas', path: '/villas' },
      { name: 'Ultimate Exclusivity', path: '/exclusivity' },
    ],
  },
];

export default function Header() {
  const [isGiftCardOpen, setIsGiftCardOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // for mobile accordion

  return (
    <>
      <header className="bg-manorGreen text-manorGold flex items-center justify-between px-6 lg:px-10 h-24 lg:h-36 sticky top-0 z-50">
        
        {/*LEFT: Hamburger (mobile) + Desktop Nav*/}
        <div className="flex items-center gap-10 flex-1">
          {/* Hamburger only on mobile */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-manorGold transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-manorGold transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-manorGold transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-10 relative">
            {NAV_ITEMS.map((cat) => (
              <div key={cat.label} className="relative group">
                <button className="pb-2 text-manorGold uppercase tracking-[2px] font-cinzel text-sm whitespace-nowrap">
                  {cat.label}
                </button>
                <div className="absolute left-0 top-full mt-4 w-56 bg-[#2f3a33] text-white rounded-md shadow-xl
                                opacity-0 invisible translate-y-3 z-50
                                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                                transition-all duration-300">
                  <div className="flex flex-col py-3 text-sm">
                    {cat.links.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="mx-3 my-1 px-4 py-2 text-sm font-light
                                   border border-transparent rounded-full
                                   hover:border-manorGold hover:text-manorGold
                                   transition-all duration-300"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/*CENTER: Logo*/}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <Link to="/">
            <img
              src="/images/Logo.png"
              alt="The Atlantic Horizon Manor Logo"
              className="h-20 lg:h-32 w-auto transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>

        {/*RIGHT: Action Buttons*/}
        <div className="flex gap-2 sm:gap-4 lg:gap-6 flex-1 justify-end items-center">
          
          <Link 
            to="/check-in"
            className="flex items-center"
            title="Self Check-In"
          >
            {/* Desktop: Button Style */}
            <span className="hidden lg:inline-block border border-manorGold text-manorGold px-4 py-2 text-[10px] uppercase tracking-wider transition-all duration-300 hover:bg-manorGold hover:text-manorGreen hover:-translate-y-0.5 hover:shadow-lg">
              Self Check-In
            </span>

            {/* Mobile: Custom Icon Design */}
            <div className="lg:hidden w-8 h-8 border-2 border-manorGold rounded-md relative flex flex-col items-center justify-center overflow-hidden active:scale-95 transition-all text-manorGold">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-manorGold/20 flex justify-around items-center px-1">
                {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-manorGold rounded-full" />)}
              </div>
              <div className="flex flex-col items-center mt-1.5">
                <span className="text-[5px] leading-tight font-black tracking-tighter">CHECK</span>
                <div className="flex items-center gap-0.5">
                  <span className="text-[5px] leading-tight font-black tracking-tighter">IN</span>
                  <span className="text-[6px] leading-none">←</span>
                </div>
              </div>
            </div>
          </Link>

          <Link 
            to="/gift-cards"
            className="hidden sm:block border border-manorGold text-manorGold px-3 py-2 text-[10px] lg:px-4 uppercase tracking-wider transition-all duration-300 hover:bg-manorGold hover:text-manorGreen hover:-translate-y-0.5 hover:shadow-lg"
          >
            Gift Card
          </Link>
        </div>

        {isGiftCardOpen && <GiftCard onClose={() => setIsGiftCardOpen(false)} />}
      </header>

      {/*MOBILE DROP-DOWN MENU (slides from below header)*/}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-24 left-0 right-0 bottom-0 z-[45] flex flex-col">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          
          {/* Dropdown Panel - slides from top */}
          <div className="relative bg-[#1e2219] w-full shadow-2xl border-b border-white/10 animate-slideDown overflow-y-auto max-h-full" style={{borderTop: '2px solid rgba(212,197,161,0.3)'}}>

            <nav className="px-4 pt-2 pb-4">
              {NAV_ITEMS.map((cat) => (
                <div key={cat.label} className="border-b border-white/5">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === cat.label ? null : cat.label)}
                    className="flex justify-between items-center w-full py-4 text-manorGold uppercase tracking-[2px] font-cinzel text-xs text-left"
                  >
                    {cat.label}
                    <span className={`transition-transform ${openDropdown === cat.label ? 'rotate-180' : ''}`}>▾</span>
                  </button>
                  {openDropdown === cat.label && (
                    <div className="pb-3 pl-3 space-y-1">
                      {cat.links.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-2 px-4 text-xs text-white/70 hover:text-manorGold border-l border-white/10 hover:border-manorGold transition-all"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-6 pb-4 space-y-3">
                <Link 
                  to="/gift-cards"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full border border-manorGold text-manorGold py-3 text-[10px] uppercase tracking-wider text-center hover:bg-manorGold hover:text-manorGreen transition-all"
                >
                  Gift Card
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}