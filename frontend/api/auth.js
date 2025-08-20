// Serverless API route for authentication
import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { dbConnect } from './_db.js';
import AdminModel from '../models/adminmodel.js';

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
  if (req.method === 'POST' && req.url.endsWith('/Admin/Register')) {
    // Register
    const { error } = adminRegisterValidation(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const { FullName, Email, Password } = req.body;
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
  } else if (req.method === 'POST' && req.url.endsWith('/Admin/Signin')) {
    // Signin
    const { error } = adminSigninValidation(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const { Email, Password } = req.body;
    try {
      const admin = await AdminModel.findOne({ Email });
      const isPasswordValid = admin ? await bcrypt.compare(Password, admin.Password) : false;
      if (!admin || !isPasswordValid) return res.status(401).json({ message: 'Invalid email or password.' });
      const token = jwt.sign({ id: admin._id, Email: admin.Email }, process.env.JWT_SECRET, { expiresIn: '12h' });
      return res.status(200).json({ token, admin: { FullName: admin.FullName, Email: admin.Email } });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    res.status(404).json({ message: 'Not found' });
  }
}
