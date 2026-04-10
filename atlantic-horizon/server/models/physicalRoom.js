import mongoose from 'mongoose';

const physicalRoomSchema = new mongoose.Schema({
  department: { type: String, required: true },
  roomType: { type: String, required: false }, 
  roomName: { type: String, required: true, unique: true }, // The physical unit identifier, e.g. "PL-101"
  cleaningStatus: { 
    type: String, 
    enum: ['Clean', 'Dirty', 'In Service', 'Maintenance'], 
    default: 'Clean' 
  }
}, { timestamps: true });

export default mongoose.model('PhysicalRoom', physicalRoomSchema);
