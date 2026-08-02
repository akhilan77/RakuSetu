import { Router } from 'express';
import { authController } from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import { RequestOtpSchema, VerifyOtpSchema } from '../../validators/auth.validator.js';
import { redisRateLimiter } from '../../middleware/rateLimit.js';
import { authKeys } from './auth.keys.js';

const router = Router();

// Phone-level rate limiter: Max 3 OTP requests per phone number per hour
const phoneRateLimiter = redisRateLimiter(
  (req) => authKeys.PHONE_RATE(req.body.phone || 'unknown'),
  3,
  3600,
  'Too many OTP requests for this phone number. Please try again in an hour.'
);

// IP-level rate limiter: Max 10 OTP requests per IP per hour
const ipRateLimiter = redisRateLimiter(
  (req) => authKeys.IP_RATE(req.ip || req.socket.remoteAddress || 'unknown'),
  10,
  3600,
  'Too many OTP requests from this IP address. Please try again in an hour.'
);

/**
 * @openapi
 * /auth/request-otp:
 *   post:
 *     summary: Request login OTP
 *     description: Triggers an SMS verification dispatch.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+919999999999"
 *     responses:
 *       200:
 *         description: OTP dispatched
 */
router.post(
  '/request-otp',
  validate(RequestOtpSchema),
  phoneRateLimiter,
  ipRateLimiter,
  authController.requestOtp.bind(authController)
);

/**
 * @openapi
 * /auth/verify-otp:
 *   post:
 *     summary: Verify login OTP
 *     description: Confirms verification and returns a Bearer JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - otp
 *             properties:
 *               phone:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post(
  '/verify-otp',
  validate(VerifyOtpSchema),
  authController.verifyOtp.bind(authController)
);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh tokens
 *     description: Exchange an active refresh token for a new set.
 *     responses:
 *       200:
 *         description: Rotation successful
 */
router.post(
  '/refresh',
  authController.refresh.bind(authController)
);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Log out
 *     description: Invalidates active refresh token session.
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post(
  '/logout',
  authController.logout.bind(authController)
);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get logged-in user profile
 *     description: Returns profile details for the authenticated user session.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile details returned
 */
router.get(
  '/me',
  requireAuth,
  authController.getMe.bind(authController)
);

export default router;
