import mongoose from 'mongoose';

const cookieConsentSchema = new mongoose.Schema({
  ipAddress: String,
  consentType: { type: String, enum: ['Accepted All', 'Declined Non-Essential'] },
  userAgent: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('CookieConsent', cookieConsentSchema);
