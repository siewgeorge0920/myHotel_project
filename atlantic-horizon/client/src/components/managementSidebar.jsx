import React, { useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { COLORS } from '../colors';
import CustomModal from './CustomModal';

const SESSION_TIMEOUT_MS = 60 * 60 * 1000; // 60 minutes

const NAV_GROUPS = {
  staff: [
    { name: 'Dashboard', path: '/staffDashboard', icon: '⌂' },
    { name: "Today's Arrivals", path: '/bookings?filter=CheckedIn', icon: '📅' },
    { name: 'Housekeeping', path: '/roomService', icon: '🧹' },
  ],
  manager: [
    { name: 'Calendar', path: '/adminCalendar', icon: '📆' },
    { name: 'Booking Management', path: '/bookings', icon: '📋' },
    { name: 'Transactions', path: '/transactions', icon: '💰' },
    { name: 'Audit Logs', path: '/adminLogs', icon: '🕵' },
  ],
  admin: [
    { name: 'System Settings', path: '/adminSettings', icon: '⚙' },
    { name: 'Capacity Control', path: '/roomCapacity', icon: '🚪' },
    { name: 'Room Management', path: '/roomManagement', icon: '🏨' },
    { name: 'Staff & IAM', path: '/adminIam', icon: '👤' },
  ],
};

export default function ManagementSidebar({ user, isManagerMode }) {
  const navigate = useNavigate();
  const location = typeof window !== 'undefined' ? window.location.pathname : '/';

  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  // ===== SESSION TIMEOUT =====
  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.setItem('managerMode', 'false');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    // Refresh timeout on any user activity
    let timer = setTimeout(logout, SESSION_TIMEOUT_MS);

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(logout, SESSION_TIMEOUT_MS);
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    // Store last activity on load
    localStorage.setItem('lastActivity', Date.now().toString());

    // Check if already expired from a previous session
    const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0');
    if (Date.now() - lastActivity > SESSION_TIMEOUT_MS) {
      logout();
      return;
    }

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimer));

    return () => {
      clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
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
    <aside className="w-64 h-screen sticky top-0 border-r flex flex-col shrink-0 overflow-y-auto" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
      {/* Logo / Home Link */}
      <Link to="/" className="flex items-center gap-3 px-6 py-5 border-b hover:bg-white/5 transition-all" style={{ borderColor: COLORS.border }}>
        <span className="text-manorGold text-lg">⊕</span>
        <div>
          <p className="text-[9px] text-amber-500 uppercase tracking-[0.3em] font-black">The Atlantic Horizon (v2.2-stable)</p>
          <p className="text-[10px] text-white/30 uppercase tracking-widest">← Guest Site</p>
        </div>
      </Link>

      <div className="px-6 py-4">
        <h2 className="text-white font-serif text-sm italic tracking-wide">Portal</h2>
        {isManagerMode && (
          <span className="text-[9px] text-amber-500 uppercase tracking-widest font-black">🔐 Manager Mode Active</span>
        )}
      </div>
      
      <nav className="flex-1 space-y-0 overflow-y-auto">
        {/* Staff section — always visible */}
        <SectionLabel label="Staff" />
        {NAV_GROUPS.staff.map(item => (
          <NavItem key={item.path} item={item} location={location} />
        ))}

        {/* Manager section — only when Manager Mode on */}
        {isManagerMode && (
          <>
            <SectionLabel label="Manager" color="text-amber-500/60" />
            {NAV_GROUPS.manager.map(item => (
              <NavItem key={item.path} item={item} location={location} />
            ))}
          </>
        )}

        {/* Admin section — Manager Mode + admin role (Case-Insensitive) */}
        {isManagerMode && user?.role?.toLowerCase() === 'admin' && (
          <>
            <SectionLabel label="Admin" color="text-red-400/60" />
            {NAV_GROUPS.admin.map(item => (
              <NavItem key={item.path} item={item} location={location} />
            ))}
          </>
        )}
      </nav>

      {/* Bottom: User info + Logout */}
      <div className="border-t" style={{ borderColor: COLORS.border }}>
        <div className="px-6 py-4">
          <p className="text-[9px] text-gray-600 uppercase mb-0.5">Logged In As</p>
          <p className="text-white text-xs font-bold uppercase">{user?.name}</p>
          <span style={{ color: COLORS.gold }} className="text-[9px] uppercase font-black italic">{user?.role}</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-6 py-3 text-[10px] uppercase tracking-widest font-black text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all border-t"
          style={{ borderColor: COLORS.border }}
        >
          <span>⏻</span>
          <span>Logout</span>
        </button>
      </div>
      <CustomModal 
        isOpen={isLogoutModalOpen}
        title="Confirm Logout"
        message="Are you sure you want to end your secure session?"
        confirmText="Logout"
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
  const path = item.path.split('?')[0]; // strip query params for active check
  const isActive = location === path || location.startsWith(path) && path !== '/';
  return (
    <Link 
      to={item.path}
      className="flex items-center space-x-3 px-6 py-3 text-[10px] uppercase tracking-[0.2em] transition-all"
      style={{ 
        color: isActive ? COLORS.gold : COLORS.textGray,
        backgroundColor: isActive ? 'rgba(255,255,255,0.03)' : 'transparent',
        borderLeft: isActive ? `3px solid ${COLORS.gold}` : '3px solid transparent'
      }}
    >
      <span className="text-sm">{item.icon}</span>
      <span>{item.name}</span>
    </Link>
  );
}