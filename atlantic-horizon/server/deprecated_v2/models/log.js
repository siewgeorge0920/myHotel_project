// backend/models/Log.js
import mongoose from 'mongoose'; 

const logSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., "Created New Booking", "Deleted Staff"
  performedBy: { type: String, required: true }, // Who performed the action (Staff ID / Admin ID)
  targetId: { type: String }, // Who the action was performed on (Booking ID or Client ID)
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Log', logSchema);