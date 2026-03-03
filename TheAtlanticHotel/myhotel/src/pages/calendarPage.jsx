import React, { useState, useEffect } from 'react';

export default function CalendarPage() {
  const [bookings, setBookings] = useState([]);
  const [newBooking, setNewBooking] = useState({ roomName: '', checkInDate: '', checkOutDate: '', paymentStatus: 'Pending' });

  const fetchBookings = () => {
    fetch('http://localhost:5000/api/bookings')
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAddWalkIn = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...newBooking, bookingId: `BKG-${Math.floor(Math.random()*10000)}` })
      });
      const data = await res.json();
      alert(data.message);
      fetchBookings(); 
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => window.location.href = '/'} className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600">Logout 🚪</button>
        <div className="mb-8 border-b border-gray-200 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Reservation Management</h1>
            <p className="text-sm text-gray-500 mt-1">Overview of all current bookings and walk-in registrations.</p>
          </div>
          <div className="text-sm text-gray-500">
            System Date: {new Date().toLocaleDateString()}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左边：新建预订 Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
            <h2 className="text-lg font-medium text-gray-800 mb-4">New Walk-in Booking</h2>
            <form onSubmit={handleAddWalkIn} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Room Assignment</label>
                <input type="text" placeholder="e.g. Deluxe Suite" value={newBooking.roomName} onChange={e => setNewBooking({...newBooking, roomName: e.target.value})} className="w-full border border-gray-300 p-2.5 text-sm rounded focus:ring-1 focus:ring-blue-500 outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Check-in</label>
                  <input type="date" value={newBooking.checkInDate} onChange={e => setNewBooking({...newBooking, checkInDate: e.target.value})} className="w-full border border-gray-300 p-2.5 text-sm rounded focus:ring-1 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Check-out</label>
                  <input type="date" value={newBooking.checkOutDate} onChange={e => setNewBooking({...newBooking, checkOutDate: e.target.value})} className="w-full border border-gray-300 p-2.5 text-sm rounded focus:ring-1 focus:ring-blue-500 outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Payment Status</label>
                <select value={newBooking.paymentStatus} onChange={e => setNewBooking({...newBooking, paymentStatus: e.target.value})} className="w-full border border-gray-300 p-2.5 text-sm rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white">
                  <option value="Pending">Pending</option>
                  <option value="Deposit">Deposit Paid</option>
                  <option value="Paid">Fully Paid</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded transition-colors mt-2">
                Confirm Reservation
              </button>
            </form>
          </div>

          {/* 右边：预订列表 */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-medium text-gray-800">Reservation Database</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                    <th className="p-4 font-medium">Booking Ref</th>
                    <th className="p-4 font-medium">Room</th>
                    <th className="p-4 font-medium">Duration</th>
                    <th className="p-4 font-medium">Payment</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {bookings.length === 0 ? <tr><td colSpan="5" className="p-4 text-center text-gray-400">No active reservations found.</td></tr> : null}
                  {bookings.map((bkg, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{bkg.bookingId}</td>
                      <td className="p-4 text-gray-700">{bkg.roomName}</td>
                      <td className="p-4 text-gray-500 text-xs">
                        {new Date(bkg.checkInDate).toLocaleDateString()} - {new Date(bkg.checkOutDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bkg.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                          {bkg.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{bkg.bookingStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}