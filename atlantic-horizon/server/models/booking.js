import mongoose from 'mongoose'; 

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  department: { type: String },
  roomName: { type: String, required: true },
  assignedUnit: { type: String },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  expectedCheckInTime: { type: String, default: "14:00" },
  expectedCheckOutTime: { type: String, default: "12:00" },
  actualCheckInTime: { type: Date },
  actualCheckOutTime: { type: Date },
  price: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Deposit', 'Failed', 'Refunded'], default: 'Pending' },
  bookingStatus: { type: String, enum: ['Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled', 'Pending'], default: 'Confirmed' },
  managedBy: { type: String }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);