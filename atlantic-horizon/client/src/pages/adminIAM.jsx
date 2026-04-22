import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';
import ConfirmationWindow from '../components/ConfirmationWindow';

// Default form shape for creating/editing staff accounts.
const EMPTY = { _id: '', name: '', username: '', password: '', role: 'staff', status: 'Active' };
// Allowed role options shown in role selector.
const ROLES = ['staff', 'manager', 'admin'];

export default function AdminIAM() {
  // Session context used by sidebar rendering.
  const user = JSON.parse(localStorage.getItem('user'));
  const isManagerMode = localStorage.getItem('managerMode') === 'true';

  // Page data and interaction state.
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [settings, setSettings] = useState({});

  // Fetch all staff accounts.
  const fetchStaff = () => {
    fetch('/api/staff', {
      headers: { 'Authorization': `Bearer ${user?.token}` },
      credentials: 'include'
    })
      .then(r => r.json())
      .then(json => setStaffList(json.data || []));
  };
  
  const navigate = useNavigate();
  
  // Initial data load on first render + Security Check
  useEffect(() => { 
    const userRole = user?.role?.toLowerCase() || '';
    if (!user || userRole !== 'admin') {
      navigate('/staffDashboard');
      return;
    }
    fetchStaff(); 
  }, []);
  
  // Temporary toast-like message helper.
  const flash = (text, isErr = false) => {
    setMsg({ text, isErr });
    setTimeout(() => setMsg(null), 3500);
  };

  // Create or update a staff account depending on edit mode.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = isEdit ? `/api/staff/${form._id}` : '/api/staff';
    const method = isEdit ? 'PUT' : 'POST';
    const payload = { ...form };
    if (!isEdit) delete payload._id;
    
    try {
      const res = await fetch(url, { 
        method, 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        }, 
        body: JSON.stringify(payload) 
      });
      if (!res.ok) throw new Error();
    flash(isEdit ? 'Account updated successfully' : 'Account registered successfully');
    setForm(EMPTY);
    setIsEdit(false);
    fetchStaff();
  } catch {
    flash('Failed to save', true);
  } finally {
    setLoading(false);
  }
};

// Delete confirmation modal state.
const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: null });

// Open delete confirmation for a selected account.
const requestDelete = (id, name) => {
  setDeleteModal({ isOpen: true, id, name });
};

// Execute delete after confirmation.
const confirmDelete = async () => {
  const { id } = deleteModal;
  setDeleteModal({ isOpen: false, id: null, name: null });
  await fetch(`/api/staff/${id}`, { 
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${user?.token}` }
  });
  flash('Account removed');
  fetchStaff();
};



  // Role-to-color mapping for table badges.
  const ROLE_COLOR = { admin: 'text-red-400', manager: 'text-amber-400', staff: 'text-blue-300' };

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManagerMode} />
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto">
        <header className="mb-10 border-b pb-8" style={{ borderColor: COLORS.border }}>
          <p className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-black mb-2">System Control</p>
          <h1 className="text-4xl font-serif italic">Identity &amp; Access Management</h1>
          <p className="text-white/30 text-sm mt-1">{staffList.length} portal accounts</p>
        </header>

        {msg && (
          <div className={`mb-6 px-6 py-3 text-xs font-bold uppercase tracking-widest border ${msg.isErr ? 'border-red-500/40 bg-red-500/10 text-red-400' : 'border-amber-500/40 bg-amber-500/10 text-amber-400'}`}>
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Account create/edit form */}
          <div className="p-8 border" style={{ backgroundColor: COLORS.bgSurface, borderColor: isEdit ? COLORS.amber : COLORS.border }}>
            <h2 className="text-lg font-serif italic mb-6">{isEdit ? 'Edit Account' : '+ Register New Account'}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-1">Full Name</label>
                <input type="text" required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ahmad Razif"
                  className="w-full bg-white/5 border p-3 text-sm outline-none focus:border-amber-500 transition-colors"
                  style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-1">Username (Login ID)</label>
                <input type="text" required value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  placeholder="razif88"
                  className="w-full bg-white/5 border p-3 text-sm outline-none focus:border-amber-500 transition-colors"
                  style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-1">
                  Password {isEdit && <span className="text-white/30 normal-case">(leave blank to keep)</span>}
                </label>
                <input type="password" required={!isEdit} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder={isEdit ? 'New password (optional)' : '••••••••'}
                  className="w-full bg-white/5 border p-3 text-sm outline-none focus:border-amber-500 transition-colors"
                  style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-1">Role</label>
                <div className="flex gap-2">
                  {ROLES.map(r => (
                    <button type="button" key={r} onClick={() => setForm({ ...form, role: r })}
                      className={`flex-1 py-2 text-[10px] uppercase font-black tracking-widest border transition-all ${form.role === r ? 'border-amber-600 bg-amber-600/20 text-amber-400' : 'border-white/10 text-white/30 hover:border-white/30'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>




              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} style={{ backgroundColor: COLORS.amber }}
                  className="flex-1 py-3 uppercase text-[10px] font-black tracking-widest hover:brightness-110 disabled:opacity-50">
                  {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Register Account')}
                </button>
                {isEdit && (
                  <button type="button" onClick={() => { setForm(EMPTY); setIsEdit(false); }}
                    className="px-4 border border-white/20 text-[10px] uppercase font-black hover:bg-white/5">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Staff account listing and quick actions */}
          <div className="xl:col-span-2 border overflow-hidden" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-amber-500 font-black">
                <tr>
                  <th className="p-5">Name</th>
                  <th className="p-5">Role</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: COLORS.border }}>
                {staffList.map(s => (
                  <tr key={s._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-5 font-serif text-lg">{s.name}</td>
                    <td className="p-5">
                      <span className={`text-[10px] uppercase font-black ${ROLE_COLOR[s.role] || 'text-white/50'}`}>{s.role}</span>
                    </td>

                    <td className="p-5 text-right space-x-4">
                      <button type="button" onClick={() => { setIsEdit(true); setForm({ _id: s._id, name: s.name, username: s.username, password: '', role: s.role || 'staff', status: s.status || 'Active' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="text-[10px] uppercase font-black tracking-widest text-amber-500 hover:text-amber-300">Edit</button>
                      <button type="button" onClick={() => requestDelete(s._id, s.name)}
                        className="text-[10px] uppercase font-black tracking-widest text-red-500/50 hover:text-red-400">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>



      </main>

      <ConfirmationWindow 
        isOpen={deleteModal.isOpen}
        title="Delete Account"
        message={`Are you absolutely sure you want to permanently delete the account "${deleteModal.name}"? This is irreversible.`}
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, name: null })}
        confirmText="Yes, Delete Account"
        cancelText="Cancel"
      />
    </div>
  );
}