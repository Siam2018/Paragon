import { dbConnect } from './_db.js';
import Student from '../models/studentmodel.js';

export default async function handler(req, res) {
  await dbConnect();
  const { method, query } = req;
  if (method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  const { token } = query;
  if (!token) return res.status(400).json({ message: 'Token is required' });
  const student = await Student.findOne({ verificationToken: token });
  if (!student) return res.status(404).json({ message: 'Invalid or expired token' });
  student.Status = 'Active';
  student.verificationToken = undefined;
  await student.save();
  return res.status(200).json({ message: 'Email verified successfully' });
}
