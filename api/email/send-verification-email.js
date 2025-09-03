import handler from '../email.js';

export default function sendVerificationEmail(req, res) {
  // Patch the URL so the main handler recognizes the action
  req.url = '/api/email/send-verification-email';
  return handler(req, res);
}
