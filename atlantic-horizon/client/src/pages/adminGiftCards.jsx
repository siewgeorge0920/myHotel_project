import React, { useState, useEffect } from 'react';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';

export default function AdminGiftCards() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isManagerMode = localStorage.getItem('managerMode') === 'true';

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);

  const fetchCards = () => {
    fetch('/api/gift-cards/all', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        setCards(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const filteredCards = cards.filter(c => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;
    
    return (
      (c.code?.toLowerCase().includes(search) ?? false) || 
      (c.recipient_name?.toLowerCase().includes(search) ?? false) ||
      (c.purchaser_email?.toLowerCase().includes(search) ?? false) ||
      (c.purchaser_name?.toLowerCase().includes(search) ?? false)
    );
  });

  console.log("Debug AdminGiftCards - Total:", cards.length, "Filtered:", filteredCards.length);

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManagerMode} />
      
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[40%] h-[30%] bg-amber-600/5 blur-[120px] pointer-events-none" />

        <header className="mb-10 border-b pb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6" style={{ borderColor: COLORS.border }}>
          <div>
            <h1 className="text-4xl font-serif italic">Gift card Vouchers</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <input 
               type="text" 
               placeholder="SEARCH CODE / NAME..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="bg-white/5 border border-white/10 px-4 py-3 text-[10px] tracking-widest uppercase outline-none focus:border-amber-600/50 min-w-[260px] transition-all"
            />
            <button onClick={fetchCards}
              className="px-6 py-3 border border-white/20 text-[10px] uppercase font-black tracking-widest hover:bg-white/5 hover:border-white/40 transition-all">
              ↻ Refresh
            </button>
          </div>
        </header>

        {loading ? (
          <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] animate-pulse">Retrieving vault records...</p>
        ) : filteredCards.length === 0 ? (
          <div className="p-20 border border-dashed text-center text-white/20 uppercase tracking-widest text-[10px]" style={{ borderColor: COLORS.border }}>
            No vouchers found matching your search.
          </div>
        ) : (
          <div className="border overflow-hidden rounded-sm" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
            <table className="w-full text-left">
              <thead className="bg-white/[0.03] text-[9px] uppercase tracking-[0.2em] text-amber-500/80 font-black">
                <tr>
                  <th className="p-5 border-b border-white/5">Date Issued</th>
                  <th className="p-5 border-b border-white/5">Voucher Code</th>
                  <th className="p-5 border-b border-white/5">Purchaser</th>
                  <th className="p-5 border-b border-white/5">Recipient</th>
                  <th className="p-5 border-b border-white/5">Balance</th>
                  <th className="p-5 border-b border-white/5">Status</th>
                  <th className="p-5 border-b border-white/5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredCards.map((card) => (
                  <tr key={card._id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="p-5 text-xs text-white/40 font-light">
                       {new Date(card.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-5">
                       <span className="text-sm font-mono tracking-wider text-white/90 group-hover:text-amber-500 transition-colors uppercase">
                          {card.code}
                       </span>
                    </td>
                    <td className="p-5 text-xs">
                       <div className="text-white/80 font-medium mb-1">{card.purchaser_name || 'Direct'}</div>
                       <div className="text-[9px] opacity-30 tracking-widest uppercase">{card.purchaser_email || '—'}</div>
                    </td>
                    <td className="p-5 text-xs">
                       <div className="font-serif italic text-white/80 text-sm mb-1">{card.recipient_name}</div>
                       <div className="text-[9px] opacity-30 uppercase tracking-widest font-sans">{card.recipient_email}</div>
                    </td>
                    <td className="p-5">
                       <div className={`text-sm font-serif italic ${card.balance === 0 ? 'text-white/20 line-through' : 'text-amber-500'}`}>
                          €{card.balance}
                       </div>
                       <div className="text-[9px] opacity-20 mt-1">Initial: €{card.initial_amount}</div>
                    </td>
                    <td className="p-5">
                       <span className={`text-[9px] px-3 py-1 uppercase font-black tracking-widest border ${
                         card.status === 'Active' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 
                         card.status === 'Used' ? 'text-white/20 border-white/10' : 
                         'text-red-500 border-red-500/20'
                       }`}>
                         {card.status}
                       </span>
                    </td>
                    <td className="p-5 text-right">
                       <button 
                         onClick={() => setSelectedCard(card.code)}
                         className="text-[9px] uppercase font-black tracking-[0.2em] text-white/40 hover:text-white border border-white/10 px-4 py-2 hover:border-white/30 transition-all"
                       >
                         View History
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Voucher History Slide-over */}
      {selectedCard && (
        <HistoryModal 
          code={selectedCard} 
          onClose={() => setSelectedCard(null)} 
        />
      )}
    </div>
  );
}

function HistoryModal({ code, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/gift-cards/${code}/history`, { credentials: 'include' })
      .then(r => r.json())
      .then(json => {
        setData(json.data);
        setLoading(false);
      });
  }, [code]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
       <div className="relative w-full max-w-lg bg-[#1a1d17] h-full shadow-2xl border-l border-white/5 p-10 overflow-y-auto">
          <div className="flex justify-between items-start mb-12">
             <div>
                <p className="text-amber-500 text-[10px] uppercase font-black tracking-[0.4em] mb-2">Voucher Timeline</p>
                <h2 className="text-3xl font-serif italic">{code}</h2>
             </div>
             <button onClick={onClose} className="text-white/20 hover:text-white text-2xl">✕</button>
          </div>

          {loading ? (
             <p className="text-white/20 text-xs uppercase tracking-widest animate-pulse">Syncing with database...</p>
          ) : (
             <div className="space-y-10">
                {/* 💳 Payment Status */}
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-white/30 uppercase tracking-widest font-black">Stripe Status</span>
                      <span className={`text-[10px] uppercase font-black tracking-widest px-3 py-1 ${
                        data.stripeStatus === 'Succeeded' ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'
                      }`}>
                         {data.stripeStatus}
                      </span>
                   </div>
                   <p className="text-[10px] text-white/20">Payment verification state as of today.</p>
                </div>

                {/*  Event Logs */}
                <div className="space-y-6">
                   <h3 className="text-[10px] uppercase font-black tracking-widest text-white/40 pb-4 border-b border-white/5">Activity Log</h3>
                   {data.logs.map((log, i) => (
                      <div key={i} className="relative pl-6 border-l border-white/10 py-1 group">
                         <div className="absolute left-[-5px] top-2 w-[9px] h-[9px] rounded-full bg-amber-600/50 group-hover:bg-amber-500 transition-colors" />
                         <p className="text-[10px] text-amber-500 uppercase font-black tracking-widest mb-1">{log.action}</p>
                         <p className="text-xs text-white/60 mb-2">{log.details}</p>
                         
                         {/* Link to Booking if present in details (e.g. "for booking ATL-123456") */}
                         {log.action === 'GIFT_CARD_REDEEM' && log.details.includes('ATL-') && (
                            <a 
                              href={`/bookings`} 
                              className="inline-block text-[9px] uppercase font-black text-amber-500/60 hover:text-amber-500 mb-2 tracking-widest border-b border-amber-500/20"
                            >
                               View Reservation ↗
                            </a>
                         )}

                         <p className="text-[9px] text-white/20 font-mono italic">
                            {new Date(log.timestamp).toLocaleString()} · {log.performedBy}
                         </p>
                      </div>
                   ))}
                   {data.logs.length === 0 && <p className="text-white/20 text-xs italic">No activity recorded yet.</p>}
                </div>
             </div>
          )}
       </div>
    </div>
  );
}
