import mongoose from 'mongoose';

/**
 * LoginLog Model
 * Records staff entrance sessions, capturing location and expiration.
 */
const loginLogSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Staff',
    required: true 
  },
  name: { type: String, required: true },
  role: { type: String, required: true },
  
  // Location captures BOTH IP and User-Agent as requested
  location: { 
    ip: { type: String },
    device: { type: String }, // Browser/OS info
    raw: { type: String }     // Full user-agent string
  },

  login_at: { type: Date, default: Date.now },
  expires_at: { 
    type: Date, 
    required: true,
    index: { expires: '24h' } // Optional: Automate cleanup after 24h from entry
  }
}, { timestamps: true });

// Virtual for easy time-left calculation on backend if needed
loginLogSchema.virtual('time_left').get(function() {
  const now = new Date();
  const diff = this.expires_at - now;
  return diff > 0 ? diff : 0;
});

export default mongoose.model('LoginLog', loginLogSchema, 'loginLogs');
