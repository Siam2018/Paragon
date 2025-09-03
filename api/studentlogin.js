// Debug: Log env variables to Vercel logs
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('mongoDBURL:', process.env.mongoDBURL);
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { dbConnect } from './_db.js';
import Student from '../models/studentmodel.js';

export default async function handler(req, res) {
  await dbConnect();
  const { method, body } = req;

  if (method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { Email, Password } = body;
  if (!Email || !Password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const student = await Student.findOne({ Email });
    if (!student) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const isPasswordValid = student.Password
      ? await bcrypt.compare(Password, student.Password)
      : false;
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = jwt.sign({ id: student._id, Email: student.Email, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '12h' });
    return res.status(200).json({ token, student: { FullName: student.EnglishName, Email: student.Email, id: student._id } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
