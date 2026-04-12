import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  booking_id: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  guest_name: { type: String, required: true },
  guest_email: { type: String, required: true, index: true },
  room_type: { type: String, required: true },
  check_in: { type: Date, required: true },
  check_out: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled'], 
    default: 'Pending',
    required: true 
  },
  total_amount: { type: Number, required: true },
  payment_status: { 
    type: String, 
    enum: ['Unpaid', 'PartiallyPaid', 'Paid'], 
    default: 'Unpaid' 
  },
  stripe_session_id: { type: String, default: null },
  folio_charges: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order' 
  }],
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
