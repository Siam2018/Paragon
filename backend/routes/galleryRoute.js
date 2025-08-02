import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getAllGalleryImages,
  getRandomGalleryImages,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  getGalleryImageById
} from '../Controllers/GalleryController.js';

const router = express.Router();

// Create gallery uploads directory if it doesn't exist
const galleryDir = path.join('uploads', 'gallery');
if (!fs.existsSync(galleryDir)) {
  fs.mkdirSync(galleryDir, { recursive: true });
}

// Configure multer for gallery image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, galleryDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'gallery-' + uniqueSuffix + extension);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Routes
// GET /api/gallery - Get all gallery images
router.get('/', getAllGalleryImages);

// GET /api/gallery/random - Get random gallery images for display
router.get('/random', getRandomGalleryImages);

// GET /api/gallery/:id - Get single gallery image
router.get('/:id', getGalleryImageById);

// POST /api/gallery - Add new gallery image (Admin only)
router.post('/', upload.single('image'), addGalleryImage);

// PUT /api/gallery/:id - Update gallery image (Admin only)
router.put('/:id', upload.single('image'), updateGalleryImage);

// DELETE /api/gallery/:id - Delete gallery image (Admin only)
router.delete('/:id', deleteGalleryImage);

export default router;
