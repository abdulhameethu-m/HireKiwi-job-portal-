import { Router } from 'express';
import { getJobs, getJobById, createJob, updateJob, deleteJob } from '../controllers/jobController.js';
import { authenticateUser, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateUser, getJobs);
router.get('/:id', getJobById);
router.post('/', authenticateUser, requireAdmin, createJob);
router.patch('/:id', authenticateUser, requireAdmin, updateJob);
router.delete('/:id', authenticateUser, requireAdmin, deleteJob);

export default router;
