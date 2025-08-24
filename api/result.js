import { dbConnect } from './_db.js';
import Result from '../models/resultmodel.js';
import { verifyAdmin } from '../Middlewares/Auth.js';

export default async function handler(req, res) {
  await dbConnect();
  const { method, query, body } = req;
  const { id } = query;

  if (method === 'GET') {
    try {
      if (id) {
        const result = await Result.findById(id);
        if (!result) return res.status(404).json({ message: 'Result not found' });
        return res.status(200).json(result);
      } else {
        const results = await Result.find({});
        return res.status(200).json(results);
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  if (method === 'POST') {
    try {
      await verifyAdmin(req, res);
      const result = new Result(body);
      await result.save();
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  if (method === 'PUT') {
    try {
      await verifyAdmin(req, res);
      if (!id) return res.status(400).json({ message: 'ID required' });
      const updated = await Result.findByIdAndUpdate(id, body, { new: true });
      if (!updated) return res.status(404).json({ message: 'Result not found' });
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  if (method === 'DELETE') {
    try {
      await verifyAdmin(req, res);
      if (!id) return res.status(400).json({ message: 'ID required' });
      const deleted = await Result.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: 'Result not found' });
      return res.status(200).json({ message: 'Result deleted' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
