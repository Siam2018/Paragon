import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create storage for different folders
const createCloudinaryStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `paragon/${folder}`, // e.g., "paragon/results", "paragon/courses"
      allowed_formats: ['jpeg', 'jpg', 'png', 'gif'],
      transformation: [
        { width: 800, height: 600, crop: 'limit' }, // Optimize images
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    },
  });
};

// Create upload middleware for different types
export const cloudinaryUpload = (subfolder) => {
  const storage = createCloudinaryStorage(subfolder);
  const upload = multer({ 
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    }
  });

  // Map subfolder to field name
  const fieldName = subfolder === 'gallery' ? 'image' : 
                   subfolder === 'notices' ? 'PDF' : 'Image';
  
  return upload.single(fieldName);
};

export default cloudinaryUpload;
