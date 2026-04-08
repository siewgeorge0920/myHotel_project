import React, { useEffect } from 'react'; // 🌟 核心修正 1：记得 Import useEffect
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

// Guest Pages
import Home from './pages/Home';
import CalendarPage from './pages/calendarPage';
import Login from './pages/login';

// 🌟 Lincoln's Pages (Experience)
import ContinentalBreakfast from './pages/Lincoln/continentalBreakfast';
import HoneymoonPackage from './pages/Lincoln/honeymoonPackage';
import LocalIrishExcursion from './pages/Lincoln/localIrishExcursion';
import MichelineQualityFood from './pages/Lincoln/michelineQualityFood';
import PrivateChauffer from './pages/Lincoln/privateChauffer';

// 🌟 George's Pages (Resort)
import PrivateLodges from './pages/George/privateLodges';
import PrivateResidences from './pages/George/privateResidencesAndVillas';
import UltimateExclusivity from './pages/George/ultimateExclusivity';

// 🌟 Derrick's Pages (Wellness)
import Sauna from './pages/Derrick/sauna';
import Facial from './pages/Derrick/facial';
import Masaage from './pages/Derrick/massage';
import Hottub from './pages/Derrick/hottub';
import Jacuzzi from './pages/Derrick/jacuzzi';


// Staff/Admin Portal
import StaffDashboard from './pages/staffDashboard';
import Inventory from './pages/inventory';
import AdminIAM from './pages/adminIAM';
import AdminLogs from './pages/adminLogs';
import RoomManagement from './pages/roomManagement';
import RoomPackage from './pages/roomPackage';
import BookingManagement from './pages/bookingManagement';
import Transactions from './pages/transactions';
import AdminCalendar from './pages/adminCalendar';
import RoomService from './pages/roomService';
import PhysicalRoomManager from './pages/physicalRoomManager';

import PaymentPage from './pages/PaymentPage';

import ProtectedRoute from './components/ProtectedRoute';

import SelfCheckIn from './pages/SelfCheckIn';
import LuxuryLoader from './components/luxuryLoader';

// 🌟 核心修正 2：自动回顶组件 (首字母一定要大写)
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0); // 每次换 URL，立刻回到最顶！
  }, [pathname]);
  return null;
};

// Layout Wrapper (包含转场特效)
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  React.useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const isManagement = [
    '/staffdashboard', '/adminiam', '/inventory', '/adminlogs', 
    '/roommanagement', '/roompackage', '/physicalrooms', '/bookings', '/transactions', 
    '/admincalendar', '/roomservice'
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
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      {/* 🌟 核心修正 3：必须把 ScrollToTop 放在 Router 里面跑 */}
      <ScrollToTop /> 

      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/secure-payment" element={<PaymentPage />} />
          <Route path="/check-in" element={<SelfCheckIn />} />
          
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
          <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="/adminIam" element={<ProtectedRoute><AdminIAM /></ProtectedRoute>} />
          <Route path="/adminLogs" element={<ProtectedRoute><AdminLogs /></ProtectedRoute>} />
          <Route path="/roomManagement" element={<ProtectedRoute><RoomManagement /></ProtectedRoute>} />
          <Route path="/roomPackage" element={<ProtectedRoute><RoomPackage /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><BookingManagement /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/adminCalendar" element={<ProtectedRoute><AdminCalendar /></ProtectedRoute>} />
          <Route path="/roomService" element={<ProtectedRoute><RoomService /></ProtectedRoute>} />
          <Route path="/physicalRooms" element={<ProtectedRoute><PhysicalRoomManager /></ProtectedRoute>} />

        </Routes>
      </LayoutWrapper>
    </Router>
  );
}