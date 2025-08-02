import express from 'express';
import dynamicUpload from '../Middlewares/FileUpload.js';
import {
  getAllGalleryImages,
  getRandomGalleryImages,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  getGalleryImageById
} from '../Controllers/GalleryController.js';

const router = express.Router();

// Routes
// GET /api/gallery - Get all gallery images
router.get('/', getAllGalleryImages);

// GET /api/gallery/random - Get random gallery images for display
router.get('/random', getRandomGalleryImages);

// GET /api/gallery/:id - Get single gallery image
router.get('/:id', getGalleryImageById);

// POST /api/gallery - Add new gallery image (Admin only)
router.post('/', dynamicUpload('gallery'), addGalleryImage);

// PUT /api/gallery/:id - Update gallery image (Admin only)
router.put('/:id', dynamicUpload('gallery'), updateGalleryImage);

// DELETE /api/gallery/:id - Delete gallery image (Admin only)
router.delete('/:id', deleteGalleryImage);

export default router;
