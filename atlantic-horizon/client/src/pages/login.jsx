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
    
    if (userStr && timestamp) {
      const now = Date.now();
      const age = now - parseInt(timestamp);
      const isExpired = age > 24 * 60 * 60 * 1000; // 24 Hours

      if (!isExpired) {
        // Still valid, redirect straight to dashboard
        navigate('/staffDashboard');
      } else {
        // Expired, clear out
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimestamp');
        localStorage.removeItem('managerMode');
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/login', formData);
      const userData = res.data;
      
      // Save data + timestamp
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('loginTimestamp', Date.now().toString());
      
      // Enforce Manager Mode true for manager/admin roles
      if (userData.role === 'admin' || userData.role === 'manager') {
        localStorage.setItem('managerMode', 'true');
      } else {
        localStorage.setItem('managerMode', 'false');
      }

      navigate('/staffDashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed — please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1d17] flex items-center justify-center px-6">
      {isLoading && <LuxuryLoader message="Verifying Identity..." />}
      <div className="max-w-md w-full bg-[#242820] p-12 shadow-2xl border-t-4 border-amber-600">
        <div className="text-center mb-10">
          <p className="text-amber-500 text-[10px] uppercase tracking-[0.4em] font-black mb-2">Staff Portal</p>
          <h2 className="font-cinzel text-3xl text-manorGold tracking-[0.2em] uppercase">Staff Access</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">Management &amp; staff members</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] p-3 text-center leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">Username</label>
            <input 
              type="text" 
              value={formData.username}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-amber-500 outline-none transition-all"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">Password</label>
            <input 
              type="password"
              value={formData.password}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-amber-500 outline-none transition-all"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ backgroundColor: COLORS.amber }} 
            className="w-full py-4 text-white text-[11px] uppercase tracking-[0.4em] font-black hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Unlock Portal'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <button onClick={() => navigate('/')} className="text-[10px] text-gray-600 uppercase tracking-widest hover:text-manorGold">← Back to Guest Site</button>
        </div>
      </div>
    </div>
  );
}