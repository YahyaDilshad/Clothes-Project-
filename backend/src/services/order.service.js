const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Customer = require('../models/Customer');

/**
 * Validates requested order items against the Product collection,
 * checks stock availability, and returns fully-priced line items
 * plus computed totals. Prices are ALWAYS taken from the database,
 * never trusted from the client.
 */
const buildOrderItems = async (requestedItems = []) => {
  if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
    throw new ApiError(400, 'Order must contain at least one item');
  }

  const productIds = requestedItems.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  const items = [];
  let subtotal = 0;

  for (const reqItem of requestedItems) {
    const product = productMap.get(String(reqItem.product));
    if (!product) {
      throw new ApiError(404, `Product not found: ${reqItem.product}`);
    }
    const quantity = Number(reqItem.quantity);
    if (!quantity || quantity < 1) {
      throw new ApiError(400, `Invalid quantity for product ${product.name}`);
    }
    if (product.stock < quantity) {
      throw new ApiError(409, `Insufficient stock for '${product.name}'. Available: ${product.stock}, requested: ${quantity}`);
    }

    const lineSubtotal = product.price * quantity;
    subtotal += lineSubtotal;

    items.push({
      product: product._id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity,
      subtotal: lineSubtotal,
    });
  }

  return { items, subtotal };
};

/**
 * Computes final order totals from subtotal + discount + tax + shipping.
 */
const computeTotals = ({ subtotal, discount = 0, taxRate = 0, shippingFee = 0 }) => {
  const discountedSubtotal = Math.max(subtotal - discount, 0);
  const tax = Number(((discountedSubtotal * taxRate) / 100).toFixed(2));
  const total = Number((discountedSubtotal + tax + shippingFee).toFixed(2));
  return { tax, total };
};

/**
 * Decrements product stock and inventory quantity for each order item.
 * Must be called within a transaction/session where possible.
 */
const decrementStockForItems = async (items, session) => {
  for (const item of items) {
    await Product.updateOne(
      { _id: item.product },
      { $inc: { stock: -item.quantity } },
      { session }
    );
    await Inventory.updateOne(
      { product: item.product },
      {
        $inc: { quantity: -item.quantity },
        $push: {
          history: {
            change: -item.quantity,
            reason: 'order_sale',
            note: `Sold via order`,
          },
        },
        lastSyncedAt: new Date(),
      },
      { session, upsert: true }
    );
  }
};

/**
 * Restocks inventory/product stock for returned or cancelled items.
 */
const restockItems = async (items, reason = 'return_restock', session) => {
  for (const item of items) {
    await Product.updateOne(
      { _id: item.product },
      { $inc: { stock: item.quantity } },
      { session }
    );
    await Inventory.updateOne(
      { product: item.product },
      {
        $inc: { quantity: item.quantity },
        $push: { history: { change: item.quantity, reason } },
        lastSyncedAt: new Date(),
      },
      { session, upsert: true }
    );
  }
};

/**
 * Updates (or creates) the customer's aggregate order stats.
 */
const applyCustomerStats = async (customerId, orderTotal, session) => {
  if (!customerId) return;
  await Customer.updateOne(
    { _id: customerId },
    { $inc: { totalOrders: 1, totalSpent: orderTotal } },
    { session }
  );
};

module.exports = {
  buildOrderItems,
  computeTotals,
  decrementStockForItems,
  restockItems,
  applyCustomerStats,
};
