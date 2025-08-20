// Serverless API route for results
import { dbConnect } from './_db.js';
import { Result } from '../models/resultmodel.js';
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
  // POST /Result (create)
  if (req.method === 'POST' && req.url.endsWith('/Result')) {
    if (requireAuth(req, res)) return;
    const { Title, Description, ImageURL } = req.body;
    if (!ImageURL) return res.status(400).json({ message: 'Image URL is required.' });
    try {
      const result = await Result.create({ Title: Title || '', Description: Description || '', ImageURL });
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // GET /Result (all)
  else if (req.method === 'GET' && req.url.endsWith('/Result')) {
    try {
      const results = await Result.find();
      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // GET /Result/:id
  else if (req.method === 'GET' && /\/Result\/.+/.test(req.url)) {
    if (requireAuth(req, res)) return;
    const id = req.url.split('/Result/')[1];
    try {
      const result = await Result.findById(id);
      if (!result) return res.status(404).json({ message: 'Result not found.' });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // PUT /Result/:id
  else if (req.method === 'PUT' && /\/Result\/.+/.test(req.url)) {
    if (requireAuth(req, res)) return;
    const id = req.url.split('/Result/')[1];
    const { Title, Description, ImageURL } = req.body;
    try {
      let update = { Title: Title || '', Description: Description || '' };
      if (ImageURL) update.ImageURL = ImageURL;
      const updatedResult = await Result.findByIdAndUpdate(id, update, { new: true });
      if (!updatedResult) return res.status(404).json({ message: 'Result not found.' });
      return res.status(200).json(updatedResult);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // DELETE /Result/:id
  else if (req.method === 'DELETE' && /\/Result\/.+/.test(req.url)) {
    if (requireAuth(req, res)) return;
    const id = req.url.split('/Result/')[1];
    try {
      const deletedResult = await Result.findByIdAndDelete(id);
      if (!deletedResult) return res.status(404).json({ message: 'Result not found.' });
      return res.status(200).json({ message: 'Result deleted successfully.', result: deletedResult });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  else {
    res.status(404).json({ message: 'Not found' });
  }
}
