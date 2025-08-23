import { dbConnect } from '../_db.js';
import Gallery from '../../models/gallerymodel.js';
import { verifyAdmin } from '../../Middlewares/Auth.js';

export default async function handler(req, res) {
  await dbConnect();
  const {
    query: { id = [], limit },
    method,
  } = req;
  const galleryId = Array.isArray(id) ? id[0] : id;

  // Handle /api/gallery/random?limit=6
  if (galleryId === 'random' && method === 'GET') {
    try {
      const lim = parseInt(limit) || 6;
      const randomGalleries = await Gallery.aggregate([{ $sample: { size: lim } }]);
      return res.status(200).json(randomGalleries);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  if (!galleryId) {
    switch (method) {
      case 'GET':
        try {
          const galleries = await Gallery.find({});
          res.status(200).json(galleries);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      case 'POST':
        try {
          await verifyAdmin(req, res);
          const gallery = new Gallery(req.body);
          await gallery.save();
          res.status(201).json(gallery);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } else {
    switch (method) {
      case 'GET':
        try {
          const gallery = await Gallery.findById(galleryId);
          if (!gallery) return res.status(404).json({ message: 'Gallery not found' });
          res.status(200).json(gallery);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      case 'PUT':
        try {
          await verifyAdmin(req, res);
          const updated = await Gallery.findByIdAndUpdate(galleryId, req.body, { new: true });
          if (!updated) return res.status(404).json({ message: 'Gallery not found' });
          res.status(200).json(updated);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      case 'DELETE':
        try {
          await verifyAdmin(req, res);
          const deleted = await Gallery.findByIdAndDelete(galleryId);
          if (!deleted) return res.status(404).json({ message: 'Gallery not found' });
          res.status(200).json({ message: 'Gallery deleted' });
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}
