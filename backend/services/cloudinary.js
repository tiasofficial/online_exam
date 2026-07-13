const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary using environment variables
// Make sure CLOUDINARY_URL or these 3 variables are set on Render
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a file buffer to Cloudinary and returns the public download URL.
 * @param {Buffer} fileBuffer - The memory buffer of the file.
 * @param {string} originalName - The original filename.
 * @returns {Promise<string>} - The public URL to the uploaded file.
 */
async function uploadFile(fileBuffer, originalName) {
  return new Promise((resolve, reject) => {
    // Generate a secure, URL-safe random string for the public_id
    const randomSuffix = Math.round(Math.random() * 1e9);
    // Remove original extension as Cloudinary adds it back or uses its own
    const safeName = originalName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_");
    const publicId = `${safeName}-${Date.now()}-${randomSuffix}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'online-exam-portal',
        public_id: publicId,
        resource_type: 'auto' // automatically detect image/video/raw
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          // Return the secure URL provided by Cloudinary
          resolve(result.secure_url);
        }
      }
    );

    // Stream the buffer to Cloudinary
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
}

module.exports = {
  uploadFile
};
