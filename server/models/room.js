import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  description: {
    default: "Luxury package details pending.",
    type: String,
  },

  // 🏢 INTERNAL STAFF TRACKING ONLY
  unitNumbers: [{
    type: String 
  }],

  // 1. The Foundation (Department)
  department: {
    type: String,
    required: true,
    enum: ['Private Lodge', 'Private Residences & Villas', 'Ultimate Exclusivity']
  },
  
  // 2. The Identity
  name: {
    type: String,
    required: true,
    trim: true
  },
  bedType: {
    type: String,
    required: true,
    enum: ['Single', 'Twin', 'Double', 'Queen', 'King', 'Residence Bed']
  },
  layout: {
    type: String,
    required: true,
    enum: ['Studio-style', 'Linked House', 'Standalone Villa', 'Water Villa']
  },

  // 3. The "Wow" Factor (Tags & Services)
  services: [{
    type: String 
  }],

  // 4. Inventory & Pricing
  pricePerNight: {
    type: Number,
    required: true,
    min: 0
  },
  inventoryQuantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1 
  },
  maxGuests: {
    type: Number,
    required: true,
    min: 1 
  },

  // 5. Appearance & Status
  images: [{
    type: String 
  }],
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

export default mongoose.model('Room', roomSchema);