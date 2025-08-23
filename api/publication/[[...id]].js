import dbConnect from '../_db.js';
import Publication from '../models/publicationmodel';
import { verifyAdmin } from '../Middlewares/Auth';

export default async function handler(req, res) {
  await dbConnect();
  const {
    query: { id = [] },
    method,
  } = req;
  const publicationId = Array.isArray(id) ? id[0] : id;

  if (!publicationId) {
    switch (method) {
      case 'GET':
        try {
          const publications = await Publication.find({});
          res.status(200).json(publications);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      case 'POST':
        try {
          await verifyAdmin(req, res);
          const publication = new Publication(req.body);
          await publication.save();
          res.status(201).json(publication);
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
          const publication = await Publication.findById(publicationId);
          if (!publication) return res.status(404).json({ message: 'Publication not found' });
          res.status(200).json(publication);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      case 'PUT':
        try {
          await verifyAdmin(req, res);
          const updated = await Publication.findByIdAndUpdate(publicationId, req.body, { new: true });
          if (!updated) return res.status(404).json({ message: 'Publication not found' });
          res.status(200).json(updated);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      case 'DELETE':
        try {
          await verifyAdmin(req, res);
          const deleted = await Publication.findByIdAndDelete(publicationId);
          if (!deleted) return res.status(404).json({ message: 'Publication not found' });
          res.status(200).json({ message: 'Publication deleted' });
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
