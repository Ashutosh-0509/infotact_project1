const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  discountText: { type: String, required: true }, // "Flat 50%", "Up to 40%"
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  productsIncluded: { type: Number, default: 0 },
  uses: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Promotion', promotionSchema);
