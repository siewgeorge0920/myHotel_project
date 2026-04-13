import mongoose from 'mongoose'; 

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // Example: 'hotel_logo'
  value: { type: String, required: true }              // Example: '/images/Logo.png'
});

export default mongoose.model('Setting', settingSchema);