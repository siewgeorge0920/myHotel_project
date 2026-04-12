import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';

export default function CrmManagement() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // RBAC checks
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager' || isAdmin;
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchClients();
  }, [user, navigate]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v3/crm/clients');
      if (!res.ok) throw new Error('Failed to fetch guests (clients).');
      const json = await res.json();
      setClients(json.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return; // double check
    if (!window.confirm("CRITICAL WARNING: This will delete the guest record from the system. Proceed?")) return;

    try {
      const res = await fetch(`/api/v3/crm/clients/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Failed to delete client.");
      setClients(clients.filter(c => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.client_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="flex min-h-screen text-white font-sans selection:bg-amber-500/30" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManager} />
      
      <main className="flex-1 p-6 lg:p-12 overflow-x-hidden relative">
        <div className="absolute top-0 right-0 w-[60%] h-[40%] bg-amber-600/5 rounded-full blur-[150px] pointer-events-none" />

        <header className="mb-12 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-serif italic text-white/90">Identity Matrix</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-amber-500/60 mt-2 font-black">Guest Relationship Management (CRM)</p>
          </div>
          
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Search by name, email, ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 px-6 py-3 rounded-full text-sm outline-none focus:border-amber-500/50 min-w-[300px]"
            />
            {isManager && (
              <button onClick={() => alert("Add Guest feature coming soon.")} className="bg-white text-black px-6 py-3 rounded-full text-[10px] uppercase font-black tracking-widest hover:bg-amber-500 hover:text-white transition-colors">
                + Add Guest
              </button>
            )}
          </div>
        </header>

        {loading ? (
          <div className="text-white/40 text-sm tracking-widest">Loading identities...</div>
        ) : error ? (
          <div className="text-red-400 p-4 border border-red-500/30 bg-red-500/10 rounded-xl">{error}</div>
        ) : (
          <div className="relative z-10 overflow-x-auto bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl">
            <table className="w-full text-left text-sm">
              <thead className="text-[9px] uppercase tracking-[0.3em] text-white/30 border-b border-white/10 bg-white/[0.02]">
                <tr>
                  <th className="p-6">Client ID</th>
                  <th className="p-6">Guest Name</th>
                  <th className="p-6">Contact</th>
                  <th className="p-6">Tier</th>
                  <th className="p-6">Registry Date</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredClients.map((client) => (
                  <tr key={client._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6 font-mono text-[10px] text-amber-500/80">{client.client_id}</td>
                    <td className="p-6 font-medium text-white/90">{client.name}</td>
                    <td className="p-6 text-white/50 text-[11px]">
                      <div>{client.email}</div>
                      <div className="text-white/30 mt-1">{client.phone || 'N/A'}</div>
                    </td>
                    <td className="p-6">
                       <span className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest border ${
                         client.loyalty_tier === 'Platinum' ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' :
                         client.loyalty_tier === 'Gold' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' :
                         'border-gray-500/30 text-gray-400 bg-gray-500/10'
                       }`}>
                         {client.loyalty_tier || 'Silver'}
                       </span>
                    </td>
                    <td className="p-6 text-white/40 text-[10px]">{new Date(client.createdAt).toLocaleDateString()}</td>
                    <td className="p-6 text-right space-x-4">
                      {isManager ? (
                        <button onClick={() => alert(`Edit ${client.name} coming soon`)} className="text-xs text-white/40 hover:text-amber-500 transition-colors">Edit</button>
                      ) : (
                         <span className="text-xs text-white/20">View Only</span>
                      )}
                      
                      {isAdmin && (
                        <button onClick={() => handleDelete(client._id)} className="text-xs text-red-500/50 hover:text-red-500 transition-colors">Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-white/30 italic">No identities found in system.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
