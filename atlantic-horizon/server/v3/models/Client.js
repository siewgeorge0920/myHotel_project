import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  client_id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  address: { type: String }
}, { timestamps: true });

export default mongoose.model('Client', clientSchema);
