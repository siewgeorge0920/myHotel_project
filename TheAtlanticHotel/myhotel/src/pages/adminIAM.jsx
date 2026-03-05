import React, { useState, useEffect } from 'react';
import ManagementSidebar from '../components/managementSidebar';
import LuxuryLoader from '../components/luxuryLoader';
import { COLORS } from '../colors'; //

export default function AdminIAM() {
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({ _id: '', name: '', password: '', role: 'staff' });
  const [isEditMode, setIsEditMode] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchStaff = () => {
    fetch('http://localhost:5000/api/staff')
      .then(res => res.json())
      .then(data => setStaffList(data));
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = isEditMode ? `http://localhost:5000/api/staff/${formData._id}` : 'http://localhost:5000/api/staff';
    const method = isEditMode ? 'PUT' : 'POST';

    const payload = { ...formData };
    if (!isEditMode) delete payload._id;

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setFormData({ _id: '', name: '', password: '', role: 'staff' });
      setIsEditMode(false);
      fetchStaff();
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Sure mau delete staff ni?")) {
      await fetch(`http://localhost:5000/api/staff/${id}`, { method: 'DELETE' });
      fetchStaff();
    }
  };

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} />
      
      <main className="flex-1 p-16 overflow-y-auto">
        {loading && <LuxuryLoader message="Updating Credentials..." />}
        
        <header className="mb-12 border-b pb-8" style={{ borderColor: COLORS.border }}>
          <p className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-black mb-3">System Control</p>
          <h1 className="text-4xl font-serif italic">Identity & Access Management</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* 左边 Form：深色卡片设计 */}
          <div className="p-8 border" style={{ backgroundColor: COLORS.bgSurface, borderColor: isEditMode ? COLORS.amber : COLORS.border }}>
            <h2 className="text-xl font-serif mb-6 italic">{isEditMode ? 'Update Staff Info' : 'Register New Staff'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  className="w-full bg-white/5 border p-3 text-sm outline-none focus:border-amber-500 transition-colors" 
                  style={{ borderColor: COLORS.border }}
                  required 
                />
                <input 
                  type="password" 
                  placeholder={isEditMode ? "New Password (Optional)" : "Password"} 
                  value={formData.password} 
                  onChange={e => setFormData({ ...formData, password: e.target.value })} 
                  className="w-full bg-white/5 border p-3 text-sm outline-none focus:border-amber-500 transition-colors" 
                  style={{ borderColor: COLORS.border }}
                  required={!isEditMode} 
                />
              </div>
              <div className="flex flex-col space-y-2">
                <button type="submit" style={{ backgroundColor: COLORS.amber }} className="w-full py-3 uppercase text-[10px] font-black tracking-widest hover:brightness-110">
                  {isEditMode ? 'Save Changes' : 'Confirm Registration'}
                </button>
                {isEditMode && (
                  <button type="button" onClick={() => { setIsEditMode(false); setFormData({ _id: '', name: '', password: '', role: 'staff' }) }} className="w-full border border-white/20 py-3 uppercase text-[10px] font-black tracking-widest hover:bg-white/5">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* 右边 Table */}
          <div className="lg:col-span-2 border overflow-hidden" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-amber-500 font-black">
                <tr>
                  <th className="p-6">Member Name</th>
                  <th className="p-6">Designation</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: COLORS.border }}>
                {staffList.map((staff) => (
                  <tr key={staff._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 font-serif text-lg tracking-wide">{staff.name}</td>
                    <td className="p-6 text-xs uppercase tracking-widest text-gray-400">{staff.role}</td>
                    <td className="p-6">
                      <span className="text-[9px] border px-2 py-1 uppercase tracking-tighter" style={{ borderColor: COLORS.gold, color: COLORS.gold }}>Active Sanctuary Member</span>
                    </td>
                    <td className="p-6 text-right space-x-6 text-[10px] uppercase font-bold tracking-widest">
                      <button onClick={() => setIsEditMode(true) || setFormData({ _id: staff._id, name: staff.name, password: '', role: staff.role })} className="hover:text-amber-500 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(staff._id)} className="text-red-500/60 hover:text-red-500 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}