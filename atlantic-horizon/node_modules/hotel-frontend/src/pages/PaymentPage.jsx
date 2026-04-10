import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { COLORS } from '../colors';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51O2x5uD8Uo1oVpA1z2B3c4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9M0N');

function CheckoutForm({ clientSecret, bookingId, totalPrice }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      
      // Update booking status
      await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'Paid' })
      });

      // Redirect to success or calendar
      setTimeout(() => navigate('/calendar?success=1'), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="p-4 border border-white/20 mb-6 bg-white/5">
        <CardElement options={{
          style: {
            base: {
              color: '#ffffff',
              fontFamily: 'serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': { color: '#ffffff80' }
            },
            invalid: { color: '#fa755a', iconColor: '#fa755a' }
          }
        }} />
      </div>
      {error && <div className="text-red-400 text-xs mb-4">{error}</div>}
      {succeeded ? (
        <div className="text-green-400 text-sm font-black uppercase tracking-widest text-center animate-pulse">
          ✅ Payment Successful! Redirecting...
        </div>
      ) : (
        <button 
          disabled={processing || succeeded}
          className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 uppercase tracking-[0.2em] font-black transition-all disabled:opacity-50"
        >
          {processing ? 'Processing Securely...' : `Pay €${totalPrice}`}
        </button>
      )}
    </form>
  );
}

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState(null);

  const { bookingId, selectedRoom, guestInfo, nights, totalPrice } = location.state || {};

  useEffect(() => {
    if (!bookingId || !totalPrice) {
      navigate('/calendar');
      return;
    }

    fetch('http://localhost:5000/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomName: selectedRoom?.name,
        amount: totalPrice,
        guestEmail: guestInfo?.email
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        setError(data.error || 'Failed to initialize payment gateway. Please check Stripe API keys.');
      }
    })
    .catch(err => setError(err.message));
  }, [bookingId, selectedRoom, guestInfo, totalPrice, navigate]);

  return (
    <div className="min-h-screen bg-[#1a1d17] flex flex-col items-center justify-center text-white px-6 font-sans py-20">
      <div className="max-w-md w-full border border-white/10 bg-[#22251f] p-8 shadow-2xl">
        <div className="text-center mb-8 pb-8 border-b border-white/10">
          <p className="text-[10px] text-amber-500 uppercase tracking-widest font-black mb-2">Secure Checkout</p>
          <h1 className="text-3xl font-serif text-white">{selectedRoom?.name || 'Exclusive Booking'}</h1>
          <p className="text-white/40 text-xs mt-2">{nights} Nights • {guestInfo?.firstName} {guestInfo?.lastName}</p>
        </div>

        {error ? (
          <div className="text-center">
            <p className="text-red-400 mb-6">{error}</p>
            <button onClick={() => navigate('/calendar')} className="border border-white/20 px-8 py-3 text-xs uppercase hover:bg-white/5">Back to Calendar</button>
          </div>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientSecret={clientSecret} bookingId={bookingId} totalPrice={totalPrice} />
          </Elements>
        ) : (
          <p className="text-center text-white/30 text-xs uppercase animate-pulse">Initializing Secure Gateway...</p>
        )}
      </div>
    </div>
  );
}