import { Gallery } from '../models/gallerymodel.js';
import path from 'path';
import fs from 'fs';

// Helper function to delete file
const deleteFile = (filename) => {
  try {
    const filePath = path.join('uploads', 'gallery', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

// Get all gallery images
export const getAllGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: images.length, data: images });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch gallery images', error: error.message });
  }
};

// Get random gallery images for display
export const getRandomGalleryImages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const images = await Gallery.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: limit } }
    ]);
    res.status(200).json({ success: true, count: images.length, data: images });
  } catch (error) {
    console.error('Error fetching random gallery images:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch random gallery images', error: error.message });
  }
};

// Add new gallery image
export const addGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const { isActive } = req.body;
    const galleryImage = new Gallery({
      imageURL: req.file.filename,
      isActive: isActive === 'true' || isActive === true
    });

    const savedImage = await galleryImage.save();
    res.status(201).json({ success: true, message: 'Gallery image uploaded successfully', data: savedImage });
  } catch (error) {
    console.error('Error adding gallery image:', error);
    if (req.file?.filename) deleteFile(req.file.filename);
    res.status(500).json({ success: false, message: 'Failed to upload gallery image', error: error.message });
  }
};

// Update gallery image
export const updateGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const updateData = {};
    
    if (isActive !== undefined) {
      updateData.isActive = isActive === 'true' || isActive === true;
    }

    if (req.file) {
      const existingImage = await Gallery.findById(id);
      if (existingImage?.imageURL) deleteFile(existingImage.imageURL);
      updateData.imageURL = req.file.filename;
    }

    const updatedImage = await Gallery.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedImage) {
      return res.status(404).json({ success: false, message: 'Gallery image not found' });
    }

    res.status(200).json({ success: true, message: 'Gallery image updated successfully', data: updatedImage });
  } catch (error) {
    console.error('Error updating gallery image:', error);
    if (req.file?.filename) deleteFile(req.file.filename);
    res.status(500).json({ success: false, message: 'Failed to update gallery image', error: error.message });
  }
};

// Delete gallery image
export const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Gallery.findById(id);
    
    if (!image) {
      return res.status(404).json({ success: false, message: 'Gallery image not found' });
    }

    if (image.imageURL) deleteFile(image.imageURL);
    await Gallery.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Gallery image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ success: false, message: 'Failed to delete gallery image', error: error.message });
  }
};

// Get single gallery image
export const getGalleryImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Gallery.findById(id);
    
    if (!image) {
      return res.status(404).json({ success: false, message: 'Gallery image not found' });
    }

    res.status(200).json({ success: true, data: image });
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch gallery image', error: error.message });
  }
};
