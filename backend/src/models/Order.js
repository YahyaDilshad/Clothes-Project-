  const mongoose = require('mongoose');

  const orderItemSchema = new mongoose.Schema(
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      sku: { type: String },
      price: { type: Number, required: true, min: 0 }, // unit price at time of sale
      quantity: { type: Number, required: true, min: 1 },
      subtotal: { type: Number, required: true, min: 0 },
    },
    { _id: false }
  );

  const noteSchema = new mongoose.Schema(
    {
      text: { type: String, required: true, trim: true },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      createdAt: { type: Date, default: Date.now },
    },
    { _id: false }
  );

  const orderSchema = new mongoose.Schema(
    {
      orderNumber: { type: String, required: true, unique: true },
      customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
      items: { type: [orderItemSchema], validate: (v) => v.length > 0 },
      subtotal: { type: Number, required: true, min: 0 },
      discount: { type: Number, default: 0, min: 0 },
      tax: { type: Number, default: 0, min: 0 },
      shippingFee: { type: Number, default: 0, min: 0 },
      total: { type: Number, required: true, min: 0 },
      status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled' , "exchange"],
        default: 'pending',
      },
      paymentStatus: {
        type: String,
        enum: ['unpaid', 'partial', 'paid', 'refunded'],
        default: 'unpaid',
      },
      paymentMethod: {
        type: String,
        enum: ['Cash on Delivery', 'Card Payment', 'Bank Transfer'],
        default: 'Cash on Delivery',
      },
      amountPaid: { type: Number, default: 0, min: 0 },
      channel: { type: String, enum: ['pos', 'online'], default: 'pos' },
      notes: [noteSchema],
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    },
    { timestamps: true }
  );

  orderSchema.index({ orderNumber: 'text' });

  module.exports = mongoose.model('Order', orderSchema);
