import { dbConnect } from './_db.js';
import Course from '../models/coursemodel.js';
import { verifyAdmin } from '../Middlewares/Auth.js';

export default async function handler(req, res) {
  await dbConnect();
  const { method, query, body } = req;
  const { id } = query;

  if (method === 'GET') {
    try {
      if (id) {
        const course = await Course.findById(id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        return res.status(200).json(course);
      } else {
        const courses = await Course.find({});
        return res.status(200).json(courses);
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  if (method === 'POST') {
    try {
      await verifyAdmin(req, res);
      const course = new Course(body);
      await course.save();
      return res.status(201).json(course);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  if (method === 'PUT') {
    try {
      await verifyAdmin(req, res);
      if (!id) return res.status(400).json({ message: 'ID required' });
      const updated = await Course.findByIdAndUpdate(id, body, { new: true });
      if (!updated) return res.status(404).json({ message: 'Course not found' });
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  if (method === 'DELETE') {
    try {
      await verifyAdmin(req, res);
      if (!id) return res.status(400).json({ message: 'ID required' });
      const deleted = await Course.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: 'Course not found' });
      return res.status(200).json({ message: 'Course deleted' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
