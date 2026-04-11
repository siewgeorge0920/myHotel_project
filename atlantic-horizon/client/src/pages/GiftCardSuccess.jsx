import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Mail, Home, ArrowRight } from 'lucide-react';

export default function GiftCardSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [cardCode, setCardCode] = useState('');

  useEffect(() => {
    const verifyPurchase = async () => {
      if (!sessionId) {
        setStatus('error');
        return;
      }
      try {
        const { data } = await axios.post('/api/gift-cards/verify-purchase', { sessionId });
        if (data.success || data.code) {
          setCardCode(data.code);
          setStatus('success');
        }
      } catch (error) {
        console.error("Verification failed:", error);
        setStatus('error');
      }
    };

    verifyPurchase();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[#0d0f0b] flex items-center justify-center p-6 pt-32">
      <div className="max-w-xl w-full bg-[#1a1d17] border border-white/10 rounded-[40px] p-12 text-center shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full" />
        
        {status === 'verifying' && (
          <div className="space-y-6">
            <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto" />
            <h2 className="font-cinzel text-2xl tracking-widest text-amber-500 italic">SANCTIFYING PURCHASE...</h2>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-8 animate-[fadeIn_1s_ease-out]">
            <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto" strokeWidth={1} />
            <h1 className="font-cinzel text-4xl tracking-widest text-white">PURCHASE COMPLETE</h1>
            <p className="text-gray-400 font-serif italic text-lg leading-relaxed">
              Your gift of luxury has been sanctified. A unique redemption code has been dispatched via Zoho Mail to the recipient.
            </p>

            <div className="bg-black/40 border border-amber-500/20 rounded-2xl p-6 my-8">
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-2">Voucher Reference</p>
              <p className="font-cinzel text-2xl text-amber-500 tracking-[0.2em]">{cardCode}</p>
            </div>

            <div className="space-y-4 pt-4">
              <Link 
                to="/"
                className="w-full bg-amber-500 text-black font-cinzel font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
              >
                <Home className="w-4 h-4" />
                RETURN TO MANOR
              </Link>
              <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                <Mail className="w-3 h-3" />
                A backup copy was sent to your email
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <h2 className="font-cinzel text-2xl text-red-500">ALAMAK, VERIFICATION ERROR</h2>
            <p className="text-gray-400">We couldn't verify your session. If you have been charged, please contact the Manor staff.</p>
            <Link to="/" className="inline-flex items-center gap-2 text-amber-500 hover:text-white transition-colors">
              Go Home <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
