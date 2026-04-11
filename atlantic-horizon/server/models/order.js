import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  roomName: { type: String, required: true }, // PhysicalRoom identifier
  items: [{
    menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 1 }
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Stripe', 'ChargeToRoom'], required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Failed'], default: 'Pending' },
  status: { 
    type: String, 
    enum: ['Received', 'Preparing', 'Delivering', 'Completed', 'Cancelled'], 
    default: 'Received' 
  },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
