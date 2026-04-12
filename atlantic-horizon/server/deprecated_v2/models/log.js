// backend/models/Log.js
import mongoose from 'mongoose'; 

const logSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., "Created New Booking", "Deleted Staff"
  performedBy: { type: String, required: true }, // 谁做的 (Staff ID / Admin ID)
  targetId: { type: String }, // 针对谁做的 (Booking ID 还是 Client ID)
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Log', logSchema);