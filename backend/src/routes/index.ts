import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import donorRoutes from '../modules/donors/donor.routes.js';
import requestRoutes from '../modules/requests/request.routes.js';
import healthRoutes from '../modules/health/health.routes.js';
import analyticsRoutes from '../modules/analytics/analytics.routes.js';

const router = Router();

// Versioned routes
router.use('/auth', authRoutes);
router.use('/donors', donorRoutes);
router.use('/requests', requestRoutes);
router.use('/health', healthRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
