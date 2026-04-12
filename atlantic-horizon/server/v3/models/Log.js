import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  action: { type: String, required: true },
  details: { type: String },
  user_type: { 
    type: String, 
    enum: ['System', 'Guest', 'Staff'], 
    default: 'System',
    required: true 
  },
  timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

export default mongoose.model('Log', logSchema);
