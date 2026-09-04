const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/ApiResponse');
const { getPagination, buildMeta } = require('../utils/paginate');
const { sendCsv } = require('../utils/csv');
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');

// GET /api/inventory?page=&limit=&search=&lowStock=
const getInventory = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { search, lowStock, location } = req.query;

  const filter = {};
  if (search) filter.sku = { $regex: search, $options: 'i' };
  if (location) filter.location = location;

  let query = Inventory.find(filter).populate('product', 'name sku price images');
  if (lowStock === 'true') {
    query = Inventory.find({ ...filter, $expr: { $lte: ['$quantity', '$lowStockThreshold'] } }).populate(
      'product',
      'name sku price images'
    );
  }

  const [items, total] = await Promise.all([
    query.sort({ updatedAt: -1 }).skip(skip).limit(limit),
    Inventory.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: 'Inventory fetched successfully',
    data: items,
    meta: buildMeta(total, page, limit),
  });
});

// PATCH /api/inventory/:id  { adjustment: number, reason, note } OR { quantity: number }
const adjustInventory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { adjustment, quantity, reason, note, lowStockThreshold, location } = req.body;
  
  const inventory = await Inventory.findById(id);
  if (!inventory) throw new ApiError(404, 'Inventory record not found');

  if (adjustment !== undefined) {
    const delta = Number(adjustment);
    const newQty = inventory.quantity + delta;
    if (newQty < 0) throw new ApiError(400, 'Adjustment would result in negative stock');
    inventory.quantity = newQty;
    inventory.history.push({
      change: delta,
      reason: reason || 'manual_adjustment',
      note: note || '',
      actor: req.user?._id || null,
    });
  } else if (quantity !== undefined) {
    const delta = Number(quantity) - inventory.quantity;
    inventory.quantity = Number(quantity);
    inventory.history.push({
      change: delta,
      reason: reason || 'manual_set',
      note: note || '',
      actor: req.user?._id || null,
    });
  }

  if (lowStockThreshold !== undefined) inventory.lowStockThreshold = Number(lowStockThreshold);
  if (location) inventory.location = location;
  inventory.lastSyncedAt = new Date();

  await inventory.save();

  // Mirror the change back onto the Product document so both stay consistent.
  await Product.updateOne({ _id: inventory.product }, { stock: inventory.quantity });

  res.status(200).json({
    success: true,
    message: 'Inventory updated successfully',
    data: inventory,
  });
});

// POST /api/inventory/sync
// Reconciles Inventory records against the Product catalog: creates
// missing inventory records, and aligns quantities that have drifted.
const syncInventory = catchAsync(async (req, res) => {
  const products = await Product.find();
  const inventories = await Inventory.find();
  const inventoryByProduct = new Map(inventories.map((inv) => [inv.product.toString(), inv]));

  let created = 0;
  let realigned = 0;

  for (const product of products) {
    const existing = inventoryByProduct.get(product._id.toString());
    if (!existing) {
      await Inventory.create({
        product: product._id,
        sku: product.sku,
        quantity: product.stock,
        lowStockThreshold: product.lowStockThreshold,
        lastSyncedAt: new Date(),
      });
      created += 1;
    } else if (existing.quantity !== product.stock) {
      existing.history.push({
        change: product.stock - existing.quantity,
        reason: 'sync_realignment',
        note: 'Synced with product stock value',
      });
      existing.quantity = product.stock;
      existing.sku = product.sku;
      existing.lastSyncedAt = new Date();
      await existing.save();
      realigned += 1;
    }
  }

  res.status(200).json({
    success: true,
    message: 'Inventory synced successfully',
    data: { created, realigned, totalProducts: products.length },
  });
});

// GET /api/inventory/export
const exportInventory = catchAsync(async (req, res) => {
  const items = await Inventory.find().populate('product', 'name sku price');

  const rows = items.map((item) => ({
    sku: item.sku,
    product: item.product?.name || 'N/A',
    quantity: item.quantity,
    reserved: item.reserved,
    available: Math.max(item.quantity - item.reserved, 0),
    lowStockThreshold: item.lowStockThreshold,
    location: item.location,
    lastSyncedAt: item.lastSyncedAt?.toISOString() || '',
  }));

  res.status(200).json({
    success: true,
    message: 'Inventory exported successfully',
    data: rows,
  });
});

module.exports = { getInventory, adjustInventory, syncInventory, exportInventory };
