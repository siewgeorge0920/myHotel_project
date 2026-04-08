import React, { useState, useEffect } from 'react';
import ManagementSidebar from '../components/managementSidebar';
import { COLORS } from '../colors';
import CustomModal from '../components/CustomModal';

const EMPTY = { _id: '', name: '', password: '', role: 'staff', status: 'Active', permissions: [] };
const ROLES = ['staff', 'manager', 'admin'];
const STATUSES = ['Active', 'Suspended'];
const PERMISSION_OPTIONS = [
  { key: 'payment_edit', label: '💳 Process Payments', desc: 'Generate & resend payment links' },
  { key: 'booking_manage', label: '📋 Manage Bookings', desc: 'Edit, cancel, check-in/out' },
  { key: 'room_manage', label: '🏨 Manage Rooms', desc: 'Create, edit, delete room inventory' },
  { key: 'iam_manage', label: '👤 Manage Staff', desc: 'Create and suspend accounts' },
];

export default function AdminIAM() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isManagerMode = localStorage.getItem('managerMode') === 'true';
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [settings, setSettings] = useState({});

  const fetchStaff = () => {
    fetch('http://localhost:5000/api/staff')
      .then(r => r.json())
      .then(setStaffList);
  };
  
  const fetchSettings = () => {
    fetch('http://localhost:5000/api/settings')
      .then(r => r.json())
      .then(setSettings);
  };

  useEffect(() => { fetchStaff(); fetchSettings(); }, []);
  
  const updateSetting = async (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    try {
      await fetch('http://localhost:5000/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      });
      flash(`✅ Updated ${key}`);
    } catch {
      flash(`❌ Failed to update ${key}`, true);
    }
  };

  const flash = (text, isErr = false) => {
    setMsg({ text, isErr });
    setTimeout(() => setMsg(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = isEdit ? `http://localhost:5000/api/staff/${form._id}` : 'http://localhost:5000/api/staff';
    const method = isEdit ? 'PUT' : 'POST';
    const payload = { ...form };
    if (!isEdit) delete payload._id;
    
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      flash(isEdit ? '✅ Account updated successfully' : '✅ New account registered');
      setForm(EMPTY);
      setIsEdit(false);
      fetchStaff();
    } catch {
      flash('❌ Failed to save', true);
    } finally {
      setLoading(false);
    }
  };

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: null });

  const requestDelete = (id, name) => {
    setDeleteModal({ isOpen: true, id, name });
  };

  const confirmDelete = async () => {
    const { id } = deleteModal;
    setDeleteModal({ isOpen: false, id: null, name: null });
    await fetch(`http://localhost:5000/api/staff/${id}`, { method: 'DELETE' });
    flash('🗑️ Account removed');
    fetchStaff();
  };

  const toggleStatus = async (staff) => {
    const newStatus = staff.status === 'Active' ? 'Suspended' : 'Active';
    await fetch(`http://localhost:5000/api/staff/${staff._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    flash(`${newStatus === 'Active' ? '✅ Activated' : '🚫 Suspended'}: ${staff.name}`);
    fetchStaff();
  };

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
          {/* Form */}
          <div className="p-8 border" style={{ backgroundColor: COLORS.bgSurface, borderColor: isEdit ? COLORS.amber : COLORS.border }}>
            <h2 className="text-lg font-serif italic mb-6">{isEdit ? '✏️ Edit Account' : '+ Register New Account'}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-1">Full Name (Username)</label>
                <input type="text" required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ahmad Razif"
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
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-1">Status</label>
                <div className="flex gap-2">
                  {STATUSES.map(s => (
                    <button type="button" key={s} onClick={() => setForm({ ...form, status: s })}
                      className={`flex-1 py-2 text-[10px] uppercase font-black tracking-widest border transition-all ${form.status === s ? (s === 'Active' ? 'border-green-600 bg-green-600/20 text-green-400' : 'border-red-600 bg-red-600/20 text-red-400') : 'border-white/10 text-white/30 hover:border-white/30'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Permissions / Tool Add-Ons */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">Tool Add-Ons & Permissions</label>
                <div className="space-y-2">
                  {PERMISSION_OPTIONS.map(p => {
                    const hasPerm = (form.permissions || []).includes(p.key);
                    return (
                      <button type="button" key={p.key}
                        onClick={() => {
                          const perms = form.permissions || [];
                          setForm({ ...form, permissions: hasPerm ? perms.filter(x => x !== p.key) : [...perms, p.key] });
                        }}
                        className={`w-full flex items-start gap-3 text-left px-3 py-2.5 border transition-all ${
                          hasPerm ? 'border-amber-600/60 bg-amber-600/10' : 'border-white/10 hover:border-white/20'
                        }`}>
                        <span className={`mt-0.5 w-4 h-4 border flex-shrink-0 flex items-center justify-center text-[10px] ${
                          hasPerm ? 'bg-amber-600 border-amber-600 text-white' : 'border-white/30'
                        }`}>{hasPerm ? '✓' : ''}</span>
                        <span>
                          <span className="block text-[10px] uppercase font-black tracking-widest">{p.label}</span>
                          <span className="text-[9px] text-white/30">{p.desc}</span>
                        </span>
                      </button>
                    );
                  })}
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

          {/* Staff Table */}
          <div className="xl:col-span-2 border overflow-hidden" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}>
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-amber-500 font-black">
                <tr>
                  <th className="p-5">Name</th>
                  <th className="p-5">Role</th>
                  <th className="p-5">Status</th>
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
                    <td className="p-5">
                      <button onClick={() => toggleStatus(s)}
                        className={`text-[9px] px-3 py-1 uppercase font-black tracking-widest border transition-all ${s.status === 'Active' ? 'border-green-500/40 text-green-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/40' : 'border-red-500/40 text-red-400 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/40'}`}>
                        {s.status || 'Active'}
                      </button>
                    </td>
                    <td className="p-5 text-right space-x-4">
                      <button onClick={() => { setIsEdit(true); setForm({ _id: s._id, name: s.name, password: '', role: s.role || 'staff', status: s.status || 'Active' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="text-[10px] uppercase font-black tracking-widest text-amber-500 hover:text-amber-300">Edit</button>
                      <button onClick={() => requestDelete(s._id, s.name)}
                        className="text-[10px] uppercase font-black tracking-widest text-red-500/50 hover:text-red-400">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Settings Block */}
        <div className="mt-10 p-8 border" style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.amber }}>
          <h2 className="text-lg font-serif italic mb-6">⚙️ Global Hotel Settings</h2>
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-1">Standard Check-In Time</label>
              <input type="time" value={settings.defaultCheckInTime || "14:00"}
                onChange={e => updateSetting('defaultCheckInTime', e.target.value)}
                className="w-full bg-white/5 border p-3 text-sm outline-none focus:border-amber-500 transition-colors"
                style={{ borderColor: COLORS.border }} />
              <p className="text-[10px] text-white/30 mt-2">New bookings will use this by default, but staff can override it.</p>
            </div>
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-1">Standard Check-Out Time</label>
              <input type="time" value={settings.defaultCheckOutTime || "12:00"}
                onChange={e => updateSetting('defaultCheckOutTime', e.target.value)}
                className="w-full bg-white/5 border p-3 text-sm outline-none focus:border-amber-500 transition-colors"
                style={{ borderColor: COLORS.border }} />
              <p className="text-[10px] text-white/30 mt-2">Automated system prompt will flag any active guest past this time.</p>
            </div>
          </div>
        </div>

      </main>

      <CustomModal 
        isOpen={deleteModal.isOpen}
        title="Delete Account"
        message={`Are you absolutely sure you want to permanently delete the account "${deleteModal.name}"? This is irreversible.`}
        isAlert={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, name: null })}
        confirmText="Yes, Delete Account"
        cancelText="Cancel"
      />
    </div>
  );
}