const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

const DEFAULT_FOLDER = 'pos_app';

/**
 * Uploads a single file buffer (from multer memoryStorage) to Cloudinary.
 * Returns { url, publicId }.
 */
const uploadBuffer = (buffer, folder = DEFAULT_FOLDER) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

/**
 * Uploads multiple multer files (in parallel) to Cloudinary.
 */
const uploadMany = async (files = [], folder = DEFAULT_FOLDER) => {
  if (!files.length) return [];
  return Promise.all(files.map((file) => uploadBuffer(file.buffer, folder)));
};

/**
 * Deletes a single Cloudinary asset by its publicId. Safe to call
 * with an undefined/null publicId (no-op).
 */
const deleteAsset = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    // Log but don't block the request on Cloudinary cleanup failures.
    console.error(`Cloudinary delete failed for ${publicId}:`, err.message);
  }
};

/**
 * Deletes many Cloudinary assets in parallel.
 */
const deleteMany = async (publicIds = []) => {
  await Promise.all(publicIds.filter(Boolean).map(deleteAsset));
};

/**
 * Duplicates an existing remote image (by URL) into a brand new
 * Cloudinary asset with its own publicId. Used for /products/:id/duplicate
 * so the clone doesn't share a publicId with the original (which would
 * break the clone if the original is later deleted).
 */
const duplicateFromUrl = async (url, folder = DEFAULT_FOLDER) => {
  const result = await cloudinary.uploader.upload(url, {
    folder,
    resource_type: 'image',
  });
  return { url: result.secure_url, publicId: result.public_id };
};

const duplicateMany = async (images = [], folder = DEFAULT_FOLDER) =>
  Promise.all(images.map((img) => duplicateFromUrl(img.url, folder)));

module.exports = {
  uploadBuffer,
  uploadMany,
  deleteAsset,
  deleteMany,
  duplicateFromUrl,
  duplicateMany,
};
