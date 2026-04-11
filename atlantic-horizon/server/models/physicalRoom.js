import mongoose from 'mongoose';

const physicalRoomSchema = new mongoose.Schema({
  department: { type: String, required: true },
  roomType: { type: String, required: false }, 
  roomName: { type: String, required: true, unique: true }, // e.g. "PL-101"
  lock_device_id: { type: String, default: null }, // IoT lock identifier
  current_status: { 
    type: String, 
    enum: ['Ready', 'Maintenance', 'Occupied', 'Cleaning'], 
    default: 'Ready' 
  }
}, { timestamps: true });

export default mongoose.model('PhysicalRoom', physicalRoomSchema);
