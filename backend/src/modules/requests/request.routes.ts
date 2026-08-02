import { Router } from 'express';
import { requestController } from './request.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import { CreateRequestValidator } from '../../validators/request.validator.js';

const router = Router();

/**
 * @openapi
 * /requests:
 *   post:
 *     summary: Create blood request
 *     description: Triggers a matching process sequence.
 *     responses:
 *       201:
 *         description: Request logged
 */
router.post('/', requireAuth, validate(CreateRequestValidator), requestController.create.bind(requestController));

/**
 * @openapi
 * /requests/{id}:
 *   get:
 *     summary: Get blood request details
 *     responses:
 *       200:
 *         description: Request details
 */
router.get('/:id', requireAuth, requestController.getById.bind(requestController));

export default router;
