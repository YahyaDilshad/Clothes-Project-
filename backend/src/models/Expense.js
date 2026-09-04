const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      trim: true,
      default: 'General',
    },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true, default: '' },
    date: { type: Date, default: Date.now },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'bank_transfer', 'other'],
      default: 'cash',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
