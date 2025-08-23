import dbConnect from '../_db.js';
import Result from '../../models/resultmodel.js';
import { verifyAdmin } from '../Middlewares/Auth';

export default async function handler(req, res) {
  await dbConnect();
  const {
    query: { id = [] },
    method,
  } = req;
  const resultId = Array.isArray(id) ? id[0] : id;

  if (!resultId) {
    switch (method) {
      case 'GET':
        try {
          const results = await Result.find({});
          res.status(200).json(results);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      case 'POST':
        try {
          await verifyAdmin(req, res);
          const result = new Result(req.body);
          await result.save();
          res.status(201).json(result);
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
          const result = await Result.findById(resultId);
          if (!result) return res.status(404).json({ message: 'Result not found' });
          res.status(200).json(result);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      case 'PUT':
        try {
          await verifyAdmin(req, res);
          const updated = await Result.findByIdAndUpdate(resultId, req.body, { new: true });
          if (!updated) return res.status(404).json({ message: 'Result not found' });
          res.status(200).json(updated);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      case 'DELETE':
        try {
          await verifyAdmin(req, res);
          const deleted = await Result.findByIdAndDelete(resultId);
          if (!deleted) return res.status(404).json({ message: 'Result not found' });
          res.status(200).json({ message: 'Result deleted' });
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
