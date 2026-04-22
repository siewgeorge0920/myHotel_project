import mongoose from 'mongoose';

const giftCardSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true },
  initial_amount: { type: Number, required: true },
  balance: { type: Number, required: true },
  purchaser_name: String,
  purchaser_email: String,
  recipient_name: String,
  recipient_email: String,
  notes: String,
  status: { 
    type: String, 
    enum: ['Active', 'Used', 'Expired', 'Disabled'], 
    default: 'Active' 
  },
  stripe_session_id: { type: String, unique: true, index: true }
}, { timestamps: true });

export default mongoose.model('GiftCard', giftCardSchema);
