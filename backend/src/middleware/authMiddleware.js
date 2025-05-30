import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get token from "Bearer TOKEN" format

  if (token == null) {
    return res.sendStatus(401); // If no token, return unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.sendStatus(403); // If token is invalid, return forbidden
    }
    // Attach user info (from token payload) to request object
    req.user = user; // user here should contain { userId: ..., username: ... }
    next(); // Pass the request to the next middleware/route handler
  });
}; 