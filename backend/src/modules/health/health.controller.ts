import { Request, Response } from 'express';
import { healthService } from './health.service.js';
import { ok } from '../../utils/response.js';
import { ErrorCode } from '../../constants/error-codes.js';

export class HealthController {
  async getLiveness(req: Request, res: Response) {
    const data = await healthService.checkLiveness();
    return ok(res, data);
  }

  async getReadiness(req: Request, res: Response) {
    const { healthy, details } = await healthService.checkReadiness();
    if (!healthy) {
      return res.status(503).json({
        success: false,
        error: {
          code: ErrorCode.INTERNAL_SERVER_ERROR,
          message: 'Service is not fully ready',
          details
        }
      });
    }
    return ok(res, details);
  }
}
export const healthController = new HealthController();
