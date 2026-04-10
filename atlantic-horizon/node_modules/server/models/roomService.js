import mongoose from 'mongoose';

const roomServiceSchema = new mongoose.Schema({
  roomName: { type: String, required: true }, 
  roomNumber: { type: String, required: true }, 
  cleaningStatus: { type: String, enum: ['Clean', 'Dirty', 'In Service'], default: 'Clean' },
  serviceRequests: [{
    request: String,
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('RoomService', roomServiceSchema);
