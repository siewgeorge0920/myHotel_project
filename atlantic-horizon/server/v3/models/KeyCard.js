import mongoose from 'mongoose';

const keyCardSchema = new mongoose.Schema({
  booking_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking', 
    required: true, 
    index: true 
  },
  room_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'PhysicalRoom', 
    required: true 
  },
  access_token: { type: String, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('KeyCard', keyCardSchema);
