import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/requireRole.js';
import { Role } from '@prisma/client';
import { analyticsController } from './analytics.controller.js';

const router = Router();
const allowedRoles = [Role.ADMIN, Role.COORDINATOR, Role.HOSPITAL_STAFF];

/**
 * @openapi
 * /analytics/donors/summary:
 *   get:
 *     summary: Get overall donor summary count
 *     description: Returns the raw count of all registered donor profiles.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Donor summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalDonors:
 *                       type: integer
 *                       example: 20
 */
router.get(
  '/donors/summary',
  requireAuth,
  requireRole(...allowedRoles),
  analyticsController.getDonorSummary.bind(analyticsController)
);

/**
 * @openapi
 * /analytics/donors/blood-groups:
 *   get:
 *     summary: Get blood group distribution
 *     description: Returns aggregate counts and percentages for all blood groups.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Distribution data retrieved successfully
 */
router.get(
  '/donors/blood-groups',
  requireAuth,
  requireRole(...allowedRoles),
  analyticsController.getBloodGroupDistribution.bind(analyticsController)
);

/**
 * @openapi
 * /analytics/donors/eligibility:
 *   get:
 *     summary: Get donor eligibility counts
 *     description: Returns counts and percentages for eligible vs deferred donors.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Eligibility analytics retrieved successfully
 */
router.get(
  '/donors/eligibility',
  requireAuth,
  requireRole(...allowedRoles),
  analyticsController.getEligibilitySummary.bind(analyticsController)
);

/**
 * @openapi
 * /analytics/donors/geography:
 *   get:
 *     summary: Get geographic distribution of donors
 *     description: Groups and counts donor profiles by city, district, and state.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Regional analytics retrieved successfully
 */
router.get(
  '/donors/geography',
  requireAuth,
  requireRole(...allowedRoles),
  analyticsController.getGeographicDistribution.bind(analyticsController)
);

/**
 * @openapi
 * /analytics/donors/retention:
 *   get:
 *     summary: Get donor retention ratios
 *     description: Returns repeat donation performance metrics and retention rate.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retention analytics retrieved successfully
 */
router.get(
  '/donors/retention',
  requireAuth,
  requireRole(...allowedRoles),
  analyticsController.getRetentionStats.bind(analyticsController)
);

/**
 * @openapi
 * /analytics/donors/monthly:
 *   get:
 *     summary: Get monthly donation trends
 *     description: Returns a 12-month timeline of total donations and unique active donors.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Donation trend metrics retrieved successfully
 */
router.get(
  '/donors/monthly',
  requireAuth,
  requireRole(...allowedRoles),
  analyticsController.getMonthlyDonationTrends.bind(analyticsController)
);

/**
 * @openapi
 * /analytics/demand/summary:
 *   get:
 *     summary: Get overall blood demand summary
 *     description: Returns request aggregate counts categorized by states (active, fulfilled, cancelled).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Demand summary retrieved successfully
 */
router.get(
  '/demand/summary',
  requireAuth,
  requireRole(...allowedRoles),
  analyticsController.getDemandSummary.bind(analyticsController)
);

/**
 * @openapi
 * /analytics/demand/blood-groups:
 *   get:
 *     summary: Get blood group request demand distribution
 *     description: Returns aggregate counts and percentages of blood requests by blood groups.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blood group demand distribution retrieved successfully
 */
router.get(
  '/demand/blood-groups',
  requireAuth,
  requireRole(...allowedRoles),
  analyticsController.getBloodGroupDemand.bind(analyticsController)
);

/**
 * @openapi
 * /analytics/overview:
 *   get:
 *     summary: Get executive dashboard overview
 *     description: Aggregates both donor count summary and blood demand summary indicators in a single call.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Executive overview summary retrieved successfully
 */
router.get(
  '/overview',
  requireAuth,
  requireRole(...allowedRoles),
  analyticsController.getExecutiveOverview.bind(analyticsController)
);

export default router;
