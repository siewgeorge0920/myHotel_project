import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  department: { 
    type: String, 
    enum: ['Private Lodge', 'Private Residences & Villas', 'Ultimate Exclusivity'],
    required: true 
  },
  name: { type: String, required: true },
  description: String,
  bedType: {
    type: String,
    enum: ['Single', 'Twin', 'Double', 'Queen', 'King', 'Residence Bed'],
    default: 'Double'
  },
  layout: {
    type: String,
    enum: ['Studio-style', 'Linked House', 'Standalone Villa', 'Water Villa'],
    default: 'Studio-style'
  },
  services: [String],
  pricePerNight: { type: Number, required: true },
  maxGuests: { type: Number, default: 2 },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

const RoomType = mongoose.model('Room', roomSchema);
export default RoomType;
