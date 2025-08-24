import { dbConnect } from './_db.js';
import Publication from '../models/publicationmodel.js';
import { verifyAdmin } from '../Middlewares/Auth.js';

export default async function handler(req, res) {
  await dbConnect();
  const { method, query, body, url } = req;
  let { id } = query;
  let pathId = null;
  const match = url.match(/\/api\/publication\/?([^/?#]+)/);
  if (match && match[1] && match[1] !== 'publication') {
    pathId = match[1];
  }
  const publicationId = pathId || id;

  if (method === 'GET') {
    try {
      if (publicationId) {
        const publication = await Publication.findById(publicationId);
        if (!publication) return res.status(404).json({ message: 'Publication not found' });
        return res.status(200).json(publication);
      } else {
        const publications = await Publication.find({});
        return res.status(200).json(publications);
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  if (method === 'POST') {
    try {
      await verifyAdmin(req, res);
      const publication = new Publication(body);
      await publication.save();
      return res.status(201).json(publication);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  if (method === 'PUT') {
    try {
      await verifyAdmin(req, res);
      if (!publicationId) return res.status(400).json({ message: 'ID required' });
      const updated = await Publication.findByIdAndUpdate(publicationId, body, { new: true });
      if (!updated) return res.status(404).json({ message: 'Publication not found' });
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  if (method === 'DELETE') {
    try {
      await verifyAdmin(req, res);
      if (!publicationId) return res.status(400).json({ message: 'ID required' });
      const deleted = await Publication.findByIdAndDelete(publicationId);
      if (!deleted) return res.status(404).json({ message: 'Publication not found' });
      return res.status(200).json({ message: 'Publication deleted' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
