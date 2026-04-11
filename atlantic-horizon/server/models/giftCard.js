import mongoose from 'mongoose';

const giftCardSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true,
    index: true 
  },
  initialAmount: { type: Number, required: true },
  balance: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Active', 'Used', 'Cancelled'], 
    default: 'Active' 
  },
  purchaserName: { type: String },
  purchaserEmail: { type: String, required: true },
  recipientName: { type: String },
  recipientEmail: { type: String, required: true },
  notes: { type: String },
  stripeSessionId: { type: String },
  expiryDate: { type: Date }
}, { timestamps: true });

export default mongoose.model('GiftCard', giftCardSchema);
