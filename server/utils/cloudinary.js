require('dotenv').config();

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage Setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'NoBrokerBuddy',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { fetch_format: 'auto', quality: 'auto' },
    ],
  },
});

const upload = multer({ storage });

// Export both upload and cloudinary
module.exports = {
  upload,
  cloudinary,
};
