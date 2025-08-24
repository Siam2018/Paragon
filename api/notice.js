import { dbConnect } from './_db.js';
import Notice from '../models/noticemodel.js';
import { verifyAdmin } from '../Middlewares/Auth.js';

export default async function handler(req, res) {
  await dbConnect();
  const { method, query, body, url } = req;
  let { id } = query;
  let pathId = null;
  const match = url.match(/\/api\/notice\/?([^/?#]+)/);
  if (match && match[1] && match[1] !== 'notice') {
    pathId = match[1];
  }
  const noticeId = pathId || id;

  if (method === 'GET') {
    try {
      if (noticeId) {
        const notice = await Notice.findById(noticeId);
        if (!notice) return res.status(404).json({ message: 'Notice not found' });
        return res.status(200).json(notice);
      } else {
        const notices = await Notice.find({});
        return res.status(200).json(notices);
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  if (method === 'POST') {
    try {
      await verifyAdmin(req, res);
      const notice = new Notice(body);
      await notice.save();
      return res.status(201).json(notice);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  if (method === 'PUT') {
    try {
      await verifyAdmin(req, res);
      if (!noticeId) return res.status(400).json({ message: 'ID required' });
      const updated = await Notice.findByIdAndUpdate(noticeId, body, { new: true });
      if (!updated) return res.status(404).json({ message: 'Notice not found' });
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  if (method === 'DELETE') {
    try {
      await verifyAdmin(req, res);
      if (!noticeId) return res.status(400).json({ message: 'ID required' });
      const deleted = await Notice.findByIdAndDelete(noticeId);
      if (!deleted) return res.status(404).json({ message: 'Notice not found' });
      return res.status(200).json({ message: 'Notice deleted' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
