import { dbConnect } from './_db.js';
import Gallery from '../models/gallerymodel.js';
import { verifyAdmin } from '../Middlewares/Auth.js';

export default async function handler(req, res) {
  await dbConnect();
  const { method, query, body, url } = req;
  let { id, limit } = query;

  // Support /api/gallery/123 and /api/gallery?id=123
  let pathId = null;
  const match = url.match(/\/api\/gallery\/?([^/?#]+)/);
  if (match && match[1] && match[1] !== 'gallery') {
    pathId = match[1];
  }
  const galleryId = pathId || id;

  // /api/gallery/random?limit=6
  if ((galleryId === 'random' || galleryId === undefined) && method === 'GET' && query.limit) {
    try {
      const lim = parseInt(limit) || 6;
      const randomGalleries = await Gallery.aggregate([{ $sample: { size: lim } }]);
      return res.status(200).json({ success: true, data: randomGalleries });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  if (!galleryId || galleryId === 'random') {
    switch (method) {
      case 'GET':
        try {
          const galleries = await Gallery.find({});
          return res.status(200).json({ success: true, data: galleries });
        } catch (error) {
          return res.status(400).json({ message: error.message });
        }
      case 'POST':
        try {
          await verifyAdmin(req, res);
          const gallery = new Gallery(body);
          await gallery.save();
          return res.status(201).json(gallery);
        } catch (error) {
          return res.status(400).json({ message: error.message });
        }
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } else {
    switch (method) {
      case 'GET':
        try {
          const gallery = await Gallery.findById(galleryId);
          if (!gallery) return res.status(404).json({ message: 'Gallery not found' });
          return res.status(200).json(gallery);
        } catch (error) {
          return res.status(400).json({ message: error.message });
        }
      case 'PUT':
        try {
          await verifyAdmin(req, res);
          const updated = await Gallery.findByIdAndUpdate(galleryId, body, { new: true });
          if (!updated) return res.status(404).json({ message: 'Gallery not found' });
          return res.status(200).json(updated);
        } catch (error) {
          return res.status(400).json({ message: error.message });
        }
      case 'DELETE':
        try {
          await verifyAdmin(req, res);
          const deleted = await Gallery.findByIdAndDelete(galleryId);
          if (!deleted) return res.status(404).json({ message: 'Gallery not found' });
          return res.status(200).json({ message: 'Gallery deleted' });
        } catch (error) {
          return res.status(400).json({ message: error.message });
        }
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}
