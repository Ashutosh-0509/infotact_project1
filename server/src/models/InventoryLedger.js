const mongoose = require('mongoose');

const inventoryLedgerSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  type: { type: String, enum: ['IN', 'OUT', 'ADJUSTMENT', 'SALE', 'RETURN'], required: true },
  quantity: { type: Number, required: true },
  previousStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId }, // e.g. Order ID, or adjustment reason
  notes: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Add indexing for ledger queries
inventoryLedgerSchema.index({ productId: 1, createdAt: -1 });
inventoryLedgerSchema.index({ type: 1 });

module.exports = mongoose.model('InventoryLedger', inventoryLedgerSchema);
