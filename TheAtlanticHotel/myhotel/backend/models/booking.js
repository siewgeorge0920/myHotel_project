// backend/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, // Link 去 Client Schema
  roomName: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Deposit'], default: 'Pending' },
  bookingStatus: { type: String, enum: ['Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'], default: 'Confirmed' },
  managedBy: { type: String } // 记录是哪位 Staff (或 Admin) 处理这个 booking 的
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);