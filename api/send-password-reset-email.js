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
  const student = await Student.findOne({ Email: email });
  if (!student) return res.status(404).json({ message: 'No account found with this email address' });
  // Generate token
  const token = crypto.randomBytes(32).toString('hex');
  student.passwordResetToken = token;
  await student.save();
  // Send email with reset link
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    tls: { rejectUnauthorized: false }
  });
  const resetUrl = `${process.env.FRONTEND_URL || 'https://your-domain.com'}/reset-password?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset your password - Paragon Coaching Center',
    html: `<p>Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`
  };
  await transporter.sendMail(mailOptions);
  return res.status(200).json({ message: 'Password reset email sent', email });
}
