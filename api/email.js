import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import { dbConnect } from './_db.js';
import Student from '../models/studentmodel.js';

// Catch-all route support for Vercel: handle /api/email/* and /api/email
export default async function handler(req, res) {
  // If this is a catch-all route, patch the url for internal routing
  if (Array.isArray(req.query?.action)) {
    req.url = `/api/email/${req.query.action.join('/')}`;
  }

  await dbConnect();
  const { method, query, body, url } = req;
  let { id } = query;
  let action = id;
  // Support /api/email/send-verification-email and /api/email?id=send-verification-email
  const match = url.match(/\/api\/email\/?([^/?#]+)/);
  if (match && match[1] && match[1] !== 'email') {
    action = match[1];
  }

  // ...existing code...
}
const verificationCodes = new Map();
const passwordResetCodes = new Map();

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const createTransporter = () => nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  tls: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (method === 'POST' && (action === 'send-verification-email' || url.endsWith('/send-verification-email'))) {
    const { email } = body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    if (!isValidEmail(email)) return res.status(400).json({ message: 'Please enter a valid email address' });
    const existingStudent = await Student.findOne({ Email: email });
    if (existingStudent) return res.status(400).json({ message: 'This email is already registered' });
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes.set(email, { code: verificationCode, expires: Date.now() + 5 * 60 * 1000 });
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Paragon Coaching Center - Email Verification',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"><div style="text-align: center; margin-bottom: 30px;"><h1 style="color: #0088ce; margin-bottom: 10px;">Paragon Coaching Center</h1><h2 style="color: #333; margin-bottom: 20px;">Email Verification</h2></div><div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;"><p style="font-size: 16px; color: #333; margin-bottom: 15px;">Thank you for registering with Paragon Coaching Center! To complete your registration, please verify your email address.</p><div style="text-align: center; margin: 30px 0;"><div style="background-color: #0088ce; color: white; font-size: 32px; font-weight: bold; padding: 15px 30px; border-radius: 8px; display: inline-block; letter-spacing: 5px;">${verificationCode}</div></div><p style="font-size: 14px; color: #666; text-align: center; margin-bottom: 10px;">Enter this code in the verification field on our website</p><p style="font-size: 12px; color: #999; text-align: center;">This code will expire in 5 minutes for security reasons</p></div><div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;"><p style="font-size: 12px; color: #999; margin: 0;">If you didn't request this verification, please ignore this email.</p><p style="font-size: 12px; color: #999; margin: 5px 0 0 0;">© 2025 Paragon Coaching Center. All rights reserved.</p></div></div>`
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Verification email sent successfully', email });
  }
  else if (method === 'POST' && (action === 'verify-email-code' || url.endsWith('/verify-email-code'))) {
    const { email, code } = body;
    if (!email || !code) return res.status(400).json({ message: 'Email and code are required' });
    const storedData = verificationCodes.get(email);
    if (!storedData) return res.status(400).json({ message: 'No verification code found for this email' });
    if (Date.now() > storedData.expires) {
      verificationCodes.delete(email);
      return res.status(400).json({ message: 'Verification code has expired' });
    }
    if (storedData.code !== code) return res.status(400).json({ message: 'Invalid verification code' });
    verificationCodes.delete(email);
    return res.status(200).json({ message: 'Email verified successfully', verified: true });
  }
  else if (method === 'POST' && (action === 'send-password-reset-email' || url.endsWith('/send-password-reset-email'))) {
    const { email } = body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    if (!isValidEmail(email)) return res.status(400).json({ message: 'Please enter a valid email address' });
    const student = await Student.findOne({ Email: email });
    if (!student) return res.status(404).json({ message: 'No account found with this email address' });
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    passwordResetCodes.set(email, { code: resetCode, expires: Date.now() + 10 * 60 * 1000 });
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Paragon Coaching Center - Password Reset',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"><div style="text-align: center; margin-bottom: 30px;"><h1 style="color: #0088ce; margin-bottom: 10px;">Paragon Coaching Center</h1><h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2></div><div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;"><p style="font-size: 16px; color: #333; margin-bottom: 15px;">We received a request to reset your password. Use the code below to reset your password:</p><div style="text-align: center; margin: 30px 0;"><div style="background-color: #dc3545; color: white; font-size: 32px; font-weight: bold; padding: 15px 30px; border-radius: 8px; display: inline-block; letter-spacing: 5px;">${resetCode}</div></div><p style="font-size: 14px; color: #666; text-align: center; margin-bottom: 10px;">Enter this code on the password reset page</p><p style="font-size: 12px; color: #999; text-align: center;">This code will expire in 10 minutes for security reasons</p></div><div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;"><p style="font-size: 12px; color: #999; margin: 0;">If you didn't request this password reset, please ignore this email.</p><p style="font-size: 12px; color: #999; margin: 5px 0 0 0;">© 2025 Paragon Coaching Center. All rights reserved.</p></div></div>`
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Password reset email sent successfully', email });
  }
  else if (method === 'POST' && (action === 'reset-password' || url.endsWith('/reset-password'))) {
    const { email, code, newPassword } = body;
    if (!email || !code || !newPassword) return res.status(400).json({ message: 'Email, code, and new password are required' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    const storedData = passwordResetCodes.get(email);
    if (!storedData) return res.status(400).json({ message: 'No password reset code found for this email' });
    if (Date.now() > storedData.expires) {
      passwordResetCodes.delete(email);
      return res.status(400).json({ message: 'Password reset code has expired' });
    }
    if (storedData.code !== code) return res.status(400).json({ message: 'Invalid password reset code' });
    const student = await Student.findOne({ Email: email });
    if (!student) return res.status(404).json({ message: 'No account found with this email address' });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    student.Password = hashedPassword;
    await student.save();
    passwordResetCodes.delete(email);
    return res.status(200).json({ message: 'Password reset successfully' });
  }
  else {
    res.status(404).json({ message: 'Not found' });
  }

}