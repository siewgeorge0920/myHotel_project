const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Resort', 'Private Lodge', 'Villa'],
    default: 'Resort'
  },
  imageUrl: { type: String, default: 'https://via.placeholder.com/400' },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);