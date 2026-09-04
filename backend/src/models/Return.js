const mongoose = require('mongoose');

const returnItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const returnSchema = new mongoose.Schema(
  {
    returnNumber: { type: String, required: true, unique: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
    items: { type: [returnItemSchema], validate: (v) => v.length > 0 },
    reason: { type: String, trim: true, default: '' },
    refundAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'completed'],
      default: 'requested',
    },
    restocked: { type: Boolean, default: false },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Return', returnSchema);
