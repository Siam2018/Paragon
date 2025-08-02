import { Gallery } from '../models/gallerymodel.js';
import path from 'path';
import fs from 'fs';

// Get all gallery images
export const getAllGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find({ isActive: true })
      .sort({ order: 1, uploadDate: -1 });
    
    return res.status(200).json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images',
      error: error.message
    });
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
    
    return res.status(200).json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    console.error('Error fetching random gallery images:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch random gallery images',
      error: error.message
    });
  }
};

// Add new gallery image
export const addGalleryImage = async (req, res) => {
  try {
    const { isActive } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    const galleryImage = new Gallery({
      title: `Gallery Image ${Date.now()}`, // Auto-generated title
      description: '',
      imageURL: req.file.filename,
      tags: [],
      isActive: isActive === 'true' || isActive === true
    });

    const savedImage = await galleryImage.save();

    return res.status(201).json({
      success: true,
      message: 'Gallery image uploaded successfully',
      data: savedImage
    });
  } catch (error) {
    console.error('Error adding gallery image:', error);
    
    // Delete uploaded file if database save fails
    if (req.file && req.file.filename) {
      const filePath = path.join('uploads', 'gallery', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to upload gallery image',
      error: error.message
    });
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

    // If a new image file is uploaded
    if (req.file) {
      // Find the existing image to delete the old file
      const existingImage = await Gallery.findById(id);
      if (existingImage && existingImage.imageURL) {
        const oldFilePath = path.join('uploads', 'gallery', existingImage.imageURL);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updateData.imageURL = req.file.filename;
    }

    const updatedImage = await Gallery.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedImage) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Gallery image updated successfully',
      data: updatedImage
    });
  } catch (error) {
    console.error('Error updating gallery image:', error);
    
    // Delete uploaded file if update fails
    if (req.file && req.file.filename) {
      const filePath = path.join('uploads', 'gallery', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to update gallery image',
      error: error.message
    });
  }
};

// Delete gallery image
export const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Gallery.findById(id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
    }

    // Delete the image file from storage
    if (image.imageURL) {
      const filePath = path.join('uploads', 'gallery', image.imageURL);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Gallery.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Gallery image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete gallery image',
      error: error.message
    });
  }
};

// Get single gallery image
export const getGalleryImageById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const image = await Gallery.findById(id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: image
    });
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery image',
      error: error.message
    });
  }
};
