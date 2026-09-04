const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// ==========================================
// CLOUDINARY CONFIG
// ==========================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==========================================
// UPLOAD BUFFER
// ==========================================
const uploadBuffer = (file, folder) => {
  return new Promise((resolve, reject) => {
    if (!file?.buffer) {
      return reject(new Error("Invalid file buffer"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(file.buffer);
  });
};

// ==========================================
// UPLOAD MANY
// ==========================================
const uploadMany = async (
  files = [],
  folder = "pos_app/products"
) => {
  if (!files || files.length === 0) {
    return [];
  }

  return Promise.all(
    files.map((file) =>
      uploadBuffer(file, folder)
    )
  );
};
const deleteAsset = async (publicId) => {
  if (!publicId || typeof publicId !== 'string') {
    console.log("Skipping Cloudinary delete: public_id is not a valid string");
    return; 
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    // Error throw karne ki bajaye log karein taake product delete ho jaye
  }
};


// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  uploadBuffer,
  uploadMany,
  deleteAsset,
};