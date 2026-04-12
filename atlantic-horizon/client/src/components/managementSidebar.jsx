import React, { useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { COLORS } from '../colors';
import CustomModal from './CustomModal';

const SESSION_TIMEOUT_MS = 24 * 60 * 60 * 1000; // Match 24h backend session

const NAV_GROUPS = {
  staff: [
    { name: 'Dashboard', path: '/staffDashboard', icon: '⌂' },
    { name: "Today's Arrivals", path: '/bookings?filter=CheckedIn', icon: '📅' },
    { name: 'Sanctuary Operations', path: '/roomService', icon: '🧹' },
  ],
  manager: [
    { name: 'Calendar', path: '/adminCalendar', icon: '📆' },
    { name: 'Booking Management', path: '/bookings', icon: '📋' },
    { name: 'Transactions', path: '/transactions', icon: '💰' },
    { name: 'Audit Logs', path: '/adminLogs', icon: '🕵' },
  ],
  admin: [
    { name: 'System Settings', path: '/adminSettings', icon: '⚙' },
    { name: 'Capacity Control', path: '/inventory', icon: '🚪' },
    { name: 'Room Management', path: '/roomManagement', icon: '🏨' },
    { name: 'Staff & IAM', path: '/adminIam', icon: '👤' },
  ],
};

export default function ManagementSidebar({ user }) {
  const navigate = useNavigate();
  const location = typeof window !== 'undefined' ? window.location.pathname : '/';

  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  // Determine clearance levels once
  const isManager = user?.role === 'manager' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  // ===== SESSION TIMEOUT =====
  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTimestamp');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    // Basic interval check for 24h expiration
    const checkExpiration = () => {
      const timestamp = localStorage.getItem('loginTimestamp');
      if (timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age > SESSION_TIMEOUT_MS) logout();
      } else {
        logout();
      }
    };

    const interval = setInterval(checkExpiration, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [logout]);
  // ===========================

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
  };

  return (
    <aside data-lenis-prevent="true" className="w-72 h-screen sticky top-0 border-r flex flex-col shrink-0 overflow-y-auto backdrop-blur-xl" style={{ backgroundColor: 'rgba(21, 24, 18, 0.95)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>

      {/* Logo / Home Link */}
      <Link to="/" className="flex items-center gap-3 px-6 py-5 border-b hover:bg-white/5 transition-all" style={{ borderColor: COLORS.border }}>
        <span className="text-manorGold text-lg">⊕</span>
        <div>
          <p className="text-[10px] text-amber-500 uppercase tracking-[0.4em] font-black">Manor Control (V3.0-Arise)</p>
          <p className="text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            CSM System Active
          </p>
        </div>
      </Link>

      <div className="px-6 py-4">
        <h2 className="text-white font-serif text-sm italic tracking-wide">Portal Navigation</h2>
      </div>
      
      <nav data-lenis-prevent="true" className="flex-1 space-y-0 overflow-y-auto">
        {/* Staff section — always visible */}
        <SectionLabel label="Operations" />
        {NAV_GROUPS.staff.map(item => (
          <NavItem key={item.path} item={item} location={location} />
        ))}

        {/* Manager section */}
        {isManager && (
          <>
            <SectionLabel label="Management" color="text-amber-500/60" />
            {NAV_GROUPS.manager.map(item => (
              <NavItem key={item.path} item={item} location={location} />
            ))}
          </>
        )}

        {/* Admin section */}
        {isAdmin && (
          <>
            <SectionLabel label="Kernel" color="text-red-400/60" />
            {NAV_GROUPS.admin.map(item => (
              <NavItem key={item.path} item={item} location={location} />
            ))}
          </>
        )}
      </nav>

      {/* Bottom: User info + Logout */}
      <div className="border-t" style={{ borderColor: COLORS.border }}>
        <div className="px-6 py-4">
          <p className="text-[9px] text-gray-600 uppercase mb-0.5 tracking-widest">Identified As</p>
          <p className="text-white text-xs font-bold uppercase tracking-wide">{user?.name}</p>
          <span className={`text-[9px] uppercase font-black italic ${isAdmin ? 'text-red-400' : 'text-amber-500'}`}>{user?.role}</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-6 py-4 text-[10px] uppercase tracking-widest font-black text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all border-t"
          style={{ borderColor: COLORS.border }}
        >
          <span>⏻</span>
          <span>Terminate Session</span>
        </button>
      </div>
      <CustomModal 
        isOpen={isLogoutModalOpen}
        title="Confirm Termination"
        message="Are you sure you want to end your secure management session?"
        confirmText="Terminate"
        cancelText="Cancel"
        onConfirm={confirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
        isDestructive={true}
      />
    </aside>
  );
}

function SectionLabel({ label, color = 'text-white/20' }) {
  return <p className={`px-6 pt-4 pb-1 text-[9px] uppercase tracking-widest font-black ${color}`}>{label}</p>;
}

function NavItem({ item, location }) {
  const path = item.path.split('?')[0]; 
  const isActive = location === path || (location.startsWith(path) && path !== '/');
  return (
    <Link 
      to={item.path}
      className="flex items-center space-x-3 px-6 py-3 text-[10px] uppercase tracking-[0.2em] transition-all"
      style={{ 
        color: isActive ? COLORS.gold : 'rgba(255,255,255,0.3)',
        backgroundColor: isActive ? 'rgba(255,255,255,0.03)' : 'transparent',
        borderLeft: isActive ? `3px solid ${COLORS.gold}` : '3px solid transparent'
      }}
    >
      <span className="text-sm opacity-50">{item.icon}</span>
      <span>{item.name}</span>
    </Link>
  );
}