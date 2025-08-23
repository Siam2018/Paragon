import dbConnect from '../_db.js';
import Notice from '../../models/noticemodel.js';
import { verifyAdmin } from '../Middlewares/Auth';

export default async function handler(req, res) {
  await dbConnect();
  const {
    query: { id = [] },
    method,
  } = req;

  // id can be undefined, an array, or a string
  const noticeId = Array.isArray(id) ? id[0] : id;

  if (!noticeId) {
    // /api/notice
    switch (method) {
      case 'GET':
        try {
          const notices = await Notice.find({});
          res.status(200).json(notices);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      case 'POST':
        try {
          await verifyAdmin(req, res);
          const notice = new Notice(req.body);
          await notice.save();
          res.status(201).json(notice);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } else {
    // /api/notice/:id
    switch (method) {
      case 'GET':
        try {
          const notice = await Notice.findById(noticeId);
          if (!notice) return res.status(404).json({ message: 'Notice not found' });
          res.status(200).json(notice);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      case 'PUT':
        try {
          await verifyAdmin(req, res);
          const updated = await Notice.findByIdAndUpdate(noticeId, req.body, { new: true });
          if (!updated) return res.status(404).json({ message: 'Notice not found' });
          res.status(200).json(updated);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      case 'DELETE':
        try {
          await verifyAdmin(req, res);
          const deleted = await Notice.findByIdAndDelete(noticeId);
          if (!deleted) return res.status(404).json({ message: 'Notice not found' });
          res.status(200).json({ message: 'Notice deleted' });
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
