import mongoose from 'mongoose';

const physicalRoomSchema = new mongoose.Schema({
  room_name: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  department: { type: String, required: true },
  room_type_category: { type: String, required: true },
  lock_device_id: { type: String, default: null },
  current_status: { 
    type: String, 
    enum: ['Ready', 'Maintenance', 'Occupied', 'Cleaning'], 
    default: 'Ready',
    required: true
  },
  active_booking: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking',
    default: null 
  }
}, { timestamps: true });

export default mongoose.model('PhysicalRoom', physicalRoomSchema);
