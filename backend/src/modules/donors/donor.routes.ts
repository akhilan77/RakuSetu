import { Router } from 'express';
import { donorController } from './donor.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import { CreateDonorValidator, UpdateDonorAvailabilityValidator } from '../../validators/donor.validator.js';
import { SearchDonorsValidator } from '../../validators/request.validator.js';

const router = Router();

/**
 * @openapi
 * /donors:
 *   post:
 *     summary: Register as donor
 *     description: Submits a donor profile details.
 *     responses:
 *       201:
 *         description: Registered successfully
 */
router.post('/', requireAuth, validate(CreateDonorValidator), donorController.register.bind(donorController));

/**
 * @openapi
 * /donors/availability:
 *   patch:
 *     summary: Toggle availability status
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/availability', requireAuth, validate(UpdateDonorAvailabilityValidator), donorController.updateAvailability.bind(donorController));

/**
 * @openapi
 * /donors/search:
 *   get:
 *     summary: Radius search donors
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', validate(SearchDonorsValidator), donorController.search.bind(donorController));

export default router;
