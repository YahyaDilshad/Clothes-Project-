const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      unique: true,
    },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0, min: 0 },
    reserved: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    location: { type: String, default: 'Main Warehouse' },
    lastSyncedAt: { type: Date, default: Date.now },
    history: [
      {
        change: { type: Number, required: true }, // positive or negative delta
        reason: { type: String, default: 'manual_adjustment' },
        note: { type: String, default: '' },
        actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

inventorySchema.virtual('available').get(function available() {
  return Math.max(this.quantity - this.reserved, 0);
});

inventorySchema.virtual('isLowStock').get(function isLowStock() {
  return this.quantity <= this.lowStockThreshold;
});

inventorySchema.set('toJSON', { virtuals: true });
inventorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Inventory', inventorySchema);
