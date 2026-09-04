const mongoose = require('mongoose');

const exchangeSchema = new mongoose.Schema(
  {
    exchangeNumber: { type: String, required: true, unique: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
    oldItem: {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
    },
    newItem: {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
    },
    priceDifference: { type: Number, default: 0 }, // positive = customer owes more
    reason: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'completed'],
      default: 'requested',
    },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exchange', exchangeSchema);
