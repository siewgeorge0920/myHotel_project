import mongoose from 'mongoose';  // ✅ 换成 import

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Resort', 'Private Lodge', 'Villa'],
    default: 'Resort'
  },
  capacity: { type: Number, default: 1 }, 
  imageUrl: { type: String, default: 'https://via.placeholder.com/400' },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Room', roomSchema);