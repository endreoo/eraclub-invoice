import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Please authenticate' });
  }

  // Just pass through the token to the API
  console.log('Token present, passing through to API');
  next();
}; 