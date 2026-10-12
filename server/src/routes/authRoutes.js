import { Router } from 'express';
import { register, login, logout, getMe, forgotPassword } from '../controllers/authController.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/logout', logout);
router.get('/me', authenticateUser, getMe);
router.post('/forgot-password', authRateLimiter, forgotPassword);

export default router;
