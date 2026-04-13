import React, { useState, useEffect } from 'react';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';

const PAYMENT_BADGE = {
  Paid: 'text-green-400 border-green-500/40 bg-green-500/5',
  Pending: 'text-amber-400 border-amber-500/40 bg-amber-500/5',
  Failed: 'text-red-400 border-red-500/40 bg-red-500/5',
  Refunded: 'text-blue-400 border-blue-500/40 bg-blue-500/5',
};

export default function Transactions() {
  // Staff context from local storage for sidebar mode rendering.
  const user = JSON.parse(localStorage.getItem('user'));
  const isManagerMode = localStorage.getItem('managerMode') === 'true';
  const [txns, setTxns] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve all transaction rows for dashboard metrics and table view.
    fetch('/api/v3/transactions')
      .then(r => r.json())
      .then(data => { setTxns(data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Frontend-side status filter for quick operational slicing.
  const filtered = filter === 'all' ? txns : txns.filter(t => t.paymentStatus === filter);
  // Aggregate metrics used by summary cards.
  const totalRevenue = txns.filter(t => t.paymentStatus === 'Paid').reduce((s, t) => s + (t.amount || 0), 0);
  const pending = txns.filter(t => t.paymentStatus === 'Pending').reduce((s, t) => s + (t.amount || 0), 0);

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManagerMode} />
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto">
        <header className="mb-10 border-b pb-8" style={{ borderColor: COLORS.border }}>
          <p className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-black mb-2">Manager Control</p>
          <h1 className="text-4xl font-serif italic">Transaction Records</h1>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Bookings', value: txns.length, color: 'text-white' },
            { label: 'Revenue (Paid)', value: `€${totalRevenue.toLocaleString()}`, color: 'text-green-400' },
            { label: 'Pending Payments', value: `€${pending.toLocaleString()}`, color: 'text-amber-400' },
            { label: 'Paid Rate', value: txns.length ? `${Math.round(txns.filter(t => t.paymentStatus === 'Paid').length / txns.length * 100)}%` : '0%', color: 'text-blue-400' },
          ].map(card => (
            <div key={card.label} className="p-6 border" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">{card.label}</p>
              <p className={`text-2xl font-serif italic ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {['all', 'Paid', 'Pending', 'Failed', 'Refunded'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-black border transition-all ${filter === f ? 'border-amber-600 text-amber-500 bg-amber-600/10' : 'border-white/10 text-white/30 hover:border-white/30'}`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-white/30 text-xs uppercase animate-pulse">Loading transactions...</p>
        ) : (
          <div className="border overflow-hidden" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-amber-500 font-black">
                <tr>
                  <th className="p-5">Booking ID</th>
                  <th className="p-5">Guest Name</th>
                  <th className="p-5">Guest Email</th>
                  <th className="p-5">Room</th>
                  <th className="p-5">Check-In</th>
                  <th className="p-5">Check-Out</th>
                  <th className="p-5">Amount</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Managed By</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: COLORS.border }}>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-white/20 text-xs uppercase">No records found.</td></tr>
                ) : filtered.map((t, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-5 font-mono text-amber-500 text-sm">{t.bookingId || '—'}</td>
                    <td className="p-5 font-serif">{t.clientName}</td>
                    <td className="p-5 text-xs text-white/50">{t.clientEmail || '—'}</td>
                    <td className="p-5 text-sm font-serif">{t.roomName}</td>
                    <td className="p-5 text-xs text-white/50">{t.checkIn ? new Date(t.checkIn).toLocaleDateString() : '—'}</td>
                    <td className="p-5 text-xs text-white/50">{t.checkOut ? new Date(t.checkOut).toLocaleDateString() : '—'}</td>
                    <td className="p-5 font-serif text-lg text-amber-300">€{(t.amount || 0).toLocaleString()}</td>
                    <td className="p-5">
                      <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-1 border ${PAYMENT_BADGE[t.paymentStatus] || 'text-white/30 border-white/10'}`}>
                        {t.paymentStatus}
                      </span>
                    </td>
                    <td className="p-5 text-xs text-white/40">{t.managedBy || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
