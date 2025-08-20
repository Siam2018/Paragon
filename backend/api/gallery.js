// Serverless API route for gallery
import { dbConnect } from './_db.js';
import { Gallery } from '../../frontend/models/gallerymodel.js';

export default async function handler(req, res) {
  await dbConnect();
  // GET /gallery - all images
  if (req.method === 'GET' && req.url.endsWith('/gallery')) {
    try {
      const images = await Gallery.find({ isActive: true }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: images.length, data: images });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch gallery images', error: error.message });
    }
  }
  // GET /gallery/random
  else if (req.method === 'GET' && req.url.includes('/gallery/random')) {
    try {
      const limit = parseInt(req.query?.limit) || 6;
      const images = await Gallery.aggregate([
        { $match: { isActive: true } },
        { $sample: { size: limit } }
      ]);
      return res.status(200).json({ success: true, count: images.length, data: images });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch random gallery images', error: error.message });
    }
  }
  // GET /gallery/:id
  else if (req.method === 'GET' && /\/gallery\/.+/.test(req.url)) {
    const id = req.url.split('/gallery/')[1];
    try {
      const image = await Gallery.findById(id);
      if (!image) return res.status(404).json({ success: false, message: 'Gallery image not found' });
      return res.status(200).json({ success: true, data: image });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch gallery image', error: error.message });
    }
  }
  // POST /gallery (add new image)
  else if (req.method === 'POST' && req.url.endsWith('/gallery')) {
    // File upload not supported in serverless; expect imageURL in body
    const { imageURL, isActive } = req.body;
    if (!imageURL) return res.status(400).json({ success: false, message: 'Please provide an image URL' });
    try {
      const galleryImage = new Gallery({
        imageURL,
        isActive: isActive === 'true' || isActive === true
      });
      const savedImage = await galleryImage.save();
      return res.status(201).json({ success: true, message: 'Gallery image uploaded successfully', data: savedImage });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to upload gallery image', error: error.message });
    }
  }
  // PUT /gallery/:id (update image)
  else if (req.method === 'PUT' && /\/gallery\/.+/.test(req.url)) {
    const id = req.url.split('/gallery/')[1];
    const { imageURL, isActive } = req.body;
    const updateData = {};
    if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;
    if (imageURL) updateData.imageURL = imageURL;
    try {
      const updatedImage = await Gallery.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      if (!updatedImage) return res.status(404).json({ success: false, message: 'Gallery image not found' });
      return res.status(200).json({ success: true, message: 'Gallery image updated successfully', data: updatedImage });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to update gallery image', error: error.message });
    }
  }
  // DELETE /gallery/:id
  else if (req.method === 'DELETE' && /\/gallery\/.+/.test(req.url)) {
    const id = req.url.split('/gallery/')[1];
    try {
      const image = await Gallery.findById(id);
      if (!image) return res.status(404).json({ success: false, message: 'Gallery image not found' });
      await Gallery.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Gallery image deleted successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to delete gallery image', error: error.message });
    }
  }
  else {
    res.status(404).json({ message: 'Not found' });
  }
}
