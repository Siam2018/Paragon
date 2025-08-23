import { dbConnect } from '../_db.js';
import Student from '../../models/studentmodel.js';
import { verifyAdmin } from '../../Middlewares/Auth.js';

export default async function handler(req, res) {
  await dbConnect();
  const {
    query: { id = [] },
    method,
  } = req;
  const studentId = Array.isArray(id) ? id[0] : id;

  if (!studentId) {
    switch (method) {
      case 'GET':
        try {
          const students = await Student.find({});
          res.status(200).json(students);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      case 'POST':
        try {
          await verifyAdmin(req, res);
          const student = new Student(req.body);
          await student.save();
          res.status(201).json(student);
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
          const student = await Student.findById(studentId);
          if (!student) return res.status(404).json({ message: 'Student not found' });
          res.status(200).json(student);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      case 'PUT':
        try {
          await verifyAdmin(req, res);
          const updated = await Student.findByIdAndUpdate(studentId, req.body, { new: true });
          if (!updated) return res.status(404).json({ message: 'Student not found' });
          res.status(200).json(updated);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      case 'DELETE':
        try {
          await verifyAdmin(req, res);
          const deleted = await Student.findByIdAndDelete(studentId);
          if (!deleted) return res.status(404).json({ message: 'Student not found' });
          res.status(200).json({ message: 'Student deleted' });
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
