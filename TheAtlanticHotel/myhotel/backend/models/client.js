// backend/models/Client.js
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  clientId: { type: String, unique: true },
  name: { type: String, required: true },
  dob: { type: Date },
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);