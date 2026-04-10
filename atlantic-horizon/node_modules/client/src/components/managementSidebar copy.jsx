import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { COLORS } from '../colors';

export default function ManagementSidebar({ user }) {
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  const items = [
    { name: 'Room Inventory', path: '/inventory', icon: '🏨' },
    { name: 'Check Calendar', path: '/calendar', icon: '📅' },
  ];

  if (isAdmin) {
    items.push({ name: 'Staff Control (IAM)', path: '/admin-iam', icon: '👤' });
  }

  return (
    <aside className="w-64 min-h-screen border-r pt-12 flex flex-col" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
      <div className="px-8 mb-12">
        <h2 className="text-white font-serif text-xl italic tracking-wide">Portal Control</h2>
      </div>
      
      <nav className="flex-1 space-y-1">
        {items.map(item => (
          <Link 
            key={item.path} 
            to={item.path} 
            className="flex items-center space-x-4 px-8 py-4 text-[10px] uppercase tracking-[0.2em] transition-all"
            style={{ 
              color: location.pathname === item.path ? COLORS.gold : COLORS.textGray,
              backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.03)' : 'transparent',
              borderLeft: location.pathname === item.path ? `3px solid ${COLORS.gold}` : '3px solid transparent'
            }}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-8 border-t" style={{ borderColor: COLORS.border }}>
        <p className="text-[9px] text-gray-600 uppercase mb-2">Authenticated User</p>
        <p className="text-white text-xs font-bold uppercase">{user?.name}</p>
        <span style={{ color: COLORS.gold }} className="text-[9px] uppercase font-black italic">{user?.role}</span>
      </div>
    </aside>
  );
}