import nodemailer from 'nodemailer';
import { dbConnect } from './_db.js';
import Student from '../models/studentmodel.js';
import crypto from 'crypto';

export default async function handler(req, res) {
  await dbConnect();
  const { method, body } = req;
  if (method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { email } = body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  const existingStudent = await Student.findOne({ Email: email });
  if (existingStudent) return res.status(400).json({ message: 'This email is already registered' });
  // Generate token
  const token = crypto.randomBytes(32).toString('hex');
  // Save token and email in DB (create unverified student)
  const student = new Student({ Email: email, Status: 'Inactive', verificationToken: token });
  await student.save();
  // Send email with verification link
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    tls: { rejectUnauthorized: false }
  });
  const verifyUrl = `${process.env.FRONTEND_URL || 'https://your-domain.com'}/api/verify-email?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email - Paragon Coaching Center',
    html: `<p>Click the link below to verify your email:</p><a href="${verifyUrl}">${verifyUrl}</a>`
  };
  await transporter.sendMail(mailOptions);
  return res.status(200).json({ message: 'Verification email sent', email });
}
