import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminIAM() {
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({ _id: '', userId: '', name: '', password: '', role: 'staff' });
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchStaff = () => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => setStaffList(data));
  };

  useEffect(() => { fetchStaff(); }, []);

  // Submit Form (Create 或者 Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditMode ? `http://localhost:5000/api/users/${formData._id}` : 'http://localhost:5000/api/users';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      alert(data.message);
      setFormData({ _id: '', userId: '', name: '', password: '', role: 'staff' });
      setIsEditMode(false);
      fetchStaff(); 
    } catch (err) { alert("Error: " + err.message); }
  };

  // Delete Action
  const handleDelete = async (id) => {
    if(window.confirm("Sure mau delete staff ni?")) {
      await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
      fetchStaff();
    }
  };

  // Edit Action (拉 data 进 form)
  const startEdit = (staff) => {
    setIsEditMode(true);
    setFormData({ _id: staff._id, userId: staff.userId, name: staff.name, password: '', role: staff.role });
  };

  // Logout Action
  const handleLogout = () => {
    if(window.confirm("Logout now?")) window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-end border-b pb-4">
          <h1 className="text-2xl font-semibold text-gray-800">IAM Dashboard 👑</h1>
          <div className="flex space-x-3">
            <Link to="/admin-logs" className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-900">View Logs 🕵️‍♂️</Link>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600">Logout 🚪</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左边 Form */}
          <div className={`p-6 rounded-lg shadow border ${isEditMode ? 'bg-amber-50 border-amber-300' : 'bg-white border-gray-200'}`}>
            <h2 className="text-lg font-medium mb-4">{isEditMode ? 'Update Staff Info ✏️' : 'Register Staff'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 text-sm rounded" required />
              <input type="text" placeholder="Login ID (eg: S-01)" value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})} className="w-full border p-2 text-sm rounded" required disabled={isEditMode} />
              <input type="password" placeholder={isEditMode ? "New Password (Optional)" : "Password"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border p-2 text-sm rounded" required={!isEditMode} />
              <div className="flex space-x-2">
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded text-sm">{isEditMode ? 'Save Changes' : 'Create'}</button>
                {isEditMode && <button type="button" onClick={() => {setIsEditMode(false); setFormData({ _id: '', userId: '', name: '', password: '', role: 'staff' })}} className="w-full bg-gray-400 text-white py-2 rounded text-sm">Cancel</button>}
              </div>
            </form>
          </div>

          {/* 右边 Table (隐藏了 Staff ID) */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow border overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase">
                <tr><th className="p-4">Name</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr key={staff._id} className="border-b">
                    <td className="p-4 font-medium text-gray-900">{staff.name}</td>
                    <td className="p-4 capitalize">{staff.role}</td>
                    <td className="p-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span></td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => startEdit(staff)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(staff._id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}