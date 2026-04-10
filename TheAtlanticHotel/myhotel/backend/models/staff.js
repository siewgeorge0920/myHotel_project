const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // 名字必须有，而且不能撞名
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff'], default: 'staff' },
  status: { type: String, default: 'Active' } 
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);