import mongoose from 'mongoose';

// The booking sql schema format to db
const bookingSchema = new mongoose.Schema({
  booking_id: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  guest_name: { type: String, required: true },
  guest_email: { type: String, required: true, index: true },
  guest_phone: { type: String },
  guest_address: { type: String },

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
  assigned_room: { type: String },
  check_in_time: { type: Date },
  extension_hours: { type: Number, default: 0 },
  additional_charges: { type: Number, default: 0 },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
