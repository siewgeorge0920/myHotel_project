import React, { useState } from 'react'; // Import React and the useState hook to manage application state
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import routing components

// Import global layout components that appear on every page
import Header from './components/Header';
import Footer from './components/Footer';
import CookieWindow from './components/CookieWindow';
import PrivacyPolicyModal from './components/PrivacyPolicyModal'; 
import CareersModal from './components/CareersModal'; 
import ContactUsModal from './components/ContactUsModal'; 
// 1. Import the new FAQs and Blog components
import FaqsModal from './components/FaqsModal';
import BlogModal from './components/BlogModal';
import ParkingModal from './components/ParkingModal';
import LocationModal from './components/LocationModal';

//Import Lincoln's new pages





// Import Derrick's new pages
import Sauna from './pages/Derrick/Sauna';
import Facial from './pages/Derrick/Facial';
import Jacuzzi from './pages/Derrick/Jacuzzi';
import Hottub from './pages/Derrick/Hottub'
import Massage from './pages/Derrick/Massage';
//Import George's new pages


// Import individual page components
import Home from './pages/Home';

export default function App() {
  // State to manage the visibility of the modals
  const [isCookieOpen, setIsCookieOpen] = useState(true); // Opens automatically on load
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isCareersOpen, setIsCareersOpen] = useState(false); 
  const [isContactOpen, setIsContactOpen] = useState(false); 
  // 2. Add state for the new modals
  const [isFaqsOpen, setIsFaqsOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  const [isParkingOpen, setIsParkingOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  return (
    // Router wraps the entire app to enable seamless navigation without reloading the browser
    <Router>
      
      {/* Main application wrapper establishing a flexbox layout. */}
      <div className="app-wrapper flex flex-col min-h-screen bg-manorDark">
        
        {/* Render the modal overlays */}
        <CookieWindow 
          isOpen={isCookieOpen} 
          onClose={() => setIsCookieOpen(false)} 
        />

        <PrivacyPolicyModal 
          isOpen={isPrivacyOpen} 
          onClose={() => setIsPrivacyOpen(false)} 
        />

        <CareersModal 
          isOpen={isCareersOpen} 
          onClose={() => setIsCareersOpen(false)} 
        />

        <ContactUsModal 
          isOpen={isContactOpen} 
          onClose={() => setIsContactOpen(false)} 
        />

        {/* 3. Render the new FAQs and Blog overlays */}
        <FaqsModal 
          isOpen={isFaqsOpen} 
          onClose={() => setIsFaqsOpen(false)} 
        />

        <BlogModal 
          isOpen={isBlogOpen} 
          onClose={() => setIsBlogOpen(false)} 
        />

        <ParkingModal 
          isOpen={isParkingOpen} 
          onClose={() => setIsParkingOpen(false)} 
        />
        <LocationModal 
          isOpen={isLocationOpen} 
          onClose={() => setIsLocationOpen(false)} 
        />
        
        {/* Global navigation header (Sticky top) */}
        <Header />

        {/* Middle section flex-grow to push footer down */}
        <div className="flex-grow">
          
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Future routes (pages) will be added here! */}
            
            {/*Lincoln:*/}

            {/*Derrick:*/}
              <Route path="/spa/sauna" element={<Sauna />} />
              <Route path="/spa/facial" element={<Facial />} />
              <Route path="/spa/jacuzzi" element={<Jacuzzi />} />
              <Route path="/spa/hottub" element={<Hottub />} />
              <Route path="/spa/massage" element={<Massage />} />

            {/*George:*/}

          </Routes>
          
        </div>

        {/* Global footer (Bottom).
            We pass down all the 'onOpen' functions to trigger the modals from the footer links. */}
        <Footer 
          onOpenCookies={() => setIsCookieOpen(true)} 
          onOpenPrivacy={() => setIsPrivacyOpen(true)} 
          onOpenCareers={() => setIsCareersOpen(true)} 
          onOpenContact={() => setIsContactOpen(true)} 
          onOpenFaqs={() => setIsFaqsOpen(true)} 
          onOpenBlog={() => setIsBlogOpen(true)} 
          onOpenParking={() => setIsParkingOpen(true)}
          onOpenLocation={() => setIsLocationOpen(true)}
        />
        
      </div>

      
    </Router>
  );
}