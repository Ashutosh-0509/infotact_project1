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
  },
  // Phase 3: GeoJSON coordinates [longitude, latitude]
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  }
}, { timestamps: true });

// Crucial: 2dsphere index for geospatial $geoNear algorithms
storeSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Store', storeSchema);
