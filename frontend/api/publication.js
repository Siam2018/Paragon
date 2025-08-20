// Serverless API route for publications
import { dbConnect } from './_db.js';
import { Publication } from '../models/publicationmodel.js';
import jwt from 'jsonwebtoken';

function requireAuth(req, res) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Access denied. No token provided.' });
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Access denied. Invalid token format.' });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return null;
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
}

export default async function handler(req, res) {
  await dbConnect();
  // POST /Publication (create)
  if (req.method === 'POST' && req.url.endsWith('/Publication')) {
    if (requireAuth(req, res)) return;
    const { Title, Description, ImageURL } = req.body;
    if (!Title || !Description || !ImageURL) return res.status(400).json({ message: 'Send all required fields including image URL.' });
    try {
      const publication = await Publication.create({ Title, Description, ImageURL });
      return res.status(201).json(publication);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // GET /Publication (all)
  else if (req.method === 'GET' && req.url.endsWith('/Publication')) {
    try {
      const publications = await Publication.find();
      return res.status(200).json(publications);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // GET /Publication/:id
  else if (req.method === 'GET' && /\/Publication\/.+/.test(req.url)) {
    if (requireAuth(req, res)) return;
    const id = req.url.split('/Publication/')[1];
    try {
      const publication = await Publication.findById(id);
      if (!publication) return res.status(404).json({ message: 'Publication not found.' });
      return res.status(200).json(publication);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // PUT /Publication/:id
  else if (req.method === 'PUT' && /\/Publication\/.+/.test(req.url)) {
    if (requireAuth(req, res)) return;
    const id = req.url.split('/Publication/')[1];
    const { Title, Description, ImageURL } = req.body;
    if (!Title || !Description) return res.status(400).json({ message: 'Send all required fields.' });
    try {
      let update = { Title, Description };
      if (ImageURL) update.ImageURL = ImageURL;
      const updatedPublication = await Publication.findByIdAndUpdate(id, update, { new: true });
      if (!updatedPublication) return res.status(404).json({ message: 'Publication not found.' });
      return res.status(200).json({ message: 'Publication updated successfully.', publication: updatedPublication });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // DELETE /Publication/:id
  else if (req.method === 'DELETE' && /\/Publication\/.+/.test(req.url)) {
    if (requireAuth(req, res)) return;
    const id = req.url.split('/Publication/')[1];
    try {
      const deletedPublication = await Publication.findByIdAndDelete(id);
      if (!deletedPublication) return res.status(404).json({ message: 'Publication not found.' });
      return res.status(200).json({ message: 'Publication deleted successfully.', publication: deletedPublication });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  else {
    res.status(404).json({ message: 'Not found' });
  }
}
