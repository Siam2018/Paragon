import dbConnect from '../_db.js';
import Course from '../models/coursemodel';
import { verifyAdmin } from '../Middlewares/Auth';

export default async function handler(req, res) {
  await dbConnect();
  const {
    query: { id = [] },
    method,
  } = req;
  const courseId = Array.isArray(id) ? id[0] : id;

  if (!courseId) {
    switch (method) {
      case 'GET':
        try {
          const courses = await Course.find({});
          res.status(200).json(courses);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      case 'POST':
        try {
          await verifyAdmin(req, res);
          const course = new Course(req.body);
          await course.save();
          res.status(201).json(course);
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
          const course = await Course.findById(courseId);
          if (!course) return res.status(404).json({ message: 'Course not found' });
          res.status(200).json(course);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      case 'PUT':
        try {
          await verifyAdmin(req, res);
          const updated = await Course.findByIdAndUpdate(courseId, req.body, { new: true });
          if (!updated) return res.status(404).json({ message: 'Course not found' });
          res.status(200).json(updated);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      case 'DELETE':
        try {
          await verifyAdmin(req, res);
          const deleted = await Course.findByIdAndDelete(courseId);
          if (!deleted) return res.status(404).json({ message: 'Course not found' });
          res.status(200).json({ message: 'Course deleted' });
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
