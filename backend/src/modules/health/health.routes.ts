import { Router } from 'express';
import { healthController } from './health.controller.js';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Liveness check
 *     description: Returns 200 OK if the API server is running.
 *     responses:
 *       200:
 *         description: Server is live
 */
router.get('/', healthController.getLiveness.bind(healthController));

/**
 * @openapi
 * /health/ready:
 *   get:
 *     summary: Readiness check
 *     description: Returns 200 if database and cache layers are connected, 503 otherwise.
 *     responses:
 *       200:
 *         description: Server is ready
 *       503:
 *         description: Infrastructure services disconnected
 */
router.get('/ready', healthController.getReadiness.bind(healthController));

export default router;
