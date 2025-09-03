import mainHandler from '../email.js';

export default function catchAllEmailHandler(req, res) {
  // Patch the URL so the main handler recognizes the action
  req.url = `/api/email/${req.query.action ? req.query.action.join('/') : ''}`;
  return mainHandler(req, res);
}
