import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { COLORS } from '../colors';

export default function ManagementSidebar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Strategic Grouping
  const menuItems = [
    { name: 'Dashboard', path: '/staffDashboard', icon: '' },
    { name: 'Room Inventory', path: '/roomInventory', icon: '', adminOnly: true },
    { name: 'Gift Cards', path: '/admin/gift-cards', icon: '', adminOnly: true },
    { name: 'Settings', path: '/adminSettings', icon: '', adminOnly: true }
  ];

  return (
    <aside className="w-64 min-h-screen border-r border-white/5 flex flex-col p-8 sticky top-0" style={{ backgroundColor: COLORS.bgDeep }}>
      <div className="mb-16">
        <h2 className="text-xl font-serif italic tracking-tighter">Horizon Manor</h2>
        <p className="text-[8px] uppercase tracking-[0.5em] text-white/20 font-black mt-2">Front Desk V3</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          (!item.adminOnly || user.role === 'admin' || user.role === 'manager') && (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <span className="text-[10px] uppercase font-bold tracking-widest">{item.name}</span>
            </Link>
          )
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-white/5">
        <div className="mb-6">
          <p className="text-[9px] text-white/20 uppercase font-black tracking-widest mb-1">{user?.role || 'Staff'}</p>
          <p className="text-xs text-white/60 font-medium truncate">{user?.name || 'Operator'}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full py-3 text-[9px] uppercase font-black tracking-[0.3em] text-red-500/60 hover:text-red-400 transition-colors text-left"
        >
          Terminate Session
        </button>
      </div>
    </aside>
  );
}