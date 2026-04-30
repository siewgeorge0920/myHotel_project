import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  staff_id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['staff', 'manager', 'admin'], 
    default: 'staff',
    required: true 
  },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

export default mongoose.model('Staff', staffSchema);
