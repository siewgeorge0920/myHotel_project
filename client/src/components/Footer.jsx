import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ 
  onOpenCookies, onOpenPrivacy, onOpenCareers, onOpenContact,
  onOpenFaqs, onOpenBlog, onOpenParking, onOpenLocation
}) { 
  const links = ["Gallery", "Location", "Parking", "Blog", "FAQs", "Careers", "Contact Us", "Private Policy", "Cookies"];

  return (
    <footer className="relative text-manorGold py-16 px-[5%] text-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center blur-m scale-110" style={{ backgroundImage: "url('/images/main2.webp')" }}></div>
      <div className="absolute inset-0 bg-manorGreen/80"></div>

      <div className="relative z-10">
        <div className="scroll-top-area mb-10">
          <a href="#top" className="scroll-btn inline-flex items-center justify-center w-12 h-12 bg-manorRose text-manorGreen rounded-full text-2xl mb-2 transition hover:-translate-y-1 hover:bg-white" aria-label="Return to top of page">↑</a>
          <p className="text-[12px] uppercase tracking-[1px]">Return To Top</p>
          <div className="flex gap-4 mt-6 max-w-xs mx-auto">
            <input
              type="email"
              placeholder="YOUR EMAIL"
              aria-label="Email address for newsletter subscription"
              className="bg-white/5 border border-manorGold/20 px-4 py-2 text-xs focus:border-manorGold outline-none w-full"
            />
            <button 
              className="bg-manorGold text-manorGreen px-6 py-2 text-[10px] font-bold tracking-widest hover:bg-manorGold/90 transition-colors uppercase"
              aria-label="Subscribe to the Manor newsletter"
            >
              Join
            </button>
          </div>
        </div>

        <nav className="footer-nav flex flex-wrap justify-center gap-5 my-10 border-y border-manorGold/20 py-5">
          {links.map((link) => (
            <button key={link} className="text-manorRose text-sm tracking-wide hover:text-white transition" aria-label={`Navigate to ${link}`}>{link}</button>
          ))}
        </nav>

        <div className="footer-details">
          <p className="font-georgia mb-2 font-semibold text-manorGold">The Atlantic Horizon Manor</p>
          <p className="font-georgia mb-4 text-manorGold/80">Wild Atlantic Way, Southwest Ireland</p>

          <div className="social-icons flex justify-center gap-8 my-6 text-2xl">
            {[
              { icon: 'fa-instagram', label: 'Follow our Instagram' },
              { icon: 'fa-facebook-f', label: 'Follow our Facebook' },
              { icon: 'fa-tiktok', label: 'Follow our TikTok' }
            ].map((social, i) => (
              <a key={i} href="#" className="text-white hover:text-manorRose transition" aria-label={social.label}>
                <i className={`fa-brands ${social.icon}`}></i>
              </a>
            ))}
          </div>

          <div className="contact-line text-[13px] mt-4 opacity-80">
            <span>Phone: +353 00 000 0000</span> | <span>Email: info@atlantichorizon.ie</span>
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