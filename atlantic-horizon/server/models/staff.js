import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'staff'], default: 'staff' },
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
  permissions: {
    type: [String],
    default: [],
    // Possible values: 'payment_edit', 'booking_manage', 'room_manage', 'iam_manage'
  }
}, { timestamps: true });

export default mongoose.model('Staff', staffSchema);