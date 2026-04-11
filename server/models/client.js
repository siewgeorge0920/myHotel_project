// backend/models/Client.js
import mongoose from 'mongoose'; 

const clientSchema = new mongoose.Schema({
  clientId: { type: String, unique: true },
  name: { type: String, required: true },
  dob: { type: Date },
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('Client', clientSchema);