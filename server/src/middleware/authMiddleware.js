import { verifyToken } from '../utils/security.js';
import { dbStore } from '../models/Store.js';

export const authenticateUser = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/i, '');

  if (!token) {
    req.user = null;
    return next();
  }

  const payload = verifyToken(token);
  if (!payload) {
    req.user = null;
    return next();
  }

  const user = dbStore.findUserById(payload.id);
  if (!user) {
    req.user = null;
    return next();
  }

  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName
  };
  next();
};

export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required. Please sign in to access this resource.'
      }
    });
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required. Please sign in.'
      }
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'Access denied. Administrator privileges are required.'
      }
    });
  }
  next();
};
