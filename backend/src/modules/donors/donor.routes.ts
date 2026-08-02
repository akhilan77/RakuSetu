import { Router } from 'express';
import { donorController } from './donor.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

/**
 * @openapi
 * /donors:
 *   post:
 *     summary: Register as donor
 *     description: Creates a new donor profile for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - dob
 *               - gender
 *               - weight
 *               - bloodGroup
 *               - city
 *               - district
 *               - state
 *               - latitude
 *               - longitude
 *               - locationConsent
 *               - notificationConsent
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Jane Doe"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1995-04-15"
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *                 example: "FEMALE"
 *               weight:
 *                 type: number
 *                 example: 62.5
 *               bloodGroup:
 *                 type: string
 *                 enum: [A_POS, A_NEG, B_POS, B_NEG, AB_POS, AB_NEG, O_POS, O_NEG]
 *                 example: "O_POS"
 *               city:
 *                 type: string
 *                 example: "Vellore"
 *               district:
 *                 type: string
 *                 example: "Vellore District"
 *               state:
 *                 type: string
 *                 example: "Tamil Nadu"
 *               latitude:
 *                 type: number
 *                 example: 12.9272
 *               longitude:
 *                 type: number
 *                 example: 79.1304
 *               locationConsent:
 *                 type: boolean
 *                 example: true
 *               notificationConsent:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Donor profile registered successfully
 *       401:
 *         description: Authentication required
 *       409:
 *         description: Conflict - Profile already exists
 *       422:
 *         description: Validation failed
 */
router.post(
  '/',
  requireAuth,
  donorController.registerDonor.bind(donorController)
);

/**
 * @openapi
 * /donors/me:
 *   get:
 *     summary: Get current authenticated donor profile
 *     description: Returns the donor profile associated with the logged in user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Profile not found
 */
router.get(
  '/me',
  requireAuth,
  donorController.getMyProfile.bind(donorController)
);

/**
 * @openapi
 * /donors/me:
 *   patch:
 *     summary: Update donor profile
 *     description: Updates the editable fields of the authenticated donor's profile.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Profile not found
 */
router.patch(
  '/me',
  requireAuth,
  donorController.updateMyProfile.bind(donorController)
);

export default router;
