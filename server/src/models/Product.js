const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  size: { type: String },
  color: { type: String },
  stock: { type: Number, required: true, default: 0 },
  priceOverride: { type: Number }, // Optional price change for specific variant
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true }, // Base SKU
  description: { type: String },
  categoryId: { type: String, required: true },
  brandId: { type: String },
  price: { type: Number, required: true }, // Base price
  costPrice: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 0 }, // Global aggregate stock
  lowStockThreshold: { type: Number, default: 10 },
  reorderPoint: { type: Number, default: 10 }, // New Field for Phase 4 auto-forecasting
  unit: { type: String, default: 'unit' },
  barcode: { type: String },
  images: [{ type: String }],
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  isActive: { type: Boolean, default: true },
  variants: [productVariantSchema] // Phase 2: Nested Variants
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Week 2 indexing requirements for full-text caching and specific stores
productSchema.index({ name: 'text', sku: 'text', description: 'text', 'variants.sku': 'text' });
productSchema.index({ categoryId: 1 });
productSchema.index({ storeId: 1 });

module.exports = mongoose.model('Product', productSchema);
