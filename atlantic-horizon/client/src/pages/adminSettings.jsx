import React, { useState, useEffect } from 'react';
import ManagementSidebar from '../components/managementSidebar';
import axios from 'axios';
import { COLORS } from '../colors';
import { Save, Mail, Server, Shield, Loader, CheckCircle, FileText, Code } from 'lucide-react';

export default function AdminSettings() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [isManagerMode] = useState(() => localStorage.getItem('managerMode') === 'true');
  
  const [emailConfig, setEmailConfig] = useState({
    email_user: '',
    email_pass: '',
    email_host: 'smtp.zoho.com',
    email_port: '465',
    email_template_booking: '',
    email_template_checkin: '',
    email_template_giftcard: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/v3/settings/email');
        const settings = data.data || {};
        setEmailConfig({
          email_user: settings.email_user || '',
          email_pass: settings.email_pass || '',
          email_host: settings.email_host || 'smtp.zoho.com',
          email_port: settings.email_port || '465',
          email_template_booking: settings.email_template_booking || '',
          email_template_checkin: settings.email_template_checkin || '',
          email_template_giftcard: settings.email_template_giftcard || ''
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
    <TemplatesSettingsUI 
      loading={loading}
      emailConfig={emailConfig}
      setEmailConfig={setEmailConfig}
      saving={saving}
      message={message}
      handleSave={handleSave}
      user={user}
      isManagerMode={isManagerMode}
    />
  );
}

// 🟢 FIX: Define sub-components OUTSIDE to prevent focus loss on re-render
const TemplateField = ({ label, value, onChange, placeholders }) => (
  <div className="space-y-4 pt-6 border-t border-white/5">
    <div className="flex justify-between items-end">
      <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">{label}</label>
      <span className="text-[9px] text-gray-500 italic">Placeholders: {placeholders.join(', ')}</span>
    </div>
    <textarea
      className="w-full bg-white/5 border border-white/10 p-4 font-mono text-[12px] min-h-[200px] focus:border-amber-500 outline-none transition-all text-gray-300 leading-relaxed rounded-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter HTML template content here..."
    />
  </div>
);

const TemplatesSettingsUI = ({ loading, emailConfig, setEmailConfig, saving, message, handleSave, user, isManagerMode }) => {
  return (
    <div className="flex min-h-screen text-white font-sans" style={{ backgroundColor: COLORS.bgDeep }}>
      <ManagementSidebar user={user} isManagerMode={isManagerMode} />
      
      <main className="flex-1 p-8 lg:p-16">
        <header className="mb-12 border-b pb-8 flex justify-between items-end" style={{ borderColor: COLORS.border }}>
          <div>
            <p className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-black mb-3">System Control</p>
            <h1 className="text-4xl font-serif italic tracking-wide">Infrastructure Settings</h1>
          </div>
          <div className="text-right opacity-40">
            <p className="text-[10px] uppercase tracking-widest font-bold">Node Environment</p>
            <p className="text-sm font-mono">V3.0 Sanctuary Core</p>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center gap-3 text-white/40 justify-center py-20">
            <Loader className="animate-spin" /> Gathering encrypted sanctuary protocols...
          </div>
        ) : (
          <form onSubmit={handleSave} className="max-w-4xl space-y-10 pb-20">
            {/* SMTP SECTION */}
            <div className="bg-[#1e2219] border border-amber-600/20 p-10 rounded-sm shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Server size={80} />
               </div>
               
              <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
                <div className="w-12 h-12 bg-amber-600/20 rounded-full flex items-center justify-center">
                  <Mail className="text-amber-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic">Email SMTP Gateway</h2>
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

              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">SMTP Host</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-white/5 border border-white/10 py-4 px-4 focus:border-amber-500 outline-none transition-all text-sm"
                      value={emailConfig.email_host}
                      onChange={(e) => setEmailConfig({...emailConfig, email_host: e.target.value})}
                      placeholder="smtp.zoho.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">SMTP Port</label>
                    <input
                      required
                      type="number"
                      className="w-full bg-white/5 border border-white/10 py-4 px-4 focus:border-amber-500 outline-none transition-all text-sm"
                      value={emailConfig.email_port}
                      onChange={(e) => setEmailConfig({...emailConfig, email_port: e.target.value})}
                      placeholder="465"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">System Email</label>
                    <input
                      required
                      type="email"
                      className="w-full bg-white/5 border border-white/10 py-4 px-4 focus:border-amber-500 outline-none transition-all text-sm"
                      value={emailConfig.email_user}
                      onChange={(e) => setEmailConfig({...emailConfig, email_user: e.target.value})}
                      placeholder="admin@yourdomain.ie"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">App Password</label>
                    <input
                      required
                      type="password"
                      className="w-full bg-white/5 border border-white/10 py-4 px-4 focus:border-amber-500 outline-none transition-all text-sm"
                      value={emailConfig.email_pass}
                      onChange={(e) => setEmailConfig({...emailConfig, email_pass: e.target.value})}
                      placeholder="••••••••••••••••"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <button
                    disabled={saving}
                    className="bg-amber-600 hover:bg-amber-700 w-full py-4 text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-xl"
                  >
                    {saving ? <Loader className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saving ? 'SAVING...' : 'COMMIT SMTP CONFIG'}
                  </button>
                </div>
              </div>
            </div>

            {/* TEMPLATES SECTION */}
            <div className="bg-[#1e2219] border border-amber-600/20 p-10 rounded-sm shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Code size={80} />
               </div>

              <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
                <div className="w-12 h-12 bg-amber-600/20 rounded-full flex items-center justify-center">
                  <FileText className="text-amber-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic">Notification Templates</h2>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Design automated HTML responses for guests</p>
                </div>
              </div>

              <div className="space-y-12">
                <TemplateField 
                  label="Booking Confirmation"
                  value={emailConfig.email_template_booking}
                  onChange={(val) => setEmailConfig({...emailConfig, email_template_booking: val})}
                  placeholders={['{{guest_name}}', '{{booking_id}}', '{{room_type}}', '{{check_in}}', '{{check_out}}', '{{stay_range}}']}
                />

                <TemplateField 
                  label="Check-in Welcome"
                  value={emailConfig.email_template_checkin}
                  onChange={(val) => setEmailConfig({...emailConfig, email_template_checkin: val})}
                  placeholders={['{{guest_name}}', '{{room_number}}']}
                />

                <TemplateField 
                  label="Gift Card Delivery"
                  value={emailConfig.email_template_giftcard}
                  onChange={(val) => setEmailConfig({...emailConfig, email_template_giftcard: val})}
                  placeholders={['{{recipient_name}}', '{{purchaser_name}}', '{{code}}', '{{amount}}']}
                />
              </div>

              <div className="pt-10 border-t border-white/5 mt-10">
                  <button
                    disabled={saving}
                    className="bg-amber-600 hover:bg-amber-700 w-full py-5 text-[11px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-2xl"
                  >
                    {saving ? <Loader className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saving ? 'SYNCHRONIZING...' : 'COMMIT ALL INFRASTRUCTURE CHANGES'}
                  </button>
              </div>
            </div>

            
          </form>
        )}
      </main>
    </div>
  );
};

