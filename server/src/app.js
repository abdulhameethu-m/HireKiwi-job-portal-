import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { dbStore } from './models/Store.js';
import { getAdminApplications, updateApplicationStatus } from './controllers/applicationController.js';
import { authenticateUser, requireAdmin } from './middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');

export const createApp = async () => {
  await dbStore.init();

  const app = express();

  // Security Headers
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  }));

  // CORS
  const allowedOrigins = [
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'http://127.0.0.1:5000',
    'http://localhost:5000'
  ];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during local QA testing
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));

  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static uploads directory
  app.use('/uploads', express.static(UPLOAD_DIR));

  // Health Check
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'UP',
      service: 'CareerNest QA Lab API',
      timestamp: new Date().toISOString()
    });
  });

  // Reseed Endpoint for Deterministic Automated Tests
  app.post('/api/seed', async (req, res, next) => {
    try {
      await dbStore.resetToSeed();
      res.status(200).json({
        message: 'Database reseeded successfully with deterministic test records.',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      next(err);
    }
  });

  // Admin Direct Applications Endpoints
  app.get('/api/admin/applications', authenticateUser, requireAdmin, getAdminApplications);
  app.patch('/api/admin/applications/:id/status', authenticateUser, requireAdmin, updateApplicationStatus);

  // Mount API modules
  app.use('/api/auth', authRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/applications', applicationRoutes);
  app.use('/api/profile', profileRoutes);

  // 404 for unknown API routes
  app.use('/api', (req, res) => {
    res.status(404).json({
      error: {
        code: 'ENDPOINT_NOT_FOUND',
        message: `API endpoint ${req.originalUrl} does not exist.`
      }
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};
