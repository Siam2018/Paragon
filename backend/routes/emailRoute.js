import express from 'express';
import { sendVerificationEmail, verifyEmailCode, sendPasswordResetEmail, resetPassword } from '../Controllers/EmailController.js';

const router = express.Router();

// Route to send verification email
router.post('/send-verification-email', sendVerificationEmail);

// Route to verify email code
router.post('/verify-email-code', verifyEmailCode);

// Route to send password reset email
router.post('/send-password-reset-email', sendPasswordResetEmail);

// Route to reset password with code
router.post('/reset-password', resetPassword);

export default router;
