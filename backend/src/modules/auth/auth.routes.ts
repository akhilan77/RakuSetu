import { Router } from 'express';
import { authController } from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import { RequestOtpSchema, VerifyOtpSchema } from '../../validators/auth.validator.js';

const router = Router();

/**
 * @openapi
 * /auth/request-otp:
 *   post:
 *     summary: Request login OTP
 *     description: Triggers an SMS verification dispatch (rate limited to 3/hr per phone, 10/hr per IP).
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
 *     responses:
 *       200:
 *         description: OTP dispatched
 */
router.post('/request-otp', validate(RequestOtpSchema), authController.requestOtp.bind(authController));

/**
 * @openapi
 * /auth/verify-otp:
 *   post:
 *     summary: Verify login OTP
 *     description: Confirms verification and returns access + refresh tokens. Sets secure HttpOnly cookie.
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
router.post('/verify-otp', validate(VerifyOtpSchema), authController.verifyOtp.bind(authController));

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Generates new access and rotated refresh tokens.
 *     responses:
 *       200:
 *         description: Rotation successful
 */
router.post('/refresh', authController.refresh.bind(authController));

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Revokes the refresh token and clears cookie.
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authController.logout.bind(authController));

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get profile details
 *     description: Returns authenticated user record.
 *     responses:
 *       200:
 *         description: User profile payload
 */
router.get('/me', requireAuth, authController.me.bind(authController));

export default router;
