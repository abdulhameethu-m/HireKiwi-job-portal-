import { Router } from 'express';
import {
  submitApplication,
  getMyApplications,
  getApplicationById,
  getAdminApplications,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { authenticateUser, requireAuth, requireAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/', authenticateUser, upload.single('resume'), submitApplication);
router.get('/mine', authenticateUser, requireAuth, getMyApplications);
router.get('/admin', authenticateUser, requireAdmin, getAdminApplications);
router.patch('/admin/:id/status', authenticateUser, requireAdmin, updateApplicationStatus);
router.patch('/:id/status', authenticateUser, requireAdmin, updateApplicationStatus);
router.get('/:id', authenticateUser, getApplicationById);

export default router;
