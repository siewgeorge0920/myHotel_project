import React from 'react';

// 1. Added onOpenFaqs and onOpenBlog to the props
export default function Footer({ 
  onOpenCookies, 
  onOpenPrivacy, 
  onOpenCareers, 
  onOpenContact,
  onOpenFaqs, 
  onOpenBlog,
  onOpenParking,
  onOpenLocation

}) { 
  // Footer navigation links
  const links = [
    "Gallery",
    "Location",
    "Parking",
    "Blog",
    "FAQs",
    "Careers",
    "Contact Us",
    "Private Policy",
    "Cookies"
  ];

  return (
    // Footer container with blurred background image and dark overlay
    <footer className="relative text-manorGold py-16 px-[5%] text-center overflow-hidden">
      
      {/* Background image (blurred and slightly scaled for depth effect) */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-m scale-110"
        style={{ backgroundImage: "url('/src/assets/images/main2.webp')" }}
      ></div>

      {/* Dark overlay to improve text contrast */}
      <div className="absolute inset-0 bg-manorGreen/80"></div>

      {/* Main footer content (kept above background layers) */}
      <div className="relative z-10">
        
        {/* Scroll-to-top button */}
        <div className="scroll-top-area mb-10">
          <a
            href="#top"
            className="scroll-btn inline-flex items-center justify-center w-12 h-12 bg-manorRose text-manorGreen rounded-full text-2xl mb-2 transition hover:-translate-y-1 hover:bg-white"
          >
            ↑
          </a>
          <p className="text-[12px] uppercase tracking-[1px]">Return To Top</p>
        </div>

        {/* Footer navigation links */}
        <nav className="footer-nav flex flex-wrap justify-center gap-5 my-10 border-y border-manorGold/20 py-5">
          {links.map((link) => {
            
            // 2. Determine if the link should trigger a modal window
            let handleClick = null;
            if (link === "Cookies") handleClick = onOpenCookies;
            else if (link === "Private Policy") handleClick = onOpenPrivacy;
            else if (link === "Careers") handleClick = onOpenCareers;
            else if (link === "Contact Us") handleClick = onOpenContact;
            else if (link === "FAQs") handleClick = onOpenFaqs;
            else if (link === "Blog") handleClick = onOpenBlog; 
            else if (link === "Parking") handleClick = onOpenParking;
            else if (link === "Location") handleClick = onOpenLocation;
            else if (link === "Gallery") handleClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

            // 3. If it has a click handler, render it as a button
            if (handleClick) {
              return (
                <button
                  key={link}
                  onClick={handleClick}
                  className="text-manorRose text-sm tracking-wide hover:text-white transition cursor-pointer"
                >
                  {link}
                </button>
              );
            }
            
            // Otherwise, render a standard navigation link
            return (
                <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-manorRose text-sm tracking-wide hover:text-white transition">
                {link}
                </a>
            );
          })}
        </nav>

        {/* Hotel name and location */}
        <div className="footer-details">
          <p className="font-georgia mb-2 font-semibold">
            The Atlantic Horizon Manor
          </p>
          <p className="font-georgia mb-4">
            Wild Atlantic Way, Southwest Ireland
          </p>

          {/* Social media icons */}
          <div className="social-icons flex justify-center gap-8 my-6 text-2xl">
            <a href="#" aria-label="Instagram" className="text-white hover:text-manorRose transition">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" aria-label="Facebook" className="text-white hover:text-manorRose transition">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="TikTok" className="text-white hover:text-manorRose transition">
              <i className="fa-brands fa-tiktok"></i>
            </a>
          </div>

          {/* Contact information line */}
          <div className="contact-line text-[13px] mt-4 opacity-80">
            <span>Phone: +353 00 000 0000</span> |{" "}
            <span>Email: info@atlantichorizon.ie</span>
          </div>
        </div>

      </div>
    </footer>
  );
}