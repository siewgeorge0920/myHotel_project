import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 确保这里的路径字母大小写，跟你真实的文件名一模一样！
// Main
import Navbar from './components/navbar';
import ClientHome from './pages/clientHome';
import Login from './pages/login';
import AdminIAM from './pages/adminIAM';
import CalendarPage from './pages/calendarPage';
import AdminLogs from './pages/adminLogs';
import GiftCard from './pages/giftCard';




// Facility Pages
import MichelineQualityFood from './pages/clientFeatures/ExperiencesAndDining/michelineQualityFood';
import ContinentalBreakfast from './pages/clientFeatures/ExperiencesAndDining/continentalBreakfast';
import LocalIrishExcursion from './pages/clientFeatures/ExperiencesAndDining/localIrishExcursion';
import PrivateChauffer from './pages/clientFeatures/ExperiencesAndDining/privateChauffer';
import HoneymoonPackage from './pages/clientFeatures/ExperiencesAndDining/honeymoonPackage';

import Sauna from './pages/clientFeatures/TheSpaAndWellness/sauna';
import Facial from './pages/clientFeatures/TheSpaAndWellness/facial';
import PrivateExclusive from './pages/clientFeatures/TheSpaAndWellness/privateExclusive';
import TherapeuticMassage from './pages/clientFeatures/TheSpaAndWellness/massage';

import PrivateLodges from './pages/clientFeatures/AllInclusiveResort/privateLodges';
import PrivateResidencesVillas from './pages/clientFeatures/AllInclusiveResort/privateResidencesAndVillas';
import UltimateExclusivity from './pages/clientFeatures/AllInclusiveResort/ultimateExclusivity';


import ScrollToTop from './components/scrollToTop';


export default function App() {
  return (
    <Router>
      <ScrollToTop />
        <div className="min-w-[320px] overflow-x-hidden">
          <Navbar />
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<ClientHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-iam" element={<AdminIAM />} />
            <Route path="/admin-logs" element={<AdminLogs />} />
            <Route path="/giftcard" element={<GiftCard />} />
            <Route path="/calendar" element={<CalendarPage />} />



            {/* Facility Routes */}
            <Route path="/michelin" element={<MichelineQualityFood />} />
            <Route path="/breakfast" element={<ContinentalBreakfast />} />
            <Route path="/loc_Irish" element={<LocalIrishExcursion />} />
            <Route path="/chauffer" element={<PrivateChauffer />} />
            <Route path="/honeymoon" element={<HoneymoonPackage />} />

            <Route path="/sauna" element={<Sauna />} />
            <Route path="/facial" element={<Facial />} />
            <Route path="/pr_Exclusive" element={<PrivateExclusive />} />
            <Route path="/massage" element={<TherapeuticMassage />} />

            <Route path="/lodges" element={<PrivateLodges />} />
            <Route path="/villas" element={<PrivateResidencesVillas />} />
            <Route path="/ultimate" element={<UltimateExclusivity />} />

            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
    </Router>
  );
}