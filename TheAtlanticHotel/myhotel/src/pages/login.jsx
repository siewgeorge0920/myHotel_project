import React, { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }) // 这里输入的 username 其实就是打名字
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Server tak response!');

      // 🌟 核心：统一打包存进 'user'！不要再用 userName 和 userRole 了！
      localStorage.setItem('user', JSON.stringify({ 
        name: data.role === 'admin' ? 'Boss 👑' : data.name, 
        role: data.role 
      }));

      alert(data.message);
      if (data.role === 'admin') window.location.href = '/admin-iam';
      else window.location.href = '/calendar';

    } catch (err) { alert("Ouh: " + err.message); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" style={{backgroundImage: "url('https://images.unsplash.com/photo-1542314831-c6a4d27ce66f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80&blur=10')", backgroundSize: 'cover'}}>
      <div className="absolute inset-0 bg-black/60"></div>
      
      <form onSubmit={handleLogin} className="relative z-10 bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-serif text-gray-900">Staff Portal</h2>
          <p className="text-sm text-gray-500 mt-2">Authorized personnel only</p>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
            <input type="text" placeholder="Enter ID" value={username} onChange={e => setUsername(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input type="password" placeholder="Enter Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" required />
          </div>
          <button type="submit" className="w-full bg-amber-500 text-black font-bold py-3 rounded-xl hover:bg-amber-600 transition-all shadow-md mt-4">
            Secure Login
          </button>
        </div>
      </form>
    </div>
  );
}