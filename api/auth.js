import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { dbConnect } from './_db.js';
import AdminModel from '../models/adminmodel.js';
import Student from '../models/studentmodel.js';
import Student from '../models/studentmodel.js';

const adminRegisterValidation = (body) => {
  const schema = Joi.object({
    FullName: Joi.string().min(3).max(30).required(),
    Email: Joi.string().email().required(),
    Password: Joi.string().min(8).required(),
  });
  return schema.validate(body);
};

const adminSigninValidation = (body) => {
  const schema = Joi.object({
    Email: Joi.string().email().required(),
    Password: Joi.string().min(8).required(),
  });
  return schema.validate(body);
};

export default async function handler(req, res) {
  await dbConnect();
  const { method, query, body, url } = req;
  let { id } = query;
  let action = id;
  // Support /api/auth/Admin/Register and /api/auth?id=Admin/Register
  const match = url.match(/\/api\/auth\/?([^/?#]+)/);
  if (match && match[1] && match[1] !== 'auth') {
    action = match[1];
  }

  if (method === 'POST' && (action === 'Admin/Register' || url.endsWith('/Admin/Register'))) {
    // Register
    const { error } = adminRegisterValidation(body);
    if (error) return res.status(400).json({ message: error.message });
    const { FullName, Email, Password } = body;
    try {
      const existingAdmin = await AdminModel.findOne({ Email });
      if (existingAdmin) return res.status(409).json({ message: 'Admin already exists.' });
      const hashedPassword = await bcrypt.hash(Password, 10);
      const newAdmin = new AdminModel({ FullName, Email, Password: hashedPassword });
      await newAdmin.save();
      const { Password: _, ...adminData } = newAdmin.toObject();
      return res.status(201).json(adminData);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (method === 'POST' && (action === 'Admin/Signin' || url.endsWith('/Admin/Signin'))) {
    // Signin
    const { error } = adminSigninValidation(body);
    if (error) return res.status(400).json({ message: error.message });
    const { Email, Password } = body;
    try {
      const admin = await AdminModel.findOne({ Email });
      const isPasswordValid = admin ? await bcrypt.compare(Password, admin.Password) : false;
      if (!admin || !isPasswordValid) return res.status(401).json({ message: 'Invalid email or password.' });
      const token = jwt.sign({ id: admin._id, Email: admin.Email }, process.env.JWT_SECRET, { expiresIn: '12h' });
      return res.status(200).json({ token, admin: { FullName: admin.FullName, Email: admin.Email } });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else if (method === 'POST' && (action === 'login' || url.endsWith('/login'))) {
    // Unified login for admin or student
    const { Email, Password } = body;
    if (!Email || !Password) return res.status(400).json({ message: 'Email and password are required.' });
    try {
      // Try admin first
      const admin = await AdminModel.findOne({ Email });
      if (admin) {
        const isPasswordValid = await bcrypt.compare(Password, admin.Password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password.' });
        const token = jwt.sign({ id: admin._id, Email: admin.Email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' });
        return res.status(200).json({ token, user: { role: 'admin', FullName: admin.FullName, Email: admin.Email } });
      }
      // Try student
      const student = await Student.findOne({ Email });
      if (student) {
        // If you store hashed passwords for students, use bcrypt.compare. If plain text, use ===
        const isPasswordValid = student.Password
          ? await bcrypt.compare(Password, student.Password)
          : false;
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password.' });
        const token = jwt.sign({ id: student._id, Email: student.Email, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '12h' });
        return res.status(200).json({ token, user: { role: 'student', FullName: student.EnglishName, Email: student.Email } });
      }
      return res.status(401).json({ message: 'Invalid email or password.' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    res.status(404).json({ message: 'Not found' });
  }
}
