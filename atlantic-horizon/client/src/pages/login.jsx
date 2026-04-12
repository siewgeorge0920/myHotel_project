import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COLORS } from '../colors';
import LuxuryLoader from '../components/luxuryLoader';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ====== 24H SESSION AUTO-REDIRECT ======
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const timestamp = localStorage.getItem('loginTimestamp');
    const hasCookie = document.cookie.includes('sessionToken=');
    
    if (userStr && timestamp && hasCookie) {
      const now = Date.now();
      const age = now - parseInt(timestamp);
      const isExpired = age > 24 * 60 * 60 * 1000;

      if (!isExpired) {
        navigate('/staffDashboard');
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimestamp');
      }
    } else {
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimestamp');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post('/api/v3/auth/login', formData, {
         withCredentials: true
      });
      // Logic: Extract from data.data due to standardized V3 wrapper
      const userData = res.data.data;
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('loginTimestamp', Date.now().toString());
      navigate('/staffDashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Login failed — please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1d17] flex items-center justify-center px-6">
      {isLoading && <LuxuryLoader message="Verifying Identity..." />}
      
      <div className="max-w-md w-full backdrop-blur-3xl bg-white/[0.03] p-12 shadow-2xl border border-white/10 rounded-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="text-center mb-10 relative z-10">
          <p className="text-amber-500 text-[10px] uppercase tracking-[0.5em] font-black mb-2 opacity-80">Sanctuary Core</p>
          <h2 className="font-cinzel text-3xl text-white/90 tracking-[0.2em] uppercase leading-tight">Identity Check</h2>
          <p className="text-[10px] text-white/30 uppercase tracking-widest mt-2">Identify to standard or kernel tiers</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/5 border border-red-500/20 text-red-400 text-[11px] p-3 text-center leading-relaxed backdrop-blur-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8 relative z-10">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-amber-500/70 font-bold mb-2">User Identifier</label>
            <input 
              type="text" 
              value={formData.username}
              className="w-full bg-white/[0.02] border border-white/5 px-4 py-4 text-white focus:border-amber-500 outline-none transition-all placeholder-white/20 text-sm"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="e.g. boss"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-amber-500/70 font-bold mb-2">Master Key</label>
            <input 
              type="password"
              value={formData.password}
              className="w-full bg-white/[0.02] border border-white/5 px-4 py-4 text-white focus:border-amber-500 outline-none transition-all placeholder-white/20 text-sm"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-5 text-[11px] uppercase tracking-[0.4em] font-black hover:opacity-90 transition-all disabled:opacity-50 text-white shadow-2xl relative group overflow-hidden"
            style={{ backgroundColor: COLORS.amber }}
          >
            <span className="relative z-10">{isLoading ? 'Verifying...' : 'Unlock Portal'}</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-white/5 pt-6 relative z-10 space-y-4">
          <button onClick={() => navigate('/')} className="text-[10px] text-white/20 uppercase tracking-widest hover:text-amber-500 transition-colors block w-full text-center">
            ← Abort and Return to Guest Site
          </button>
          
          <button 
            type="button"
            onClick={async () => {
              setIsLoading(true);
              try {
                await axios.post('/api/v3/auth/seed-admin?force=true');
                alert('Identity Core Initialized! Use "boss" / "123" to login.');
              } catch (e) {
                alert('Seeding failed! Is the server running?');
              } finally {
                setIsLoading(false);
              }
            }}
            className="text-[9px] text-amber-500/30 uppercase tracking-[0.2em] hover:text-amber-500 transition-all font-black block w-full text-center"
          >
            [ Initialize Identity Core ]
          </button>
        </div>
      </div>
    </div>
  );
}