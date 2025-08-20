// Serverless API route for notices
import { dbConnect } from './_db.js';
import { Notice } from '../models/noticemodel.js';
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
  // POST /Notice (create)
  if (req.method === 'POST' && req.url.endsWith('/Notice')) {
    if (requireAuth(req, res)) return;
    const { Title, Description, PDFURL } = req.body;
    if (!Title || !Description) return res.status(400).json({ message: 'Title and Description are required.' });
    try {
      const notice = await Notice.create({ Title, Description, PDFURL: PDFURL || '' });
      return res.status(201).json(notice);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // GET /Notice (all)
  else if (req.method === 'GET' && req.url.endsWith('/Notice')) {
    try {
      const notices = await Notice.find();
      return res.status(200).json(notices);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // GET /Notice/:id
  else if (req.method === 'GET' && /\/Notice\/.+/.test(req.url)) {
    if (requireAuth(req, res)) return;
    const id = req.url.split('/Notice/')[1];
    try {
      const notice = await Notice.findById(id);
      if (!notice) return res.status(404).json({ message: 'Notice not found.' });
      return res.status(200).json(notice);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // PUT /Notice/:id
  else if (req.method === 'PUT' && /\/Notice\/.+/.test(req.url)) {
    if (requireAuth(req, res)) return;
    const id = req.url.split('/Notice/')[1];
    const { Title, Description, PDFURL } = req.body;
    if (!Title || !Description) return res.status(400).json({ message: 'Title and Description are required.' });
    try {
      const updateData = { Title, Description };
      if (PDFURL) updateData.PDFURL = PDFURL;
      const updatedNotice = await Notice.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedNotice) return res.status(404).json({ message: 'Notice not found.' });
      return res.status(200).json(updatedNotice);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // DELETE /Notice/:id
  else if (req.method === 'DELETE' && /\/Notice\/.+/.test(req.url)) {
    if (requireAuth(req, res)) return;
    const id = req.url.split('/Notice/')[1];
    try {
      const deletedNotice = await Notice.findByIdAndDelete(id);
      if (!deletedNotice) return res.status(404).json({ message: 'Notice not found.' });
      return res.status(200).json({ message: 'Notice deleted successfully.', notice: deletedNotice });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  else {
    res.status(404).json({ message: 'Not found' });
  }
}
