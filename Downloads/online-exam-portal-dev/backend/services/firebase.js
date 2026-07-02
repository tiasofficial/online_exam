const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const { v4: uuidv4 } = require('uuid');
const serviceAccount = require('../firebase-service-account.json');

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "online-exam-portal-9bb2a.firebasestorage.app"
});

const bucket = getStorage(app).bucket();

/**
 * Uploads a file buffer to Firebase Storage and returns the public download URL.
 * 
 * @param {Buffer} fileBuffer - The memory buffer of the file.
 * @param {string} originalName - The original filename.
 * @param {string} mimetype - The file MIME type (e.g., 'image/png').
 * @returns {Promise<string>} - The public URL of the uploaded file.
 */
const uploadFile = async (fileBuffer, originalName, mimetype) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) return resolve(null);
    
    // Create a unique filename to prevent overwrites
    const ext = originalName.split('.').pop();
    const uniqueFilename = `uploads/${uuidv4()}-${Date.now()}.${ext}`;
    
    const file = bucket.file(uniqueFilename);
    const stream = file.createWriteStream({
      metadata: {
        contentType: mimetype
      }
    });

    stream.on('error', (error) => {
      console.error('Firebase Storage Upload Error:', error);
      reject(error);
    });

    stream.on('finish', async () => {
      // Make the file publicly accessible
      await file.makePublic();
      
      // Construct the public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFilename}`;
      resolve(publicUrl);
    });

    stream.end(fileBuffer);
  });
};

module.exports = {
  uploadFile
};
