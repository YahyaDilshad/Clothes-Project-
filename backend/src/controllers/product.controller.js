const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/ApiResponse');
const { getPagination, buildMeta } = require('../utils/paginate');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const { uploadBuffer ,uploadMany , deleteAsset}  = require('../config/cloudinary.js')
// GET /api/products?page=&limit=&search=&category=&collection=&status=&minPrice=&maxPrice=&sort=
const getProducts = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { search, category, collection, status, minPrice, maxPrice, sort, inStock } = req.query;

  const filter = {};
  if (search) filter.$text = { $search: search };
  if (category) filter.category = category;
  if (collection) filter.collections = collection;
  if (status) filter.status = status;
  if (inStock === 'true') filter.stock = { $gt: 0 };
  if (inStock === 'false') filter.stock = { $lte: 0 };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let sortBy = { createdAt: -1 };
  if (sort) {
    const dir = sort.startsWith('-') ? -1 : 1;
    const field = sort.replace('-', '');
    sortBy = { [field]: dir };
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .populate('collections', 'name slug')
      .sort(sortBy)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: 'Products fetched successfully',
    data: products,
    meta: buildMeta(total, page, limit),
  });
});

// POST /api/products  (multipart/form-data, field name: images)
const createProduct = catchAsync(async (req, res) => {
  const { name, sku, description, price, compareAtPrice, costPrice, category, collections, stock, lowStockThreshold, tags, status } = req.body;

  if (!name || !sku || price === undefined) {
    throw new ApiError(400, 'name, sku and price are required');
  }

  const images = await uploadMany(req.files, 'pos_app/products');

  const product = await Product.create({
    name,
    sku,
    description,
    price,
    compareAtPrice: compareAtPrice || null,
    costPrice: costPrice || 0,
    category: category || null,
    collections: collections ? (Array.isArray(collections) ? collections : collections.split(',')) : [],
    stock: stock || 0,
    lowStockThreshold: lowStockThreshold || 5,
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : [],
    status: status || 'active',
    images,
  });

  // Keep an inventory record in sync with every new product.
  await Inventory.create({
    product: product._id,
    sku: product.sku,
    quantity: product.stock,
    lowStockThreshold: product.lowStockThreshold,
  });

  sendResponse(res, 201, product, 'Product created successfully');
});

// PUT /api/products/:id  (multipart/form-data, optional new images + removeImageIds[])
const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, 'Product not found');
   console.log('req.body:', req.body  );
  const updatable = [
    'name', 'description', 'price', 'compareAtPrice', 'costPrice',
    'category', 'stock', 'lowStockThreshold', 'status', 'isActive', 'sku',
  ];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });
 
  if (req.body.tags !== undefined) {
    product.tags = Array.isArray(req.body.tags)
      ? req.body.tags
      : req.body.tags.split(',').map((t) => t.trim());
  }
  if (req.body.collections !== undefined) {
    product.collections = Array.isArray(req.body.collections)
      ? req.body.collections
      : req.body.collections.split(',');
  }

  // Remove specific existing images (and delete their Cloudinary assets).
  let removeImageIds = req.body.removeImageIds;
  if (removeImageIds) {
    removeImageIds = Array.isArray(removeImageIds) ? removeImageIds : [removeImageIds];
    const toRemove = product.images.filter((img) => removeImageIds.includes(img.publicId));
    await cloudinaryService.deleteMany(toRemove.map((img) => img.publicId));
    product.images = product.images.filter((img) => !removeImageIds.includes(img.publicId));
  }

  // Upload and append any newly attached images.
  if (req.files && req.files.length) {
    const uploaded = await cloudinaryService.uploadMany(req.files, 'pos_app/products');
    product.images.push(...uploaded);
  }

  await product.save();

  // Keep inventory quantity/threshold in sync if changed directly on the product.
  if (req.body.stock !== undefined || req.body.lowStockThreshold !== undefined) {
    await Inventory.findOneAndUpdate(
      { product: product._id },
      {
        ...(req.body.stock !== undefined ? { quantity: product.stock } : {}),
        ...(req.body.lowStockThreshold !== undefined ? { lowStockThreshold: product.lowStockThreshold } : {}),
        lastSyncedAt: new Date(),
      },
      { upsert: true }
    );
  }

   res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
});

const deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Cloudinary se images delete karein
  if (product.images && product.images.length > 0) {
    for (const imgObj of product.images) {
      // images array mein objects hain { url, publicId }
      // Hum direct publicId use karenge jo database mein save hai
      const pId = imgObj.publicId; 
      
      if (pId) {
        try {
          await deleteAsset(pId); 
        } catch (err) {
          console.error(`Failed to delete asset from Cloudinary: ${pId}`, err);
          // Optional: product delete hone dein agar image delete fail ho jaye
        }
      }
    }
  }

  // Product delete karne se pehle associated inventory delete karna behtar hai
  // Agar aapne Inventory model import kiya hua hai:
  // await Inventory.deleteMany({ product: product._id });

  await product.deleteOne();

  res.status(200).json({ 
    success: true, 
    message: 'Product deleted successfully' 
  });
});

// POST /api/products/:id/duplicate
const duplicateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const original = await Product.findById(id);
  if (!original) throw new ApiError(404, 'Product not found');

  // Duplicate the Cloudinary assets themselves so the clone doesn't
  // share publicIds with the original (deleting one would otherwise
  // break the other).
  const duplicatedImages = await uploadBuffer(original.images, 'pos_app/products');

  const clone = await Product.create({
    name: `${original.name} (Copy)`,
    sku: `${original.sku}-COPY-${Date.now().toString(36).toUpperCase()}`,
    description: original.description,
    price: original.price,
    compareAtPrice: original.compareAtPrice,
    costPrice: original.costPrice,
    category: original.category,
    collections: original.collections,
    images: duplicatedImages,
    stock: 0,
    lowStockThreshold: original.lowStockThreshold,
    tags: original.tags,
    status: 'draft',
  });

  await Inventory.create({
    product: clone._id,
    sku: clone.sku,
    quantity: 0,
    lowStockThreshold: clone.lowStockThreshold,
  });

  res.status(201).json({ success: true, message: 'Product duplicated successfully', data: clone });
});

module.exports = { getProducts, createProduct, updateProduct, deleteProduct, duplicateProduct };
