import React, { Suspense, useEffect, useState, useRef } from 'react'; // Core Fix 1: Remember Import useEffect
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Lenis from 'lenis';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

// --- NEW MODAL IMPORTS ---
import BlogModal from './components/footer/BlogModal';
import CareersModal from './components/footer/CareersModal';
import ContactUsModal from './components/footer/ContactUsModal';
import FaqsModal from './components/footer/FaqsModal';
import LocationModal from './components/footer/LocationModal';
import ParkingModal from './components/footer/ParkingModal';
import PrivacyPolicyModal from './components/footer/PrivacyPolicyModal';

// Guest Pages
import Home from './pages/Home';
import RoomInventory from './pages/roomInventory';
import BookingFlow from './pages/BookingFlow';
import Login from './pages/login';
import GiftCards from './pages/GiftCards';
import GiftCardSuccess from './pages/GiftCardSuccess';
import AdminSettings from './pages/adminSettings';
import AdminGiftCards from './pages/adminGiftCards';
import SelfCheckIn from './pages/SelfCheckIn';
import BookingSuccess from './pages/BookingSuccess';

// Lincoln's Pages (Experience)
import ContinentalBreakfast from './pages/Lincoln/continentalBreakfast';
import HoneymoonPackage from './pages/Lincoln/honeymoonPackage';
import LocalIrishExcursion from './pages/Lincoln/localIrishExcursion';
import MichelineQualityFood from './pages/Lincoln/michelineQualityFood';
import PrivateChauffer from './pages/Lincoln/privateChauffer';

// George's Pages (Resort)
import PrivateLodges from './pages/George/privateLodges';
import PrivateResidences from './pages/George/privateResidencesAndVillas';
import UltimateExclusivity from './pages/George/ultimateExclusivity';

// Derrick's Pages (Wellness)
import Sauna from './pages/Derrick/Sauna';
import Facial from './pages/Derrick/Facial';
import Masaage from './pages/Derrick/Massage'; 
import Hottub from './pages/Derrick/Hottub';
import Jacuzzi from './pages/Derrick/Jacuzzi';

// Staff/Admin Portal
import StaffDashboard from './pages/staffDashboard';
import Inventory from './pages/inventory';
import AdminIAM from './pages/adminIAM';
import AdminCalendar from './pages/adminCalendar';
import RoomManagement from './pages/roomManagement';
import RoomPackage from './pages/roomPackage';
import BookingManagement from './pages/bookingManagement';
import Transactions from './pages/transactions';
import PhysicalRoomManager from './pages/physicalRoomManager';


import PaymentPage from './pages/PaymentPage';
import Logout24Hours from './components/24hoursLogout';

import LuxuryLoader from './components/luxuryLoader';
import CookieWindow from './components/CookieWindow';

const AdminLogs = React.lazy(() => import('./pages/adminLogs'));

// Layout Wrapper (Includes transition effects and Scroll Reset)
const LayoutWrapper = ({ children, onOpenCookies, lenisRef }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  
  //  NEW MODAL STATE 
  const [activeModal, setActiveModal] = useState(null);
  const closeModal = () => setActiveModal(null);

  React.useEffect(() => {
    // 1. Trigger transition
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 800);

    // 2. ⚡ ROBUST SCROLL RESET (Lenis aware)
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }

    return () => clearTimeout(timer);
  }, [location.pathname, lenisRef]);

  // NEW: Handle Gallery Click
  const handleGalleryClick = () => {
    if (location.pathname === '/') {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate('/');
    }
  };

  const isManagement = [
    '/staffdashboard', '/adminiam', '/inventory', '/adminlogs', 
    '/roommanagement', '/roompackage', '/physicalrooms', '/bookings', '/transactions', 
    '/admincalendar', '/admin', '/roominventory'
  ].some(p => location.pathname.toLowerCase().startsWith(p));

  if (isManagement) {
    return (
      <main className="min-h-screen bg-[#1a1d17]">
        {isTransitioning && <LuxuryLoader message="Sanctifying Environment..." />}
        {children}
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header /> 
      <main className="flex-grow" key={location.pathname}>
        {isTransitioning && <LuxuryLoader message="Loading Manor..." />}
        {children}
      </main>
      
      {/*  CONNECTED FOOTER PROPS  */}
      <Footer 
        onOpenBlog={() => setActiveModal('blog')}
        onOpenCareers={() => setActiveModal('careers')}
        onOpenContact={() => setActiveModal('contact')}
        onOpenFaqs={() => setActiveModal('faqs')}
        onOpenLocation={() => setActiveModal('location')}
        onOpenParking={() => setActiveModal('parking')}
        onOpenPrivacy={() => setActiveModal('privacy')}
        onOpenCookies={onOpenCookies}
        onOpenGallery={handleGalleryClick} 
      />

      {/* RENDER ACTIVE MODAL  */}
      {activeModal === 'blog' && <BlogModal onClose={closeModal} />}
      {activeModal === 'careers' && <CareersModal onClose={closeModal} />}
      {activeModal === 'contact' && <ContactUsModal onClose={closeModal} />}
      {activeModal === 'faqs' && <FaqsModal onClose={closeModal} />}
      {activeModal === 'location' && <LocationModal onClose={closeModal} />}
      {activeModal === 'parking' && <ParkingModal onClose={closeModal} />}
      {activeModal === 'privacy' && <PrivacyPolicyModal onClose={closeModal} />}
    </div>
  );
};

