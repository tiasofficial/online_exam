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

/**
 * Deletes a file from Cloudinary given its secure URL.
 * @param {string} fileUrl - The Cloudinary secure URL.
 */
async function deleteFile(fileUrl) {
  try {
    if (!fileUrl || typeof fileUrl !== 'string' || !fileUrl.includes('res.cloudinary.com')) return;
    
    const parts = fileUrl.split('/');
    const folderIndex = parts.indexOf('online-exam-portal');
    if (folderIndex === -1) return;
    
    const fileWithExtension = parts.slice(folderIndex).join('/');
    const lastDot = fileWithExtension.lastIndexOf('.');
    const publicId = lastDot !== -1 ? fileWithExtension.substring(0, lastDot) : fileWithExtension;
    
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete error:", err);
  }
}

module.exports = {
  uploadFile,
  deleteFile
};
