import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Student } from '../../frontend/models/studentmodel.js';

// In-memory storage for verification codes (in production, use Redis or database)
const verificationCodes = new Map();
const passwordResetCodes = new Map();

// Email validation function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Create transporter (configure with your SMTP settings)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com', // more explicit than just 'gmail'
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS  // your app password
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send verification email
export const sendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Check if email already exists
    const existingStudent = await Student.findOne({ Email: email });
    if (existingStudent) {
      return res.status(400).json({ message: 'This email is already registered' });
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store code with expiration (5 minutes)
    verificationCodes.set(email, {
      code: verificationCode,
      expires: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Paragon Coaching Center - Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0088ce; margin-bottom: 10px;">Paragon Coaching Center</h1>
            <h2 style="color: #333; margin-bottom: 20px;">Email Verification</h2>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="font-size: 16px; color: #333; margin-bottom: 15px;">
              Thank you for registering with Paragon Coaching Center! To complete your registration, please verify your email address.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #0088ce; color: white; font-size: 32px; font-weight: bold; padding: 15px 30px; border-radius: 8px; display: inline-block; letter-spacing: 5px;">
                ${verificationCode}
              </div>
            </div>
            
            <p style="font-size: 14px; color: #666; text-align: center; margin-bottom: 10px;">
              Enter this code in the verification field on our website
            </p>
            <p style="font-size: 12px; color: #999; text-align: center;">
              This code will expire in 5 minutes for security reasons
            </p>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
            <p style="font-size: 12px; color: #999; margin: 0;">
              If you didn't request this verification, please ignore this email.
            </p>
            <p style="font-size: 12px; color: #999; margin: 5px 0 0 0;">
              © 2025 Paragon Coaching Center. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      message: 'Verification email sent successfully',
      email: email
    });

  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ message: 'Failed to send verification email' });
  }
};

// Verify email code
export const verifyEmailCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    const storedData = verificationCodes.get(email);

    if (!storedData) {
      return res.status(400).json({ message: 'No verification code found for this email' });
    }

    if (Date.now() > storedData.expires) {
      verificationCodes.delete(email);
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    if (storedData.code !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Code is valid, remove it from storage
    verificationCodes.delete(email);

    res.status(200).json({ 
      message: 'Email verified successfully',
      verified: true 
    });

  } catch (error) {
    console.error('Error verifying email code:', error);
    res.status(500).json({ 
      message: 'Failed to verify email code',
      error: error.message 
    });
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Check if student exists
    const student = await Student.findOne({ Email: email });
    if (!student) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store reset code with expiration (10 minutes)
    passwordResetCodes.set(email, {
      code: resetCode,
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Paragon Coaching Center - Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0088ce; margin-bottom: 10px;">Paragon Coaching Center</h1>
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="font-size: 16px; color: #333; margin-bottom: 15px;">
              We received a request to reset your password. Use the code below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #dc3545; color: white; font-size: 32px; font-weight: bold; padding: 15px 30px; border-radius: 8px; display: inline-block; letter-spacing: 5px;">
                ${resetCode}
              </div>
            </div>
            
            <p style="font-size: 14px; color: #666; text-align: center; margin-bottom: 10px;">
              Enter this code on the password reset page
            </p>
            <p style="font-size: 12px; color: #999; text-align: center;">
              This code will expire in 10 minutes for security reasons
            </p>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
            <p style="font-size: 12px; color: #999; margin: 0;">
              If you didn't request this password reset, please ignore this email.
            </p>
            <p style="font-size: 12px; color: #999; margin: 5px 0 0 0;">
              © 2025 Paragon Coaching Center. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      message: 'Password reset email sent successfully',
      email: email
    });

  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ message: 'Failed to send password reset email' });
  }
};

// Reset password with code
export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Email, code, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const storedData = passwordResetCodes.get(email);

    if (!storedData) {
      return res.status(400).json({ message: 'No password reset code found for this email' });
    }

    if (Date.now() > storedData.expires) {
      passwordResetCodes.delete(email);
      return res.status(400).json({ message: 'Password reset code has expired' });
    }

    if (storedData.code !== code) {
      return res.status(400).json({ message: 'Invalid password reset code' });
    }

    // Find the student
    const student = await Student.findOne({ Email: email });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the password
    await Student.findByIdAndUpdate(student._id, { Password: hashedPassword });

    // Remove the reset code
    passwordResetCodes.delete(email);

    res.status(200).json({ 
      message: 'Password reset successfully',
      success: true 
    });

  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ 
      message: 'Failed to reset password',
      error: error.message 
    });
  }
};

// Clean up expired codes (run periodically)
setInterval(() => {
  const now = Date.now();
  
  // Clean verification codes
  for (const [email, data] of verificationCodes.entries()) {
    if (now > data.expires) {
      verificationCodes.delete(email);
    }
  }
  
  // Clean password reset codes
  for (const [email, data] of passwordResetCodes.entries()) {
    if (now > data.expires) {
      passwordResetCodes.delete(email);
    }
  }
}, 60000); // Clean up every minute
