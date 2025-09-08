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
  try {
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
    // Point to frontend page, not API endpoint
    const verifyUrl = `${process.env.FRONTEND_URL || 'https://your-domain.com'}/email-verified?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email - Paragon Coaching Center',
      html: `<h2>Welcome to Paragon Coaching Center!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
        <p><a href="${verifyUrl}" style="color:#0088ce;font-weight:bold;">Verify Email</a></p>
        <p>If you did not request this, please ignore this email.</p>`
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Verification email sent', email });
  } catch (err) {
    console.error('Error sending verification email:', err);
    return res.status(500).json({ message: 'Failed to send verification email' });
  }
}
