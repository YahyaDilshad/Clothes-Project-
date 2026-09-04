const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/ApiResponse');
const { getPagination, buildMeta } = require('../utils/paginate');
const Category = require('../models/Category');
const Product = require('../models/Product');
const {
   uploadBuffer,
  deleteAsset
} = require('../config/cloudinary.js');
// GET /api/categories?page=&limit=&search=
const getCategories = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { search, isActive } = req.query;

  const filter = {};
  if (search) filter.name = { $regex: search, $options: 'i' };
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const [categories, total] = await Promise.all([
    Category.find(filter).populate('parent', 'name slug').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Category.countDocuments(filter),
  ]);
  // console.log('Fetched categories:', categories.length, 'Total:', total);
  sendResponse(res, 200, categories , 'Categories fetched', buildMeta({ page, limit, total }));
});

const createCategory = catchAsync(async (req, res) => {
  const { name, description, parent } = req.body;

  if (!name) {
    throw new ApiError(400, "name is required");
  }
  let image = {
    url: null,
    publicId: null,
  };

  if (req.file) {
    image = await uploadBuffer(req.file, 'pos_app/categories');

    // console.log("CLOUDINARY RESULT:", image);
  }

  const category = await Category.create({
    name,
    description,
    parent: parent || null,
    image,
  });

  sendResponse(
    res,
    201,
    category,
    "Category created successfully"
  );
});// PUT /api/categories/:id
const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, 'Category not found');

  ['name', 'description', 'parent', 'isActive'].forEach((field) => {
    if (req.body[field] !== undefined) category[field] = req.body[field];
  });

  if (req.file) {
    const oldPublicId = category.image?.publicId;
    const uploaded = await uploadBuffer(req.file);
    category.image = uploaded;
    if (oldPublicId) await deleteAsset(oldPublicId);
  }

  await category.save();
  sendResponse(res, 200, category, 'Category updated successfully');
});

// DELETE /api/categories/:id
const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, 'Category not found');

  const inUse = await Product.countDocuments({ category: id });
  if (inUse > 0) {
    throw new ApiError(409, `Cannot delete: ${inUse} product(s) are still assigned to this category`);
  }

  if (category.image?.publicId) await deleteAsset(category.image.publicId);
  await category.deleteOne();

  sendResponse(res, 200, null, 'Category deleted successfully');
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
