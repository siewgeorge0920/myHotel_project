import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GiftCard from './GiftCard'; 
import logo from '../assets/images/Logo.png'; 

export default function Header() {
  // 1. Define the state to control the Gift Card modal
  const [isGiftCardOpen, setIsGiftCardOpen] = useState(false);

  return (
    // Sticky top navigation bar with luxury theme styling
    <header className="bg-manorGreen text-manorGold flex items-center justify-between px-10 h-36 sticky top-0 z-50">
      
      {/* ================= LEFT SECTION ================= */}
      {/* Contains desktop navigation menu */}
      <div className="flex items-center gap-10 flex-1">

        {/* Desktop navigation (hidden on small screens) */}
        <nav className="hidden lg:flex gap-10 relative">
  
          {/* -------- EXPERIENCE DROPDOWN -------- */}
          {/* -------- Lincoln -------- */}
          <div className="relative group">
            
            {/* Main nav button */}
            <button className="pb-2 text-manorGold uppercase tracking-[2px] font-cinzel text-sm">
              Experience
            </button>

            {/* Dropdown panel (appears on hover) */}
            <div className="absolute left-0 top-full mt-4 w-56 bg-[#2f3a33] text-white rounded-md shadow-xl
                            opacity-0 invisible translate-y-3
                            group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                            transition-all duration-300">

              {/* Dropdown links list */}
              <div className="flex flex-col py-3 text-sm">
                {[
                  "Michelin Quality Food",
                  "Continental Breakfast",
                  "Local Irish Excursion",
                  "Private Chauffeur",
                  "Honeymoon Package",
                ].map((item) => (
                  <Link
                    key={item}
                    to="#" // Change this to your actual route later (e.g., "/michelin-food")
                    className="mx-3 my-1 px-4 py-2 text-sm font-light
                               border border-transparent rounded-full
                               hover:border-manorGold hover:text-manorGold
                               transition-all duration-300"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>

        {/* -------- SPA & WELLNESS DROPDOWN -------- */}
        {/* -------- Derrick -------- */}
          <div className="relative group">
            <button className="pb-2 text-manorGold uppercase tracking-[2px] font-cinzel text-sm">
              Spa & Wellness
            </button>

            {/* Note: I added z-50 here to ensure the dropdown doesn't hide behind page content! */}
            <div className="absolute left-0 top-full mt-4 w-56 bg-[#2f3a33] text-white rounded-md shadow-xl
                            opacity-0 invisible translate-y-3 z-50
                            group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                            transition-all duration-300">

              <div className="flex flex-col py-3 text-sm">
                {[
                  { name: "Sauna", path: "/spa/sauna" },
                  { name: "Facial", path: "/spa/facial" },
                  { name: "Private Exclusive Jacuzzi", path: "/spa/jacuzzi" },
                  { name: "Hot Tub", path: "/spa/hottub" },
                  { name: "Massage", path: "/spa/massage" },
                ].map((item) => (
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

          {/* -------- INCLUSIVE RESORT DROPDOWN -------- */}
          {/* -------- George -------- */}
          <div className="relative group">
            <button className="pb-2 text-manorGold uppercase tracking-[2px] font-cinzel text-sm">
              Inclusive Resort
            </button>

            <div className="absolute right-0 top-full mt-4 w-56 bg-[#2f3a33] text-white rounded-md shadow-xl
                            opacity-0 invisible translate-y-3
                            group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                            transition-all duration-300">

              <div className="flex flex-col py-3 text-sm">
                {[
                  "Private Lodges",
                  "Private Residences & Villas",
                  "Ultimate Exclusivity",
                ].map((item) => (
                  <Link
                    key={item}
                    to="#"
                    className="mx-3 my-1 px-4 py-2 text-sm font-light
                               border border-transparent rounded-full
                               hover:border-manorGold hover:text-manorGold
                               transition-all duration-300"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </nav>
      </div>

      {/* ================= CENTER SECTION ================= */}
      {/* Hotel logo */}
      <div className="flex-1 flex justify-center">
        <Link to="/">
          <img
            src={logo}
            alt="The Atlantic Horizon Manor Logo"
            className="h-32 w-auto transition-transform duration-300 hover:scale-105"
          />
        </Link>
      </div>

      {/* ================= RIGHT SECTION ================= */}
      {/* Action buttons (booking + gift card) */}
      <div className="flex gap-3 flex-1 justify-end">

        {/* Gift Card navigation link */}
        <button 
          onClick={() => setIsGiftCardOpen(true)}
          className="border border-manorGold text-manorGold px-4 py-2 text-xs uppercase tracking-wider hidden lg:inline-block transition-all duration-300 hover:bg-manorGold hover:text-manorGreen hover:-translate-y-0.5 hover:shadow-lg"
        >
          Gift Card
        </button>

        {/* Book To Dine button */}
        <button className="border border-manorGold text-manorGold px-4 py-2 text-xs uppercase tracking-wider hidden lg:inline-block transition-all duration-300 hover:bg-manorGold hover:text-manorGreen hover:-translate-y-0.5 hover:shadow-lg">
          My Booking Status
        </button>

        {/* Book To Stay button */}
        <button className="bg-[#c5a898] text-white px-4 py-2 text-xs uppercase tracking-wider transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg">
          Inquiry
        </button>

        {/* 4. Render the modal if isGiftCardOpen is true */}
        {isGiftCardOpen && (
          <GiftCard onClose={() => setIsGiftCardOpen(false)} />
        )}

      </div>
    </header>
  );
}