// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // 比如 ADMIN-01 或 STAFF-001
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'staff'], 
    default: 'staff' 
  },
  status: { type: String, default: 'Active' } // IAM 用来 suspend 员工的
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);