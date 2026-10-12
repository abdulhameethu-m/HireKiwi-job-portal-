import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { authenticateUser, requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateUser, requireAuth, getProfile);
router.patch('/', authenticateUser, requireAuth, updateProfile);

export default router;
