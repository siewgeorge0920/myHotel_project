import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  client_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  address: String,
  loyalty_tier: { type: String, enum: ['Silver', 'Gold', 'Platinum'], default: 'Silver' },
  total_spend: { type: Number, default: 0 },
  preferences: {
    special_notes: String,
    room_preference: String
  }
}, { timestamps: true });

export default mongoose.model('Client', clientSchema);