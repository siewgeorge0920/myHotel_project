import mongoose from 'mongoose';

const cookieConsentSchema = new mongoose.Schema({
  preference: {
    type: String,
    required: true,
    enum: ['accepted', 'declined']
  },
  userAgent: {
    type: String
  },
  ip: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const CookieConsent = mongoose.model('CookieConsent', cookieConsentSchema);

export default CookieConsent;
