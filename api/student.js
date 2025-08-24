import { dbConnect } from './_db.js';
import Student from '../models/studentmodel.js';
import { verifyAdmin } from '../Middlewares/Auth.js';

export default async function handler(req, res) {
  await dbConnect();
  const { method, query, body, url } = req;
  let { id } = query;
  let pathId = null;
  const match = url.match(/\/api\/student\/?([^/?#]+)/);
  if (match && match[1] && match[1] !== 'student') {
    pathId = match[1];
  }
  const studentId = pathId || id;

  if (method === 'GET') {
    try {
      if (studentId) {
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        return res.status(200).json(student);
      } else {
        const students = await Student.find({});
        return res.status(200).json(students);
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  if (method === 'POST') {
    try {
      await verifyAdmin(req, res);
      const student = new Student(body);
      await student.save();
      return res.status(201).json(student);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  if (method === 'PUT') {
    try {
      await verifyAdmin(req, res);
      if (!studentId) return res.status(400).json({ message: 'ID required' });
      const updated = await Student.findByIdAndUpdate(studentId, body, { new: true });
      if (!updated) return res.status(404).json({ message: 'Student not found' });
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  if (method === 'DELETE') {
    try {
      await verifyAdmin(req, res);
      if (!studentId) return res.status(400).json({ message: 'ID required' });
      const deleted = await Student.findByIdAndDelete(studentId);
      if (!deleted) return res.status(404).json({ message: 'Student not found' });
      return res.status(200).json({ message: 'Student deleted' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
