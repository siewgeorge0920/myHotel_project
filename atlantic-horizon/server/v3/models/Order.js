import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  booking_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking', 
    index: true 
  },
  room_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'PhysicalRoom', 
    required: true 
  },
  items: [{
    menu_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
    name: String,
    price: Number,
    quantity: Number
  }],
  total_amount: { type: Number, required: true },
  payment_method: { 
    type: String, 
    enum: ['Stripe', 'ChargeToRoom'], 
    required: true 
  },
  payment_status: { 
    type: String, 
    enum: ['Pending', 'Paid', 'AddedToFolio'], 
    default: 'Pending' 
  },
  order_status: { 
    type: String, 
    enum: ['Received', 'Preparing', 'EnRoute', 'Delivered'], 
    default: 'Received' 
  },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
