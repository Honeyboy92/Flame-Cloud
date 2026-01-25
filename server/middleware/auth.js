const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'flame-cloud-secret-key-2024';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  console.log(`[AdminCheck] URL: ${req.method} ${req.originalUrl}, UserID: ${req.user?.id}, IsAdmin: ${req.user?.isAdmin}`);
  if (!req.user?.isAdmin) {
    console.log(`[AdminCheck] Denied for ${req.user?.id}`);
    return res.status(403).json({ error: `Admin access required (Route: ${req.method} ${req.originalUrl})` });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, JWT_SECRET };
