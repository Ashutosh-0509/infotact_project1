const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
  operatingHours: {
    open: { type: String },
    close: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);
