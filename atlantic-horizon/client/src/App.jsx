import React, { Suspense, useEffect, useState } from 'react'; // Core Fix 1: Remember Import useEffect
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
import InventoryManagement from './pages/inventoryManagement';
import CalendarPage from './pages/calendarPage';
import Login from './pages/login';
import GiftCards from './pages/GiftCards';
import GiftCardSuccess from './pages/GiftCardSuccess';
import AdminSettings from './pages/adminSettings';
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
import RoomManagement from './pages/roomManagement';
import RoomPackage from './pages/roomPackage';
import BookingManagement from './pages/bookingManagement';
import Transactions from './pages/transactions';
import AdminCalendar from './pages/adminCalendar';
import RoomService from './pages/roomService';
import PhysicalRoomManager from './pages/physicalRoomManager';
import CrmManagement from './pages/crmManagement';

import PaymentPage from './pages/PaymentPage';
import ProtectedRoute from './components/ProtectedRoute';

import LuxuryLoader from './components/luxuryLoader';
import CookieWindow from './components/CookieWindow';

const AdminLogs = React.lazy(() => import('./pages/adminLogs'));

// Scroll Auto-top Component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0); // Instantly scroll to top on every URL change!
  }, [pathname]);
  return null;
};

// Layout Wrapper (Includes transition effects)
const LayoutWrapper = ({ children, onOpenCookies }) => {
  const location = useLocation();
  const navigate = useNavigate(); // 🌟 Added navigate hook
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  
  // --- NEW MODAL STATE ---
  const [activeModal, setActiveModal] = useState(null);
  const closeModal = () => setActiveModal(null);

  React.useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // NEW: Handle Gallery Click
  const handleGalleryClick = () => {
    if (location.pathname === '/') {
      // If already on Home, smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If on another page, navigate to Home
      navigate('/');
    }
  };

  const isManagement = [
    '/staffdashboard', '/adminiam', '/inventory', '/adminlogs', 
    '/roommanagement', '/roompackage', '/physicalrooms', '/bookings', '/transactions', 
    '/admincalendar', '/roomservice', '/crm'
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
      
      {/* --- CONNECTED FOOTER PROPS --- */}
      <Footer 
        onOpenBlog={() => setActiveModal('blog')}
        onOpenCareers={() => setActiveModal('careers')}
        onOpenContact={() => setActiveModal('contact')}
        onOpenFaqs={() => setActiveModal('faqs')}
        onOpenLocation={() => setActiveModal('location')}
        onOpenParking={() => setActiveModal('parking')}
        onOpenPrivacy={() => setActiveModal('privacy')}
        onOpenCookies={onOpenCookies}
        onOpenGallery={handleGalleryClick} // 🌟 Passed the gallery function here
      />

      {/* --- RENDER ACTIVE MODAL --- */}
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

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
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

  const handleCookieSave = (preference) => {
    try {
      localStorage.setItem('ath_cookie_preference', preference);
    } catch (error) {
      // Ignore storage errors and still close the modal.
    }
    setIsCookieOpen(false);
  };

  return (
    <Router>
      {/* Core Fix 3: ScrollToTop must be inside Router */}
      <ScrollToTop /> 

      {/* Pass the function to open cookies into the LayoutWrapper */}
      <LayoutWrapper onOpenCookies={() => setIsCookieOpen(true)}>
        <Suspense fallback={<p>Loading our luxury experience...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<CalendarPage />} />
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
          <Route path="/staffDashboard" element={<ProtectedRoute><StaffDashboard /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><InventoryManagement /></ProtectedRoute>} />
          <Route path="/adminIam" element={<ProtectedRoute><AdminIAM /></ProtectedRoute>} />
          <Route path="/adminLogs" element={<ProtectedRoute><AdminLogs /></ProtectedRoute>} />
          <Route path="/roomManagement" element={<ProtectedRoute><RoomManagement /></ProtectedRoute>} />
          <Route path="/roomPackage" element={<ProtectedRoute><RoomPackage /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><BookingManagement /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/adminCalendar" element={<ProtectedRoute><AdminCalendar /></ProtectedRoute>} />
          <Route path="/roomService" element={<ProtectedRoute><RoomService /></ProtectedRoute>} />
          <Route path="/physicalRooms" element={<ProtectedRoute><PhysicalRoomManager /></ProtectedRoute>} />
          <Route path="/self-check-in" element={<SelfCheckIn />} />
          <Route path="/booking-management" element={<ProtectedRoute><BookingManagement /></ProtectedRoute>} />
          <Route path="/crm" element={<ProtectedRoute><CrmManagement /></ProtectedRoute>} />

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