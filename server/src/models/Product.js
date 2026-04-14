const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  description: { type: String },
  categoryId: { type: String, required: true },
  brandId: { type: String },
  price: { type: Number, required: true },
  costPrice: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  unit: { type: String, default: 'unit' },
  barcode: { type: String },
  images: [{ type: String }],
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Week 2 indexing requirements for full-text caching and specific stores
productSchema.index({ name: 'text', sku: 'text', description: 'text' });
productSchema.index({ categoryId: 1 });
productSchema.index({ storeId: 1 });

module.exports = mongoose.model('Product', productSchema);
