import jwt from 'jsonwebtoken';

export async function verifyAdmin(req, res) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    throw new Error('No token provided');
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Optionally, check for admin role here if you have roles
    req.user = decoded;
    return true;
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
    throw new Error('Invalid or expired token');
  }
}
