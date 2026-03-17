import mongoose from 'mongoose'; 

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  roomName: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  price: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Deposit', 'Failed', 'Refunded'], default: 'Pending' },
  bookingStatus: { type: String, enum: ['Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled', 'Pending'], default: 'Confirmed' },
  managedBy: { type: String }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);