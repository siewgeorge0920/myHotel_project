import React, { useState, useEffect } from 'react';
import ManagementSidebar from '../components/managementSidebar';
import axios from 'axios';
import { COLORS } from '../colors';
import { Save, Mail, Server, Shield, Loader, CheckCircle } from 'lucide-react';

export default function AdminSettings() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [isManagerMode] = useState(() => localStorage.getItem('managerMode') === 'true');
  
  const [emailConfig, setEmailConfig] = useState({
    user: '',
    pass: '',
    host: 'smtp.zoho.com',
    port: '465'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/v3/settings/email');
        setEmailConfig({
          user: data.email_user || '',
          pass: data.email_pass || '',
          host: data.email_host || 'smtp.zoho.com',
          port: data.email_port || '465'
        });
      } catch (err) {
        console.error("Failed to fetch settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
      await axios.post('/api/v3/settings/email', emailConfig);
      setMessage({ text: 'Configuration saved successfully!', type: 'success' });
      // Clear password field to masked state if user wants, but masked state is handled by backend on next load
    } catch (err) {
      setMessage({ text: 'Failed to save settings: ' + (err.response?.data?.error || err.message), type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (user?.role !== 'admin' && user?.role !== 'manager') {
     return <div className="p-20 text-center text-red-500 font-black uppercase tracking-widest mt-12">Access Denied. Admin or Manager role required.</div>;
  }

  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManagerMode} />
      
      <main className="flex-1 p-8 lg:p-16">
        <header className="mb-12 border-b pb-8" style={{ borderColor: COLORS.border }}>
          <p className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-black mb-3">System Control</p>
          <h1 className="text-4xl font-serif italic tracking-wide">Infrastructure Settings</h1>
        </header>

        {loading ? (
          <div className="flex items-center gap-3 text-white/40">
            <Loader className="animate-spin" /> Fetching secure configurations...
          </div>
        ) : (
          <div className="max-w-3xl">
            <div className="bg-[#1e2219] border border-amber-600/30 p-10 rounded-sm shadow-2xl">
              <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
                <div className="w-12 h-12 bg-amber-600/20 rounded-full flex items-center justify-center">
                  <Mail className="text-amber-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic">Email SMTP Configuration</h2>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Configure Zoho or other Business Mail services</p>
                </div>
              </div>

              {message.text && (
                <div className={`mb-8 p-4 border text-[11px] uppercase tracking-widest flex items-center gap-3 ${
                  message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {message.type === 'success' ? <CheckCircle size={16} /> : <Shield size={16} />}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">SMTP Host</label>
                    <div className="relative">
                      <Server className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        required
                        type="text"
                        className="w-full bg-white/5 border border-white/10 py-4 pl-12 pr-4 focus:border-amber-500 outline-none transition-all text-sm"
                        value={emailConfig.host}
                        onChange={(e) => setEmailConfig({...emailConfig, host: e.target.value})}
                        placeholder="smtp.zoho.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">SMTP Port</label>
                    <input
                      required
                      type="number"
                      className="w-full bg-white/5 border border-white/10 py-4 px-4 focus:border-amber-500 outline-none transition-all text-sm"
                      value={emailConfig.port}
                      onChange={(e) => setEmailConfig({...emailConfig, port: e.target.value})}
                      placeholder="465"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">User / Email</label>
                    <input
                      required
                      type="email"
                      className="w-full bg-white/5 border border-white/10 py-4 px-4 focus:border-amber-500 outline-none transition-all text-sm"
                      value={emailConfig.user}
                      onChange={(e) => setEmailConfig({...emailConfig, user: e.target.value})}
                      placeholder="admin@yourdomain.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">App Password</label>
                    <input
                      required
                      type="password"
                      className="w-full bg-white/5 border border-white/10 py-4 px-4 focus:border-amber-500 outline-none transition-all text-sm"
                      value={emailConfig.pass}
                      onChange={(e) => setEmailConfig({...emailConfig, pass: e.target.value})}
                      placeholder="••••••••••••••••"
                    />
                    <p className="text-[9px] text-gray-600 uppercase mt-2">Note: Use an App Password if 2FA is enabled on Zoho.</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <button
                    disabled={saving}
                    className="bg-amber-600 hover:bg-amber-700 w-full py-4 text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-xl"
                  >
                    {saving ? <Loader className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saving ? 'SAVING...' : 'COMMIT CHANGES'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="mt-8 p-6 border border-white/5 bg-white/5 opacity-50 italic text-[11px] leading-relaxed">
              * Changing these settings will immediately affect the Gift Card delivery system and automated invoice generation. Verify all credentials before committing.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
