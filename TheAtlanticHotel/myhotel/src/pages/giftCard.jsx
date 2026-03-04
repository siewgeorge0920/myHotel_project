import React, { useState } from 'react';

export default function GiftCard() {
  const [formData, setFormData] = useState({ senderName: '', recipientName: '', recipientEmail: '', amount: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/giftcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      alert(data.message);
      setFormData({ senderName: '', recipientName: '', recipientEmail: '', amount: '', message: '' });
    } catch (error) { alert("Error saving gift card"); }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl flex flex-col md:flex-row overflow-hidden border border-gray-100">
        
        {/* 左边：美美的照片 */}
        <div className="md:w-5/12 bg-cover bg-center h-64 md:h-auto relative" style={{backgroundImage: "url('/images/hot-spring.jpg')"}}>
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
            <h2 className="text-3xl font-serif mb-2">The Perfect Gift</h2>
            <p className="text-sm text-gray-200">Give the gift of an unforgettable luxury experience at Atlantic Horizon.</p>
          </div>
        </div>

        {/* 右边：填 Form 去 DB */}
        <div className="md:w-7/12 p-10 md:p-14">
          <h2 className="text-2xl font-serif text-gray-900 mb-6 border-b pb-4">Gift Card Details</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Your Name</label>
                <input type="text" value={formData.senderName} onChange={e => setFormData({...formData, senderName: e.target.value})} className="w-full p-3 border outline-none focus:border-amber-500" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Gift Value (RM)</label>
                <select value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-3 border outline-none focus:border-amber-500 bg-white" required>
                  <option value="" disabled>Select Amount</option>
                  <option value="500">RM 500</option>
                  <option value="1000">RM 1,000</option>
                  <option value="2500">RM 2,500</option>
                  <option value="5000">RM 5,000</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Recipient Name</label>
              <input type="text" value={formData.recipientName} onChange={e => setFormData({...formData, recipientName: e.target.value})} className="w-full p-3 border outline-none focus:border-amber-500" required />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Recipient Email</label>
              <input type="email" value={formData.recipientEmail} onChange={e => setFormData({...formData, recipientEmail: e.target.value})} className="w-full p-3 border outline-none focus:border-amber-500" required />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Personal Message</label>
              <textarea rows="4" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full p-3 border outline-none focus:border-amber-500 resize-none"></textarea>
            </div>

            <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 uppercase tracking-widest text-sm hover:bg-amber-600 hover:text-black transition-colors mt-4">
              Proceed to Payment
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}