export default function App() {
  const [isCookieOpen, setIsCookieOpen] = useState(false);
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    try {
      const savedPreference = localStorage.getItem('ath_cookie_preference');
      if (!savedPreference) {
        setIsCookieOpen(true);
      }
    } catch (error) {
      setIsCookieOpen(true);
    }
  }, []);

  const handleCookieSave = async (preference) => {
    try {
      localStorage.setItem('ath_cookie_preference', preference);
      await fetch('/api/cookie-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preference })
      });
    } catch (error) {
      console.warn("Cookie preference sync failed:", error.message);
    }
    setIsCookieOpen(false);
  };

  return (
    <Router>
      {/* Pass the function to open cookies into the LayoutWrapper */}
      <LayoutWrapper 
        onOpenCookies={() => setIsCookieOpen(true)} 
        lenisRef={lenisRef}
      >
        <Suspense fallback={<p>Loading our luxury experience...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
          <Route path="/admin/gift-cards" element={<AdminGiftCards />} />
          <Route path="/admin" element={<AdminSettings />} />
          <Route path="/calendar" element={<BookingFlow />} />
          <Route path="/login" element={<Login />} />
          <Route path="/secure-payment" element={<PaymentPage />} />
          <Route path="/check-in" element={<SelfCheckIn />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          <Route path="/gift-card-success" element={<GiftCardSuccess />} />
          <Route path="/adminSettings" element={<AdminSettings />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          
          {/* Lincoln's Routes */}
          <Route path="/continentalBreakfast" element={<ContinentalBreakfast />} />
          <Route path="/honeymoonPackage" element={<HoneymoonPackage />} />
          <Route path="/localIrishExcursion" element={<LocalIrishExcursion />} />
          <Route path="/michelineQualityFood" element={<MichelineQualityFood />} />
          <Route path="/privateChauffer" element={<PrivateChauffer />} />

          {/* George's Routes */}
          <Route path="/lodges" element={<PrivateLodges />} />
          <Route path="/villas" element={<PrivateResidences />} />
          <Route path="/exclusivity" element={<UltimateExclusivity />} />

          {/* Derrick's Routes */}
          <Route path="/sauna" element={<Sauna />} />
          <Route path="/facial" element={<Facial />} />
          <Route path="/massage" element={<Masaage />} />
          <Route path="/jacuzzi" element={<Jacuzzi />} />
          <Route path="/hottub" element={<Hottub />} />

          {/* Management Portal */}
          <Route path="/staffDashboard" element={<Logout24Hours><StaffDashboard /></Logout24Hours>} />
          <Route path="/roomInventory" element={<Logout24Hours><RoomInventory /></Logout24Hours>} />
          <Route path="/adminIam" element={<Logout24Hours><AdminIAM /></Logout24Hours>} />
          <Route path="/adminLogs" element={<Logout24Hours><AdminLogs /></Logout24Hours>} />
          <Route path="/roomManagement" element={<Logout24Hours><RoomManagement /></Logout24Hours>} />
          <Route path="/roomPackage" element={<Logout24Hours><RoomPackage /></Logout24Hours>} />
          <Route path="/bookings" element={<Logout24Hours><BookingManagement /></Logout24Hours>} />
          <Route path="/transactions" element={<Logout24Hours><Transactions /></Logout24Hours>} />
          <Route path="/adminCalendar" element={<Logout24Hours><AdminCalendar /></Logout24Hours>} />
          <Route path="/physicalRooms" element={<Logout24Hours><PhysicalRoomManager /></Logout24Hours>} />
          <Route path="/self-check-in" element={<SelfCheckIn />} />
          <Route path="/booking-management" element={<Logout24Hours><BookingManagement /></Logout24Hours>} />


        </Routes>
        </Suspense>
      </LayoutWrapper>

      <CookieWindow
        isOpen={isCookieOpen}
        onClose={() => setIsCookieOpen(false)}
        onSavePreference={handleCookieSave}
      />
    </Router>
  );
}