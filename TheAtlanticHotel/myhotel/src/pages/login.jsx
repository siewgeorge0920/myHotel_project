import React, { useState } from 'react';
import LuxuryLoader from '../components/luxuryLoader';
import { COLORS } from '../colors';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('user', JSON.stringify({ name: data.name, role: data.role }));
      window.location.href = data.role === 'admin' ? '/admin-iam' : '/calendar';
    } catch (err) {
      alert("Access Denied: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.bgDeep }}>
      {loading && <LuxuryLoader message="Securing Connection..." />}
      
      <div className="p-12 w-full max-w-md border" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif italic text-white">Staff Portal</h2>
          <p className="text-[10px] uppercase tracking-widest mt-2" style={{ color: COLORS.textGray }}>The Atlantic Horizon Manor</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* // src/pages/login.jsx 部分修改 */}
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: COLORS.textGray }}>Access ID</label>
              <input 
                type="text" 
                autoComplete="off" // 🌟 阻止浏览器记录
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="w-full border p-3 rounded-none bg-white/5 text-white outline-none focus:border-amber-500" 
                style={{ borderColor: COLORS.border }}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: COLORS.textGray }}>Secret Code</label>
              <input 
                type="password" 
                autoComplete="new-password" // 🌟 核心：阻断 Google 联想
                name="manor_secret_access" // 🌟 核心：不要用 "password" 避开扫描
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full border p-3 rounded-none bg-white/5 text-white outline-none focus:border-amber-500" 
                style={{ borderColor: COLORS.border }}
              />
            </div>
            <button 
              type="submit" 
              style={{ backgroundColor: COLORS.amber }}
              className="w-full text-white font-black py-4 uppercase tracking-[0.3em] text-[11px] shadow-lg mt-4"
            >
              Secure Authentication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}