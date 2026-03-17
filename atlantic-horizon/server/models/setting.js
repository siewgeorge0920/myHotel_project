import mongoose from 'mongoose'; 

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // 例如: 'hotel_logo'
  value: { type: String, required: true }              // 例如: '/images/Logo.png'
});

export default mongoose.model('Setting', settingSchema);