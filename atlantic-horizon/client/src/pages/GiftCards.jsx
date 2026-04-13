import React, { useState } from 'react';
import axios from 'axios';
import { Gift, Mail, User, CreditCard, ChevronRight } from 'lucide-react';

export default function GiftCards() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: 500,
    purchaserName: '',
    purchaserEmail: '',
    recipientName: '',
    recipientEmail: '',
    notes: ''
  });

  const amounts = [500, 1000, 2500, 5000];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/v3/gift-cards/checkout', formData);
      console.log("V3 GC Debug Response:", res.data);

      const checkoutUrl = res.data.data?.url || res.data.url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Checkout URL not found in response. Restart backend logic.");
      }
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Alamak, purchase failed: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleInstantIssue = async () => {
    if (!formData.recipientEmail || !formData.recipientName) {
      alert("Please fill in recipient details first!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/api/v3/gift-cards/instant-purchase', formData);
      const { code, stripe_session_id } = res.data.data;
      window.location.href = `/gift-card-success?session_id=${stripe_session_id}`;
    } catch (error) {
      alert("Instant issue failed: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f0b] text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-cinzel text-5xl md:text-6xl mb-4 tracking-widest text-amber-500">GIFT THE MANOR</h1>
          <p className="text-gray-400 tracking-[0.2em] uppercase text-sm">Share the ultimate luxury experience with someone special</p>
          <div className="h-px w-24 bg-amber-500 mx-auto mt-8 opacity-50" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Card Preview */}
          <div className="sticky top-40">
            <div className="aspect-[1.6/1] bg-gradient-to-br from-[#1a1d17] to-[#0d0f0b] border border-amber-500/30 rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[80px] rounded-full group-hover:bg-amber-500/10 transition-all duration-700" />
              
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
                  <Gift className="text-amber-500 w-6 h-6" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">Value</p>
                  <p className="font-cinzel text-3xl text-amber-500">€{formData.amount}</p>
                </div>
              </div>

              <div>
                <h3 className="font-cinzel text-xl tracking-widest mb-1">ATLANTIC HORIZON</h3>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500">Luxury Estate Voucher</p>
              </div>

              <div className="flex justify-between items-end border-t border-white/5 pt-4">
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-gray-600 mb-1">Prepared For</p>
                  <p className="font-serif italic text-sm text-gray-300">{formData.recipientName || 'Your Recipient'}</p>
                </div>
                <div className="opacity-30">
                  {/* Subtle Manor Logo Mockup */}
                  <div className="w-8 h-8 rounded-full border border-white" />
                </div>
              </div>
            </div>
            
            <div className="mt-8 space-y-4 text-gray-400 text-sm italic">
              <p className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-amber-500" /> Valid for 24 months from purchase</p>
              <p className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-amber-500" /> Redeemable for all manor services</p>
              <p className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-amber-500" /> Instant digital delivery via Zoho</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <h2 className="font-cinzel text-xl tracking-widest mb-8 border-b border-white/10 pb-4">VOUCHER DETAILS</h2>
            
            <div className="space-y-6">
              {/* Amount Selection */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-4 font-bold">Select Amount</label>
                <div className="grid grid-cols-2 gap-3">
                  {amounts.map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setFormData({...formData, amount: val})}
                      className={`py-3 px-4 rounded-xl border transition-all duration-300 font-cinzel text-lg ${
                        formData.amount === val 
                        ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20' 
                        : 'bg-transparent border-white/10 text-gray-400 hover:border-amber-500/50 hover:text-white'
                      }`}
                    >
                      €{val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400">Recipient Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      required
                      type="text"
                      placeholder="Who is this for?"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-amber-500 outline-none transition-all"
                      value={formData.recipientName}
                      onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400">Recipient Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      required
                      type="email"
                      placeholder="Where should we send it?"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-amber-500 outline-none transition-all"
                      value={formData.recipientEmail}
                      onChange={(e) => setFormData({...formData, recipientEmail: e.target.value})}
                    />
                  </div>
                </div>

                <div className="h-px bg-white/5 my-2" />

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400">Your Name (Purchaser)</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-amber-500 outline-none transition-all"
                    value={formData.purchaserName}
                    onChange={(e) => setFormData({...formData, purchaserName: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400">Your Email</label>
                  <input
                    required
                    type="email"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-amber-500 outline-none transition-all"
                    value={formData.purchaserEmail}
                    onChange={(e) => setFormData({...formData, purchaserEmail: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-8">
                <button
                  disabled={loading}
                  className="w-full bg-amber-500 text-black font-cinzel font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50"
                >
                  <CreditCard className="w-5 h-5" />
                  {loading ? 'PROCESSING...' : 'PURCHASE VOUCHER'}
                </button>

                <button
                  type="button"
                  onClick={handleInstantIssue}
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 text-white font-cinzel text-[10px] py-3 rounded-xl hover:bg-white/10 transition-all tracking-[0.2em] font-black"
                >
                  ISSUE COMPLIMENTARY (SKIP PAYMENT)
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
