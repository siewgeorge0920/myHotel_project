import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';

export default function SanctuaryOperations() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isManagerMode = localStorage.getItem('managerMode') === 'true';

  const [activeTab, setActiveTab] = useState('Cleanliness'); // 'Cleanliness' or 'Gastronomy'
  const [units, setUnits] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (initial = false) => {
    try {
      if (initial) setLoading(true);
      const [resUnits, resOrders] = await Promise.all([
        axios.get('/api/v3/physical-rooms'),
        axios.get('/api/v3/room-service/all-orders')
      ]);
      setUnits(resUnits.data.data || []);
      setOrders(resOrders.data.data || []);
    } catch (err) {
      console.error('Data sync failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(fetchData, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const updateCleaningStatus = async (id, status) => {
    try {
      await axios.put(`/api/v3/physical-rooms/${id}`, { current_status: status });
      fetchData();
    } catch (err) {
      alert('Status update failed.');
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`/api/v3/room-service/order/${id}`, { status });
      fetchData();
    } catch (err) {
      alert('Order update failed.');
    }
  };

  const departments = Array.from(new Set(units.map(u => u.department)));

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Ready': return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5';
      case 'Cleaning': return 'text-sky-400 border-sky-400/20 bg-sky-400/5';
      case 'Maintenance': return 'text-red-400 border-red-400/20 bg-red-400/5';
      case 'Occupied': return 'text-amber-400 border-amber-400/20 bg-amber-400/5';
      default: return 'text-white/20 border-white/10';
    }
  };

  const getOrderBadge = (status) => {
    switch (status) {
      case 'Pending': return 'border-red-500/30 text-red-400 bg-red-500/5';
      case 'Preparing': return 'border-amber-500/30 text-amber-400 bg-amber-500/5';
      case 'Delivering': return 'border-sky-500/30 text-sky-400 bg-sky-500/5';
      case 'Completed': return 'border-emerald-500/30 text-emerald-400 bg-emerald-400/5';
      default: return 'border-white/10 text-white/30';
    }
  };

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManagerMode} />
      
      <main className="flex-1 p-8 lg:p-20 overflow-x-hidden">
        <header className="mb-12 border-b border-white/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
               <p className="text-amber-500 uppercase tracking-[0.5em] text-[10px] font-black">Staff Operation Tier (Unified)</p>
            </div>
            <h1 className="text-5xl font-serif italic text-white/90">Sanctuary Operations</h1>
          </div>
          
          <div className="flex bg-white/5 p-1">
            <button 
              onClick={() => setManualMode(true)}
              className="bg-amber-600/20 border border-amber-500/50 text-amber-500 px-6 py-3 rounded-full text-[10px] font-black tracking-widest hover:bg-amber-500 hover:text-white transition-all"
            >
              CREATE MANUAL ORDER (CONCIERGE)
            </button>
             <button 
               onClick={() => setActiveTab('Cleanliness')}
               className={`px-8 py-4 text-[10px] uppercase font-black tracking-[0.4em] transition-all ${activeTab === 'Cleanliness' ? 'bg-amber-600 text-white' : 'text-white/30 hover:text-white/60'}`}
             >
               🧹 Housekeeping
             </button>
             <button 
               onClick={() => setActiveTab('Gastronomy')}
               className={`px-8 py-4 text-[10px] uppercase font-black tracking-[0.4em] transition-all ${activeTab === 'Gastronomy' ? 'bg-amber-600 text-white' : 'text-white/30 hover:text-white/60'}`}
             >
               🍽️ Gastronomy
             </button>
          </div>
        </header>

        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
             <div className="w-10 h-10 border-t border-amber-500 rounded-full animate-spin opacity-40" />
             <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] animate-pulse">Synchronizing Core...</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-700">
            {activeTab === 'Cleanliness' ? (
              <div className="space-y-16">
                {departments.length === 0 && (
                   <div className="py-32 text-center border border-dashed border-white/10 opacity-30 text-[10px] uppercase tracking-[0.5em]">No physical units deployed in sanctuary.</div>
                )}
                {departments.map(dept => (
                  <div key={dept} className="space-y-8">
                    <h2 className="text-xl font-serif text-amber-500 italic border-l-2 border-amber-500 pl-6">{dept}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {units.filter(u => u.department === dept).map(unit => (
                        <div key={unit._id} className="bg-white/[0.02] border border-white/5 p-8 group hover:border-white/10 transition-all">
                          <div className="flex justify-between items-start mb-8">
                            <div>
                               <h3 className="text-2xl font-serif text-white/80">{unit.room_name}</h3>
                               <p className="text-[10px] text-white/20 uppercase tracking-widest mt-2">{unit.room_type_category}</p>
                            </div>
                            <span className={`px-3 py-1.5 border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(unit.current_status)}`}>
                              {unit.current_status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                             {['Ready', 'Cleaning', 'Maintenance'].filter(s => s !== unit.current_status).map(s => (
                               <button 
                                 key={s}
                                 onClick={() => updateCleaningStatus(unit._id, s)}
                                 className="py-2.5 text-[8px] uppercase tracking-[0.2em] font-black border border-white/5 hover:border-amber-500/40 text-white/20 hover:text-white transition-all bg-white/[0.01]"
                               >
                                 Set {s}
                               </button>
                             ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                   <h2 className="text-xl font-serif italic text-white/60">Active Gastronomy Workflow</h2>
                   <div className="flex gap-4 text-[9px] uppercase tracking-widest text-white/20">
                      <span>Total: {orders.length}</span>
                      <span>Pending: {orders.filter(o => o.order_status === 'Pending').length}</span>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                   {orders.length === 0 && (
                     <div className="py-32 text-center border border-dashed border-white/10 opacity-30 text-[10px] uppercase tracking-[0.5em]">No active orders processed by Gastronomy yet.</div>
                   )}
                   {orders.map(order => (
                     <div key={order._id} className="bg-white/[0.02] border border-white/5 p-8 flex flex-col md:flex-row justify-between items-center gap-10 hover:bg-white/[0.03] transition-all">
                        <div className="flex-1 space-y-4">
                           <div className="flex items-center gap-4">
                              <span className="text-amber-500 font-black text-[10px] tracking-widest px-3 py-1 bg-amber-500/5 border border-amber-500/20 uppercase">Order #{order._id.slice(-6)}</span>
                              <span className={`px-4 py-1 border text-[9px] font-black uppercase tracking-widest ${getOrderBadge(order.order_status)}`}>
                                {order.order_status}
                              </span>
                              <span className="text-white/20 text-[10px] uppercase tracking-widest italic">{new Date(order.createdAt).toLocaleTimeString()}</span>
                           </div>
                           <div className="flex gap-8">
                              <div className="flex-1">
                                 <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-black mb-2">Requested Items</p>
                                 <div className="space-y-1">
                                    {order.items.map((it, idx) => (
                                      <p key={idx} className="text-sm text-white/70 font-light italic">
                                        <span className="text-amber-500/60 font-black mr-2">{it.quantity}x</span> {it.name}
                                      </p>
                                    ))}
                                 </div>
                              </div>
                              <div className="min-w-[120px]">
                                 <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-black mb-2">Total Folio</p>
                                 <p className="text-xl font-serif text-white/80 italic">€{order.total_amount}</p>
                              </div>
                           </div>
                        </div>

                        <div className="flex gap-2 flex-wrap justify-end">
                           {['Pending', 'Preparing', 'Delivering', 'Completed'].filter(s => s !== order.order_status).map(s => (
                             <button 
                               key={s}
                               onClick={() => updateOrderStatus(order._id, s)}
                               className="px-6 py-3 text-[9px] uppercase font-black tracking-widest border border-white/10 hover:border-amber-500/40 text-white/30 hover:text-white transition-all"
                             >
                               Set {s}
                             </button>
                           ))}
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
