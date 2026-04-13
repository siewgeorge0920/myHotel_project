import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Copy, Download, Home, Gift } from 'lucide-react';

export default function GiftCardSuccess() {
  const [searchParams] = useSearchParams();
  // Stripe success callback session id used to verify and hydrate voucher details.
  const sessionId = searchParams.get('session_id');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [giftCard, setGiftCard] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  // Prevent duplicate verification calls in StrictMode double-invocation scenarios.
  const hasCalledRef = React.useRef(false);

  useEffect(() => {
    // Hard stop when success page is opened without a valid checkout session.
    if (!sessionId) {
      setError("We couldn't identify this transaction session. Please contact the Manor Shadow Team.");
      setLoading(false);
      return;
    }

    if (hasCalledRef.current) return;
    hasCalledRef.current = true;

    const verify = async () => {
      try {
        // Confirm payment session and retrieve the generated gift card payload.
        const res = await axios.post('/api/v3/gift-cards/verify-purchase', { sessionId });
        // Mapping: res.data.data because of sendSuccess wrapper
        setGiftCard(res.data.data);
      } catch (err) {
        console.error("Verification failed:", err);
        setError(err.response?.data?.error || "Our sanctuary core is having trouble verifying this purchase. Rest assured, your funds are safe.");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [sessionId]);

  const copyToClipboard = () => {
    if (giftCard?.code) {
      // Quick utility action with a temporary success state for user feedback.
      navigator.clipboard.writeText(giftCard.code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0f0b] flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-8" />
        <p className="font-cinzel tracking-[0.3em] uppercase text-xs opacity-50">Validating Sanctum Transaction...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0f0b] flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
          <span className="text-4xl text-red-500">!</span>
        </div>
        <h1 className="font-cinzel text-3xl mb-4 text-red-400">MANIFEST ERROR</h1>
        <p className="max-w-md text-gray-400 text-sm mb-12">{error}</p>
        <Link to="/gift-cards" className="px-8 py-3 border border-white/10 hover:border-amber-500 transition-all rounded-full text-[10px] uppercase font-black tracking-widest">
          Return to Vouchers
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0f0b] text-white pt-32 pb-20 px-6 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg aspect-square bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10 text-center">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 animate-pulse">
            <CheckCircle className="text-green-500 w-12 h-12" />
          </div>
        </div>

        <h1 className="font-cinzel text-5xl md:text-6xl mb-4 tracking-widest text-amber-500 uppercase">OFFICIALLY SECURED</h1>
        <p className="text-gray-400 tracking-[0.4em] uppercase text-[10px] mb-16 italic">The sanctuary record has been established</p>

        {/* Voucher Display Card */}
        <div className="bg-gradient-to-br from-[#1a1d17] to-[#0d0f0b] border border-amber-500/30 rounded-3xl p-12 mb-12 relative group shadow-2xl">
          <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
          
          <div className="relative z-10">
            <Gift className="w-8 h-8 text-amber-500/40 mx-auto mb-6" />
            <p className="text-[10px] uppercase tracking-[0.5em] text-gray-500 mb-8 font-black">YOUR UNIQUE VOUCHER CODE</p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
              <div className="bg-black/40 border border-white/5 px-8 py-6 rounded-2xl text-3xl md:text-5xl font-cinzel tracking-[0.2em] text-white shadow-inner">
                {giftCard?.code}
              </div>
              <button 
                onClick={copyToClipboard}
                className={`p-4 rounded-xl transition-all duration-300 border ${isCopied ? 'bg-green-500 border-green-500 text-black' : 'bg-white/5 border-white/10 text-amber-500 hover:bg-amber-500 hover:text-black hover:border-amber-500'}`}
                title="Copy Identification Code"
              >
                {isCopied ? <CheckCircle className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
              </button>
            </div>

            <p className="text-xs text-gray-500 italic max-w-sm mx-auto">
              This code has been dispatched to both the recipient's and your email address. 
              Please present this upon checkout at the Manor.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link to="/" className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-cinzel text-xs font-black tracking-widest hover:bg-amber-500 transition-all uppercase">
            <Home className="w-4 h-4" /> Go to Manor Base
          </Link>
          <button className="flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-full font-cinzel text-xs font-black tracking-widest hover:border-amber-500 transition-all uppercase opacity-30 cursor-not-allowed">
            <Download className="w-4 h-4" /> Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
