import mongoose from 'mongoose';

/**
 * UserLog Model (Audit Trail)
 * Records actions performed by staff and system events.
 */
const userLogSchema = new mongoose.Schema({
  action: { type: String, required: true, index: true },
  details: { type: String },
  performed_by: { type: String, required: true },
  target_id: { type: String },
  user_type: { 
    type: String, 
    enum: ['System', 'Guest', 'Staff'], 
    default: 'Staff',
    required: true 
  },
  timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

export default mongoose.model('UserLog', userLogSchema, 'userLogs');
