const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // 例如: 'hotel_logo'
  value: { type: String, required: true }              // 例如: '/images/Logo.png'
});

module.exports = mongoose.model('Setting', settingSchema);