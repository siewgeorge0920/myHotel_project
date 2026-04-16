import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ 
  onOpenCookies, onOpenPrivacy, onOpenCareers, onOpenContact,
  onOpenFaqs, onOpenBlog, onOpenParking, onOpenLocation, onOpenGallery 
}) { 
  // 1. Array of objects to map names to their functions
  const linkItems = [
    { name: "Gallery", action: onOpenGallery }, 
    { name: "Location", action: onOpenLocation },
    { name: "Parking", action: onOpenParking },
    { name: "Blog", action: onOpenBlog },
    { name: "FAQs", action: onOpenFaqs },
    { name: "Careers", action: onOpenCareers },
    { name: "Contact Us", action: onOpenContact },
    { name: "Privacy Policy", action: onOpenPrivacy }, // Fixed typo from "Private" to "Privacy"
    { name: "Cookies", action: onOpenCookies }
  ];

  // 2. Smooth scroll function to prevent Lenis conflicts
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative text-manorGold py-16 px-[5%] text-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center blur-m scale-110" style={{ backgroundImage: "url('/images/main2.webp')" }}></div>
      <div className="absolute inset-0 bg-manorGreen/80"></div>

      <div className="relative z-10">
        <div className="scroll-top-area mb-10">
          {/* Changed <a> to <button> and attached scrollToTop */}
          <button 
            onClick={scrollToTop} 
            className="scroll-btn inline-flex items-center justify-center w-12 h-12 bg-manorRose text-manorGreen rounded-full text-2xl mb-2 transition hover:-translate-y-1 hover:bg-white"
            aria-label="Return to top"
          >
            ↑
          </button>
          <p className="text-[12px] uppercase tracking-[1px]">Return To Top</p>
        </div>

        <nav className="footer-nav flex flex-wrap justify-center gap-5 my-10 border-y border-manorGold/20 py-5">
          {linkItems.map((item) => (
            <button 
              key={item.name} 
              onClick={item.action} 
              className="text-manorRose text-sm tracking-wide hover:text-white transition"
            >
              {item.name}
            </button>
          ))}
        </nav>

        <div className="footer-details">
          <p className="font-georgia mb-2 font-semibold text-manorGold">The Atlantic Horizon Manor</p>
          <p className="font-georgia mb-4 text-manorGold/80">Wild Atlantic Way, Southwest Ireland</p>

          <div className="social-icons flex justify-center gap-8 my-6 text-2xl">
            <a href="#" className="text-white hover:text-manorRose transition"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="text-white hover:text-manorRose transition"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="text-white hover:text-manorRose transition"><i className="fa-brands fa-tiktok"></i></a>
          </div>

          <div className="contact-line text-[13px] mt-4 opacity-80">
            <span>Phone: +353 021 773656373</span> | <span>Email: info@theatlantichorizon.ie</span>
          </div>

          {/* Invisible Staff Login Button */}
          <div className="mt-10">
            <Link 
              to="/login"
              className="inline-block border border-transparent px-6 py-2 text-[10px] uppercase tracking-[0.4em] text-transparent hover:text-manorGold hover:border-manorGold/40 transition-all duration-1000"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}