const cloudinary = require('cloudinary').v2;
require('dotenv').config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
async function testCloudinaryDelete() {
    const fileUrl = 'https://res.cloudinary.com/njcdw0gp/image/upload/v1721997232/online-exam-portal/screenshot_2024-07-26_203649_1721997230043.png';
    const parts = fileUrl.split('/');
    const folderIndex = parts.indexOf('online-exam-portal');
    const fileWithExtension = parts.slice(folderIndex).join('/');
    const lastDot = fileWithExtension.lastIndexOf('.');
    const publicId = lastDot !== -1 ? fileWithExtension.substring(0, lastDot) : fileWithExtension;
    console.log("Trying to delete public ID:", publicId);
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Delete result:", result);
    } catch (err) {
        console.error("Delete error:", err);
    }
}
testCloudinaryDelete();
