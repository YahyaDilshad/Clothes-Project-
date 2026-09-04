const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/ApiResponse');
const { getPagination, buildMeta } = require('../utils/paginate');
const Collection = require('../models/Collection');
const { uploadBuffer, deleteAsset } = require('../config/cloudinary.js'); // deleteAsset bhi import karein

// GET /api/collections
const getCollections = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { search, isActive } = req.query;

  const filter = {};
  if (search) filter.name = { $regex: search, $options: 'i' };
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const [collections, total] = await Promise.all([
    Collection.find(filter)
      .populate('products', 'name price images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Collection.countDocuments(filter),
  ]);

  sendResponse(res, 200, collections, 'Collections fetched', buildMeta({ page, limit, total }));
});

// POST /api/collections/add
const createCollection = catchAsync(async (req, res) => {
  const { name, description, products } = req.body;
  if (!name) throw new ApiError(400, 'name is required');

  let image = { url: null, publicId: null };
  if (req.file) {
    image = await uploadBuffer(req.file);
  }

  const collection = await Collection.create({
    name,
    description,
    products: products ? (Array.isArray(products) ? products : products.split(',')) : [],
    image,
  });

  sendResponse(res, 201, collection, 'Collection created successfully');
});

// PUT /api/collections/update/:id
const updateCollection = catchAsync(async (req, res) => {
  let collection = await Collection.findById(req.params.id);
  if (!collection) throw new ApiError(404, 'Collection not found');

  const { name, description, products, isActive } = req.body;

  // Agar nayi image upload hui hai
  if (req.file) {
    // Purani image Cloudinary se delete karein (Optional but recommended)
    if (collection.image && collection.image.publicId) {
      await deleteAsset(collection.image.publicId).catch(err => console.log("Cloudinary Delete Error:", err));
    }
    // Nayi image upload karein
    const newImage = await uploadBuffer(req.file);
    collection.image = newImage;
  }

  // Fields update karein
  if (name) collection.name = name;
  if (description) collection.description = description;
  if (isActive !== undefined) collection.isActive = isActive === 'true' || isActive === true;
  
  if (products) {
    collection.products = Array.isArray(products) ? products : products.split(',');
  }

  await collection.save();

  sendResponse(res, 200, collection, 'Collection updated successfully');
});

// DELETE /api/collections/delete/:id
const deleteCollection = catchAsync(async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  if (!collection) throw new ApiError(404, 'Collection not found');

  // Cloudinary se image delete karein
  if (collection.image && collection.image.publicId) {
    await deleteAsset(collection.image.publicId).catch(err => console.log("Cloudinary Delete Error:", err));
  }

  await collection.deleteOne();

  sendResponse(res, 200, null, 'Collection deleted successfully');
});

module.exports = { 
  getCollections, 
  createCollection, 
  updateCollection, 
  deleteCollection 
};   